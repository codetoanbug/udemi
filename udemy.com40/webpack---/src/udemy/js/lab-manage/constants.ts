export const LAB_API_FIELDS = [
    'title',
    'min_estimated_time',
    'max_estimated_time',
    'project_overview',
    'lab_overview',
    'challenge_overview',
    'what_you_will_do',
    'what_you_will_learn',
    'initial_source_code',
    'requirements',
    'lab_type',
    'vertical',
    'template',
    'tasks',
    'spec',
    'status',
    'instructor_has_lab',
    'topics',
    'my_latest_instance',
    'last_released',
    'content_modified',
].join(',');

export const LAB_TASKS_API_FIELDS = [
    'id',
    'title',
    'resources',
    'challenge',
    'status',
    'automated_review_tests',
].join(',');

export const MODAL_REVIEW = 'review';
export const MODAL_ERROR = 'error';

export const INITIAL_SOURCE_CODE_DEPENDENCY_LIST_NAMES = [
    'requirements.txt',
    'package.json',
    'pom.xml',
];

export const INITIAL_MAKEFILE_DENY_LIST = ['Git', 'Linux'];

export const INITIAL_DS_MAKEFILE_DENY_LIST = ['PhpMyAdmin'];

export const INITIAL_SOURCE_CODE_DS_REQUIRED_FILES = Object.freeze({
    jupiter: {
        specPrefix: 'Jupyterlab',
        fileType: 'ipynb',
    },
});

export const SOURCE_CODE_NOT_VALID_ENTRIES = ['__MACOSX', '.DS_Store', '.git', 'node_modules'];

export const SOURCE_CODE_MAX_FILE_SIZE_IN_MB = 40;

export const SOURCE_CODE_VALIDATION_MESSAGES = Object.freeze({
    get dependencyListMissing() {
        return interpolate(
            gettext('Dependencies list not found. Expected format: %(list)s'),
            {list: INITIAL_SOURCE_CODE_DEPENDENCY_LIST_NAMES.join(', ')},
            true,
        );
    },
    get requiredFileMissing() {
        return gettext('Required file not found. Required file type: %(fileType)s');
    },
    get noMakefileExist() {
        return gettext('Makefile either does not exist or is in the wrong directory.');
    },
    get notValidFolderExists() {
        return interpolate(
            gettext('%(list)s entries are not supported.'),
            {list: SOURCE_CODE_NOT_VALID_ENTRIES.join(', ')},
            true,
        );
    },
    get noRootFolderCodeExists() {
        return gettext(
            'Single directories at root level are not supported. Please ensure there is a top level source code file.',
        );
    },
    get fileSizeExceeded() {
        return interpolate(
            gettext('File size should be less or equal to %(size)s MB'),
            {size: SOURCE_CODE_MAX_FILE_SIZE_IN_MB},
            true,
        );
    },
});

export const LAB_INSTRUCTOR_PERMISSIONS = {
    EDIT_DRAFT: 'labs:edit',
    EDIT_PUBLISHED: 'labs:edit_published',
    EDIT_VERTICAL_TEMPLATE: 'labs:edit_vertical_template',
    MANAGE_INSTRUCTORS: 'labs:manage_instructors',
    REVENUE_REPORT: 'labs:view_lab_revenue_report',
    REPORTED_ISSUES: 'labs:view_reported_issues',
    CREATE_ALR_TEST: 'labs:create_alr_test',
} as const;

export const LAB_INSTRUCTOR_PERMISSIONS_FIELDS = {
    INSTRUCTOR: 'instructor',
    REVENUE_SHARE: 'revenueShare',
    EDIT_DRAFT_LAB: 'editDraftLab',
    EDIT_PUBLISHED_LAB: 'editPublishedLab',
    EDIT_VERTICAL_TEMPLATE: 'editVerticalTemplate',
    MANAGE_INSTRUCTORS: 'manageInstructors',
    REVENUE_REPORT: 'revenueReport',
    CREDIT_VISIBLE: 'creditVisible',
    REPORTED_ISSUES: 'reportedIssues',
    CREATE_ALR_TEST: 'createALRTest',
} as const;

export const SORTABLE_ANIMATION_TIME = 150;

export const SORTABLE_SCROLL_SPEED = 20;

export const SORTABLE_SCROLL_SENSITIVITY = 180;
