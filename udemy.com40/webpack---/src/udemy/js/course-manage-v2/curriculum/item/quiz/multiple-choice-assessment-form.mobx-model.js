import {action, observable, set} from 'mobx';

import {htmlToText} from 'base-components/ungraduated/form/rich-text-editor/helpers';

import {assessmentTypes} from '../constants';
import AssessmentFormModel from './assessment-form.mobx-model';
import {parseMultipleChoiceAnswerAsOption, parseMultipleChoiceAnswersAsOptions} from './parsers';

export const initialMinNumOfDisplayedAnswers = 3;
export const maxAnswerLength = 600;
export const maxFeedbackLength = 600;
export const maxKnowledgeAreaLength = 60;
export const maxNumOfAnswers = 15; // See Assessment.MULTIPLE_CHOICE_ANSWER_MAX_COUNT on backend.

export default class MultipleChoiceAssessmentFormModel extends AssessmentFormModel {
    @observable focusedAnswerOptionIndex;

    constructor(type) {
        super();
        if (type !== assessmentTypes.multipleChoice && type !== assessmentTypes.multipleSelect) {
            throw new Error(`Invalid type ${type} for MultipleChoiceAssessmentFormModel`);
        }
        this._type = type;
    }

    get type() {
        return this._type;
    }

    @action
    reset(assessment, knowledgeAreas) {
        super.reset(assessment);
        set(this, {
            focusedAnswerOptionIndex: null,
        });
        set(this.data, {
            answerOptions: [],
            explanation: '',
            selectedKnowledgeAreaIndex: -1,
        });
        if (assessment) {
            if (!knowledgeAreas) {
                throw new Error(
                    'Knowledge areas must be set when editing an assessment. ' +
                        'Otherwise `selectedKnowledgeAreaIndex` field will not reset correctly.',
                );
            }
            set(this.data, {
                answerOptions: parseMultipleChoiceAnswersAsOptions(
                    assessment.answers,
                    assessment.feedbacks,
                    assessment.correctResponse,
                ),
                explanation: assessment.explanation,
                selectedKnowledgeAreaIndex: knowledgeAreas.indexOf(assessment.knowledgeArea),
            });
            if (this.data.answerOptions.length < maxNumOfAnswers) {
                this.addAnswerOption('', '', false);
            }
        }
        for (let i = this.data.answerOptions.length; i < initialMinNumOfDisplayedAnswers; i++) {
            this.addAnswerOption('', '', false);
        }
    }

    @action
    addAnswerOption(value, feedback, isCorrect) {
        this.data.answerOptions.push(parseMultipleChoiceAnswerAsOption(value, feedback, isCorrect));
    }

    @action
    deleteAnswerOptionAtIndex(index) {
        if (index === this.focusedAnswerOptionIndex) {
            this.focusedAnswerOptionIndex = null;
        }
        this.data.answerOptions.splice(index, 1);
    }

    @action
    setAnswerOptionChecked(answerOption, isChecked) {
        if (this.type === assessmentTypes.multipleChoice) {
            // Implement radio group behavior. Only one option can be selected. The only way to
            // de-select an option is to select another option.
            if (answerOption.checked && !isChecked) {
                return;
            }
            this.data.answerOptions.forEach((option) => {
                option.checked = false;
            });
        }
        answerOption.checked = isChecked;
    }

    @action
    setAnswerOptionFeedback(answerOption, value) {
        answerOption.feedback = value;
    }

    @action
    setAnswerOptionValue(answerOption, value) {
        answerOption.value = value;
    }

    @action
    focusOnAnswerOption(answerOptionIndex) {
        this.focusedAnswerOptionIndex = answerOptionIndex;
    }

    decodeAndTrim(text) {
        return text.replaceAll('<p>', '').replaceAll('</p>', '').replaceAll('&nbsp;', '').trim();
    }

    @action
    validate(question, answerOptions, knowledgeArea) {
        this.error = {};
        if (!this.decodeAndTrim(question)) {
            this.error = {detail: gettext('Please write a question')};
        } else if (!answerOptions || answerOptions.length === 0) {
            this.error = {detail: gettext('Please add answers.')};
        } else if (!this._isAnswerCountWithinLimits(answerOptions)) {
            this.error = {
                detail: interpolate(
                    gettext('Keep the total count of answers under %(limit)s'),
                    {limit: maxNumOfAnswers},
                    true,
                ),
            };
        } else if (!this._areAnswerOptionsWithinTextLengthLimits(answerOptions)) {
            this.error = {
                detail: interpolate(
                    gettext(
                        'Enter fewer than %(limit)s characters for each answer and explanation',
                    ),
                    {limit: maxAnswerLength},
                    true,
                ),
            };
        } else if (this._hasNoCorrectAnswer(answerOptions)) {
            this.error = {detail: gettext('Please choose the best answer.')};
        } else if (knowledgeArea.length > maxKnowledgeAreaLength) {
            this.error = {
                detail: interpolate(
                    gettext('Please keep lengths of knowledge areas within %(limit)s characters'),
                    {limit: maxKnowledgeAreaLength},
                    true,
                ),
            };
        }
    }

    _isAnswerCountWithinLimits(answerOptions) {
        if (answerOptions.length > maxNumOfAnswers) {
            return false;
        }
        return true;
    }

    _areAnswerOptionsWithinTextLengthLimits(answerOptions) {
        for (let i = 0; i < answerOptions.length; i++) {
            const answerOption = answerOptions[i];
            if (htmlToText(answerOption.value).length > maxAnswerLength) {
                return false;
            }
            if (answerOption.feedback.length > maxFeedbackLength) {
                return false;
            }
        }
        return true;
    }

    _hasNoCorrectAnswer(answerOptions) {
        return answerOptions.filter((option) => option.checked).length === 0;
    }
}
