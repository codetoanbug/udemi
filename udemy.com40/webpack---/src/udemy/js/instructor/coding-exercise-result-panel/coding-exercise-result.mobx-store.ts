import {noop} from '@udemy/shared-utils';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {getCodingLanguage} from './constants';
import * as messages from './messages';
import {EvaluationResult, NotificationType, RunCodeResult, StoreProps, TestResult} from './types';

export class CodingExerciseResultStore {
    @observable resultAreaExpanded = false;

    language: string;
    @observable hasPusherFailed = false;
    @observable hasEvaluationFailed = false;
    @observable isEvaluating = false;
    @observable hasCheckedSolutionOnce = false;
    @observable hasSolutionPassed = false;
    @observable isOutputEvaluation = false;

    @observable mainPanelHeight?: number;
    @observable tcPanelWidth?: number;
    setPanelHeight?: (value?: number) => void = action((value?: number) => {
        this.mainPanelHeight = value;
        value && this.onMainPanelHeightChange?.(value);
    });

    setTCPanelWidth?: (value: number) => void = action((value: number) => {
        this.tcPanelWidth = value;
        this.onTCPanelWidthChange?.(value);
    });

    onMainPanelHeightChange?: (value: number) => void;
    onTCPanelWidthChange?: (value: number) => void;

    onResizerStart?: (value: number) => void = noop;
    onResizerEnd?: (value: number) => void = noop;
    onToggle?: () => void = noop;
    trackEvent: (value: string) => void = noop;

    @observable evaluationResult: EvaluationResult | null = null;
    @observable selectedTestResult: TestResult | null = null;
    @observable evaluatorFeedback?: string;
    @observable runCodeResult: RunCodeResult | null = null;
    @observable isFirstTimeOpening = true;

    constructor(props: StoreProps) {
        this.language = props.language;
        this.trackEvent = props.trackEvent;
        this.onMainPanelHeightChange = props.onMainPanelHeightChange;
        this.onTCPanelWidthChange = props.onTCPanelWidthChange;
        props.onResizerStart && (this.onResizerStart = props.onResizerStart);
        props.onResizerEnd && (this.onResizerEnd = props.onResizerEnd);
        props.onToggle && (this.onToggle = props.onToggle);
        props.mainPanelHeight && (this.mainPanelHeight = props.mainPanelHeight);
        props.tcPanelWidth && (this.tcPanelWidth = props.tcPanelWidth);
    }

    @autobind
    @action
    toggleResultArea() {
        this.setResultAreaExpanded(!this.resultAreaExpanded);
    }

    @autobind
    @action
    setResultAreaExpanded(value: boolean) {
        this.resultAreaExpanded = value;
        if (value && !this.isFirstTimeOpening) {
            this.onToggle?.();
        } else if (!value) {
            this.onToggle?.();
        } else {
            this.isFirstTimeOpening = false;
        }
    }

    @action
    reset() {
        this.evaluatorFeedback = '';
        this.hasCheckedSolutionOnce = false;
        this.setResultAreaExpanded(false);
        this.evaluationResult = null;
        this.selectedTestResult = null;
    }

    @action
    fail() {
        this.isEvaluating = false;
        this.hasCheckedSolutionOnce = true;
        this.hasEvaluationFailed = true;
        this.hasSolutionPassed = false;
        this.hasPusherFailed = false;
        this.evaluationResult = null;
        this.runCodeResult = null;
        this.selectedTestResult = null;
        this.setResultAreaExpanded(true);
    }

    @action
    setEvaluating() {
        this.isEvaluating = true;
        this.setResultAreaExpanded(false);
        this.hasEvaluationFailed = false;
    }

    @action
    setEvaluationResult(result: EvaluationResult) {
        this.hasCheckedSolutionOnce = true;
        this.hasSolutionPassed = result.success;
        this.isEvaluating = false;
        this.setResultAreaExpanded(true);
        this.isOutputEvaluation = false;

        this.evaluationResult = result;
        const testResults = result.output.test_results;
        if (testResults.length > 0) {
            this.selectedTestResult = testResults.find((result) => !result.pass) ?? testResults[0];
        }
        const {output} = result;
        this.evaluatorFeedback = output.feedback?.length
            ? output.feedback
            : output.evaluator_logs ?? output.compile_logs;
    }

    @action
    setOutputResult(result: RunCodeResult) {
        this.setResultAreaExpanded(true);
        this.isOutputEvaluation = true;
        // TODO handle this part with result area changes

        this.runCodeResult = result;
    }

    @computed
    get languageLogPlaceholders() {
        const language = getCodingLanguage(this.language.toUpperCase());
        if (language) return [language.loggingExample];
        return [];
    }

    get isSQL(): boolean {
        return this.language === 'SQL' || this.language === 'SQLITE3';
    }

    @computed
    get isTimeout(): boolean {
        return !!(
            this.evaluationResult &&
            !this.evaluationResult.success &&
            this.evaluationResult.output.evaluator_logs?.includes(
                'Your code took too long to execute.',
            )
        );
    }

    @computed
    get notification(): NotificationType {
        const success = !this.hasEvaluationFailed && this.evaluationResult?.success;
        const compileError =
            !this.evaluationResult?.success &&
            this.evaluationResult?.output.test_results.length === 0;
        const sqlCompileError =
            this.isSQL &&
            !this.evaluationResult?.success &&
            this.evaluationResult?.output.feedback === '';

        if (compileError) return messages.generalCompileError;
        if (sqlCompileError) return messages.sqlCompileError;
        if (this.hasPusherFailed) return messages.systemErrorMessage;
        if (this.hasEvaluationFailed) return messages.systemErrorMessage;
        if (this.isTimeout) return messages.timeoutErrorMessage;
        if (success) return messages.correctSolution;
        return messages.inCorrectSolution;
    }
}
