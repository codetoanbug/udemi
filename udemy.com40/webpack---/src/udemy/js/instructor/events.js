import {ClientEvent} from '@udemy/event-tracking';

class InstructorMenuActionEvent extends ClientEvent {
    constructor({selection, action}) {
        super('InstructorMenuActionEvent');
        this.selection = selection;
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

class InstructorLabActionEvent extends ClientEvent {
    constructor({labId, action}) {
        super('InstructorLabActionEvent');
        this.labId = labId;
        this.action = action;
    }
}

class InstructorPageActionEvent extends ClientEvent {
    constructor({page, action}) {
        super('InstructorPageActionEvent');
        this.page = page;
        this.action = action;
    }
}

class CourseEngagamentActionEvent extends ClientEvent {
    constructor({category, action, objectType = null, objectId = null}) {
        super('CourseEngagamentActionEvent');
        this.category = category;
        this.action = action;
        this.objectType = objectType;
        this.objectId = objectId;
    }
}

class PerformanceCourseEngagementClickEvent extends ClientEvent {
    constructor() {
        super('PerformanceCourseEngagementClickEvent');
    }
}

/**
 * Fired when "UB Content Opportunities" area under "Insights" instructor page
 * is clicked
 */
class UBContentOpportunitiesSelected extends ClientEvent {
    constructor() {
        super('UBContentOpportunitiesSelected');
    }
}

/**
 * Fired when a supply gap opportunity card is rendered
 */
class SupplyGapOpportunityPresented extends ClientEvent {
    constructor({uiRegion, opportunity, opportunityFilters, detailsPresented}) {
        super('SupplyGapOpportunityPresented');
        this.uiRegion = uiRegion;
        this.opportunity = opportunity;
        this.opportunityFilters = opportunityFilters;
        this.detailsPresented = detailsPresented;
    }
}

/**
 * Not used right now, will be used and fired in phase 2
 * Fired when create course button in a presented supply gap opportunity
 * card is clicked
 */
class CreateCourseInSupplyGapOpportunityCardSelected extends ClientEvent {
    constructor(opportunity) {
        super('CreateCourseInSupplyGapOpportunityCardSelected');
        this.opportunity = opportunity;
    }
}

export {
    InstructorMenuActionEvent,
    InstructorCourseListActionEvent,
    InstructorLabActionEvent,
    InstructorPageActionEvent,
    CourseEngagamentActionEvent,
    PerformanceCourseEngagementClickEvent,
    UBContentOpportunitiesSelected,
    SupplyGapOpportunityPresented,
    CreateCourseInSupplyGapOpportunityCardSelected,
};
