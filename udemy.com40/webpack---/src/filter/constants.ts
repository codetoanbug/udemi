import {FilterAggregation} from '../types';

export const LANGUAGE_FILTER_DATA = (gettext: (text: string) => string): FilterAggregation => {
    return {
        title: 'Course language',
        options: [
            {key: 'sa', value: gettext('Arabic')}, //Saudi Arabia
            {key: 'cn', value: gettext('Chinese')}, //China
            {key: 'use', value: gettext('English')}, //United States
            {key: 'fr', value: gettext('French')}, //France
            {key: 'de', value: gettext('German')}, //Germany
            {key: 'hin', value: gettext('Hindi')}, //India
            {key: 'id', value: gettext('Indonesian')}, //Indonesia
            {key: 'it', value: gettext('Italian')}, //Italy
            {key: 'jp', value: gettext('Japanese')}, //Japan
            {key: 'kr', value: gettext('Korean')}, //South Korea
            {key: 'pl', value: gettext('Polish')}, //Poland
            {key: 'pt', value: gettext('Portuguese')}, //Portugal
            {key: 'ru', value: gettext('Russian')}, //Russia
            {key: 'ess', value: gettext('Spanish')}, //Spain
            {key: 'tr', value: gettext('Turkish')}, //Turkey
        ],
    };
};

export const DOMAIN_FILTER_DATA = (gettext: (text: string) => string): FilterAggregation => {
    return {
        title: 'Domain',
        options: [
            {key: 'bu', value: gettext('Business Operations')},
            {key: 'cc', value: gettext('Cloud Computing')},
            {key: 'ceu', value: gettext('Continuing Education Units')},
            {key: 'cs', value: gettext('Cybersecurity')},
            {key: 'ds', value: gettext('Data Science')},
            {key: 'de', value: gettext('Design')},
            {key: 'dev', value: gettext('Development')},
            {key: 'fa', value: gettext('Finance & Accounting')},
            {key: 'it', value: gettext('IT Operations')},
            {key: 'll', value: gettext('Language Learning')},
            {key: 'lm', value: gettext('Leadership & Management')},
            {key: 'ma', value: gettext('Marketing')},
            {key: 'op', value: gettext('Office Productivity')},
            {key: 'pd', value: gettext('Personal Development')},
            {key: 'pp', value: gettext('Project & Product Management')},
            {key: 'sa', value: gettext('Sales')},
            {key: 'whr', value: gettext('Workplace & Human Resources')},
        ],
    };
};

export const NON_LOCALIZED_DOMAIN_FILTER_DATA: {key: string; value: string}[] = [
    {key: 'bu', value: 'Business Operations'},
    {key: 'cc', value: 'Cloud Computing'},
    {key: 'ceu', value: 'Continuing Education Units'},
    {key: 'cs', value: 'Cybersecurity'},
    {key: 'ds', value: 'Data Science'},
    {key: 'de', value: 'Design'},
    {key: 'dev', value: 'Development'},
    {key: 'fa', value: 'Finance & Accounting'},
    {key: 'it', value: 'IT Operations'},
    {key: 'll', value: 'Language Learning'},
    {key: 'lm', value: 'Leadership & Management'},
    {key: 'ma', value: 'Marketing'},
    {key: 'op', value: 'Office Productivity'},
    {key: 'pd', value: 'Personal Development'},
    {key: 'pp', value: 'Project & Product Management'},
    {key: 'sa', value: 'Sales'},
    {key: 'whr', value: 'Workplace & Human Resources'},
];

export const NON_LOCALIZED_LANGUAGE_FILTER_DATA: {key: string; value: string}[] = [
    {key: 'sa', value: 'Arabic'}, //Saudi Arabia
    {key: 'cn', value: 'Chinese'}, //China
    {key: 'use', value: 'English'}, //United States
    {key: 'fr', value: 'French'}, //France
    {key: 'de', value: 'German'}, //Germany
    {key: 'hin', value: 'Hindi'}, //India
    {key: 'id', value: 'Indonesian'}, //Indonesia
    {key: 'it', value: 'Italian'}, //Italy
    {key: 'jp', value: 'Japanese'}, //Japan
    {key: 'kr', value: 'Korean'}, //South Korea
    {key: 'pl', value: 'Polish'}, //Poland
    {key: 'pt', value: 'Portuguese'}, //Portugal
    {key: 'ru', value: 'Russian'}, //Russia
    {key: 'ess', value: 'Spanish'}, //Spain
    {key: 'tr', value: 'Turkish'}, //Turkey
];
