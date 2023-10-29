import {ClientEvent} from '@udemy/event-tracking';

class LearningPathActionEvent extends ClientEvent {
    constructor({userRole, pathId, action, pageName}) {
        super('LearningPathActionEvent');
        this.userRole = userRole;
        this.pathId = pathId;
        this.action = action;
        this.pageName = pageName;
    }
}

class LearningPathContentItemAddEvent extends ClientEvent {
    constructor({userRole, pathId, contentItemType, pageName}) {
        super('LearningPathContentItemAddEvent');
        this.userRole = userRole;
        this.pathId = pathId;
        this.contentItemType = contentItemType;
        this.pageName = pageName;
    }
}

class LearningPathCreateEvent extends ClientEvent {
    constructor({userRole}) {
        super('LearningPathCreateEvent');
        this.userRole = userRole;
    }
}

class LearningPathDiscoverabilityOptionSelectEvent extends ClientEvent {
    constructor({userRole, pathId, option}) {
        super('LearningPathDiscoverabilityOptionSelectEvent');
        this.userRole = userRole;
        this.pathId = pathId;
        this.option = option;
    }
}

class LearningPathEditorsChangedEvent extends ClientEvent {
    constructor({userRole, pathId, addedEditorCount, removedEditorCount, featuredEditorId}) {
        super('LearningPathEditorsChangedEvent');
        this.userRole = userRole;
        this.pathId = pathId;
        this.addedEditorCount = addedEditorCount;
        this.removedEditorCount = removedEditorCount;
        this.featuredEditorId = featuredEditorId;
    }
}

class LearningPathRemovedCourseAlertActionEvent extends ClientEvent {
    constructor({userRole, pathId, courseId, action, alertType, alternativeCourseId}) {
        super('LearningPathRemovedCourseAlertActionEvent');
        this.userRole = userRole;
        this.pathId = pathId;
        this.courseId = courseId;
        this.action = action;
        this.alertType = alertType;
        this.alternativeCourseId = alternativeCourseId;
    }
}

class LearningPathSearchEvent extends ClientEvent {
    constructor(eventData) {
        super('LearningPathSearchEvent');
        this.context = eventData.context;
        this.search = eventData.search;
        this.userRole = eventData.userRole;
        this.totalResults = eventData.totalResults;
    }
}

class LearningPathSearchResultClickEvent extends ClientEvent {
    constructor(eventData) {
        super('LearningPathSearchResultClickEvent');

        this.context = eventData.context;
        this.search = eventData.search;
        this.userRole = eventData.userRole;
        this.pathId = eventData.pathId;
        this.currentPage = eventData.currentPage;
    }
}

class LearningPathSectionItemClickEvent extends ClientEvent {
    constructor({userRole, isUserEnrolled, isUserEditor, pathId, isPublicPath, itemType, itemId}) {
        super('LearningPathSectionItemClickEvent');
        this.userRole = userRole;
        this.isUserEnrolled = isUserEnrolled;
        this.isUserEditor = isUserEditor;
        this.pathId = pathId;
        this.isPublicPath = isPublicPath;
        this.itemType = itemType;
        this.itemId = itemId;
    }
}

class LearningPathRecommendedCoursesSkillsetsViewEvent extends ClientEvent {
    constructor({pathId}) {
        super('LearningPathRecommendedCoursesSkillsetsViewEvent');
        this.pathId = pathId;
    }
}

class LearningPathRecommendedCoursesCoursesViewEvent extends ClientEvent {
    constructor({pathId}) {
        super('LearningPathRecommendedCoursesCoursesViewEvent');
        this.pathId = pathId;
    }
}

class LearningPathRecommendedCoursesCourseActionEvent extends ClientEvent {
    constructor({pathId, courseId, uiAction}) {
        super('LearningPathRecommendedCoursesCourseActionEvent');
        this.pathId = pathId;
        this.courseId = courseId;
        this.uiAction = uiAction;
    }
}

class LearningPathRecommendedCoursesAddEvent extends ClientEvent {
    constructor({pathId, courseIds, isAddSectionHeadingsChecked}) {
        super('LearningPathRecommendedCoursesAddEvent');
        this.pathId = pathId;
        this.courseIds = courseIds;
        this.isAddSectionHeadingsChecked = isAddSectionHeadingsChecked;
    }
}

class LearningPathCourseRetirementAlertViewEvent extends ClientEvent {
    constructor({userRole, pathId, courseId, alertType}) {
        super('LearningPathCourseRetirementAlertViewEvent');
        this.userRole = userRole;
        this.pathId = pathId;
        this.courseId = courseId;
        this.alertType = alertType;
    }
}

export {
    LearningPathActionEvent,
    LearningPathContentItemAddEvent,
    LearningPathCreateEvent,
    LearningPathDiscoverabilityOptionSelectEvent,
    LearningPathEditorsChangedEvent,
    LearningPathRemovedCourseAlertActionEvent,
    LearningPathSearchEvent,
    LearningPathSearchResultClickEvent,
    LearningPathSectionItemClickEvent,
    LearningPathRecommendedCoursesSkillsetsViewEvent,
    LearningPathRecommendedCoursesCoursesViewEvent,
    LearningPathRecommendedCoursesCourseActionEvent,
    LearningPathRecommendedCoursesAddEvent,
    LearningPathCourseRetirementAlertViewEvent,
};
