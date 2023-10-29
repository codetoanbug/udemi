import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import {noop} from 'utils/noop';
import udStatApi from 'utils/ud-api-stat';
import S3FineUploader from 'utils/ud-s3fineuploader';

export default class FileUploaderS3Model extends S3FineUploader {
    @observable id = 0;
    @observable file = null;
    @observable error = '';
    @observable s3json = '';

    constructor(props = {}) {
        super({
            acl: 'private',
            allowedExtensionsDotted: [],
            sizeLimit: 10 * 1000 * 1000, // 10 mb
            ...props,
        });
        const {onUploadStarted, onUploadCanceled, onUploadCompleted, onUploadFailed} = props;
        this.onUploadStarted = onUploadStarted || noop;
        this.onUploadCanceled = onUploadCanceled || noop;
        this.onUploadCompleted = onUploadCompleted || noop;
        this.onUploadFailed = onUploadFailed || noop;

        this.registerUploadCompleteHandler(this.onFileUpload);
        this.registerUploadErrorHandler(this.onUploadError);
        this.registerUploadProgressHandler(this.updateFileProgress);
    }

    getValidationProps() {
        return this.error ? {validationState: 'error', note: this.error} : {};
    }

    @autobind
    @action
    clearFile() {
        this.file = null;
        this.error = '';
        this.reset();
    }

    @autobind
    @action
    onFileSelected(event) {
        const selectedFile = event.target.files[0];

        this.file = {
            name: selectedFile.name,
            progressPercentage: 0,
        };
        this.upload(selectedFile);
        this.onUploadStarted(this.id, selectedFile.name);
    }

    @autobind
    onChangeSelectedFile(event) {
        this.clearFile();
        this.onUploadCanceled(this.id, event.name);
    }

    @autobind
    @action
    onFileUpload(data) {
        const result = {
            key: data.key,
            uuid: data.uuid,
            name: data.name,
            bucket: data.bucket,
        };

        const s3json = JSON.stringify(result);
        this.onUploadCompleted(this.id, data.name, s3json, this.clearFile);
        ++this.id;
    }

    @autobind
    @action
    onUploadError(id, name, errorReason) {
        if (name) {
            // The uploader overwrites useful error messages like "file is too large"
            // with "No files to upload". We assume only the useful error messages have `name`.
            this.error = errorReason;
            this.onUploadFailed(id, name);
        }

        udStatApi.increment('s3_fine_uploader.upload.fail');
    }

    @autobind
    @action
    updateFileProgress(totalUploadedBytes, totalBytes) {
        if (this.file) {
            if (totalBytes === 0) {
                // This happens when file size exceeds sizeLimit.
                this.file.progressPercentage = 0;
            } else {
                this.file.progressPercentage = Math.round((totalUploadedBytes / totalBytes) * 100);
            }
        }
    }

    @autobind
    @action
    setS3Json(s3json) {
        this.s3json = s3json;
    }
}
