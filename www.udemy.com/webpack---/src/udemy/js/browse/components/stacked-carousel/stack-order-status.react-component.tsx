import {useI18n} from '@udemy/i18n';
import classNames from 'classnames';
import React from 'react';

import styles from './stack-order-status.less';

/** React props interface for the `StackOrderStatus` component */
interface StackOrderStatusProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * The index of the card that is currently on top of the stacked carousel.
     */
    cardNumber: number;
    /**
     * The total number of cards in the stacked carousel.
     */
    cardCount: number;
}

export const StackOrderStatus = ({cardNumber = 0, cardCount = 0}: StackOrderStatusProps) => {
    const {gettext, interpolate} = useI18n();

    cardNumber = cardNumber + 1;
    return (
        <div className={styles['stack-order-box']}>
            <div className={classNames(styles['stack-order-text'], 'ud-heading-xs')}>
                {interpolate(
                    gettext('%(cardNumber)s of %(cardCount)s'),
                    {cardNumber, cardCount},
                    true,
                )}
            </div>
        </div>
    );
};
