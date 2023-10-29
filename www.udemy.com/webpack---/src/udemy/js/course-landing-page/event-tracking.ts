import {
    generateTrackingId,
    setRefIDToLocalStorage,
    getRefIDFromLocalStorage,
} from '@udemy/event-tracking';

/*
 RefId is registered from components that are calling setRefIDToLocalStorage through
 trackGenericCourseClick. This id will be same as the tracking id of the course card that
 user clicked to reach that clp page. Using this method provides a layer of abstraction
 to allow different strategies to pass that tracking id to a new page.
 */

export interface CLPEventTrackingContext {
    courseTrackingId: string;
    isDirectLanded: boolean;
}

function isDirectLanded() {
    let isDirectLandedLocal = true;
    if (document.referrer) {
        try {
            if (new URL(document.referrer).host === location.host) {
                isDirectLandedLocal = false;
            }
        } catch (e) {
            /* referrer is an invalid URL, safe to ignore */
        }
    }
    return isDirectLandedLocal;
}

export function getCLPEventTrackingContext(courseId: number): CLPEventTrackingContext {
    const isDirectLandedLocal = isDirectLanded();
    if (isDirectLandedLocal) {
        // We need to reset the refTrackingId if user directly lands to a CLP page
        // to not attribute previous source of the same page with previous impression.
        setRefIDToLocalStorage(courseId, generateTrackingId());
    }
    return {
        courseTrackingId: getRefIDFromLocalStorage(courseId) || generateTrackingId(),
        isDirectLanded: isDirectLandedLocal,
    };
}
