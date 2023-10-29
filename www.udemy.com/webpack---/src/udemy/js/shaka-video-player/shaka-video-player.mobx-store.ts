import initShakaPlayerMux from '@mux/mux-data-shakaplayer';
// import axios from 'axios';
import {Tracker} from '@udemy/event-tracking';
import {action, computed, observable, reaction} from 'mobx';
import muxjs from 'mux.js/dist/mux.js';
// import shaka from 'shaka-player/dist/shaka-player.compiled';
// TODO: tsmigrate remove debug and add .compiled.d.ts
import shaka from 'shaka-player/dist/shaka-player.ui';
import UAParser from 'ua-parser-js';
import {v4 as uuidv4} from 'uuid';

import BrowserLogger from 'utils/browser-log-collection';
import {noop} from 'utils/noop';

import {
    DRM_LICENSE_CERTIFICATE_URL,
    AUTO_RESOLUTION_LABEL,
    DASH_MIME_TYPE,
    DEFAULT_RESOLUTION_LABEL,
    HLS_MIME_TYPE,
    SEEK_INTERVAL,
} from './constants';
import {
    buildLicenseServerURL,
    supportKeySystem,
    HLS_CONFIGS,
    DASH_CONFIGS,
    FAIRPLAY_KEY_SYSTEM,
    WIDEVINE_KEY_SYSTEM,
    PLAYREADY_KEY_SYSTEM,
    buildKeySystemsConfig,
} from './drm';
// import {buildKeySystemsConfig} from './drm';
import {AdaptiveStreamingQualityChangeEvent} from './events';
import {videoPlayerEventData, videoPlayerErrorData} from './helpers';
import {PlaybackRateStore} from './playback-rate/playback-rate.mobx-store';
import {RESOLUTION_SETTING} from './settings-menu/constants';
import {saveSetting, loadSetting} from './user-settings';
import {parsedUserAgent} from './utils';
import {VolumeStore} from './volume/volume.mobx-store';

declare const window: any;
const ShakaPlayer = shaka.Player;
const ShakaUI = shaka.ui;

const IntegerResolutionLabel = new RegExp(/^[0-9]+$/);
interface ResolutionType {
    numericLabels: Array<string>;
    stringLabels: Array<string>;
}
interface DResolutionDisplayLabelLookUp {
    [AUTO_RESOLUTION_LABEL]: string;
    audio: string;
}

const ResolutionDisplayLabelLookUp: DResolutionDisplayLabelLookUp = {
    [AUTO_RESOLUTION_LABEL]: 'Auto',
    audio: 'Audio',
};

const browserLogger = new BrowserLogger('videoplayer');

export class ShakaVideoPlayerStore {
    assetId: any;
    onTimeUpdate: any;
    onVideoProgress: any;
    playbackRateStore: any;
    sessionId: any;
    trackingTag: any;
    videoProgressInterval: any;
    volumeStore: any;
    _videoPlayer: shaka.Player | undefined;
    videoElement: any;
    playerId: string;
    videojsSetupData = {};
    numErrors = 0;
    numPlaylistRetries = 0;
    position = -1;
    lastPosition = -1;
    waitingToLoad = false;
    shakaPlayerMux = null;

    @observable playItem: any = null;
    @observable isSeeking = false;
    @observable isSourceReady = false;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    @observable currentTime_ = 0;
    @observable isErrorVisible = false;
    @observable errorBody = '';
    @observable errorFooter = '';
    // eslint-disable-next-line @typescript-eslint/naming-convention
    @observable duration_: any;
    @observable playerHeight: any;
    @observable isUsingNativeControlss = false;

    @observable.ref mediaSources: any;
    @observable mediaLicenseToken: any;
    currentResolutionSources: any;

    @observable hlsResolution: any;
    @observable selectedResolutionLabel: any;
    @observable.ref adaptiveQualityLevels: any;
    readonly uaParser = new UAParser();

    // tracking stuff
    bandwidthWatermarks = {};

    constructor(
        videojsSetupData: any,
        playerId: string,
        duration: any,
        trackingTag: any,
        assetId: any,
        onVideoProgress: any,
        videoProgressInterval: any,
        onTimeUpdate: any,
        isDefaultMuted: any,
        prioritizeDefaultMuted: any,
    ) {
        window.muxjs = muxjs;
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
        this.currentTime_ = 0;
    }

    @action
    setMediaSources(mediaSources: any, mediaLicenseToken = undefined) {
        this.mediaSources = mediaSources;
        this.mediaLicenseToken = mediaLicenseToken;
    }

    @action
    showError(error: any) {
        this.errorBody = error?.body || '';
        this.errorFooter = error?.footer || '';
        this.isErrorVisible = true;
    }

    @action
    hideError = () => {
        this.errorBody = '';
        this.errorFooter = '';
        this.isErrorVisible = false;
    };

    getFairPlayServiceCertificate = async () => {
        try {
            const req = await fetch(DRM_LICENSE_CERTIFICATE_URL);
            const cert = await req.arrayBuffer();
            return new Uint8Array(cert);
        } catch (error) {
            // TODO: send error to DD
            return null;
        }
    };

    _createNativeVideoPlayerControls = () => {
        // TODO: replace the following element id with something more sensible like getting the parent.
        const videoContainer = document.getElementById(`shaka-video-container-${this.assetId}`);
        const ui = new ShakaUI.Overlay(this._videoPlayer, videoContainer, this.videoElement);
        const config = {
            controlPanelElements: [
                'play_pause',
                'spacer',
                'time_and_duration',
                'volume',
                'mute',
                'picture_in_picture',
                'fullscreen',
                'captions',
            ],
        };
        ui.configure(config);
        ui.setEnabled(true);
    };

    _createVideoPlayerConfigurationForNonEncryptedSources = () => {
        this._videoPlayer?.configure({
            abr: {restrictToElementSize: true},
            streaming: {
                useNativeHlsOnSafari: false,
                bufferingGoal: 60,
            },
        });
    };

    _createVideoPlayerConfigurationForFairPlay = async () => {
        const cert = await this.getFairPlayServiceCertificate();
        if (!cert) {
            return;
        }

        // TODO: REVISIT IF THESE LINES ARE NEEDED.
        this._videoPlayer?.configure(
            'drm.servers.com\\.apple\\.fps\\.1_0',
            buildLicenseServerURL('fairplay', this.mediaLicenseToken),
        );
        this._videoPlayer?.configure(
            'drm.advanced.com\\.apple\\.fps\\.1_0.serverCertificate',
            cert,
        );

        let contentId = '';

        this._videoPlayer?.configure({
            abr: {restrictToElementSize: true},
            drm: {
                servers: {
                    // TODO: test without the .1_0
                    [FAIRPLAY_KEY_SYSTEM]: buildLicenseServerURL(
                        'fairplay',
                        this.mediaLicenseToken,
                    ),
                },
                initDataTransform: (initData: any) => {
                    contentId = shaka.util.FairPlayUtils.defaultGetContentId(initData);
                    const cert = this._videoPlayer?.drmInfo()?.serverCertificate;
                    return shaka.util.FairPlayUtils.initDataTransform(initData, contentId, cert);
                },
            },
            streaming: {
                bufferingGoal: 60,
            },
        });

        this._videoPlayer
            ?.getNetworkingEngine()
            ?.registerRequestFilter((type: any, request: any) => {
                if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
                    request.headers['Content-Type'] = 'text/plain';
                    const originalPayload = new Uint8Array(request.body);
                    const base64Payload = shaka.util.Uint8ArrayUtils.toStandardBase64(
                        originalPayload,
                    );
                    const params = `spc=${base64Payload}&assetId=${contentId}`;
                    request.body = shaka.util.StringUtils.toUTF8(params);
                }
            });

        this._videoPlayer
            ?.getNetworkingEngine()
            ?.registerResponseFilter((type: any, response: any) => {
                if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
                    let responseText = shaka.util.StringUtils.fromUTF8(response.data);
                    responseText = responseText.trim();
                    // Decode the base64-encoded data into the format the browser expects.
                    response.data = shaka.util.Uint8ArrayUtils.fromBase64(responseText).buffer;
                }
            });
    };

    _createVideoPlayerConfigurationForWideVine = () => {
        this._videoPlayer?.configure({
            abr: {restrictToElementSize: true},
            drm: {
                servers: {
                    [WIDEVINE_KEY_SYSTEM]: buildLicenseServerURL(
                        'widevine',
                        this.mediaLicenseToken,
                    ),
                },
                advanced: {
                    WIDEVINE_KEY_SYSTEM: {
                        videoRobustness: 'SW_SECURE_CRYPTO',
                        audioRobustness: 'SW_SECURE_CRYPTO',
                    },
                },
            },
            streaming: {
                bufferingGoal: 60,
            },
        });

        this._videoPlayer
            ?.getNetworkingEngine()
            ?.registerRequestFilter(function (type: any, request: any) {
                if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
                    request.headers['Content-type'] = 'application/octet-stream';
                    request.responseType = 'arraybuffer';
                }
            });
    };

    _createVideoPlayerConfigurationForPlayReady = () => {
        this._videoPlayer?.configure({
            abr: {restrictToElementSize: true},
            drm: {
                servers: {
                    [PLAYREADY_KEY_SYSTEM]: buildLicenseServerURL(
                        'playready',
                        this.mediaLicenseToken,
                    ),
                },
            },
            streaming: {
                bufferingGoal: 60,
            },
        });

        this._videoPlayer
            ?.getNetworkingEngine()
            ?.registerRequestFilter(function (type: any, request: any) {
                if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
                    request.headers['Content-type'] = 'application/octet-stream';
                    request.responseType = 'arraybuffer';
                }
            });
    };

    _createVideoPlayerConfiguration = async () => {
        if (!this.mediaLicenseToken) {
            this._createVideoPlayerConfigurationForNonEncryptedSources();
            return;
        }
        const isWidevineSupported = await supportKeySystem(WIDEVINE_KEY_SYSTEM, DASH_CONFIGS);
        browserLogger.info('XXX isWidevineSupported = ', isWidevineSupported);
        if (isWidevineSupported) {
            this._createVideoPlayerConfigurationForWideVine();
            return;
        }

        const isFairPlaySupported = await supportKeySystem(FAIRPLAY_KEY_SYSTEM, HLS_CONFIGS);
        browserLogger.info('XXX isFairPlaySupported = ', isFairPlaySupported);
        if (isFairPlaySupported) {
            await this._createVideoPlayerConfigurationForFairPlay();
            return;
        }

        const isPlayReadySupported = await supportKeySystem(PLAYREADY_KEY_SYSTEM, DASH_CONFIGS);
        browserLogger.info('XXX isPlayReadySupported = ', isPlayReadySupported);
        if (isPlayReadySupported) {
            this._createVideoPlayerConfigurationForPlayReady();
            return;
        }

        // TODO: notify DD the browser name and that no key system was detected.
        // Make last ditch attempt at using the most widely used key system:
        this._createVideoPlayerConfigurationForWideVine();
    };

    async createVideoPlayer(videoElement: any) {
        const uaParser = new UAParser();
        const isSafariOriOS =
            uaParser?.getBrowser()?.name?.toLowerCase() === 'safari' ||
            uaParser?.getOS()?.name?.toLowerCase() === 'ios';
        if (isSafariOriOS) {
            shaka.polyfill.installAll();
            shaka.polyfill.PatchedMediaKeysApple.install();
        }

        this.videoElement = videoElement;
        this._videoPlayer = new ShakaPlayer(this.videoElement);
        this._useNativeControlsForMobile();
        await this._createVideoPlayerConfiguration();

        this.videoElement.addEventListener('durationchange', (event: any) => {
            if (event?.target?.duration) {
                this.setDuration(event.target.duration);
            }
        });

        this._videoPlayer.addEventListener('adaptation', (event: any) => {
            this._setHlsResolution(event?.data?.resolution);
        });

        this.playbackRateStore.attachPlaybackRateStore(this.videoElement);
        this.volumeStore.setup(this.videoElement);

        this.shakaPlayerMux = initShakaPlayerMux(this._videoPlayer, this.videojsSetupData, shaka);
        this._initActiveResolution();
        return this._videoPlayer;
    }

    // TODO tsmigrate windows.muxjs defined as global
    // componentDidMount() {
    //     window.muxjs = muxjs;
    // }

    destroyVideoPlayer = () => {
        if (this._videoPlayer) {
            this._videoPlayer.destroy();
            this._videoPlayer.mux.destroy();
        }
    };

    _initActiveResolution = () => {
        reaction(
            () => JSON.stringify(this.activeResolution),
            () =>
                this._updatePlayerResolution(
                    this.activeResolution.sources,
                    this.currentResolutionSources,
                ),
            {fireImmediately: true},
        );
    };

    @action
    _useNativeControlsForMobile() {
        if (parsedUserAgent.isMobile) {
            this._createNativeVideoPlayerControls();
            this.isUsingNativeControlss = true;
        }
    }

    _onHlsLevelSwitch = (event: any, data: any) => {
        this._setHlsResolution(data.resolution);
    };

    @action
    _setAdaptiveQualityLevels = () => {
        let tracks = this._videoPlayer?.getVariantTracks();

        // If there is a selected variant track, then we filter out any tracks in
        // a different language.  Then we use those remaining tracks to display the
        // available resolutions.
        const selectedTrack = tracks?.find((track: any) => track.active);
        if (selectedTrack) {
            // Filter by current audio language and channel count.
            tracks = tracks?.filter(
                (track: any) =>
                    track.language == selectedTrack.language &&
                    track.channelsCount == selectedTrack.channelsCount,
            );
        }

        // Remove duplicate entries with the same resolution or quality depending
        // on content type.  Pick an arbitrary one.
        tracks = tracks?.filter((track: any, idx: any) => {
            // Keep the first one with the same height or bandwidth.
            const otherIdx = this._videoPlayer?.isAudioOnly()
                ? tracks?.findIndex((t: any) => t.bandwidth == track.bandwidth)
                : tracks?.findIndex((t: any) => t.height == track.height);
            return otherIdx == idx;
        });

        // Sort the tracks by height or bandwidth depending on content type.
        if (this._videoPlayer?.isAudioOnly()) {
            tracks?.sort((t1: any, t2: any) => {
                return t2.bandwidth - t1.bandwidth;
            });
        } else {
            tracks?.sort((t1: any, t2: any) => {
                return t2.height - t1.height;
            });
        }
        this.adaptiveQualityLevels = tracks;
    };

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

    // ETS-2400, 2289: emulate videojs api implementation for Shaka - needed for lecture
    // lecture player's direct player api calls.
    // eslint-disable-next-line @typescript-eslint/naming-convention
    el_() {
        return document.getElementById(this.playerId);
    }

    duration() {
        return this.duration_;
    }

    currentTime(currentTime?: any): void | number {
        if (currentTime !== undefined) {
            this.videoElement.currentTime = currentTime;
        } else {
            return this.currentTime_;
        }
    }

    on(eventName: string, callback: any) {
        this.videoElement.addEventListener(eventName, callback);
    }
    // end of videojs api emulation

    handleVideoProgress = (event: any) => {
        const position = Math.ceil(this.currentTime_ / this.videoProgressInterval);
        if (this.lastPosition === position || position <= 0) {
            return;
        }
        this.lastPosition = position;
        // At the end of the video, just use the video duration,
        // otherwise use the smaller out of the duration and the interval 'bucket'.
        const time =
            event.type === 'ended'
                ? this.duration_
                : Math.min(position * this.videoProgressInterval, this.duration_);
        const progressData = {
            total: Math.floor(this.duration_),
            position: Math.floor(time),
        };
        this.onVideoProgress(event, progressData);
    };

    @action
    handleTimeUpdate = () => {
        this.currentTime_ = this._videoPlayer?.getMediaElement().currentTime ?? 0;
        this.onTimeUpdate(this.currentTime_);
    };

    handleVideoError(error: any) {
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
                // TODO: tsmigrate unloadTech is not available in shaka player
                // In this case the Videojs-contrib-eme will try to retrieve the
                // Encrypted media sources indefinitely causing infinite requests
                // to our CDNs, so we have to remove the eme tech.
                // this._videoPlayer.unloadTech_('eme');
            }
            this._logErrorWithHttpStatus(error, 'videoplayer.error.retry');
        }
    }

    @computed
    get adaptiveSourceTypes() {
        return [HLS_MIME_TYPE, DASH_MIME_TYPE];
    }

    @computed
    get adaptiveSources() {
        return this.mediaSources
            .filter((source: any) => this.adaptiveSourceTypes.includes(source.type))
            .map(({type, src}: any) => {
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
            if (this.videoElement.canPlayType(adaptiveSourceType)) {
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
            (adaptiveResolution: any, qualityLevel: any) => {
                if (typeof adaptiveResolution[qualityLevel.height] === 'undefined') {
                    adaptiveResolution[qualityLevel.height] = {
                        label: qualityLevel.height.toString(),
                        displayLabel: this._getResolutionDisplayLabel({label: qualityLevel.height}),
                        sources: this.adaptiveSources,
                    };
                }
                return adaptiveResolution;
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
            if (this.adaptiveQualityLevels?.length) {
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

        return this.mediaSources.reduce((output: any, source: any) => {
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
        let resolutionType: ResolutionType = {numericLabels: [], stringLabels: []};
        resolutionType = Object.values(this.resolutions).reduce(
            (output: ResolutionType, resolution: any) => {
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
        resolutionType.numericLabels.sort((first: any, second: any) => {
            return second.label - first.label;
        });

        resolutionType.stringLabels.sort((first: any, second: any) => {
            return first.label.localeCompare(second.label);
        });

        // String labels go after the numeric ones
        return resolutionType.numericLabels.concat(resolutionType.stringLabels);
    }

    @action
    setResolutionLabel = (resolutionLabel: any) => {
        this.selectedResolutionLabel = resolutionLabel;
        saveSetting(RESOLUTION_SETTING, this.selectedResolutionLabel);
    };

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
    _setHlsResolution(resolution: any) {
        const previousHlsResolution = this.hlsResolution;
        this.hlsResolution = resolution;
        if (this.activeResolution.label === AUTO_RESOLUTION_LABEL) {
            // We only want to track hls quality level changes when they were triggered by hls.js.
            // We do not not to track hls quality level changes when they were triggered by a user
            // selecting a different hls fixed resolution.
            this._publishAdaptiveStreamingQualityChangeEvent(previousHlsResolution);
        }
    }

    _getResolutionDisplayLabel(source: any) {
        if (source.label in ResolutionDisplayLabelLookUp) {
            return ResolutionDisplayLabelLookUp[
                source.label as keyof DResolutionDisplayLabelLookUp
            ];
        }

        return IntegerResolutionLabel.test(source.label) ? `${source.label}p` : source.label;
    }

    @action
    _updatePlayerResolution = (resolutionSources: any, previousResolutionSources: any) => {
        browserLogger.info('XXX shaka resolutionSources = ', resolutionSources);
        this.currentResolutionSources = resolutionSources;
        this.hlsResolution = null;

        // Make sure loadedmetadata event fires for MP4 videos
        const videoElement = this.videoElement;

        if (videoElement.preload === 'none') {
            videoElement.preload = 'metadata';
        }

        // Some browsers need the video to be playing to trigger the chain of events that mark the player
        // has ready, so we force this initial status to keep the events consistent cross browsers.
        if (JSON.stringify(resolutionSources) !== JSON.stringify(previousResolutionSources)) {
            // BEGIN TEMP POC CODE
            const hlsItem = this.mediaSources.find(
                (item: any) => item.type === 'application/x-mpegURL',
            );
            const drmItem = this.mediaSources.find(
                (item: any) => item.type === 'application/dash+xml',
            );

            this.playItem = this.mediaSources[0]; // Default to MP4.
            browserLogger.info('this.mediaSources = ', this.mediaSources);
            if (this.mediaLicenseToken) {
                const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                if (isSafari && hlsItem) {
                    browserLogger.info('this.playItem = hlsItem');
                    this.playItem = hlsItem;
                } else if (!isSafari && drmItem) {
                    browserLogger.info('this.playItem = drmItem');
                    this.playItem = drmItem;
                }
            } else if (hlsItem) {
                this.playItem = hlsItem;
                browserLogger.info('this.playItem = hlsItem');
            } else {
                browserLogger.info('this.playItem = MP4');
            }
            // END TEMP POC CODE
        }
        if (
            this.supportsAdaptiveFixedResolutions &&
            this.adaptiveQualityLevels &&
            this.adaptiveQualityLevels.length
        ) {
            this._updateEnabledQualityLevels();
            if (this.activeResolution.label != 'auto') {
                this._videoPlayer?.configure('abr.enabled', false);
                const activeTrack: shaka.extern.Track = this._videoPlayer
                    ?.getVariantTracks()
                    .filter(
                        (track: any) => track.height == this.activeResolution.label,
                    )[0] as shaka.extern.Track;
                this._videoPlayer?.selectVariantTrack(activeTrack);
            } else {
                this._videoPlayer?.configure('abr.enabled', true);
            }
        }
    };

    @action
    loadPlayItem = () => {
        this._videoPlayer?.load(this.playItem.src).then(noop).catch(noop);
    };

    get isUsingNativeControls() {
        return this._videoPlayer && this.isUsingNativeControlss;
    }

    _publishAdaptiveStreamingQualityChangeEvent(previousResolution: any) {
        const eventData = {
            previousResolution,
            videoPlayerData: videoPlayerEventData(this),
        };

        // TODO: TSmigrate hls is undefined in Shaka player
        // if (this._videoPlayer.hls) {
        //     // TODO: Tsmigrate eventData.hlsBandwidthEstimate is not used in AdaptiveStreamingQualityChangeEvent
        //     // eventData.hlsBandwidthEstimate = Math.round(this._videoPlayer.hls.bandwidthEstimate);
        // }

        Tracker.publishEvent(new AdaptiveStreamingQualityChangeEvent(eventData));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
    _logErrorWithHttpStatus(_vjsError: any, _errorKey: any) {
        // TODO: tsmigrate src() is undefuned in shaka.
        // axios
        //     .head(this._videoPlayer?.src())
        //     .then((response) => {
        //         vjsError.responseStatus = response.status;
        //         vjsError.responseURL = response.request?.responseURL;
        //         vjsError.responseContentType = response.headers['content-type'];
        //     })
        //     .catch((error) => {
        //         // a Network error or CORS error never returns the actual response
        //         // see https://github.com/axios/axios/issues/383
        //         if (typeof error.response !== 'undefined') {
        //             vjsError.responseStatus = error.response.status;
        //             vjsError.responseURL = error.response.request?.responseURL;
        //         }
        //     })
        //     .then(() => {
        //         this._logError(vjsError, errorKey);
        //     });
    }

    _logError(error: any, errorKey: any) {
        errorKey = errorKey || 'videoplayer.error';
        const errorData = videoPlayerErrorData(this, error);
        browserLogger.error(errorKey, errorData);
    }

    _retry(error: any) {
        this.numErrors += 1;
        setTimeout(() => {
            if (!this._videoPlayer || !this.videoElement) {
                // Video player might have been unmounted.
            }
            // TODO tsmigrate src() is undefined.
            // this._videoPlayer.src(this.activeResolution.sources);
        }, 500 * this.numErrors * this.numErrors);
        this._logErrorWithHttpStatus(error, 'videoplayer.error.retry');
    }

    @action
    setPlayerHeight = (dimensions: any) => {
        this.playerHeight = dimensions.height;
    };

    @action
    setDuration(duration: any) {
        this.duration_ = duration;
    }

    get isPlaying() {
        return this._videoPlayer ? this._videoPlayer.isInProgress : false;
    }

    @action
    setSeeking(isSeeking: any) {
        this.isSeeking = isSeeking;
    }

    @action
    setIsSourceReady(isSourceReady: any) {
        this.isSourceReady = isSourceReady;
    }

    seekBack = () => {
        this.videoElement.currentTime = Math.max(0, this.videoElement.currentTime - SEEK_INTERVAL);
    };

    seekForward = () => {
        this.videoElement.currentTime = this.videoElement.currentTime + SEEK_INTERVAL;
    };
}
