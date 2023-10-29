import {LocalizedHtml, useI18n} from '@udemy/i18n';
import AlarmIcon from '@udemy/icons/dist/alarm.ud-icon';
import classNames from 'classnames';
import React, {useEffect, useMemo, useRef, useState} from 'react';

import {LAB_UI_REGION} from 'labs/constants';

import {CONVERTED_TIMES} from './constants';
import styles from './lab-duration.less';
import {LabRemainingDuration} from './lab-remaining-duration.react-component';

interface LabDurationProps {
    durationInSeconds: number;
    iconSize?: 'xsmall' | 'small';
    isCountDownEnabled?: boolean;
    uiRegion?: string;
    shouldShowTimeOnly?: boolean;
    withIcon?: boolean;
    shouldHighlightTextInRed?: boolean;
    className?: string;
}

export const LabDuration = ({
    durationInSeconds,
    iconSize = 'xsmall',
    isCountDownEnabled = true,
    uiRegion,
    shouldShowTimeOnly = false,
    withIcon = true,
    shouldHighlightTextInRed = true,
    className,
}: LabDurationProps) => {
    const {gettext, ninterpolate} = useI18n();
    const [timeRemainingSeconds, setRemainingTime] = useState(durationInSeconds);
    const timer = useRef<NodeJS.Timer | null>(null);
    const isLabLauncher = uiRegion === LAB_UI_REGION.LAUNCHER;

    useEffect(() => {
        setRemainingTime(durationInSeconds);
    }, [durationInSeconds]);

    useEffect(() => {
        if (
            isCountDownEnabled &&
            timeRemainingSeconds > 0 &&
            timeRemainingSeconds <= CONVERTED_TIMES.TWELVE_HOURS_IN_SECONDS
        ) {
            // Update the remaining time every second
            timer.current = setInterval(() => {
                setRemainingTime((prevTime) => prevTime - 1);
            }, 1000);

            return () => {
                timer.current && clearInterval(timer.current);
            };
        }
    }, [isCountDownEnabled, timeRemainingSeconds]);

    useEffect(() => {
        if (timeRemainingSeconds <= 0) {
            setRemainingTime(0);
            timer.current && clearInterval(timer.current);
        }
    }, [timeRemainingSeconds]);

    /* Duration:
    - less than 30min: displays countdown (in red) => 0h Xm Ys
    - less than 3h: displays countdown (in red - except in the lab taking page - launcher) =>  Xh Ym
    - less than 12h: displays countdown => Xh Ym
    - more than 12h and less than 24h: 1 day left
    - more than 24h: X days left.
    */
    const labDuration = useMemo(() => {
        const days = Math.ceil(timeRemainingSeconds / CONVERTED_TIMES.DAY_IN_SECONDS);

        switch (true) {
            case timeRemainingSeconds <= CONVERTED_TIMES.THIRTY_MINUTES_IN_SECONDS:
                return (
                    <LabRemainingDuration
                        timeRemainingSeconds={timeRemainingSeconds}
                        shouldHighlightTextInRed={shouldHighlightTextInRed}
                        precisionInSeconds={true}
                        displayShortText={isLabLauncher}
                        shouldShowTimeOnly={shouldShowTimeOnly}
                    />
                );
            case timeRemainingSeconds <= CONVERTED_TIMES.THREE_HOURS_IN_SECONDS:
                return (
                    <LabRemainingDuration
                        timeRemainingSeconds={timeRemainingSeconds}
                        shouldHighlightTextInRed={!isLabLauncher && shouldHighlightTextInRed}
                        displayShortText={isLabLauncher}
                        shouldShowTimeOnly={shouldShowTimeOnly}
                    />
                );
            case timeRemainingSeconds <= CONVERTED_TIMES.TWELVE_HOURS_IN_SECONDS:
                return (
                    <LabRemainingDuration
                        timeRemainingSeconds={timeRemainingSeconds}
                        displayShortText={isLabLauncher}
                        shouldShowTimeOnly={shouldShowTimeOnly}
                    />
                );
            case timeRemainingSeconds <= CONVERTED_TIMES.DAY_IN_SECONDS:
                if (shouldShowTimeOnly) {
                    return (
                        <LabRemainingDuration
                            timeRemainingSeconds={timeRemainingSeconds}
                            displayShortText={false}
                            shouldShowTimeOnly={shouldShowTimeOnly}
                        />
                    );
                }
                if (isLabLauncher) {
                    return (
                        <LocalizedHtml
                            html={gettext('<b>Less than 1 day left</b>')}
                            interpolate={{}}
                        />
                    );
                }
                return (
                    <LocalizedHtml
                        html={gettext('<b>Less than 1 day left</b> to complete project')}
                        interpolate={{}}
                    />
                );
            default:
                if (shouldShowTimeOnly) {
                    return (
                        <LocalizedHtml
                            html={ninterpolate('<b>%s day</b>', '<b>%s days</b>', days)}
                            interpolate={{}}
                        />
                    );
                }
                if (isLabLauncher) {
                    return (
                        <LocalizedHtml
                            html={ninterpolate('<b>%s day left</b>', '<b>%s days left</b>', days)}
                            interpolate={{}}
                        />
                    );
                }
                return (
                    <LocalizedHtml
                        html={ninterpolate(
                            '<b>%s day left</b> to complete project',
                            '<b>%s days left</b> to complete project',
                            days,
                        )}
                        interpolate={{}}
                    />
                );
        }
    }, [isLabLauncher, timeRemainingSeconds]); // eslint-disable-line react-hooks/exhaustive-deps
    // using eslint-disable because gettext is being added automatically to the deps

    if (timeRemainingSeconds <= 0) {
        // Make sure negative time is never displayed
        return null;
    }

    const labDurationFragment = (
        <>
            {withIcon && (
                <AlarmIcon
                    label="alarm"
                    size={iconSize}
                    className={classNames(styles['alarm-icon'], {
                        [styles['text-red']]:
                            isLabLauncher &&
                            timeRemainingSeconds <= CONVERTED_TIMES.THIRTY_MINUTES_IN_SECONDS,
                    })}
                />
            )}
            {labDuration}
        </>
    );

    return className ? <div className={className}>{labDurationFragment}</div> : labDurationFragment;
};
