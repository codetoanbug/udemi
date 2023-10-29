import autobind from 'autobind-decorator';
import axios, {CancelToken, isCancel} from 'axios';
import {action, computed, observable} from 'mobx';

import udApi from 'utils/ud-api';
import udApiStat from 'utils/ud-api-stat';
import Raven from 'utils/ud-raven';

import {MB, MAX_FILE_SIZE_IN_MB, MAX_FILE_SIZE_IN_BYTES} from './constants';

const ERROR_METRIC = 'rich_text_editor.upload.failed';

export default class ImageUploaderModel {
    @observable files = [];
    @observable error = {};
    @observable isDragActive = false;
    _cancelSource = null;

    constructor(context, {gettext}) {
        this.context = context;
        this.gettext = gettext;
    }

    @computed
    get hasError() {
        return Object.keys(this.error).length > 0;
    }

    @computed
    get errorMessage() {
        const gettext = this.gettext;
        const codes = Object.values(this.error);
        let i, code;
        for (i = 0; i < codes.length; i++) {
            code = codes[i];
            if (code === 'UPLOAD_FAILURE') {
                return gettext('An error occurred uploading your file. Please try again later.');
            }
            if (code === 'INVALID_IMAGE') {
                return interpolate(
                    gettext(
                        'Images must be in .jpg, .png, or .gif format and smaller than ' +
                            '%(fileSizeInMegaBytes)smb',
                    ),
                    {fileSizeInMegaBytes: MAX_FILE_SIZE_IN_MB},
                    true,
                );
            }
        }
        return '';
    }

    /**
     * Returns null if no files have been uploaded.
     * Otherwise, returns the percent of total bytes that have loaded.
     */
    @computed
    get progressPercentage() {
        let totalLoaded = 0;
        let totalSize = 0;
        this.files.forEach((file) => {
            totalLoaded += file.loaded;
            totalSize += file.size;
        });
        return totalSize === 0 ? null : Math.round((totalLoaded / totalSize) * 100);
    }

    _addError(index, errorCode) {
        this.error = {
            ...this.error,
            [index]: errorCode,
        };
    }

    @action
    setIsDragActive(value) {
        this.isDragActive = value;
    }

    uploadAndInsertImages(rawFiles, doCommand) {
        this._uploadToS3(rawFiles)
            .then(() => {
                doCommand('ADD_IMAGE', {focusBeforeCommand: true});
            })
            .catch((e) => {
                Raven.captureException(e);
            });
    }

    @action
    _uploadToS3(rawFiles) {
        const files = rawFiles.map((file) => {
            return {
                name: file.name,
                loaded: 0,
                size: file.size,
                type: file.type,
                url: '',
            };
        });
        this.error = {};
        this.files = files;
        this._cancelSource = CancelToken.source();
        return Promise.all(
            this.files.map((file, index) => {
                // This method shouldn't return a rejected promise, as it causes the entire
                // Promise.all to reject, which means we won't be able to render any images even if
                // only one of them fails to upload. Instead, set an error code on
                // `this.error[index]`. The caller of this method can then check `this.error` to
                // determine which files failed to upload.
                this._validateFile(file, index);
                if (this.error[index]) {
                    return Promise.resolve();
                }
                return udApi
                    .get('/s3-rich-text-upload-urls/', {
                        cancelToken: this._cancelSource.token,
                        params: {
                            name: file.name,
                            type: file.type,
                            context: this.context.toLowerCase(),
                        },
                    })
                    .then((response) => {
                        const s3ImageURL = decodeURIComponent(response.data);
                        return axios
                            .put(s3ImageURL, rawFiles[index], {
                                cancelToken: this._cancelSource.token,
                                headers: {'Content-Type': file.type, 'x-amz-acl': 'public-read'},
                                onUploadProgress: action((progressEvent) => {
                                    file.loaded = progressEvent.loaded;
                                    file.size = progressEvent.total;
                                }),
                            })
                            .then(
                                action(() => {
                                    file.loaded = file.size;
                                    file.url = s3ImageURL.split('?')[0];
                                }),
                            );
                    })
                    .catch(
                        action((err) => {
                            if (!isCancel(err)) {
                                this._addError(index, 'UPLOAD_FAILURE');
                            }
                        }),
                    );
            }),
        );
    }

    _validateFile(file, index) {
        const isImageType = file.type.startsWith('image');
        const size = file.size;
        if (!isImageType || size > MAX_FILE_SIZE_IN_BYTES) {
            this._addError(index, 'INVALID_IMAGE');
        }
        if (!isImageType) {
            udApiStat.increment(ERROR_METRIC, {error: 'not-image'});
        } else if (size > 30 * MB && size <= 50 * MB) {
            udApiStat.increment(ERROR_METRIC, {error: 'size-30-50mbs'});
        } else if (size > 50 * MB && size <= 100 * MB) {
            udApiStat.increment(ERROR_METRIC, {error: 'size-50-100mbs'});
        } else if (size > 100 * MB) {
            udApiStat.increment(ERROR_METRIC, {error: 'size->100mbs'});
        }
    }

    @autobind
    @action
    resetFiles() {
        this.files = [];
        if (this._cancelSource) {
            this._cancelSource.cancel();
        }
    }

    @autobind
    @action
    resetError() {
        this.error = {};
    }
}
