import {ClientEvent} from '@udemy/event-tracking';

import {Badge} from '../common/utils/event-helpers';

export class CertificateSelectEvent extends ClientEvent {
    private badge: Badge;
    constructor(event: string, badge: Badge) {
        super(event);
        this.badge = badge;
    }
}
