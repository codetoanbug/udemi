export const LAB_SURVEY_CODES = Object.freeze({
    FEEDBACK: 'labs-feedback',
    WORKSPACE_FEEDBACK: 'lab-workspace-feedback',
    WORKSPACE_FEEDBACK_V2: 'lab-workspace-feedback-v2',
    LAB_MANAGE_FEEDBACK: 'lab-manage-feedback',
    LANDING_SEARCH: 'lab-landing-search',
    IDE_FEEDBACK: 'lab-ide-feedback',
    OTHER_FEEDBACK: 'lab-other-feedback',
    CONTENT_FEEDBACK: 'lab-content-feedback',
});

export const LAB_TECHNICAL_ISSUE_CODE = 'lab-technical-issue';

export const TECHNICAL_ISSUE_LAB_TAKING = 'lab-taking';

export const LAB_TECHNICAL_ISSUE_SUBJECTS = {
    [TECHNICAL_ISSUE_LAB_TAKING]: {
        get options() {
            return [
                gettext("I'm facing permissions issues while following the lab"),
                gettext("I'm facing loading issues"),
                gettext("I'm facing an issue with a feature in the workspace"),
            ];
        },
        get alrOptions() {
            return [gettext("I'm facing an issue with the automated reviews")];
        },
    },
};

export const TECHNICAL_ISSUE_ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.bmp'];

export const REPORT_ISSUE_ITEMS = {
    [LAB_TECHNICAL_ISSUE_CODE]: {
        type: 'technical',
        get text() {
            return gettext('Report a technical issue');
        },
        labSurveyCode: LAB_TECHNICAL_ISSUE_CODE,
    },
    [LAB_SURVEY_CODES.CONTENT_FEEDBACK]: {
        type: 'content',
        get text() {
            return gettext('Report a content issue');
        },
        labSurveyCode: LAB_SURVEY_CODES.CONTENT_FEEDBACK,
    },
    [LAB_SURVEY_CODES.OTHER_FEEDBACK]: {
        type: 'other',
        get text() {
            return gettext('Report something else');
        },
        labSurveyCode: LAB_SURVEY_CODES.OTHER_FEEDBACK,
    },
    [LAB_SURVEY_CODES.WORKSPACE_FEEDBACK_V2]: {
        type: 'workspace-feedback',
        labSurveyCode: LAB_SURVEY_CODES.WORKSPACE_FEEDBACK_V2,
    },
};

export const ISSUE_DETAILS_NOTE = {
    [LAB_TECHNICAL_ISSUE_CODE]: {
        get text() {
            return gettext(
                'Please use this form exclusively to report technical issues. For additional assistance and inquiries, refer to our <a class="helpCenterUrl">help center</a> and/or contact support.',
            );
        },
    },
    [LAB_SURVEY_CODES.CONTENT_FEEDBACK]: {
        get text() {
            return gettext(
                'Please use this form exclusively to report content issues. For additional assistance and inquiries, refer to our <a class="helpCenterUrl">help center</a> and/or contact support.',
            );
        },
    },
};
