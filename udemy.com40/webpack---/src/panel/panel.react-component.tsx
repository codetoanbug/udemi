import classNames from 'classnames';
import React from 'react';

import styles from './panel.module.less';

/** React props interface for the Panel component */
export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * The type of Box shadow to apply
     *
     * - `normal` - applies an the `@box-shadow-100` design token.
     * - `inverted` - applies the `@box-shadow-inverted-100` design token.
     *
     * @defaultValue `normal` in Panel
     */
    shadow?: 'normal' | 'inverted';
    /**
     * Optional flag to remove the border from being displayed
     *
     * @defaultValue `true` in Panel
     */
    border?: boolean;
    /**
     * The amount of internal padding to apply to the Panel.
     *
     * @defaultValue `small` in Panel
     */
    padding?: 'small' | 'medium';
}

/**
 * ### The Panel component.
 */
export const Panel = ({
    shadow = 'normal',
    border = true,
    padding = 'small',
    className,
    children,
    ...htmlProps
}: PanelProps) => {
    const classes = classNames(className, styles.panel, {
        [styles.inverted]: shadow === 'inverted',
        [styles['no-border']]: !border,
        [styles['medium-padding']]: padding === 'medium',
    });

    return (
        <div {...htmlProps} className={classes}>
            {children}
        </div>
    );
};
