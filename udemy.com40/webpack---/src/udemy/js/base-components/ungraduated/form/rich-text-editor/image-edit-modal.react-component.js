import {withI18n} from '@udemy/i18n';
import {Image, Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FormGroup, TextInput} from '@udemy/react-form-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {isMobileBrowser} from 'utils/user-agent/get-is-mobile-browser';

import RichTextEditorModel from './rich-text-editor.mobx-model';

@observer
class ImageEditModal extends Component {
    static propTypes = {
        doCommand: PropTypes.func.isRequired,
        hasAnchorFeatures: PropTypes.bool.isRequired,
        model: PropTypes.instanceOf(RichTextEditorModel).isRequired,
        // gettext is provided by withI18n; do not pass it
        // eslint-disable-next-line react/require-default-props
        gettext: PropTypes.func,
    };

    @autobind
    onChangeTextField(event) {
        this.props.model.imageEditForm.setData(event.target.name, event.target.value);
    }

    @autobind
    onSubmit(event) {
        event.stopPropagation();
        event.preventDefault();
        this.props.doCommand('EDIT_IMAGE', {focusBeforeCommand: true});
    }

    @autobind
    onDelete() {
        this.props.doCommand('DELETE_IMAGE');
    }

    renderContent() {
        const {hasAnchorFeatures, model, gettext} = this.props;
        const form = model.imageEditForm;
        return (
            <div className="rt-image-edit-modal__content">
                <div className="rt-image-edit-modal__img">
                    <Image
                        src={form.data.src}
                        alt={form.data.alt}
                        data-purpose="src-field"
                        lazy={false}
                        height="unset"
                        width="unset"
                    />
                </div>
                <div className="rt-flex">
                    <FormGroup
                        label={gettext('Title')}
                        note={form.error.alt || null}
                        validationState={form.error.alt ? 'error' : 'neutral'}
                    >
                        <TextInput
                            data-dialog-auto-focus={!isMobileBrowser}
                            name="alt"
                            value={form.data.alt}
                            onChange={this.onChangeTextField}
                            data-purpose="alt-field"
                        />
                    </FormGroup>
                    <FormGroup
                        label={gettext('Caption')}
                        note={form.error.caption || null}
                        validationState={form.error.caption ? 'error' : 'neutral'}
                    >
                        <TextInput
                            name="caption"
                            value={form.data.caption}
                            onChange={this.onChangeTextField}
                            data-purpose="caption-field"
                        />
                    </FormGroup>
                    {/* Don't use `type="url"`. We don't want to require URL scheme. We default to http. */}
                    {hasAnchorFeatures ? (
                        <FormGroup
                            label={gettext('Link')}
                            note={form.error.href || null}
                            validationState={form.error.href ? 'error' : 'neutral'}
                        >
                            <TextInput
                                name="href"
                                value={form.data.href}
                                onChange={this.onChangeTextField}
                                data-purpose="href-field"
                            />
                        </FormGroup>
                    ) : null}
                </div>
            </div>
        );
    }

    render() {
        const {model, gettext} = this.props;
        return (
            <Modal
                className="udlite-in-udheavy"
                isOpen={model.activeModal === 'IMAGE_EDIT'}
                onClose={model.closeModal}
                title={gettext('Edit')}
            >
                <form
                    className="rt-modal-form"
                    onSubmit={this.onSubmit}
                    data-purpose="image-edit-form"
                >
                    {this.renderContent()}
                    <FooterButtons>
                        <Button
                            udStyle="secondary"
                            onClick={this.onDelete}
                            data-purpose="delete-image-btn"
                        >
                            {gettext('Delete')}
                        </Button>
                        <div className="rt-flex" />
                        <Button
                            udStyle="ghost"
                            onClick={model.closeModal}
                            data-purpose="image-edit-form-cancel"
                        >
                            {gettext('Cancel')}
                        </Button>
                        <Button type="submit">{gettext('Save')}</Button>
                    </FooterButtons>
                </form>
            </Modal>
        );
    }
}

export default withI18n(ImageEditModal);
