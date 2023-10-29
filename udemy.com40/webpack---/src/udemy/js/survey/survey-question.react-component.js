/* eslint-disable gettext/no-variable-string */
import {
    Checkbox,
    FormGroup,
    Radio,
    RadioBlock,
    Select,
    TextInput,
    TextArea,
    ToggleInputBlockFormGroup,
} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {MAX_SELECTABLE_CHECKBOXES} from './constants';
import RadioButton from './radio-button.react-component';
import './survey.less';

const ToggleInputFormGroup = (props) => <FormGroup {...props} udStyle="fieldset" />;

@observer
export default class SurveyQuestion extends Component {
    static propTypes = {
        question: PropTypes.object.isRequired,
        surveyStore: PropTypes.object.isRequired,
        formGroupProps: PropTypes.object,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        formGroupProps: {},
        onChange: null,
    };

    @autobind onChangeMultiSelect(event) {
        const {surveyStore, question, onChange} = this.props;
        if (event.target.checked) {
            surveyStore.addUserAnswerOption(question.id, parseInt(event.target.value, 10));
        } else {
            surveyStore.removeUserAnswerOption(question.id, parseInt(event.target.value, 10));
        }
        onChange && onChange(event);
    }

    @autobind onChangeChoice(event) {
        const {surveyStore, question, onChange} = this.props;
        surveyStore.updateUserAnswer(question.id, parseInt(event.target.value, 10));
        onChange && onChange(event);
    }

    @autobind onChangeText(event) {
        const {surveyStore, question, onChange} = this.props;
        surveyStore.updateUserAnswer(question.id, event.target.value);
        onChange && onChange(event);
    }

    getRadioProps(answerOption) {
        return {
            key: answerOption.id,
            name: `survey-question-${this.props.question.id}`,
            value: answerOption.id,
            checked: answerOption.id === this.props.surveyStore.userAnswers[this.props.question.id],
            onChange: this.onChangeChoice,
            children: gettext(answerOption.text),
        };
    }

    getTextControlProps() {
        return {
            placeholder: gettext(this.props.question.placeholder),
            value: this.props.surveyStore.userAnswers[this.props.question.id] || '',
            onChange: this.onChangeText,
        };
    }

    render() {
        const {surveyStore, question, formGroupProps} = this.props;

        let SurveyQuestionFormGroup = FormGroup;
        let answers;
        if (question.question_type === 'choice') {
            SurveyQuestionFormGroup = ToggleInputFormGroup;
            answers = (
                <div styleName="buttons">
                    {question.answer_options.map((answerOption) => (
                        <RadioButton {...this.getRadioProps(answerOption)} />
                    ))}
                </div>
            );
        } else if (question.question_type === 'choice__radio') {
            SurveyQuestionFormGroup = ToggleInputFormGroup;
            answers = question.answer_options.map((answerOption) => (
                <Radio {...this.getRadioProps(answerOption)} />
            ));
        } else if (question.question_type === 'choice__boxed_radio') {
            SurveyQuestionFormGroup = ToggleInputBlockFormGroup;
            answers = question.answer_options.map((answerOption) => (
                <RadioBlock {...this.getRadioProps(answerOption)} />
            ));
        } else if (question.question_type === 'choice__multi_select') {
            SurveyQuestionFormGroup = ToggleInputFormGroup;
            const userAnswerIds = surveyStore.userAnswers[question.id] || [];
            const isMaxSelected = userAnswerIds.length >= MAX_SELECTABLE_CHECKBOXES;
            answers = question.answer_options.map((answerOption) => (
                <Checkbox
                    key={answerOption.id}
                    value={answerOption.id}
                    checked={userAnswerIds.includes(answerOption.id)}
                    onChange={this.onChangeMultiSelect}
                    disabled={isMaxSelected && !userAnswerIds.includes(answerOption.id)}
                >
                    {gettext(answerOption.text)}
                </Checkbox>
            ));
        } else if (question.question_type === 'choice__dropdown') {
            answers = (
                <Select
                    value={surveyStore.userAnswers[question.id] || ''}
                    onChange={this.onChangeChoice}
                >
                    <Select.Placeholder key="placeholder">
                        {question.placeholder
                            ? gettext(question.placeholder)
                            : gettext('Select an answer')}
                    </Select.Placeholder>
                    {question.answer_options.map((answerOption) => (
                        <option key={answerOption.id} value={String(answerOption.id)}>
                            {gettext(answerOption.text)}
                        </option>
                    ))}
                </Select>
            );
        } else if (question.question_type === 'freeform') {
            answers = <TextArea {...this.getTextControlProps()} />;
        } else if (question.question_type === 'freeform__textbox') {
            answers = <TextInput {...this.getTextControlProps()} />;
        }
        return (
            <SurveyQuestionFormGroup label={gettext(question.text)} {...formGroupProps}>
                {answers}
            </SurveyQuestionFormGroup>
        );
    }
}
