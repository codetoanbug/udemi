export const TAUGHT_COURSES_URL = 'users/me/taught-courses/';
export const CO_INSTRUCTOR_INVITATIONS_URL = '/users/me/co-instructor-invitations/';
export const PERMISSIONS_SUPPORT_ARTICLE_URL =
    'https://support.udemy.com/hc/en-us/articles/229604308-adding-co-instructors-and-teaching-assistants';

export const API_STATE = Object.freeze({
    DONE: 'DONE',
    ERROR: 'ERROR',
    SEARCHING: 'SEARCHING',
    NO_PERMISSION: 'NO PERMISSION',
    NOT_FOUND: 'NOT FOUND',
});

export const COURSE_VIEW_TYPES = Object.freeze({
    LIGHT: 'light',
    DETAIL: 'detail',
    PRIVACY: 'privacy',
});

export const MAX_PAGE_SIZE = 500;

export const TAUGHT_COURSES_PARAMS = {
    'fields[course]':
        '@min,image_125_H,image_200_H,permissions,is_published,was_ever_published,is_practice_test_course,rating,primary_subcategory,is_in_any_ufb_content_collection,is_course_in_ub_ever',
    'fields[course_subcategory]': 'avg_rating,avg_rating_recent',
    ordering: '-published_time',
    page_size: MAX_PAGE_SIZE,
};

export const AI_TAUGHT_COURSES_PARAMS = {
    'fields[course]':
        '@min,image_125_H,image_200_H,permissions,is_published,was_ever_published,is_practice_test_course,rating,primary_subcategory,is_in_any_ufb_content_collection,is_course_in_ub_ever,primary_category,locale',
    'fields[course_subcategory]': 'avg_rating,avg_rating_recent',
    ordering: '-published_time',
    page_size: MAX_PAGE_SIZE,
};

export const TAUGHT_COURSES_PARAMS_SLIM = {
    'fields[course]':
        '@min,permissions,is_published,was_ever_published,is_practice_test_course,is_in_any_ufb_content_collection,is_course_in_ub_ever,has_course_a_published_coding_exercise,is_private',
    slim: 'true',
    ordering: '-published_time',
    page_size: MAX_PAGE_SIZE,
};

export const AI_TAUGHT_COURSES_PARAMS_SLIM = {
    'fields[course]':
        '@min,permissions,is_published,was_ever_published,is_practice_test_course,is_in_any_ufb_content_collection,is_course_in_ub_ever,has_course_a_published_coding_exercise,is_private,primary_category,locale',
    slim: 'true',
    ordering: '-published_time',
    page_size: MAX_PAGE_SIZE,
};

export const PERMISSION_DISPLAY_MAP = {
    'instructor:visible': gettext('Visible instructor'),
    'instructor:edit_course': gettext('Manage course'),
    'instructor:manage_captions': gettext('Captions'),
    'instructor:manage_course_performance': gettext('Performance'),
    'instructor:manage_course_qa': gettext('Q&A'),
    'instructor:manage_course_reviews': gettext('Reviews'),
    'instructor:manage_course_assignments': gettext('Assignments'),
    'instructor:view_course_revenue_report': gettext('Revenue Report'),
};

export const JOIN_NEWCOMER_CHALLENGE_STATUS_STATE = {
    NOT_JOINED: 'not_joined',
    ALREADY_JOINED: 'already_joined',
    ALREADY_PUBLISHED: 'already_published',
    SUCCESSFULLY_JOINED: 'successfully_joined',
    ERROR: 'error',
};
