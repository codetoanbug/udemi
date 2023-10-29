import {ClientEvent} from '@udemy/event-tracking';

export default class LabActionEvent extends ClientEvent {
    constructor(context) {
        super('LabActionEvent');
        this.labId = context.labId;
        this.labVertical = context.labVertical;
        this.labInstanceUuid = context.labInstanceUuid;
        this.labTaskId = context.labTaskId;
        this.labTaskResourceId = context.labTaskResourceId;
        this.labCompletionMode = context.labCompletionMode;
        this.inSessionTimeBetweenViewAndCtaClick = context.inSessionTimeBetweenViewAndCtaClick;
        this.action = context.action;
        this.uiRegion = context.uiRegion;
        this.hasAutomatedLabReview = context.hasAutomatedLabReview;
        this.labTaskNumber = context.labTaskNumber;
    }
}
