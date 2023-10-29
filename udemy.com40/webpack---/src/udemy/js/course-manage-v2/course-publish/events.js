import {Tracker, ClientEvent} from '@udemy/event-tracking';

export default class CoursePublishUserActionEvent extends ClientEvent {
    constructor({courseId, state, action}) {
        super('CoursePublishUserActionEvent');
        this.courseId = courseId;
        this.state = state;
        this.action = action;
    }
}

export function publishEvent(coursePublishEvent) {
    Tracker.publishEvent(coursePublishEvent);
}
