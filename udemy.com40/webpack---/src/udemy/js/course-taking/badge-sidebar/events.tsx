import {ClientEvent} from '@udemy/event-tracking';

export class BadgeDueDateEdited extends ClientEvent {
    constructor({badgeId}: {badgeId: number}) {
        super('BadgeDueDateEdited');
        this.badgeId = badgeId;
    }

    badgeId: number;
}

export class BadgeDueDateRemoved extends ClientEvent {
    constructor({badgeId}: {badgeId: number}) {
        super('BadgeDueDateRemoved');
        this.badgeId = badgeId;
    }

    badgeId: number;
}

export class BadgeDueDateSelectedReadyForExam extends ClientEvent {
    constructor({badgeId}: {badgeId: number}) {
        super('BadgeDueDateSelectedReadyForExam');
        this.badgeId = badgeId;
    }

    badgeId: number;
}

export class BadgeDueDateSet extends ClientEvent {
    constructor({badgeId}: {badgeId: number}) {
        super('BadgeDueDateSet');
        this.badgeId = badgeId;
    }

    badgeId: number;
}

export class BadgeDueDateTrackerCalendarOpened extends ClientEvent {
    constructor({badgeId}: {badgeId: number}) {
        super('BadgeDueDateTrackerCalendarOpened');
        this.badgeId = badgeId;
    }

    badgeId: number;
}

export class BadgeDueDateTrackerCollapsed extends ClientEvent {
    constructor({badgeId}: {badgeId: number}) {
        super('BadgeDueDateTrackerCollapsed');
        this.badgeId = badgeId;
    }

    badgeId: number;
}

export class BadgeDueDateTrackerExpanded extends ClientEvent {
    constructor({badgeId}: {badgeId: number}) {
        super('BadgeDueDateTrackerExpanded');
        this.badgeId = badgeId;
    }

    badgeId: number;
}

export class BadgeDueDateTrackerPresented extends ClientEvent {
    constructor({badgeId, state}: {badgeId: number; state: string}) {
        super('BadgeDueDateTrackerPresented');
        this.badgeId = badgeId;
        this.state = state;
    }

    state: string;
    badgeId: number;
}

export class BadgeDueDateTrackerRefreshed extends ClientEvent {
    constructor({badgeId}: {badgeId: number}) {
        super('BadgeDueDateTrackerRefreshed');
        this.badgeId = badgeId;
    }

    badgeId: number;
}

export class BadgeSelected extends ClientEvent {
    constructor({badgeId, uiRegion}: {badgeId: number; uiRegion: string}) {
        super('BadgeSelected');
        this.badgeId = badgeId;
        this.uiRegion = uiRegion;
    }

    badgeId: number;
    uiRegion: string;
}
