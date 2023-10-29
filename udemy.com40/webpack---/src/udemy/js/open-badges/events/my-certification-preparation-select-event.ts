import {ClientEvent} from '@udemy/event-tracking';

import {Badge} from '../common/utils/event-helpers';

export class EnrolledCertificateSelectEvent extends ClientEvent {
    private certification: Badge;
    constructor(event: string, badge: Badge) {
        super(event);
        this.certification = badge;
    }
}
