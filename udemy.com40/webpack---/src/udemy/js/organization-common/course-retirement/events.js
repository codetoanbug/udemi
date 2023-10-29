import {ClientEvent} from '@udemy/event-tracking';

// Event fired when retirement alert viewed in modals
export class CourseRetirementModalAlertViewEvent extends ClientEvent {
    constructor(eventData) {
        super('CourseRetirementModalAlertViewEvent');

        this.courseId = eventData.courseId;
        this.modalType = eventData.modalType;
    }
}

// Event fired when action taken on retirement alert in modals
export class CourseRetirementModalAlertActionEvent extends ClientEvent {
    constructor(eventData) {
        super('CourseRetirementModalAlertActionEvent');

        this.courseId = eventData.courseId;
        this.modalType = eventData.modalType;
        this.action = eventData.action;
    }
}

// Event fired when course retirement banner is viewed
export class CourseRetirementBannerViewEvent extends ClientEvent {
    constructor(eventData) {
        super('CourseRetirementBannerViewEvent');

        this.courseId = eventData.courseId;
    }
}

// Event fired when user expands the retirement banner to see the alternatives
export class CourseRetirementBannerExpandEvent extends ClientEvent {
    constructor(eventData) {
        super('CourseRetirementBannerExpandEvent');

        this.courseId = eventData.courseId;
    }
}

// Event fired user clicks on the alternatives from the course retirement banner
export class CourseRetirementBannerClickAlternativeEvent extends ClientEvent {
    constructor(eventData) {
        super('CourseRetirementBannerClickAlternativeEvent');

        this.courseId = eventData.courseId;
        this.alternativeCourseId = eventData.alternativeCourseId;
    }
}
