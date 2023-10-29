import {Tracker, ClientEvent} from '@udemy/event-tracking';

export default class InstructorVerificationUserActionEvent extends ClientEvent {
    constructor({courseId, state, action, source, country = null, verificationType = null}) {
        super('InstructorVerificationUserActionEvent');
        this.courseId = courseId;
        this.state = state;
        this.action = action;
        this.source = source;
        this.country = country;
        this.verificationType = verificationType;
    }
}

export function publishEvent(instructorVerificationEvent) {
    Tracker.publishEvent(instructorVerificationEvent);
}
