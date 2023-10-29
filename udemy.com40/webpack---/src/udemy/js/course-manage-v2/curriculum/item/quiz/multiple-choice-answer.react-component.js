import {TextInputWithCounter, Checkbox, FormGroup, Radio} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {htmlToText} from 'base-components/ungraduated/form/rich-text-editor/helpers';
import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';

import {assessmentTypes} from '../constants';
import ItemIconButton from '../item-icon-button.react-component';
import MultipleChoiceAssessmentFormModel, {
    maxAnswerLength,
    maxFeedbackLength,
    maxNumOfAnswers,
} from './multiple-choice-assessment-form.mobx-model';
import './assessment-editor.less';

@observer
export default class MultipleChoiceAnswer extends Component {
    static propTypes = {
        form: PropTypes.instanceOf(MultipleChoiceAssessmentFormModel).isRequired,
        index: PropTypes.number.isRequired,
        option: PropTypes.object.isRequired,
        showFeedback: PropTypes.bool.isRequired,
    };

    @autobind
    onFocus() {
        this.props.form.focusOnAnswerOption(this.props.index);
        const numAnswers = this.props.form.data.answerOptions.length;
        if (this.props.index === numAnswers - 1 && numAnswers < maxNumOfAnswers) {
            this.props.form.addAnswerOption('', '', false);
        }
    }

    @autobind
    onChange(value) {
        this.props.form.setAnswerOptionValue(this.props.option, value);
    }

    @autobind
    onCheckedChange() {
        this.props.form.setAnswerOptionChecked(this.props.option, !this.props.option.checked);
    }

    @autobind
    onFeedbackChange(event) {
        this.props.form.setAnswerOptionFeedback(this.props.option, event.target.value);
    }

    @autobind
    onDelete() {
        this.props.form.deleteAnswerOptionAtIndex(this.props.index);
    }

    render() {
        const {form, index, option, showFeedback} = this.props;
        const Toggle = form.type === assessmentTypes.multipleChoice ? Radio : Checkbox;
        const isTooLong = htmlToText(option.value).length > maxAnswerLength;
        const label = interpolate(
            gettext('Answer %(answerNumber)s'),
            {answerNumber: index + 1},
            true,
        );
        return (
            <div className="item-icon-button-trigger" styleName="answer-option">
                <div styleName="answer-option-toggle-wrapper">
                    <Toggle
                        size="large"
                        checked={option.checked}
                        onChange={this.onCheckedChange}
                        data-purpose="answer-option-toggle"
                    >
                        <span className="ud-sr-only">{label}</span>
                    </Toggle>
                </div>
                <div styleName="flex">
                    <FormGroup
                        label={label}
                        labelProps={{className: 'ud-sr-only'}}
                        styleName={classNames({
                            'answer-option-inactive': form.focusedAnswerOptionIndex !== index,
                        })}
                        note={isTooLong ? gettext('This answer is too long') : null}
                        validationState={isTooLong ? 'error' : 'neutral'}
                    >
                        <RichTextEditor
                            theme={RichTextEditor.THEMES.QUIZ_ANSWER}
                            placeholder={gettext('Add an answer.')}
                            value={option.value}
                            onValueChange={this.onChange}
                            onFocus={this.onFocus}
                            maxLength={maxAnswerLength}
                            withCounter={true}
                        />
                    </FormGroup>
                    {showFeedback ? (
                        <FormGroup
                            label={gettext('Explanation')}
                            labelProps={{className: 'ud-sr-only'}}
                            styleName="answer-option-feedback"
                        >
                            <TextInputWithCounter
                                data-purpose="answer-option-feedback"
                                maxLength={maxFeedbackLength}
                                value={option.feedback}
                                onChange={this.onFeedbackChange}
                                placeholder={gettext(
                                    "Explain why this is or isn't the best answer.",
                                )}
                            />
                        </FormGroup>
                    ) : null}
                </div>
                <div styleName="answer-option-delete">
                    <ItemIconButton
                        iconType="delete"
                        iconProps={{size: 'small'}}
                        data-purpose="answer-option-delete"
                        onClick={this.onDelete}
                        disabled={form.data.answerOptions.length <= 1}
                    />
                </div>
            </div>
        );
    }
}
