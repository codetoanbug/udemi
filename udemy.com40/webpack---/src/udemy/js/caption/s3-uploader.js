import autobind from 'autobind-decorator';

import qq from 'fineuploader';
import {noop} from 'utils/noop';
import s3Configuration, {defaultMaxFileSize} from 'utils/s3-upload-configuration';
import udApi from 'utils/ud-api';
import udStatApi from 'utils/ud-api-stat';

import {
    BASE_PROCESS_PERCENTAGES,
    CAPTION_ERROR_TYPES,
    CAPTION_EXTENSIONS,
    CAPTION_STATUS_CHOICES,
    CAPTION_TYPES,
} from './constants';
import validateWebVTT from './vtt-file-validator';

export function captionsUrl(courseId, assetId, captionId = '', captionType = CAPTION_TYPES.DRAFT) {
    if (!Object.values(CAPTION_TYPES).includes(captionType)) {
        throw new Error(`${captionType} is not a valid caption type.`);
    }
    const resources = {
        [CAPTION_TYPES.PUBLISHED]: 'captions',
        [CAPTION_TYPES.DRAFT]: 'draft-captions',
        [CAPTION_TYPES.CROWDSOURCED]: 'crowdsourced-captions',
    };
    const resource = resources[captionType];
    let url = `/courses/${courseId}/assets/${assetId}/${resource}/`;
    if (captionId) {
        url += `${captionId}/`;
    }
    return url;
}

export default class S3Uploader {
    _uploader;
    filesInfo = {};

    constructor(courseId, options, getCaptionData, captionType = CAPTION_TYPES.DRAFT) {
        const {acl, bucketUrl, key, sizeLimit} = options;

        this.courseId = courseId;

        this.getCaptionData = getCaptionData || noop;

        this.captionType = captionType;

        this._uploader = new qq.s3.FineUploaderBasic({
            ...s3Configuration,
            autoLoad: true,
            request: {
                endpoint: bucketUrl,
                accessKey: key,
            },
            validation: {
                itemLimit: 10,
                minSizeLimit: 1,
                allowedExtensions: CAPTION_EXTENSIONS,
                sizeLimit: sizeLimit || defaultMaxFileSize,
            },
            objectProperties: {
                acl,
            },
            callbacks: {
                onUpload: (id, fileName) => {
                    // Blobs don't have a filename, setting it on the Blob object works for us so
                    // we can read its name because it is just an object key. However it is not an
                    // "actual" filename. This will set the name of the Blob to persist during
                    // the upload process.
                    if (this.filesInfo.fileName !== fileName) {
                        this._uploader.setName(id, this.filesInfo.current);
                        // Allow for simultaneous file uploads
                        this.filesInfo.current = null;
                    }
                },
                onProgress: this._onProgress,
                onAllComplete: this._onUploadComplete,
                onError: this._onError,
            },
        });
    }

    validate(file, videoLength) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = (ev) => {
                try {
                    validateWebVTT(ev.target.result, {
                        // We pass the video length so that we can see if the last cue is not after the end of the video
                        video_length: videoLength,
                    });
                    resolve();
                    udStatApi.increment('web_file_uploader.upload.validation_success');
                } catch (e) {
                    if (e.name === 'ValidationError') {
                        reject(e);
                        udStatApi.increment('web_file_uploader.upload.validation_fail', {
                            type: e.code,
                        });
                    } else {
                        throw e;
                    }
                }
            };
            fileReader.readAsText(file);
        });
    }

    upload(file, asset, locale, callbacks) {
        const fileName = file.name;
        const isEdit = file.isEdit;
        if (this.filesInfo[fileName] || this.filesInfo.current) {
            // Very rare edge scenario when the user is upload twice the same
            // file at the same time.
            callbacks.onError({
                message: '', // in this those cases we show just a title in the error.
                type: CAPTION_ERROR_TYPES.NAME_COLLISION,
            });
            udStatApi.increment('web_file_uploader.upload.fail');
            return;
        }
        this.filesInfo.current = fileName;
        this.filesInfo[fileName] = {
            assetId: asset.id,
            locale,
            callbacks,
            isEdit,
        };
        this._setProgress(fileName, BASE_PROCESS_PERCENTAGES.INITIAL);
        this.validate(file, asset.time_estimation)
            .then(() => {
                this._uploader.addFiles(file);
            })
            .catch((error) => {
                const {block, translated: message, code} = error;
                callbacks.onError({
                    block,
                    message,
                    code,
                    type: CAPTION_ERROR_TYPES.VALIDATION,
                });
                this._clean(null, fileName);
            });
    }

    _clean(id, fileName) {
        if (this._isValidId(id)) {
            this._uploader.cancel(id);
        }
        this.filesInfo.current = null;
        this.filesInfo[fileName] = null;
    }

    _isValidId(id) {
        return id !== null;
    }

    _setProgress(fileName, progress) {
        this.filesInfo[fileName].callbacks.onProgress(progress);
    }

    @autobind
    _onError(id, fileName) {
        // real signature _onError(id, fileName, err)
        if (!this._isValidId(id)) {
            return false;
        }
        const fileInfo = this.filesInfo[fileName];
        fileInfo.callbacks.onError({
            message: '', // in this those cases we show just a title in the error.
            type: CAPTION_ERROR_TYPES.UPLOAD,
        });

        udStatApi.increment('web_file_uploader.upload.fail');
    }

    @autobind
    _onProgress(id, fileName, loaded, total) {
        if (!this._isValidId(id)) {
            return false;
        }
        let percent = 0;
        if (total > 0) {
            percent = Math.round((loaded / total) * BASE_PROCESS_PERCENTAGES.UPLOADING);
        }
        percent += BASE_PROCESS_PERCENTAGES.INITIAL;
        this._setProgress(fileName, percent);
    }

    refreshCaptionStatus(id, captionId, iteration = 0) {
        const fileName = this._uploader.getName(id);
        const fileInfo = this.filesInfo[fileName];
        const captionParams = {
            params: {
                'fields[draft_caption]': 'status,published_caption_id',
            },
        };
        const url = captionsUrl(this.courseId, fileInfo.assetId, captionId, this.captionType);
        return udApi
            .get(url, captionParams)
            .then((response) => {
                const status = response.data.status;
                const publishedCaptionId = response.data.published_caption_id;
                if (status === CAPTION_STATUS_CHOICES.FAILED) {
                    this._onError(id, fileName);
                } else if (
                    [
                        CAPTION_STATUS_CHOICES.PROCESSING,
                        CAPTION_STATUS_CHOICES.UNPROCESSED,
                    ].includes(status)
                ) {
                    const newIteration = Math.min(16, ++iteration); // more than a hour...
                    const interval = Math.pow(2, newIteration) * 1000;
                    setTimeout(() => {
                        this.refreshCaptionStatus(id, captionId, iteration);
                    }, interval);
                } else if (status === CAPTION_STATUS_CHOICES.SUCCESS) {
                    fileInfo.callbacks.onProcessComplete(status, publishedCaptionId);
                    udStatApi.increment('web_file_uploader.upload.processed');
                    this._clean(id, fileName);
                }
            })
            .catch((err) => {
                this._onError(id, fileName, err);
                this._clean(id, fileName);
            });
    }

    @autobind
    _onUploadComplete([id]) {
        if (!this._isValidId(id)) {
            return false;
        }

        const fileName = this._uploader.getName(id);
        const fileInfo = this.filesInfo[fileName];
        const data = {
            locale_id: fileInfo.locale,
            asset: fileInfo.assetId,
            file_name: this._uploader.getKey(id),
            uuid: this._uploader.getUuid(id),
            title: fileName,
            bucket: this._uploader.getBucket(id),
        };

        // We set is explicitly so we don't send is_edit=(false|undefined) with every normal upload.
        if (fileInfo.isEdit) {
            data.is_edit = true;
        }

        Object.assign(data, this.getCaptionData());

        const captionParams = {
            params: {
                'fields[draft_caption]':
                    'locale,title,url,source,status,confidence_threshold,modified,is_edit,is_edit_of_autocaption',
                'fields[locale]': 'title',
            },
        };

        this._setProgress(
            fileName,
            BASE_PROCESS_PERCENTAGES.UPLOADING + BASE_PROCESS_PERCENTAGES.INITIAL,
        );
        udStatApi.increment('web_file_uploader.upload.completed');

        return udApi
            .post(
                captionsUrl(this.courseId, fileInfo.assetId, undefined, this.captionType),
                data,
                captionParams,
            )
            .then((response) => {
                this._setProgress(fileName, 100);
                fileInfo.callbacks.onUploadComplete(response.data);
                this.refreshCaptionStatus(id, response.data.id);
            })
            .catch((err) => {
                this._onError(id, fileName, err);
                this._clean(id, fileName);
            });
    }
}
