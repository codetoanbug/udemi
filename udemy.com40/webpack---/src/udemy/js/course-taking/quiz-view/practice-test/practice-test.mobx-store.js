import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, computed, observable, observe, runInAction} from 'mobx';

import {
    PracticeTestCompleted,
    PracticeTestStarted,
} from 'course-taking/quiz-view/practice-test/events';
import {showReloadPageErrorToast} from 'course-taking/toasts';
import udApi from 'utils/ud-api';

import {SIDEBAR_CONTENT} from '../../constants';
import {ASSESSMENT_TYPES, QUIZ_ERROR_CODES} from '../constants';
import {API_TEST_RESULT_FIELDS} from './constants';
import TestTimerModel from './question/test-timer.mobx-model';
import TestResultModel from './results/test-result.mobx-model';

export default class PracticeTestStore {
    // True if the user arrived on the start page from the results page.
    @observable isStartingARetake = false;

    // False while deleting the latest attempt.
    // We delete the attempt in instructor preview mode to force the preview to start on the start page.
    // We also delete it if the test has no questions, as otherwise the backend thinks we're in the
    // middle of an existing attempt, and won't let us create a new one.
    @observable isStartPageLoaded = false;

    // True while the user is transitioning between starting a new attempt (on the start page)
    // and seeing the first question (on the question page).
    @observable isPreparingNewAttempt = false;

    // "Finish test" refers to finishing the test by clicking "Finish" at the last question.
    // "Stop test" refers to finishing the test by clicking "Stop" on the timer.
    @observable isFinishTestConfirmationOpen = false;
    @observable isStopTestConfirmationOpen = false;

    // These are the TestResultModels rendered on the results page.
    @observable.ref testResults = [];
    _loadTestResultsPromise = null;
    @observable areTestResultsLoaded = false;

    // This is the TestResultModel rendered on the detailed result page.
    @observable.ref detailedTestResult = null;

    @observable changelogModal = {isOpen: false, changelog: []};

    @observable isProcessingAnswerTestQuestion = false;

    constructor(courseTakingStore, quizViewStore, baseUrl) {
        this.courseTakingStore = courseTakingStore;
        this.quizViewStore = quizViewStore;
        this.timer = new TestTimerModel(this, quizViewStore);
        this.baseUrl = baseUrl;

        this.history = null;
        this._isHistoryUnset = false;
    }

    get isHistoryNotSet() {
        // FIXME https://udemyjira.atlassian.net/browse/TE-2626 - attempt to prevent race condition
        // the history is missing and not willingly unset
        return !this.history && !this._isHistoryUnset;
    }

    @computed
    get isQuestionNavOpen() {
        return (
            this.courseTakingStore.activeSidebarContent === SIDEBAR_CONTENT.PRACTICE_TEST_QUESTIONS
        );
    }

    /**
     * This is observed by this.setUpAutoSaveOnQuestionOrAnswersChange.
     * We prefer questionIndex over id because it's O(1) to find a question by its questionIndex.
     * We stringify answerIds so that we can use === to check if they changed.
     */
    @computed
    get currentQuestionAndAnswers() {
        const question = this.quizViewStore.currentQuestion;
        if (!question) {
            return null;
        }
        return {
            questionIndex: question.questionIndex,
            answerIds: question.selectedAnswers.map((answer) => answer.id).join(','),
        };
    }

    @computed
    get latestPublishedTestVersion() {
        const quiz = this.quizViewStore.quiz;
        if (quiz.isDraft) {
            return quiz.version - 1;
        }
        return quiz.version;
    }

    @computed
    get testResultsByVersion() {
        const grouped = {};
        this.testResults.forEach((result) => {
            grouped[result.version] = grouped[result.version] || [];
            grouped[result.version].push(result);
        });
        const groupedAsList = Object.entries(grouped).map(([version, results]) => {
            return {
                // Object keys are always strings. Turn the version back into a number.
                version: parseInt(version, 10),

                results: results.sort((a, b) => {
                    if (a.completionTime < b.completionTime) return 1;
                    if (b.completionTime < a.completionTime) return -1;
                    return 0;
                }),
                durationHours: results[0].durationHours,
                durationMinutes: results[0].durationMinutes,
                passPercent: results[0].passPercent,
                numAssessments: results[0].numAssessments,
            };
        });
        return groupedAsList.sort((a, b) => b.version - a.version);
    }

    /**
     * Returns the first result displayed on the results page.
     */
    @computed
    get firstTestResult() {
        if (this.testResults.length === 0) {
            return null;
        }
        return this.testResultsByVersion[0].results[0];
    }

    @computed
    get isVersionAlertShown() {
        return (
            this.testResultsByVersion.length > 0 &&
            this.latestPublishedTestVersion > this.testResultsByVersion[0].version
        );
    }

    @computed
    get isTakingTest() {
        return (
            !!this.quizViewStore.attempt &&
            !this.quizViewStore.attempt.completion_time &&
            this.quizViewStore.quiz.numAssessments > 0
        );
    }

    @computed
    get isCurrentAttemptCompleted() {
        return !!this.quizViewStore.attempt && !!this.quizViewStore.attempt.completion_time;
    }

    /**
     * Retake a test. Transitions from results page to start page.
     */
    @autobind
    @action
    retakeTest() {
        this.isStartingARetake = true;
        this.goToStartPage();
    }

    @action
    ensureStartPageIsLoaded() {
        this.resetIsStartPageLoaded();
        if (this.isStartPageLoaded) {
            return Promise.resolve();
        }
        return this.quizViewStore
            .deleteAttempt()
            .then(
                action(() => {
                    this.isStartPageLoaded = true;
                }),
            )
            .catch((error) => {
                this.quizViewStore.setAPIErrorCode(
                    error,
                    QUIZ_ERROR_CODES.COULD_NOT_DELETE_ATTEMPT,
                );
                this.errorHandler(error);
            });
    }

    @action
    resetIsStartPageLoaded() {
        this.isStartPageLoaded =
            !this.courseTakingStore.isUserInstructor &&
            !this.quizViewStore.isAttemptWithoutQuestions;
    }

    /**
     * Start a test. Transitions from start page to question page.
     */
    @autobind
    @action
    startTest() {
        // It seems like mobx will only update the state until the async action is completed.
        if (this.isPreparingNewAttempt) {
            return Promise.reject(new Error(QUIZ_ERROR_CODES.ALREADY_CREATING_ATTEMPT)).catch(
                action((error) => this.errorHandler(error)),
            );
        }
        this.isPreparingNewAttempt = true;
        return this.quizViewStore
            .createNewAttempt()
            .catch((error) => {
                this.quizViewStore.setAPIErrorCode(
                    error,
                    QUIZ_ERROR_CODES.COULD_NOT_CREATE_ATTEMPT,
                );
                throw error;
            })
            .then(() => {
                return this.quizViewStore.loadQuestionsForLatestAttempt();
            })
            .then(
                action((questions) => {
                    questions.forEach((question) => {
                        question.resetObservableData();
                    });
                    this.quizViewStore.setQuestions(questions);
                    this.quizViewStore.track('started-quiz-attempt', {
                        num_questions: this.quizViewStore.questions.length,
                    });
                    // Important analytics event!
                    Tracker.publishEvent(
                        new PracticeTestStarted(
                            {
                                id: this.quizViewStore.quiz.id,
                                numberOfQuestions: this.quizViewStore.quiz.numAssessments,
                            },
                            {id: this.courseTakingStore.courseId},
                            this.quizViewStore.attempt.id,
                        ),
                    );
                    this.goToQuestionPage({replace: true});
                }),
            )
            .catch(
                action((error) => {
                    this.isPreparingNewAttempt = false;
                    this.quizViewStore.setAPIErrorCode(
                        error,
                        QUIZ_ERROR_CODES.COULD_NOT_LOAD_QUESTIONS,
                    );
                    this.errorHandler(error);
                }),
            );
    }

    /**
     * Ensures questions and user answers are loaded when the user is on the question page.
     * They wouldn't be if the user accesses the page directly.
     *
     * This method assumes the attempt has already been loaded.
     */
    @action
    ensureQuestionPageIsLoaded() {
        if (this.quizViewStore.areQuestionsLoaded) {
            return Promise.resolve();
        }
        return Promise.all([
            this.quizViewStore.loadQuestionsForLatestAttempt(),
            this.quizViewStore.loadUserAnswers(this.quizViewStore.attempt.id),
        ])
            .then(
                action(([questions, answers]) => {
                    this.quizViewStore.mergeQuestionsAndUserAnswers(questions, answers);
                    this.quizViewStore.setQuestions(questions);
                }),
            )
            .catch((error) => {
                this.quizViewStore.setAPIErrorCode(
                    error,
                    QUIZ_ERROR_CODES.COULD_NOT_LOAD_QUESTIONS,
                );
                throw error;
            });
    }

    /**
     * Set the test question that is rendered on the question page.
     * @param questionIndex: see MCQuestion.questionIndex. Note that it is one-based numbering,
     * not zero-based, so quizViewStore.questions[i] has questionIndex = i + 1.
     * If given, we set the question to the one with the matching questionIndex. Otherwise,
     * we set it to the one with id matching quizViewStore.attempt.current_assessment_id.
     * The former case happens when navigating from question to question.
     * The latter case happens the first time the user navigates to the question page.
     *
     * This method assumes there is always at least one question.
     */
    @action
    setCurrentTestQuestion(questionIndex = null) {
        // These flags are used on the start page. We want them to persist until
        // after the user has transitioned to the question page. Hence, we reset them here
        // rather than in the methods that they're changed in.
        this.isPreparingNewAttempt = false;
        this.isStartingARetake = false;

        const questions = this.quizViewStore.questions;
        let currentQuestionArrayIndex;
        if (questionIndex === null) {
            currentQuestionArrayIndex = Math.max(
                0,
                questions.findIndex((q) => {
                    return q.id === this.quizViewStore.attempt.current_assessment_id;
                }),
            );
        } else {
            currentQuestionArrayIndex = questionIndex - 1;
        }
        this.quizViewStore.setCurrentQuestionIndex(currentQuestionArrayIndex);
        this.quizViewStore.attempt.current_assessment_id = this.quizViewStore.currentQuestion.id;
        this.quizViewStore.currentQuestion.setStartTime();
        this.quizViewStore.currentQuestion.markSeen();
    }

    @autobind
    goToPreviousQuestion() {
        const currentQuestion = this.quizViewStore.currentQuestion;
        if (currentQuestion.questionIndex > 1) {
            // this.setUpAutoSaveOnQuestionOrAnswersChange triggers this.answerTestQuestion.
            this.setCurrentTestQuestion(currentQuestion.questionIndex - 1);
        }
    }

    @autobind
    goToNextQuestion() {
        const currentQuestion = this.quizViewStore.currentQuestion;
        if (currentQuestion.questionIndex < this.quizViewStore.questions.length) {
            // this.setUpAutoSaveOnQuestionOrAnswersChange triggers this.answerTestQuestion.
            this.setCurrentTestQuestion(currentQuestion.questionIndex + 1);
        } else {
            this.answerTestQuestion(currentQuestion, currentQuestion);
        }
    }

    @action
    navigateToQuestion(question) {
        if (this.courseTakingStore.isMobileViewportSize) {
            this.closeQuestionNav();
        }
        if (question === this.quizViewStore.currentQuestion) {
            return;
        }
        this.setCurrentTestQuestion(question.questionIndex);
    }

    /**
     * This is called when the user explicitly skips the question by clicking the "Skip" button
     * or triggering the hotkey for "Skip". It is not called when the user manually de-selects
     * all the answers. Note that skipping is implemented as answering with zero selected answers.
     */
    @autobind
    skipTestQuestion() {
        this.quizViewStore.currentQuestion.markSkipped();
        this.goToNextQuestion();
    }

    @autobind
    openQuestionNav() {
        this.courseTakingStore.selectSidebarContent(SIDEBAR_CONTENT.PRACTICE_TEST_QUESTIONS);
    }

    @autobind
    closeQuestionNav() {
        this.courseTakingStore.selectSidebarContent(SIDEBAR_CONTENT.DEFAULT);
    }

    @autobind
    toggleQuestionNav() {
        if (this.isQuestionNavOpen) {
            this.closeQuestionNav();
        } else {
            this.openQuestionNav();
        }
    }

    toggleIsMarkedForReview(question) {
        const isCurrentQuestion = question === this.quizViewStore.currentQuestion;

        // Sort the answers so that randomized answers will be returned in a canonical order.
        const answerIds = question.selectedAnswers.map((answer) => answer.id);
        const sortedAnswerIds = answerIds.slice().sort();
        if (question.assessmentType === ASSESSMENT_TYPES.FILL_IN_THE_BLANK) {
            sortedAnswerIds.forEach((answerId) => {
                sortedAnswerIds[answerId] = question.answers[answerId].userAnswer;
            });
        }

        let duration = 0;
        if (isCurrentQuestion) {
            duration = Math.floor((Date.now() - question.startTime) / 1000);
        }
        question.setMarkedForReview(!question.isMarkedForReview);
        this.timer.resetLastActivity();
        return this.quizViewStore
            .answerQuestion(question.id, sortedAnswerIds, {
                duration,
                is_marked_for_review: question.isMarkedForReview,
            })
            .then(() => {
                if (isCurrentQuestion) {
                    question.setStartTime();
                }
            })
            .catch((error) => {
                question.setMarkedForReview(!question.isMarkedForReview);
                this.quizViewStore.setAPIErrorCode(error, QUIZ_ERROR_CODES.COULD_NOT_SAVE_ANSWER);
                this.errorHandler(error);
            });
    }

    setUpAutoSaveOnQuestionOrAnswersChange() {
        if (this._onQuestionOrAnswersChangeDisposer) {
            this._onQuestionOrAnswersChangeDisposer();
        }
        this._onQuestionOrAnswersChangeDisposer = observe(
            this,
            'currentQuestionAndAnswers',
            ({newValue, oldValue}) => {
                if (!oldValue || !newValue) {
                    return;
                }
                const preChangeQuestion = this.quizViewStore.questions[oldValue.questionIndex - 1];
                const postChangeQuestion = this.quizViewStore.questions[newValue.questionIndex - 1];
                this.answerTestQuestion(preChangeQuestion, postChangeQuestion, {
                    isAutoSave: true,
                    didQuestionChange: oldValue.questionIndex !== newValue.questionIndex,
                    didAnswersChange: oldValue.answerIds !== newValue.answerIds,
                });
            },
        );
    }

    disposeAutoSaveOnQuestionOrAnswersChange() {
        this._onQuestionOrAnswersChangeDisposer && this._onQuestionOrAnswersChangeDisposer();
        this._onQuestionOrAnswersChangeDisposer = null;
    }

    /**
     * This method is called in two cases:
     * 1. The current question changed, or the selected answers to the current question changed.
     *    See this.setUpAutoSaveOnQuestionOrAnswersChange.
     *    It's called when the question changes so that we can update `current_assessment_id`,
     *    which is important for keeping track of which question the user left off at.
     *
     *    Note that the method accepts `preChangeQuestion` (the question before the change) and
     *    `postChangeQuestion` (the question after the change). They would be the same if only
     *    the selected answers changed. We save answers for preChangeQuestion, and
     *    current_assessment_id for postChangeQuestion.
     *
     *    This case corresponds to options.isAutoSave: true.
     *
     * 2. The user clicks "Finish" on the last question. We confirm whether the user is
     *    finishing the test. Whether the user confirms (options.isFinishTestConfirmed)
     *    or cancels (options.isFinishTestCanceled), we save the answers,
     *    but we'll only continue to the results page if the user confirms.
     *
     *    This case corresponds to options.isAutoSave: false. The preChangeQuestion is the same
     *    as the postChangeQuestion, which is the same as the last question.
     */
    @action
    answerTestQuestion(preChangeQuestion, postChangeQuestion, options = {}) {
        options = {
            isAutoSave: false,
            isFinishTestCanceled: false,
            isFinishTestConfirmed: false,
            didQuestionChange: preChangeQuestion.id !== postChangeQuestion.id,
            didAnswersChange: true,
            ...options,
        };

        this.timer.resetLastActivity();

        // Sort the answers so that randomized answers will be returned in a canonical order.
        const answerIds = preChangeQuestion.selectedAnswers.map((answer) => answer.id);
        let sortedAnswerIds = answerIds.slice().sort();
        if (preChangeQuestion.assessmentType === ASSESSMENT_TYPES.FILL_IN_THE_BLANK) {
            sortedAnswerIds = preChangeQuestion.answers.map((answer) => answer.userAnswer);
        }
        const duration = Math.floor((Date.now() - preChangeQuestion.startTime) / 1000);

        if (options.didQuestionChange || !options.isAutoSave) {
            if (answerIds.length === 0) {
                this.quizViewStore.track('skipped-question');
            } else {
                this.quizViewStore.track('answered-question', {answer: answerIds, duration});
            }
        }

        const isLastQuestion =
            preChangeQuestion.questionIndex === this.quizViewStore.questions.length;
        if (
            isLastQuestion &&
            !options.isAutoSave &&
            !options.isFinishTestCanceled &&
            !options.isFinishTestConfirmed
        ) {
            this.isFinishTestConfirmationOpen = true;
            return Promise.resolve();
        }

        this.isProcessingAnswerTestQuestion = true;
        return this.quizViewStore
            .answerQuestion(preChangeQuestion.id, sortedAnswerIds, {
                duration,
                current_assessment_id: postChangeQuestion.id,
                marked_completed: options.isFinishTestConfirmed,
            })
            .then(() => {
                if (options.isFinishTestConfirmed) {
                    // Finish the test. Move on to the results page.
                    this._finishTest();
                } else {
                    // Reset the start time so that we can measure
                    // the duration for the next selected answer.
                    preChangeQuestion.setStartTime();
                }
                // We have an issue where a user can skip a question and we don't show an error.
                // If the user reloads the page they will be redirected to the last successful answer logged.
                // A problem is a user can skip a couple questions get an error and then successfully submit an answer.
                // When the user reloads page, completes the test or ends the test early these failed questions are not
                // logged correctly. A bigger refactor is needed to fix this issue and would require a change in functionality.
                // For now we will disable user answer submissions prompt them to reload the page.
                runInAction(() => {
                    this.isProcessingAnswerTestQuestion = false;
                });
            })
            .catch((error) => {
                this.quizViewStore.setAPIErrorCode(error, QUIZ_ERROR_CODES.COULD_NOT_SAVE_ANSWER);
                this.errorHandler(error);
            });
    }

    @autobind
    @action
    confirmFinishTest() {
        this.isFinishTestConfirmationOpen = false;
        const lastQuestion = this.quizViewStore.questions[this.quizViewStore.questions.length - 1];
        this.answerTestQuestion(lastQuestion, lastQuestion, {isFinishTestConfirmed: true});
    }

    @autobind
    @action
    cancelFinishTest() {
        this.isFinishTestConfirmationOpen = false;
        this.openQuestionNav();
        const questions = this.quizViewStore.questions;
        const lastQuestion = questions[questions.length - 1];
        this.answerTestQuestion(lastQuestion, lastQuestion, {isFinishTestCanceled: true});
    }

    @autobind
    @action
    showStopTestConfirmation() {
        this.isStopTestConfirmationOpen = true;
    }

    @autobind
    @action
    confirmStopTest() {
        this.isStopTestConfirmationOpen = false;
        this.quizViewStore.track('stop-test');
        this.quizViewStore
            .updateAttempt({
                marked_completed: true,
            })
            .then(() => {
                this._finishTest();
            })
            .catch(this.errorHandler);
    }

    @autobind
    @action
    cancelStopTest() {
        this.isStopTestConfirmationOpen = false;
    }

    @action
    _finishTest() {
        if (!this.quizViewStore.quiz.isCpeFinalExam) {
            // If not CPE final exam - mark as completed straight away
            this.quizViewStore.quiz.setComplete();
        } else {
            this._checkIsTestPassed();
        }
        this.quizViewStore.attempt.completion_time = new Date().toISOString();
        this.closeQuestionNav();
        // Reset test results. We want to re-fetch them so that they include the latest attempt.
        this.testResults = [];
        this._loadTestResultsPromise = null;
        this.areTestResultsLoaded = false;

        // Now preload the results so that we have some data available for firing the completed event
        this.loadTestResults().then(() => {
            // Important analytics event!
            Tracker.publishEvent(
                new PracticeTestCompleted(
                    {
                        id: this.quizViewStore.quiz.id,
                        numberOfQuestions: this.quizViewStore.quiz.numAssessments,
                    },
                    {id: this.courseTakingStore.courseId},
                    this.testResults[0].id,
                    this.testResults[0].correctPercent,
                    this.testResults[0].passed,
                ),
            );
        });

        this.goToResultsPage(null, {replace: true});
    }

    _checkIsTestPassed() {
        const courseId = this.courseTakingStore.courseId;
        const quizId = this.quizViewStore.quiz.id;
        udApi
            .get(`/users/me/subscribed-courses/${courseId}/quizzes/${quizId}/`, {
                params: {
                    'fields[quiz]': 'is_passed',
                    type: 'practice-test',
                },
            })
            .then((response) => {
                if (response.data.is_passed) {
                    this.quizViewStore.quiz.setComplete();
                }
            });
    }

    @action
    loadTestResults(options = {}) {
        options = {reload: false, ...options};
        if (this._loadTestResultsPromise && !options.reload) {
            this.areTestResultsLoaded = true;
            return this._loadTestResultsPromise;
        }
        this.areTestResultsLoaded = false;
        const courseId = this.courseTakingStore.courseId;
        const quizId = this.quizViewStore.quiz.id;
        this._loadTestResultsPromise = udApi
            .get(
                `/users/me/subscribed-courses/${courseId}/quizzes/${quizId}/user-attempted-quizzes/`,
                {
                    params: {
                        page_size: 100,
                        ordering: '-created',
                        'fields[user_attempted_quiz]': API_TEST_RESULT_FIELDS.join(','),
                    },
                },
            )
            .then(
                action((response) => {
                    this.areTestResultsLoaded = true;
                    this.testResults = response.data.results.map(
                        (attempt) => new TestResultModel(attempt),
                    );
                }),
            )
            .catch(
                action((error) => {
                    this.areTestResultsLoaded = true;
                    this.testResults = [];
                    this._loadTestResultsPromise = null;
                    throw error;
                }),
            );

        return this._loadTestResultsPromise;
    }

    loadDetailedTestResult(id) {
        let testResult = null;
        let testResultPromise = null;
        if (this.areTestResultsLoaded) {
            // This happens when the user visits the results page before visiting
            // the detailed result page.
            testResult = this.testResults.find((result) => result.id === id);
        }
        if (testResult) {
            testResultPromise = Promise.resolve();
        } else {
            // This happens when the user visits the detailed result page directly.
            // It's faster to load the one test result than to load all of them.
            testResultPromise = this.quizViewStore.loadAttemptById(id).then((attempt) => {
                testResult = new TestResultModel(attempt);
            });
        }
        return testResultPromise
            .then(
                action(() => {
                    if (testResult.areQuestionsSet) {
                        this.detailedTestResult = testResult;
                        return;
                    }
                    return Promise.all([
                        this.quizViewStore.loadQuestions(testResult),
                        this.quizViewStore.loadUserAnswers(testResult.id),
                    ])
                        .then(
                            action(([questions, answers]) => {
                                this.quizViewStore.mergeQuestionsAndUserAnswers(questions, answers);
                                testResult.setQuestions(questions);
                                this.detailedTestResult = testResult;
                            }),
                        )
                        .catch(
                            action((error) => {
                                if (error.response) {
                                    this.detailedTestResult = testResult;
                                    this.quizViewStore.setAPIErrorCode(
                                        error,
                                        QUIZ_ERROR_CODES.NO_TEST_RESULT_QUESTIONS,
                                    );
                                }
                                throw error;
                            }),
                        );
                }),
            )
            .catch((error) => {
                if (!this.detailedTestResult) {
                    this.quizViewStore.setAPIErrorCode(error, QUIZ_ERROR_CODES.NO_TEST_RESULT);
                }
                throw error;
            });
    }

    @action
    resetDetailedTestResult() {
        this.detailedTestResult = null;
    }

    /**
     * Example: if we call showChangelogModalUpToVersion(12), and the last version that the
     * user attempted was version 7, then the changelog modal shows all changes from 8 to 12.
     */
    @action
    showChangelogModalUpToVersion(targetVersion) {
        const lastAttemptedVersionGroup = this.testResultsByVersion.find((versionGroup) => {
            return versionGroup.version < targetVersion;
        });
        if (!lastAttemptedVersionGroup) {
            return;
        }
        this.changelogModal = {isOpen: true, changelog: []};
        for (let version = targetVersion; version > lastAttemptedVersionGroup.version; version--) {
            // First entry in changelog belongs to version 2, and so on.
            const changelogEntry = this.quizViewStore.quiz.changelog[version - 2];
            this.changelogModal.changelog.push({
                number: version,
                date: changelogEntry.date,
                text: changelogEntry.text,
            });
        }
    }

    @autobind
    @action
    hideChangelogModal() {
        this.changelogModal.isOpen = false;
    }

    /**
     * Only one result can be expanded at a time.
     * The `expanded` query param should always match the id of the expanded attempt.
     */
    @action
    toggleIsExpandedForResult(targetResult) {
        let expandedResultId = null;
        if (targetResult.isExpanded) {
            targetResult.setIsExpanded(false);
        } else {
            this.testResults.forEach((result) => {
                result.setIsExpanded(false);
            });
            targetResult.setIsExpanded(true);
            expandedResultId = targetResult.id;
        }
        this.goToResultsPage(expandedResultId, {replace: true});
    }

    setHistory(history) {
        this._isHistoryUnset = !!this.history && !history;
        this.history = history;
    }

    goToStartPage(options = {}) {
        this._goToRoute('', options);
    }

    goToQuestionPage(options = {}) {
        this._goToRoute('test', options);
    }

    goToResultsPage(expandedResultId = null, options = {}) {
        const queryString = expandedResultId ? `?expanded=${expandedResultId}` : '';
        this._goToRoute(`results${queryString}`, options);
    }

    goToDetailedResultPage(resultId = null, options = {}) {
        this._goToRoute(`result/${resultId}`, options);
    }

    _goToRoute(relPath, options = {}) {
        if (!this.history) {
            if (this._isHistoryUnset) {
                // This implies the practice test page will be unmounted,
                // so further route changes, which may have been triggered asynchronously,
                // should have no effect.
                return;
            }
            // This implies that we're trying to change the route without first setting the
            // history, which should not be allowed.
            throw new Error(`Cannot go to route ${relPath}; history has not been set`);
        }
        options = {replace: false, ...options};
        const path = relPath ? `${this.baseUrl}/${relPath}` : this.baseUrl;
        if (options.replace) {
            this.history.replace(path);
        } else {
            this.history.push(path);
        }
    }

    @autobind
    errorHandler(error) {
        const extraBannerProps = {dismissButtonProps: false};
        const options = {autoDismiss: false};
        this.quizViewStore.defaultErrorHandler(error, {
            [QUIZ_ERROR_CODES.ALREADY_CREATING_ATTEMPT]: () => {
                return showReloadPageErrorToast(
                    gettext('A quiz is already being created please wait!'),
                );
            },
            [QUIZ_ERROR_CODES.NO_TEST_RESULT_QUESTIONS]: () => {
                return showReloadPageErrorToast(
                    gettext('Unable to load questions for this attempt'),
                );
            },
            [QUIZ_ERROR_CODES.COULD_NOT_SAVE_ANSWER]: () => {
                return showReloadPageErrorToast(
                    gettext('Unable to save an answer or skip a question.'),
                    extraBannerProps,
                    options,
                );
            },
            [QUIZ_ERROR_CODES.NO_TEST_RESULT]: () => {
                return this.goToResultsPage(null, {replace: true});
            },
        });
    }
}
