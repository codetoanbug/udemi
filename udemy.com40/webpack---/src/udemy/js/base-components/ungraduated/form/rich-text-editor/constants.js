export const THEMES = {
    ANNOUNCEMENT: 'ANNOUNCEMENT',
    ARTICLE_LECTURE: 'ARTICLE_LECTURE',
    ASSESSMENT_EDITOR: 'ASSESSMENT_EDITOR',
    ASSIGNMENT: 'ASSIGNMENT',
    ASSIGNMENT_QUESTION: 'ASSIGNMENT_QUESTION',
    BOOKMARK: 'BOOKMARK',
    CREATE_LAB_EDITOR: 'CREATE_LAB_EDITOR',
    CODING_EXERCISE_INSTRUCTIONS: 'CODING_EXERCISE_INSTRUCTIONS',
    COURSE_DESCRIPTION: 'COURSE_DESCRIPTION',
    COURSE_MESSAGE: 'COURSE_MESSAGE',
    LECTURE_DESCRIPTION: 'LECTURE_DESCRIPTION',
    PRACTICE_TEST_DESCRIPTION: 'PRACTICE_TEST_DESCRIPTION',
    PRACTICE_TEST_QUESTION: 'PRACTICE_TEST_QUESTION',
    PRACTICE_TEST_QUESTION_EXPLANATION: 'PRACTICE_TEST_QUESTION_EXPLANATION',
    MESSAGE: 'MESSAGE',
    ORGANIZATION_CUSTOM_ERROR_MESSAGE: 'ORGANIZATION_CUSTOM_ERROR_MESSAGE',
    Q_AND_A: 'Q_AND_A',
    Q_AND_A_EDIT: 'Q_AND_A_EDIT',
    QUIZ_ANSWER: 'QUIZ_ANSWER',
    QUIZ_DESCRIPTION: 'QUIZ_DESCRIPTION',
    QUIZ_QUESTION: 'QUIZ_QUESTION',
    SIMPLE: 'SIMPLE',
    TEST_VIDEO: 'TEST_VIDEO',
    USER_DESCRIPTION: 'USER_DESCRIPTION',
    FEATURED_QUESTIONS: 'FEATURED_QUESTIONS',
    PLAN_EDITOR: 'PLAN_EDITOR',
};

export const TEXT_ONLY_FEATURES = new Set(['UNDO', 'REDO']);

export const BASE_WYSIWYG_FEATURES = new Set([
    'UNDO',
    'REDO',
    'UNDO_FORMAT',
    'ADD_HARD_BREAK',
    'ADD_NON_BREAKING_SPACE',
    'TOGGLE_STRONG',
    'TOGGLE_EM',
]);

export const BLOCK_FORMAT_FEATURES = new Set([
    'SET_PARAGRAPH',
    'TOGGLE_BLOCKQUOTE',
    'TOGGLE_HEADING',
    'EXIT_FIRST_BLOCK',
    'EXIT_LAST_BLOCK',
]);

export const ANCHOR_FEATURES = new Set(['PROMPT_ANCHOR', 'ADD_ANCHOR', 'UNDO_ANCHOR']);

export const IMAGE_FEATURES = new Set([
    'PROMPT_IMAGE_UPLOAD',
    'PROMPT_IMAGE_EDIT',
    'ADD_IMAGE',
    'EDIT_IMAGE',
    'CLICK_IMAGE',
    'RESIZE_IMAGE',
    'DELETE_FIGURE',
    'DELETE_IMAGE',
    'EXIT_FIGURE',
    'ARROW_UP_NEAR_IMAGE',
    'ARROW_LEFT_NEAR_IMAGE',
    'ARROW_DOWN_NEAR_IMAGE',
    'ARROW_RIGHT_NEAR_IMAGE',
]);

export const MATH_FEATURES = new Set([
    'PROMPT_MATH_INSERT',
    'PROMPT_MATH_EDIT',
    'ADD_MATH',
    'CLICK_MATH',
    'DELETE_MATH',
]);

export const LIST_FEATURES = new Set([
    'WRAP_ORDERED_LIST',
    'TOGGLE_ORDERED_LIST',
    'WRAP_BULLET_LIST',
    'TOGGLE_BULLET_LIST',
    'LIFT_LIST_ITEM',
    'SINK_LIST_ITEM',
    'SPLIT_LIST_ITEM',
]);

export const CODE_FEATURES = new Set([
    'TOGGLE_CODE',
    'EXIT_FIRST_BLOCK',
    'EXIT_LAST_BLOCK',
    'CONVERT_TAB_TO_SPACES',
]);

export const SKIP_FOCUS_FEATURES = new Set([
    'PROMPT_ANCHOR',
    'PROMPT_IMAGE_UPLOAD',
    'TOGGLE_HTML_MODE',
]);

// Maps theme to the set (i.e. order does not matter) of features enabled for the theme.
// Features are referenced elsewhere, i.e. in build-commands.js. If two things do the same thing,
// they should have the same feature. E.g. the 'TOGGLE_STRONG' feature represents the menu item
// that toggles strong text on click, the hotkey that toggles strong text on keypress,
// and the actual command that toggles strong text.
export const FEATURES = {
    [THEMES.ANNOUNCEMENT]: new Set([
        ...BASE_WYSIWYG_FEATURES,
        ...ANCHOR_FEATURES,
        ...IMAGE_FEATURES,
        ...LIST_FEATURES,
    ]),
    [THEMES.ARTICLE_LECTURE]: new Set([
        ...BASE_WYSIWYG_FEATURES,
        ...ANCHOR_FEATURES,
        ...BLOCK_FORMAT_FEATURES,
        ...CODE_FEATURES,
        ...IMAGE_FEATURES,
        ...LIST_FEATURES,
        'TOGGLE_HTML_MODE',
    ]),
    [THEMES.ASSESSMENT_EDITOR]: new Set([
        ...BASE_WYSIWYG_FEATURES,
        ...CODE_FEATURES,
        ...LIST_FEATURES,
        ...IMAGE_FEATURES,
        ...MATH_FEATURES,
        'TOGGLE_HTML_MODE',
    ]),
    [THEMES.ASSIGNMENT]: new Set([
        ...BASE_WYSIWYG_FEATURES,
        ...ANCHOR_FEATURES,
        ...BLOCK_FORMAT_FEATURES,
        ...CODE_FEATURES,
        ...IMAGE_FEATURES,
        ...LIST_FEATURES,
        'TOGGLE_HTML_MODE',
    ]),
    [THEMES.ASSIGNMENT_QUESTION]: BASE_WYSIWYG_FEATURES,
    [THEMES.BOOKMARK]: new Set([
        ...BASE_WYSIWYG_FEATURES,
        ...BLOCK_FORMAT_FEATURES,
        ...CODE_FEATURES,
        ...LIST_FEATURES,
    ]),
    [THEMES.CREATE_LAB_EDITOR]: new Set([
        ...BASE_WYSIWYG_FEATURES,
        ...BLOCK_FORMAT_FEATURES,
        ...ANCHOR_FEATURES,
        ...CODE_FEATURES,
        ...IMAGE_FEATURES,
        ...LIST_FEATURES,
        'TOGGLE_HTML_MODE',
    ]),
    [THEMES.CODING_EXERCISE_INSTRUCTIONS]: new Set([
        ...BASE_WYSIWYG_FEATURES,
        ...ANCHOR_FEATURES,
        ...CODE_FEATURES,
        ...IMAGE_FEATURES,
        ...LIST_FEATURES,
    ]),
    [THEMES.COURSE_DESCRIPTION]: new Set([...BASE_WYSIWYG_FEATURES, ...LIST_FEATURES]),
    [THEMES.COURSE_MESSAGE]: new Set([
        ...BASE_WYSIWYG_FEATURES,
        ...IMAGE_FEATURES,
        ...LIST_FEATURES,
        ...CODE_FEATURES,
    ]),
    [THEMES.ORGANIZATION_CUSTOM_ERROR_MESSAGE]: new Set([
        ...BASE_WYSIWYG_FEATURES,
        ...ANCHOR_FEATURES,
    ]),
    [THEMES.LECTURE_DESCRIPTION]: new Set([...BASE_WYSIWYG_FEATURES, ...LIST_FEATURES]),
    [THEMES.PRACTICE_TEST_DESCRIPTION]: new Set([
        ...BASE_WYSIWYG_FEATURES,
        ...ANCHOR_FEATURES,
        ...CODE_FEATURES,
        ...IMAGE_FEATURES,
        ...LIST_FEATURES,
    ]),
    [THEMES.PRACTICE_TEST_QUESTION]: new Set([
        ...BASE_WYSIWYG_FEATURES,
        ...CODE_FEATURES,
        ...IMAGE_FEATURES,
        ...LIST_FEATURES,
    ]),
    [THEMES.PRACTICE_TEST_QUESTION_EXPLANATION]: new Set([
        ...BASE_WYSIWYG_FEATURES,
        ...ANCHOR_FEATURES,
        ...CODE_FEATURES,
        ...IMAGE_FEATURES,
        ...LIST_FEATURES,
    ]),
    [THEMES.MESSAGE]: new Set([...BASE_WYSIWYG_FEATURES, ...CODE_FEATURES, ...IMAGE_FEATURES]),
    [THEMES.Q_AND_A]: new Set([
        ...BASE_WYSIWYG_FEATURES,
        ...ANCHOR_FEATURES,
        ...CODE_FEATURES,
        ...IMAGE_FEATURES,
    ]),
    [THEMES.Q_AND_A_EDIT]: new Set([
        ...BASE_WYSIWYG_FEATURES,
        ...ANCHOR_FEATURES,
        ...CODE_FEATURES,
        ...IMAGE_FEATURES,
        'TOGGLE_HTML_MODE',
    ]),
    [THEMES.QUIZ_ANSWER]: new Set([...BASE_WYSIWYG_FEATURES, ...CODE_FEATURES]),
    [THEMES.QUIZ_DESCRIPTION]: BASE_WYSIWYG_FEATURES,
    [THEMES.QUIZ_QUESTION]: new Set([
        ...BASE_WYSIWYG_FEATURES,
        ...CODE_FEATURES,
        ...IMAGE_FEATURES,
    ]),
    [THEMES.SIMPLE]: BASE_WYSIWYG_FEATURES,
    [THEMES.TEST_VIDEO]: new Set([
        ...BASE_WYSIWYG_FEATURES,
        ...ANCHOR_FEATURES,
        ...IMAGE_FEATURES,
        ...LIST_FEATURES,
    ]),
    [THEMES.USER_DESCRIPTION]: BASE_WYSIWYG_FEATURES,
    [THEMES.FEATURED_QUESTIONS]: new Set([
        ...BASE_WYSIWYG_FEATURES,
        ...ANCHOR_FEATURES,
        ...CODE_FEATURES,
        ...IMAGE_FEATURES,
        ...LIST_FEATURES,
    ]),
    [THEMES.PLAN_EDITOR]: new Set([
        ...BASE_WYSIWYG_FEATURES,
        ...ANCHOR_FEATURES,
        ...BLOCK_FORMAT_FEATURES,
        ...CODE_FEATURES,
        ...IMAGE_FEATURES,
        ...LIST_FEATURES,
    ]),
};

// ProseMirror documents can never be completely empty. The smallest doc is
// <p></p> (rendered as <p><br></p>), with a size of 2.
export const EMPTY_DOC_SIZE = 2;

// We currently only support one heading level. h1 - h6 are all rendered as h4.
export const HEADING_LEVEL = 4;

export const MB = 1024 * 1024;
export const MAX_FILE_SIZE_IN_MB = 30;
export const MAX_FILE_SIZE_IN_BYTES = MAX_FILE_SIZE_IN_MB * MB;
