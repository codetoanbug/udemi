import {useI18n} from '@udemy/i18n';
import {Meter} from '@udemy/react-messaging-components';
import React from 'react';

import styles from './card-info-container.less';
import {StackCardDuration} from './stack-card-duration.react-component';
import {StackOrderStatus} from './stack-order-status.react-component';

/** React props interface for the `CardInfoContainer` component */
interface CardInfoContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    cardNumber: number;
    cardCount: number;
    inProgress?: boolean;
    completed?: boolean;
    duration: number;
    remainingTime: number;
    percentComplete: number;
}

export const CardInfoContainer = ({
    cardNumber,
    cardCount,
    inProgress,
    completed,
    duration,
    remainingTime,
    percentComplete,
}: CardInfoContainerProps) => {
    const {gettext} = useI18n();
    const meterPresent = completed ?? inProgress;
    return (
        <div className={styles['card-info-container']}>
            <StackOrderStatus cardNumber={cardNumber} cardCount={cardCount} />
            <StackCardDuration
                inProgress={inProgress}
                completed={completed}
                duration={duration}
                remainingTime={remainingTime}
            />
            {meterPresent && (
                <Meter
                    value={percentComplete}
                    min={0}
                    max={100}
                    label={gettext('%(percent)s% complete')}
                    className={styles['card-progress-meter']}
                />
            )}
        </div>
    );
};
