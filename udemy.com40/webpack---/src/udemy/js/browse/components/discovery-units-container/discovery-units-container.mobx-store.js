import {observable, extendObservable, action} from 'mobx';

import {DiscoveryItemImpressionEvent} from 'browse/events';
import DiscoveryAPI from 'browse/lib/backends/discovery-api';
import UnitProcessor from 'browse/lib/unit-processor';
import {attachFrontendTrackingIds} from 'browse/tracking';

export default class DiscoveryUnitsContainerStore {
    /**
     * @param {{units?: any[]; pageType?: string; pageObjectId?: number | null; pageObject?: any;}} args
     * @param {Object} globalOverrides UDData object to feed DiscoveryAPI params
     */
    constructor(
        {units = [], pageType, pageObjectId = null, pageObject} = {},
        globalOverrides = {},
    ) {
        extendObservable(
            this,
            {
                units,
                loading: false,
                error: null,
                firstLoad: !units.length,
            },
            {
                units: observable.shallow,
            },
        );
        this.pageType = pageType;
        this.pageObjectId = pageObjectId;
        this.pageObject = pageObject;
        this.from = units.length;
        this.discoveryAPI = new DiscoveryAPI({}, globalOverrides);
    }

    backendSource = DiscoveryItemImpressionEvent.backendSourceOptions.DISCOVERY;
    pageSize = 3;
    itemCount = 12;
    hasMore = true;

    @action
    async fetchUnits(options) {
        try {
            if (this.loading || !this.hasMore || this.error) {
                return;
            }
            this.loading = true;
            const requestOptions = this.getRequestOptions(options);
            const response = await this.discoveryAPI.loadUnits(this.pageType, requestOptions);
            const units = response.results;
            this.receiveUnits(units);
            this.from = response.last_index + 1;
            this.hasMore = response.has_more;
            return units;
        } catch (e) {
            this.receiveError(e);
        } finally {
            this.removeFirstLoad();
        }
    }

    getRequestOptions(options = {}) {
        const defaultOptions = {
            from: this.from,
            pageSize: this.pageSize,
            itemCount: this.itemCount,
        };
        return {
            ...(this.pageObjectId && {pageObjectId: this.pageObjectId}),
            ...this.pageObject,
            ...defaultOptions,
            ...options,
        };
    }

    @action
    processPreloadedUnits() {
        const requestOptions = this.getRequestOptions({from: 0});
        this.units = UnitProcessor.processUnits(requestOptions, this.units, this.pageType);
    }

    @action('Receive units')
    receiveUnits(units) {
        for (const unit of units) {
            if (unit.items) {
                attachFrontendTrackingIds(unit.items);
            }
        }
        this.loading = false;
        const allUnits = this.units.concat(units);
        const requestOptions = this.getRequestOptions();
        this.units = UnitProcessor.processUnits(requestOptions, allUnits, this.pageType);
    }

    @action
    receiveError(error) {
        this.loading = false;
        this.error = error;
    }

    @action
    removeFirstLoad() {
        this.firstLoad = false;
    }
}
