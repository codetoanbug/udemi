import udLink from 'utils/ud-link';

export const LEARN_MORE = {
    get LINK() {
        return udLink.toSupportLink('course_retirements', true);
    },
};

export const COURSE_ALTERNATIVE_MESSAGE = {
    get TEXT() {
        return gettext(
            'We’re always updating our content collection to keep it fresh but enrolled learners won’t lose access to this course.',
        );
    },
};

export const BUTTON_ENROLL = {
    get TYPE() {
        return 'enroll';
    },
    get TEXT() {
        return gettext('Enroll');
    },
};

export const BUTTON_ADD_TO_PATH = {
    get TYPE() {
        return 'addToPath';
    },
};

export const RETIREMENT_ALERT_MODAL_TYPES = Object.freeze({
    ASSIGN: 'assign',
    ADD_TO_PATH: 'add_to_path',
    ADD_TO_CUSTOM_CATEGORY: 'add_to_custom_category',
});

export const RETIREMENT_ALERT_MODAL_ACTIONS = Object.freeze({
    CLICKED_ALTERNATIVES_LINK: 'clicked_alternatives_link',
    SUBMITTED_MODAL: 'submitted_modal',
});

export const SHOW_ALTERNATIVES_URL_PARAM = 'show_alternatives';

export const RETIREMENT_CUTOUT_MONTHS = 3;
