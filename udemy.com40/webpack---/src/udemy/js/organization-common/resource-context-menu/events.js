import {ClientEvent} from '@udemy/event-tracking';

/**
 * This event is fired when a menu item is clicked in the UB resources context menu.
 */
export class OrganizationResourceMenuItemClickEvent extends ClientEvent {
    constructor({actionDescription, resourceId, resourceType}) {
        super('OrganizationResourceMenuItemClickEvent');
        this.actionDescription = actionDescription;
        this.resourceId = resourceId;
        this.resourceType = resourceType;
    }
}

export default {OrganizationResourceMenuItemClickEvent};
