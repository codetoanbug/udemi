import {Tracker} from '../tracker/tracker';
import {ClickEvent} from './events';
import {setRefIDToLocalStorage} from './ref-id-storage';

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
