export const BASE_PATH = '/learning-paths/';

export const LEARNING_PATH_ASSIGNABLE_TYPE = 'learning_path';

export const LEARNING_PATH_TITLE_PLACEHOLDER = Object.freeze({
    get TEXT() {
        return gettext('Path');
    },
});

export const UDEMY_PRO_LEARNING_PATH = Object.freeze({
    get TEXT() {
        return gettext('Udemy path');
    },
});

export const LEARNING_PATH = Object.freeze({
    get TEXT() {
        return gettext('Learning path');
    },
});

export const UPDATE_LEARNING_PATH = {
    get TEXT() {
        return gettext('Update learning path');
    },
};

export const UPDATE_LEARNING_PATH_BUTTON = {
    get TEXT() {
        return gettext('Update');
    },
};

export const LEARNING_PATH_MAX_SIZE = 255;
export const ERROR_DUPLICATE_TITLE = 'duplicate_title';
export const PRO_PATH_FAVICON = '/staticx/udemy/images/v8/favicon-32x32.png';

export const CHANGE_LOG_ACTION = Object.freeze({
    PATH_CREATED: 'created',
    PATH_TITLE: 'edited_title',
    PATH_DESCRIPTION: 'edited_description',
    PATH_PUBLIC: 'set_to_public',
    PATH_PRIVATE: 'set_to_private',

    SECTION_ADD: 'added_section',
    SECTION_DELETE: 'delete_section',
    SECTION_TITLE: 'changed_section_title',
    SECTION_DESCRIPTION: 'changed_section_note',

    ITEM_ADD_LINK: 'added_link',
    ITEM_ADD_COURSE: 'added_course',
    ITEM_ADD_ASSESSMENT: 'added_assessment',
    ITEM_ADD_LAB: 'added_lab',
    ITEM_DELETE_LINK: 'delete_link',
    ITEM_DELETE_COURSE: 'delete_course',
    ITEM_DELETE_ASSESSMENT: 'delete_assessment',
    ITEM_DELETE_LAB: 'delete_lab',
    ITEM_COURSE_NOTE: 'changed_course_note',
    ITEM_ASSESSMENT_NOTE: 'changed_assessment_note',
    ITEM_LAB_NOTE: 'changed_lab_note',
    ITEM_LINK_NOTE: 'changed_link_note',
    ITEM_LINK_DURATION: 'changed_link_duration',
    ITEM_ADD_COURSE_PORTION: 'selected_course_content',

    REORDER_SECTION: 'reordered_section',
    REORDER_LINK: 'reordered_link',
    REORDER_COURSE: 'reordered_course',
    REORDER_ASSESSMENT: 'reordered_assessment',
    REORDER_LAB: 'reordered_lab',

    EDITOR_ADD: 'added_editor',
    EDITOR_REMOVE: 'removed_editor',
    EDITOR_FEATURED: 'made_featured_editor',
    EDITOR_FEATURED_SYSTEM: 'made_featured_editor_system',
    EDITOR_JOIN: 'joined_as_editor',

    COURSE_REMOVED: 'course_removed',
    COURSE_READDED: 'course_readded',
});

export const CHANGE_LOG_TEXT = Object.freeze({
    get [CHANGE_LOG_ACTION.PATH_CREATED]() {
        return gettext('%(user_name)s created the path');
    },
    get [CHANGE_LOG_ACTION.PATH_TITLE]() {
        return gettext('%(user_name)s changed the path title');
    },
    get [CHANGE_LOG_ACTION.PATH_DESCRIPTION]() {
        return gettext('%(user_name)s changed the path description');
    },
    get [CHANGE_LOG_ACTION.PATH_PUBLIC]() {
        return gettext('%(user_name)s set the path to public');
    },
    get [CHANGE_LOG_ACTION.PATH_PRIVATE]() {
        return gettext('%(user_name)s set the path to private');
    },
    get [CHANGE_LOG_ACTION.SECTION_ADD]() {
        return gettext('%(user_name)s added a section heading');
    },
    get [CHANGE_LOG_ACTION.SECTION_DELETE]() {
        return gettext('%(user_name)s deleted a section heading');
    },
    get [CHANGE_LOG_ACTION.SECTION_TITLE]() {
        return gettext('%(user_name)s changed a section title');
    },
    get [CHANGE_LOG_ACTION.SECTION_DESCRIPTION]() {
        return gettext('%(user_name)s changed a section note');
    },
    get [CHANGE_LOG_ACTION.ITEM_ADD_LINK]() {
        return gettext('%(user_name)s added a link');
    },
    get [CHANGE_LOG_ACTION.ITEM_ADD_COURSE]() {
        return gettext('%(user_name)s added the course %(course)s');
    },
    get [CHANGE_LOG_ACTION.ITEM_ADD_ASSESSMENT]() {
        return gettext('%(user_name)s added the assessment %(assessment)s');
    },
    get [CHANGE_LOG_ACTION.ITEM_ADD_LAB]() {
        return gettext('%(user_name)s added the lab %(lab)s');
    },
    get [CHANGE_LOG_ACTION.ITEM_DELETE_LINK]() {
        return gettext('%(user_name)s deleted a link');
    },
    get [CHANGE_LOG_ACTION.ITEM_DELETE_COURSE]() {
        return gettext('%(user_name)s deleted the course %(course)s');
    },
    get [CHANGE_LOG_ACTION.ITEM_DELETE_ASSESSMENT]() {
        return gettext('%(user_name)s deleted the assessment %(assessment)s');
    },
    get [CHANGE_LOG_ACTION.ITEM_DELETE_LAB]() {
        return gettext('%(user_name)s deleted the lab %(lab)s');
    },
    get [CHANGE_LOG_ACTION.ITEM_COURSE_NOTE]() {
        return gettext('%(user_name)s changed the note on %(course)s');
    },
    get [CHANGE_LOG_ACTION.ITEM_ASSESSMENT_NOTE]() {
        return gettext('%(user_name)s changed the note on %(assessment)s');
    },
    get [CHANGE_LOG_ACTION.ITEM_LAB_NOTE]() {
        return gettext('%(user_name)s changed the note on %(lab)s');
    },
    get [CHANGE_LOG_ACTION.ITEM_LINK_NOTE]() {
        return gettext('%(user_name)s changed the note on a link');
    },
    get [CHANGE_LOG_ACTION.ITEM_LINK_DURATION]() {
        return gettext('%(user_name)s changed the duration of a link');
    },
    get [CHANGE_LOG_ACTION.ITEM_ADD_COURSE_PORTION]() {
        return gettext('%(user_name)s selected course content for %(course)s');
    },
    get [CHANGE_LOG_ACTION.REORDER_SECTION]() {
        return gettext('%(user_name)s reordered a section');
    },
    get [CHANGE_LOG_ACTION.REORDER_LINK]() {
        return gettext('%(user_name)s reordered a link');
    },
    get [CHANGE_LOG_ACTION.REORDER_COURSE]() {
        return gettext('%(user_name)s reordered course %(course)s');
    },
    get [CHANGE_LOG_ACTION.REORDER_ASSESSMENT]() {
        return gettext('%(user_name)s reordered assessment %(assessment)s');
    },
    get [CHANGE_LOG_ACTION.REORDER_LAB]() {
        return gettext('%(user_name)s reordered lab %(lab)s');
    },
    get [CHANGE_LOG_ACTION.EDITOR_ADD]() {
        return gettext('%(user_name)s added %(new_editor)s as an editor');
    },
    get [CHANGE_LOG_ACTION.EDITOR_REMOVE]() {
        return gettext('%(user_name)s removed %(new_editor)s as an editor');
    },
    get [CHANGE_LOG_ACTION.EDITOR_FEATURED]() {
        return gettext('%(user_name)s made %(new_editor)s the featured editor');
    },
    get [CHANGE_LOG_ACTION.EDITOR_FEATURED_SYSTEM]() {
        return gettext('%(new_editor)s was made the featured editor');
    },
    get [CHANGE_LOG_ACTION.EDITOR_JOIN]() {
        return gettext('%(user_name)s joined as an editor');
    },
    get [CHANGE_LOG_ACTION.COURSE_REMOVED]() {
        return gettext('%(course)s was removed as it is no longer available in your account');
    },
    get [CHANGE_LOG_ACTION.COURSE_READDED]() {
        return gettext('%(course)s was re-added as it is now available in your account again');
    },
});

export const EDITABLE_TYPES = Object.freeze({
    TEXT: 'text',
    NUMBER: 'number',
});
