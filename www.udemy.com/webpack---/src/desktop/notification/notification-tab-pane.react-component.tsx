import {observer} from 'mobx-react';
import React from 'react';

import {TabState, ValidTabName} from '@udemy/activity-notifications';
import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {CourseCardSkeletonGroup} from '@udemy/react-reveal-components';

import {useActivityNotificationsStore} from '../../hooks/use-activity-notifications-store';
import {useHeaderStore} from '../../hooks/use-header-store';
import menuStyles from '../panel-menu.module.less';
import {NotificationItem} from './notification-item.react-component';
import styles from './notification-items.module.less';

export const MAX_NOTIFICATIONS_TO_SHOW = 3;

export const NotificationItemsSkeleton = () => (
    <div
        className={`${menuStyles.panel} ${styles.panel}`}
        data-testid="notification-items-skeleton"
    >
        <CourseCardSkeletonGroup
            size="small"
            style={{width: '32.8rem', maxWidth: '32.8rem', minWidth: '32.8rem'}}
            imageStyle={{width: '6.4rem', height: '6.4rem', borderRadius: '50%'}}
            lineCount={3}
            cardCountPerRow={1}
            rowCount={2}
        />
    </div>
);

export const ZeroNotificationItems = () => {
    const {gettext} = useI18n();
    return (
        <div className={`ud-text-md ${menuStyles.panel} ${menuStyles['no-items']} ${styles.panel}`}>
            {gettext('No notifications.')}
        </div>
    );
};

export interface NotificationTabPaneProps {
    tabName: ValidTabName;
}

export const NotificationTabPane = observer(({tabName}: NotificationTabPaneProps) => {
    const headerStore = useHeaderStore();
    const activityNotificationsStore = useActivityNotificationsStore();
    const {gettext} = useI18n();

    const tabState = activityNotificationsStore[tabName] as TabState;

    function onClickMarkAsRead() {
        if (tabState?.unreadActivitiesCount > 0) {
            activityNotificationsStore.markAllNotificationsAsRead(tabName);
        }
    }

    function renderFooter() {
        return (
            <div className={menuStyles.footer}>
                <div className={styles['footer-btns']}>
                    <div className={styles['footer-btn-wrapper']}>
                        <Button
                            disabled={tabState.unreadActivitiesCount === 0}
                            onClick={onClickMarkAsRead}
                            udStyle="ghost"
                            className={menuStyles.cta}
                            data-testid="mark-all-notifications-as-read"
                        >
                            {gettext('Mark all as read')}
                        </Button>
                    </div>
                    <div className={styles['footer-btn-wrapper']}>
                        <Button
                            componentClass="a"
                            href={headerStore.urls.VIEW_NOTIFICATIONS}
                            udStyle="secondary"
                            className={menuStyles.cta}
                            data-testid="see-all-notifications"
                        >
                            {gettext('See all')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (tabState.loadingState !== 'LOADED') {
        return <NotificationItemsSkeleton />;
    }
    if (tabState.totalActivitiesCount === 0) {
        return <ZeroNotificationItems />;
    }

    const notifications = tabState.notifications.slice(0, MAX_NOTIFICATIONS_TO_SHOW);
    return (
        <>
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.mainActivity.id}
                    notification={notification}
                    tabName={tabName}
                    className={menuStyles.item}
                />
            ))}
            {renderFooter()}
        </>
    );
});
