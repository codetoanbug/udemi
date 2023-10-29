import {ClientEvent} from '@udemy/event-tracking';

import PURCHASE_PRICE_TYPES from 'base-components/price-text/constants';

export type PriceImpressionBuyableType = 'course';

export interface PriceImpressionEventContext {
    priceServeTrackingId?: string;
    buyableTrackingId?: string;
    context?: string;
    currency?: string;
    listPrice: string;
    discountPrice: string;
    displayedPrice: string;
    priceType: typeof PURCHASE_PRICE_TYPES[keyof typeof PURCHASE_PRICE_TYPES];
    buyableType?: PriceImpressionBuyableType;
    buyableId?: number;
}
export class PriceImpressionEvent extends ClientEvent {
    priceServeTrackingId;
    buyableTrackingId;
    context;
    currency;
    listPrice;
    discountPrice;
    displayedPrice;
    priceType;
    buyableType;
    buyableId;
    constructor({context}: {context: PriceImpressionEventContext}) {
        super('PriceImpressionEvent');
        this.priceServeTrackingId = context.priceServeTrackingId;
        this.buyableTrackingId = context.buyableTrackingId;
        this.context = context.context;
        this.currency = context.currency;

        this.listPrice = context.listPrice;
        this.discountPrice = context.discountPrice;
        this.displayedPrice = context.displayedPrice;
        this.priceType = context.priceType;

        this.buyableType = context.buyableType;
        this.buyableId = context.buyableId;
    }
}
