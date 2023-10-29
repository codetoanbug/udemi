import {FormGroup, FileUploader} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import udLink from 'utils/ud-link';

import CurriculumQuizModel from './curriculum-quiz.mobx-model';
import './bulk-question-uploader.less';

@observer
export default class BulkQuestionUploader extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumQuizModel).isRequired,
        onUploadComplete: PropTypes.func.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.uploader.registerUploadCompleteHandler(this.props.onUploadComplete);
        this.uploader.registerUploadErrorHandler(this.onUploadError);
    }

    get uploader() {
        return this.props.curriculumItem.bulkQuestionUploader;
    }

    @autobind
    onUploadError(id, name, errorReason) {
        if (name) {
            // The uploader overwrites useful error messages like "file is too large"
            // with "No files to upload". We assume only the useful error messages have `name`.
            this.uploader.setError(errorReason);
        }
    }

    @autobind
    onFileSelected(event) {
        const selectedFile = event.target.files[0];
        this.uploader.setFile(selectedFile.name);
        this.uploader.upload(selectedFile);
    }

    render() {
        return (
            <div styleName="container" data-purpose="bulk-question-uploader">
                <div className="ud-heading-md">{gettext('Bulk Question Uploader')}</div>
                <div
                    className="ud-text-with-links"
                    styleName="description"
                    {...safelySetInnerHTML({
                        descriptionOfCaller:
                            'bulk-question-uploader:link-to-practice-test-template',
                        html: interpolate(
                            gettext(
                                'The Bulk Question Uploader allows you to upload an existing set of questions ' +
                                    'into a Udemy Practice Test. To use the uploader, first download ' +
                                    '<a href="%(url)s" download>Udemy\'s Practice Test Question Template</a>, and ' +
                                    'format your questions according to the document. Once finished, return to ' +
                                    'this page and upload your file.',
                            ),
                            {
                                url: udLink.toStorageStaticAsset(
                                    'instructor/manage/PracticeTestBulkQuestionUploadTemplate.csv',
                                ),
                            },
                            true,
                        ),
                    })}
                />
                <div className="ud-text-bold" styleName="disclaimer">
                    {gettext(
                        'The Bulk Question Uploader does NOT support image uploads - to add images ' +
                            'into questions, first upload them using the uploader, then edit the ' +
                            'questions inside of the Curriculum Editor.',
                    )}
                </div>
                <FormGroup
                    label={gettext('Upload CSV File')}
                    labelProps={{className: 'ud-sr-only'}}
                    validationState={this.uploader.error ? 'error' : 'neutral'}
                    note={this.uploader.error || null}
                >
                    <FileUploader
                        allowedExtensionsDotted={this.uploader.allowedExtensionsDotted}
                        disabled={this.props.curriculumItem.isSaving}
                        onChange={this.onFileSelected}
                        onChangeSelectedFile={this.uploader.clearFile}
                        progressPercentage={
                            this.uploader.file ? this.uploader.file.progressPercentage : null
                        }
                        purpose="bulk-question-uploader-input"
                        uploadLabel={gettext('Upload CSV File')}
                    />
                </FormGroup>
            </div>
        );
    }
}
