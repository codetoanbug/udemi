import {useI18n} from '@udemy/i18n';
import classNames from 'classnames';
import React from 'react';

import styles from './progress.module.less';

/** React Props interface for the Progress component */
export interface ProgressProps extends React.HTMLProps<HTMLProgressElement> {
    /** Label to associate with the progress bar */
    label: string;
    /**
     * Flag to display label text only for assistive technology
     *
     * @defaultValue - `true` in `Progress
     */
    srOnlyLabel?: boolean;
}

/**
 * ### Progress
 *
 * An implementation of the HTML5 `<progress />` element.
 *
 * @remarks
 * We currently do not support an indeterminate state for the progress bar.
 * The `max` value must be set until then.  It is defaulted to `100`.
 */
export const Progress = ({
    label,
    max = 100,
    value = 0,
    srOnlyLabel = true,
    className,
}: ProgressProps) => {
    const {interpolate, gettext} = useI18n();

    return (
        <label>
            <span className={srOnlyLabel ? 'ud-sr-only' : ''}>{label}</span>
            <progress
                className={classNames(styles['ud-progress'], className)}
                value={value}
                max={max}
            >
                {interpolate(gettext('%(value)s%'), {value}, true)}
            </progress>
        </label>
    );
};
