import {useI18n} from '@udemy/i18n';
import classNames from 'classnames';
import React from 'react';

import styles from './notification-badge.module.less';

/** React props interface for the `NotificationBadge` component */
interface NotificationBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Child content of the NotificationBadge, `number` being most commonly used */
    children?: string | number | null;
    /** Adds a native browser chrome tooltip with text to the NotificationBadge (a `span`) element.
     *  Normally, a NotificationBadge is used to display either a dot or a number.
     *  This can help provide more context to a user.
     */
    label?: string;
}

/** NotificationBadge component used to alert a user of a pressing communication  */
export const NotificationBadge = ({
    label,
    children = null,
    className,
    ...htmlProps
}: NotificationBadgeProps) => {
    const {gettext} = useI18n();
    const isDot = children === null;
    const classes = classNames(
        className,
        styles['ud-notification-badge'],
        isDot ? styles['ud-notification-dot'] : styles['ud-notification-counter'],
    );
    let content = children;
    if (!isDot) {
        const count = typeof children === 'string' ? parseInt(children, 10) : children;
        if (!count || count <= 0) {
            return null;
        }
        if (count && count > 9) {
            content = gettext('9+');
        }
    }
    return (
        <span {...htmlProps} className={classes} title={label}>
            {content}
        </span>
    );
};
