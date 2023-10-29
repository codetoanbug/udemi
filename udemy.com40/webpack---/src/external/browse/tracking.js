import {
    Tracker as tracker,
    setRefIDToLocalStorage,
    generateTrackingId,
} from '@udemy/event-tracking';

import {
    DiscoveryItemImpressionEvent,
    DiscoveryUnitViewEvent,
    AutoCompleteClearHistoryClickEvent,
    AutoCompleteItemClickEvent,
    AutoCompleteResultBounceEvent,
    AutoCompleteResultImpressionEvent,
    GiftBuyablesStartEvent,
    CourseShareEvent,
    CourseShareToChannelEvent,
} from './events';

// Holding tracking ids of already seen objects so
// we don't track them twice
let alreadyTrackedUUIDs = new Set();
const NO_RESULTS_ID = 'no_results';
const AUTO_COMPLETE_CLEAR_HISTORY_PREFIX = 'autocomplete-clearhistory-';

// Unit test helper
export function _resetAlreadyTrackedUUIDs() {
    alreadyTrackedUUIDs = new Set();
}

function udLiteTrackDiscoveryImpression(
    {item},
    {backendSource, index},
    {relatedSourceId = null, relatedSourceType = null} = {},
) {
    // Adapter for use with TrackImpression wrapper
    // After full UDLite migration is complete, move to this approach
    trackDiscoveryImpression(item, backendSource, index, {relatedSourceId, relatedSourceType});
}

function trackDiscoveryImpression(
    item,
    backendSource,
    index,
    {relatedSourceId = null, relatedSourceType = null} = {},
) {
    // TODO: We should only use frontendTrackingId when we completely switch to udlite
    const trackingIdInUse = item.frontendTrackingId || item.tracking_id;
    if (alreadyTrackedUUIDs.has(trackingIdInUse)) {
        return;
    }

    const badgeFamilies = item.visibleBadgeFamilies
        ? item.visibleBadgeFamilies
        : (item.badges && item.badges.map((b) => b.badge_family)) || null;

    tracker.publishEvent(
        new DiscoveryItemImpressionEvent({
            id: item.id,
            type: item._class || item.type,
            trackingId: trackingIdInUse,
            serveTrackingId: item.tracking_id,
            backendSource,
            position: index + 1,
            badgeFamilies,
            relatedSourceId,
            relatedSourceType,
        }),
    );

    alreadyTrackedUUIDs.add(trackingIdInUse);
}

function trackUnitView(unit, renderType) {
    if (alreadyTrackedUUIDs.has(unit.tracking_id)) {
        return;
    }

    tracker.publishEvent(
        new DiscoveryUnitViewEvent({
            trackingId: unit.tracking_id,
            unitTitle: unit.title,
            renderType,
        }),
    );

    alreadyTrackedUUIDs.add(unit.tracking_id);
}

/**
 * Publish auto complete result clicked event
 * @param {number} position - position within results the auto complete result was displayed
 * @param {*} autoCompleteResult Object with details on the auto complete result clicked
 * @returns AutoCompleteItemClickEvent published
 */
const trackAutoCompleteResultClick = (position, autoCompleteResult) => {
    // tracking_id is the same across AutoComplete events
    // prepedending "click" to differentiate across AutoComplete events
    const alreadyTrackedId = `autocomplete-click-${autoCompleteResult?.tracking_id}`;
    // do not publish an event if autoCompleteResult is null
    if (!autoCompleteResult || alreadyTrackedUUIDs.has(alreadyTrackedId)) {
        return null;
    }
    const autoCompleteItemClickEvent = new AutoCompleteItemClickEvent({
        resultTrackingId: autoCompleteResult.result_tracking_id,
        autoCompleteItem: {
            position,
            trackingId: autoCompleteResult.tracking_id,
            phrase: autoCompleteResult.label,
            type: autoCompleteResult.type,
        },
    });
    tracker.publishEvent(autoCompleteItemClickEvent);
    // set tracking id for courses for attribution specifically
    // for auto complete results of type course OR rvc (Recently Viewed Course)
    if (autoCompleteResult.type === 'course' || autoCompleteResult.type === 'rvc') {
        setRefIDToLocalStorage(autoCompleteResult.id, autoCompleteResult.tracking_id);
    }

    alreadyTrackedUUIDs.add(alreadyTrackedId);

    return autoCompleteItemClickEvent;
};

/**
 * Tracks auto-complete items viewed by the user
 * @param {string | null | undefined} trackingId tracking id for impression event
 * @returns AutoCompleteResultsEvent | null
 */
function trackAutoCompleteResultsImpression(trackingId, query) {
    // we still want to track to show user seeing no results
    // if no auto-complete items were loaded
    const resultTrackingId = trackingId || NO_RESULTS_ID;
    if (alreadyTrackedUUIDs.has(resultTrackingId)) {
        return null;
    }

    const autoCompleteResultsImpressionEvent = new AutoCompleteResultImpressionEvent({
        resultTrackingId,
        query,
    });
    tracker.publishEvent(autoCompleteResultsImpressionEvent);

    // only track trackingIds with results
    if (resultTrackingId !== NO_RESULTS_ID) {
        alreadyTrackedUUIDs.add(resultTrackingId);
    }

    return autoCompleteResultsImpressionEvent;
}

/**
 * Tracks auto-complete clear history click by the user
 * @param {string | null | undefined} trackingId tracking id for auto complete clear history event
 * @returns AutoCompleteClearHistoryClickEvent | null
 */
function trackAutoCompleteClearHistoryClick(trackingId) {
    const resultTrackingId = trackingId || NO_RESULTS_ID;
    const alreadyTrackedId = `${AUTO_COMPLETE_CLEAR_HISTORY_PREFIX}${resultTrackingId}`;
    // don't multi-count clicks of the same result tracking id
    if (alreadyTrackedUUIDs.has(alreadyTrackedId)) {
        return null;
    }

    const autoCompleteClearHistoryClickEvent = new AutoCompleteClearHistoryClickEvent(
        resultTrackingId,
    );
    tracker.publishEvent(autoCompleteClearHistoryClickEvent);

    // only track trackingIds with results
    if (resultTrackingId !== NO_RESULTS_ID) {
        alreadyTrackedUUIDs.add(alreadyTrackedId);
    }

    return autoCompleteClearHistoryClickEvent;
}

/**
 * Tracks auto-complete items bounced by the user
 * @param {string | null | undefined} trackingId tracking id for auto-complete bounce event
 * @returns AutoCompleteResultBounceEvent | null
 */
function trackAutoCompleteResultsBounce(trackingId) {
    // we still want to track bounces if no auto-complete items were loaded
    const resultTrackingId = trackingId || NO_RESULTS_ID;
    // resultTrackingId is the same across AutoComplete events
    // prepedending "bounce" to differentiate across AutoComplete events
    const alreadyTrackedId = `autocomplete-bounce-${resultTrackingId}`;
    const alreadyTrackedIdClick = `autocomplete-click-${resultTrackingId}`;
    if (
        alreadyTrackedUUIDs.has(alreadyTrackedId) ||
        alreadyTrackedUUIDs.has(alreadyTrackedIdClick)
    ) {
        return null;
    }

    const autoCompleteResultsBounceEvent = new AutoCompleteResultBounceEvent({
        resultTrackingId,
    });
    tracker.publishEvent(autoCompleteResultsBounceEvent);

    if (alreadyTrackedId !== `autocomplete-bounce-${NO_RESULTS_ID}`) {
        alreadyTrackedUUIDs.add(alreadyTrackedId);
    }

    return autoCompleteResultsBounceEvent;
}

/**
 * Tracks gifting buyables
 * @param {Array<{id: number, type: string, trackingId: string}} buyables collection of buyables to be gifted
 * @returns GiftBuyablesStartEvent
 */
function trackGiftBuyablesStartEvent(buyables, uiRegion) {
    const giftBuyablesStartEvent = new GiftBuyablesStartEvent(buyables, uiRegion);
    tracker.publishEvent(giftBuyablesStartEvent);
    return giftBuyablesStartEvent;
}

/**
 * Tracks course share button interactions
 * @param {number} courseId the id for the course being shared
 * @returns CourseShareEvent
 */
function trackCourseShareEvent(courseId) {
    const courseShareEvent = new CourseShareEvent(courseId);
    tracker.publishEvent(courseShareEvent);
    return courseShareEvent;
}

/**
 * Tracks course share channel interactions
 * @param {number} courseId the id for the course being shared
 * @param {import('./events').CourseShareChannel} channel the channel selected by the user when sharing the course
 * @returns CourseShareToChannelEvent
 */
function trackCourseShareToChannelEvent(courseId, channel) {
    const courseShareToChannelEvent = new CourseShareToChannelEvent(courseId, channel);
    tracker.publishEvent(courseShareToChannelEvent);
    return courseShareToChannelEvent;
}

// Todo migrate other usages to use the object version
export const discoveryTracker = {
    alreadyTrackedUUIDs,
    trackDiscoveryImpression,
    udLiteTrackDiscoveryImpression,
    trackUnitView,
    trackAutoCompleteClearHistoryClick,
    trackAutoCompleteResultClick,
    trackAutoCompleteResultsBounce,
    trackAutoCompleteResultsImpression,
    trackGiftBuyablesStartEvent,
    trackCourseShareEvent,
    trackCourseShareToChannelEvent,
};

export {trackUnitView, trackDiscoveryImpression};

export function attachFrontendTrackingIds(items) {
    // Utility method for attaching frontend tracking IDs to data from APIs
    items
        // We don't want to regenerate ID's for the item
        .filter((item) => !item.frontendTrackingId)
        .forEach((item) => {
            item.frontendTrackingId = generateTrackingId();
        });
}
