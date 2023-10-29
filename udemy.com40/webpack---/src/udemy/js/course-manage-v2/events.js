import {ClientEvent} from '@udemy/event-tracking';

class CourseCreateActionEvent extends ClientEvent {
    constructor({step, action}) {
        super('CourseCreateActionEvent');
        this.step = step;
        this.action = action;
    }
}

class CourseManageActionEvent extends ClientEvent {
    constructor({courseId, category, action, objectType, objectId}) {
        super('CourseManageActionEvent');
        this.courseId = courseId;
        this.category = category;
        this.action = action;
        this.objectType = objectType;
        this.objectId = objectId;
    }
}

class InstructorOnboardingActionEvent extends ClientEvent {
    constructor(action) {
        super('InstructorOnboardingActionEvent');
        this.action = action;
    }
}

class InstructorCourseListActionEvent extends ClientEvent {
    constructor({category, input, action}) {
        super('InstructorCourseListActionEvent');
        this.category = category;
        this.input = input;
        this.action = action;
    }
}

export {
    CourseCreateActionEvent,
    CourseManageActionEvent,
    InstructorOnboardingActionEvent,
    InstructorCourseListActionEvent,
};
