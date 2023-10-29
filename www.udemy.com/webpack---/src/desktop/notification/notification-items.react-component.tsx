import {observer} from 'mobx-react';
import React from 'react';

import {TAB_NAMES, TabState, ValidTabName} from '@udemy/activity-notifications';
import {formatNumber, useI18n} from '@udemy/i18n';
import {Tabs} from '@udemy/react-structure-components';

import {useActivityNotificationsStore} from '../../hooks/use-activity-notifications-store';
import {useHeaderStore} from '../../hooks/use-header-store';
import menuStyles from '../panel-menu.module.less';
import styles from './notification-items.module.less';
import {
    NotificationTabPane,
    NotificationItemsSkeleton,
    ZeroNotificationItems,
} from './notification-tab-pane.react-component';

export const NotificationItemsHeading = observer(() => {
    const headerStore = useHeaderStore();
    const {gettext} = useI18n();

    return (
        <div className={`${menuStyles['section-heading']} ${menuStyles['gap-bottom']}`}>
            <div className={`ud-heading-lg ${menuStyles['section-heading-title']}`}>
                {gettext('Notifications')}
            </div>
            {headerStore.userSpecificContext.user && (
                <a
                    className={`ud-heading-sm ${menuStyles['section-heading-link']}`}
                    href={headerStore.urls.EDIT_NOTIFICATIONS}
                >
                    {gettext('Settings')}
                </a>
            )}
        </div>
    );
});

export const NotificationItems = observer(() => {
    const activityNotificationsStore = useActivityNotificationsStore();
    const {gettext, locale} = useI18n();

    const store = activityNotificationsStore;
    const tabNames = Object.keys(TAB_NAMES).filter((tabName) => store[tabName as ValidTabName]);

    let content;
    if (store.user && tabNames.length === 0) {
        content = <ZeroNotificationItems />;
    } else if (store.user && tabNames.length === 1) {
        content = <NotificationTabPane tabName={store.activeTabName as ValidTabName} />;
    } else if (!store.user || !store.activeTabName) {
        content = <NotificationItemsSkeleton />;
    } else {
        content = (
            <Tabs fullWidth={true} size="small">
                {tabNames.map((tabName) => {
                    const {loadingState, unreadActivitiesCount} = store[
                        tabName as ValidTabName
                    ] as TabState;
                    const instructorText = gettext('Instructor');
                    const studentText = gettext('Student');
                    let title = tabName === 'instructor' ? instructorText : studentText;
                    if (loadingState === 'LOADED' && unreadActivitiesCount > 0) {
                        title = `${title} (${formatNumber(unreadActivitiesCount, locale)})`;
                    }
                    return (
                        <Tabs.Tab key={tabName} title={title}>
                            <NotificationTabPane tabName={tabName as ValidTabName} />
                        </Tabs.Tab>
                    );
                })}
            </Tabs>
        );
    }
    return (
        <div className={styles['notification-items']}>
            <NotificationItemsHeading />
            {content}
        </div>
    );
});
