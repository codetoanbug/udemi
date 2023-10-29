import {Tracker} from '@udemy/event-tracking';

import {LabDiscoveryCardImpressionEvent} from 'browse/lab-events';

import {LAB_TRACKING_EVENTS} from './constants';

export const sendLabsDiscoverEvent = (componentVisited) => {
    const eventData = {
        componentVisited,
    };
    const eventObject = new LAB_TRACKING_EVENTS.DISCOVER(eventData);
    Tracker.publishEvent(eventObject);
};

export const sendLabDiscoveryCardClickEvent = ({
    labId,
    courseId,
    uiRegion,
    trackingId,
    sourcePageId,
    sourcePageType,
}) => {
    Tracker.publishEvent(
        new LAB_TRACKING_EVENTS.DISCOVERY_CARD_CLICK({
            labId,
            courseId,
            uiRegion,
            trackingId,
            sourcePageId,
            sourcePageType,
        }),
    );
};

export const sendLabDiscoveryCardImpressionEvent = ({
    labId,
    courseId,
    uiRegion,
    sourcePageType,
}) => {
    Tracker.publishEvent(
        new LabDiscoveryCardImpressionEvent({
            labId,
            courseId,
            uiRegion,
            sourcePageType,
        }),
    );
};

/**
 * TODO: Deprecate this function when the GraphQL endpoint work is done to
 * merge results of the 2 different REST endpoints for courses.
 */
export const combineAndSortCourseArrays = (purchasedCourses, consumerSubscriptionCourses) => {
    let courses = [...purchasedCourses, ...consumerSubscriptionCourses];
    const hasAnyActivationCard = courses.find((item) => item.title === 'activation-card');

    if (hasAnyActivationCard) {
        courses = courses.filter((item) => item.title !== 'activation-card');
    }

    courses.sort(
        (a, b) =>
            new Date(b.last_accessed_time).getTime() - new Date(a.last_accessed_time).getTime(),
    );

    if (hasAnyActivationCard) {
        courses.unshift({title: 'activation-card'});
    }

    return courses;
};
