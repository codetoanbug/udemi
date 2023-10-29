import {action, computed, extendObservable, observable, runInAction} from 'mobx';

import {BrowseCourse} from '@udemy/browse-course';
import {AvailableFiltersUnit, DiscoveryAPI} from '@udemy/discovery-api';
import {udApi} from '@udemy/ud-api';

export interface EnrollmentStatsResponse {
    [topicId: string]: {
        name: string;
        stat_value: number;
    };
}

export class SubcategoryUnitStore {
    @observable readonly unit: AvailableFiltersUnit;
    @observable selectedUnitUrl: string;
    @observable showAllUrl?: string;
    pageType: string;
    discoveryAPI: DiscoveryAPI;

    constructor(unit: AvailableFiltersUnit, pageType: string) {
        this.unit = unit;
        this.selectedUnitUrl = this.unit.available_filters?.units[0].url ?? '';

        // We need to add num_enrollments fields to all filter units so that
        // they will be picked up by MobX and made observable
        for (const filterUnit of this.unit.available_filters?.units ?? []) {
            if (!('num_enrollments' in filterUnit)) {
                extendObservable(filterUnit, {num_enrollments: undefined});
            }
        }
        this.pageType = pageType;
        this.discoveryAPI = new DiscoveryAPI({});
    }

    @computed
    get activeUnit() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let activeUnit: any = this.unit;
        if (this.selectedUnitUrl !== this.unit.url) {
            const foundUnit = this.unit.available_filters?.units.find(
                (unit) => unit.url === this.selectedUnitUrl,
            );
            if (foundUnit) {
                activeUnit = foundUnit;
            }
        }

        return activeUnit;
    }

    @action
    setSelectedUnitUrl(url: string) {
        this.selectedUnitUrl = url;
    }

    @action
    setShowAllUrl(url: string) {
        this.showAllUrl = url;
    }

    async loadShowAllUrl() {
        const response = await this.discoveryAPI.loadItemsForUnit<BrowseCourse>(
            this.unit,
            this.pageType,
            {},
        );
        runInAction(() => {
            const sourceObject = response.unit.source_objects?.[0];
            if (sourceObject?.url) {
                this.showAllUrl = sourceObject.url;
            }
        });
    }

    async populateEnrollmentStats() {
        const topicIds = this.unit.available_filters?.units
            .map((topicUnit) => topicUnit.label_id)
            .join(',');
        const response = await udApi.get<EnrollmentStatsResponse>(
            `/structured-data/enrollment-stats/?topic_ids=${topicIds}`,
        );

        runInAction(() => {
            for (const [topicId, stats] of Object.entries(response.data)) {
                const topicUnit = this.unit.available_filters?.units.find(
                    (topicUnit) => String(topicUnit.label_id) === topicId,
                );
                if (topicUnit) {
                    topicUnit.num_enrollments = stats.stat_value;
                }
            }
        });
    }
}
