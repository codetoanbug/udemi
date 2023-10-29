import {I18nApi} from '@udemy/i18n';

export const COURSE_PAGE_SIZE = 4;
export const COURSE_COUNT_WITH_SUBSCRIPTION = 2;
export const PROGRAM_PAGE_SIZE = 2;

export const MY_LEARNING_CTA = (gettext: I18nApi['gettext']) => ({
    TEXT: gettext('Go to My learning'),
});
