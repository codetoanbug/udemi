import {observer} from 'mobx-react';
import React, {useEffect} from 'react';

import {formatNumber, useI18n} from '@udemy/i18n';
import {MainContentLoader} from '@udemy/react-reveal-components';
import {Tabs} from '@udemy/react-structure-components';

import {
    ActivityNotificationsStore,
    TabState,
    ValidTabName,
} from './activity-notifications.mobx-store';
import styles from './activity-notifications.module.less';
import {getGlobalActivityNotificationsStore} from './global-activity-notifications';
import {NotificationTabPane} from './notification-tab-pane.react-component';

export interface ActivityNotificationsContentProps {
    store: ActivityNotificationsStore;
}

export const ActivityNotificationsContent = observer(
    ({store}: ActivityNotificationsContentProps) => {
        const {gettext, locale} = useI18n();

        useEffect(() => {
            async function initialize() {
                await store.initializeNotifications();
            }
            initialize();
        }, [store]);

        const onSelectTab = (tabName: ValidTabName) => {
            store.setActiveTab(tabName);
        };

        const renderTab = (tabName: ValidTabName) => {
            const instructorText = gettext('Instructor');
            const studentText = gettext('Student');
            let title = tabName === 'instructor' ? instructorText : studentText;
            const {unreadActivitiesCount} = store[tabName] as TabState;
            if (unreadActivitiesCount > 0) {
                title = `${title} (${formatNumber(unreadActivitiesCount, locale)})`;
            }
            return (
                <Tabs.Tab id={tabName} title={title}>
                    <NotificationTabPane store={store} tabName={tabName} />
                </Tabs.Tab>
            );
        };

        const {activeTabName, instructor, student} = store;
        if (!activeTabName && (instructor || student)) {
            return <MainContentLoader />;
        }

        let content;
        if (!instructor && !student) {
            content = <NotificationTabPane store={store} tabName={activeTabName as ValidTabName} />;
        } else if (!instructor || !student) {
            content = <NotificationTabPane store={store} tabName={activeTabName as ValidTabName} />;
        } else {
            content = (
                <Tabs
                    activeTabId={activeTabName}
                    onSelect={(tabId: unknown) => {
                        onSelectTab(tabId as ValidTabName);
                    }}
                >
                    {renderTab('instructor')}
                    {renderTab('student')}
                </Tabs>
            );
        }
        return (
            <div className={styles['container']} data-testid="activity-notifications-container">
                {content}
            </div>
        );
    },
);

export const ActivityNotifications = observer(() => {
    const store = getGlobalActivityNotificationsStore();
    if (!store || !store.user) {
        return <MainContentLoader />;
    }
    return <ActivityNotificationsContent store={store} />;
});
