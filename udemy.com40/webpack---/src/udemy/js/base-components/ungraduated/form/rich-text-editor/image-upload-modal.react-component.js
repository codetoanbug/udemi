import {getUniqueId} from '@udemy/design-system-utils';
import {withI18n, LocalizedHtml} from '@udemy/i18n';
import ImageIcon from '@udemy/icons/dist/image.ud-icon';
import {Modal} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {isBrowserFeatureAvailable} from './helpers';
import ImageUploadProgressBar from './image-upload-progress-bar.react-component';
import RichTextEditorModel from './rich-text-editor.mobx-model';

class ImageUploader extends Component {
    id = getUniqueId('rich-text-editor-image-uploader');

    render() {
        const {children, ...props} = this.props;
        return (
            <label htmlFor={this.id}>
                <input
                    {...props}
                    id={this.id}
                    type="file"
                    multiple={true}
                    accept="image/*"
                    className="ud-sr-only"
                />
                <span className="rt-image-uploader__label ud-link-underline">{children}</span>
            </label>
        );
    }
}

@observer
class ImageUploadModal extends Component {
    static propTypes = {
        doCommand: PropTypes.func.isRequired,
        model: PropTypes.instanceOf(RichTextEditorModel).isRequired,
        // gettext is provided by `withI18n`
        // eslint-disable-next-line react/require-default-props
        gettext: PropTypes.func,
    };

    @autobind
    onFileSelected(event) {
        const files = [...event.target.files];
        this.props.model.imageUploader.uploadAndInsertImages(files, this.props.doCommand);
    }

    @autobind
    onDragActive(event) {
        event.preventDefault();
        this.props.model.imageUploader.setIsDragActive(true);
    }

    @autobind
    onDragInactive(event) {
        event.preventDefault();
        this.props.model.imageUploader.setIsDragActive(false);
    }

    @autobind
    onDrop(event) {
        event.preventDefault();
        if (event.dataTransfer && event.dataTransfer.files) {
            const {doCommand, model} = this.props;
            const uploader = model.imageUploader;
            const files = [...event.dataTransfer.files];
            uploader.setIsDragActive(false);
            uploader.uploadAndInsertImages(files, doCommand);
        }
    }

    render() {
        const {model, gettext} = this.props;
        const uploader = model.imageUploader;
        const droppable = isBrowserFeatureAvailable('DROP_EVENT');
        const dragHandlers = droppable
            ? {
                  onDragEnter: this.onDragActive,
                  onDragOver: this.onDragActive,
                  onDragLeave: this.onDragInactive,
                  onDragEnd: this.onDragInactive,
                  onDrop: this.onDrop,
              }
            : {};
        const uploaderProps = {onChange: this.onFileSelected};
        return (
            <Modal
                className={classNames('udlite-in-udheavy rt-image-uploader', {
                    'rt-image-uploader--drag-active': droppable && uploader.isDragActive,
                })}
                isOpen={model.activeModal === 'IMAGE_UPLOAD'}
                onClose={model.closeModal}
                title={gettext('Upload an image')}
            >
                <form
                    className="rt-image-uploader__form"
                    data-purpose="image-upload-form"
                    {...dragHandlers}
                >
                    <ImageUploadProgressBar model={model} />
                    <div>
                        <ImageIcon label={false} className="rt-image-uploader__icon" />
                    </div>
                    {droppable ? (
                        <LocalizedHtml
                            html={gettext(
                                'Drag and drop an image or <a class="uploader">select a file</a>',
                            )}
                            interpolate={{
                                uploader: <ImageUploader {...uploaderProps} />,
                            }}
                        />
                    ) : (
                        <ImageUploader {...uploaderProps}>{gettext('Select a file')}</ImageUploader>
                    )}
                    {model.imageUploader.hasError ? (
                        <div
                            className="rt-image-uploader__error"
                            data-purpose="image-upload-form-error"
                        >
                            {model.imageUploader.errorMessage}
                        </div>
                    ) : null}
                </form>
            </Modal>
        );
    }
}

export default withI18n(ImageUploadModal);
