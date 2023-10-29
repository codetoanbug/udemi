import {CourseBadgeFamily} from '@udemy/browse-course';
import {Tracker, ClickEvent, setRefIDToLocalStorage} from '@udemy/event-tracking';

import {
    DiscoveryItemClickEvent,
    BackendSourceOptions,
    DiscoveryItemImpressionEvent,
} from 'browse/events';
import {BrowseCourse} from 'browse/types/course';
import {CategoryForCard} from 'lohp/components/top-categories/category-card.react-component';
import {Topic} from 'topic/types/topic';

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

export function trackGenericCourseClick({
    courseId,
    courseTrackingId,
    componentName,
}: {
    courseId: number;
    courseTrackingId: string;
    componentName: string;
}) {
    Tracker.publishEvent(
        new ClickEvent({
            componentName,
            relatedObjectType: ClickEvent.relatedObjectTypes.course,
            relatedObjectId: courseId,
            trackingId: courseTrackingId,
        }),
    );
    setRefIDToLocalStorage(courseId, courseTrackingId);
}

export const trackCategoryCardImpression = (category: CategoryForCard, index: number) => {
    const trackingId = category.id.toString();
    Tracker.publishEvent(
        new DiscoveryItemImpressionEvent({
            id: category.id,
            type: 'course_category',
            trackingId,
            serveTrackingId: trackingId,
            backendSource: BackendSourceOptions.DISCOVERY,
            position: index,
            badgeFamilies: [],
            relatedSourceId: null,
            relatedSourceType: null,
        }),
    );
};
export const trackCategoryCardClick = (category: CategoryForCard, index: number) => {
    const trackingId = category.id.toString();
    Tracker.publishEvent(
        new DiscoveryItemClickEvent({
            id: category.id,
            type: 'course_category',
            trackingId,
            serveTrackingId: trackingId,
            backendSource: BackendSourceOptions.DISCOVERY,
            position: index,
            badgeFamilies: [],
        }),
    );
};
export const trackTopicImpression = (topic: Topic, index: number) => {
    const trackingId = topic.tracking_id ?? topic.id.toString();
    Tracker.publishEvent(
        new DiscoveryItemImpressionEvent({
            id: topic.id,
            type: 'course_topic',
            trackingId,
            serveTrackingId: trackingId,
            backendSource: BackendSourceOptions.DISCOVERY,
            position: index,
            badgeFamilies: [],
            relatedSourceId: null,
            relatedSourceType: null,
        }),
    );
};
export const trackTopicClick = (topic: Topic, index: number) => {
    const trackingId = topic.tracking_id ?? topic.id.toString();
    Tracker.publishEvent(
        new DiscoveryItemClickEvent({
            id: topic.id,
            type: 'course_topic',
            trackingId,
            serveTrackingId: trackingId,
            backendSource: BackendSourceOptions.DISCOVERY,
            position: index,
            badgeFamilies: [],
        }),
    );
};
