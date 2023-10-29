import autobind from 'autobind-decorator';

import qq from 'fineuploader';
import getConfigData from 'utils/get-config-data';
import {noop} from 'utils/noop';
import s3Configuration, {defaultMaxFileSize} from 'utils/s3-upload-configuration';

const udConfig = getConfigData();

export default class S3FineUploader {
    constructor(options) {
        const {bucketUrl, key, sizeLimit, acl} = options;

        this._onProgress = options.onProgress || noop;
        this._onError = options.onError || noop;
        this._onComplete = options.onComplete || noop;
        this.allowedExtensionsDotted = options.allowedExtensionsDotted || [];

        this._uploader = new qq.s3.FineUploaderBasic({
            ...s3Configuration,
            request: {
                endpoint: bucketUrl || udConfig.third_party.s3.asset.bucket_url,
                accessKey: key || udConfig.third_party.s3.asset.key,
            },
            validation: {
                itemLimit: 1,
                minSizeLimit: 1, // S3 responds with EntityTooSmall error for 0b files
                allowedExtensions: this.allowedExtensions, // Empty array means "allow everything".
                sizeLimit: sizeLimit || defaultMaxFileSize,
            },
            objectProperties: {
                acl,
            },
            callbacks: {
                onTotalProgress: this._onUploadProgress,
                onAllComplete: this._onUploadComplete,
                onError: this._onUploadError,
            },
        });
    }

    upload(file) {
        this._uploader.addFiles([file]);
        this._uploader.uploadStoredFiles();
    }

    cancel() {
        this._uploader.cancelAll();
        this._uploader.clearStoredFiles();
    }

    reset() {
        this._uploader.reset();
    }

    @autobind
    registerUploadCompleteHandler(callback) {
        this._onComplete = callback;
    }

    @autobind
    _onUploadComplete([id]) {
        const fileName = this._uploader.getName(id);
        const data = {
            id,
            key: this._uploader.getKey(id),
            uuid: this._uploader.getUuid(id),
            name: fileName,
            bucket: this._uploader.getBucket(id),
        };
        this._onComplete(data);
    }

    @autobind
    registerUploadErrorHandler(callback) {
        this._onError = callback;
    }

    @autobind
    _onUploadError(id, name, errorReason) {
        this._onError(id, name, errorReason);
    }

    @autobind
    registerUploadProgressHandler(callback) {
        this._onProgress = callback;
    }

    @autobind
    _onUploadProgress(totalUploadedBytes, totalBytes) {
        this._onProgress(totalUploadedBytes, totalBytes);
    }

    get allowedExtensions() {
        return this.allowedExtensionsDotted.map((extension) => {
            if (extension.startsWith('.')) {
                return extension.substring(1, extension.length);
            }

            return extension;
        });
    }
}
