import {generateTrackingId, Tracker} from '@udemy/event-tracking';

import {
    DiscoveryItemImpressionEvent,
    DiscoveryUnitViewEvent,
    BackendSourceOptions,
    CourseBadgeFamily,
} from './events';
import {Badge} from './types/badge';

// Holding tracking ids of already seen objects so
// we don't track them twice
const alreadyTrackedUUIDs: Set<string> = new Set();

interface ImpressionItem {
    id: number;
    title: string;
    /**
     * Some of the places are using _class for example like BrowseCourse and some of the places do not have any _class,
     * are using type instead. So we are using optional _class and type here.
     */
    _class?: string;
    type?: string;
    tracking_id?: string;
    frontendTrackingId?: string;
    visibleBadgeFamilies?: CourseBadgeFamily[] | null;
    badges?: Badge[] | null;
}

function trackDiscoveryImpression(
    {item}: {item: ImpressionItem},
    {backendSource, index}: {backendSource: BackendSourceOptions; index?: number},
    {relatedSourceId = null, relatedSourceType = null} = {},
) {
    // Adapter for use with TrackImpression wrapper
    // TODO: We should only use frontendTrackingId
    const trackingIdInUse = item.frontendTrackingId ?? item.tracking_id;
    if (trackingIdInUse && alreadyTrackedUUIDs.has(trackingIdInUse)) {
        return;
    }

    const badgeFamilies: CourseBadgeFamily[] | null = item.visibleBadgeFamilies
        ? item.visibleBadgeFamilies
        : (item.badges?.map((b) => b.badge_family) as CourseBadgeFamily[]) ?? null;

    Tracker.publishEvent(
        new DiscoveryItemImpressionEvent({
            id: item.id,
            type: item._class ? item._class : item.type ?? '',
            trackingId: trackingIdInUse ?? '',
            serveTrackingId: item.tracking_id ?? '',
            backendSource,
            position: (index ?? 0) + 1,
            badgeFamilies,
            relatedSourceId,
            relatedSourceType,
        }),
    );

    trackingIdInUse && alreadyTrackedUUIDs.add(trackingIdInUse);
}
function trackUnitView(unit: {tracking_id: string; title: string}, renderType: string) {
    if (alreadyTrackedUUIDs.has(unit.tracking_id)) {
        return;
    }

    Tracker.publishEvent(
        new DiscoveryUnitViewEvent({
            trackingId: unit.tracking_id,
            unitTitle: unit.title,
            renderType,
        }),
    );

    alreadyTrackedUUIDs.add(unit.tracking_id);
}

/**
 * Tracks auto-complete items viewed by the user
 * @param {string} trackingId tracking id for impression event
 * @returns AutoCompleteResultsEvent | null
 */

export const discoveryTracker = {
    alreadyTrackedUUIDs,
    trackDiscoveryImpression,
    trackUnitView,
};

export function attachFrontendTrackingIds(items: {frontendTrackingId?: string}[]) {
    // Utility method for attaching frontend tracking IDs to data from APIs
    items
        // We don't want to regenerate ID's for the item
        .filter((item) => !item.frontendTrackingId)
        .forEach((item) => {
            item.frontendTrackingId = generateTrackingId();
        });
}
