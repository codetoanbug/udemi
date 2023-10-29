import {
    COURSE_LEVEL_FILTER_DATA,
    DOMAIN_FILTER_DATA,
    FINANCIAL_INCENTIVE_FILTER_DATA,
    LANGUAGE_FILTER_DATA,
    OPPORTUNITY_TYPE_FILTER_DATA,
    TOOLTIP_MESSAGE_DATA,
} from './filter-strings';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const noop = () => {
    const item1 = LANGUAGE_FILTER_DATA.options[0];
    const item2 = DOMAIN_FILTER_DATA.options[0];
    const item3 = OPPORTUNITY_TYPE_FILTER_DATA.options[0];
    const item4 = FINANCIAL_INCENTIVE_FILTER_DATA.options[0];
    const item5 = COURSE_LEVEL_FILTER_DATA.options[0];
    const item6 = TOOLTIP_MESSAGE_DATA.options[0];
    return {...item1, ...item2, ...item3, ...item4, ...item5, ...item6};
};
