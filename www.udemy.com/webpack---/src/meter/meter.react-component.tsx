import {useI18n} from '@udemy/i18n';
import classNames from 'classnames';
import React from 'react';

import styles from './meter.module.less';

/** React props interface for the `Meter` component */
interface MeterProps extends React.HTMLAttributes<HTMLDivElement> {
    /** The value of the Meter. Somewhere between the `min` and `max` properties */
    value: number;
    /** The minimum value of the Meter component's range. */
    min: number;
    /** The maximum value of the Meter component's range. */
    max: number;
    /** aria-label used for a11y.  Used in conjunction with the `interpolate` string helper.
     *  The `interpolate` function provides three values for interpolation:
     *  - props.mix
     *  - props.max
     *  - props.value
     *  - percent - an internal calculation using `min`, `max`, and `value`.
     *
     *  Example format `label` string to interpolate:
     *  `From %(min)s to %(max)s you are at %(value)s, which is at %(percent)s%.`
     */
    label: string;
}

/**
 * The Meter component is modeled after the HTML5 <meter /> tag:
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meter
 *
 * @privateRemarks
 *
 * We are not actually rendering a <meter /> HTML tag because it is
 * difficult to style.
 */
export const Meter = ({value, min, max, label, className, ...htmlProps}: MeterProps) => {
    const {interpolate} = useI18n();
    const percent = Math.round(((value - min) / (max - min)) * 100);
    return (
        <div
            {...htmlProps}
            className={classNames(className, 'ud-meter-wrapper', styles['meter-wrapper'])}
        >
            <div
                className={classNames('ud-meter', styles.meter)}
                style={{transform: `scaleX(${percent / 100})`}}
                aria-label={interpolate(label, {value, min, max, percent}, true)}
                data-purpose="meter"
            />
        </div>
    );
};
