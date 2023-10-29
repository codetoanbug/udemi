export const SECTION_CONTENT_TYPE = 'section_heading';
export const COURSE_CONTENT_TYPE = 'course';
export const LAB_CONTENT_TYPE = 'lab';
export const RECOMMENDED_CONTENT_TYPE = 'recommended_courses';
export const RESOURCE_CONTENT_TYPE = 'learning_path_resource';
export const ASSESSMENT_CONTENT_TYPE = 'adaptive_assessment_assessment';
export const COURSE_PORTION_CONTENT_TYPE = 'course_portion';
export const USER_CONTENT_TYPE = 'user';
export const LMS_ENROLL_PARAM = 'lms_enroll';

export const ALLOWED_ITEM_TYPES = [
    COURSE_CONTENT_TYPE,
    RESOURCE_CONTENT_TYPE,
    ASSESSMENT_CONTENT_TYPE,
    LAB_CONTENT_TYPE,
];

export const LEARNING_PATH_TITLE_PLACEHOLDER = {
    get ARIA_LABEL() {
        return gettext('Edit learning path title');
    },
    get TEXT() {
        return gettext('Path title');
    },
};
export const LEARNING_PATH_DESCRIPTION_PLACEHOLDER = {
    get ARIA_LABEL() {
        return gettext('Edit learning path description');
    },
    get TEXT() {
        return gettext('Learning path description');
    },
};

export const LEARNING_PATH_AUTOSAVE_INTERVAL = 500;
export const LEARNING_PATH_TITLE_MAXLENGH = 255;

export const LEARNING_PATH_ERROR_MESSAGES = Object.freeze({
    get UNABLE_TO_LOAD() {
        return gettext("The learning path page you tried to visit doesn't exist.");
    },
    get UNABLE_TO_CREATE() {
        return gettext('Unable to create learning path.');
    },
    get UNABLE_TO_DELETE() {
        return gettext('An error occurred while deleting the learning path.');
    },
    get UNABLE_TO_SAVE() {
        return gettext('Unable to save learning path.');
    },
    get UNABLE_TO_LOAD_PROGRESS() {
        return gettext('Unable to load learning path progress.');
    },
    get UNABLE_TO_LOAD_CONTENT() {
        return gettext('Unable to load learning path content.');
    },
    get UNABLE_TO_EDIT_HISTORY() {
        return gettext('Unable to load learning path edit history.');
    },
    get UNABLE_TO_REMOVE_ITEM() {
        return gettext('An error occurred while removing content from the learning path.');
    },
    get UNABLE_TO_SAVE_CHANGES() {
        return gettext('Your changes could not be saved.');
    },
    get UNABLE_TO_ADD_CONTENT() {
        return gettext('An error occurred while adding content to the learning path.');
    },
    get UNABLE_TO_REORDER() {
        return gettext('An unexpected error occured. Try to refresh the page.');
    },
    get UNABLE_TO_ENROLL_USER() {
        return gettext('Unable to enroll to learning path.');
    },
    get UNABLE_TO_UNENROLL_USER() {
        return gettext('Unable to unenroll from learning path.');
    },
    get UNABLE_TO_ENROLL_TO_COURSE() {
        return gettext('Unable to enroll to course');
    },
    get UNABLE_TO_DUPLICATE_PATH() {
        return gettext('An error occurred while duplicating the learning path.');
    },
    get UNABLE_TO_UPDATE_PERMISSION() {
        return gettext('An unexpected error occurred. Please try again.');
    },
    get PATH_TITLE_EXISTS() {
        return gettext(
            'This path has the same title as an existing path. The title needs to be unique.',
        );
    },
});

export const LEARNING_PATH_SUCCESS_MESSAGES = Object.freeze({
    get DELETED_PATH() {
        return gettext('You successfully deleted the learning path.');
    },
    get DELETED_ITEM() {
        return gettext('You successfully deleted the item from the learning path.');
    },
    get UPDATED_EDITORS() {
        return gettext('Editors have been successfully updated');
    },
});

export const LEARNING_PATH_SECTION_API_FIELDS = ['id', 'title', 'description', 'items'];

export const LEARNING_PATH_SECTION_ITEM_API_FIELDS = [
    'id',
    'title',
    'description',
    'related_object_type',
    'estimated_content_length',
    'content',
    'is_removed',
];

export const SECTION_TITLE_PLACEHOLDER = {
    get TEXT() {
        return gettext('Untitled section');
    },
};

export const SECTION_TITLE_TEXT = {
    get TEXT() {
        return gettext('Section title');
    },
};

export const SECTION_DESCRIPTION_TEXT = {
    get TEXT() {
        return gettext('Section description');
    },
};

export const DESCRIPTION_PLACEHOLDER = {
    get TEXT() {
        return gettext('Add description');
    },
};

export const ADD_CONTENT_LABEL = {
    get TEXT() {
        return gettext('Add content');
    },
};

export const PUBLIC_VISIBILITY_OPTION = 'public';
export const PRIVATE_VISIBILITY_OPTION = 'private';

export const VISIBILITY_OPTIONS = {
    [PUBLIC_VISIBILITY_OPTION]: {
        get TEXT() {
            return gettext('Public');
        },
    },
    [PRIVATE_VISIBILITY_OPTION]: {
        get TEXT() {
            return gettext('Private');
        },
    },
};

export const VISIBILITY_OPTIONS_MODAL_CONTENT = {
    [PUBLIC_VISIBILITY_OPTION]: {
        get title() {
            return gettext('Make this learning path public?');
        },
        get content_title() {
            return gettext('If you make this path public:');
        },
        get content() {
            return [
                gettext(
                    'Anyone in your organization will be able to discover and enroll in this path once they are logged in to your Udemy Business account.',
                ),
                gettext("This path will be listed under 'All paths' in the learning paths area."),
                gettext('Admins will be able to organize this path into folders.'),
                gettext('Admins will be able to add themselves as an editor.'),
            ];
        },
        get button_label() {
            return gettext('Make public');
        },
    },
    [PRIVATE_VISIBILITY_OPTION]: {
        get title() {
            return gettext('Make this learning path private?');
        },
        get content_title() {
            return gettext('If you make this path private:');
        },
        get button_label() {
            return gettext('Make private');
        },
    },
};

export const PUBLIC_VISIBILITY_TOOLTIP = {
    get TEXT() {
        return gettext(
            '<p>This path is <b>public</b>. It is currently visible to your whole org and is listed under ‘All Paths’ in the Learning Paths area.</p><p>If you make it <b>private</b> it will be visible only to you, other editors, assignees and anyone already enrolled in this path.</p>',
        );
    },
};

export const PRIVATE_VISIBILITY_TOOLTIP = {
    get TEXT() {
        return gettext(
            '<p>This path is <b>private</b>. It is currently visible only to you, other editors and people who have been assigned the path.</p><p>If you make it <b>public</b>, it will be visible to your whole org and will be listed under ‘All paths’ in the learning paths area.</p>',
        );
    },
};

export const CONTENT_TYPE_CONFIG = Object.freeze({
    [SECTION_CONTENT_TYPE]: {
        get title() {
            return gettext('Section heading');
        },
        get untitled() {
            return gettext('Untitled section');
        },
    },
    [COURSE_CONTENT_TYPE]: {
        get title() {
            return gettext('Udemy course');
        },
        get untitled() {
            return gettext('Untitled course');
        },
        get placeholder() {
            return gettext('Paste the URL of the Udemy course here');
        },
        get description() {
            return '';
        },
    },
    [RECOMMENDED_CONTENT_TYPE]: {
        get title() {
            return gettext('Recommended courses');
        },
    },
    [RESOURCE_CONTENT_TYPE]: {
        get title() {
            return gettext('Link');
        },
        get untitled() {
            return gettext('Untitled link');
        },
        get placeholder() {
            return gettext('Add links to your learning path');
        },
        get description() {
            return gettext(
                'You can include links to any webpage such as articles or your company wiki.',
            );
        },
    },
    [ASSESSMENT_CONTENT_TYPE]: {
        get title() {
            return gettext('Udemy assessment');
        },
        isPro: true,
        get untitled() {
            return gettext('Untitled assessment');
        },
        get placeholder() {
            return gettext('Paste the URL of the Udemy assessment here');
        },
        get description() {
            return '';
        },
    },
    [LAB_CONTENT_TYPE]: {
        get title() {
            return gettext('Udemy lab');
        },
        isPro: true,
        get untitled() {
            return gettext('Untitled lab');
        },
        get placeholder() {
            return gettext('Paste the URL of the Udemy lab here');
        },
        get description() {
            return '';
        },
    },
});

export const ADD_LINK_BUTTON_LABEL = {
    get TEXT() {
        return gettext('Add Link');
    },
};

export const COURSE_IMAGE_DIMENSIONS = {
    height: 70,
};

export const SORTABLE_ANIMATION_TIME = 150;

export const SORTABLE_SCROLL_SPEED = 20;

export const SORTABLE_SCROLL_SENSITIVITY = 180;

export const TIPS_INTERCOM_TOUR_ID = 60798;

export const COURSE_EDITABLE_CONTENT_TYPES = [COURSE_CONTENT_TYPE, COURSE_PORTION_CONTENT_TYPE];
export const UDEMY_ENROLLABLE_CONTENT_TYPES = [COURSE_CONTENT_TYPE, COURSE_PORTION_CONTENT_TYPE];

// This is the number of themes to show by default - there is a view all button that expands the rest
export const NUMBER_THEMES_TO_SHOW = 3;

export const INVISIBLE_SECTION_KEY = 'invisible';

export const INVISIBLE_SECTION_SELECTOR = 'section-invisible';

export const AUTO_ENROLL_INFO_MESSAGE = {
    get TEXT() {
        return gettext('You are automatically enrolled in a path when you start learning.');
    },
};

export const RESOURCE_DEFAULT_SCHEMA = 'https://';

export const USER_IMAGE_SIZE = 'small';

export const PAGE = 1;
export const PAGE_SIZE = 20;
export const USER_FIELDS = '@default,image_75x75';

export const HISTORY_LOG_LAUNCH_DATE = new Date('09/25/2020');

export const PATH_LAST_EDIT_POLLING_TIMEOUT = 5000;

// for now there is just one collection of assessments
export const ASSESSMENT_COLLECTION_BASE_PATH = '/skills-assessment/';

export const LAB_COLLECTION_BASE_PATH = '/labs/';

export const LEARNING_PRO_PATH_ORGANIZATION_ID = 148510;

export const COURSE_RETIREMENT_ALERT_TYPES = Object.freeze({
    TO_BE_RETIRED: 'to_be_retired_course',
    RETIRED: 'retired_course',
});

export const COURSE_RETIREMENT_ALERT_EVENT_TRACKING_ACTIONS = Object.freeze({
    EDIT_PATH: 'edit_path',
    LEARN_MORE: 'learn_more',
    DISMISS_ALERT: 'dismiss_alert',
    DELETED_TO_BE_RETIRED_COURSE: 'deleted_to_be_retired_course',
    SHOW_COURSE_DETAILS: 'show_course_details',
    ADDED_COURSE_ALTERNATIVE: 'added_course_alternative',
});

export const CONTENT_ITEM_TYPES = {
    COURSE: 'course',
    COURSE_SECTION: 'course_section',
    ASSESSMENT: 'assessment',
    LAB: 'lab',
    LINK: 'link',
};
