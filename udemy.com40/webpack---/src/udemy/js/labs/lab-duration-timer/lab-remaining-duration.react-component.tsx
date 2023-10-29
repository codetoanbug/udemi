import {LocalizedHtml, useI18n} from '@udemy/i18n';
import {Duration} from '@udemy/react-date-time-components';
import classNames from 'classnames';
import React from 'react';

import styles from './lab-duration.less';

interface LabRemainingDurationProps {
    timeRemainingSeconds: number;
    shouldHighlightTextInRed?: boolean;
    precisionInSeconds?: boolean;
    displayShortText?: boolean;
    shouldShowTimeOnly?: boolean;
}

export const LabRemainingDuration = ({
    timeRemainingSeconds,
    shouldHighlightTextInRed = false,
    precisionInSeconds = false,
    displayShortText = false,
    shouldShowTimeOnly = false,
}: LabRemainingDurationProps) => {
    const {gettext, interpolate} = useI18n();
    if (shouldShowTimeOnly) {
        return (
            <Duration
                className="ud-text-bold"
                numSeconds={timeRemainingSeconds}
                precision={
                    precisionInSeconds ? Duration.PRECISION.SECONDS : Duration.PRECISION.MINUTES
                }
                presentationStyle={Duration.STYLE.HUMAN_COMPACT}
            />
        );
    }
    return (
        <span
            className={classNames({
                [styles['text-subdued']]: displayShortText,
                [styles['text-red']]: shouldHighlightTextInRed,
            })}
        >
            <LocalizedHtml
                html={interpolate(
                    displayShortText
                        ? gettext('<span class="duration">%(duration)s</span> <b>left</b>')
                        : gettext(
                              '<span class="duration">%(duration)s</span> left to complete project',
                          ),
                    true,
                )}
                interpolate={{
                    duration: (
                        <Duration
                            className="ud-text-bold"
                            numSeconds={timeRemainingSeconds}
                            precision={
                                precisionInSeconds
                                    ? Duration.PRECISION.SECONDS
                                    : Duration.PRECISION.MINUTES
                            }
                            presentationStyle={Duration.STYLE.HUMAN_COMPACT}
                        />
                    ),
                }}
            />
        </span>
    );
};
