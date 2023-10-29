import {ORGANIZATION_HAS_USER_STATUS} from 'organization-manage-users/constants';

export const DEACTIVATION_WARNING_MESSAGE = {
    course: (groupTitle) =>
        interpolate(
            gettext(
                'Users will no longer be automatically assigned this course when they join "%(groupTitle)s".',
            ),
            {groupTitle},
            true,
        ),
    learning_path: (groupTitle) =>
        interpolate(
            gettext(
                'Users will no longer be automatically assigned this path when they join "%(groupTitle)s".',
            ),
            {groupTitle},
            true,
        ),
    lab: (groupTitle) =>
        interpolate(
            gettext(
                'Users will no longer be automatically assigned this lab when they join "%(groupTitle)s".',
            ),
            {groupTitle},
            true,
        ),
    adaptive_assessment_assessment: (groupTitle) =>
        interpolate(
            gettext(
                'Users will no longer be automatically assigned this assessment when they join "%(groupTitle)s".',
            ),
            {groupTitle},
            true,
        ),
};

export const DEACTIVATION_BODY_MESSAGE = {
    course: {
        firstParagraph: gettext(
            'Users who have already been assigned this course will not be unassigned.',
        ),
        secondParagraph: gettext(
            'You can create another auto-assign rule for the same course and group when this rule is deactivated.',
        ),
    },
    learning_path: {
        firstParagraph: gettext(
            'Users who have already been assigned this path will not be unassigned.',
        ),
        secondParagraph: gettext(
            'You can create another auto-assign rule for the same path and group when this rule is deactivated.',
        ),
    },
    lab: {
        firstParagraph: gettext(
            'Users who have already been assigned this lab will not be unassigned.',
        ),
        secondParagraph: gettext(
            'You can create another auto-assign rule for the same lab and group when this rule is deactivated.',
        ),
    },
    adaptive_assessment_assessment: {
        firstParagraph: gettext(
            'Users who have already been assigned this assessment will not be unassigned.',
        ),
        secondParagraph: gettext(
            'You can create another auto-assign rule for the same assessment and group ' +
                'when this rule is deactivated.',
        ),
    },
};

export const DELETION_WARNING_MESSAGE = {
    get TEXT() {
        return gettext(
            'This rule will be permanently deleted from your account. This action cannot be undone.',
        );
    },
};

export const DEFAULT_UNASSIGN_MESSAGE_INACTIVE_USER = {
    [ORGANIZATION_HAS_USER_STATUS.deactivated]: gettext(
        '%(userName)s is deactivated and won’t be notified.',
    ),
    [ORGANIZATION_HAS_USER_STATUS.pending]: '',
    [ORGANIZATION_HAS_USER_STATUS.anonymized]: gettext(
        'This user is anonymized and won’t be notified.',
    ),
};

export const DEFAULT_KEEP_PROGRESS_MESSAGE = gettext(
    '%(userName)s will be notified by email but will be able to keep their progress.',
);

export const DEFAULT_UNASSIGN_MESSAGE = {
    course: {
        canUnenroll: gettext(
            '%(userName)s will be notified by email and automatically unenrolled from the course.',
        ),
        cannotUnenroll: DEFAULT_KEEP_PROGRESS_MESSAGE,
    },
    learning_path: {
        canUnenroll: gettext(
            '%(userName)s will be notified by email and automatically unenrolled from the path.',
        ),
        cannotUnenroll: DEFAULT_KEEP_PROGRESS_MESSAGE,
    },
    lab: {
        canUnenroll: gettext(
            '%(userName)s will be notified by email and automatically unenrolled from the lab.',
        ),
        cannotUnenroll: DEFAULT_KEEP_PROGRESS_MESSAGE,
    },
    adaptive_assessment_assessment: {
        canUnenroll: gettext(
            '%(userName)s will be notified by email and automatically unenrolled from the assessment.',
        ),
        cannotUnenroll: DEFAULT_KEEP_PROGRESS_MESSAGE,
    },
};

export const UNASSIGN_CONFIRM_BUTTON_TEXT = {
    course: gettext('Unassign course'),
    learning_path: gettext('Unassign path'),
    lab: gettext('Unassign lab'),
    adaptive_assessment_assessment: gettext('Unassign assessment'),
};

export const UNASSIGN_SUCCESS_MESSAGE = {
    course: gettext('You have successfully unassigned the course'),
    learning_path: gettext('You have successfully unassigned the path'),
    lab: gettext('You have successfully unassigned the lab'),
    adaptive_assessment_assessment: gettext('You have successfully unassigned the assessment'),
};

export const DEFAULT_ERROR_MESSAGE = {
    get TEXT() {
        return gettext('Something went wrong, please try again');
    },
};

// for now there is just one collection of assessments
export const ASSESSMENT_COLLECTION_BASE_PATH = '/skills-assessment/';
