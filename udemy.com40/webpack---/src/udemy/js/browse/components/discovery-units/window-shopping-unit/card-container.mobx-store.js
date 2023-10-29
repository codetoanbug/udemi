import {extendObservable, action} from 'mobx';

import {DiscoveryItemImpressionEvent} from 'browse/events';
import DiscoveryAPI from 'browse/lib/backends/discovery-api';
import {attachFrontendTrackingIds} from 'browse/tracking';

export default class CardContainerStore {
    constructor(pageType, unit, globalOverrides = {}) {
        this.pageType = pageType;
        extendObservable(this, {
            unit,
            loading: false,
            error: null,
        });
        attachFrontendTrackingIds(this.unit.items);
        this.discoveryAPI = new DiscoveryAPI({}, globalOverrides);
    }

    backendSource = DiscoveryItemImpressionEvent.backendSourceOptions.DISCOVERY;

    @action
    async fetchUnit(options) {
        if (this.loading) {
            return;
        }
        this.loading = true;
        try {
            const {unit} = await this.discoveryAPI.loadItemsForUnit(
                this.unit,
                this.pageType,
                options,
            );
            this.receiveUnit(unit);
        } catch (e) {
            this.receiveError(e);
        }
    }

    @action
    receiveUnit(unit) {
        this.loading = false;
        this.unit.items = this.unit.items.concat(unit.items);
        attachFrontendTrackingIds(this.unit.items);
    }

    @action
    receiveError(error) {
        this.loading = false;
        this.error = error;
    }
}
