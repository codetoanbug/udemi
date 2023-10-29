import udApi from 'utils/ud-api';

// Currently this module only handles notification-preferences for the current (logged in) user.

class NotificationType {
    typeCode: string;
    titleText: string;
    defaultValue: boolean;

    constructor(typeCode: string, titleText: string, defaultValue: boolean) {
        this.typeCode = typeCode;
        this.titleText = titleText;
        this.defaultValue = defaultValue;
    }

    valueMap(value: boolean): string | null {
        if (value) {
            return 'on';
        }
        return null;
    }

    get title() {
        return this.titleText;
    }
}

const NOTIFICATION_TYPES = Object.freeze({
    sendAssetReady: Object.freeze(
        new NotificationType('send-asset-ready', gettext('Lecture ready emails'), false),
    ),
    dailyDiscussionsDigest: Object.freeze(
        new NotificationType('daily-discussions-digest', gettext('Daily Q&A digest'), false),
    ),
    newCourseAnnouncement: Object.freeze(
        new NotificationType('new-course-announcement', gettext('New announcement emails'), false),
    ),
    newCoursePromotion: Object.freeze(
        new NotificationType('new-course-promotion', gettext('Promotional emails'), false),
    ),
    disableAllEmails: Object.freeze(new NotificationType('disableAllEmails', '', false)),
});

const NOTIFICATION_TYPES_BY_CODE = Object.freeze(
    Object.values(NOTIFICATION_TYPES).reduce(
        (acc: {[key: string]: NotificationType}, notificationType) => {
            acc[notificationType.typeCode] = notificationType;
            return acc;
        },
        {},
    ),
);

class NotificationPreferences {
    set(notificationType: NotificationType, value: boolean, courseId = null) {
        let endPoint = '/users/me/notification-preferences/';
        if (courseId) {
            endPoint = `/users/me/course/${courseId}/notification-preferences/`;
        }
        const convertedValue = notificationType.valueMap(value);
        return udApi.post(endPoint, {
            setting: notificationType.typeCode,
            value: convertedValue,
        });
    }
}

const notificationPreferences = new NotificationPreferences();

export {
    notificationPreferences,
    NotificationPreferences,
    NotificationType,
    NOTIFICATION_TYPES,
    NOTIFICATION_TYPES_BY_CODE,
};
