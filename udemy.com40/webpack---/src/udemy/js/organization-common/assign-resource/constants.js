export const PAGE = 1;
export const PAGE_SIZE = 20;
export const USER_FIELDS = '@default,is_assigned_to_resource,image_75x75';
export const GROUP_FIELDS = '@default,is_assigned_to_course';

export const VALIDATION_ERROR_CODE = 'validation_error';
export const GENERAL_ERROR_TEXT = gettext('Something went wrong, please try again later');

export const getDefaultAutoAssignMessage = (gettext) => {
    return {
        course: {
            single: gettext('Automatically assign course when users are added to this group.'),
            multi: gettext('Automatically assign course when users are added to these groups.'),
        },
        learning_path: {
            single: gettext('Automatically assign path when users are added to this group.'),
            multi: gettext('Automatically assign path when users are added to these groups.'),
        },
        lab: {
            single: gettext('Automatically assign lab when users are added to this group.'),
            multi: gettext('Automatically assign lab when users are added to these groups.'),
        },
        adaptive_assessment_assessment: {
            single: gettext('Automatically assign assessment when users are added to this group.'),
            multi: gettext('Automatically assign assessment when users are added to these groups.'),
        },
    };
};

export const getDefaultAutoAssignAllUsersMessage = (gettext) => {
    return {
        course: gettext('Automatically assign this course to new users added to your account.'),
        learning_path: gettext(
            'Automatically assign this path to new users added to your account.',
        ),
        lab: gettext('Automatically assign this lab to new users added to your account.'),
        adaptive_assessment_assessment: gettext(
            'Automatically assign this assessment to new users added to your account.',
        ),
    };
};

export const getAssignResourceModalFields = (gettext) => {
    return {
        course: {
            modalTitle: gettext('Assign course'),
            formLabel: gettext('Who do you want to assign this course to?'),
        },
        learning_path: {
            modalTitle: gettext('Assign learning path'),
            formLabel: gettext('Who do you want to assign this learning path to?'),
        },
        lab: {
            modalTitle: gettext('Assign lab'),
            formLabel: gettext('Who do you want to assign this lab to?'),
        },
        adaptive_assessment_assessment: {
            modalTitle: gettext('Assign assessment'),
            formLabel: gettext('Who do you want to assign this assessment to?'),
        },
    };
};

export const getAutoAssignActiveRuleForGroup = (gettext) => {
    return {
        course: gettext('This course is already being auto-assigned to a group in your org.'),
        learning_path: gettext('This path is already being auto-assigned to a group in your org.'),
        lab: gettext('This lab is already being auto-assigned to a group in your org.'),
        adaptive_assessment_assessment: gettext(
            'This assessment is already being auto-assigned to a group in your org.',
        ),
    };
};

export const ASSIGN_COURSE_MODE = 'assign_course';
export const ASSIGN_GROUP_ADMIN_MODE = 'assign_group_admin';

export const getDueDateInfoText = (gettext) => {
    return {
        course: gettext(
            'Let people know if you expect them to complete this course within a particular timeframe.',
        ),
        learning_path: gettext(
            'Let people know if you expect them to complete this path within a particular timeframe.',
        ),
        lab: gettext(
            'Let people know if you expect them to complete this lab within a particular timeframe.',
        ),
        adaptive_assessment_assessment: gettext(
            'Let people know if you expect them to complete this assessment within a particular timeframe.',
        ),
    };
};

export const DATE_TYPE = 'date';
export const DAYS_TYPE = 'days';

export const getDueDateSelectTypes = (gettext) => [
    {type: 'none', text: gettext("Don't set a due date")},
    {type: DATE_TYPE, text: gettext('Choose from a calendar')},
    {type: DAYS_TYPE, text: gettext('Set a number of days')},
];

export const IS_AUTOASSIGN_ENABLED = 'is_autoassign_enabled';

export const ASSIGNMENT_NUDGE_GROUPS = Object.freeze({
    NOT_STARTED: 'not_started',
    NEEDS_NUDGE: 'needs_nudge',
    ON_TRACK: 'on_track',
});

export const EMAIL_ASSIGNEES_MESSAGE_NOT_STARTED = gettext(
    'Hello,\n\n' +
        'Why not take a few minutes today to catch up on your learning assignment? Even a short amount of dedicated time on your calendar is an effective way to make progress towards your learning goals. Complete a lecture today to get started!',
);
export const EMAIL_ASSIGNEES_MESSAGE_NEEDS_NUDGE = gettext(
    'Hello,\n\n' +
        'Why not take a few minutes today to catch up on your learning assignment? Even a short amount of dedicated time on your calendar is an effective way to make progress towards your learning goals. Complete a lecture today to start catching up!',
);
export const EMAIL_ASSIGNEES_MESSAGE_ON_TRACK = gettext(
    'Hello,\n\n' +
        "Congratulations on your progress in the course below! It takes time and effort to develop a new skill. Keep up the great work and don't forget to share your learning with your colleagues. Thank you!",
);

export const EMAIL_ASSIGNEES_MODAL_CONTEXTS = Object.freeze({
    INDIVIDUAL: 'individual',
    GROUP: 'group',
});
