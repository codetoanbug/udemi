import {ClientEvent} from '@udemy/event-tracking';

export default class LabHeartbeatEvent extends ClientEvent {
    constructor(context) {
        super('LabHeartbeatEvent');
        this.labInstanceUuid = context.labInstanceUuid;
        this.startTime = context.startTime;
        this.durationMs = context.durationMs;
        this.hasFocus = context.hasFocus;
        this.hasKeyboardMouse = context.hasKeyboardMouse;
        this.labCompletionMode = context.labCompletionMode;
    }
}
