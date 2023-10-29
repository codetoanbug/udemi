import {action, computed, observable, set} from 'mobx';

import Lecture from '../curriculum/lecture.mobx-model';

export default class BaseQuizQuestion {
    @observable numAttempts;
    @observable startTime;

    /**
     * @param apiData: the original API data for the quiz question.
     * @param questionIndex: the question number. The first question has questionIndex: 1.
     *
     * - assessmentType: one of Object.values(ASSESSMENT_TYPES),
     *.  excluding ASSESSMENT_TYPES.CODING_PROBLEM. Coding problems are structured completely
     *.  differently from the others- we're just using the API data directly rather than wrapping
     *.  it in a Model.
     * - promptRichText: question text, including HTML characters.
     * - promptPlainText: question text, with HTML characters stripped.
     *
     */
    constructor(apiData, questionIndex) {
        this.id = apiData.id;
        this.assessmentType = apiData.assessment_type;
        this.questionIndex = questionIndex;
        this.promptRichText = (apiData.prompt.question || '').trim();
        this.promptPlainText = (apiData.question_plain || '').trim();

        // The backend supports multiple related lectures, but the frontend, on
        // both instructor and student side, only supports one related lecture.
        if (apiData.related_lectures && apiData.related_lectures.length > 0) {
            this.relatedLecture = new Lecture(apiData.related_lectures[0]);
        } else {
            this.relatedLecture = null;
        }

        this.answers = this.buildAnswersFromAPIData(apiData);

        this.resetObservableData();
    }

    /**
     * Return an array of answer objects.
     * This model makes no assumptions about what an answer object looks like.
     * E.g. for ASSESSMENT_TYPES.MULTIPLE_CHOICE, an answer represents one of the choices.
     * E.g. for ASSESSMENT_TYPES.FILL_IN_THE_BLANK, an answer represents one of the blanks.
     */
    buildAnswersFromAPIData(/* apiData */) {
        throw new Error('Not implemented');
    }

    /**
     * This resets the question to the state it would have if it was fetched directly from the API.
     * It's used when retaking a quiz. We create a new attempt, but if it has the same version as
     * the previous attempt, we don't reload the questions from the API because they're cached
     * (see QuizViewStore.loadQuestions).
     *
     * - startTime: epoch millisecond timestamp of when the question was started.
     *   It's used to measure how long it took the user to answer the question.
     *
     * Relevant to simple quizzes only:
     * - numAttempts: how many times the user answered incorrectly.
     *   The user keeps trying until he answers correctly.
     *
     */
    @action
    resetObservableData() {
        set(this, {
            numAttempts: 0,
            startTime: null,
        });
    }

    /**
     * Filter this.answers, returning only the incorrectly answered ones.
     * This should be @computed.
     */
    get wrongAnswers() {
        throw new Error('Not implemented');
    }

    /**
     * Return whether this question is answered.
     * This should be @computed.
     */
    get isAnswered() {
        throw new Error('Not implemented');
    }

    @computed
    get isCorrect() {
        return this.isAnswered && this.wrongAnswers.length === 0;
    }

    @computed
    get isIncorrect() {
        return this.isAnswered && this.wrongAnswers.length > 0;
    }

    /**
     * Update this.answers such that this question is correctly answered.
     * This should be an @action.
     */
    setCorrectAnswer() {
        throw new Error('Not implemented');
    }

    @action
    setStartTime(now = Date.now()) {
        this.startTime = now;
    }

    @action
    incrementAttempts() {
        this.numAttempts += 1;
    }
}
