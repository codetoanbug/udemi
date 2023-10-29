import {when, observable} from 'mobx';
import {inject} from 'mobx-react';
import React, {useState} from 'react';

import {FunnelLogContextStore} from '@udemy/funnel-tracking';
import {PriceTextProps as BasePriceTextProps} from '@udemy/react-merchandising-components';
import {trackPriceImpression, PriceTextTrackingProps} from '@udemy/shopping';
import {useUDData} from '@udemy/ud-data';

/**
 * Props for price text components from `@udemy/browse-course` that include
 * built-in view tracking.
 */
export type PriceTextProps = BasePriceTextProps &
    Partial<Pick<PriceTextTrackingProps, 'trackingEventContext'>>;

/**
 * Higher-order component to add view tracking to price text components.
 *
 * @param PriceTextComponent - price text component that renders with `PriceTextProps`
 * @returns a component to render price text with view tracking fired from the price text `view` event
 */
export const withPriceTextTracking = (PriceTextComponent: React.ComponentType<PriceTextProps>) => {
    const displayName = PriceTextComponent.displayName ?? PriceTextComponent.name ?? 'Component';

    const PriceTextWithTracking = Object.assign(
        inject(({funnelLogContextStore}) => ({funnelLogContextStore}))(
            ({
                funnelLogContextStore,
                ...props
            }: PriceTextProps & {funnelLogContextStore?: FunnelLogContextStore}) => {
                const {Config: udConfig, me: udMe} = useUDData();
                const [udMeLoading] = useState(observable({isLoading: false}));
                // Retain observable in state so `when` guard can watch the same reference
                udMeLoading.isLoading = udMe.isLoading;

                const onViewWithTracking = async () => {
                    props.onView?.();

                    await when(() => !udMeLoading.isLoading);

                    trackPriceImpression({
                        ...props,
                        funnelLogContextStore,
                        currency: udConfig.price_country.currency,
                    });
                };

                return <PriceTextComponent {...props} onView={onViewWithTracking} />;
            },
        ),
        {displayName: `WithPriceTextTracking(${displayName})`},
    );

    return PriceTextWithTracking;
};
