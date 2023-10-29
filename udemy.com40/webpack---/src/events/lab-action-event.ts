import {ClientEvent} from '@udemy/event-tracking';

export class LabActionEvent extends ClientEvent {
    private action: string;
    private hasAutomatedLabReview: boolean;
    private inSessionTimeBetweenViewAndCtaClick: number | null;
    private labCompletionMode?: string;
    private labId?: string;
    private labInstanceUuid: string | null;
    private labTaskId: number | null;
    private labTaskResourceId: number | null;
    private labVertical?: string;
    private uiRegion: string | null;

    constructor(context: {
        action: string;
        hasAutomatedLabReview: boolean;
        inSessionTimeBetweenViewAndCtaClick: number | null;
        labCompletionMode?: string;
        labId?: string;
        labInstanceUuid: string | null;
        labTaskId: number | null;
        labTaskResourceId: number | null;
        labVertical?: string;
        uiRegion: string | null;
    }) {
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
    }
}
