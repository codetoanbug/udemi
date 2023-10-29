import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {NotificationBadge} from '@udemy/react-messaging-components';

import {useHeaderStore} from './hooks/use-header-store';

interface HeaderBadgeProps extends React.ComponentProps<typeof NotificationBadge> {
    dot?: boolean;
}

export const UnreadActivityNotificationsBadge = observer(({dot, ...props}: HeaderBadgeProps) => {
    const headerStore = useHeaderStore();
    const {ninterpolate} = useI18n();

    const count = headerStore.notificationBadgeContext.unreadActivityNotifications ?? 0;

    return (
        <NotificationBadge
            {...props}
            label={ninterpolate(
                '%(count)s unread notification',
                '%(count)s unread notifications',
                count,
                {count},
            )}
            data-testid="unread-activity-notifications-badge"
        >
            {dot && count > 0 ? null : count}
        </NotificationBadge>
    );
});

export const UnreadMessagesBadge = observer((props: HeaderBadgeProps) => {
    const headerStore = useHeaderStore();
    const {ninterpolate} = useI18n();

    const count = headerStore.notificationBadgeContext.unreadMessages ?? 0;

    return (
        <NotificationBadge
            {...props}
            label={ninterpolate('%(count)s unread message', '%(count)s unread messages', count, {
                count,
            })}
            data-testid="unread-messages-badge"
        >
            {count}
        </NotificationBadge>
    );
});

export const UnseenCreditsBadge = observer(({...props}: HeaderBadgeProps) => {
    const headerStore = useHeaderStore();
    const {ninterpolate} = useI18n();

    const count = headerStore.notificationBadgeContext.unseenCredits;

    return (
        <NotificationBadge
            {...props}
            label={ninterpolate('%(count)s unseen credit', '%(count)s unseen credits', count, {
                count,
            })}
            data-testid="unseen-credits-badge"
        >
            {count}
        </NotificationBadge>
    );
});

export const CartBadge = observer(({...props}: HeaderBadgeProps) => {
    const headerStore = useHeaderStore();
    const {ninterpolate} = useI18n();

    const count = headerStore.notificationBadgeContext.cartBuyables;

    return (
        <NotificationBadge
            {...props}
            aria-hidden="true"
            label={ninterpolate(
                '%(count)s item in the cart',
                '%(count)s items in the cart',
                count,
                {count},
            )}
            data-testid="cart-badge"
        >
            {count}
        </NotificationBadge>
    );
});

export const ProfileBadge = observer(({dot, ...props}: HeaderBadgeProps) => {
    const headerStore = useHeaderStore();
    const {gettext} = useI18n();

    const count = headerStore.notificationBadgeContext.unreadAlerts;

    return (
        <NotificationBadge
            {...props}
            label={gettext('You have alerts')}
            data-testid="profile-badge"
        >
            {dot && count > 0 ? null : count}
        </NotificationBadge>
    );
});
