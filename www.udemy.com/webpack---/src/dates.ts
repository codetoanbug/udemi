import {I18nApi} from '@udemy/i18n';

export const DATE_RANGE = {
    WEEK: 'week',
    MONTH: 'month',
    YEAR: 'year',
    ALL_TIME: 'all',
};

export const DATE_RANGE_VALUES = Object.values(DATE_RANGE);

export const DATE_TYPE = {
    MONTH: 'month',
    DAY: 'day',
};

export const DEFAULT_DATE_FILTER = DATE_RANGE.YEAR;

export class DateLabels {
    constructor(private readonly gettext: I18nApi['gettext']) {}

    get dateLabels() {
        return {
            week: this.gettext('Last 7 days'),
            month: this.gettext('Last 30 days'),
            year: this.gettext('Last 12 months'),
            all: this.gettext('All time'),
        };
    }

    get dateLabelsCourseEngagement() {
        return {
            week: this.gettext('Last 7 days'),
            month: this.gettext('Last 30 days'),
            year: this.gettext('Last 12 months'),
            all: this.gettext('Last 12+ months'),
        };
    }

    get ubDateLabels() {
        return {
            month: this.gettext('Last 30 days'),
            year: this.gettext('Last 12 months'),
            all: this.gettext('All time'),
        };
    }

    get ubDateLabels12PlusMonths() {
        return {
            month: this.gettext('Last 30 days'),
            year: this.gettext('Last 12 months'),
            all: this.gettext('Last 12+ months'),
        };
    }
}
