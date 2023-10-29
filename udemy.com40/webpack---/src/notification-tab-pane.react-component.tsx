import {observer} from 'mobx-react';
import React, {useCallback} from 'react';

import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';

import {ActivityNotification} from './activity-notification.react-component';
import {
    ActivityNotificationsStore,
    TabState,
    ValidTabName,
} from './activity-notifications.mobx-store';
import styles from './activity-notifications.module.less';

interface NotificationTabPaneProps {
    store: ActivityNotificationsStore;
    tabName: ValidTabName;
}

export const NotificationTabPane = observer(({store, tabName}: NotificationTabPaneProps) => {
    const {gettext} = useI18n();

    const onClickLoadMore = useCallback(() => {
        store.loadNextPageOfNotifications(tabName);
    }, [store, tabName]);

    const onClickMarkAllAsRead = useCallback(() => {
        store.markAllNotificationsAsRead(tabName);
    }, [store, tabName]);

    const renderFooter = useCallback(
        (tab: TabState) => {
            if (tab.loadingState !== 'LOADED' || tab.unreadActivitiesCount === 0) {
                return null;
            }
            return (
                <div className={styles['footer']}>
                    <Button
                        udStyle="ghost"
                        onClick={onClickMarkAllAsRead}
                        data-purpose="mark-all-as-read"
                    >
                        {gettext('Mark all as read')}
                    </Button>
                </div>
            );
        },
        [gettext, onClickMarkAllAsRead],
    );

    const tab = store[tabName];

    if (!tabName || (tab?.loadingState === 'LOADED' && tab.totalActivitiesCount === 0)) {
        return (
            <div
                data-testid={`notification-tab-pane-${tabName}`}
                data-purpose="notification-tab-pane"
                className={`ud-text-lg ${styles['no-notifications']}`}
            >
                {gettext('No notifications.')}
            </div>
        );
    }

    return (
        <div data-testid={`notification-tab-pane-${tabName}`} data-purpose="notification-tab-pane">
            <div className={styles['notification-list']}>
                {tab?.notifications.map((notification) => (
                    <ActivityNotification
                        key={notification.mainActivity.id}
                        store={store}
                        notification={notification}
                        tabName={tabName}
                    />
                ))}
            </div>
            {tab?.loadingState === 'LOADED' && tab.hasNextPage && (
                <div className={styles['load-more-row']}>
                    <Button data-purpose="load-more" onClick={onClickLoadMore}>
                        {gettext('Load more')}
                    </Button>
                </div>
            )}
            {tab?.loadingState === 'LOADING' && (
                <div className={styles['load-more-row']}>
                    <Loader size="large" />
                </div>
            )}
            {renderFooter(tab as TabState)}
        </div>
    );
});
