import {action, computed, extendObservable, isObservable, observable, set} from 'mobx';

import {shuffle} from 'utils/seeded-rng';

import BaseQuizQuestion from './base-quiz-question.mobx-model';
import {ASSESSMENT_TYPES} from './constants';

/**
 * This models ASSESSMENT_TYPES.MULTIPLE_CHOICE and ASSESSMENT_TYPES.MULTIPLE_SELECT
 * assessments. The only difference between the two is only one answer may be
 * selected for multiple choice, but multiple answers may be selected for multiple select.
 *
 * Relevant to practice tests only:
 * - _answersInOriginalOrder: tests can have randomized question and answer order,
 *.  seeded by the attempt id, so we need to remember the original answer order.
 *.  This is also why questionIndex is made observable.
 * - explanation
 * - knowledgeArea
 */
export default class MCQuestion extends BaseQuizQuestion {
    @observable questionIndex;
    @observable isMarkedForReview;
    @observable seen;
    @observable wasSkipped;

    constructor(apiData, questionIndex) {
        super(apiData, questionIndex);

        this.explanation = apiData.prompt.explanation || '';
        this.knowledgeArea = apiData.section || '';
        this._answersInOriginalOrder = this.answers.slice();
        this.links = apiData.prompt.links || [];
        this.resourcesRelatedLectures = apiData.related_lectures || [];
        set(this, {questionIndex});
    }

    buildAnswersFromAPIData(apiData) {
        const letterACode = 'a'.charCodeAt(0);
        const answers = [];
        const correctResponse = apiData.correct_response || [];
        const apiDataAnswers = apiData.prompt.answers || [];
        const apiDataFeedbacks = apiData.prompt.feedbacks || [];
        apiDataAnswers.forEach((answer, answerIndex) => {
            // Transform ['R', 'N', 'G'] into
            // [{ id: 'a': text: 'R'}, { id: 'b': text: 'N' }, { id: 'c': text: 'G' }].
            const letter = String.fromCharCode(letterACode + answerIndex);

            let feedback = '';
            if (apiDataFeedbacks.length === apiDataAnswers.length) {
                feedback = apiDataFeedbacks[answerIndex];
            }
            answers.push({
                id: letter,
                text: answer,
                feedback,
                correct: correctResponse.indexOf(letter) >= 0,
            });
        });
        return answers;
    }

    /**
     * Relevant to practice tests only:
     * - isMarkedForReview
     * - seen: true as soon as the question is displayed to the user.
     * - wasSkipped: true once the user clicks the "Skip" button.
     *   It's automatically set to true for unanswered questions that were fetched
     *   directly from the API. It's needed to distinguish an unanswered question that the
     *   user is seeing for the first time from an unanswered question that the user actually
     *   skipped.
     */
    @action
    resetObservableData() {
        super.resetObservableData();
        set(this, {
            isMarkedForReview: false,
            seen: false,
            wasSkipped: false,
        });
        this.answers.forEach((answer) => {
            const answerState = {
                selected: false,
                disabled: false,
            };
            if (isObservable(answer)) {
                set(answer, answerState);
            } else {
                extendObservable(answer, answerState);
            }
        });
    }

    @computed
    get selectedAnswers() {
        return this.answers.filter((answer) => answer.selected);
    }

    @computed
    get wrongAnswers() {
        return this.answers.filter((answer) => answer.selected !== answer.correct);
    }

    @computed
    get isAnswered() {
        return this.selectedAnswers.length > 0;
    }

    @action
    setUserAnswerFromAPIData(userAnswer) {
        // We have some instances of invalid responses stored, such as an empty string '""'
        // and we need to handle it. The expected response for a MC question is a list, ie:
        //  ['a']
        //  ['a', 'b']
        //  []
        //  Anything other than that is likely a mistake, and we are not storing it.
        if (!Array.isArray(userAnswer.response)) {
            return;
        }

        const answersById = {};
        this.answers.forEach((answer) => {
            answersById[answer.id] = answer;
        });
        userAnswer.response
            .map((answerId) => answersById[answerId])
            .forEach((answer) => {
                answer.selected = true;
            });
        this.isMarkedForReview = Boolean(userAnswer.is_marked_for_review);
        this.markSeen();
        if (!this.isAnswered) {
            this.markSkipped();
        }
    }

    @action
    setQuestionIndex(index) {
        this.questionIndex = index;
    }

    @action
    shuffleAnswers(rng) {
        this.answers = this._answersInOriginalOrder.slice();
        shuffle(this.answers, rng);
    }

    @action
    markSeen() {
        this.seen = true;
    }

    @action
    markSkipped() {
        this.deselectAllAnswers();
        this.wasSkipped = true;
    }

    @action
    setMarkedForReview(value) {
        this.isMarkedForReview = value;
    }

    @action
    disableAnswers(answers) {
        const rollbackStates = answers.map((answer) => {
            return {answer, wasDisabled: answer.disabled, wasSelected: answer.selected};
        });
        answers.forEach((answer) => {
            answer.disabled = true;
            answer.selected = false;
        });
        return action(() => {
            rollbackStates.forEach((rollback) => {
                rollback.answer.disabled = rollback.wasDisabled;
                rollback.answer.selected = rollback.wasSelected;
            });
        });
    }

    @action
    setCorrectAnswer() {
        this.answers.forEach((answer) => {
            answer.selected = answer.correct;
            answer.disabled = !answer.correct;
        });
    }

    // Update the question after selecting the given answer.
    @action
    selectAnswerAtIndex(answerIndex) {
        if (answerIndex >= this.answers.length) {
            return;
        }
        const answer = this.answers[answerIndex];
        if (answer.disabled) {
            return;
        }
        if (this.assessmentType === ASSESSMENT_TYPES.MULTIPLE_CHOICE) {
            // Select a single answer (from radio button)
            this.answers.forEach((a) => {
                a.selected = a === answer;
            });
        } else {
            answer.selected = !answer.selected;
        }
    }

    @action
    deselectAllAnswers() {
        this.answers.forEach((answer) => {
            answer.selected = false;
        });
    }
}
