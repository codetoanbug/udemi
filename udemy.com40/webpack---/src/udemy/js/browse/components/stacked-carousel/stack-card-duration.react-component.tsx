import {LocalizedHtml, useI18n} from '@udemy/i18n';
import PlayArrowIcon from '@udemy/icons/dist/play-arrow.ud-icon';
import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {Duration} from '@udemy/react-date-time-components';
import classNames from 'classnames';
import React from 'react';

import styles from './stack-card-duration.less';

/** React props interface for the `StackOrderDuration` component */
interface StackCardDurationProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Flag to note if lecture on card is currently in progress.
     *
     * @defaultValue false in StackCardDuration
     */
    inProgress?: boolean;
    /**
     * Flag to note if lecture on card has been completed.
     *
     * @defaultValue false in StackCardDuration
     */
    completed?: boolean;
    /**
     * Total time in seconds of lecture on card.
     *
     * @defaultValue 600 in StackCardDuration
     *
     * @remarks
     * Remaining time and duration numbers to be provided in seconds. Should be less than 1 hour (3600 seconds) for styling.
     */
    duration?: number;
    /**
     * Time in seconds of the remainder of in progress lecture on card.
     *
     * @defaultValue 600 in StackCardDuration
     */
    remainingTime?: number;
    /**
     * Name of class to pass into 'Duration' component to determine styling.
     *
     * @defaultValue undefined in StackCardDuration
     */
    className?: string;
}

export const StackCardDuration = ({
    completed = false,
    inProgress = false,
    duration = 600,
    remainingTime = 600,
    className = undefined,
}: StackCardDurationProps) => {
    const {gettext} = useI18n();
    return (
        <div className={classNames(styles['stack-card-container'], className)}>
            <span className={classNames(styles['stack-card-content'], 'ud-heading-xs')}>
                {completed ? (
                    <>
                        <TickIcon
                            className={styles.icon}
                            size="small"
                            label={gettext('Tick Icon')}
                        />
                        <span className={styles['stack-card-content-text']}>
                            {gettext('Watched')}
                        </span>
                    </>
                ) : (
                    <>
                        <PlayArrowIcon
                            className={styles.icon}
                            size="xsmall"
                            label={gettext('Lecture Length')}
                        />
                        {inProgress ? (
                            <LocalizedHtml
                                className={styles['stack-card-content-text']}
                                html={gettext('<span class="duration">%(duration)</span> left')}
                                interpolate={{
                                    duration: (
                                        <Duration
                                            numSeconds={Number(remainingTime)}
                                            presentationStyle={Duration.STYLE.HUMAN_COMPACT}
                                        />
                                    ),
                                }}
                            />
                        ) : (
                            <Duration
                                className={styles['stack-card-content-text']}
                                numSeconds={Number(duration)}
                                presentationStyle={'timestamp'}
                            />
                        )}
                    </>
                )}
            </span>
        </div>
    );
};
