import {ClientEvent} from '@udemy/event-tracking';

import {Badge} from '../common/utils/event-helpers';
import {EVENT_LABEL} from '../constants';

export class BadgeAssertionImported extends ClientEvent {
    private badgeClass: Badge;
    constructor(badge: Badge) {
        super(EVENT_LABEL.BADGE_ASSERTION_IMPORTED);
        this.badgeClass = badge;
    }
}
