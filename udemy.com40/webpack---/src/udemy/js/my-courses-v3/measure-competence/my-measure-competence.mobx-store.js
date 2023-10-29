import {action, observable} from 'mobx';

import loadMeasureCompetenceUnit from 'browse/lib/load-measure-competence-assessments-unit';

export default class MyMeasureCompetenceStore {
    @observable.ref latestTestletAttempts = [];
    @observable isLoading = true;
    constructor(isConsumerSubsSubscriber = false) {
        this.isConsumerSubsSubscriber = isConsumerSubsSubscriber;
    }

    @action
    setLatestTestletAttempts(latestTestletAttempts) {
        this.latestTestletAttempts = latestTestletAttempts;
        this.latestTestletAttempts.unshift({
            id: -1,
            type: 'getStarted',
        });
        this.isLoading = false;
    }

    async fetchLatestAttempts() {
        try {
            this.setLatestTestletAttempts(
                await loadMeasureCompetenceUnit(this.isConsumerSubsSubscriber),
            );
        } catch (e) {
            this.setLatestTestletAttempts([]);
        }
    }
}
