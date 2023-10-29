import classNames from 'classnames';

import {getVariantValue} from '@udemy/shared-utils';

const THEME_BLACK = 'black';
const THEME_INDIGO = 'teal';
const THEME_YELLOW_PURPLE = 'yellow_purple';
const THEME_BRAND_BUTTON_UD_STYLE = 'brand';
const THEME_DEFAULT_BUTTON_UD_STYLE = 'primary';
const THEME_WHITE_SOLID_BUTTON_UD_STYLE = 'white-solid';

/*
 * Customizations for specific "bar" notice types.
 *
 * Note: The order of these type configurations is important!
 * The feature flags are checked in this order, and the first "allowed" bar type
 * is the only type fetched from the backend.
 *
 *
 * Properties:
 *
 * - name
 *     used when fetching the notice type from the backend
 *
 * - noticeFeatureFlag
 *     used to check whether this bar type is enabled. The first enabled bar is fetched.
 *
 * - classes
 *     Classes added to base smart bar to customize global look;
 *    for example, background colors.
 *
 * - defaultDaysToHide
 *     If not otherwise specified in notice data, this is the number of days
 *     to hide the bar once the "close" button is clicked
 */

export interface NoticeType {
    name: string;
    noticeFeatureFlag: string;
    classes: (data: {get: (dataProp: string) => string}) => string;
    defaultDaysToHide: number;
    showOptIn: boolean;
}

export const noticeTypes: NoticeType[] = [
    {
        name: 'instructor_bar',
        noticeFeatureFlag: 'instructor_bar',
        classes: (data: {get: (dataProp: string) => string}) =>
            classNames('smart-bar', data.get('theme') && `smart-bar--${data.get('theme')}`),
        defaultDaysToHide: 14,
        showOptIn: false,
    },
    {
        name: 'smart_bar',
        noticeFeatureFlag: 'smart_bar',
        classes: (data: {get: (dataProp: string) => string}) => {
            const theme = getVariantValue('sw', 'smartBarTheme', data.get('theme'));
            return classNames('smart-bar', theme && `smart-bar--${theme}`);
        },
        defaultDaysToHide: 14,
        showOptIn: true,
    },
    {
        name: 'ufb_smart_bar',
        noticeFeatureFlag: 'ufb_smart_bar',
        classes: (data: {get: (dataProp: string) => string}) => {
            const theme = getVariantValue('sw', 'smartBarTheme', data.get('theme'));
            return classNames('smart-bar', theme && `smart-bar--${theme}`);
        },
        defaultDaysToHide: 14,
        showOptIn: false,
    },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ctaButtonUdStyle = (data: {get: (arg0: string) => any}) => {
    const theme = getVariantValue('sw', 'smartBarTheme', data.get('theme'));
    if (theme === THEME_BLACK || theme === THEME_YELLOW_PURPLE) {
        return THEME_BRAND_BUTTON_UD_STYLE;
    } else if (theme === THEME_INDIGO) {
        return THEME_WHITE_SOLID_BUTTON_UD_STYLE;
    }

    return THEME_DEFAULT_BUTTON_UD_STYLE;
};
