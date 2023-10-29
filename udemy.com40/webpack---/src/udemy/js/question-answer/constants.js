import DoublePaneIcon from '@udemy/icons/dist/double-pane.ud-icon';
import SinglePaneIcon from '@udemy/icons/dist/single-pane.ud-icon';

import {PANE_VIEW_TYPES} from 'instructor/common/constants';

export const UNREAD = 'unread',
    UNANSWERED = 'unanswered',
    UNRESPONDED = 'unresponded',
    NO_INSTRUCTOR_RESPONSE = 'no_instructor_response',
    NO_INSTRUCTOR_RESPONSE_COUNT = 'noInstructorResponse',
    ONE_PANE_MODE_SETTINGS = 'ia-qa-one-pane-mode';

export const VALID_FILTERS = [UNREAD, UNANSWERED, UNRESPONDED, NO_INSTRUCTOR_RESPONSE];

export const FILTER_LABELS = Object.freeze({
    [UNREAD]: gettext('Unread'),
    [UNANSWERED]: gettext('No top answer'),
    [UNRESPONDED]: gettext('No answers'),
    [NO_INSTRUCTOR_RESPONSE]: gettext('No instructor answer'),
});

export const SORT_LABELS = Object.freeze({
    '-last_activity': gettext('Newest first'),
    last_activity: gettext('Oldest first'),
    '-num_upvotes,-created': gettext('Most upvoted'),
});

const fetchUrl = (thread) => `courses/${thread.course.id}/discussions/${thread.id}/`;

export const ONE_PANE_CD_FIELDS =
    '@default,course,user,related_object,is_following,is_instructor,last_reply,last_instructor_viewed_time,learning_url,replies,num_upvotes,is_upvoted,num_replies';

const fetchParams = {
    'fields[course]':
        'id,image_125_H,image_200_H,url,title,features,can_edit,primary_category,locale',
    'fields[course_discussion]':
        '@default,course,user,related_object,is_following,is_instructor,last_reply,last_instructor_viewed_time,learning_url,is_featured,num_upvotes,is_upvoted,num_replies',
    'fields[course_discussion_reply]': '@default,user,-course_discussion,num_upvotes,is_upvoted',
    'fields[course_feature]': 'discussions_replies_create',
    'fields[user]': '@default',
    'fields[lecture]': '@default,url',
    'fields[quiz]': '@default,url',
    'fields[practice]': '@default,learn_url',
};

export const API_SETTINGS = Object.freeze({
    VALID_FILTERS,
    apiUrl: 'users/me/taught-courses-discussions/',
    searchableApiUrl: 'users/me/searchable-taught-courses-discussions/',
    fetchUrl,
    apiDetailUrl: (thread) => `courses/${thread.course.id}/discussions/${thread.id}/replies/`,
    detailParams: {
        'fields[course_discussion_reply]': '@default,user,is_upvoted,num_upvotes,is_instructor',
        'fields[user]': '@default',
        page_size: 1000,
    },
    fetchParams,
    listParams: {
        ...fetchParams,
        page_size: 12,
    },
    followersUrl: (thread) => `${fetchUrl(thread)}followers/`,
});

export const QA_MAIN_ROUTE = '/instructor/communication/qa/';

export const VIEW_MODE_TYPES = {
    [PANE_VIEW_TYPES.TWO]: {
        Icon: DoublePaneIcon,
        label: gettext('View in double pane.'),
        tooltipText: gettext('View in double pane view'),
    },
    [PANE_VIEW_TYPES.ONE]: {
        Icon: SinglePaneIcon,
        label: gettext('View in single pane.'),
        tooltipText: gettext('View in single pane view'),
    },
};

export const AI_ELIGIBLE_COURSE_LANGUAGES = ['en_US', 'en_GB', 'en_IN'];
export const AI_ELIGIBLE_COURSE_CATEGORIES = ['development', 'it-and-software'];
