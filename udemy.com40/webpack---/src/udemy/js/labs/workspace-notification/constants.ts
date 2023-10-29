export const PERMISSION_STATUS = {
    GRANTED: 'granted',
    DENIED: 'denied',
    DEFAULT: 'default',
};

export const NOTIFICATION_STORAGE_KEY = 'has-enabled-local-permission';

export const LOCAL_STORAGE = {
    NAMESPACE: 'workspace-notification-control',
    NAME: 'local-permission',
};

export const NOTIFICATION_ACTIONS = {
    ENABLE_NOTIFICATION: 'enable_notification',
    DISABLE_NOTIFICATION: 'disable_notification',
    GRANT_PERMISSION: 'grant_permission',
    BLOCK_PERMISSION: 'block_permission',
} as const;

export const NOTIFICATION_EVENT_LABEL = {
    [NOTIFICATION_ACTIONS.ENABLE_NOTIFICATION]: 'LabLoadingEnableNotificationClickEvent',
    [NOTIFICATION_ACTIONS.DISABLE_NOTIFICATION]: 'LabLoadingDisableNotificationClickEvent',
    [NOTIFICATION_ACTIONS.GRANT_PERMISSION]: 'LabLoadingNotificationPermissionGrantEvent',
    [NOTIFICATION_ACTIONS.BLOCK_PERMISSION]: 'LabLoadingNotificationPermissionBlockEvent',
} as const;
