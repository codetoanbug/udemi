import {ClientEvent} from '@udemy/event-tracking';

/**
 * Fired when user:
 * - clicks on Notify me when it's ready button: LabLoadingEnableNotificationClickEvent
 * - clicks on Disable notifications button: LabLoadingDisableNotificationClickEvent
 * - grants notification permission: LabLoadingNotificationPermissionGrantEvent
 * - blocks notification permission: LabLoadingNotificationPermissionBlockEvent
 *
 * The eventLabel links to the correct event
 */
export class LabLoadingNotification extends ClientEvent {
    labId: number;
    labVertical: string;

    constructor(eventLabel: string, labId: number, labVertical: string) {
        super(eventLabel);
        this.labId = labId;
        this.labVertical = labVertical;
    }
}

/**
 * Fired when lab workspace is ready
 */
export class LabLoadingTimeAccuracyEvent extends ClientEvent {
    labId: number;
    labVertical: string;
    estimatedLoadingTimeInSeconds: number;
    actualLoadingTimeInSeconds: number;

    constructor({
        labId,
        labVertical,
        estimatedLoadingTime,
        actualLoadingTime,
    }: {
        labId: number;
        labVertical: string;
        estimatedLoadingTime: number;
        actualLoadingTime: number;
    }) {
        super('LabLoadingTimeAccuracyEvent');
        this.labId = labId;
        this.labVertical = labVertical;
        this.estimatedLoadingTimeInSeconds = estimatedLoadingTime;
        this.actualLoadingTimeInSeconds = actualLoadingTime;
    }
}
