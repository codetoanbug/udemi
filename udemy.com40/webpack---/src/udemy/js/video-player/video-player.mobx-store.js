import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import axios from 'axios';
import {action, computed, observable, reaction} from 'mobx';
import uuidv4 from 'uuid/v4';

import BrowserLogger from 'utils/browser-log-collection';

import {
    AUTO_RESOLUTION_LABEL,
    DASH_MIME_TYPE,
    DEFAULT_RESOLUTION_LABEL,
    HLS_MIME_TYPE,
    SEEK_INTERVAL,
} from './constants';
import {AdaptiveStreamingQualityChangeEvent} from './events';
import {getCDNFromUrl, videoPlayerEventData, videoPlayerErrorData} from './helpers';
import PlaybackRateStore from './playback-rate/playback-rate.mobx-store';
import {RESOLUTION_SETTING} from './settings-menu/constants';
import {saveSetting, loadSetting} from './user-settings';
import {parsedUserAgent} from './utils';
import {buildKeySystemsConfig, trackPlayerDRMPerformance} from './videojs-setup/drm';
import {createVideoJsInstance} from './videojs-setup/setup';
import VolumeStore from './volume/volume.mobx-store';

const IntegerResolutionLabel = new RegExp(/^[0-9]+$/);
const ResolutionDisplayLabelLookUp = {
    [AUTO_RESOLUTION_LABEL]: 'Auto',
    audio: 'Audio',
};

const browserLogger = new BrowserLogger('videoplayer');

export default class VideoPlayerStore {
    _videoPlayer = null;
    videoElement;
    playerId = null;
    videojsSetupData = {};
    numErrors = 0;
    numPlaylistRetries = 0;
    position = -1;
    lastPosition = -1;
    waitingToLoad = false;

    @observable isSeeking = false;
    @observable isSourceReady = false;
    @observable currentTime = 0;
    @observable isErrorVisible = false;
    @observable errorBody = '';
    @observable errorFooter = '';
    @observable duration;
    @observable playerHeight;

    @observable.ref mediaSources;
    @observable mediaLicenseToken;
    currentResolutionSources;

    @observable hlsResolution;
    @observable selectedResolutionLabel;
    @observable.ref adaptiveQualityLevels;

    // tracking stuff
    bandwidthWatermarks = {};

    constructor(
        videojsSetupData,
        playerId,
        duration,
        trackingTag,
        assetId,
        onVideoProgress,
        videoProgressInterval,
        onTimeUpdate,
        isDefaultMuted,
        prioritizeDefaultMuted,
    ) {
        this.sessionId = uuidv4();
        this.playbackRateStore = new PlaybackRateStore();
        this.volumeStore = new VolumeStore(isDefaultMuted, prioritizeDefaultMuted);
        this.videojsSetupData = videojsSetupData;
        this.playerId = playerId;
        this.trackingTag = trackingTag;
        this.assetId = assetId;
        this.onVideoProgress = onVideoProgress;
        this.videoProgressInterval = videoProgressInterval;
        this.onTimeUpdate = onTimeUpdate;

        this.setDuration(duration);
    }

    @action
    setMediaSources(mediaSources, mediaLicenseToken = undefined) {
        this.mediaSources = mediaSources;
        this.mediaLicenseToken = mediaLicenseToken;
    }

    @action
    showError(error) {
        this.errorBody = (error && error.body) || '';
        this.errorFooter = (error && error.footer) || '';
        this.isErrorVisible = true;
    }

    @autobind
    @action
    hideError() {
        this.errorBody = '';
        this.errorFooter = '';
        this.isErrorVisible = false;
    }

    async createVideoPlayer(videoElement) {
        this.videoElement = videoElement;
        this._useNativeControlsForMobile();

        this._videoPlayer = await createVideoJsInstance(this.videoElement, this.videojsSetupData);

        reaction(
            () => JSON.stringify(this.activeResolution),
            () =>
                this._updatePlayerResolution(
                    this.activeResolution.sources,
                    this.currentResolutionSources,
                ),
            {fireImmediately: true},
        );

        this._videoPlayer.ready(() => {
            this.playbackRateStore.setup(this._videoPlayer);
            this.volumeStore.setup(this._videoPlayer);
        });

        this._videoPlayer.on('durationchange', () => {
            const duration = this._videoPlayer.duration();
            if (duration) {
                this.setDuration(duration);
            }
        });

        // hls events
        this._videoPlayer.on('onbandwidthwatermarkupdate', (e, data) => {
            this.bandwidthWatermarks = data.bandwidthWatermarks;
        });
        this._videoPlayer.on('hlslevelswitch', this._onHlsLevelSwitch);

        this._videoPlayer.on('loadedmetadata', () => {
            if (this.supportsAdaptiveFixedResolutions) {
                this._setAdaptiveQualityLevels();
            }
        });

        trackPlayerDRMPerformance(this._videoPlayer);

        return this._videoPlayer;
    }

    _useNativeControlsForMobile() {
        if (parsedUserAgent.isMobile) {
            this.videojsSetupData.nativeControlsForTouch = true;
        }
    }

    @autobind
    _onHlsLevelSwitch(event, data) {
        this._setHlsResolution(data.resolution);
    }

    @autobind
    @action
    _setAdaptiveQualityLevels() {
        this.adaptiveQualityLevels = this._videoPlayer.qualityLevels();
    }

    _updateEnabledQualityLevels() {
        Array.prototype.forEach.call(this.adaptiveQualityLevels, (qualityLevel) => {
            qualityLevel.enabled =
                this.activeResolution.label === AUTO_RESOLUTION_LABEL ||
                qualityLevel.height == this.activeResolution.label;
        });
    }

    @computed
    get isAdaptive() {
        // If activeResolution is not yet initialised return nothing
        if (this.activeResolution) {
            return this.activeResolution.label === AUTO_RESOLUTION_LABEL;
        }
    }

    @autobind
    handleVideoProgress(event) {
        const position = Math.ceil(this.currentTime / this.videoProgressInterval);
        if (this.lastPosition === position || position <= 0) {
            return;
        }
        this.lastPosition = position;
        // At the end of the video, just use the video duration,
        // otherwise use the smaller out of the duration and the interval 'bucket'.
        const time =
            event.type === 'ended'
                ? this.duration
                : Math.min(position * this.videoProgressInterval, this.duration);
        const progressData = {
            total: Math.floor(this.duration),
            position: Math.floor(time),
        };
        this.onVideoProgress(event, progressData);
    }

    @autobind
    @action
    handleTimeUpdate() {
        this.currentTime = this._videoPlayer.currentTime();
        this.onTimeUpdate(this.currentTime);
    }

    handleVideoError(error) {
        if (error.code === undefined) {
            // This sometimes happens the first time the page is loaded.
            // The _error handler is triggered, but there is no Video.js error.
            return;
        }

        // User aborted loading, no need to do anything about it
        if (error.code === MediaError.MEDIA_ERR_ABORTED) {
            return;
        }

        // Check if we should retry.
        const retryLimit = 5;
        const shouldRetry = this.numErrors < retryLimit && this.numPlaylistRetries <= 2;

        if (shouldRetry && error.code === MediaError.MEDIA_ERR_NETWORK) {
            // The connection sucks. Retry.
            this._retry(error);
        } else if (shouldRetry && error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
            // Either the connection sucks or source is unsupported. Retry.
            this._retry(error);
        } else {
            this.showError(
                error.message
                    ? {
                          body: error.message.errorBody,
                          footer: error.message.errorFooter,
                      }
                    : null,
            );
            if (this.numPlaylistRetries > 2) {
                // In this case the Videojs-contrib-eme will try to retrieve the
                // Encrypted media sources indefinitely causing infinite requests
                // to our CDNs, so we have to remove the eme tech.
                this._videoPlayer.unloadTech_('eme');
            }
            this._logErrorWithHttpStatus(error);
        }
    }

    @computed
    get adaptiveSourceTypes() {
        return [HLS_MIME_TYPE, DASH_MIME_TYPE];
    }

    @computed
    get adaptiveSources() {
        return this.mediaSources
            .filter((source) => this.adaptiveSourceTypes.includes(source.type))
            .map(({type, src}) => {
                if (this.mediaLicenseToken) {
                    return {type, src, keySystems: buildKeySystemsConfig(this.mediaLicenseToken)};
                }
                return {type, src};
            });
    }

    @computed
    get supportsMSE() {
        if (window.MediaSource || window.WebKitMediaSource) {
            return true;
        }
        for (const adaptiveSourceType of this.adaptiveSourceTypes) {
            if (this._videoPlayer.el().firstChild.canPlayType(adaptiveSourceType)) {
                return true;
            }
        }
        return false;
    }

    @computed
    get supportsAdaptiveFixedResolutions() {
        return this.adaptiveSources.length && this.supportsMSE;
    }

    @computed
    get adaptiveResolutions() {
        const autoResolution = {
            auto: {
                label: AUTO_RESOLUTION_LABEL,
                displayLabel: this._getResolutionDisplayLabel({label: AUTO_RESOLUTION_LABEL}),
                sources: this.adaptiveSources,
            },
        };

        return Array.prototype.reduce.call(
            this.adaptiveQualityLevels,
            (adaptiveResolutions, qualityLevel) => {
                if (typeof adaptiveResolutions[qualityLevel.height] === 'undefined') {
                    adaptiveResolutions[qualityLevel.height] = {
                        label: qualityLevel.height.toString(),
                        displayLabel: this._getResolutionDisplayLabel({label: qualityLevel.height}),
                        sources: this.adaptiveSources,
                    };
                }
                return adaptiveResolutions;
            },
            autoResolution,
        );
    }

    /**
     * Normalizes the video sources into a dictionary-like format.
     *
     *   i.e.
     *
     *     [
     *       {"type": "video/mp4", "label": "1080", "file": "<URL>"},
     *       {"type": "video/mp4", "label": "720", "file": "<URL>"},
     *       // ...
     *       {"type": "application/x-mpegURL", "label": "auto", "file": "<URL>"},
     *       {"type": "application/dash+xml", "label": "auto", "file": "<URL>"}
     *     ]
     *
     *  which translates into:
     *
     *     {
     *       "1080": [
     *         "label": "1080",
     *         "displayLabel": "1080p",
     *         "sources": [
     *           {"type": "video/mp4", "src": "<URL>"}
     *         ]
     *       ],
     *       "720": [
     *         "label": "720",
     *         "displayLabel": "720p",
     *         "sources": [
     *           {"type": "video/mp4", "src": "<URL>"}
     *         ]
     *       ],
     *       // ...
     *       "Auto": {
     *         "label": "auto",
     *         "displayLabel": "Auto",
     *         "sources": [
     *           {"type": "application/x-mpegURL", "src": "<URL>"},
     *           {"type": "application/dash+xml", "src": "<URL>"}
     *         ]
     *       }
     *     }
     */
    @computed
    get resolutions() {
        if (!this.mediaSources) {
            return {};
        }

        if (this.supportsAdaptiveFixedResolutions) {
            // We return a single auto resolution until we retrieved the list of levels from the manifest
            if (this.adaptiveQualityLevels && this.adaptiveQualityLevels.length) {
                return this.adaptiveResolutions;
            }

            return [
                {
                    label: AUTO_RESOLUTION_LABEL,
                    displayLabel: ResolutionDisplayLabelLookUp[AUTO_RESOLUTION_LABEL],
                    sources: this.adaptiveSources,
                },
            ];
        }

        return this.mediaSources.reduce((output, source) => {
            // Remove HLS and DASH videos if the browser doesn't support the HTML5 Media Source Extensions
            if (source.label === AUTO_RESOLUTION_LABEL && !this.supportsMSE) {
                return output;
            }

            if (typeof output[source.label] === 'undefined') {
                output[source.label] = {
                    label: source.label,
                    displayLabel: this._getResolutionDisplayLabel(source),
                    sources: [],
                };
            }

            if (this.mediaLicenseToken) {
                output[source.label].sources.push({
                    type: source.type,
                    src: source.src,
                    keySystems: buildKeySystemsConfig(this.mediaLicenseToken),
                });
            } else {
                output[source.label].sources.push({
                    type: source.type,
                    src: source.src,
                });
            }

            return output;
        }, {});
    }

    /**
     * Returns the resolutions available for the video as sorted list.
     *
     *   i.e.
     *
     *     [
     *       {
     *         "label": "720",
     *         "displayLabel": "720p",
     *         "sources": [
     *           {"type": "video/mp4", "src": "<URL>"}
     *         ]
     *       },
     *       {
     *         "label": "480",
     *         "displayLabel": "480p",
     *         "sources": [
     *           {"type": "video/mp4", "src": "<URL>"}
     *         ]
     *       },
     *       // ...
     *       {
     *         "label": "auto",
     *         "displayLabel": "Auto",
     *         "sources": [
     *           {"type": "application/x-mpegURL", "src": "<URL>"},
     *           {"type": "application/dash+xml", "src": "<URL>"}
     *         ]
     *       }
     *     ]
     */
    @computed
    get sortedResolutions() {
        const resolutionType = Object.values(this.resolutions).reduce(
            (output, resolution) => {
                const numericLabel = parseInt(resolution.label, 10);

                if (Number.isNaN(numericLabel)) {
                    output.stringLabels.push(resolution);
                } else {
                    output.numericLabels.push(resolution);
                }

                return output;
            },
            {numericLabels: [], stringLabels: []},
        );

        // Sort the numeric labels by descending order and the string labels alphabetically.
        // Numeric labels can be MP4, HLS or DASH videos,
        // and the string label "Auto" can be HLS or DASH videos.
        resolutionType.numericLabels.sort((first, second) => {
            return second.label - first.label;
        });

        resolutionType.stringLabels.sort((first, second) => {
            return first.label.localeCompare(second.label);
        });

        // String labels go after the numeric ones
        return resolutionType.numericLabels.concat(resolutionType.stringLabels);
    }

    @autobind
    @action
    setResolutionLabel(resolutionLabel) {
        this.selectedResolutionLabel = resolutionLabel;
        saveSetting(RESOLUTION_SETTING, this.selectedResolutionLabel);
    }

    @computed
    get activeResolution() {
        /**
         * The active resolution is determined in the following order:
         * 1. Resolution selected by the user in the player UI.
         * 2. Resolution from a user cookie.
         * 3. Default resolution.
         */
        if (Object.keys(this.resolutions).length === 0) {
            return;
        }

        let activeResolutionLabel;
        const savedResolutionLabel = loadSetting(RESOLUTION_SETTING);

        if (this.selectedResolutionLabel) {
            activeResolutionLabel = this.selectedResolutionLabel;
        } else if (savedResolutionLabel) {
            activeResolutionLabel = savedResolutionLabel;
        } else {
            activeResolutionLabel = DEFAULT_RESOLUTION_LABEL;
        }

        if (typeof this.resolutions[activeResolutionLabel] !== 'undefined') {
            return this.resolutions[activeResolutionLabel];
        }

        return this.sortedResolutions[0];
    }

    @action
    _setHlsResolution(resolution) {
        const previousHlsResolution = this.hlsResolution;
        this.hlsResolution = resolution;
        if (this.activeResolution.label === AUTO_RESOLUTION_LABEL) {
            // We only want to track hls quality level changes when they were triggered by hls.js.
            // We do not not to track hls quality level changes when they were triggered by a user
            // selecting a different hls fixed resolution.
            this._publishAdaptiveStreamingQualityChangeEvent(previousHlsResolution);
        }
    }

    _getResolutionDisplayLabel(source) {
        if (source.label in ResolutionDisplayLabelLookUp) {
            return ResolutionDisplayLabelLookUp[source.label];
        }

        return IntegerResolutionLabel.test(source.label) ? `${source.label}p` : source.label;
    }

    @autobind
    @action
    _updatePlayerResolution(resolutionSources, previousResolutionSources) {
        this.currentResolutionSources = resolutionSources;
        this.hlsResolution = null;

        // Make sure loadedmetadata event fires for MP4 videos
        const videoElement = this._videoPlayer.el().firstChild;

        if (videoElement.preload === 'none') {
            videoElement.preload = 'metadata';
        }

        // Some browsers need the video to be playing to trigger the chain of events that mark the player
        // has ready, so we force this initial status to keep the events consistent cross browsers.
        if (JSON.stringify(resolutionSources) !== JSON.stringify(previousResolutionSources)) {
            this._videoPlayer.src(resolutionSources);

            // We wait for `loadstart` to be triggered to be sure that `onready` event has already been triggered as well,
            // otherwise we would have a race condition with the listeners set in the VideoPlayer components
            this._videoPlayer.one('loadstart', () => {
                this._videoPlayer.trigger('sourceloading');

                this._videoPlayer.forcePlay().then(() => {
                    this._videoPlayer.currentTime(this._videoPlayer.currentTime() + 0.1);

                    this._videoPlayer.trigger('sourceready');
                });
            });
        }

        if (
            this.supportsAdaptiveFixedResolutions &&
            this.adaptiveQualityLevels &&
            this.adaptiveQualityLevels.length
        ) {
            this._updateEnabledQualityLevels();
        }

        // Update the MUX metadata
        // TODO: improve this hack
        const {plugins} = this.videojsSetupData;

        if (plugins.mux) {
            plugins.mux.data.video_cdn = getCDNFromUrl(this._videoPlayer.src());
            this._videoPlayer.mux.emit('videochange', plugins.mux.data);
        }

        // TODO: Change consumers to maintain their own reference to player resolution, rather than getting it off the player.
        this._videoPlayer.resolution = this.activeResolution.label;
    }

    get isUsingNativeControls() {
        return this._videoPlayer && this._videoPlayer.usingNativeControls();
    }

    _publishAdaptiveStreamingQualityChangeEvent(previousResolution) {
        const eventData = {
            previousResolution,
            videoPlayerData: videoPlayerEventData(this),
        };

        if (this._videoPlayer.hls) {
            eventData.hlsBandwidthEstimate = Math.round(this._videoPlayer.hls.bandwidthEstimate);
        }

        Tracker.publishEvent(new AdaptiveStreamingQualityChangeEvent(eventData));
    }

    _logErrorWithHttpStatus(vjsError, errorKey) {
        axios
            .head(this._videoPlayer.src())
            .then((response) => {
                vjsError.responseStatus = response.status;
                vjsError.responseURL = response.request && response.request.responseURL;
                vjsError.responseContentType = response.headers['content-type'];
            })
            .catch((error) => {
                // a Network error or CORS error never returns the actual response
                // see https://github.com/axios/axios/issues/383
                if (typeof error.response !== 'undefined') {
                    vjsError.responseStatus = error.response.status;
                    vjsError.responseURL =
                        error.response.request && error.response.request.responseURL;
                }
            })
            .then(() => {
                this._logError(vjsError, errorKey);
            });
    }

    _logError(error, errorKey) {
        errorKey = errorKey || 'videoplayer.error';
        const errorData = videoPlayerErrorData(this, error);
        browserLogger.error(errorKey, errorData);
    }

    _retry(error) {
        this.numErrors += 1;
        setTimeout(() => {
            if (!this._videoPlayer || !this._videoPlayer.el_) {
                // Video player might have been unmounted.
                return;
            }
            this._videoPlayer.src(this.activeResolution.sources);
        }, 500 * this.numErrors * this.numErrors);
        this._logErrorWithHttpStatus(error, 'videoplayer.error.retry');
    }

    @autobind
    @action
    setPlayerHeight(dimensions) {
        this.playerHeight = dimensions.height;
    }

    @action
    setDuration(duration) {
        this.duration = duration;
    }

    get isPlaying() {
        return this._videoPlayer ? !this._videoPlayer.paused() : false;
    }

    @action
    setSeeking(isSeeking) {
        this.isSeeking = isSeeking;
    }

    @action
    setIsSourceReady(isSourceReady) {
        this.isSourceReady = isSourceReady;
    }

    @autobind
    seekBack() {
        this._videoPlayer.trigger({
            type: 'seekrewind',
            target: this._videoPlayer,
            manuallyTriggered: true,
        });
        this._videoPlayer.currentTime(Math.max(0, this.currentTime - SEEK_INTERVAL));
    }

    @autobind
    seekForward() {
        this._videoPlayer.trigger({
            type: 'seekrewind',
            target: this._videoPlayer,
            manuallyTriggered: true,
        });
        this._videoPlayer.currentTime(this.currentTime + SEEK_INTERVAL);
    }
}
