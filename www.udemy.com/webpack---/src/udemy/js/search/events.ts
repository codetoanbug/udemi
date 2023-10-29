/**
 * Fired when a search item is seen by a user
 */
import {Tracker, ClientEvent} from '@udemy/event-tracking';

import {BackendSourceOptions} from 'browse/events';

const alreadyTrackedUUIDs = new Set();

export interface LearningItem {
    id: number;
    tracking_id: string;
}

export interface TrackingContext {
    backendSource: BackendSourceOptions;
    searchTrackingId?: string;
    trackingId?: string;
    index: number;
    trackImpressionFunction?: (item: LearningItem, searchTrackingId: string) => void;
    uiRegion?: string;
}

export function trackSearchCourseImpression(
    {item}: {item: LearningItem},
    {searchTrackingId}: {searchTrackingId: string},
) {
    const course = item;
    const trackingIdInUse = course.tracking_id;

    if (!alreadyTrackedUUIDs.has(trackingIdInUse)) {
        alreadyTrackedUUIDs.add(trackingIdInUse);

        Tracker.publishEvent(
            new SearchImpressionEvent({
                id: course.id,
                type: 'course',
                trackingId: course.tracking_id,
                searchTrackingId,
            }),
        );
    }
}

export function trackSearchLabImpression(lab: LearningItem, searchTrackingId: string) {
    const trackingIdInUse = lab.tracking_id;

    if (!alreadyTrackedUUIDs.has(trackingIdInUse)) {
        alreadyTrackedUUIDs.add(trackingIdInUse);

        Tracker.publishEvent(
            new SearchImpressionEvent({
                id: lab.id,
                type: 'lab',
                trackingId: lab.tracking_id,
                searchTrackingId,
            }),
        );
    }
}

export class SearchImpressionEvent extends ClientEvent {
    id: number;
    type: string;
    trackingId: string;
    searchTrackingId: string;
    constructor({
        id,
        type,
        trackingId,
        searchTrackingId,
    }: {
        id: number;
        type: string;
        trackingId: string;
        searchTrackingId: string;
    }) {
        super('SearchImpressionEvent');
        this.id = id;
        this.type = type;
        this.trackingId = trackingId;
        this.searchTrackingId = searchTrackingId;
    }
}
