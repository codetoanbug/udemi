import {MEDIA_ERR_ENCRYPTED} from './videojs-setup/constants';

export const AUTO_RESOLUTION_LABEL = 'auto';

export const DEFAULT_RESOLUTION_LABEL = AUTO_RESOLUTION_LABEL;
export const DEFAULT_ACTIVITY_TIMEOUT = 2000;

export const CONTROL_BAR_MENUS = Object.freeze({
    NONE: 'none',
    PLAYBACK_RATE: 'playback-rate',
    CAPTIONS: 'captions',
    SETTINGS: 'settings',
});

export const SEEK_INTERVAL = 5; // 5 seconds

export const HOTKEY_ACTIONS = Object.freeze({
    PLAY_PAUSE: 'play-pause',
    SEEK_BACK: 'seek-back',
    SEEK_FORWARD: 'seek-forward',
    SPEED_DOWN: 'speed-down',
    SPEED_UP: 'speed-up',
    VOLUME_DOWN: 'volume-down',
    VOLUME_UP: 'volume-up',
    TOGGLE_FULLSCREEN: 'fullscreen',
    TOGGLE_MUTE: 'mute',
});

export const PLAY_STATE_SYNC_INTERVAL = 100; // 100ms.

export const NATIVE_CONTROL_SYNC_GRACE_PERIOD = 100; // 100ms.

export const HLS_MIME_TYPE = 'application/x-mpegURL';
export const DASH_MIME_TYPE = 'application/dash+xml';

export const VideoPlayerErrors = Object.freeze({
    CANNOT_ACCESS_MEDIA_SOURCE: 100,
    CANNOT_RETRIEVE_DRM_LICENSE: 101,
});

export const VideoPlayerErrorLookup = Object.freeze({
    [MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED]: VideoPlayerErrors.CANNOT_ACCESS_MEDIA_SOURCE,
    [MEDIA_ERR_ENCRYPTED]: VideoPlayerErrors.CANNOT_RETRIEVE_DRM_LICENSE,
});

export const VIDEO_JS_CONFIG = Object.freeze({
    plugins: {},
    inactivityTimeout: DEFAULT_ACTIVITY_TIMEOUT,
    children: [
        'mediaLoader', // figures out the tech, nothing is rendered
    ],
});
