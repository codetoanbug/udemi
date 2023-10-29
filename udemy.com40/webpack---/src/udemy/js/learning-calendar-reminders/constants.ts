export const REMINDER_NAME_STEP = 'reminderName';
export const REMINDER_DETAILS_STEP = 'reminderDetails';
export const REMINDER_DOWNLOAD_STEP = 'download';

export const DJANGO_CONTENT_TYPE_COURSE = 'course';
export const DJANGO_CONTENT_TYPE_LAB = 'lab';
export const COURSE_OPTION_PAGE_SIZE = 3;
export const FREQUENCY = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get ONCE() {
        return gettext('Once');
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get DAILY() {
        return gettext('Daily');
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get WEEKLY() {
        return gettext('Weekly');
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get MONTHLY() {
        return gettext('Monthly');
    },
};
export const DAYS = [
    pgettext('Abbreviation for Sunday, two letters max', 'Su'),
    pgettext('Abbreviation for Monday, two letters max', 'Mo'),
    pgettext('Abbreviation for Tuesday, two letters max', 'Tu'),
    pgettext('Abbreviation for Wednesday, two letters max', 'We'),
    pgettext('Abbreviation for Thursday, two letters max', 'Th'),
    pgettext('Abbreviation for Friday, two letters max', 'Fr'),
    pgettext('Abbreviation for Saturday, two letters max', 'Sa'),
];

export const FULL_DAY_NAME = [
    () => {
        return gettext('Sunday');
    },
    () => {
        return gettext('Monday');
    },
    () => {
        return gettext('Tuesday');
    },
    () => {
        return gettext('Wednesday');
    },
    () => {
        return gettext('Thursday');
    },
    () => {
        return gettext('Friday');
    },
    () => {
        return gettext('Saturday');
    },
];

export const BY_DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
export const BY_DAY_NAMES: Record<string, string> = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get SU() {
        return gettext('Sunday');
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get MO() {
        return gettext('Monday');
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get TU() {
        return gettext('Tuesday');
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get WE() {
        return gettext('Wednesday');
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get TH() {
        return gettext('Thursday');
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get FR() {
        return gettext('Friday');
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get SA() {
        return gettext('Saturday');
    },
};
export const MONTH_OPTION = {
    monthDay: 'monthDay',
    weekNum: 'weekNum',
};
export const custom = () => {
    return gettext('Custom');
};
export const DURATION = [
    () => {
        return gettext('5 min');
    },
    () => {
        return gettext('10 min');
    },
    () => {
        return gettext('20 min');
    },
    () => {
        return gettext('30 min');
    },
    () => {
        return gettext('1 hr');
    },
    custom,
];
export const durationValues = () => {
    return [5, 10, 20, 30, 60, custom()];
};
export const DURATION_UNIT = {
    get minutes() {
        return gettext('minute(s)');
    },
    get hours() {
        return gettext('hour(s)');
    },
};
export const MINUTES = 'minutes';
export const HOURS = 'hours';
export const never = () => {
    return gettext('Never');
};
export const until = () => {
    return gettext('Until');
};
export const ERROR = 'error';
export const NEUTRAL = 'neutral';
export const missingRequiredText = () => {
    return gettext('This field is required.');
};
export const SEARCH_COURSE_MAX_SUGGESTIONS_COUNT = 10;

export const enum LearningReminderFrequency {
    ONCE = 'once',
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
}

export const enum LearningReminderCalendarType {
    GOOGLE = 'google',
    APPLE = 'apple',
    OUTLOOK = 'outlook',
    OTHER = 'other',
}

export const enum LearningReminderNotificationType {
    PUSH = 'push',
    CALENDAR = 'calendar',
}

export const enum LearningReminderDayName {
    SUNDAY = 'sunday',
    MONDAY = 'monday',
    TUESDAY = 'tuesday',
    WEDNESDAY = 'wednesday',
    THURSDAY = 'thursday',
    FRIDAY = 'friday',
    SATURDAY = 'saturday',
}
