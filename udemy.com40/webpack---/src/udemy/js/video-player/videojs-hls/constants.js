// startLevel is the index of the submanifest sorted from lowest resolution to highest
// we don't know how many submanifests we will have, but we want the player to try the best resolution first
// hls.js makes sure this is not out of bounds
export const HLS_JS_START_LEVEL_DEFAULT = 0;

export const HLS_JS_START_LEVEL_COOKIE_KEY = 'hlsJsStartLevel';

export const HLS_JS_AUTO_LEVEL = -1;
