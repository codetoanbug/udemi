export const ERROR_TYPES = {
    SAVING: 'SAVING',
    PARSING: 'PARSING',
    LOADING: 'LOADING',
};

export const ERROR_ACTIONS = {
    DISCARD: 'DISCARD',
    EXIT: 'EXIT',
    EXIT_WITHOUT_SAVING: 'EXIT_WITHOUT_SAVING',
};

export const ERRORS = {
    [ERROR_TYPES.LOADING]: {
        type: ERROR_TYPES.LOADING,
        title: gettext('Video Loading Error'),
        text: gettext(
            'The Caption Editor could not load the associated video. ' +
                'To resolve this issue, please re-upload the video from the Curriculum page.',
        ),
        actions: [ERROR_ACTIONS.EXIT],
    },
    [ERROR_TYPES.PARSING]: {
        type: ERROR_TYPES.PARSING,
        title: gettext('Caption Loading Error'),
        text: gettext(
            ' The Caption Editor could not open this caption file. To resolve this issue, please re-upload the caption file.',
        ),
        actions: [ERROR_ACTIONS.EXIT],
    },
    [ERROR_TYPES.SAVING]: {
        type: ERROR_TYPES.SAVING,
        title: gettext('Saving Error'),
        text: gettext(
            'An error occurred and your changes could not be saved. If you continue to have issues saving changes, please ' +
                'contact support <a href="https://support.udemy.com/hc/en-us/requests/new?type=instructor" target="_blank"}>here</a>.',
        ),
        actions: [ERROR_ACTIONS.EXIT_WITHOUT_SAVING, ERROR_ACTIONS.DISCARD],
    },
};

export const ASSET_REQUEST_FIELDS = {
    'fields[asset]': 'id,title,captions,media_license_token,media_sources,thumbnail_sprite',
    'fields[caption]': '@default,confidence_threshold',
};

export const MONITORING_EVENTS = Object.freeze({
    ERROR: 'caption_editor.error',
});

export const CAPTION_EDIT_ACTIONS = Object.freeze({
    CUE_CONTENT_CHANGE: 'cue.change.content',
    CUE_SELECT: 'cue.select',
    QUIT_EDITING: 'quit',
    QUIT_WITHOUT_SAVING: 'quit-unsaved-changes',
    SAVE_CAPTIONS: 'save',
});

export const LOW_CAPTION_QUALITY_MESSAGE = {
    id: 'low_caption_quality',
    title: gettext(
        'These captions have been auto-generated and may have a significant amount of errors.',
    ),
    body: gettext('Please review the captions and fix any errors.'),
};

export const LOW_CONFIDENCE_THRESHOLD = 0.43;
