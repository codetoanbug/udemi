import {observer} from 'mobx-react';
import React from 'react';

import {ButtonSizeType, ButtonStyleType} from '@udemy/react-core-components';

import {
    ExpressCheckoutButton,
    ExpressCheckoutEventType,
} from '../express-checkout-button/express-checkout-button.react-component';

/**
 * Props for the `BuyButton` component. For details on what each prop means, refer
 * to the `ExpressCheckoutButton`
 */
export interface BuyButtonProps {
    buy_url: string;
    text: string;
    size?: ButtonSizeType;
    style?: ButtonStyleType;
    enrollment_disabled?: boolean;
    event_type: ExpressCheckoutEventType;
    eventTrackingContext: {
        courseTrackingId: string;
    };
    payment_data?: {
        buyableId: string;
        buyableType: string;
    };
}

/**
 * This component primarily just wraps the `ExpressCheckoutButton` and forwards its props in
 * the correct format
 */
export const BuyButton = observer(
    ({
        buy_url,
        text,
        size = 'large',
        style = 'brand',
        enrollment_disabled,
        event_type,
        eventTrackingContext,
        payment_data,
    }: BuyButtonProps) => {
        const [isMounted, setIsMounted] = React.useState(false);

        React.useEffect(() => {
            setIsMounted(true);
        }, []);

        const isDisabled = !isMounted || enrollment_disabled;

        const clickEventData = payment_data
            ? {
                  buyable: {
                      id: payment_data.buyableId,
                      type: payment_data.buyableType,
                      trackingId: eventTrackingContext?.courseTrackingId,
                  },
                  eventType: event_type,
              }
            : undefined;

        return (
            <ExpressCheckoutButton
                bsStyle={style}
                buttonText={text}
                checkoutUrl={buy_url}
                isDisabled={isDisabled}
                size={size}
                clickEventData={clickEventData}
            />
        );
    },
);

// TODO: CLP integration?
// export const BuyButton = injectCourseLandingPageData('buy_button', true)(BaseBuyButton);

// export const CacheableBuyButton = injectCourseLandingPageData(
//     'buy_button',
//     true,
// )(({button, eventTrackingContext}) => (
//     <BaseBuyButton {...button} eventTrackingContext={eventTrackingContext} />
// ));
