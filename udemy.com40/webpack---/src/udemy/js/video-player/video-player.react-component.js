import PlayArrowIcon from '@udemy/icons/dist/play-arrow.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, observable, reaction} from 'mobx';
import {observer, Provider, PropTypes as MobxTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Measure from 'react-measure';

import autopilot from 'utils/autopilot';
import {fullscreen} from 'utils/fullscreen';
import getRequestData from 'utils/get-request-data';
import hotkeyRegistry from 'utils/hotkeys';
import {mergeObjectsWithArrayMerge} from 'utils/merge-objects';
import {noop} from 'utils/noop';
import udApiStat from 'utils/ud-api-stat';
import udMe from 'utils/ud-me';

import './videojs-setup/setup';
import getMuxConfig from './analytics/get-mux-config';
import CaptionDisplayStore from './captions/caption-display.mobx-store';
import CaptionsStore from './captions/captions.mobx-store';
import CueDisplay from './captions/cue-display/cue-display.react-component';
import * as constants from './constants';
import ControlBarStore from './control-bar/control-bar.mobx-store';
import ControlBar from './control-bar/control-bar.react-component';
import ErrorDisplay from './error-display.react-component';
import PlayPauseFeedback from './feedback/play-pause-feedback.react-component';
import {getCDNFromUrl} from './helpers';
import ProgressBarStore from './progress-bar/progress-bar.mobx-store';
import userActivityStyles from './user-activity.less';
import UserActivityStore from './user-activity.mobx-store';
import {parsedUserAgent} from './utils';
import videoPlayerStyles from './video-player.less';
import VideoPlayerStore from './video-player.mobx-store';

const udRequest = getRequestData();

@autopilot('isPlaying', 'onPlayPause')
@fullscreen
@observer
export default class VideoPlayer extends Component {
    static propTypes = {
        renderVideoElement: PropTypes.func,
        playerId: PropTypes.string.isRequired,
        captions: PropTypes.array,
        captionsStore: PropTypes.instanceOf(CaptionsStore),
        mediaLicenseToken: PropTypes.string,
        mediaSources: MobxTypes.arrayOrObservableArray.isRequired,
        thumbnailSprite: PropTypes.shape({
            vtt_url: PropTypes.string.isRequired,
            img_url: PropTypes.string.isRequired,
        }),
        progressBarStore: PropTypes.object,
        toggleFullscreen: PropTypes.func.isRequired, // Provided by the `fullscreen` decorator.
        isFullscreen: PropTypes.bool.isRequired, // Provided by the `fullscreen` decorator.
        exitFullscreen: PropTypes.func.isRequired, // Provided by the `fullscreen` decorator.
        setFullscreenRef: PropTypes.func.isRequired, // Provided by the `fullscreen` decorator.
        assetId: PropTypes.number.isRequired,
        trackingTag: PropTypes.string,
        // `isPlaying` can be used to control the playing state of the video. We try and sync this
        // state to the videojs player as soon as possible, and therefore cannot be relied on to
        // immediately match the 'true' playing state.
        isPlaying: PropTypes.bool,
        // Use `isDefaultPlaying` if you want to set the initial value for `isPlaying` but don't
        // need to control the state after that. Safari and iOS are special because they don't allow
        // videos to autoplay without prior user interaction unless:
        //  1. The video starts muted
        //  2. The playsInline attribute is set (allows the video to play without going into
        //  fullscreen mode)
        // For more details, see https://webkit.org/blog/6784/new-video-policies-for-ios/. See
        // references of the util `getIsSafariOrIOS` for learning to pass the needed extra configs
        // to circumvent such autoplay default settings, unless you are okay with the default
        // behavior of not autoplaying with audio on these devices.
        isDefaultPlaying: PropTypes.bool,
        // A callback invoked when some user action or event would cause the playing state to
        // toggle. Called with two arguments:
        // - `true` or `false` to indicate a change to playing or paused respectively,
        // - `true` or `false` to indicate whether the event is from native video controls.
        onPlayPause: PropTypes.func.isRequired, // At least provided by `autopilot`
        // If we receive a play/pause event from videojs without the user interacting with one of
        // 'our' controls (presumably because they have interacted with a native control - either
        // on mobile or via Picture-in-Picture), we fire `onPlayPause`. Whilst we're waiting, the
        // `isPlaying` prop won't match the video state. We don't immediately correct this, to give
        // the component user a chance to respond to the callback. Once this grace period is up
        // though we will resume trying to correct the video state to the `isPlaying` prop.
        // The grace period is defined in milliseconds, and may be 0 (to immediately counter the
        // natively-invoked change).
        nativeControlGracePeriod: PropTypes.number,
        // A callback invoked when the playing state *actually* updates - i.e. when the `isPlaying`
        // prop has been successfully applied to the videojs player. Called with `true` or `false`
        // to indicate currently playing or paused respectively.
        onPlayPauseToggled: PropTypes.func,
        onVideoEnd: PropTypes.func,
        onVideoProgress: PropTypes.func,
        videoProgressInterval: PropTypes.number,
        onTimeUpdate: PropTypes.func,
        onVideoUnavailable: PropTypes.func,
        // A callback invoked when the video encounters an erorr. Return 'false' if you don't want the default player
        // behaviour to kick in.
        onPlayerError: PropTypes.func,
        hotkeysEnabled: PropTypes.bool,
        onHotkey: PropTypes.func,
        duration: PropTypes.number,
        preload: PropTypes.oneOf(['auto', 'metadata', 'none']),
        // A callback invoked the first time the video player is set up and the video data loaded.
        onPlayerReady: PropTypes.func,
        extraVideoAttributes: PropTypes.object,
        userActivityEnabled: PropTypes.bool,
        userActivityStore: PropTypes.object,
        errorBody: ErrorDisplay.propTypes.errorBody,
        errorFooter: ErrorDisplay.propTypes.errorFooter,
        fullscreenEnabled: PropTypes.bool,
        controlsTrackingEnabled: PropTypes.bool,
        muxMetadata: PropTypes.object,
        isDownloadEnabled: PropTypes.bool,
        isDefaultMuted: PropTypes.bool,
        prioritizeDefaultMuted: PropTypes.bool,
        isDefaultCaptionOn: PropTypes.bool,
    };

    static defaultProps = {
        renderVideoElement: undefined,
        captionsStore: null,
        mediaLicenseToken: undefined,
        onVideoEnd: undefined,
        duration: undefined,
        extraVideoAttributes: undefined,
        onVideoUnavailable: noop,
        onVideoProgress: undefined,
        videoProgressInterval: 0,
        onTimeUpdate: noop,
        onPlayerError: noop,
        onPlayerReady: noop,
        hotkeysEnabled: false,
        onHotkey: noop,
        preload: 'metadata',
        trackingTag: '',
        isPlaying: undefined,
        isDefaultPlaying: false,
        nativeControlGracePeriod: constants.NATIVE_CONTROL_SYNC_GRACE_PERIOD,
        onPlayPauseToggled: noop,
        captions: [],
        thumbnailSprite: undefined,
        userActivityEnabled: true,
        userActivityStore: null,
        errorBody: ErrorDisplay.defaultProps.errorBody,
        errorFooter: ErrorDisplay.defaultProps.errorFooter,
        fullscreenEnabled: true,
        controlsTrackingEnabled: false,
        muxMetadata: undefined,
        isDownloadEnabled: false,
        isDefaultMuted: false,
        prioritizeDefaultMuted: false,
        isDefaultCaptionOn: false,
        progressBarStore: null,
    };

    constructor(props) {
        super(props);
        // We will not be responding to changes in this default prop after initial render.
        this.isDefaultPlaying = this.props.isDefaultPlaying;
        this.hasPlayed = this.isPlaying;

        const isEncrypted = !!this.props.mediaLicenseToken;

        this.videojsSetupData = mergeObjectsWithArrayMerge(
            constants.VIDEO_JS_CONFIG,
            getMuxConfig(this.props.muxMetadata, this.props.mediaSources, isEncrypted),
        );
        // Anonymous user are not getting the right locale from django
        // We are doing this because the video render doesn't know the request locale.
        this.videojsSetupData.language = udRequest.locale.toLowerCase().replace('_', '-');

        this.videojsSetupData.userActions = this.videojsSetupData.userActions || {};
        this.videojsSetupData.userActions.doubleClick = this.onVideoDoubleClick;

        this.store = new VideoPlayerStore(
            this.videojsSetupData,
            this.props.playerId,
            this.props.duration,
            this.props.trackingTag,
            this.props.assetId,
            this.props.onVideoProgress,
            this.props.videoProgressInterval,
            this.props.onTimeUpdate,
            this.props.isDefaultMuted,
            this.props.prioritizeDefaultMuted,
        );
        this.controlBarStore = new ControlBarStore();
        this.captionsStore =
            this.props.captionsStore ||
            new CaptionsStore(
                this.props.captions,
                true,
                {[udRequest.locale.split('_')[0]]: 1},
                this.props.isDefaultCaptionOn,
            );
        this.captionsStore.attachPlayerStore(this.store);
        this.captionDisplayStore = new CaptionDisplayStore(
            this.controlBarStore,
            this.captionsStore,
            this.store,
        );

        if (this.props.userActivityEnabled) {
            this.userActivityStore = this.props.userActivityStore || new UserActivityStore();
            this.userActivityStore.setControlBarStore(this.controlBarStore);
        }

        this.progressBarStore = this.props.progressBarStore || new ProgressBarStore();

        this.progressBarStore.setThumbnailSprite(this.props.thumbnailSprite);

        this.hotkeys = [
            {
                key: 'space',
                fn: this.withHotkeyCallback(
                    this.togglePlayPause,
                    constants.HOTKEY_ACTIONS.PLAY_PAUSE,
                ),
            },
            {
                key: 'enter',
                fn: this.withHotkeyCallback(
                    this.togglePlayPause,
                    constants.HOTKEY_ACTIONS.PLAY_PAUSE,
                ),
            },
            {
                key: 'left',
                fn: this.withHotkeyCallback(
                    this.store.seekBack,
                    constants.HOTKEY_ACTIONS.SEEK_BACK,
                ),
            },
            {
                key: 'right',
                fn: this.withHotkeyCallback(
                    this.store.seekForward,
                    constants.HOTKEY_ACTIONS.SEEK_FORWARD,
                ),
            },
            {
                key: 'shift+left',
                fn: this.withHotkeyCallback(
                    this.store.playbackRateStore.speedDown,
                    constants.HOTKEY_ACTIONS.SPEED_DOWN,
                ),
            },
            {
                key: 'shift+right',
                fn: this.withHotkeyCallback(
                    this.store.playbackRateStore.speedUp,
                    constants.HOTKEY_ACTIONS.SPEED_UP,
                ),
            },
            {
                key: 'down',
                fn: this.withHotkeyCallback(this.volumeDown, constants.HOTKEY_ACTIONS.VOLUME_DOWN),
            },
            {
                key: 'up',
                fn: this.withHotkeyCallback(this.volumeUp, constants.HOTKEY_ACTIONS.VOLUME_UP),
            },
            {
                key: 'm',
                fn: this.withHotkeyCallback(
                    this.store.volumeStore.toggleMuted,
                    constants.HOTKEY_ACTIONS.TOGGLE_MUTE,
                ),
            },
        ];
        if (this.props.fullscreenEnabled) {
            this.hotkeys.push({
                key: 'f',
                fn: this.withHotkeyCallback(
                    this.props.toggleFullscreen,
                    constants.HOTKEY_ACTIONS.TOGGLE_FULLSCREEN,
                ),
            });
        }
        // Add in the keys 0-9.
        Array(10)
            .fill()
            .forEach((_, digit) => {
                this.hotkeys.push({
                    key: digit.toString(),
                    fn: this.withHotkeyCallback(this.jumpTo.bind(this, digit)),
                });
            });
    }

    async componentDidMount() {
        this.store.setMediaSources(this.props.mediaSources, this.props.mediaLicenseToken);

        const videoPlayer = await this.store.createVideoPlayer(this.videoElement);

        this.initVideoPlayer(videoPlayer);
    }

    componentDidUpdate(prevProps) {
        // TODO: Check whether it is actually necessary to store the fullscreen state on the player.
        if (prevProps.isFullscreen !== this.props.isFullscreen && this.videoPlayer) {
            this.videoPlayer.isFullscreen(this.props.isFullscreen);
        }

        if (prevProps.isPlaying !== this.props.isPlaying) {
            this.syncPlayStateToPlayer();
        }

        // We needed a shallow comparison here or the video player will see a different object reference
        // anytime the component properties are updated
        if (
            prevProps.mediaLicenseToken !== this.props.mediaLicenseToken ||
            JSON.stringify(prevProps.mediaSources) !== JSON.stringify(this.props.mediaSources)
        ) {
            this.store.setMediaSources(this.props.mediaSources, this.props.mediaLicenseToken);
        }
    }

    componentWillUnmount() {
        if (this.videoPlayer) {
            this.stopMuxHeartbeat();
            this.videoPlayer.dispose();
        }

        this.unpatchPlayer();

        this.unregisterHotkeys();
        clearTimeout(this.playStateSyncTimeout);
    }

    stopMuxHeartbeat() {
        // HACK: Tell Mux to stop heartbeat
        const {plugins} = this.videojsSetupData;

        if (plugins.mux) {
            plugins.mux.data.video_cdn = getCDNFromUrl(this.videoPlayer.src());
            this.videoPlayer.mux.emit('viewend', plugins.mux.data);
        }
    }

    @observable.ref videoPlayer;
    @observable hasPlayed = false;
    isVideoPlayerInitialized = false;

    get isPlaying() {
        return this.props.isPlaying !== undefined ? this.props.isPlaying : this.isDefaultPlaying;
    }

    @action
    initVideoPlayer(videoPlayer) {
        /*
        A function to be called only once to attach videojs to our <video /> element and attach all
        necessary listeners and state to it.
         */
        this.videoPlayer = videoPlayer;

        this.captionDisplayStore.attachPlayer(this.videoPlayer);
        this.captionsStore.setNativeTracksForMobile(this.store.isUsingNativeControls);
        this.progressBarStore.attachPlayer(this.videoPlayer);
        this.progressBarStore.attachPlayerStore(this.store);
        this.initializePlugins();
        this.setupPlayerEvents();
        this.isVideoPlayerInitialized = true;
    }

    patchPlayer() {
        /*
        Monkey patch the video player's `play` and `pause` functions to ensure all controls come
        via this component, and no state changes can occur without us being aware of them.
         */
        this.videoPlayerPlay = this.videoPlayer.play.bind(this.videoPlayer);
        this.videoPlayerPause = this.videoPlayer.pause.bind(this.videoPlayer);
        this.videoPlayer.play = this.play;
        this.videoPlayer.pause = this.pause;

        // Start syncing our play state to the videojs instance
        this.syncPlayStateReactionDisposer = reaction(
            () => this.store.isPlaying,
            this.syncPlayStateToPlayer,
            {fireImmediately: true},
        );
    }

    unpatchPlayer() {
        if (this.syncPlayStateReactionDisposer) {
            this.syncPlayStateReactionDisposer();
            this.syncPlayStateReactionDisposer = null;
        }

        if (this.videoPlayerPlay) {
            this.videoPlayer.play = this.videoPlayerPlay;
            this.videoPlayer.pause = this.videoPlayerPause;

            this.videoPlayerPlay = null;
            this.videoPlayerPause = null;
        }
    }

    initializePlugins() {
        // Bandwidth tracking
        this.videoPlayer.bandwidthWatermark();

        // TODO: Check whether it is actually necessary to store the fullscreen state on the player.
        this.videoPlayer.isFullscreen(this.props.isFullscreen);
    }

    setupPlayerEvents() {
        this.videoPlayer.ready(this.videoPlayerReady);

        this.videoPlayer.one('play', () => {
            // TODO: refactor the metrics
            udApiStat.increment('udemy-video-player.viewed', {
                userModulo: udMe.id % 100,
                browser: parsedUserAgent.browser.name,
                browserVersion: parsedUserAgent.browser.majorVersion,
                platform: parsedUserAgent.os.name,
                platformVersion: parsedUserAgent.os.majorVersion,
                tech: this.videoPlayer.techName_,
                resolution: this.store.activeResolution.label,
                trackingTag: this.props.trackingTag,
                cdn: getCDNFromUrl(this.videoPlayer.currentSrc()),
                userCountry: udMe.country,
                srcType: this.videoPlayer.currentType(),
            });
        });

        this.videoPlayer.on('sourceloading', () => {
            this.store.setSeeking(true);
            this.unpatchPlayer();

            this.store.setIsSourceReady(false);
        });

        this.videoPlayer.on('sourceready', () => {
            // We enable the video state synchronization only after all the other changes to the player
            // are complete
            this.videoPlayer.forcePlay().then(() => {
                this.store.setSeeking(false);
                this.props.onPlayerReady(this.videoPlayer);

                this.patchPlayer();

                this.store.setIsSourceReady(true);

                // will update in the store the initial time, it could be different from 0 once the video player saves the last watched position
                this.store.handleTimeUpdate();
            });

            this.videoPlayer.on('play', () => this.onPlayEvent(true));
            this.videoPlayer.on('pause', () => this.onPlayEvent(false));

            this.videoPlayer.on('seeking', () => {
                this.store.setSeeking(true);

                this.videoPlayer.on(['seeked', 'canplaythrough'], () =>
                    this.store.setSeeking(false),
                );
            });

            this.videoPlayer.on('timeupdate', this.store.handleTimeUpdate);
        });

        if (this.props.onVideoProgress) {
            this.videoPlayer.on(['timeupdate', 'ended'], this.store.handleVideoProgress);
        }

        this.videoPlayer.on('dispose', this.onVideoUnavailable);

        this.videoPlayer.on('error', this.handlePlayerError);

        // "true" is passed as an argument to avoid a VideoJs warning, but it could be any argument.
        this.videoPlayer.tech(true).on('retryplaylist', this.handleRetryPlaylistEvent);

        this.videoPlayer.on('ended', () => {
            const onVideoEnd = this.props.onVideoEnd || this.defaultOnVideoEnd;
            onVideoEnd();
        });
    }

    @autobind
    async handleRetryPlaylistEvent() {
        this.store.numPlaylistRetries++;
        if (this.store.numPlaylistRetries > 2) {
            const error = {
                code: 'Too many playlist retries',
                message: 'Too many playlist retries',
            };
            this.store.handleVideoError(error);
        }
    }

    @autobind
    async handlePlayerError() {
        const error = this.videoPlayer.error() || {};
        let shouldRetry = true;
        // Handle specific errors of the video player outside the component (i.e. expired session and similar)
        if (Object.values(constants.VideoPlayerErrors).includes(error.code)) {
            shouldRetry = await this.props.onPlayerError(error.code);
        } else if (error.code in constants.VideoPlayerErrorLookup) {
            const videoPlayerError = constants.VideoPlayerErrorLookup[error.code];
            shouldRetry = await this.props.onPlayerError(videoPlayerError);
        }

        if (typeof shouldRetry === 'undefined' || shouldRetry) {
            this.store.handleVideoError(error);
        }
    }

    @autobind
    defaultOnVideoEnd() {
        this.props.exitFullscreen();
    }

    @autobind
    videoPlayerReady() {
        this.captionsStore.attachPlayer(this.videoPlayer);

        if (this.userActivityStore) {
            this.userActivityStore.setupPlayerListeners(this.videoPlayer);
        }

        this.registerHotkeys();

        // Setup sneakpeek metadata track
        if (this.props.thumbnailSprite) {
            const trackAttrs = {
                kind: 'metadata',
                label: 'sneakpeek',
                src: this.props.thumbnailSprite.vtt_url,
            };
            this.videoPlayer.addRemoteTextTrack(trackAttrs, true);
        }
    }

    @autobind
    onVideoUnavailable() {
        this.unregisterHotkeys();
        this.props.onVideoUnavailable();
    }

    registerHotkeys() {
        if (!this.props.hotkeysEnabled) {
            return;
        }
        hotkeyRegistry.registerMap(this.hotkeys);
    }

    unregisterHotkeys() {
        if (!this.props.hotkeysEnabled) {
            return;
        }
        hotkeyRegistry.unregisterMap(this.hotkeys);
    }

    @autobind
    withHotkeyCallback(fn, action) {
        return (event, ...args) => {
            event && event.preventDefault();
            action && this.props.onHotkey(action, event, ...args);
            fn(event, ...args);
        };
    }

    @autobind
    contextMenu(event) {
        event.preventDefault();
    }

    @autobind
    volumeDown() {
        this.store.volumeStore.volumeDown();
    }

    @autobind
    volumeUp() {
        this.store.volumeStore.volumeUp();
    }

    @autobind
    jumpTo(tenth) {
        this.videoPlayer.currentTime(this.store.duration * tenth * 0.1);
    }

    @autobind
    onVideoDoubleClick(event) {
        // Don't catch clicks if any control buttons are focused
        const activeEl = event.relatedTarget || event.toElement || document.activeElement;
        const el = this.videoPlayer.el();
        if (
            activeEl === el ||
            activeEl === el.querySelector('video') ||
            activeEl === el.querySelector('.iframeblocker')
        ) {
            this.props.toggleFullscreen();
        }
    }

    get playingStateNeedsSyncing() {
        return this.isPlaying !== this.store.isPlaying && !this.isInNativePlayEventGracePeriod;
    }

    @action
    onPlayEvent(isPlaying) {
        /*
        Invoked when the videojs player emits a play or pause event.
         */
        this.hasPlayed = this.hasPlayed || isPlaying;
        if (!this.playingStateNeedsSyncing) {
            // The video has emitted a 'play' or 'pause' event without going through videojs' own
            // 'play' or 'pause' functions. This is most likely because native controls have been
            // invoked (e.g. on mobile or Picture-in-Picture). Fire our callback and give a grace
            // period to give the component user a chance to update the `isPlaying` prop before
            // trying to force the playing state to match, to avoid the player 'juddering'.
            if (this.props.nativeControlGracePeriod) {
                this.isInNativePlayEventGracePeriod = true;
                setTimeout(() => {
                    this.isInNativePlayEventGracePeriod = false;
                    this.syncPlayStateToPlayer();
                }, this.props.nativeControlGracePeriod);
            }
            // Invoke the `onPlayPause` callback to alert the component user.
            isPlaying ? this.play(true) : this.pause(true);
        }
        this.onPlayStateChange(isPlaying);
    }

    onPlayStateChange(isPlaying) {
        this.props.onPlayPauseToggled(isPlaying, this.store.currentTime);
    }

    @autobind
    syncPlayStateToPlayer() {
        /*
        Whilst our `isPlaying` prop doesn't match the videojs state, periodically try and get the
        video to play or pause to match our desired state.
         */
        clearTimeout(this.playStateSyncTimeout);
        try {
            if (!this.playingStateNeedsSyncing) {
                return;
            }

            if (this.isVideoPlayerInitialized && this.store.isSourceReady) {
                this.isPlaying ? this.videoPlayerPlay() : this.videoPlayerPause();
            }

            this.playStateSyncTimeout = setTimeout(
                this.syncPlayStateToPlayer,
                constants.PLAY_STATE_SYNC_INTERVAL,
            );
        } catch (e) {
            // Since this code is called in setTimeout, it may be reached after
            // the player is removed from the DOM, in which case none of the player
            // methods are expected to work.
        }
    }

    @autobind
    play(isNative = false) {
        /*
        A user action or event has occurred that should be used to start the video playing.
         */
        this.props.onPlayPause(true, isNative);
    }

    @autobind
    pause(isNative = false) {
        /*
        A user action or event has occurred that should be used to pause the video.
         */
        this.props.onPlayPause(false, isNative);
    }

    @autobind
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    @autobind
    resetMouseActivity() {
        // https://github.com/videojs/video.js/blob/v6.12.1/src/js/player.js#L3270-L3307
        // The video.js code for detecting mouse activity breaks when mousedown events are not
        // followed by mouseup, because `setInterval` is never cleared. Consequently, the control
        // bar flickers forever. The problem happens when mousedown is on the video, and mouseup is
        // on something on top of the video, or outside the video. The most common cause of the
        // problem is the center play button, for which we've hacked a fix here.
        this.videoPlayer.trigger('mousedown');
        this.videoPlayer.trigger('mouseup');
    }

    get center() {
        const showPlayButton = this.store.isSourceReady && !this.hasPlayed;
        return (
            <div className={videoPlayerStyles.center}>
                {!showPlayButton && this.store.isSeeking && (
                    <Loader size="xxlarge" color="inherit" />
                )}
                {showPlayButton && (
                    <Button
                        udStyle="link"
                        className={videoPlayerStyles['play-button']}
                        onClick={this.togglePlayPause}
                        onMouseEnter={this.resetMouseActivity}
                        onMouseLeave={this.resetMouseActivity}
                        data-purpose="video-play-button-initial"
                    >
                        <PlayArrowIcon
                            label={gettext('Play video')}
                            size="xxlarge"
                            className={videoPlayerStyles['play-button-icon']}
                        />
                    </Button>
                )}
                {!showPlayButton && this.store.isSourceReady && (
                    <PlayPauseFeedback isPlaying={this.isPlaying} />
                )}
            </div>
        );
    }

    get preloadLinks() {
        const links = [];
        if (this.props.thumbnailSprite) {
            links.push(
                <link
                    rel="preload"
                    key="sneakpeek"
                    href={this.props.thumbnailSprite.img_url}
                    as="image"
                />,
            );
        }
        return links;
    }

    get errorDisplay() {
        if (!this.store.isErrorVisible) {
            return null;
        }
        return (
            <ErrorDisplay
                player={this.videoPlayer}
                errorBody={this.store.errorBody || this.props.errorBody}
                errorFooter={this.store.errorFooter || this.props.errorFooter}
                store={this.store}
            />
        );
    }

    renderVideoElement() {
        if (typeof this.props.renderVideoElement === 'function') {
            return this.props.renderVideoElement(this.video);
        }

        return this.video;
    }

    get video() {
        return (
            <video
                ref={(elem) => {
                    this.videoElement = elem;
                }}
                className={videoPlayerStyles['video-player']}
                id={this.props.playerId}
                preload={this.props.preload}
                controls={true}
                onContextMenu={this.contextMenu}
                controlsList={this.props.isDownloadEnabled ? '' : 'nodownload'}
                {...this.props.extraVideoAttributes}
            />
        );
    }

    render() {
        // Don't remove the first div wrapper, this.videoPlayer.dispose(); will create an error when
        // this element is removed by react via render().
        const videoWrapperStyles = classNames(videoPlayerStyles['video-wrapper'], {
            [userActivityStyles['user-inactive']]:
                this.userActivityStore && !this.userActivityStore.isUserActive,
        });

        return (
            <Provider
                captionsStore={this.captionsStore}
                captionDisplayStore={this.captionDisplayStore}
                controlBarStore={this.controlBarStore}
                userActivityStore={this.userActivityStore}
                videoPlayerStore={this.store}
                progressBarStore={this.progressBarStore}
            >
                <Measure onMeasure={this.store.setPlayerHeight}>
                    <div
                        className={classNames(videoPlayerStyles.container, 'udlite-in-udheavy')}
                        ref={this.props.setFullscreenRef}
                    >
                        <div className={videoWrapperStyles}>
                            {this.preloadLinks}
                            {!this.store.isUsingNativeControls && this.center}
                            {this.renderVideoElement()}
                            {this.videoPlayer &&
                                !this.store.isUsingNativeControls &&
                                !this.store.isErrorVisible && (
                                    <ControlBar
                                        player={this.videoPlayer}
                                        isPlaying={this.isPlaying}
                                        onPlayPause={this.props.onPlayPause}
                                    >
                                        {this.props.children}
                                    </ControlBar>
                                )}

                            {this.errorDisplay}
                        </div>
                        {/* TODO captions are fading out jankily now */}
                        {this.videoPlayer && !this.store.isUsingNativeControls && <CueDisplay />}
                    </div>
                </Measure>
            </Provider>
        );
    }
}
