import {action, observable} from 'mobx';

import loadMeasureCompetenceUnit from 'browse/lib/load-measure-competence-assessments-unit';

import {AssessmentType, TestletAttemptType} from './types';

export class AssessmentHighlightStore {
    @observable.ref latestTestletAttempt?: TestletAttemptType;
    @observable isLoading = true;
    @observable assessment?: AssessmentType;
    @observable learningPathId: number;

    constructor(learningPathId: number) {
        this.learningPathId = learningPathId;
    }

    @action
    setAssessment(assessment: AssessmentType) {
        this.assessment = assessment;
    }

    @action
    setLatestTestletAttempt(latestTestletAttempts: TestletAttemptType[]) {
        this.latestTestletAttempt = latestTestletAttempts.find(
            (attempt) => attempt.groupId === this.assessment?.id,
        );
        this.isLoading = false;
    }

    async fetchLatestAttempt() {
        try {
            this.setLatestTestletAttempt(
                // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
                await loadMeasureCompetenceUnit(false, this.learningPathId),
            );
        } catch (e) {
            this.setLatestTestletAttempt([]);
        }
    }
}
