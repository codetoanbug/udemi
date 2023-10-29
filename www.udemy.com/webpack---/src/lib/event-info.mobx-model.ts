import autobind from 'autobind-decorator';
import {computed, observable, action} from 'mobx';

import {EventStatus} from '../tracker/constants';
import {TrackingEvent} from '../tracker/event-common';

export class EventInfo {
    constructor(
        public event: TrackingEvent,
        public status: EventStatus,
        public failureReason?: string,
    ) {}
}

export class EventInfoStore {
    @observable eventInfosById: Map<string, EventInfo> = new Map();

    static readonly MAX_EVENT_SHOWN = 100;

    @autobind
    @action
    updateEventStatus(event: TrackingEvent, status: EventStatus, failureReason?: string) {
        this.eventInfosById.set(event.eventId, new EventInfo(event, status, failureReason));

        if (this.eventInfosById.size > EventInfoStore.MAX_EVENT_SHOWN) {
            // remove the oldest event
            const toRemove = this.eventInfos[0];
            this.eventInfosById.delete(toRemove.event.eventId);
        }
    }

    @autobind
    @action
    clearEvents() {
        this.eventInfosById.clear();
    }

    @computed get eventInfos() {
        return Array.from(this.eventInfosById.values());
    }
}
