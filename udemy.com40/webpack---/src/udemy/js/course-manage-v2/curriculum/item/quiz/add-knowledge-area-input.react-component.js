import {Button} from '@udemy/react-core-components';
import {FormGroup, TextInput} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import TextInputWithAddons from 'base-components/ungraduated/form/text-input/text-input-with-addons.react-component';

import KnowledgeAreaFormFieldModel from './knowledge-area-form-field.mobx-model';
import {maxKnowledgeAreaLength} from './multiple-choice-assessment-form.mobx-model';
import './assessment-editor.less';

@observer
export default class AddKnowledgeAreaInput extends Component {
    static propTypes = {
        formField: PropTypes.instanceOf(KnowledgeAreaFormFieldModel).isRequired,
    };

    @autobind
    onChange(event) {
        this.props.formField.setToBeAddedOptionValue(event.target.value);
    }

    @autobind
    onKeyDown(event) {
        if (event.key === 'Enter') {
            // Add knowledge area instead of submitting form.
            event.preventDefault();
            this.props.formField.add();
        }
    }

    render() {
        return (
            <FormGroup
                styleName="new-knowledge-area"
                label={gettext('New Knowledge Area name')}
                labelProps={{className: 'ud-sr-only'}}
                data-purpose="add-knowledge-area"
            >
                <TextInputWithAddons>
                    <TextInput
                        value={this.props.formField.toBeAddedOptionValue}
                        onChange={this.onChange}
                        maxLength={maxKnowledgeAreaLength}
                        placeholder={gettext('New Knowledge Area name')}
                        onKeyDown={this.onKeyDown}
                    />
                    <TextInputWithAddons.Addon
                        componentClass={Button}
                        udStyle="secondary"
                        onClick={this.props.formField.add}
                    >
                        {gettext('Add')}
                    </TextInputWithAddons.Addon>
                </TextInputWithAddons>
            </FormGroup>
        );
    }
}
