import './pre'; // Make sure this is imported before video.js!
import videojs from 'video.js';
import 'videojs-contrib-eme';
import 'videojs-contrib-quality-levels';
import 'videojs-mux';

import udLink from 'utils/ud-link';

import '../videojs-hls';
import './udemy-patches';
import './bandwidth-watermark';
import {patchHttpStreamingSourceHandlers} from './drm';

/**
 * Internal object used for mocking Video.j during testing.
 */
export const internals = {
    videojs,
};

/**
 * Creates the Video.js instance used by the video player MobX store.
 */
export const createVideoJsInstance = async function (mediaElement, options) {
    // This patch forces the videojs/http-streaming's source handler to play only DRM videos
    await patchHttpStreamingSourceHandlers(videojs);

    options = {
        ...options,
        // NOTE: without this line Video.js 6.12 will include the vtt.js library directly from the official CDN.
        'vtt.js': udLink.toJs('node_modules/videojs-vtt.js/dist/vtt.min.js'),
    };

    const player = internals.videojs(mediaElement, options);
    player.videojsVersion = videojs.VERSION;

    // Initialize the HTML Encrypted Media Extensions (EME) plugin
    player.eme();

    // Initialize the Udemy Patches
    player.udemypatches();

    return player;
};
