import {action, observable} from 'mobx';

import {TEST_BUILD_TYPE} from 'lab-taking/tasks/structured/constants';

import {AutomatedReviewRunTestResultData, AutomatedReviewTestRunData} from './types';

export class AutomatedReviewTestRun {
    @observable declare id: number;
    @observable completionMode?: string;

    @observable results: AutomatedReviewRunTestResultData[] = [];
    @observable buildErrorMessage?: string;
    @observable isBuildError = false;
    @observable numberOfAttempts = 0;

    constructor(data: AutomatedReviewTestRunData) {
        this.id = data.id;
        this.completionMode = data.completion_mode;
        data.automated_review_test_result && this.setResults(data.automated_review_test_result);
    }

    @action
    setResults(results: AutomatedReviewRunTestResultData[]) {
        this.setIsBuildError(false);
        this.numberOfAttempts += 1;
        // backend returns an extra test for the type: build. If the build failed (e.g. there is a syntax error in the code),
        // we display an error message. Otherwise, we don't display this build message.
        if (results?.some((result) => !result.is_correct && result.type === TEST_BUILD_TYPE)) {
            return this.setErrorStateBuild(results[0].test_message);
        }
        this.results = results.filter((result) => result.type !== TEST_BUILD_TYPE);
    }

    @action
    private setErrorStateBuild(message: string) {
        this.setIsBuildError(true);
        this.buildErrorMessage = message;
    }

    private setIsBuildError(value: boolean) {
        this.isBuildError = value;
    }
}
