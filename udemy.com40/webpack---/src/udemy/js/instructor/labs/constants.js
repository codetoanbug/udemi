export const LAB_TITLE_MAX_SIZE = 255;
export const LAB_DESCRIPTION_MAX_SIZE = 65535;
export const LAB_INSTRUCTIONS_MAX_SIZE = 65535;
export const RECHECK_PENDING_TIMER_INTERVAL_MS = 30000;

export const LAB_ACTIONS = Object.freeze({
    DELETE: 'delete',
    SAVE: 'save',
});

export const LAB_ACTIONS_FEEDBACK = Object.freeze({
    errors: {
        get title() {
            return gettext('An error occurred');
        },

        get default() {
            return gettext('Please refresh your browser and try again.');
        },

        get delete() {
            return gettext(
                'There was a problem removing your lab. Please refresh your browser and try again.',
            );
        },
        get save() {
            return gettext(
                'There was a problem saving your lab. Please refresh your browser and try again.',
            );
        },
    },
});

export const modularLabManageUrl = (labId) => {
    return `/labs/${labId}/manage/`;
};

export const modularLabManageTasksUrl = (labId) => {
    return `${modularLabManageUrl(labId)}tasks/`;
};

export const LABS_LISTING_URL = '/instructor/labs/';

export const LAB_PREVIEW_EVENT = 'modular_lab_preview';

export const NEW_DEV_WORKSPACE_EVENT = 'new_dev_workspace';

export const NEW_IN_COURSE_WORKSPACE_EVENT = 'new_in_course_workspace';

export const REPORTED_ISSUES_BASE_URL = '/labs/reported-issues';

export const API_SETTINGS = Object.freeze({
    apiUrl: 'labs/reported-issues/',
    countUrl: 'labs/reported-issues/count-unread-reports/',
    apiDetailUrl: (reportedIIssueId) => `labs/reported-issues/${reportedIIssueId}/`,
    detailParams: {
        'fields[survey_user_answer]': 'created,user,subject,body,lab,is_read,lab_mode',
    },
    listParams: {'fields[survey_user_answer]': 'created,user,subject,attempt_id,is_read'},
});

export const ISSUE_TYPES_ALL = 'all';

export const SORT_LABELS = Object.freeze({
    '-created': gettext('Newest first'),
    created: gettext('Oldest first'),
});
