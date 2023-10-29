import {Tracker} from '@udemy/event-tracking';
import {UDDataConfig} from '@udemy/ud-data';

import {DiscoveryItemClickEvent, LearningProductType} from 'browse/events';
import {UI_REGION} from 'browse/ui-regions';
import {TrackingContext} from 'search/events';

import {Course, Lecture} from './types';

interface CourseCTALinkOptions {
    udConfig: UDDataConfig;
    course: Course | undefined;
    lecture: Lecture | undefined;
}
export function getCourseLinkCTA(options: CourseCTALinkOptions) {
    /*
    Course CTA should link to course url (CLP) if:
        1. User is in PP
        2. We are missing lecture url
    Course CTA should link to lecture url (CTP) for UB. If user is not enrolled in the course, CTP will redirect user to CLP.
    */
    return options.udConfig.brand.has_organization && options.lecture?.url
        ? options.lecture.url
        : options.course?.url;
}
export function handleCourseCTAClick(course: Course, trackingContext: TrackingContext | undefined) {
    if (trackingContext) {
        Tracker.publishEvent(
            new DiscoveryItemClickEvent({
                id: course.id,
                type: LearningProductType.COURSE,
                trackingId: trackingContext.trackingId ?? '',
                serveTrackingId: trackingContext.searchTrackingId ?? '',
                backendSource: trackingContext.backendSource,
                badgeFamilies: [],
                uiRegion: UI_REGION.BOTTOM_DRAWER_COURSE_CARD,
                position: trackingContext.index,
            }),
        );
    }
}
