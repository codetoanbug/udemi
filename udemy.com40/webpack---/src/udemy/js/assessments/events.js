import {ClientEvent} from '@udemy/event-tracking';

/**
This event is fired as a general-purpose click event for adaptive assessments when a tracked HTML element is clicked.

 !!IMPORTANT!! You should almost always trigger this event on keypress of enter/space to capture
 actions taken by keyboard users.

 e.g.
 <div onClick={this.handleAction} onKeyDown={onEnterAndSpace(this.handleAction)}>
*/
class AssessmentClickEvent extends ClientEvent {
    constructor({
        assessmentId = undefined,
        sourcePageType = undefined,
        sourcePageId = undefined,
        status = undefined,
        componentName,
        uiRegion = undefined,
    }) {
        super('AssessmentClickEvent');
        this.componentName = componentName;
        this.assessmentId = assessmentId;
        this.sourcePageType = sourcePageType;
        this.sourcePageId = sourcePageId;
        this.status = status;
        this.uiRegion = uiRegion;
    }
}

class AssessmentPresentedEvent extends ClientEvent {
    constructor({
        assessmentId = undefined,
        sourcePageType = undefined,
        sourcePageId = undefined,
        status = undefined,
        uiRegion = undefined,
    }) {
        super('AssessmentPresentedEvent');
        this.assessmentId = assessmentId;
        this.sourcePageType = sourcePageType;
        this.sourcePageId = sourcePageId;
        this.status = status;
        this.uiRegion = uiRegion;
    }
}

class AssessmentResumeEvent extends ClientEvent {
    constructor({testletId, testletAttemptId}) {
        super('AssessmentResumeEvent');
        this.testletId = testletId;
        this.testletAttemptId = testletAttemptId;
    }
}

// NOTE: This event is used only by PP team. It does not track all the ways a user can leave.
class AssessmentLeaveEvent extends ClientEvent {
    constructor({testletId, testletAttemptId, questionEndedOn, uiRegion}) {
        super('AssessmentLeaveEvent');
        this.testletId = testletId;
        this.testletAttemptId = testletAttemptId;
        this.questionEndedOn = questionEndedOn;
        this.uiRegion = uiRegion;
    }
}

class AssessmentDiscoverTabImpressionEvent extends ClientEvent {
    constructor(context) {
        super('AssessmentDiscoverTabImpressionEvent');
        this.componentVisited = context.componentVisited;
    }
}

export {
    AssessmentClickEvent,
    AssessmentPresentedEvent,
    AssessmentResumeEvent,
    AssessmentLeaveEvent,
    AssessmentDiscoverTabImpressionEvent,
};
