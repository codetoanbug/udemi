import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {showReloadPageErrorToast} from 'course-taking/toasts';
import {createRNG, shuffle} from 'utils/seeded-rng';
import udApi, {defaultErrorMessage} from 'utils/ud-api';
import {PAGES} from 'utils/ud-api-stat';
import Raven from 'utils/ud-raven';
import getIsMobileApp from 'utils/user-agent/get-is-mobile-app';

import {QUIZ_TYPES} from '../curriculum/constants';
import {
    API_QUIZ_FIELDS,
    API_QUIZ_ATTEMPT_FIELDS,
    API_QUIZ_QUESTION_FIELDS,
    API_QUIZ_ANSWER_FIELDS,
    ASSESSMENT_TYPES,
    QUIZ_ERROR_CODES,
    QUIZ_ERROR_VALUES,
    attemptApi,
} from './constants';
import FITBQuestion from './fitb-question.mobx-model';
import MCQuestion from './mc-question.mobx-model';
import {RevampFITBQuestionModel} from './practice-test/question/revamp-fitb-question.mobx-model';
import * as Utils from './utils';

export default class QuizViewStore {
    @observable isLoaded = false;

    // This is the same as this.courseTakingStore.currentCurriculumItem.
    // We access the item asynchronously, so it's possible that the user navigates
    // to a different item by the time we access it. In such cases,
    // courseTakingStore.currentCurriculumItem would be null, or already set to the new
    // item, which we don't want. Hence, we need our own reference to the item.
    @observable.ref quiz = null;

    // The latest quiz attempt.
    @observable.ref attempt = null;

    // True if this.questions are loaded.
    @observable areQuestionsLoaded = false;

    // The questions corresponding to this.attempt.
    @observable.ref questions = [];

    @observable currentQuestionArrayIndex = null;
    @observable isHotkeyOverlayVisible = false;

    _questionCache = {};

    constructor(courseTakingStore) {
        this.courseTakingStore = courseTakingStore;
        this.initQuiz();
    }

    @action
    initQuiz() {
        this.quiz = this.courseTakingStore.currentCurriculumItem;
    }

    @autobind
    @action
    showHotkeys() {
        this.isHotkeyOverlayVisible = true;
    }

    @autobind
    @action
    hideHotkeys() {
        this.isHotkeyOverlayVisible = false;
    }

    @autobind
    toggleHotkeys() {
        if (this.isHotkeyOverlayVisible) {
            this.hideHotkeys();
        } else {
            this.showHotkeys();
        }
    }

    @computed
    get isAttemptWithoutQuestions() {
        // It's important to use questions.length, not quiz.numAssessments, here.
        // The former is based on the latest attempt. The latter is based on the latest
        // version of the quiz. They might be difference since the instructor may have added a
        // question after the user started his latest attempt.
        return !!this.attempt && this.questions.length === 0;
    }

    @computed
    get currentQuestion() {
        if (this.currentQuestionArrayIndex === null) {
            return null;
        }
        return this.questions[this.currentQuestionArrayIndex];
    }

    load(quizId, isPreviewing) {
        if (isNaN(parseInt(quizId, 10))) {
            return Promise.reject('Invalid quiz id');
        }
        const courseId = this.courseTakingStore.courseId;
        return udApi
            .get(`/users/me/subscribed-courses/${courseId}/quizzes/${quizId}/`, {
                params: {
                    draft: isPreviewing,
                    'fields[quiz]': API_QUIZ_FIELDS.join(','),
                },
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    this.setAPIErrorCode(error, QUIZ_ERROR_CODES.COULD_NOT_LOAD_QUIZ);
                }
                throw error;
            })
            .then((response) => {
                this.quiz.setDataFromAPI(response.data);

                return this.loadAttemptById('latest')
                    .catch((error) => {
                        if (error.response && error.response.status === 404) {
                            // 404s are normal. The user may be taking the quiz for the first time.
                            return null;
                        }
                        throw error;
                    })
                    .then((attempt) => {
                        this.setAttempt(attempt);
                        if (attempt) {
                            return this.loadQuestionsForLatestAttempt();
                        }
                        return this.loadQuestions();
                    })
                    .then((questions) => {
                        this._setContentReady(this.attempt, questions);
                    })
                    .catch((error) => {
                        this.setAPIErrorCode(error, QUIZ_ERROR_CODES.COULD_NOT_LOAD_QUESTIONS);
                        throw error;
                    });
            });
    }

    @action
    unload() {
        this.isLoaded = false;
    }

    @action
    _setContentReady(attempt, questions) {
        this.attempt = attempt || null;
        this.questions = questions || [];
        this.isLoaded = true;
    }

    @action
    setAttempt(attempt) {
        this.attempt = attempt;
    }

    @action
    setQuestions(questions) {
        this.questions = questions;
        this.areQuestionsLoaded = true;
    }

    @action
    setCurrentQuestionIndex(index) {
        this.currentQuestionArrayIndex = index;
    }

    track(action, extraData = {}) {
        const defaultData = {
            quiz: this.quiz.id,
            user_attempted_quiz: this.attempt && this.attempt.id,
            assessment: this.currentQuestion && this.currentQuestion.id,
            log_action: action,
        };
        const eventData = Object.assign(defaultData, extraData);
        this.courseTakingStore.track(undefined, undefined, eventData, PAGES.QUIZ_TAKING);
    }

    trackPracticeTestResults(category, action, extraData) {
        this.courseTakingStore.track(category, action, extraData);
    }

    mobileReload(eventName) {
        const [url, queryString] = window.location.href.split('?');
        const urlParams = new URLSearchParams(queryString);
        if (getIsMobileApp() && urlParams.get('notify_mobile') === 'true') {
            urlParams.set('mobile_event', eventName);
            window.open(`${url}?${urlParams.toString()}`);
        }
    }

    @action
    loadQuestionsForLatestAttempt() {
        // Just load the questions and leave it to the caller to decide when to set the questions.
        // E.g. when starting a new attempt, it makes sense to set the questions immediately,
        // but when continuing from an existing attempt, it's more performant to load questions
        // and user answers in parallel, and set the questions after both resolve.
        this.areQuestionsLoaded = false;

        // Non-practice-test quizzes don't have results_summary.
        const results = this.attempt.results_summary;

        return this.loadQuestions({
            id: this.attempt.id,
            isRandomized: results ? results.is_randomized : false,
            version: this.attempt.version,
        });
    }

    /**
     * Fetches questions for this quiz.
     * @param attempt: The quiz attempt, optional. It is only relevant for practice tests
     * because they're versioned and they can be randomized. If specified, it must have
     * `id`, `isRandomized`, and `version` fields.
     * @returns a promise to an array of Question models.
     */
    loadQuestions(attempt = null) {
        let rng = null;
        let attemptId = null;

        // The quiz has a version, though it's always 1 unless the quiz is a practice test.
        let version = this.quiz.version;

        if (attempt) {
            if (attempt.isRandomized) {
                rng = createRNG(attempt.id);
            }
            attemptId = attempt.id;
            version = attempt.version;
        }

        const cached = this._questionCache[version];
        if (cached) {
            if (cached.attemptId !== attemptId) {
                // We already loaded the questions, but since the attempt is different,
                // reorder the questions and answers.
                cached.attemptId = attemptId;

                // there might be selected answers cached from a different attempt, so we clean them up
                cached.questionsInOriginalOrder.forEach((question) => {
                    question.answers.forEach((answer) => {
                        answer.selected = false;
                    });
                });

                cached.questions = this._getOrderedQuestionsAndAnswers(
                    cached.questionsInOriginalOrder,
                    rng,
                );
            }
            return Promise.resolve(cached.questions);
        }

        return udApi
            .get(`/quizzes/${this.quiz.id}/assessments/`, {
                params: {
                    version,
                    page_size: 250,
                    'fields[assessment]': this._getFieldsFilter(API_QUIZ_QUESTION_FIELDS),
                    use_remote_version: true,
                },
            })
            .then((response) => {
                const questions = response.data.results.map((question, arrayIndex) => {
                    switch (question.assessment_type) {
                        case ASSESSMENT_TYPES.MULTIPLE_CHOICE:
                        case ASSESSMENT_TYPES.MULTIPLE_SELECT:
                            return new MCQuestion(question, arrayIndex + 1);
                        case ASSESSMENT_TYPES.FILL_IN_THE_BLANK:
                            return this._getFITBQuestion(question, arrayIndex + 1);
                        case ASSESSMENT_TYPES.CODING_PROBLEM:
                            return question;
                        default:
                            throw new Error(
                                `Cannot create Question model for type ${question.assessment_type}`,
                            );
                    }
                });

                this._questionCache[version] = {
                    attemptId,
                    questionsInOriginalOrder: questions,
                    questions: this._getOrderedQuestionsAndAnswers(questions, rng),
                };
                return this._questionCache[version].questions;
            });
    }

    _getOrderedQuestionsAndAnswers(questionsInOriginalOrder, rng) {
        // Shuffle the questions. Re-number the questions. Shuffle the answers.
        // Start with the original order of questions and answers.
        const orderedQuestions = questionsInOriginalOrder.slice();
        if (rng) {
            shuffle(orderedQuestions, rng);
            orderedQuestions.forEach((question, i) => {
                question.setQuestionIndex(i + 1);
                question.shuffleAnswers(rng);
            });
        }
        return orderedQuestions;
    }

    /**
     * Fetches the user's answers for this quiz and the specified quiz attempt.
     * @param attemptId: The quiz attempt id, required.
     * @returns a promise to the API response data, without any transformations.
     * You'll probably want to call this.mergeQuestionsAndUserAnswers afterwards.
     * These are separate functions so that we can load questions and user answers in parallel
     * if we want.
     */
    loadUserAnswers(attemptId) {
        const courseId = this.courseTakingStore.courseId;
        return udApi
            .get(
                `/users/me/subscribed-courses/${courseId}/user-attempted-quizzes/${attemptId}/assessment-answers/`,
                {
                    params: {
                        'fields[user_answers_assessment]': this._getFieldsFilter(
                            API_QUIZ_ANSWER_FIELDS,
                        ),
                        'fields[assessment]': 'id',
                        page_size: 250,
                    },
                },
            )
            .then((response) => response.data.results);
    }

    /* Merges questions and user answers, so that instead of working
     * with two arrays, we just work with an array of questions,
     * and each question stores the user's answer for that question.
     * @param questions: An array of MCQuestion models, required.
     * @param answers: API response data for user answers- see this.loadUserAnswers.
     * @returns nothing.
     */
    @action
    mergeQuestionsAndUserAnswers(questions, answers) {
        const questionToAnswerMapping = {};
        answers.forEach((answer) => {
            questionToAnswerMapping[answer.assessment.id] = answer;
        });
        questions.forEach((question) => {
            const answer = questionToAnswerMapping[question.id];
            if (answer) {
                question.setUserAnswerFromAPIData(answer);
            }
        });
    }

    answerQuestion(questionId, answer, extraPostData = {}) {
        const courseId = this.courseTakingStore.courseId;
        const attemptId = this.attempt.id;
        return udApi.post(
            `/users/me/subscribed-courses/${courseId}/user-attempted-quizzes/${attemptId}/assessment-answers/`,
            {
                assessment_id: questionId,
                response: JSON.stringify(answer),
                ...extraPostData,
            },
        );
    }

    /**
     * Fetches the quiz attempt for this quiz.
     * @param id: The quiz attempt id, or the keyword 'latest' to load the most recent attempt.
     * @returns a promise to the API response data, without any transformations.
     */
    loadAttemptById(id) {
        const courseId = this.courseTakingStore.courseId;
        return udApi
            .get(`${attemptApi(courseId, this.quiz.id)}${id}/`, {
                params: {
                    'fields[user_attempted_quiz]': this._getFieldsFilter(API_QUIZ_ATTEMPT_FIELDS),
                },
            })
            .then((response) => response.data);
    }

    createNewAttempt() {
        const course = this.courseTakingStore.course;
        return udApi
            .post(
                attemptApi(course.id, this.quiz.id),
                {
                    is_viewed: true,
                    version: this.quiz.version,
                },
                {
                    params: {
                        'fields[user_attempted_quiz]': this._getFieldsFilter(
                            API_QUIZ_ATTEMPT_FIELDS,
                        ),
                    },
                },
            )
            .then((response) => {
                this.setAttempt(response.data);
            });
    }

    updateAttempt(data = {}) {
        const course = this.courseTakingStore.course;
        return udApi.patch(`${attemptApi(course.id, this.quiz.id)}${this.attempt.id}/`, data);
    }

    updateAttemptWithBeacon(data = {}) {
        /**
         * This method is called when the user leaves current page to pause the assessment.
         * Browser would not be able to execute this API call if we used plain udAPI, so we're using
         * beacon here to guarantee delivery, see
         * https://css-tricks.com/send-an-http-request-on-page-exit/#aa-using-navigator-sendbeacon
         */
        const {course} = this.courseTakingStore;

        const body = new Blob([JSON.stringify(data)], {type: 'application/json; charset=UTF-8'});
        navigator.sendBeacon(
            `/api-2.0${attemptApi(course.id, this.quiz.id)}${this.attempt.id}/pause/`,
            body,
        );
    }

    /**
     * Deletes the latest quiz attempt. This is primarily used for instructor preview;
     * we want the preview to reset to the start of the quiz.
     */
    deleteAttempt() {
        if (!this.attempt) {
            return Promise.resolve();
        }
        const course = this.courseTakingStore.course;
        const attemptId = this.attempt.id;
        this.setAttempt(null);
        return udApi.delete(
            `/users/me/subscribed-courses/${course.id}/quizzes/${this.quiz.id}/user-attempted-quizzes/${attemptId}/`,
        );
    }

    defaultErrorHandler(error, customHandlers = {}) {
        const isAPI400 = !!error.response && error.response.status === 400;
        const isJSError =
            !error.response && !!error.message && !QUIZ_ERROR_VALUES.has(error.message);
        if (isAPI400 || isJSError) {
            // Log 400s and JS errors to Sentry, as they're probably due to frontend bugs.
            // On the other hand, we probably can't do anything in the code to fix
            // e.g. 404s or 500s, so logging to Sentry isn't helpful; we just tell the user
            // to try again later.
            Raven.captureException(error);
        }

        // The API error message is preferred for 400s because it's usually specific about
        // what went wrong. On the other hand, the API error message for e.g. 404s is
        // "Resource not found", which is less user-friendly than e.g.
        // "Unable to load questions for this attempt". In general, we prefer the API message
        // for POST and PATCH methods, and our own message for GET requests.
        let apiMessage = '';
        if (isAPI400 && error.response.data && error.response.data.detail) {
            apiMessage = error.response.data.detail;
        }

        if (customHandlers[error.message]) {
            return customHandlers[error.message](error);
        }

        switch (error.message) {
            case QUIZ_ERROR_CODES.COULD_NOT_CREATE_ATTEMPT:
                return showReloadPageErrorToast(
                    apiMessage || gettext('Unable to create quiz attempt'),
                );
            case QUIZ_ERROR_CODES.COULD_NOT_DELETE_ATTEMPT:
                // Ignore this. The backend returns a better error message when the user tries
                // to start a new attempt before completing the latest one.
                return;
            case QUIZ_ERROR_CODES.COULD_NOT_LOAD_QUESTIONS:
                return showReloadPageErrorToast(
                    gettext('Unable to load questions for this attempt'),
                );
            case QUIZ_ERROR_CODES.COULD_NOT_LOAD_QUIZ:
                return showReloadPageErrorToast(gettext('Quiz not found'));
            case QUIZ_ERROR_CODES.COULD_NOT_SAVE_ANSWER:
                return showReloadPageErrorToast(
                    apiMessage || gettext('Unable to save answer for this question'),
                );
            default:
                return showReloadPageErrorToast(defaultErrorMessage);
        }
    }

    setAPIErrorCode(error, code) {
        if (error.response && !QUIZ_ERROR_VALUES.has(error.message)) {
            error.message = code;
        }
    }

    _getFieldsFilter(mapping) {
        return (mapping[this.quiz.quizType] || mapping.DEFAULT).join(',');
    }

    _getFITBQuestion(question, arrayIndex) {
        if (
            Utils.isPracticeTestExperimentEnabled() &&
            this.quiz.quizType === QUIZ_TYPES.PRACTICE_TEST
        ) {
            return new RevampFITBQuestionModel(question, arrayIndex);
        }

        return new FITBQuestion(question, arrayIndex);
    }
}
