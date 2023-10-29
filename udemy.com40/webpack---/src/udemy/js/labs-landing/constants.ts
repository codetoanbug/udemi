import {LAB_TYPE} from 'labs/constants';

export const LABS_LANDING_BUTTON_C0UNT = 5;

export const LABS_LANDING_RESULTS_COUNT_PER_PAGE = 20;
export const API_LAB_MIN_FIELDS = ['id', 'title'];

export const API_LAB_INFO_FIELDS = [
    'min_estimated_time',
    'max_estimated_time',
    'owner',
    'vertical',
    'spec_name',
    'lab_overview',
    'what_you_will_do',
    'title_autoslug',
    'visible_instructors',
];

export const API_LAB_ALL_FIELDS = [...API_LAB_MIN_FIELDS, ...API_LAB_INFO_FIELDS].join(',');

export const API_VISIBLE_INSTRUCTOR_ALL_FIELDS = ['id', 'title', 'url'].join(',');

export const FETCH_LABS_FEEDBACK = {
    get text() {
        return gettext(
            'There was a problem fetching labs. Please refresh your browser and try again',
        );
    },
};

export const SORT_OPTIONS = {
    newest: {
        value: '-created',
        get title() {
            return gettext('Newest');
        },
    },
    oldest: {
        value: 'created',
        get title() {
            return gettext('Oldest');
        },
    },
    title_asc: {
        value: 'title',
        get title() {
            return gettext('A-Z');
        },
    },
    title_desc: {
        value: '-title',
        get title() {
            return gettext('Z-A');
        },
    },
} as const;

export const SEARCH_PARAMS = {
    ALR_FILTER: 'alr',
    SEARCH: 'search',
    SORT: 'sort',
    VERTICAL: 'vertical',
    PAGE: 'p',
    SHORT_TIME_WORKSPACE_FILTER: 'short_time_workspace',
    EXTENDED_WORKSPACE_FILTER: 'extended_workspace',
    MAX_ESTIMATED_TIME_LTE: 'max_estimated_time_lte',
} as const;

export const MAX_LAB_ESTIMATED_TIME_MINUTES = 180;

export const LABS_STEPS = [
    {
        get title() {
            return gettext('1. Pick a lab');
        },
        get description() {
            return gettext('Browse our growing library of real-world challenges.');
        },
        get expressiveIconName() {
            return 'choosing-hand';
        },
    },
    {
        get title() {
            return gettext('2. Choose the mode');
        },
        get description() {
            return gettext('Choose the mode with the right level of guidance for your needs.');
        },
        get expressiveIconName() {
            return 'challenge-1';
        },
    },
    {
        get title() {
            return gettext('3. Start learning');
        },
        get description() {
            return gettext('Launch the Udemy workspace and start working. No set-up required.');
        },
        get expressiveIconName() {
            return 'play';
        },
    },
];

export const SEARCH_LABS_STEPS = [
    {
        get title() {
            return gettext('1. Pick a lab');
        },
        get description() {
            return gettext('Browse real-world challenges relevant to your search term.');
        },
        get expressiveIconName() {
            return 'choosing-hand';
        },
    },
    {
        get title() {
            return gettext('2. Choose the mode');
        },
        get description() {
            return gettext('Choose the mode with the right level of guidance for your needs.');
        },
        get expressiveIconName() {
            return 'challenge-1';
        },
    },
    {
        get title() {
            return gettext('3. Start learning');
        },
        get description() {
            return gettext('Launch the Udemy workspace and start working. No set-up required.');
        },
        get expressiveIconName() {
            return 'play';
        },
    },
];
export const LABS_API_URL = {
    get modularListing() {
        return `/labs/?lab_type=${LAB_TYPE.modular.key}&status=published`;
    },
    get labByUrl() {
        return '/labs/by-url/';
    },
};

export const LABS_PROMPT_SEARCH_CRITERIA = {
    topics: 'topics',
    instructors: 'instructors',
};

export const POPOVER_ALR_TIP = {
    get title() {
        return gettext('Automated lab reviews');
    },
    get body() {
        return gettext(
            'Automated lab reviews let you check your work for real-time feedback about your performance on the task. ' +
                'Available on the guided challenge mode only. ' +
                '<a class="learn-more">Learn more.</a>',
        );
    },
};

export const ACTIVE_LAB_STATUS = [
    'pending',
    'queued',
    'starting',
    'running',
    'stopping',
    'stopped',
];
