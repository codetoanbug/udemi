import {observer} from 'mobx-react';
import React from 'react';

import {trackEvent} from '@udemy/gtag';
import {useI18n} from '@udemy/i18n';
import {Avatar, Button} from '@udemy/react-core-components';
import {RelativeDuration} from '@udemy/react-date-time-components';
import {NotificationBadge} from '@udemy/react-messaging-components';
import {Tooltip} from '@udemy/react-popup-components';
import {ItemCard} from '@udemy/react-structure-components';
import {safelySetInnerHTML} from '@udemy/shared-utils';

import {ActivityNotificationModel} from './activity-notification.mobx-model';
import styles from './activity-notification.module.less';
import {ActivityNotificationsStore, ValidTabName} from './activity-notifications.mobx-store';

export interface ActivityNotificationProps {
    store: ActivityNotificationsStore;
    className?: string;
    notification: ActivityNotificationModel;
    tabName: ValidTabName;
}

export const ActivityNotification = observer((props: ActivityNotificationProps) => {
    const {gettext} = useI18n();

    const {notification} = props;
    const className = props.className || '';

    const onClick = () => {
        const {store, notification, tabName} = props;
        trackEvent('notification', 'click', notification.clickTrackingAction);
        if (!notification.isRead) {
            store.markNotificationAsRead(notification, tabName);
        }
    };

    const onClickStatus = () => {
        const {store, notification, tabName} = props;
        if (!notification.isRead) {
            store.markNotificationAsRead(notification, tabName);
        }
    };

    const renderStatusDot = () => {
        const {notification} = props;
        if (notification.isRead) {
            return null;
        }

        return (
            <div className={styles['status-dot-container']}>
                <Tooltip
                    a11yRole="none"
                    detachFromTarget={true}
                    placement="bottom"
                    trigger={
                        <Button
                            udStyle="link"
                            className={styles['status-dot-button']}
                            data-purpose="mark-as-read-status-icon"
                            onClick={onClickStatus}
                            aria-label={gettext('Mark as read')}
                        >
                            <NotificationBadge />
                        </Button>
                    }
                >
                    {gettext('Mark as read')}
                </Tooltip>
            </div>
        );
    };

    return (
        <div data-purpose="notification" className={styles['card-container']}>
            <ItemCard className={`${styles['card']} ${className}`}>
                <ItemCard.ImageWrapper>
                    <Avatar
                        user={notification.mainActivity.actor}
                        srcKey="image_100x100"
                        alt="NONE"
                    />
                </ItemCard.ImageWrapper>
                <div className={styles['notification-info']}>
                    <ItemCard.Title
                        className={`ud-heading-md ${styles['notification-title']}`}
                        data-purpose="notification-message"
                        href={notification.targetURL}
                        onClick={onClick}
                    >
                        <span
                            {...safelySetInnerHTML({
                                descriptionOfCaller: 'activity-notification:notification-template',
                                html: notification.template as string,
                            })}
                        />
                    </ItemCard.Title>
                    <div className={`ud-text-sm ${styles['notification-timestamp']}`}>
                        <RelativeDuration datetime={notification.mainActivity.timestamp} />
                    </div>
                </div>
            </ItemCard>
            {renderStatusDot()}
        </div>
    );
});
