export const TRACKING_ACTIONS = Object.freeze({
    AUTOPLAY_TOGGLE: 'autoplay_toggle',
});

export const VIDEO_PROGRESS_BATCH_COUNT = 5;

export const VIDEO_PROGRESS_INTERVAL = 15;

export const VIDEO_START_OFFSET_WINDOW = 2 * VIDEO_PROGRESS_INTERVAL;

export const VIDEO_COMPLETION_OFFSET = 15; // mark video as completed 15s from the end

export const HOTKEYS = Object.freeze({
    SHOW_MENU: '?',
    PLAY_PAUSE: 'space',
    SLOWER: 'shift+left',
    FASTER: 'shift+right',
    TOGGLE_FULLSCREEN: 'f',
    EXIT_FULLSCREEN: 'escape',
    ADD_BOOKMARK: 'b',
    BACK: 'left',
    FORWARD: 'right',
    VOLUME_UP: 'up',
    VOLUME_DOWN: 'down',
    MUTE: 'm',
    SHOW_CONTENT_INFO: 'i',
    ACTIVATE_CC: 'c',
});

export const UB_MT_CAPTIONS_SURVEY_EXCLUDED_ORGS = [35564, 33930];

// used to request survey after consuming this minimum amount of video
export const CAPTIONS_SURVEY_MINIMUM_CONSUMPTION_THRESHOLD = 150;
