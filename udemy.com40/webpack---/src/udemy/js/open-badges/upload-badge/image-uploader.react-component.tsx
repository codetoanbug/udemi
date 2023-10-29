import {Tracker} from '@udemy/event-tracking';
import {Button, Image} from '@udemy/react-core-components';
import {FileUploader, FormGroup} from '@udemy/react-form-components';
import classNames from 'classnames';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';

import Raven from 'utils/ud-raven';

import {BadgeAssertionImportFailureMessagePresented} from '../events/badge-assertion-import-failure-message-presented';
import {BadgeAssertionImported} from '../events/badge-assertion-imported';
import {BakedBadgeParsingError, parsePNGFile, parseSVGFile} from './image-parser-utils';
import {UploadBadgeStore} from './upload-badge.mobx-store';
import styles from './uploader.less';

interface ImageUploaderProps {
    store: UploadBadgeStore;
}

@observer
export class ImageUploader extends React.Component<ImageUploaderProps> {
    @observable file: any = null;
    @observable uploadProgress?: number;

    @computed
    get inputFileLabel() {
        return this.file ? this.file.name : gettext('Upload badge image');
    }

    allowedFileExtensions = ['.png', '.svg'];

    @action
    setFile = (file: any) => {
        this.file = file;
    };

    @action
    setUploadProgress = (progress?: number) => {
        this.uploadProgress = progress;
    };

    onFileSelected = (event: any) => {
        const selectedFile = event.target.files[0];
        this.setFile(selectedFile);
        this.props.store.setErrorMessage(undefined);
        /*
        This is a temporary hack, we will have refreshed designs anyway.
        Since we are not actually uploading the file, but we need the
        `progressPercentage` which is used by the uploader component to
        determine if the option to change the file is to be rendered or not.
         */
        this.setUploadProgress(100);
    };

    onChangeSelectedFile = () => {
        this.setFile(null);
        this.setUploadProgress();
        this.props.store.setErrorMessage(undefined);
    };

    parseFileMetadata = async () => {
        if (!this.file) {
            throw new Error(gettext('Please select a file'));
        }
        if (this.file.type === 'image/svg+xml') {
            return parseSVGFile(this.file);
        }
        if (this.file.type === 'image/png') {
            return parsePNGFile(this.file);
        }
    };

    onFormSubmit = async (event: any) => {
        event.preventDefault();
        const {store} = this.props;
        try {
            const assertionVerificationUrl = await this.parseFileMetadata();
            if (assertionVerificationUrl) {
                await store.validateBadgeAssertion(assertionVerificationUrl);
            }
            if (
                store.expectedBadgeClassId &&
                store.expectedBadgeClassId !== store.assertion?.badgeClass.id
            ) {
                store.setUploadedBadgeNoMatchModalOpen(true);
            } else {
                store.setUploadedBadgeSuccessModalOpen(true);
            }
            store.setUploadBadgeModalOpen(false);
            Tracker.publishEvent(
                new BadgeAssertionImported({name: store.assertion?.badgeClass.name ?? ''}),
            );
        } catch (error) {
            // TODO: handle error state once designs are ready
            Raven.captureException(error.message);
            let errMsg = error.message;
            if (error instanceof BakedBadgeParsingError) {
                errMsg = gettext(
                    'Badge image import failed due to an invalid or unsupported image. Please upload a different image to resolve this issue.',
                );
            }
            this.props.store.setErrorMessage(errMsg);
            Tracker.publishEvent(new BadgeAssertionImportFailureMessagePresented());
        }
    };

    onFormCancel = () => {
        const {store} = this.props;
        store.setUploadBadgeModalOpen(false);
    };

    render() {
        return (
            <FormGroup
                label={gettext('Badge image:')}
                onSubmit={this.onFormSubmit}
                className={classNames(styles['upload-badge-modal-body-image-form'])}
            >
                <FileUploader
                    allowedExtensionsDotted={this.allowedFileExtensions}
                    name={'badge-image'}
                    uploadLabel={gettext('Select image')}
                    noSelectedFileLabel={this.inputFileLabel}
                    progressPercentage={this.uploadProgress}
                    uploadCompletedLabel={gettext('Change')}
                    onChange={this.onFileSelected}
                    onChangeSelectedFile={this.onChangeSelectedFile}
                    purpose={'badge-image'}
                    required={true}
                />
                {this.file && (
                    <div
                        className={classNames(styles['upload-badge-modal-body-image-preview'])}
                        data-purpose={'upload-badge-image-preview'}
                    >
                        <Image
                            className={classNames(styles['uploaded-badge-image-preview'])}
                            alt={this.file.name}
                            src={URL.createObjectURL(this.file)}
                        />
                        <span className={'ud-text-md'}>{this.file.name}</span>
                    </div>
                )}
                <div className={classNames(styles['upload-badge-modal-buttons'])}>
                    <Button
                        onClick={this.onFormCancel}
                        udStyle={'ghost'}
                        className={classNames('ud-link-neutral')}
                    >
                        {gettext('Cancel')}
                    </Button>
                    <Button onClick={this.onFormSubmit}>{gettext('Validate and upload')}</Button>
                </div>
            </FormGroup>
        );
    }
}
