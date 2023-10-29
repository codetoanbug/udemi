import {withI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {Checkbox, FormGroup, TextArea} from '@udemy/react-form-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {wrapMathContent, unwrapMathContent} from './helpers';
import RichTextEditorModel from './rich-text-editor.mobx-model';

@observer
class MathModal extends Component {
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
        this.props.doCommand('ADD_MATH', {focusBeforeCommand: true});
    }

    @autobind
    onMathRepresentationChange(event) {
        this.props.model.mathForm.setMathRepresentation(wrapMathContent(event.target.value));
    }

    get unwrappedMathRepresentation() {
        const {model} = this.props;
        return unwrapMathContent(model.mathForm.mathRepresentation);
    }

    @autobind
    onIsInlineChange(event) {
        this.props.model.mathForm.setIsInline(event.target.checked);
    }

    render() {
        const {model, gettext} = this.props;
        const form = model.mathForm;
        return (
            <Modal
                isOpen={model.activeModal === 'MATH_MODAL'}
                onClose={model.closeModal}
                title={
                    form.isEditing
                        ? gettext('Edit math representation')
                        : gettext('Insert math representation')
                }
            >
                <form className="rt-modal-form" onSubmit={this.onSubmit} data-purpose="math-form">
                    <FormGroup label={gettext('Math representation in AsciiMath format')}>
                        <TextArea
                            style={{resize: 'none'}}
                            value={this.unwrappedMathRepresentation}
                            placeholder={gettext('Example: a/(1-a^2)')}
                            onChange={this.onMathRepresentationChange}
                            data-purpose="math-representation-field"
                        />
                    </FormGroup>
                    <Checkbox checked={form.isInline} onChange={this.onIsInlineChange}>
                        {gettext('Inline')}
                    </Checkbox>
                    <FooterButtons>
                        <Button
                            udStyle="ghost"
                            onClick={model.closeModal}
                            data-purpose="math-form-cancel"
                        >
                            {gettext('Cancel')}
                        </Button>
                        <Button type="submit" data-purpose="math-form-insert-update">
                            {form.isEditing ? gettext('Edit') : gettext('Insert')}
                        </Button>
                    </FooterButtons>
                </form>
            </Modal>
        );
    }
}

export default withI18n(MathModal);
