export const MENU_PAGES = Object.freeze({
    TRACKS: 'tracks',
    SETTINGS: 'settings',
    FONT_SIZE: 'fonts',
    OPACITY: 'opacity',
});

export const FONT_SIZES = Object.freeze([50, 75, 100, 150, 200]);

export const DEFAULT_FONT_SIZE = 100;

export const TRACK_OPACITY = Object.freeze([0, 25, 50, 75, 100]);

export const DEFAULT_TRACK_OPACITY = 75;

export const DEFAULT_WELL_ENABLED = false;

export const USER_PREFERENCES_STORAGE_KEY = 'captionsettings';

export const CAPTIONS_DISPLAY_DEFAULTS = {
    FONT_SIZE_DEFAULT: 24,
    FONT_SIZE_MIN: 15,
};

export const CAPTION_COOKIE_KEY = 'caption';

export const CAPTION_MODE_CHANGE_TYPE = Object.freeze({
    ON: 'on',
    ON_AUTO: 'on_auto',
    ON_COOKIE: 'on_cookie',
    OFF: 'off',
});

export const TRACK_MODES = Object.freeze({
    ACTIVE: 'showing',
    INACTIVE: 'disabled',
    HIDDEN: 'hidden',
});
