import {Tracker} from '@udemy/event-tracking';

import {DetailProps} from 'browse/components/lecture-stack-card/types';
import {BackendSourceOptions, LectureDiscoveryCardClickEvent} from 'browse/events';

export const getLectureEventData = (detailProps: DetailProps) => {
    const {lecture, uiRegion} = detailProps;
    return {
        backendSource: BackendSourceOptions.DISCOVERY,
        id: lecture.id,
        position: lecture.position,
        serveTrackingId: lecture.serveTrackingId,
        trackingId: lecture.trackingId,
        uiRegion,
    };
};

export const getOnClickHandler = (detailProps: DetailProps) => {
    const {lecture, lectureQuickViewStore} = detailProps;
    const lectureEventData = getLectureEventData(detailProps);
    if (lectureQuickViewStore) {
        lectureQuickViewStore.setTrackingContext({
            searchTrackingId: lectureEventData.serveTrackingId,
            backendSource: lectureEventData.backendSource,
            trackingId: lectureEventData.backendSource,
            index: lectureEventData.position,
        });
        lectureQuickViewStore.fetchLectureQuickViewData(lecture.course.id, lecture.id);
    }
    Tracker.publishEvent(new LectureDiscoveryCardClickEvent(lectureEventData));
};
