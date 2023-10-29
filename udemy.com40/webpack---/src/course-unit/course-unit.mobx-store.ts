import {action, observable} from 'mobx';

import {BrowseCourse} from '@udemy/browse-course/src';
import {
    attachFrontendTrackingIds,
    DiscoveryItemImpressionEvent,
} from '@udemy/browse-event-tracking';
import {DiscoveryAPI, DiscoveryAPIOptions, DiscoveryUnit} from '@udemy/discovery-api';
import {UDData} from '@udemy/ud-data';

export class CourseUnitStore {
    @observable error?: unknown;
    @observable hasMore?: boolean;
    @observable loading = false;
    pageType: string;
    trackingId?: string;
    @observable unit: DiscoveryUnit;
    discoveryAPI: DiscoveryAPI;

    static readonly STORE_ID = 'CourseUnitStore';

    constructor(pageType: string, unit: DiscoveryUnit, globalOverrides?: UDData) {
        this.pageType = pageType;
        this.unit = unit;
        this.hasMore = unit.remaining_item_count !== 0;
        attachFrontendTrackingIds(this.unit.items);
        this.discoveryAPI = new DiscoveryAPI({}, globalOverrides);
    }

    backendSource = DiscoveryItemImpressionEvent.backendSourceOptions.DISCOVERY;

    @action
    async fetchUnit(options: DiscoveryAPIOptions = {}) {
        if (!this.hasMore || this.loading) {
            return;
        }
        this.loading = true;
        if (this.unit.items && this.unit.items.length) {
            options.lastCourseId = this.unit.items[this.unit.items.length - 1].id;
        }
        if (this.trackingId) {
            options.refTrackingId = this.trackingId;
        }
        try {
            const unit = await this.discoveryAPI.loadItemsForUnit<BrowseCourse>(
                this.unit,
                this.pageType,
                options,
            );
            this.trackingId = unit.tracking_id;
            this.receiveUnit(unit);
            return unit;
        } catch (e) {
            this.receiveUnitError(e);
        }
    }

    @action
    receiveUnit(unit: DiscoveryUnit) {
        this.hasMore = !!unit.remaining_item_count;
        this.loading = false;
        this.unit.items = this.unit.items.concat(unit.items);
        attachFrontendTrackingIds(this.unit.items);
    }

    @action
    receiveUnitError(error: unknown) {
        this.loading = false;
        this.error = error;
    }
}
