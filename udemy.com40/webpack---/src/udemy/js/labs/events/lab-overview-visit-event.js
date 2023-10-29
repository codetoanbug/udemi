import {ClientEvent} from '@udemy/event-tracking';

export default class LabOverviewVisitEvent extends ClientEvent {
    constructor(context) {
        super('LabOverviewVisitEvent');
        this.labId = context.labId;
        this.isUnstartedVisit = context.isUnstartedVisit;
    }
}
