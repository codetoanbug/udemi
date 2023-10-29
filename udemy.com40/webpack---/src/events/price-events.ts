import {ClientEvent, Tracker} from '@udemy/event-tracking';
import {roundNumber} from '@udemy/i18n';
import {PriceTextProps} from '@udemy/react-merchandising-components';

export const PURCHASE_PRICE_TYPES = {
    individual_buyable: 'buyable_price',
    individual_shopping_buyable: 'buyable_cart_price',
    bundle: 'bundle_price',
    subtotal: 'subtotal_price',
    total: 'total_price',
};

export interface PriceImpressionEventContext {
    priceServeTrackingId?: string;
    buyableTrackingId?: string;
    context?: string;
    currency?: string;
    listPrice: string;
    discountPrice: string;
    displayedPrice: string;
    priceType?: (typeof PURCHASE_PRICE_TYPES)[keyof typeof PURCHASE_PRICE_TYPES];
    buyableType?: string;
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

export type PriceTextTrackingProps = {
    currency: string;
    funnelLogContextStore?: {context?: string};
    trackingEventContext?: Omit<
        PriceImpressionEventContext,
        'listPrice' | 'discountPrice' | 'displayedPrice'
    >;
};

export const trackPriceImpression = async ({
    currency,
    funnelLogContextStore,
    ...props
}: PriceTextProps & PriceTextTrackingProps) => {
    if (props.trackingEventContext) {
        const listPrice = roundNumber(props.listPrice, 0).toFixed(2);
        const discountPrice = roundNumber(props.discountPrice, 0).toFixed(2);
        const displayedPrice =
            (!props.showListPriceOnly && (props.discountPriceString || discountPrice || '0')) ||
            props.listPriceString ||
            listPrice;

        const context = {
            priceServeTrackingId: props.trackingEventContext.priceServeTrackingId,
            context: funnelLogContextStore?.context,
            listPrice,
            discountPrice,
            displayedPrice,
            buyableType: props.trackingEventContext.buyableType,
            buyableId: props.trackingEventContext.buyableId,
            priceType: props.trackingEventContext.priceType,
            buyableTrackingId: props.trackingEventContext.buyableTrackingId,
            currency,
        };
        const priceEvent = new PriceImpressionEvent({context});
        Tracker.publishEvent(priceEvent);
    }
};
