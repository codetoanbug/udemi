import {ClientEvent} from '@udemy/event-tracking';

interface ListEventProps {
    listId: number;
    uiRegion: string;
    nonInteraction?: boolean;
}

interface ListItemEventProps extends ListEventProps {
    trackingId: string;
    courseId: number;
}

/**
 * Fired when a collection list is created
 */
export class LearningListCreateEvent extends ClientEvent {
    listId: number;
    nonInteraction: boolean;
    uiRegion: string;
    constructor({listId, uiRegion, nonInteraction = false}: ListEventProps) {
        super('LearningListCreateEvent');
        this.listId = listId;
        this.nonInteraction = nonInteraction;
        this.uiRegion = uiRegion;
    }
}

/**
 * Fired when a collection list is deleted
 */
export class LearningListDeleteEvent extends ClientEvent {
    listId: number;
    uiRegion: string;
    constructor({listId, uiRegion}: ListEventProps) {
        super('LearningListDeleteEvent');
        this.listId = listId;
        this.uiRegion = uiRegion;
    }
}

/**
 * Fired when a collection list is edited
 */
export class LearningListEditEvent extends ClientEvent {
    listId: number;
    uiRegion: string;
    constructor({listId, uiRegion}: ListEventProps) {
        super('LearningListEditEvent');
        this.listId = listId;
        this.uiRegion = uiRegion;
    }
}

/**
 * Fired when user attempts to remove a course from the list
 */
export class LearningListItemRemoveEvent extends ClientEvent {
    listId: number;
    uiRegion: string;
    courseId: number;
    trackingId: string;
    constructor({listId, courseId, trackingId, uiRegion}: ListItemEventProps) {
        super('LearningListItemRemoveEvent');
        this.listId = listId;
        this.courseId = courseId;
        this.trackingId = trackingId;
        this.uiRegion = uiRegion;
    }
}

/**
 * Fired when user clicks the "Save To List" button
 */
export class LearningListItemSaveEvent extends ClientEvent {
    listId: number;
    uiRegion: string;
    courseId: number;
    trackingId: string;
    constructor({listId, courseId, trackingId, uiRegion}: ListItemEventProps) {
        super('LearningListItemSaveEvent');
        this.listId = listId;
        this.courseId = courseId;
        this.trackingId = trackingId;
        this.uiRegion = uiRegion;
    }
}
