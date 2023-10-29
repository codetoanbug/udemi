export const FEEDBACK = 'feedback_type',
    SHARING = 'permission_type',
    FILTER_UNREAD = 'unread';

export const FEEDBACK_USER_TYPE = {
    peer: 2,
    self: 4,
};

export const VALID_FILTERS = [FEEDBACK, SHARING, FILTER_UNREAD];

export const SORT_LABELS = Object.freeze({
    '-submission_time': gettext('Newest first'),
    submission_time: gettext('Oldest first'),
});

export const FEEDBACK_LABELS = Object.freeze({
    all: gettext('All'),
    no_feedback: gettext('No feedback'),
    student_only: gettext('Student only'),
    instructor_only: gettext('Instructor only'),
    student_and_instructor: gettext('Student and instructor'),
});

export const SHARING_LABELS = Object.freeze({
    all: gettext('All'),
    instructor_only: gettext('Instructor only'),
    public: gettext('Public'),
});

const fetchUrl = (thread) =>
    `practices/${thread.practice.id}/user-attempted-practices/${thread.id}/`;
const fetchParams = {
    'fields[course]': 'id,image_125_H,image_200_H,url,title,features,can_edit',
    'fields[practice]': '@min,is_published,learn_url,course',
    'fields[practice_question]': 'body,sort_order',
    'fields[practice_question_user_answer]': 'body,practice_question',
    'fields[user]': '@default',
    'fields[user_attempted_practice]':
        'submission_time,is_private,user,practice,last_feedback,is_read,question_user_answers',
    'fields[practice_feedback_question_user_answer]': 'id,body,user,comment_thread,created',
    'fields[course_feature]': 'discussions_replies_create',
    'fields[lecture]': '@default,url',
};
export const API_SETTINGS = Object.freeze({
    VALID_FILTERS,
    apiUrl: 'users/me/taught-courses-assignments/',
    fetchUrl,
    apiDetailUrl: (thread) => `practices/${thread.practice.id}/feedback-user-answers/`,
    detailParams: {
        'fields[practice_feedback_question_user_answer]':
            'user,body,feedback_question,comment_thread,created',
        'fields[user]': '@default',
        page_size: 255,
    },
    fetchParams,
    listParams: {
        ...fetchParams,
        page_size: 12,
    },
});
