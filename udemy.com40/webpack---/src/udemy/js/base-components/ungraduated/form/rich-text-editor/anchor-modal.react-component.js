import {withI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
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
export class AnchorModalBase extends Component {
    static propTypes = {
        doCommand: PropTypes.func.isRequired,
        model: PropTypes.instanceOf(RichTextEditorModel).isRequired,
        // eslint-disable-next-line react/require-default-props
        gettext: PropTypes.func,
    };

    @autobind
    onSubmit(event) {
        event.stopPropagation();
        event.preventDefault();
        this.props.doCommand('ADD_ANCHOR', {focusBeforeCommand: true});
    }

    @autobind
    onChangeTextField(event) {
        this.props.model.anchorForm.setData(event.target.name, event.target.value);
    }

    render() {
        const {model} = this.props;
        const form = model.anchorForm;
        return (
            <Modal
                className="udlite-in-udheavy"
                isOpen={model.activeModal === 'ANCHOR'}
                onClose={model.closeModal}
                title={
                    form.isEditing
                        ? this.props.gettext('Edit link')
                        : this.props.gettext('Insert link')
                }
            >
                <form className="rt-modal-form" onSubmit={this.onSubmit} data-purpose="anchor-form">
                    <FormGroup
                        label={this.props.gettext('URL')}
                        note={form.error.href || null}
                        validationState={form.error.href ? 'error' : 'neutral'}
                    >
                        {/* Don't use `type="url"`. We don't want to require URL scheme. We default to http. */}
                        <TextInput
                            data-dialog-auto-focus={!isMobileBrowser}
                            required={true}
                            name="href"
                            value={form.data.href}
                            onChange={this.onChangeTextField}
                            data-purpose="href-field"
                        />
                    </FormGroup>
                    <FormGroup
                        label={this.props.gettext('Text')}
                        note={form.error.text || null}
                        validationState={form.error.text ? 'error' : 'neutral'}
                    >
                        <TextInput
                            name="text"
                            value={form.data.text}
                            onChange={this.onChangeTextField}
                            data-purpose="text-field"
                        />
                    </FormGroup>
                    <FooterButtons>
                        <Button
                            udStyle="ghost"
                            onClick={model.closeModal}
                            data-purpose="anchor-form-cancel"
                        >
                            {this.props.gettext('Cancel')}
                        </Button>
                        <Button type="submit">{this.props.gettext('Insert')}</Button>
                    </FooterButtons>
                </form>
            </Modal>
        );
    }
}

const AnchorModal = withI18n(AnchorModalBase);

export default AnchorModal;
