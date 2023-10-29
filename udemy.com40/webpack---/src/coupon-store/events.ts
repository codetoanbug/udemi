import {ClientEvent} from '@udemy/event-tracking';

export interface TrackableBuyable {
    id: number;
    type: string;
    trackingId: string;
}

type CouponApplicationMethod = 'manual_entry' | 'url_param';

/**
 * Fired whenever a coupon is applied on the CLP or cart page, either by manual
 * entry from the user or being included as a URL param
 */
export class CouponApplyEvent extends ClientEvent {
    constructor(
        private buyables: TrackableBuyable[],
        private couponCode: string,
        private applicationMethod: CouponApplicationMethod,
    ) {
        super('CouponApplyEvent');
    }
}

/**
 * Fired whenever a coupon is removed from the CLP or cart page
 */
export class CouponRemoveEvent extends ClientEvent {
    constructor(private buyables: TrackableBuyable[], private couponCode: string) {
        super('CouponRemoveEvent');
    }
}
