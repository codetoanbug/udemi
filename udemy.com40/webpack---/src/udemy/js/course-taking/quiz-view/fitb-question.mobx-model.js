import autobind from 'autobind-decorator';
import {action, computed, observable, set} from 'mobx';

import BaseQuizQuestion from './base-quiz-question.mobx-model';

/**
 * This models ASSESSMENT_TYPES.FILL_IN_THE_BLANK assessments.
 * Everything in here is relevant to simple quizzes only.
 */
export default class FITBQuestion extends BaseQuizQuestion {
    @observable isCorrectAnswerShown;

    buildAnswersFromAPIData(apiData) {
        return (apiData.correct_response || []).map((answer) => new FITBAnswer(answer));
    }

    @action
    resetObservableData() {
        super.resetObservableData();
        set(this, {
            // This is true when the user clicks "Show answer" to reveal the correct answer
            // to the question.
            isCorrectAnswerShown: false,
        });
        this.answers.forEach((answer) => answer.resetObservableData());
    }

    @computed
    get wrongAnswers() {
        return this.answers.filter((answer) => !answer.getIsCorrect(answer.fill));
    }

    @computed
    get isAnswered() {
        return this.answers.every((answer) => !!answer.fill);
    }

    @action
    setCorrectAnswer() {
        this.answers.forEach((answer) => {
            answer.setFill(answer.correctValue);
        });
    }

    @autobind
    @action
    showCorrectAnswer() {
        this.isCorrectAnswerShown = true;
        this.setCorrectAnswer();
    }
}

class FITBAnswer {
    @observable fill;

    constructor(correctValue) {
        this.correctValue = correctValue;
        this.resetObservableData();
    }

    @action
    resetObservableData() {
        set(this, {fill: ''});
    }

    getIsCorrect(value) {
        return value.toLowerCase() === this.correctValue.toLowerCase();
    }

    @action
    setFill(value) {
        this.fill = value;
    }
}
