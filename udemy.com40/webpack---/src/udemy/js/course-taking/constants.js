export const CT_VERSION = 5;

export const API_COURSE_FIELDS_CACHEABLES = [
    'title',
    'headline',
    'description',
    'prerequisites',
    'objectives',
    'target_audiences',
    'url',
    'is_published',
    'is_approved',
    'is_practice_test_course',
    'content_length_video',
    'instructional_level',
    'locale',
    'content_length_practice_test_questions',
    'content_info',
    'num_subscribers',
    'visible_instructors',
    'is_paid',
    'is_private',
    'is_owner_terms_banned',
    'is_owned_by_instructor_team',
    'image_240x135',
    'instructor_status',
    'is_cpe_compliant',
    'cpe_field_of_study',
    'cpe_program_level',
    'num_cpe_credits',
    'is_in_user_subscription',
    'course_has_labels',
    'is_course_available_in_org',
    'has_labs_in_course_prompt_setting',
].join(',');

export const API_COURSE_FIELDS_NO_CACHEABLES = [
    'available_features',
    'features',
    'gift_url',
    'has_certificate',
    'has_closed_caption',
    'is_saved',
].join(',');

export const API_COURSE_ALL_FIELDS = [
    API_COURSE_FIELDS_CACHEABLES,
    API_COURSE_FIELDS_NO_CACHEABLES,
].join(',');

export const API_LOCALE_FIELDS = ['simple_english_title'].join(',');

export const API_USER_FIELDS = [
    'url',
    'title',
    'job_title',
    'image_200_H',
    'description',
    'display_name',
    'image_50x50',
    'initials',
    'url_twitter',
    'url_facebook',
    'url_linkedin',
    'url_youtube',
    'url_personal_website',
].join(',');

export const API_ASSET_FIELDS = ['title', 'filename', 'asset_type', 'status', 'time_estimation'];

export const API_ASSET_CACHED_FIELDS = [
    'title',
    'filename',
    'asset_type',
    'status',
    'time_estimation',
    'is_external',
];

export const COMMON_CURRICULUM_FIELDS = ['title', 'object_index', 'is_published', 'sort_order'];

export const API_CURRICULUM_FIELDS = {
    // NOTE Update test_num_queries_curriculum_course_dash_as_instructor if changing fields!
    // NOTE Update test_num_queries_curriculum_course_dash_as_student if changing fields!
    'fields[lecture]': COMMON_CURRICULUM_FIELDS.concat([
        'created',
        'asset',
        'supplementary_assets',
        'is_free',
    ]).join(','),
    'fields[quiz]': COMMON_CURRICULUM_FIELDS.concat(['type']).join(','),
    'fields[practice]': COMMON_CURRICULUM_FIELDS.join(','),
    'fields[chapter]': COMMON_CURRICULUM_FIELDS.join(','),
    'fields[asset]': API_ASSET_FIELDS.join(','),
};

export const API_CURRICULUM_CACHED_FIELDS = {
    ...API_CURRICULUM_FIELDS,
    'fields[asset]': API_ASSET_CACHED_FIELDS.join(','),
};

export const API_CURRICULUM_CACHED_FIELDS_ASSESSMENT_EXPERIMENT = {
    ...API_CURRICULUM_FIELDS,
    'fields[asset]': API_ASSET_CACHED_FIELDS.join(','),
    'fields[chapter]': COMMON_CURRICULUM_FIELDS.concat(['gt_assignments']).join(','),
};

export const API_PROGRESS_COURSE_FIELDS = [
    'completed_lecture_ids',
    'completed_quiz_ids',
    'last_seen_page',
    'completed_assignment_ids',
    'first_completion_time',
];

export const API_ENROLLMENT_COURSE_HAS_USER_FIELDS = [
    'archive_time',
    'favorite_time',
    'was_purchased_by_student',
    'was_paid_by_student',
    'is_in_refund_period',
    'notification_settings',
    'available_features',
    'created',
].join(',');

export const API_ENROLLMENT_FIELDS = {
    'fields[course_has_user]': API_ENROLLMENT_COURSE_HAS_USER_FIELDS,
};

export const SIDEBAR_CONTENT = Object.freeze({
    PRACTICE_TEST_QUESTIONS: 'practice_test_questions',
    TRANSCRIPT: 'transcript',
    DEFAULT: 'default',
    NONE: 'none',
});

export const SIDEBAR_SCROLL_CONTAINER_ID = 'ct-sidebar-scroll-container';

export const CERTIFICATE_READY_POLLING_INTERVAL = 15 * 1000;

export const MAX_NUM_OF_CURRICULUM_OBJECTS = 200;

export const USER_TYPES = Object.freeze({
    INSTRUCTOR: 'Instructor',
    STUDENT: 'Student',
});

export const TRACKING_CATEGORIES = Object.freeze({
    DASHBOARD: 'dashboard',
    SEARCH: 'search',
    SEARCH_VISIT: 'search_visit',
    TRANSCRIPT: 'transcript',
    BOOKMARK_FILTER: 'bookmark_filter',
    BOOKMARK_SORT: 'bookmark_sort',
    BOOKMARK_ACTION: 'bookmark_action',
    ASSESSMENT_BANNER_VIEW: 'assessment_banner_view',
    ASSESSMENT_BANNER_CLICK: 'assessment_banner_click',
    ASSESSMENT_GUIDE: 'assessment_guide',
    QUESTION: 'question',
    LECTURE: 'lecture',
    LECTURE_DOWNLOAD: 'lecture-download',
    REPORT_VISIT: 'report-visit',
    COURSE_CONTENT_DOWNLOAD: 'course_content_download',
    COURSE_CONTENT_VIEW: 'course_content_view',
    COURSE_CONTENT_LIST_OPEN: 'course_content_list',
    INTERSTITIAL: 'interstitial',
    PROGRESS: 'progress',
    PLAYER_SETTINGS: 'player_settings',
    NAVIGATION: 'navigation',
    END_SCREEN: 'end_screen',
    FIND_MORE_COURSES: 'find_more_courses',
    DETAILED_PRACTICE_TEST_RESULTS: 'detailed_practice_test_results',
});

export const ASSESSMENT_GUIDE_ACTIONS = Object.freeze({
    CLICK_GUIDED_SECTION: 'click_guided_section',
});

export const ASSESSMENT_BANNER_ACTIONS = Object.freeze({
    CLICK_ASSESSMENT_BANNER: 'click_assessment_banner',
    DISPLAY_ASSESSMENT_BANNER: 'display_assessment_banner',
});

export const DETAILED_PRACTICE_TEST_RESULTS_ACTIONS = Object.freeze({
    CLICK_KNOWLEDGE_AREAS_FILTER: 'click_knowledge_areas_filter',
    CLICK_QUESTION_TYPE_FILTER: 'click_question_type_filter',
    SCROLL_PAGE: 'scroll_page',
    VIEW_PAGE: 'view_page',
});

export const PROGRESS_ACTIONS = Object.freeze({
    MARK_COMPLETE: 'mark_complete',
    MARK_RESET: 'mark_reset',
});

export const USER_PREFERENCES = {
    SIDEBAR_CONTENT: 'sidebar_content',
    DASHBOARD_TAB: 'dashboard_tab',
};

export const AVAILABLE_FEATURES = {
    CERTIFICATE: 'certificate',
    Q_AND_A_ENABLED: 'q_and_a_enabled',
    HAS_WORKSPACE_ASSOCIATED: 'has_workspace_associated',
};

export const CERTIFICATE_TYPE_UDEMY = 'udemy';

export const CERTIFICATE_TYPE_NASBA = 'nasba';

export const CERTIFICATES_TYPES = [CERTIFICATE_TYPE_UDEMY, CERTIFICATE_TYPE_NASBA];

export const IS_ASSESSMENT_GUIDE_ENABLED_COURSE_LIST = [
    1025702,
    1298780,
    1360446,
    1456464,
    1546884,
    1602900,
    1754098,
    1755264,
    1879018,
    1921420,
    1927250,
    2015076,
    2051741,
    2059535,
    1535678,
    2193468,
    2196488,
    2253706,
    2327688,
    2359992,
    2360064,
    2394982,
    2533568,
    2542943,
    2543649,
    2645936,
    2782102,
    2813427,
    3251302,
    3827154,
    567828,
    625204,
    684824,
    705264,
    762616,
    773214,
    802574,
    802576,
    2301254,
    1988542,
    3336410,
    2462140,
    345340,
    2533568,
    1361790,
    1754098,
    3125272,
    4065250,
    4008228,
];

export const QUESTION_TRACKING_ACTIONS = Object.freeze({
    SEARCH_QUESTION: 'dashboard.tab.questions-view.search-questions',
    LOAD_SEARCH_RESPONSE: 'dashboard.tab.questions-view.load-search-response',
    CLICK: 'dashboard.tab.open-detail',
    BACK_TO_ALL_QUESTIONS: 'dashboard.tab.detail-view.back-to-all-questions',
    IMPRESSION: 'dashboard.tab.questions-view.impression',
});

export const NEW_QUESTION_TRACKING_ACTIONS = Object.freeze({
    CLICK: 'dashboard.tab.questions-view.show-new-question-form',
    BACK_TO_ALL_QUESTIONS: 'dashboard.tab.new-question.back-to-all-questions',
    CATEGORY_SELECT: 'dashboard.tab.new-question-related-to-view.category_select',
    SUBMIT: 'dashboard.tab.detail-view.add-question',
});
