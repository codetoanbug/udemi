import {BackendSourceOptions, DiscoveryItemClickEvent} from '@udemy/browse-event-tracking';
import {Tracker} from '@udemy/event-tracking';

import {CourseBadgeFamily} from '../course-badges/course-badges.react-component';
import {BrowseCourse} from '../types/course';

export const trackCourseClickEvent = (
    course: BrowseCourse,
    index: number,
    backendSource: BackendSourceOptions,
    uiRegion?: string,
) => {
    const badgeFamilies =
        course.badges?.map((badge) => {
            return badge.badge_family as CourseBadgeFamily;
        }) ?? null;
    const trackingId = course.frontendTrackingId ?? course.tracking_id ?? '';
    Tracker.publishEvent(
        new DiscoveryItemClickEvent({
            id: course.id,
            type: 'course',
            trackingId,
            serveTrackingId: course.tracking_id?.toString() ?? '',
            backendSource,
            position: index,
            badgeFamilies,
            uiRegion,
        }),
    );
};
