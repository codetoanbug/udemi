import {ClientEvent} from '@udemy/event-tracking';

export default class LabsDiscoverEvent extends ClientEvent {
    constructor(context) {
        super('LabsDiscoverEvent');
        this.componentVisited = context.componentVisited;
    }
}
