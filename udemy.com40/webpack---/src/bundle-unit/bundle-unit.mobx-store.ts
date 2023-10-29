import {action, observable} from 'mobx';

import {
    attachFrontendTrackingIds,
    DiscoveryItemImpressionEvent,
} from '@udemy/browse-event-tracking';
import {DiscoveryAPI, BundleDiscoveryUnitItem, DiscoveryUnit} from '@udemy/discovery-api';
import {UDData} from '@udemy/ud-data';

export class BundleUnitStore {
    constructor(
        pageType: string,
        pageObjectId: string | number,
        udData: UDData,
        unit: DiscoveryUnit | undefined = undefined,
    ) {
        this.pageType = pageType;
        this.pageObjectId = pageObjectId;
        this.loading = false;
        this.unit = unit;
        this.discoveryAPI = new DiscoveryAPI({}, udData);

        if (this.unit) {
            this.handleBundleUnit();
        }
    }

    pageType: string;
    pageObjectId: string | number;

    discoveryAPI: DiscoveryAPI;
    @observable error: unknown;
    @observable loading: boolean;
    @observable unit: DiscoveryUnit | undefined;

    backendSource = DiscoveryItemImpressionEvent.backendSourceOptions.DISCOVERY;

    // Handle the case when discovery api returns a bundle instead of a learning pack
    handleBundleUnit = () => {
        if (this.unit?.type === 'bundle') {
            const bundle = this.unit.items[0] as BundleDiscoveryUnitItem;
            this.unit.items = bundle.buyables;
        }
    };

    @action
    async fetchData(params?: Record<string, unknown>) {
        if (this.unit) {
            this.loading = false;
            return;
        }

        try {
            this.loading = true;
            const {results: units} = await this.discoveryAPI.loadUnits(this.pageType, {
                pageObjectId: this.pageObjectId as number,
                ...params,
            });
            this.receiveUnit(units);
            return units;
        } catch (error) {
            this.onError(error);
        }
    }

    // TODO: markAsSeen

    @action
    onError(error: unknown) {
        this.loading = false;
        this.error = error;
    }

    @action
    receiveUnit(units: DiscoveryUnit[]) {
        this.loading = false;
        this.unit = units[0] || {};
        this.handleBundleUnit();
        if (this.unit.items) {
            attachFrontendTrackingIds(this.unit.items);
        }
    }
}
