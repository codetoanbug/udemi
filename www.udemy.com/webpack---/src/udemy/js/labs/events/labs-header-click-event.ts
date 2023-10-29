import {ClientEvent} from '@udemy/event-tracking';

export class LabsHeaderClickEvent extends ClientEvent {
    private sourceComponent: string;

    constructor(sourceComponent: string) {
        super('LabsHeaderClickEvent');
        this.sourceComponent = sourceComponent;
    }
}
