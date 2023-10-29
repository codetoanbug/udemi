import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, computed, observable, reaction} from 'mobx';

import {QuizCompleted, QuizStarted} from 'course-taking/quiz-view/simple-quiz/events';
import {showReloadPageErrorToast} from 'course-taking/toasts';
import udApi from 'utils/ud-api';

import {ASSESSMENT_TYPES, QUIZ_ERROR_CODES} from '../constants';
import {PAGE_TYPES} from './constants';

export default class SimpleQuizStore {
    // One of PAGE_TYPES.
    @observable currentPage = null;

    // True while the user is transitioning between starting a new attempt (on the start page)
    // and seeing the first question (on the question page).
    @observable isPreparingNewAttempt = false;

    // True when the user is in the middle of an attempt.
    @observable isTakingQuiz = false;

    // This is an object with the following fields:
    // - isCorrect: whether the current question is correctly answered.
    // - answers: array containing the checked answer values. For MC, it's the selected answer id,
    //   e.g. ['a']. For FITB, it's the values of the blanks, e.g. ['foo', 'bar'].
    // - feedback: feedback string explaining why the answer is or is not correct (may be null).
    // This object is needed because the UI intentionally does not update these values in real time;
    // it only updates them when the user clicks "Check answer".
    @observable.ref checkedAnswer = null;

    // Stats shown on the results page.
    @observable.ref attemptStats = null;

    // True when going from results page to question page to revisit a question.
    @observable isRevisitingQuestionPage = false;

    constructor(courseTakingStore, quizViewStore) {
        this.courseTakingStore = courseTakingStore;
        this.quizViewStore = quizViewStore;
    }

    @computed
    get isCheckedAnswerCorrect() {
        return !!this.checkedAnswer && this.checkedAnswer.isCorrect;
    }

    @computed
    get isCheckedAnswerIncorrect() {
        return !!this.checkedAnswer && !this.checkedAnswer.isCorrect;
    }

    @computed
    get questionsById() {
        const map = {};
        this.quizViewStore.questions.forEach((question) => {
            map[question.id] = question;
        });
        return map;
    }

    @action
    initFromLatestAttempt() {
        const attempt = this.quizViewStore.attempt;
        this.isTakingQuiz = !!attempt && !attempt.completion_time;
        if (attempt && attempt.completion_time) {
            this.goToResultsPage();
        } else {
            this.currentPage = PAGE_TYPES.START;
        }
    }

    @autobind
    @action
    retryQuiz() {
        this.quizViewStore.setAttempt(null);
        this.attemptStats = null;
        this.isTakingQuiz = false;
        this.currentPage = PAGE_TYPES.START;
        this.quizViewStore.mobileReload('start');
    }

    @action
    _ensureNewAttempt() {
        if (this.isTakingQuiz) {
            return Promise.resolve();
        }
        this.isPreparingNewAttempt = true;
        return this.quizViewStore
            .createNewAttempt()
            .catch(
                action((error) => {
                    this.isPreparingNewAttempt = false;
                    this.quizViewStore.setAPIErrorCode(
                        error,
                        QUIZ_ERROR_CODES.COULD_NOT_CREATE_ATTEMPT,
                    );
                    throw error;
                }),
            )
            .then(() => {
                this.quizViewStore.track('started-quiz-attempt', {
                    num_questions: this.quizViewStore.questions.length,
                });
                Tracker.publishEvent(
                    new QuizStarted(
                        {
                            id: this.quizViewStore.quiz.id,
                            numberOfQuestions: this.quizViewStore.questions.length,
                        },
                        {id: this.courseTakingStore.courseId},
                        this.quizViewStore.attempt.id,
                    ),
                );
            });
    }

    _initializeCompletedQuestions() {
        (this.quizViewStore.attempt.completed_assessments || []).forEach((questionId) => {
            const question = this.questionsById[questionId];
            question && question.setCorrectAnswer();
        });
    }

    @autobind
    startOrResumeQuiz() {
        return this._ensureNewAttempt()
            .then(
                action(() => {
                    this.quizViewStore.questions.forEach((question) => {
                        question.resetObservableData();
                    });
                    this._initializeCompletedQuestions();
                    this.goToFirstUnansweredQuestion();
                    this.isPreparingNewAttempt = false;
                    this.quizViewStore.mobileReload('start-quiz-clicked');
                }),
            )
            .catch(this.errorHandler);
    }

    goToFirstUnansweredQuestion() {
        const question = this.quizViewStore.questions.find((q) => !q.isAnswered);
        if (question) {
            this.goToQuestionPage(question);
        } else {
            this.goToResultsPage();
        }
    }

    @action
    revisitQuestion(question) {
        this.goToQuestionPage(question, {isRevisiting: true});
        question.setCorrectAnswer();
        this.checkedAnswer = this._buildCheckedAnswer(question);
        this.quizViewStore.mobileReload('revisit-question-clicked');
    }

    setUpResetOnQuestionChange() {
        if (this._onQuestionChangeDisposer) {
            this._onQuestionChangeDisposer();
        }
        this._onQuestionChangeDisposer = reaction(
            () => this.quizViewStore.currentQuestion.id,
            action(() => {
                this.quizViewStore.currentQuestion.setStartTime();
            }),
            {fireImmediately: true},
        );
    }

    disposeResetOnQuestionChange() {
        this._onQuestionChangeDisposer && this._onQuestionChangeDisposer();
        this._onQuestionChangeDisposer = null;
    }

    @autobind
    skipQuestion() {
        this.quizViewStore.track('skipped-question');
        this.goToNextQuestion();
    }

    @autobind
    goToNextQuestion() {
        const question = this.quizViewStore.currentQuestion;
        const isLastQuestion = question.questionIndex === this.quizViewStore.questions.length;
        if (isLastQuestion) {
            this.goToResultsPage();
            this.quizViewStore.mobileReload('show-results-clicked');
        } else {
            const currentQuestionArrayIndex = question.questionIndex - 1;
            this.goToQuestionPage(this.quizViewStore.questions[currentQuestionArrayIndex + 1]);
            this.quizViewStore.mobileReload('next-question-clicked');
        }
    }

    sendQuizCompletedEvent() {
        const question = this.quizViewStore.currentQuestion;
        const isLastQuestion = question?.questionIndex === this.quizViewStore.questions.length;
        if (isLastQuestion) {
            const percentCorrect =
                this?.attemptStats.summary.correct.length / this.quizViewStore.questions.length;
            Tracker.publishEvent(
                new QuizCompleted(
                    {
                        id: this.quizViewStore.quiz.id,
                        numberOfQuestions: this.quizViewStore.questions.length,
                    },
                    {id: this.courseTakingStore.courseId},
                    this.quizViewStore.attempt.id,
                    percentCorrect,
                ),
            );
        }
    }

    _buildCheckedAnswer(question) {
        if (question.assessmentType === ASSESSMENT_TYPES.FILL_IN_THE_BLANK) {
            return {
                isCorrect: question.isCorrect,
                answers: question.answers.map((answer) => answer.fill),
                feedback: null,
            };
        }
        return {
            isCorrect: question.isCorrect,
            answers: question.selectedAnswers.map((answer) => answer.id),
            feedback: question.selectedAnswers[0].feedback || null,
        };
    }

    @action
    resetCheckedAnswer() {
        this.checkedAnswer = null;
    }

    @action
    checkAnswer() {
        const question = this.quizViewStore.currentQuestion;
        const duration = Math.floor((Date.now() - question.startTime) / 1000);
        const checkedAnswer = this._buildCheckedAnswer(question);
        let rollbackDisabledAnswers;
        if (question.assessmentType !== ASSESSMENT_TYPES.FILL_IN_THE_BLANK) {
            rollbackDisabledAnswers = question.disableAnswers(question.selectedAnswers);
        }
        this.quizViewStore.track('answered-question', {answer: checkedAnswer.answers, duration});
        return this.quizViewStore
            .answerQuestion(question.id, checkedAnswer.answers, {duration})
            .then(
                action(() => {
                    this.checkedAnswer = checkedAnswer;
                    if (checkedAnswer.isCorrect) {
                        // This looks redundant, but it's needed to update the disabled state of
                        // answers for MC questions.
                        question.setCorrectAnswer();
                    } else {
                        question.incrementAttempts();
                    }
                }),
            )
            .catch((error) => {
                if (question.assessmentType !== ASSESSMENT_TYPES.FILL_IN_THE_BLANK) {
                    rollbackDisabledAnswers();
                }
                this.quizViewStore.setAPIErrorCode(error, QUIZ_ERROR_CODES.COULD_NOT_SAVE_ANSWER);
                this.errorHandler(error);
            });
    }

    ensureAttemptStatsAreLoaded() {
        if (this.attemptStats) {
            return Promise.resolve();
        }
        const courseId = this.courseTakingStore.courseId;
        const quizId = this.quizViewStore.quiz.id;
        const attemptId = this.quizViewStore.attempt.id;
        return udApi
            .get(
                `/users/me/subscribed-courses/${courseId}/quizzes/${quizId}/user-attempted-quizzes/${attemptId}/stats/`,
            )
            .then(
                action((response) => {
                    this.attemptStats = {
                        summary: {
                            // These arrays contain question IDs.
                            correct: response.data.summary.correct || [],
                            wrong: response.data.summary.wrong || [],
                            skipped: response.data.summary.skipped || [],
                        },
                        numAnsweredQuestions: response.data.user_num_answers,
                        numSkippedQuestions: response.data.user_num_skipped_answers,
                        userPassed: response.data.user_passed,
                    };
                    this.filterQuestionsInQuiz();
                    this.quizViewStore.track('viewed-result-page');
                    if (this.attemptStats.numSkippedQuestions === 0) {
                        // A quiz is marked complete if user has completed it at least once.
                        this.quizViewStore.quiz.setComplete();
                    }
                    // send completed event after loading attemptStats when proceeding to results page
                    this.sendQuizCompletedEvent();
                }),
            )
            .catch((error) => {
                this.quizViewStore.setAPIErrorCode(
                    error,
                    QUIZ_ERROR_CODES.COULD_NOT_LOAD_ATTEMPT_STATS,
                );
                this.errorHandler(error);
            });
    }

    /**
     * Filters the attempt stats to only show questions that are viewable in the quiz store. This
     * mainly applies to versioned quiz questions.
     */
    @action
    filterQuestionsInQuiz() {
        const questionIdsInQuiz = new Set(
            this.quizViewStore.questions.map((question) => question.id),
        );
        this.attemptStats.summary.correct = this.attemptStats.summary.correct.filter((questionId) =>
            questionIdsInQuiz.has(questionId),
        );
        this.attemptStats.summary.wrong = this.attemptStats.summary.wrong.filter((questionId) =>
            questionIdsInQuiz.has(questionId),
        );
        this.attemptStats.summary.skipped = this.attemptStats.summary.skipped.filter((questionId) =>
            questionIdsInQuiz.has(questionId),
        );
    }

    getQuestionsFromAttemptStats(correctnessState) {
        return this.attemptStats.summary[correctnessState].map(
            (questionId) => this.questionsById[questionId],
        );
    }

    @action
    goToQuestionPage(question, options = {}) {
        options = {isRevisiting: false, ...options};
        this.isTakingQuiz = true;
        this.isRevisitingQuestionPage = options.isRevisiting;
        const questionArrayIndex = question.questionIndex - 1;
        this.quizViewStore.setCurrentQuestionIndex(questionArrayIndex);
        this.checkedAnswer = null;
        this.currentPage = PAGE_TYPES.QUESTION;
    }

    @action
    goToResultsPage() {
        this.isTakingQuiz = false;
        this.isRevisitingQuestionPage = false;
        this.ensureAttemptStatsAreLoaded();
        this.currentPage = PAGE_TYPES.RESULTS;
    }

    @autobind
    goBackToResultsPage() {
        this.goToResultsPage();
        this.quizViewStore.mobileReload('back-to-results-clicked');
    }

    @autobind
    errorHandler(error) {
        this.quizViewStore.defaultErrorHandler(error, {
            [QUIZ_ERROR_CODES.COULD_NOT_LOAD_ATTEMPT_STATS]: () => {
                return showReloadPageErrorToast(gettext('Unable to load results for this attempt'));
            },
        });
    }
}
