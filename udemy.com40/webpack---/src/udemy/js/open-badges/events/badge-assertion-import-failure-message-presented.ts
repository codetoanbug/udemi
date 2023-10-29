import {ClientEvent} from '@udemy/event-tracking';

import {EVENT_LABEL} from '../constants';

export class BadgeAssertionImportFailureMessagePresented extends ClientEvent {
    constructor() {
        super(EVENT_LABEL.BADGE_ASSERTION_IMPORT_FAILURE_MESSAGE_PRESENTED);
    }
}
