import {ClientEvent} from '@udemy/event-tracking';
import {toJS} from 'mobx';

import {Curriculum} from 'course-taking/types/curriculum';
import {VideoLecture} from 'course-taking/types/lecture';

interface LearningProgressCardEventArguments {
    courseTrackingId: string;
    curriculum?: Curriculum;
    uiRegion: string;
}

/**
 * Fired when a lecture progress card in the jump back in unit is seen
 */
class LearningProgressCardImpressionEvent extends ClientEvent {
    courseTrackingId: string;
    curriculum?: Curriculum;
    uiRegion: string;
    constructor({courseTrackingId, curriculum, uiRegion}: LearningProgressCardEventArguments) {
        super('LearningProgressCardImpressionEvent');
        this.courseTrackingId = courseTrackingId;
        this.curriculum = curriculum;
        this.uiRegion = uiRegion;
    }
}

/**
 * Fired when a lecture progress card in the jump back in unit is clicked
 */
class LearningProgressCardClickEvent extends ClientEvent {
    courseTrackingId: string;
    curriculum?: Curriculum;
    uiRegion: string;
    constructor({courseTrackingId, curriculum, uiRegion}: LearningProgressCardEventArguments) {
        super('LearningProgressCardClickEvent');
        this.courseTrackingId = courseTrackingId;
        this.curriculum = curriculum;
        this.uiRegion = uiRegion;
    }
}

function buildEventData(
    course: {next_to_watch_item: VideoLecture; frontendTrackingId: string},
    uiRegion: string,
) {
    const eventData: LearningProgressCardEventArguments = {
        courseTrackingId: course.frontendTrackingId,
        uiRegion,
    };
    const nextToWatchItem = toJS(course.next_to_watch_item);
    if (Object.keys(nextToWatchItem).length !== 0) {
        eventData.curriculum = {
            curriculumId: course.next_to_watch_item.id,
            curriculumType: course.next_to_watch_item._class,
        };
    }
    return eventData;
}

export {buildEventData, LearningProgressCardImpressionEvent, LearningProgressCardClickEvent};
