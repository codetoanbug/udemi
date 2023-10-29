import {Tracker} from '@udemy/event-tracking';

import {BackendSourceOptions, CourseBadgeFamily, DiscoveryItemClickEvent} from 'udemy-django-static/js/browse/events';
import {BrowseCourse} from 'udemy-django-static/js/browse/types/course';

export const trackCourseClickEvent = (
    course: BrowseCourse,
    index: number,
    backendSource: BackendSourceOptions,
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
        }),
    );
};
