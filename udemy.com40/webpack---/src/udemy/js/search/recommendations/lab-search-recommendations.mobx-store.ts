import {action, observable, runInAction} from 'mobx';

import {
    LabSearchResponse,
    SearchAggregationInputOption,
    useLabSearchResponseQuery,
} from 'gql-codegen/api-platform-graphql';

import {LabRecommendation} from './lab-recommendation.mobx-model';

export class LabSearchRecommendationsStore {
    @observable error?: string;
    @observable isLoading = true;
    @observable.ref labs: LabRecommendation[] = [];
    @observable trackingId?: string;

    constructor() {
        this.setInitialState();
    }

    setInitialState() {
        this.error = undefined;
        this.isLoading = true;
    }

    @action
    async fetchLabsByQuery(query: string, filters?: [SearchAggregationInputOption]) {
        this.setInitialState();
        try {
            const response = await useLabSearchResponseQuery.fetcher({query, filters})();
            runInAction(() => {
                const labResults = response?.searchLabs as LabSearchResponse;
                this.labs = labResults.labs.map((lab) => new LabRecommendation(lab));
                this.trackingId = labResults.trackingId;
            });
        } catch (e) {
            runInAction(() => {
                this.error = (e as Error).message;
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }
}
