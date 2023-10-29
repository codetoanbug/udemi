// This file is separated from ./constants so that instructor-header.react-isocomponent satisfies
// "isocomponents cannot call gettext at module level".
export const DATE_RANGE = {
    WEEK: 'week',
    MONTH: 'month',
    YEAR: 'year',
    ALL_TIME: 'all',
};

export const DATE_RANGE_VALUES = Object.values(DATE_RANGE);

export const UB_DATE_LABELS_12_PLUS_MONTHS = {
    get month() {
        return gettext('Last 30 days');
    },
    get year() {
        return gettext('Last 12 months');
    },
    get all() {
        return gettext('Last 12+ months');
    },
};

export const DATE_LABELS = {
    get week() {
        return gettext('Last 7 days');
    },
    get month() {
        return gettext('Last 30 days');
    },
    get year() {
        return gettext('Last 12 months');
    },
    get all() {
        return gettext('All time');
    },
};

export const DATE_LABELS_COURSE_ENGAGEMENT = {
    get week() {
        return gettext('Last 7 days');
    },
    get month() {
        return gettext('Last 30 days');
    },
    get year() {
        return gettext('Last 12 months');
    },
    get all() {
        return gettext('Last 12+ months');
    },
};

export const UB_DATE_LABELS = {
    get month() {
        return gettext('Last 30 days');
    },
    get year() {
        return gettext('Last 12 months');
    },
    get all() {
        return gettext('All time');
    },
};

export const DATE_TYPE = {
    MONTH: 'month',
    DAY: 'day',
};

export const DEFAULT_DATE_FILTER = DATE_RANGE.YEAR;
