export const PERMISSION_CODES = Object.freeze({
    EDIT_COURSE: 'instructor:edit_course',
    MANAGE_CAPTIONS: 'instructor:manage_captions',
    MANAGE_COURSE_QA: 'instructor:manage_course_qa',
    MANAGE_COURSE_ASSIGNMENTS: 'instructor:manage_course_assignments',
    VIEW_COURSE_REVENUE_REPORT: 'instructor:view_course_revenue_report',
    MANAGE_COURSE_REVIEWS: 'instructor:manage_course_reviews',
    MANAGE_COURSE_PERFORMANCE: 'instructor:manage_course_performance',
});

export const ONE_PANE_MODE = 'onePaneMode',
    TWO_PANE_MODE = 'twoPaneMode';

export const PANE_VIEW_TYPES = Object.freeze({
    ONE: ONE_PANE_MODE,
    TWO: TWO_PANE_MODE,
});

// Taken from udemy/course/models.py
export const MAX_NUM_OF_CURRICULUM_OBJECTS = 1400;
export const MAX_NUM_OF_PUBLISHED_CURRICULUM_OBJECTS = 800;

export const THREAD_DETAIL_PATH_REGEX = '/detail/?$';
