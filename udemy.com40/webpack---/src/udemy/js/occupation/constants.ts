import {
    OCCUPATION_ASPIRING_ASSIGNMENT_TYPE,
    OCCUPATION_ADVANCING_ASSIGNMENT_TYPE,
    OCCUPATION_ASPIRING_MANAGER_ASSIGNMENT_TYPE,
    OCCUPATION_ADVANCING_MANAGER_ASSIGNMENT_TYPE,
} from 'structured-data/occupation/actions';

export const OCCUPATION_SELECTOR_COMPONENT = 'OccupationSelector';
export const FOCUS_SELECTOR_COMPONENT = 'FocusSelector';
export const THANK_YOU_MESSAGE_COMPONENT = 'ThankYouMessage';
export const CANNOT_FIND_OCCUPATION_COMPONENT = 'CannotFindOccupation';
export const OCCUPATION_RESULT_PAGE = 'OccupationResult';

export const PROGRESSION_STEPS = [
    FOCUS_SELECTOR_COMPONENT,
    OCCUPATION_SELECTOR_COMPONENT,
    THANK_YOU_MESSAGE_COMPONENT,
];

export const PROGRESSION_CANNOT_FIND_OCCUPATION = [
    FOCUS_SELECTOR_COMPONENT,
    CANNOT_FIND_OCCUPATION_COMPONENT,
    THANK_YOU_MESSAGE_COMPONENT,
];

export const PROGRESSION_SKIP = -1;
export const PROGRESSION_DONE = 999;

export const OCCUPATION_GROUP_SUGGESTION_URL =
    '/structured-data/generic-tag/occupation/grouped-occupations/?num_occupation_groups=100&num_occupations=1&occupation_groups_ordering=popularity_order';
export const OCCUPATION_SUGGESTION_URL = '/structured-data/generic-tag/occupation/';
export const OCCUPATION_EXPLORER_URL = '/occupation/explorer/';
export const OCCUPATION_RESULT_URL = '/occupation/result/';

export const LEARNER_GOAL_QUESTIONS = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get CURRENT_GOAL() {
        return gettext('What is your current career goal?');
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get CURRENT_PROFESSION() {
        return gettext('What is your current profession?');
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get LEARNING_FOR_PROFESSION() {
        return gettext('What profession are you learning for?');
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get MANAGING_FIELD() {
        return gettext('What field are you in?');
    },
};

export const CAREER_GOAL_TO_TEXT_MAP: Record<string, string> = {
    get [OCCUPATION_ASPIRING_ASSIGNMENT_TYPE]() {
        return gettext('Enter a new field');
    },
    get [OCCUPATION_ADVANCING_ASSIGNMENT_TYPE]() {
        return gettext('Advance in my field');
    },
    get [OCCUPATION_ASPIRING_MANAGER_ASSIGNMENT_TYPE]() {
        return gettext('Become a manager in my field');
    },
    get [OCCUPATION_ADVANCING_MANAGER_ASSIGNMENT_TYPE]() {
        return gettext('Advance as a manager');
    },
};

export const FOCUSES = [
    {
        get label() {
            return CAREER_GOAL_TO_TEXT_MAP[OCCUPATION_ASPIRING_ASSIGNMENT_TYPE];
        },
        slug: 'occupation-Aspiring',
    },
    {
        get label() {
            return CAREER_GOAL_TO_TEXT_MAP[OCCUPATION_ADVANCING_ASSIGNMENT_TYPE];
        },
        slug: 'occupation-Advancing',
    },
    {
        get label() {
            return CAREER_GOAL_TO_TEXT_MAP[OCCUPATION_ASPIRING_MANAGER_ASSIGNMENT_TYPE];
        },
        slug: 'management-Aspiring',
    },
    {
        get label() {
            return CAREER_GOAL_TO_TEXT_MAP[OCCUPATION_ADVANCING_MANAGER_ASSIGNMENT_TYPE];
        },
        slug: 'management-Advancing',
    },
];

export const SELECTION_TYPES = {
    JOB: 'job',
    FOCUS: 'focus',
};

export const OCCUPATION_GROUPS_ENDPOINT =
    '/structured-data/generic-tag/schema/occupation_group/instances/';
export const CREATE_OCCUPATION_ENDPOINT = '/structured-data/generic-tag/occupation/occupation/';

export const CANNOT_FIND_PROFESSION_SELECTOR_ID = 0;

export const NONE_OF_THE_ABOVE_OCCUPATION_GROUP_ID = 0;

// This used for selected focus animation.
// wait 400ms -> opacity 1->.5 to unselected items
// then wait 400ms -> transform selected item to top and 0 opacity for unselected items
export const WAIT_FOR_CSS_TRANSITIONS = 800;

export const DEFAULT_CONCEPT_GROUP_TITLE = 'default';

export const CAREER_TRACK_LANDING_PAGE = 'ctlp';

// This used for the Career Guide landing page (AKA Career Track) focus management
export const SUBJECT_CONTAINER_DATA_PURPOSE = 'subject-container';

export const WEB_DEVELOPER_UNIT_TITLE = 'Web Developers';
export const DATA_SCIENTIST_UNIT_TITLE = 'Data Scientists';

export const OCCUPATION_GROUPS = {
    'software-development': 253,
    'data-analytics': 231,
    'information-technology': 243,
};
// It should be the same as the value in the "occupationGroupName": "None of the Above", in logged_in_home_views.py
export const NONE_OF_THE_ABOVE = 'None of the Above';
