export const PAGES = Object.freeze({
    INTRO_PAGE: 'INTRO_PAGE',
    START_PAGE: 'START_PAGE',
    SUBMISSION_PAGE: 'SUBMISSION_PAGE',
    SOLUTION_PAGE: 'SOLUTION_PAGE',
    FEEDBACK_PAGE: 'FEEDBACK_PAGE',
    SUMMARY_PAGE: 'SUMMARY_PAGE',
    SUMMARY_DETAIL_PAGE: 'SUMMARY_DETAIL_PAGE',
});

export const SUMMARY_PAGE_URI = '/summary';

export const OWNER_ANSWER_FIELD = 'owner_feedback_question_user_answers';
export const SELF_QUESTION_TYPE = 'self';
export const PEER_QUESTION_TYPE = 'peer';

export const PAGE_DATA = Object.freeze({
    [PAGES.START_PAGE]: {shouldShowProgressBar: false, nextUrl: '/introduction', prevUrl: null},
    [PAGES.INTRO_PAGE]: {shouldShowProgressBar: true, nextUrl: '/submission', prevUrl: null},
    [PAGES.SUBMISSION_PAGE]: {
        shouldShowProgressBar: true,
        nextUrl: '/instructor-solution',
        prevUrl: '/introduction',
    },
    [PAGES.SOLUTION_PAGE]: {
        shouldShowProgressBar: true,
        nextUrl: '/give-feedback',
        prevUrl: '/submission',
    },
    [PAGES.FEEDBACK_PAGE]: {
        shouldShowProgressBar: true,
        nextUrl: '/summary',
        prevUrl: '/instructor-solution',
    },
    [PAGES.SUMMARY_PAGE]: {
        shouldShowProgressBar: false,
        nextUrl: null,
        prevUrl: null,
        shouldShowAlertEndPractice: true,
    },
    [PAGES.SUMMARY_DETAIL_PAGE]: {shouldShowProgressBar: false, nextUrl: null, prevUrl: null},
});

export const PAGE_TO_STATE_MAP = Object.freeze({
    'start-page': '',
    introduction: 'introduction',
    submission: 'submission',
    instructor_solution: 'instructor-solution',
    give_feedback: 'give-feedback',
    summary: 'summary',
});

export const COMPONENT_TYPES = Object.freeze({
    VIDEO: 'video',
    TEXT: 'text',
    DOWNLOAD: 'download',
});

export const DEFAULT_ASSIGNED_SUBMISSION_FIELDS = Object.freeze({
    'fields[user_assigned_submission]': '@default,user_attempted_practice',
    'fields[user_attempted_practice]':
        'question_user_answers,user,submission_time,owner_feedback_question_user_answers',
    'fields[practice_question_user_answer]': 'body,practice_question,comment_thread',
    'fields[practice_feedback_question]': '@min,body',
    'fields[comment_thread]': 'latest_comment',
});

export const API_PRACTICE_FIELDS = Object.freeze({
    'fields[practice]': ['is_free', 'estimated_duration', 'description', 'num_submissions'].join(
        ',',
    ),
});

export const API_PRACTICE_COMPONENT_FIELDS = Object.freeze({
    'fields[practice_component]': ['body', 'asset', 'display_type'].join(','),
    'fields[asset]': ['asset_type', 'title', 'external_url'].join(','),
});

export const API_PRACTICE_QUESTION_FIELDS = Object.freeze({
    'fields[practice_question]': ['body', 'answer'].join(','),
});
