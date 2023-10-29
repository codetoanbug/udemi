import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import {BuyNowEvent, EnrollNowEvent} from '@udemy/browse-event-tracking';
import {Tracker} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import {Button, ButtonSizeType, ButtonStyleType} from '@udemy/react-core-components';
import {serverOrClient} from '@udemy/shared-utils';
import {useUDData, useUDLink} from '@udemy/ud-data';

import {CheckoutReferrerHelper} from './checkout-referrer-helper';
import styles from './express-checkout-button.module.less';

export type ExpressCheckoutEventType = 'enroll_now' | 'buy_now';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const eventTypeToEvent: Record<ExpressCheckoutEventType, any> = {
    enroll_now: EnrollNowEvent,
    buy_now: BuyNowEvent,
};

/**
 * Props for the `ExpressCheckoutButton` component
 */
export interface ExpressCheckoutButtonProps {
    /**
     * The UD style of the button
     * @default 'brand'
     */
    bsStyle?: ButtonStyleType;
    /**
     * The text to be displayed on the button
     * @default gettext('Buy now')
     */
    buttonText?: string;
    /**
     * The checkout URL to redirect to on click
     */
    checkoutUrl: string;
    /**
     * If true, the button is disabled
     */
    isDisabled?: boolean;
    /**
     * The size of the button
     * @default 'large'
     */
    size?: ButtonSizeType;
    /**
     * Optional class name to add to the `Button` component
     */
    className?: string;
    /**
     * Data used to construct the click event
     */
    clickEventData?: {
        buyable: {
            id: string | number;
            type: string;
            trackingId: string;
        };
        eventType: ExpressCheckoutEventType;
    };
}

export const ExpressCheckoutButton = observer(
    ({
        bsStyle = 'brand',
        buttonText,
        checkoutUrl,
        isDisabled,
        size = 'large',
        className,
        clickEventData,
    }: ExpressCheckoutButtonProps) => {
        const udData = useUDData();
        const udLink = useUDLink();
        const {gettext} = useI18n();

        function redirectToCheckoutUrl() {
            // click tracking
            if (clickEventData) {
                const {buyable, eventType} = clickEventData;
                const Event = eventTypeToEvent[eventType];
                if (Event) {
                    Tracker.publishEvent(new Event({buyable}));
                }
            }

            CheckoutReferrerHelper.saveCheckoutReferrer();
            if (udData.me.is_authenticated) {
                serverOrClient.global.location.href = checkoutUrl;
            } else {
                const signupUrl = udLink.to('join', 'signup-popup', {
                    next: checkoutUrl,
                });
                serverOrClient.global.location.href = signupUrl;
            }
        }

        return (
            <div>
                <Button
                    data-testid="buy-button"
                    size={size}
                    udStyle={bsStyle}
                    onClick={redirectToCheckoutUrl}
                    className={classNames(styles.button, className)}
                    disabled={isDisabled || udData.me.isLoading}
                >
                    {buttonText ?? gettext('Buy now')}
                </Button>
            </div>
        );
    },
);
