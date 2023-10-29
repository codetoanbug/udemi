import {action, observable} from 'mobx';

import {debounce} from '@udemy/shared-utils';

import {FunnelTracking, FunnelLogCourse, FunnelLogContext, LoggingInfo} from './funnel-tracking';
import {CoursePriceStore} from './types/fake-browse-course-types';

export class FunnelLogContextStore {
    pendingItems: Map<number | string, FunnelLogCourse>;
    loggedItemIds: Set<number | string>;
    @observable
    context?: string;
    @observable
    context2?: string;
    @observable
    subcontext?: string;
    @observable
    subcontext2?: string;
    priceStore: CoursePriceStore;

    constructor(
        {context, context2, subcontext, subcontext2}: FunnelLogContext,
        priceStore: CoursePriceStore,
    ) {
        this.context = context;
        this.context2 = context2;
        this.subcontext = subcontext;
        this.subcontext2 = subcontext2;
        this.pendingItems = new Map();
        this.loggedItemIds = new Set();
        this.priceStore = priceStore;
    }

    @action
    updateContext = (contextObj: FunnelLogContext) => {
        Object.assign(this, contextObj);
    };

    get contextObj() {
        const {context, context2, subcontext, subcontext2} = this;
        return {context, context2, subcontext, subcontext2};
    }

    markAsSeen = (item: FunnelLogCourse, funnelLogContext?: FunnelLogContext) => {
        const funnelLogCourse: FunnelLogCourse = {...item, ...this.contextObj, ...funnelLogContext};
        if (!this.loggedItemIds.has(item.id) && !this.pendingItems.has(item.id)) {
            this.pendingItems.set(item.id, funnelLogCourse);
            this.debouncedTrackEvents();
        }
    };

    logAction = (
        action: string,
        courses: FunnelLogCourse[],
        funnelLogContext?: FunnelLogContext,
    ) => {
        const loggingInfo: LoggingInfo = {courses, ...this.contextObj, ...funnelLogContext};
        return FunnelTracking.requestToFunnelAPI(action, loggingInfo, this.priceStore);
    };

    trackEvents = () => {
        if (this.pendingItems.size > 0) {
            if (!this.priceStore.isLoading) {
                const loggingInfo = {courses: [...this.pendingItems.values()], ...this.contextObj};
                FunnelTracking.requestToFunnelAPI('mark-as-seen', loggingInfo, this.priceStore);
                this.pendingItems.forEach((item) => {
                    this.loggedItemIds.add(item.id);
                });
                this.pendingItems.clear();
            } else {
                this.debouncedTrackEvents();
            }
        }
    };

    debouncedTrackEvents = debounce(this.trackEvents, 1000);
}
