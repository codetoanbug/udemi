import {FormGroup, TextInputContainer, TextInput, Radio} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import ItemIconButton from '../item-icon-button.react-component';
import KnowledgeAreaFormFieldModel from './knowledge-area-form-field.mobx-model';
import MultipleChoiceAssessmentFormModel, {
    maxKnowledgeAreaLength,
} from './multiple-choice-assessment-form.mobx-model';
import './assessment-editor.less';

@observer
export default class KnowledgeArea extends Component {
    static propTypes = {
        form: PropTypes.instanceOf(MultipleChoiceAssessmentFormModel).isRequired,
        formField: PropTypes.instanceOf(KnowledgeAreaFormFieldModel).isRequired,
        index: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
    };

    @autobind
    onChange(event) {
        this.props.formField.editAtIndex(this.props.index, event.target.value);
    }

    @autobind
    onCheckedChange(event) {
        if (event.target.checked) {
            this.props.form.setField('selectedKnowledgeAreaIndex', this.props.index);
        }
    }

    @autobind
    onConfirmAndDelete() {
        this.props.formField.markAsToBeDeleted(this.props.index);
    }

    render() {
        const isEmpty = !this.props.value && this.props.index === -1;
        return (
            <div className="item-icon-button-trigger" styleName="knowledge-area">
                <Radio
                    size="large"
                    checked={this.props.index === this.props.form.data.selectedKnowledgeAreaIndex}
                    data-purpose="knowledge-area-option-toggle"
                    onChange={this.onCheckedChange}
                >
                    <span className="ud-sr-only">{gettext('Knowledge Area name')}</span>
                </Radio>
                <div styleName="flex">
                    <FormGroup
                        label={gettext('Knowledge Area name')}
                        labelProps={{className: 'ud-sr-only'}}
                    >
                        <TextInputContainer>
                            <TextInput
                                value={this.props.value || ''}
                                onChange={!isEmpty ? this.onChange : null}
                                data-purpose="knowledge-area-option-input"
                                maxLength={maxKnowledgeAreaLength}
                                placeholder={this.props.value ? '' : gettext('No Knowledge Area')}
                                readOnly={isEmpty}
                            />
                            {this.props.value ? (
                                <ItemIconButton
                                    iconType="delete"
                                    iconProps={{size: 'small'}}
                                    data-purpose="knowledge-area-option-delete"
                                    onClick={this.onConfirmAndDelete}
                                    styleName="knowledge-area-delete"
                                />
                            ) : null}
                        </TextInputContainer>
                    </FormGroup>
                </div>
            </div>
        );
    }
}
