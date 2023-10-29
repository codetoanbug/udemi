import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import S3FineUploader from 'utils/ud-s3fineuploader';

export default class BulkQuestionUploaderModel extends S3FineUploader {
    @observable file = null;
    @observable error = '';

    constructor() {
        super({
            acl: 'private',
            allowedExtensionsDotted: ['.csv'],
            sizeLimit: 10 * 1000 * 1000, // 10 mb
        });
        /*
        in case this configuration is updated (allowed extensions and bucket),
        please also check udemy.quiz.question_importer.BulkQuestionImporter._read_and_delete_file_content_from_s3
         */
        this.registerUploadProgressHandler(this._updateFileProgress);
    }

    @action
    setFile(filename) {
        this.file = {
            name: filename,
            progressPercentage: 0,
        };
    }

    @action
    setError(value) {
        this.error = value;
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
    _updateFileProgress(totalUploadedBytes, totalBytes) {
        if (this.file) {
            if (totalBytes === 0) {
                // This happens when file size exceeds sizeLimit.
                this.file.progressPercentage = 0;
            } else {
                this.file.progressPercentage = Math.round((totalUploadedBytes / totalBytes) * 100);
            }
        }
    }
}
