import {ClientEvent} from '@udemy/event-tracking';

import {OUTPUT_MESSAGE_TYPE_TRACKING} from 'lab-taking/tasks/structured/automated-lab-review/constants';
import {LAB_MODE} from 'labs/constants';

type LabModeKeys = keyof typeof LAB_MODE;
type LabMode = typeof LAB_MODE[LabModeKeys];

type OutputMessageTypeKeys = keyof typeof OUTPUT_MESSAGE_TYPE_TRACKING;
type OutputMessageType = typeof OUTPUT_MESSAGE_TYPE_TRACKING[OutputMessageTypeKeys];

interface AutomatedLabReview {
    labId: string;
    labTaskId: string;
    labInstanceUuid: string;
    labCompletionMode: LabMode;
    labLevel: boolean;
    taskLevel: boolean;
}

/**
 * Fired when a button or accordion is clicked.
 * The eventLabel links to the correct event
 */

export class AutomatedLabReviewEvent extends ClientEvent {
    private automatedLabReview: AutomatedLabReview;

    constructor(eventLabel: string, automatedLabReview: AutomatedLabReview) {
        super(eventLabel);
        this.automatedLabReview = automatedLabReview;
    }
}

/**
 * Fired when the review output is displayed
 */
export class AutomatedLabReviewCheckOutputViewEvent extends ClientEvent {
    private labId: string;
    private labTaskId: string;
    private labCompletionMode: LabMode;
    private testId: string | null;
    private outputMessageType: OutputMessageType;

    constructor({
        labId,
        labTaskId,
        labCompletionMode,
        testId,
        outputMessageType,
    }: {
        labId: string;
        labTaskId: string;
        labCompletionMode: LabMode;
        testId: string;
        outputMessageType: OutputMessageType;
    }) {
        super('AutomatedLabReviewCheckOutputViewEvent');
        this.labId = labId;
        this.labTaskId = labTaskId;
        this.labCompletionMode = labCompletionMode;
        this.testId = testId;
        this.outputMessageType = outputMessageType;
    }
}
