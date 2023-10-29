import {observer} from 'mobx-react';
import React from 'react';

import {ValidTabName, ActivityNotificationModel} from '@udemy/activity-notifications';
import {useI18n} from '@udemy/i18n';
import {Avatar} from '@udemy/react-core-components';
import {RelativeDuration} from '@udemy/react-date-time-components';
import {NotificationBadge} from '@udemy/react-messaging-components';
import {ItemCard} from '@udemy/react-structure-components';
import {safelySetInnerHTML} from '@udemy/shared-utils';

import {useActivityNotificationsStore} from '../../hooks/use-activity-notifications-store';
import styles from './notification-item.module.less';

export interface NotificationItemProps {
    className?: string;
    notification: ActivityNotificationModel;
    tabName: ValidTabName;
}

export const NotificationItem = observer(
    ({className = '', notification, tabName, ...anchorProps}: NotificationItemProps) => {
        const activityNotificationsStore = useActivityNotificationsStore();
        const {gettext} = useI18n();

        function onClick() {
            if (!notification.isRead) {
                activityNotificationsStore?.markNotificationAsRead(notification, tabName);
            }
        }
        return (
            <ItemCard className={className} data-testid="notification-item">
                <ItemCard.ImageWrapper>
                    <Avatar
                        user={notification.mainActivity.actor}
                        srcKey="image_100x100"
                        alt="NONE"
                    />
                </ItemCard.ImageWrapper>
                <div className={styles['notification-info']}>
                    <ItemCard.Title
                        className={`ud-heading-sm ${styles['notification-title']}`}
                        {...anchorProps}
                        href={notification.targetURL}
                        onClick={onClick}
                    >
                        <span
                            {...safelySetInnerHTML({
                                descriptionOfCaller: 'notification-item:notification-template',
                                html: notification.template as string,
                            })}
                        />
                    </ItemCard.Title>
                    <div className={`ud-text-sm ${styles['notification-timestamp']}`}>
                        <RelativeDuration datetime={notification.mainActivity.timestamp} />
                    </div>
                    {!notification.isRead && (
                        <NotificationBadge
                            label={gettext('This notification is not read')}
                            className={styles['unread-dot']}
                            data-testid="notification-badge"
                        />
                    )}
                </div>
            </ItemCard>
        );
    },
);
