export const USER_API_PARAMS = Object.freeze({
    'fields[user]': ['@min', 'image_50x50', 'initials', 'url'].join(','),
});

export const QUESTION_API_PARAMS = Object.freeze({
    page_size: 15,
    // NOTE Update test_num_queries_questions_course_dashboard if changing fields!
    // or test_num_queries_searchable_questions_course_dashboard if searching
    'fields[course_discussion]': [
        '@default',
        'created',
        'is_featured',
        'is_following',
        'is_instructor',
        'is_upvoted',
        'num_replies',
        'num_upvotes',
        'related_object',
        'user',
        'tracking_id',
    ].join(','),
    ...USER_API_PARAMS,
    'fields[lecture]': ['@min', 'title', 'object_index'].join(','),
    'fields[quiz]': ['@min', 'title', 'object_index'].join(','),
    'fields[practice]': ['@min', 'title', 'object_index'].join(','),
});

export const PAGE_SIZE = 5;

export const REPLY_API_PARAMS = Object.freeze({
    'fields[course_discussion_reply]': '@all',
    ...USER_API_PARAMS,
});

export const FILTER_LABELS = Object.freeze({
    FOLLOWING: gettext("Questions I'm following"),
    UNANSWERED: gettext('Questions without responses'),
    USER: gettext('Questions I asked'),
});

export const SORT_BY = Object.freeze({
    POPULARITY: 'popularity',
    RECENCY: 'recency',
    UPVOTES: 'upvotes',
});

export const SORT_LABELS = Object.freeze({
    [SORT_BY.POPULARITY]: gettext('Sort by recommended'),
    [SORT_BY.RECENCY]: gettext('Sort by most recent'),
    [SORT_BY.UPVOTES]: gettext('Sort by most upvoted'),
});

// Needs to match values in CourseDiscussionQueryFactory
export const SORT_PARAMS = Object.freeze({
    [SORT_BY.POPULARITY]: '-popularity,-created',
    [SORT_BY.RECENCY]: '-created,-last_activity',
    [SORT_BY.UPVOTES]: '-num_upvotes,-created',
});

export const LECTURE_FILTER = Object.freeze({
    ALL: 'all_lectures',
    CURRENT: 'current_lecture',
});

export const LECTURE_FILTER_LABELS = Object.freeze({
    [LECTURE_FILTER.ALL]: gettext('All lectures'),
    [LECTURE_FILTER.CURRENT]: gettext('Current lecture'),
});

export const API_DEBOUNCE_INTERVAL = 300;

export const TRACKING_PREFIX = 'dashboard.tab';

export const TRACKING_ACTIONS = Object.freeze({
    REPORT_ABUSE: 'report visit',
});

export const SECTION_LABELS = Object.freeze({
    SORTFILTER: gettext('Sort/filter options'),
});
