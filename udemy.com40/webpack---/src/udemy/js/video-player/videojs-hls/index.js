import autobind from 'autobind-decorator';
import HlsJs from 'hls.js/dist/hls.light';
import Cookies from 'js-cookie';
import videojs from 'video.js';

import {VideoPlayerErrors} from '../constants';
import {
    HLS_JS_AUTO_LEVEL,
    HLS_JS_START_LEVEL_DEFAULT,
    HLS_JS_START_LEVEL_COOKIE_KEY,
} from './constants';

/**
 * This plugin integrates the library hls.js to Video.js.
 *
 * Used as a reference:
 *   - https://github.com/streamroot/videojs-hlsjs-plugin/
 *   - https://github.com/videojs/videojs-contrib-dash/
 *
 * IMPORTANT: this class handles only HLS videos without DRM support!
 */
class Html5HlsJs {
    constructor(source, tech, options) {
        this._tech = tech;
        this._mediaElement = tech.el();

        this.player = this.createVideoJsInstance(options.playerId);
        this.player.hls = this.createHlsJsInstance(this.player, this._mediaElement, source);

        this.player.on('dispose', this.dispose);
        this._qualityLevelEnabledStates = {};
    }

    createVideoJsInstance(playerId) {
        return videojs(playerId);
    }

    createHlsJsInstance(player, mediaElement, source) {
        const hls = new HlsJs({startLevel: this.getStartLevel()});

        hls.on(HlsJs.Events.LEVEL_SWITCHED, (event, data) => {
            this.saveCurrentLevel(data.level);
            player.trigger('hlslevelswitch', {
                resolution: hls.levels[data.level].height,
            });
        });

        hls.on(HlsJs.Events.FRAG_LOADED, (event, data) => {
            player.trigger('hlsfragloaded', data.stats);
        });

        hls.on(HlsJs.Events.MANIFEST_PARSED, (event, data) => {
            this.addQualityLevels(data.levels);

            // NOTE: this is only for compatibility with `videojs/videojs-contrib-hls`
            player.trigger('loadedmetadata');
        });

        hls.on(HlsJs.Events.ERROR, this.onError);

        hls.attachMedia(mediaElement);
        hls.loadSource(source.src);

        return hls;
    }

    getStartLevel() {
        const cookieStartLevel = Cookies.get(HLS_JS_START_LEVEL_COOKIE_KEY);
        return cookieStartLevel !== undefined ? cookieStartLevel : HLS_JS_START_LEVEL_DEFAULT;
    }

    saveCurrentLevel(currentLevel) {
        Cookies.set(HLS_JS_START_LEVEL_COOKIE_KEY, currentLevel);
    }

    updateQualityLevel(index) {
        const currentSelectedIndex = this.player.qualityLevels().selectedIndex;
        if (currentSelectedIndex !== index) {
            this.player.qualityLevels().selectedIndex_ = index;
            this.player.hls.currentLevel = index;

            // Simulate the events `seeking` and `seeked` for compatibility
            this.player.trigger('seeking');

            this.player.hls.once(HlsJs.Events.FRAG_LOADED, () => {
                this.player.trigger('seeked');
            });
        }
    }

    qualityLevelEnabledChange() {
        const enabledQualityLevels = Array.prototype.filter.call(
            this.player.qualityLevels(),
            (qualityLevel) => qualityLevel.enabled,
        );

        // Sometimes we can have no quality levels enabled while the enabled levels are being
        // updated by the video-player store. The store method _updateEnabledQualityLevels loops
        // through the quality levels updating their enabled state one by one.
        // Do not update anything until we have an enabled level
        if (enabledQualityLevels.length === 0) {
            return;
        }

        const isAuto = enabledQualityLevels.length === this.player.qualityLevels().length;
        if (isAuto) {
            this.updateQualityLevel(HLS_JS_AUTO_LEVEL);
            return;
        }

        // If we are not in auto mode we will pick the enabled quality level with the largest height,
        // and if we have multiple quality levels with the same height we will pick the quality
        // level with the largest bitrate from that height.
        const sortedEnabledQualityLevels = enabledQualityLevels.sort((a, b) =>
            a.height === b.height ? b.bitrate - a.bitrate : b.height - a.height,
        );
        const highestEnabledLevel = sortedEnabledQualityLevels[0];
        this.updateQualityLevel(highestEnabledLevel.id);
    }

    qualityLevelEnabled(enabled, index) {
        if (typeof enabled === 'boolean') {
            // A boolean is received here when there is an attempt to change/set
            // the enabled disabled value of our quality levels
            this._qualityLevelEnabledStates[index] = enabled;
            this.qualityLevelEnabledChange();
            return;
        }

        return this._qualityLevelEnabledStates[index];
    }

    addQualityLevels(levels) {
        levels.forEach((level, index) => {
            this.player.qualityLevels().addQualityLevel({
                id: index,
                height: level.height,
                width: level.width,
                bandwidth: level.bitrate,
                enabled: (enabled) => this.qualityLevelEnabled(enabled, index),
            });
        });
    }

    @autobind
    dispose() {
        this.player.hls.destroy();
    }

    @autobind
    onError(event, error) {
        const playerError = this.buildPlayerError(error);

        // HlsJS considers all kinds of normal events errors, such as the buffer stalls,
        // so we only trigger Video.js errors on those that are fatal
        if (!playerError.fatal) {
            return;
        }

        this.dispose();

        this.player.error = () => playerError;
        this.player.trigger('error');
    }

    buildPlayerError(error) {
        const output = {
            message: `hlsjs ${error.type}: ${error.details}`,
            code: null,
            fatal: error.fatal,
            hlsjs: true,
        };

        switch (error.type) {
            case HlsJs.ErrorTypes.NETWORK_ERROR: {
                if (error.response?.code === 403) {
                    output.code = VideoPlayerErrors.CANNOT_ACCESS_MEDIA_SOURCE;
                } else {
                    output.code = MediaError.MEDIA_ERR_NETWORK;
                }
                break;
            }

            case HlsJs.ErrorTypes.MEDIA_ERROR: {
                output.code = MediaError.MEDIA_ERR_DECODE;
                break;
            }
        }

        return output;
    }
}

const requireKeySystems = function (source) {
    return typeof source.keySystems !== 'undefined';
};

videojs.HlsJsSourceHandler = function () {
    return {
        name: 'udemy-hlsjs',

        canHandleSource(source) {
            const hlsExtRE = /\.m3u8/i;

            // This class handles only HLS videos without DRM support!
            if (requireKeySystems(source)) {
                return '';
            }

            if (videojs.HlsJsSourceHandler.canPlayType(source.type)) {
                return 'probably';
            }

            if (hlsExtRE.test(source.src)) {
                return 'maybe';
            }

            return '';
        },

        handleSource(source, tech, options) {
            return new Html5HlsJs(source, tech, options);
        },

        canPlayType(type) {
            return videojs.HlsJsSourceHandler.canPlayType(type);
        },
    };
};

videojs.HlsJsSourceHandler.canPlayType = function (type) {
    const hlsTypeRE = /^application\/x-mpegURL|application\/vnd\.apple\.mpegurl$/i;

    if (hlsTypeRE.test(type)) {
        return 'probably';
    }

    return '';
};

// Only add the source handler if the browser supports the HTML5 Media Source Extensions
if (HlsJs.isSupported()) {
    videojs.getTech('Html5').registerSourceHandler(videojs.HlsJsSourceHandler(), 0);
}
