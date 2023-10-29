import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {AxiosResponse} from 'axios';
import {action, computed, observable, runInAction} from 'mobx';

import {getCodingLanguage} from 'course-manage-coding-exercise/coding-exercise-creation-upgraded/constants';
import CourseTakingStore from 'course-taking/course-taking.mobx-store';
import {
    CodingExerciseEvaluateErrorEvent,
    CodingExerciseEvaluateSubmitEvent,
    CodingExerciseEvaluateResponseEvent,
    CodingExerciseEvaluateSuccessEvent,
    CodingExerciseStudentActionEvent,
    CodingExerciseFileStudentActionEvent,
} from 'course-taking/events';
import {CodeEditorStore} from 'instructor/code-editor/code-editor.mobx-store';
import {FileModel} from 'instructor/code-editor/file.mobx-model';
import languageSettings from 'instructor/code-editor/language-settings';
import {CodeEditorStoreProps, LanguageSetting} from 'instructor/code-editor/types';
import {CodingExerciseResultStore} from 'instructor/coding-exercise-result-panel/coding-exercise-result.mobx-store';
import {EvaluationResult} from 'instructor/coding-exercise-result-panel/types';
import getConfigData from 'utils/get-config-data';
import PusherEventHandler, {pusherResultHandlerWrapper} from 'utils/pusher-event-handler';
import udApi from 'utils/ud-api';
import udApiStat from 'utils/ud-api-stat';
import Raven from 'utils/ud-raven';
import SystemMessage from 'utils/ud-system-message';

import {AUTOSAVE_DELAY, PREVIEW_LANGUAGES, SAVING_STATUS} from '../coding-exercise/constants';
import {getFileExtension} from '../coding-exercise/helpers';
import QuizViewStore from '../quiz-view.mobx-store';
import * as messages from './messages';
import {UserAnswersAssessment, Quiz, File, Assessment, Prompt} from './types';

const udConfig = getConfigData();

export class CodingExerciseStore {
    @observable systemFiles: FileModel[] = [];
    @observable currentLine = 1;
    @observable currentColumn = 1;
    @observable hasCheckedSolutionOnce = false;
    @observable hasSucceededOnce = false;
    @observable isEvaluating = false;
    @observable isCodeRunning = false;
    @observable hasSolutionPassed = false;
    @observable hasEvaluationFailed = false;
    @observable savingStatus = SAVING_STATUS.SUCCESS;
    @observable evaluatorFeedback?: string;
    @observable autoSaveRequested = false;
    @observable resultAreaExpanded = false;
    @observable previewExpanded = false;
    @observable editorExpanded = false;
    @observable problemAreaHidden = false;
    @observable isPanelResizing = false;
    @observable studentFilesLoaded = false;

    evaluationStartDate?: Date;
    saveTimerId?: number;
    eventHandler?: PusherEventHandler;
    private courseTakingStore: CourseTakingStore;
    private quizViewStore: QuizViewStore;
    codeEditorStore: CodeEditorStore;
    @observable resultStore: CodingExerciseResultStore;
    @observable attemptCount = 0;
    @observable parentRef: HTMLDivElement | null = null;
    @observable isWelcomeModalOpen = false;
    @observable hintsUnlockedPopoverClosed = false;
    @observable hintsLockedPopoverOpen = false;
    @observable solutionUnlockedPopoverClosed = false;
    @observable solutionLockedPopoverOpen = false;
    readonly hintsAttemptCountToUnlock = 2;
    readonly solutionAttemptCountToUnlock = 3;
    @observable combinedFiles: FileModel[] = [];

    readonly eventUITypeDefaultValue = 'new_ui';

    constructor(courseTakingStore: CourseTakingStore, quizViewStore: QuizViewStore) {
        this.courseTakingStore = courseTakingStore;
        this.quizViewStore = quizViewStore;
        this.quizViewStore.setCurrentQuestionIndex(0);
        this.resultStore = new CodingExerciseResultStore({
            language: this.question?.prompt.language,
            trackEvent: this.trackEvent,
            onResizerStart: this.onResizerStart,
            onResizerEnd: this.onResizerEnd,
            onMainPanelHeightChange: (value: number) => {
                courseTakingStore.setCodingExerciseResizePanelValue('resultPanel', value);
            },
            onTCPanelWidthChange: (value: number) => {
                courseTakingStore.setCodingExerciseResizePanelValue('testCases', value);
            },
            mainPanelHeight: Number(courseTakingStore.ceResizablePanelSizes.resultPanel),
            tcPanelWidth: Number(courseTakingStore.ceResizablePanelSizes.testCases),
            onToggle: () => {
                this.codeEditorStore.triggerResize();
            },
        });
        const codeEditorStoreProps: CodeEditorStoreProps = {
            onFileUpdated: this.codeEditorOnFileUpdated,
            onCursorPositionChanged: this.updateCursorPosition,
            trackEvent: this.trackFileEvent,
        };
        this.codeEditorStore = new CodeEditorStore(codeEditorStoreProps);
    }

    parentContainer = () => this.parentRef;
    get quiz(): Quiz | null {
        return this.quizViewStore.quiz;
    }

    @computed get _languageSettings(): LanguageSetting {
        const prompt = this.question?.prompt as Prompt;
        const language = prompt.language.toLowerCase();
        return languageSettings[language as never];
    }

    get question(): Assessment {
        return this.quizViewStore.questions[0];
    }

    get attempt(): UserAnswersAssessment {
        return (this.quizViewStore.attempt as unknown) as UserAnswersAssessment;
    }

    @autobind
    @action
    togglePreviewExpanded() {
        this.previewExpanded = !this.previewExpanded;
        this.codeEditorStore.triggerResize();
    }

    @autobind
    @action
    toggleProblemAreaHidden() {
        this.problemAreaHidden = !this.problemAreaHidden;
        this.codeEditorStore.triggerResize();
    }

    @autobind
    @action
    toggleEditorExpanded() {
        this.editorExpanded = !this.editorExpanded;
        this.codeEditorStore.triggerResize();
    }

    loadWelcomeModalOpen() {
        SystemMessage.hasSeen(SystemMessage.ids.ceLearnerNewUIWelcomeModal).then(
            (response: AxiosResponse<boolean>) => {
                if (!response.data) {
                    runInAction(() => {
                        this.isWelcomeModalOpen = true;
                    });
                }
            },
        );
    }

    loadUnlockedPopoversDismissed() {
        SystemMessage.hasSeen(SystemMessage.ids.ceLearnerHintUnlockedPopoverDismissed).then(
            (response: AxiosResponse<boolean>) => {
                runInAction(() => {
                    this.hintsUnlockedPopoverClosed = response.data;
                });
            },
        );
        SystemMessage.hasSeen(SystemMessage.ids.ceLearnerSolutionUnlockedPopoverDismissed).then(
            (response: AxiosResponse<boolean>) => {
                runInAction(() => {
                    this.solutionUnlockedPopoverClosed = response.data;
                });
            },
        );
    }

    @autobind
    @action
    closeWelcomeModal() {
        SystemMessage.seen(SystemMessage.ids.ceLearnerNewUIWelcomeModal);
        this.isWelcomeModalOpen = false;
    }

    @autobind
    @action
    setParentRef(parentRef: HTMLDivElement) {
        this.parentRef = parentRef;
    }

    @autobind
    @action
    onResizerStart() {
        this.isPanelResizing = true;
    }

    @autobind
    @action
    onResizerEnd() {
        this.isPanelResizing = false;
        this.codeEditorStore.triggerResize();
    }

    @action
    reset() {
        this.initializeFiles();
        this.scheduleAutoSave();
        this.resultStore.reset();
        this.saveCodingExercise();
    }

    @action
    initializeFiles() {
        this.codeEditorStore.files = this._mapFiles(this.question.prompt.initial_files);
        this.systemFiles = this._mapFiles(this.question.prompt.system_files);
        this.selectFile(
            this.codeEditorStore.files.length > 0 ? this.codeEditorStore.files[0] : undefined,
        );
        this.updateCombinedFiles();
    }

    _mapFiles(files: File[]): FileModel[] {
        if (!files) {
            return [];
        }
        let fileModels = files.map((file) => new FileModel(file));
        if (this.isReact) {
            // jsx type must be added to js files for react ce. Otherwise, ace editor gives false
            // negative syntax errors.
            fileModels = fileModels.map((file) => this._addFileTypeToJsFiles(file));
        }
        return fileModels;
    }

    _addFileTypeToJsFiles(file: FileModel): FileModel {
        if (!file.type) {
            const ext = file.fileName.split('.').pop();
            if (ext === 'js') {
                file.type = 'jsx';
            }
        }
        return file;
    }

    @action
    selectFile(file: FileModel | undefined) {
        this.codeEditorStore.selectFile(file);
    }

    @autobind
    @action
    updateCursorPosition(line: number, column: number) {
        try {
            this.currentLine = line;
            this.currentColumn = column;
        } catch (e) {
            Raven.captureException(`Letter repeating updateCursorPosition ${e}`);
            throw new Error(`Letter repeating updateCursorPosition ${e}`);
        }
    }

    @action
    loadStudentFiles() {
        if (!this.attempt) {
            this.studentFilesLoaded = true;
            this.resultStore.isFirstTimeOpening = false;
            return this.quizViewStore.createNewAttempt();
        }

        if (
            this.courseTakingStore.isUserInstructor &&
            this.courseTakingStore.canUserEditCourse &&
            !this.courseTakingStore.isPreviewingAsStudent
        ) {
            this.studentFilesLoaded = true;
            this.resultStore.isFirstTimeOpening = false;
            return Promise.resolve();
        }

        return udApi
            .get(
                `/users/me/subscribed-courses/${this.courseTakingStore.courseId}/user-attempted-quizzes/${this.attempt.id}/coding-exercise-answers/`,
            )
            .then(
                action((value: AxiosResponse<{results: UserAnswersAssessment[]}>) => {
                    const results: UserAnswersAssessment[] = value.data.results || [];
                    if (
                        results.length > 0 &&
                        results[0].response.files &&
                        results[0].response.files.length > 0
                    ) {
                        this.codeEditorStore.files = this._mapFiles(results[0].response.files);
                        this.updateCombinedFiles();
                        if (this.codeEditorStore.files && this.codeEditorStore.files.length > 0) {
                            this.selectFile(this.codeEditorStore.files[0]);
                        }
                    }
                    if (
                        results.length > 0 &&
                        results[0].response &&
                        results[0].response.evaluation_result
                    ) {
                        if (results[0].response.evaluation_result.isOutputEvaluation) {
                            this.outputResponseHandler(results[0].response.evaluation_result);
                        } else {
                            this.evaluatorResponseHandler(results[0].response.evaluation_result);
                        }
                    }
                    this.studentFilesLoaded = true;
                    this.resultStore.isFirstTimeOpening = false;
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

    _transformFile(files: FileModel[]): File[] {
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
                        files: this._transformFile(this.codeEditorStore.files),
                    },
                    pusher_channel:
                        evaluate && this.eventHandler && this.eventHandler?.pusherChannel,
                    isOutputEvaluation: false,
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
                        this._evaluatorErrorHandler('backend_error', false);
                    }
                }),
            )
            .finally(
                action(() => {
                    clearTimeout(this.saveTimerId);
                    this.saveTimerId = undefined;

                    if (this.autoSaveRequested) {
                        this.autoSaveRequested = false;
                        this.scheduleAutoSave();
                    }
                }),
            );
    }

    @autobind
    @action
    runCodingExercise() {
        const activeOutputFile = {
            file_name: this.codeEditorStore.activeFile?.fileName ?? '',
            content: this.codeEditorStore.activeFile?.content ?? '',
        };

        const outputTestFile = {
            file_name: this._languageSettings.outputRunnerFile.file_name,
            content: this._languageSettings.outputRunnerFile.content.replace(
                '{}',
                activeOutputFile.file_name.split('.').slice(0, -1).join('.'),
            ),
        };
        const testFiles = [outputTestFile];
        return udApi
            .post(
                `/users/me/subscribed-courses/${this.courseTakingStore.courseId}/user-attempted-quizzes/${this.attempt.id}/coding-exercise-answers/`,
                {
                    assessment_id: this.question.id,
                    response: {
                        files: this._transformFile(this.codeEditorStore.files),
                    },
                    pusher_channel: this.eventHandler?.pusherChannel,
                    test_files: testFiles,
                    isOutputEvaluation: true,
                },
            )
            .catch(
                action(() => {
                    this.eventHandler?.destroy();
                    this._evaluatorErrorHandler('backend_error', true);
                }),
            );
    }

    @autobind
    fallbackOnEvaluationResult() {
        this.resultStore.reset();
        this.setResult(false);
        // TODO: since UserAttemptedQuiz is updated, but not created everytime,
        // this needs to check UserAnswersAssessment.attempt (number)
        //
        // return udApi
        //     .get(
        //         `/users/me/subscribed-courses/${this.courseTakingStore.courseId}/user-attempted-quizzes/${this.attempt.id}/coding-exercise-answers/`,
        //     )
        //     .then(
        //         action((response: AxiosResponse<{results: UserAnswersAssessment[]}>) => {
        //             const userAnswersAssessment = response.data.results[0];
        //             if (userAnswersAssessment.response.evaluation_result) {
        //                 this.resultStore.hasPusherFailed = false;
        //                 this.evaluatorResponseHandler(
        //                     userAnswersAssessment.response.evaluation_result,
        //                 );
        //             } else {
        //                 this.evaluationResult = null;
        //                 this.selectedTestResult = null;
        //                 this.evaluatorFeedback = undefined;
        //                 this.logOutput = undefined;
        //                 this.setResult(false);
        //             }
        //         }),
        //     )
        //     .catch(
        //         action(() => {
        //             this.hasEvaluationFailed = true;
        //             this._evaluatorErrorHandler('backend_error');
        //         }),
        //     );
    }

    @autobind
    @action
    evaluatorResponseHandler(evaluatorResult: EvaluationResult) {
        this.resultStore.setEvaluationResult(evaluatorResult);
        this.attemptCount = evaluatorResult.attempts ?? 0;
        this.hasSucceededOnce = !!evaluatorResult.isCompleted;

        const {output} = evaluatorResult;
        this.setResult(evaluatorResult.success);

        if (!this.eventHandler?.pusherChannel?.toString()) return;

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
                userOutput: output.user_logs,
                duration: (
                    (new Date().getTime() - (this.evaluationStartDate?.getTime() ?? 0)) /
                    1000
                ).toString(),
                errorType,
                ceDisplay: 'new_ui',
                isOutputEvaluation: false,
            }),
        );
        udApiStat.increment('quiz.coding_exercise.frontend.evaluate.response');
    }

    @autobind
    @action
    outputResponseHandler(outputResult: EvaluationResult) {
        this.resultStore.setOutputResult(outputResult);

        this.setOutputResult();

        const {output, success} = outputResult;
        let errorType = null;
        if (!success) {
            if (output.compile_logs.length === 0) {
                errorType = 'test_error';
            } else {
                errorType = 'compile_error';
            }
        }
        Tracker.publishEvent(
            new CodingExerciseEvaluateResponseEvent({
                pusherChannelId: this.eventHandler?.pusherChannel?.toString(),
                success,
                evaluatorFeedback: this.evaluatorFeedback,
                userOutput: output.user_logs,
                duration: (
                    (new Date().getTime() - (this.evaluationStartDate?.getTime() ?? 0)) /
                    1000
                ).toString(),
                errorType,
                ceDisplay: 'new_ui',
                isOutputEvaluation: true,
            }),
        );
        udApiStat.increment('quiz.coding_exercise.frontend.runcode.response');
    }

    @action
    setResult(isCorrect: boolean) {
        this.isEvaluating = false;
        this.hasCheckedSolutionOnce = true;
        this.hasSolutionPassed = isCorrect;

        if (isCorrect && this.quizViewStore.quiz) {
            (this.quizViewStore.quiz as Quiz).setComplete();
            this.hasSucceededOnce = true;
        }
        this.resultAreaExpanded = true;
        this.editorExpanded = false;
    }

    @action
    setOutputResult() {
        this.isCodeRunning = false;

        this.resultAreaExpanded = true;
        this.editorExpanded = false;
    }

    @action
    _evaluatorErrorHandler(error: string, isOutputRun = false) {
        this.resultStore.fail();
        this.isEvaluating = false;
        this.isCodeRunning = false;
        this.editorExpanded = false;

        Tracker.publishEvent(
            new CodingExerciseEvaluateErrorEvent({
                pusherChannelId: this.eventHandler?.pusherChannel?.toString(),
                reason: error,
                ceDisplay: 'new_ui',
                isOutputEvaluation: isOutputRun,
            }),
        );
        if (isOutputRun) {
            udApiStat.increment(`quiz.coding_exercise.frontend.runcode.${error}`);
        } else {
            udApiStat.increment(`quiz.coding_exercise.frontend.evaluate.${error}`);
        }
    }

    @autobind
    @action
    timeoutHandler(isOutputRun = false) {
        this.resultStore.hasPusherFailed = true;
        Tracker.publishEvent(
            new CodingExerciseEvaluateErrorEvent({
                pusherChannelId: this.eventHandler?.pusherChannel?.toString(),
                reason: 'pusher_timeout',
                ceDisplay: 'new_ui',
                isOutputEvaluation: isOutputRun,
            }),
        );
        this.fallbackOnEvaluationResult();
    }

    @autobind
    onSubscriptionSucceeded(isOutputRun = false) {
        const requestStartDate = new Date();

        this.quizViewStore.track('answered-question', {
            answer: {files: this.codeEditorStore.files},
        });

        if (isOutputRun) {
            return this.runCodingExercise()
                .then(() => {
                    Tracker.publishEvent(
                        new CodingExerciseEvaluateSuccessEvent({
                            pusherChannelId: this.eventHandler?.pusherChannel?.toString(),
                            duration: (
                                (new Date().getTime() - requestStartDate.getTime()) /
                                1000
                            ).toString(),
                            isOutputEvaluation: true,
                        }),
                    );
                })
                .catch(() => {
                    this._evaluatorErrorHandler('backend_error', true);
                    this.eventHandler?.destroy();
                });
        }

        return this.saveCodingExercise(true)
            .then(() => {
                Tracker.publishEvent(
                    new CodingExerciseEvaluateSuccessEvent({
                        pusherChannelId: this.eventHandler?.pusherChannel?.toString(),
                        duration: (
                            (new Date().getTime() - requestStartDate.getTime()) /
                            1000
                        ).toString(),
                        isOutputEvaluation: false,
                    }),
                );
            })
            .catch(() => {
                this._evaluatorErrorHandler('backend_error', false);
                this.eventHandler?.destroy();
            });
    }

    @autobind
    onSubscriptionError(isOutputRun = false) {
        this._evaluatorErrorHandler('pusher_subscription_error', isOutputRun);
    }

    @autobind
    @action
    evaluate() {
        if (this.isEvaluating || this.isCodeRunning) {
            return;
        }

        this.isEvaluating = true;
        this.resultStore.setEvaluating();

        if (this.eventHandler) {
            this.eventHandler.destroy();
        }

        this.eventHandler = new PusherEventHandler(
            pusherResultHandlerWrapper(this.evaluatorResponseHandler),
            () => this.timeoutHandler(false),
            () => this.onSubscriptionSucceeded(false),
            () => this.onSubscriptionError(false),
            udConfig.third_party.pusher.coding_exercise_event,
        );

        Tracker.publishEvent(
            new CodingExerciseEvaluateSubmitEvent({
                pusherChannelId: this.eventHandler?.pusherChannel?.toString(),
                assessmentId: this.question.id,
                userType: 'student',
                ceDisplay: 'new_ui',
                isOutputEvaluation: false,
            }),
        );
        udApiStat.increment('quiz.coding_exercise.frontend.evaluate.start');

        this.evaluationStartDate = new Date();
    }

    @autobind
    @action
    runCode() {
        if (this.isEvaluating || this.isCodeRunning) {
            return;
        }

        this.isCodeRunning = true;
        this.resultStore.setEvaluating();

        if (this.eventHandler) {
            this.eventHandler.destroy();
        }

        this.eventHandler = new PusherEventHandler(
            pusherResultHandlerWrapper(this.outputResponseHandler),
            () => this.timeoutHandler(true),
            () => this.onSubscriptionSucceeded(true),
            () => this.onSubscriptionError(true),
            udConfig.third_party.pusher.coding_exercise_event,
        );

        Tracker.publishEvent(
            new CodingExerciseEvaluateSubmitEvent({
                pusherChannelId: this.eventHandler?.pusherChannel?.toString(),
                assessmentId: this.question.id,
                userType: 'student',
                ceDisplay: 'new_ui',
                isOutputEvaluation: true,
            }),
        );
        udApiStat.increment('quiz.coding_exercise.frontend.runcode.start');

        this.evaluationStartDate = new Date();
    }

    @autobind
    @action
    codeEditorOnFileUpdated() {
        this.updateCombinedFiles();
        this.scheduleAutoSave();
    }

    @autobind
    @action
    updateCombinedFiles() {
        this.combinedFiles = this.systemFiles.concat(this.codeEditorStore.files);
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

    @computed
    get languageLogPlaceholders() {
        const currentLanguage = (this.question.prompt.language || '').toLowerCase();
        const language = getCodingLanguage(currentLanguage.toUpperCase());
        if (language) return [language.loggingExample];
        return [];
    }

    @autobind
    trackEvent(action: string, uiType = this.eventUITypeDefaultValue) {
        const language = (this.question.prompt.language || '').toLowerCase();
        Tracker.publishEvent(
            new CodingExerciseStudentActionEvent({
                action,
                assessmentId: this.question.id,
                language,
                ceDisplay: uiType,
            }),
        );
    }

    @autobind
    trackFileEvent(action: string, fileName: string) {
        const language = this.question.prompt.language.toLowerCase();
        Tracker.publishEvent(
            new CodingExerciseFileStudentActionEvent({
                action,
                assessmentId: this.question.id,
                fileName,
                language,
            }),
        );
    }

    @computed
    get statusText() {
        let statusText;
        switch (this.savingStatus) {
            case SAVING_STATUS.SAVING:
                statusText = messages.savingChanges;
                break;
            case SAVING_STATUS.SUCCESS:
                statusText = messages.allChangesSaved;
                break;
            case SAVING_STATUS.ERROR:
                statusText = messages.errorSavingChanges;
                break;
            default:
                statusText = undefined;
        }
        return statusText;
    }

    @computed
    get isHintsTabUnlocked(): boolean {
        return this.hasSucceededOnce || this.attemptCount > this.hintsAttemptCountToUnlock;
    }

    @computed
    get hintsUnlockedPopoverOpen(): boolean {
        return (
            !this.hasSucceededOnce &&
            this.attemptCount > this.hintsAttemptCountToUnlock &&
            !this.hintsUnlockedPopoverClosed
        );
    }

    @autobind
    @action
    hideHintsUnlockedPopover() {
        this.hintsUnlockedPopoverClosed = true;
        SystemMessage.seen(SystemMessage.ids.ceLearnerHintUnlockedPopoverDismissed);
    }

    @autobind
    @action
    showHintsLockedPopover() {
        if (this.isHintsTabUnlocked || this.solutionLockedPopoverOpen) {
            this.hintsLockedPopoverOpen = false;
            return;
        }
        this.hintsLockedPopoverOpen = true;
    }

    @autobind
    @action
    hideHintsLockedPopover() {
        this.hintsLockedPopoverOpen = false;
    }

    @computed
    get isSolutionTabUnlocked(): boolean {
        return this.hasSucceededOnce || this.attemptCount > this.solutionAttemptCountToUnlock;
    }

    @computed
    get solutionUnlockedPopoverOpen(): boolean {
        return (
            !this.hasSucceededOnce &&
            this.attemptCount > this.solutionAttemptCountToUnlock &&
            !this.solutionUnlockedPopoverClosed
        );
    }

    @autobind
    @action
    hideSolutionUnlockedPopover() {
        this.solutionUnlockedPopoverClosed = true;
        SystemMessage.seen(SystemMessage.ids.ceLearnerSolutionUnlockedPopoverDismissed);
    }

    @autobind
    @action
    showSolutionLockedPopover() {
        if (this.isSolutionTabUnlocked || this.hintsLockedPopoverOpen) {
            this.solutionLockedPopoverOpen = false;
            return;
        }
        this.solutionLockedPopoverOpen = true;
    }

    @autobind
    @action
    hideSolutionLockedPopover() {
        this.solutionLockedPopoverOpen = false;
    }

    @computed
    get isPopoverCouldBeShown() {
        return !this.problemAreaHidden && !this.editorExpanded && !this.previewExpanded;
    }

    get isSQL(): boolean {
        return (
            this.question.prompt.language === 'SQL' || this.question.prompt.language === 'SQLITE3'
        );
    }

    get isReact(): boolean {
        return (
            this.question.prompt.language === 'REACT16' ||
            this.question.prompt.language === 'REACT18'
        );
    }
}
