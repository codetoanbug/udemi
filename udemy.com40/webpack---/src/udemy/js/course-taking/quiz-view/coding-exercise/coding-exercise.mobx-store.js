import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {
    CodingExerciseEvaluateErrorEvent,
    CodingExerciseEvaluateSubmitEvent,
    CodingExerciseEvaluateResponseEvent,
    CodingExerciseEvaluateSuccessEvent,
    CodingExerciseStudentActionEvent,
} from 'course-taking/events';
import getConfigData from 'utils/get-config-data';
import PusherEventHandler, {pusherResultHandlerWrapper} from 'utils/pusher-event-handler';
import udApi from 'utils/ud-api';
import udApiStat from 'utils/ud-api-stat';

import {AUTOSAVE_DELAY, PREVIEW_LANGUAGES, SAVING_STATUS} from './constants';
import FileModel from './file.mobx-model';
import {getFileExtension} from './helpers';

const udConfig = getConfigData();

export default class CodingExerciseStore {
    @observable activeFile;
    @observable studentFiles = [];
    @observable systemFiles = [];
    @observable setupFiles = [];
    @observable currentLine = 1;
    @observable currentColumn = 1;

    @observable hasCheckedSolutionOnce = false;
    @observable isEvaluating = false;
    @observable hasSolutionPassed = false;
    @observable hasEvaluationFailed = false;
    @observable hasPusherFailed = false;
    @observable isInitialPreviewRender = true;
    @observable savingStatus = SAVING_STATUS.SUCCESS;
    @observable evaluatorFeedback;
    @observable logOutput;
    @observable autoSaveRequested = false;
    evaluationStartDate;
    saveTimerId;
    eventHandler;

    constructor(courseTakingStore, quizViewStore) {
        this.courseTakingStore = courseTakingStore;
        this.quizViewStore = quizViewStore;
        this.quizViewStore.setCurrentQuestionIndex(0);
    }

    get quiz() {
        return this.quizViewStore.quiz;
    }

    get question() {
        return this.quizViewStore.questions[0];
    }

    get attempt() {
        return this.quizViewStore.attempt;
    }

    @action
    reset() {
        this.initializeFiles();
        this.scheduleAutoSave();
        this.logOutput = '';
        this.evaluatorFeedback = '';
        this.hasCheckedSolutionOnce = false;
    }

    @autobind
    @action
    setIsInitialPreviewRender(value) {
        this.isInitialPreviewRender = value;
    }

    @action
    initializeFiles() {
        this.studentFiles = this._mapFiles(this.question.prompt.initial_files);
        this.systemFiles = this._mapFiles(this.question.prompt.system_files);
        this.setupFiles = this._mapFiles(this.question.prompt.setup_files);
        this.selectFile(this.studentFiles.length > 0 ? this.studentFiles[0] : undefined);
    }

    _mapFiles(files) {
        if (!files) {
            return [];
        }
        return files.map((file) => {
            return new FileModel(file);
        });
    }

    @autobind
    updateFile(file, content) {
        if (file.content !== content) {
            file.setContent(content);
            this.scheduleAutoSave();
        }
    }

    @autobind
    @action
    updateCursorPosition(line, column) {
        this.currentLine = line;
        this.currentColumn = column;
    }

    @action
    selectFile(file) {
        this.activeFile = file;
    }

    @action
    loadStudentFiles() {
        if (!this.attempt) {
            return this.quizViewStore.createNewAttempt();
        }

        return udApi
            .get(
                `/users/me/subscribed-courses/${this.courseTakingStore.courseId}/user-attempted-quizzes/${this.attempt.id}/coding-exercise-answers/`,
            )
            .then(
                action(({data}) => {
                    const results = data.results || [];
                    if (results.length > 0 && results[0].response.files.length > 0) {
                        this.studentFiles = this._mapFiles(results[0].response.files);
                        if (this.studentFiles && this.studentFiles.length > 0) {
                            this.selectFile(this.studentFiles[0]);
                        }
                    }
                }),
            );
    }

    scheduleAutoSave() {
        // already scheduled, no need to do another one
        if (this.saveTimerId) {
            this.autoSaveRequested = true;
            return;
        }

        this.saveTimerId = setTimeout(this.saveCodingExercise, AUTOSAVE_DELAY);
    }

    _transformFile(files) {
        return files.map((file) => {
            return {
                file_name: file.fileName,
                type: file.type,
                content: file.content,
            };
        });
    }

    @autobind
    @action
    saveCodingExercise(evaluate = false) {
        this.savingStatus = SAVING_STATUS.SAVING;

        return udApi
            .post(
                `/users/me/subscribed-courses/${this.courseTakingStore.courseId}/user-attempted-quizzes/${this.attempt.id}/coding-exercise-answers/`,
                {
                    assessment_id: this.question.id,
                    response: {
                        files: this._transformFile(this.studentFiles),
                    },
                    pusher_channel:
                        evaluate && this.eventHandler && this.eventHandler?.pusherChannel,
                },
            )
            .then(
                action(() => {
                    this.savingStatus = SAVING_STATUS.SUCCESS;
                }),
            )
            .catch(
                action(() => {
                    this.savingStatus = SAVING_STATUS.ERROR;
                    this.eventHandler?.destroy();
                    if (evaluate) {
                        this._evaluatorErrorHandler('backend_error');
                    }
                }),
            )
            .finally(
                action(() => {
                    this.saveTimerId = null;
                    clearTimeout(this.saveTimerId);

                    if (this.autoSaveRequested) {
                        this.autoSaveRequested = false;
                        this.scheduleAutoSave();
                    }
                }),
            );
    }

    @autobind
    fallbackOnEvaluationResult() {
        return udApi
            .get(
                `/users/me/subscribed-courses/${this.courseTakingStore.courseId}/user-attempted-quizzes/${this.attempt.id}/coding-exercise-answers/`,
            )
            .then(
                action((response) => {
                    this.setResult(response.data.results[0].score === 1);
                }),
            )
            .catch(
                action(() => {
                    this.hasEvaluationFailed = true;
                    this._evaluatorErrorHandler('backend_error');
                }),
            );
    }

    @autobind
    @action
    evaluatorResponseHandler(evaluatorResult) {
        const {output} = evaluatorResult;
        this.evaluatorFeedback =
            output.feedback && output.feedback.length
                ? output.feedback
                : output.evaluator_logs || output.compile_logs;
        this.logOutput = output.user_logs;
        this.setResult(evaluatorResult.success);
        let errorType = null;
        if (!evaluatorResult.success) {
            if (output.compile_logs.length === 0) {
                errorType = 'test_error';
            } else {
                errorType = 'compile_error';
            }
        }
        Tracker.publishEvent(
            new CodingExerciseEvaluateResponseEvent({
                pusherChannelId: this.eventHandler?.pusherChannel?.toString(),
                success: this.hasSolutionPassed,
                evaluatorFeedback: this.evaluatorFeedback,
                userOutput: this.logOutput,
                duration: ((new Date() - this.evaluationStartDate) / 1000).toString(),
                errorType,
                ceDisplay: 'old_ui',
            }),
        );
        udApiStat.increment('quiz.coding_exercise.frontend.evaluate.response');
    }

    @action
    setResult(isCorrect) {
        this.isEvaluating = false;
        this.hasCheckedSolutionOnce = true;
        this.hasSolutionPassed = isCorrect;

        if (isCorrect) {
            this.quizViewStore.quiz.setComplete();
        }
    }

    @action
    _evaluatorErrorHandler(error) {
        this.isEvaluating = false;
        this.hasCheckedSolutionOnce = true;
        this.hasEvaluationFailed = true;

        Tracker.publishEvent(
            new CodingExerciseEvaluateErrorEvent({
                pusherChannelId: this.eventHandler?.pusherChannel?.toString(),
                reason: error,
                ceDisplay: 'old_ui',
            }),
        );
        udApiStat.increment(`quiz.coding_exercise.frontend.evaluate.${error}`);
    }

    @autobind
    @action
    timeoutHandler() {
        this.hasPusherFailed = true;
        Tracker.publishEvent(
            new CodingExerciseEvaluateErrorEvent({
                pusherChannelId: this.eventHandler?.pusherChannel?.toString(),
                reason: 'pusher_timeout',
                ceDisplay: 'old_ui',
            }),
        );
        this.fallbackOnEvaluationResult();
    }

    @autobind
    onSubscriptionSucceeded() {
        const requestStartDate = new Date();

        this.quizViewStore.track('answered-question', {answer: {files: this.studentFiles}});
        return this.saveCodingExercise(true)
            .then(() => {
                Tracker.publishEvent(
                    new CodingExerciseEvaluateSuccessEvent({
                        pusherChannelId: this.eventHandler?.pusherChannel?.toString(),
                        duration: ((new Date() - requestStartDate) / 1000).toString(),
                    }),
                );
            })
            .catch(() => {
                this._evaluatorErrorHandler('backend_error');
                this.eventHandler.destroy();
            });
    }

    @autobind
    onSubscriptionError() {
        this._evaluatorErrorHandler('pusher_subscription_error');
    }

    @autobind
    @action
    evaluate() {
        if (this.isEvaluating) {
            return;
        }

        this.isEvaluating = true;
        this.hasEvaluationFailed = false;
        this.checkSolutionOutput = {};

        if (this.eventHandler) {
            this.eventHandler.destroy();
        }

        this.eventHandler = new PusherEventHandler(
            pusherResultHandlerWrapper(this.evaluatorResponseHandler),
            this.timeoutHandler,
            this.onSubscriptionSucceeded,
            this.onSubscriptionError,
            udConfig.third_party.pusher.coding_exercise_event,
        );

        Tracker.publishEvent(
            new CodingExerciseEvaluateSubmitEvent({
                pusherChannelId: this.eventHandler?.pusherChannel?.toString(),
                assessmentId: this.question.id,
                userType: 'student',
                ceDisplay: 'old_ui',
            }),
        );
        udApiStat.increment('quiz.coding_exercise.frontend.evaluate.start');

        this.evaluationStartDate = new Date();
    }

    isActiveFile(file) {
        return file.fileName === this.activeFile.fileName;
    }

    @computed
    get combinedFiles() {
        return this.systemFiles.concat(this.studentFiles);
    }

    @computed
    get htmlFile() {
        const htmlFiles = this.combinedFiles.filter((file) => {
            const extension = getFileExtension(file.fileName);
            return extension === 'html' || extension === 'htm';
        });

        return htmlFiles.length > 0 ? htmlFiles[0] : null;
    }

    @computed
    get isPreviewVisible() {
        const language = (this.question.prompt.language || '').toLowerCase();
        return PREVIEW_LANGUAGES.includes(language) && !!this.htmlFile;
    }

    @autobind
    trackEvent(action) {
        const language = (this.question.prompt.language || '').toLowerCase();
        Tracker.publishEvent(
            new CodingExerciseStudentActionEvent({
                action,
                assessmentId: this.question.id,
                language,
                ceDisplay: 'old_ui',
            }),
        );
    }
}
