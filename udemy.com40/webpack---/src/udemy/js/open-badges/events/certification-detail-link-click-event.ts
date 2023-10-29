import {ClientEvent} from '@udemy/event-tracking';

import {Badge} from '../common/utils/event-helpers';
import {EVENT_LABEL} from '../constants';

export class CertificateDetailLinkClickEvent extends ClientEvent {
    private badge: Badge;
    constructor(badge: Badge) {
        super(EVENT_LABEL.CLICK_CERTIFICATE_DETAIL_LINK);
        this.badge = badge;
    }
}
