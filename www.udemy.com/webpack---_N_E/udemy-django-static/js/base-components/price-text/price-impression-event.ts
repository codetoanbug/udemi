import PURCHASE_PRICE_TYPES from 'udemy-django-static/js/base-components/price-text/constants';
import {ClientEvent} from '@udemy/event-tracking';

import {PriceTextProps as DSWPriceTextProps} from '@udemy/react-merchandising-components';
import {when} from 'mobx';
import udMe from 'udemy-django-static/js/utils/ud-me';
import getConfigData from 'udemy-django-static/js/utils/get-config-data';
import {Tracker} from '@udemy/event-tracking';
import {roundNumber} from '@udemy/i18n';

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

export interface PriceTextProps extends DSWPriceTextProps {
    trackingEventContext?: Omit<
        PriceImpressionEventContext,
        'listPrice' | 'discountPrice' | 'displayedPrice'
    >;
}
export const trackPriceImpression = async (props: PriceTextProps) => {
    await when(() => !udMe.isLoading);

    if (props.trackingEventContext) {
        const listPrice = roundNumber(props.listPrice, 0).toFixed(2);
        const discountPrice = roundNumber(props.discountPrice, 0).toFixed(2);
        const displayedPrice =
            (!props.showListPriceOnly && (props.discountPriceString || discountPrice || '0')) ||
            props.listPriceString ||
            listPrice;

        const context = {
            priceServeTrackingId: props.trackingEventContext.priceServeTrackingId,
            /** @ts-expect-error context is added by extendObservable, and cannot be set otherwise, FunnelLogContextStore is not TS yet either */
            context: props.funnelLogContextStore?.context,
            listPrice,
            discountPrice,
            displayedPrice,
            buyableType: props.trackingEventContext.buyableType,
            buyableId: props.trackingEventContext.buyableId,
            priceType: props.trackingEventContext.priceType,
            buyableTrackingId: props.trackingEventContext.buyableTrackingId,
            currency: getConfigData().price_country.currency,
        };
        const priceEvent = new PriceImpressionEvent({context});
        Tracker.publishEvent(priceEvent);
    }
};
