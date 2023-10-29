import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import NotificationIcon from '@udemy/icons/dist/notification.ud-icon';

import {UnreadActivityNotificationsBadge} from '../../badges.react-component';
import {useActivityNotificationsStore} from '../../hooks/use-activity-notifications-store';
import {useHeaderStore} from '../../hooks/use-header-store';
import styles from '../desktop-header.module.less';
import {HeaderDropdown, HeaderButton, HeaderMenu} from '../header-dropdown.react-component';
import {NotificationItems} from './notification-items.react-component';

export interface NotificationDropdownProps {
    className: string;
}

export const NotificationDropdown = observer(({className}: NotificationDropdownProps) => {
    const activityNotificationsStore = useActivityNotificationsStore();
    const headerStore = useHeaderStore();
    const {gettext} = useI18n();

    const badge = (
        <UnreadActivityNotificationsBadge dot={true} className={styles['dropdown-dot-badge']} />
    );
    return (
        <HeaderDropdown
            trigger={
                <HeaderButton
                    componentClass="a"
                    href={headerStore.urls.VIEW_NOTIFICATIONS}
                    udStyle="icon"
                    overlaychildren={badge}
                >
                    <NotificationIcon color="neutral" label={gettext('Notifications')} />
                </HeaderButton>
            }
            className={className}
            onFirstOpen={activityNotificationsStore.initializeNotifications}
        >
            <HeaderMenu>
                <NotificationItems />
            </HeaderMenu>
        </HeaderDropdown>
    );
});
