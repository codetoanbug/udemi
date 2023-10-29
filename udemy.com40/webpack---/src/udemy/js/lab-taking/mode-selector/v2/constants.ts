import {LAB_MODE} from 'labs/constants';

export const LAB_COMPLETION_MODES = {
    [LAB_MODE.FOLLOW_ALONG]: {
        get label() {
            return gettext('Follow along');
        },
        get description() {
            return gettext('Follow comprehensive tutorial-style steps organized by task.');
        },
    },
    [LAB_MODE.STRUCTURED]: {
        get label() {
            return gettext('Guided challenge');
        },
        get description() {
            return gettext(
                'Complete tasks with supportive resources and check your work as you go.',
            );
        },
    },
    [LAB_MODE.OPEN]: {
        get label() {
            return gettext('Open challenge');
        },
        get description() {
            return gettext(
                'Execute the project assignment on your own by referencing a resource library.',
            );
        },
    },
};

export const LAB_DEFAULT_COMPLETION_MODE = LAB_MODE.STRUCTURED;
