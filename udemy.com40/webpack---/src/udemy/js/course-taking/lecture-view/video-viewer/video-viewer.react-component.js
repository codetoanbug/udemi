import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import LockIcon from '@udemy/icons/dist/lock.ud-icon';
import NoteAddIcon from '@udemy/icons/dist/note-add.ud-icon';
import TranscriptIcon from '@udemy/icons/dist/transcript.ud-icon';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {computed, reaction} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router-dom';

import {ASSET_TYPE} from 'asset/constants';
import VideoMashupAsset from 'asset/video/mashup/video-mashup-asset.react-component';
import * as ShakaVideoAsset from 'asset/video/shaka-video-asset.react-component';
import * as VideoJSVideoAsset from 'asset/video/video-asset.react-component';
import {getDeviceType, DEVICE_TYPE_DESKTOP} from 'browse/lib/device-type';
import {TRIAL_MESSAGES} from 'organization-trial/constants';
import {CATEGORY as REPORT_ABUSE_CATEGORY} from 'report-abuse/constants';
import ReportAbuseModalTrigger from 'report-abuse/report-abuse-modal-trigger.react-component';
import * as ShakaCaptionStore from 'shaka-video-player/captions/captions.mobx-store';
import * as ShakaVideoControlBarDropdown from 'shaka-video-player/control-bar/video-control-bar-dropdown.react-component';
import * as ShakaProgressBarStore from 'shaka-video-player/progress-bar/shaka-progress-bar.mobx-store';
import getConfigData from 'utils/get-config-data';
import getRequestData from 'utils/get-request-data';
import hotkeyRegistry from 'utils/hotkeys';
import {noop} from 'utils/noop';
import {getQueryParams} from 'utils/query-params';
import udLink from 'utils/ud-link';
import {isMobileBrowser} from 'utils/user-agent/get-is-mobile-browser';
import * as VideoJSCaptionStore from 'video-player/captions/captions.mobx-store';
import {SEEK_INTERVAL} from 'video-player/constants';
import * as Controls from 'video-player/control-bar/controls';
import * as VideoJSVideoControlBarDropdown from 'video-player/control-bar/video-control-bar-dropdown.react-component';
import {ERROR_BODY} from 'video-player/error-display.react-component';
import * as VideoJSProgressBarStore from 'video-player/progress-bar/progress-bar.mobx-store';
import {PlayerGlobalData} from 'video-player/videojs-setup/drm.js';

import {SIDEBAR_CONTENT, TRACKING_CATEGORIES} from '../../constants';
import {LECTURE_START_PARAM} from '../../curriculum/constants';
import TheatreModeToggle from '../../curriculum/controls/theatre-mode-toggle.react-component';
import FileDownload from '../../file-download.react-component';
import registers from '../../registry/registers';
import requires from '../../registry/requires';
import * as BOOKMARK_CONST from './bookmarks/constants';
import VideoBookmarksStore from './bookmarks/video-bookmarks.mobx-store';
import VideoBookmarks from './bookmarks/video-bookmarks.react-component';
import CaptionsSurveyDialog from './captions-survey/captions-survey-dialog.react-component';
import {HOTKEYS, VIDEO_PROGRESS_INTERVAL} from './constants';
import HotkeyFeedback from './hotkey-feedback.react-component';
import ContentInfoOverlay from './info-overlay/content-info-overlay.react-component';
import HotkeyOverlay from './info-overlay/hotkey-overlay.react-component';
import Interstitial from './interstitial/interstitial.react-component';
import TranscriptStore from './transcript/transcript.mobx-store';
import VideoToastsContainer from './video-toasts-container.react-component';
import VideoViewerStore from './video-viewer.mobx-store';
import './video-viewer.less';

const udConfig = getConfigData();
const udRequest = getRequestData();
const deviceType = getDeviceType();

let VideoAsset = null;
let CaptionsStore = null;
let ProgressBarStore = null;
let VideoControlBarDropdown = null;
let VideoControlBarButton = null;
let IsMockVjsStyleNeeded = false;
let IsShakaPlayerEnabled = false;

if (deviceType === DEVICE_TYPE_DESKTOP && udConfig?.brand?.has_organization) {
    VideoAsset = ShakaVideoAsset.ShakaVideoAsset;
    CaptionsStore = ShakaCaptionStore.CaptionsStore;
    ProgressBarStore = ShakaProgressBarStore.ShakaProgressBarStore;
    VideoControlBarDropdown = ShakaVideoControlBarDropdown.VideoControlBarDropdown;
    VideoControlBarButton = ShakaVideoControlBarDropdown.VideoControlBarButton;
    IsMockVjsStyleNeeded = true;
    IsShakaPlayerEnabled = true;
} else {
    VideoAsset = VideoJSVideoAsset.default;
    CaptionsStore = VideoJSCaptionStore.default;
    ProgressBarStore = VideoJSProgressBarStore.default;
    VideoControlBarDropdown = VideoJSVideoControlBarDropdown.default;
    VideoControlBarButton = VideoJSVideoControlBarDropdown.VideoControlBarButton;
    IsMockVjsStyleNeeded = false;
    IsShakaPlayerEnabled = false;
}
@withRouter
@inject('fullscreenStore')
@requires('courseTakingStore', 'lectureViewStore', 'userActivityStore', 'bookmarksStore')
@registers(
    'videoViewerStore',
    'captionsStore',
    'videoBookmarksStore',
    'transcriptStore',
    'progressBarStore',
)
@observer
export default class VideoViewer extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        lectureViewStore: PropTypes.object.isRequired,
        userActivityStore: PropTypes.object.isRequired,
        bookmarksStore: PropTypes.object.isRequired,
        fullscreenStore: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.transcriptRef = React.createRef();

        this.captionsStore = new CaptionsStore(
            props.lectureViewStore.lecture.asset.captions,
            true,
            {
                [udRequest.locale.split('_')[0]]: 1,
                [props.courseTakingStore.course.locale.locale.split('_')[0]]: 2,
            },
        );

        this.videoViewerStore = new VideoViewerStore(
            props.courseTakingStore,
            props.lectureViewStore,
            props.userActivityStore,
            this.captionsStore,
        );
        this.videoBookmarksStore = new VideoBookmarksStore(
            props.lectureViewStore.lecture.id,
            props.courseTakingStore,
            props.bookmarksStore,
        );
        this.transcriptStore = new TranscriptStore(props.courseTakingStore, this.captionsStore);

        // The bookmarks will use the ref value in this store to render the social and user bookmark indication inside the progress bar
        this.progressBarStore = new ProgressBarStore();

        this.hotkeyMap = [
            {
                name: gettext('Keyboard shortcuts'),
                key: HOTKEYS.SHOW_MENU,
                isShowShortcuts: true,
                fn: this.videoViewerStore.toggleHotkeys,
            },
            {
                name: gettext('Play / pause'),
                key: HOTKEYS.PLAY_PAUSE,
            },
            {
                name: gettext('Speed slower'),
                key: HOTKEYS.SLOWER,
            },
            {
                name: gettext('Speed faster'),
                key: HOTKEYS.FASTER,
            },
            {
                name: gettext('Fullscreen'),
                key: HOTKEYS.TOGGLE_FULLSCREEN,
            },
            {
                name: gettext('Exit fullscreen'),
                key: HOTKEYS.EXIT_FULLSCREEN,
            },
            {
                name: gettext('Add note'),
                key: HOTKEYS.ADD_BOOKMARK,
                fn: this.videoBookmarksStore.newBookmark,
            },
            {
                name: gettext('Toggle captions'),
                key: HOTKEYS.ACTIVATE_CC,
                fn: this.captionsStore.toggleDefaultCaption,
            },
            {
                name: interpolate(
                    gettext('Go back %(interval)ss'),
                    {interval: SEEK_INTERVAL},
                    true,
                ),
                key: HOTKEYS.BACK,
            },
            {
                name: interpolate(
                    gettext('Go forward %(interval)ss'),
                    {interval: SEEK_INTERVAL},
                    true,
                ),
                key: HOTKEYS.FORWARD,
            },
            {
                name: gettext('Volume up'),
                key: HOTKEYS.VOLUME_UP,
            },
            {
                name: gettext('Volume down'),
                key: HOTKEYS.VOLUME_DOWN,
            },
            {
                name: gettext('Mute'),
                key: HOTKEYS.MUTE,
            },
            {
                name: gettext('Content information'),
                key: HOTKEYS.SHOW_CONTENT_INFO,
                fn: this.videoViewerStore.toggleInfoOverlay,
            },
        ];

        reaction(
            () => this.startParam,
            () => {
                this.videoViewerStore.seekTo(parseInt(this.startParam, 10));
                this.videoViewerStore.setPlayPause(true);
            },
        );
    }

    componentDidMount() {
        // Make sure that progress is tracked even if the user closes the window.
        window.addEventListener('beforeunload', this.videoViewerStore.sendLectureProgress);
        this.props.userActivityStore.addHideOnInactive(this.titleOverlayRef);
        this.props.userActivityStore.addActiveOnHover(this.titleOverlayRef);
    }

    componentDidUpdate() {
        if (
            this.transcriptRef.current &&
            this.props.courseTakingStore.isTranscriptButtonHighlighted
        ) {
            // eslint-disable-next-line react/no-find-dom-node
            const button = ReactDOM.findDOMNode(this.transcriptRef.current);
            button.focus();
        }
    }

    componentWillUnmount() {
        hotkeyRegistry.unregisterMap(this.hotkeyMap);

        window.removeEventListener('beforeunload', this.videoViewerStore.sendLectureProgress);
        this.videoViewerStore.sendLectureProgress();
        this.transcriptStore.cleanup();
    }

    @computed get startParam() {
        return new URLSearchParams(this.props.location.search).get(LECTURE_START_PARAM) || 0;
    }

    @autobind
    setTitleOverlayRef(ref) {
        this.titleOverlayRef = ref;
    }

    @autobind
    onPlayerReady(player) {
        // TODO stop using player element directly, interact with the VideoPlayer component through props
        this.videoViewerStore.onPlayerReady(player);
        this.videoBookmarksStore.onPlayerReady(player);
        hotkeyRegistry.registerMap(this.hotkeyMap);
    }

    @autobind
    handleReportAbuse() {
        this.videoViewerStore.pause();
        this.props.courseTakingStore.track(TRACKING_CATEGORIES.REPORT_VISIT);
    }

    @autobind
    onClickTranscriptButton() {
        const {courseTakingStore} = this.props;
        if (courseTakingStore.activeSidebarContent === SIDEBAR_CONTENT.TRANSCRIPT) {
            courseTakingStore.deselectSidebarContent(false);
        } else {
            courseTakingStore.selectSidebarContent(SIDEBAR_CONTENT.TRANSCRIPT, true);
        }
    }

    @autobind
    onClickAddBookmarkButton() {
        const location = this.props.courseTakingStore.isSidebarVisible
            ? BOOKMARK_CONST.TRACKING_LOCATIONS.VIDEO_PLAYER_STANDARD_MODE
            : BOOKMARK_CONST.TRACKING_LOCATIONS.VIDEO_PLAYER_EXPANDED_MODE;
        this.props.courseTakingStore.track(
            TRACKING_CATEGORIES.BOOKMARK_ACTION,
            BOOKMARK_CONST.TRACKING_ACTIONS.NOTE_ICON_CLICK,
            {location},
        );
        this.videoBookmarksStore.newBookmark();
    }

    get isDownloadable() {
        const {lectureViewStore, courseTakingStore} = this.props;
        const {lecture} = lectureViewStore;

        return Boolean(
            lecture.downloadUrl &&
                !lecture.asset.isCourseDrmed &&
                !lecture.asset.isEncrypted &&
                !courseTakingStore.isLimitedConsumptionTrial,
        );
    }

    @autobind
    onClickDownload() {
        // Return true to close the menu, and more importantly, focus on the trigger button.
        // Otherwise focus gets lost because download triggers a click on an invisible link.
        this.videoViewerStore.download();
        return true;
    }

    get renderBookmarkButton() {
        if (this.props.fullscreenStore.isFullscreen) {
            return null;
        }

        return (
            <VideoControlBarButton
                data-purpose="add-bookmark"
                tooltipProps={{a11yRole: 'none', children: gettext('Add note')}}
                onClick={this.onClickAddBookmarkButton}
            >
                <NoteAddIcon label={gettext('Add note')} size="medium" />
            </VideoControlBarButton>
        );
    }

    get transcriptToggle() {
        const {courseTakingStore, fullscreenStore} = this.props;
        const ariaExpanded = courseTakingStore.activeSidebarContent === SIDEBAR_CONTENT.TRANSCRIPT;
        if (
            courseTakingStore.sidebarContentAvailability[SIDEBAR_CONTENT.TRANSCRIPT] &&
            !fullscreenStore.isFullscreen
        ) {
            return (
                <VideoControlBarButton
                    aria-expanded={ariaExpanded}
                    data-purpose="transcript-toggle"
                    tooltipProps={{
                        a11yRole: 'none',
                        children: gettext('Transcript'),
                        ref: this.transcriptRef,
                    }}
                    onClick={this.onClickTranscriptButton}
                >
                    <TranscriptIcon label={gettext('Transcript in sidebar region')} size="medium" />
                </VideoControlBarButton>
            );
        }
    }

    get interstitial() {
        if (!this.videoViewerStore.isInterstitialVisible) {
            return null;
        }
        return <Interstitial />;
    }

    get fileDownload() {
        if (!this.videoViewerStore.downloadLectureUrl) {
            return null;
        }

        return (
            <FileDownload
                downloadUrl={this.videoViewerStore.downloadLectureUrl}
                onDownloadStarted={this.videoViewerStore.finishDownload}
            />
        );
    }

    get downloadTooltip() {
        let tooltipContent;
        let Icon = InfoIcon;
        if (this.props.courseTakingStore.isLimitedConsumptionTrial) {
            Icon = LockIcon;
            tooltipContent = TRIAL_MESSAGES.CONTENT_LOCKED;
        } else if (!this.isDownloadable) {
            tooltipContent = (
                <>
                    {gettext('Not all courses can be downloaded.')}{' '}
                    <a
                        className="ud-link-underline"
                        target="_blank"
                        href={udLink.toSupportLink('course_taking__course_player__downloading')}
                        rel="noopener noreferrer"
                    >
                        {gettext('Learn more')}
                    </a>
                </>
            );
        }
        if (tooltipContent) {
            return (
                <VideoControlBarDropdown.Popover
                    placement="left"
                    canToggleOnHover={true}
                    a11yRole="description"
                    styleName="popover-icon-container"
                    trigger={
                        <Button udStyle="link" styleName="popover-icon-container">
                            <Icon label={gettext('Get info')} color="inherit" />
                        </Button>
                    }
                >
                    {tooltipContent}
                </VideoControlBarDropdown.Popover>
            );
        }
        return null;
    }

    @autobind
    getOverlayContainer() {
        return this.props.fullscreenStore.ref || document.body;
    }

    get extraSettings() {
        const {lecture} = this.props.lectureViewStore;
        const menuItemList = [
            <li key="settings-separator" role="separator" />,
            <VideoControlBarDropdown.MenuItem
                key="autoplay"
                onClick={this.videoViewerStore.toggleAutoplay}
                aria-checked={this.videoViewerStore.isAutoplayEnabled}
                role="menuitemcheckbox"
            >
                {gettext('Autoplay')}
            </VideoControlBarDropdown.MenuItem>,
            <VideoControlBarDropdown.MenuItem
                key="download-lecture"
                componentClass={this.isDownloadable ? 'button' : 'div'}
                onClick={this.isDownloadable ? this.onClickDownload : null}
                disabled={!this.isDownloadable}
                data-purpose="download-lecture"
                styleName="download-lecture"
            >
                {this.downloadTooltip}
                {lecture.asset.type === ASSET_TYPE.VIDEO_MASHUP
                    ? gettext('Download slides')
                    : gettext('Download lecture')}
            </VideoControlBarDropdown.MenuItem>,
            <VideoControlBarDropdown.MenuItem
                key="show-keyboard-shortcuts"
                onClick={this.videoViewerStore.showHotkeys}
                data-purpose="show-keyboard-shortcuts"
            >
                {gettext('Keyboard shortcuts')}
            </VideoControlBarDropdown.MenuItem>,
            <VideoControlBarDropdown.MenuItem
                key="show-video-info"
                onClick={this.videoViewerStore.showInfoOverlay}
                data-purpose="show-video-info"
            >
                {gettext('Content information')}
            </VideoControlBarDropdown.MenuItem>,
        ];

        if (udConfig.features.report_abuse) {
            menuItemList.push(
                <ReportAbuseModalTrigger
                    key="report-abuse"
                    objectType="lecture"
                    objectId={lecture.id}
                    category={REPORT_ABUSE_CATEGORY.POLICY}
                    modalProps={{getContainer: this.getOverlayContainer}}
                    onClose={this.videoViewerStore.resume}
                    trigger={
                        <VideoControlBarDropdown.MenuItem
                            onClick={this.handleReportAbuse}
                            data-purpose="report-abuse"
                        >
                            {gettext('Report abuse')}
                        </VideoControlBarDropdown.MenuItem>
                    }
                />,
            );
        }
        return menuItemList;
    }

    get headerGradient() {
        const {
            isSidebarVisible,
            isMobileViewportSize,
            isMediumScreenViewportSize,
            currentCurriculumItem,
        } = this.props.courseTakingStore;

        const {isFullscreen} = this.props.fullscreenStore;
        const isTitleVisible = (!isSidebarVisible || isFullscreen) && !isMobileViewportSize;

        const isHeaderGradientVisible =
            isTitleVisible || (isMediumScreenViewportSize && !isMobileViewportSize);

        return (
            <div ref={this.setTitleOverlayRef}>
                {isHeaderGradientVisible && <div styleName="header-gradient" />}
                <div
                    className={isFullscreen ? 'ud-text-xl' : 'ud-text-md'}
                    styleName="title-overlay"
                >
                    {isTitleVisible && currentCurriculumItem.displayTitle}
                </div>
            </div>
        );
    }

    @computed
    get videoPlayerProps() {
        const {course} = this.props.courseTakingStore;
        const {lecture} = this.props.lectureViewStore;
        const {asset} = lecture;

        let errorBody, errorFooter;
        if (lecture.downloadUrl) {
            // Try not to repeat ourselves by grabbing the first two paragraphs of the default error message.
            errorBody = [
                ...ERROR_BODY.slice(0, 3),
                <p key="download">
                    {gettext('Please try again in a few minutes or download the lecture now.')}
                </p>,
            ];
            errorFooter = (
                <Button onClick={this.videoViewerStore.download}>{gettext('Download')}</Button>
            );
        }

        const playerProps = {
            mediaLicenseToken: asset.mediaLicenseToken,
            mediaSources: asset.mediaSources,
            onPlayerReady: this.onPlayerReady,
            onPlayerError: this.videoViewerStore.onPlayerError,
            onVideoProgress: this.videoViewerStore.onVideoProgress,
            videoProgressInterval: VIDEO_PROGRESS_INTERVAL,
            onTimeUpdate: this.videoViewerStore.onTimeUpdate,
            controlsTrackingEnabled: true,
            onVideoUnavailable: this.videoViewerStore.onVideoUnavailable,
            onVideoEnd: this.videoViewerStore.onVideoEnd,
            trackingTag: 'ctp_lecture',
            preload: 'auto',
            captionsStore: this.captionsStore,
            userActivityStore: this.props.userActivityStore,
            onPlayPause: this.videoViewerStore.setPlayPause,
            hotkeysEnabled: !isMobileBrowser,
            errorBody,
            errorFooter,
            toggleFullscreen: this.props.fullscreenStore.toggleFullscreen,
            isFullscreen: this.props.fullscreenStore.isFullscreen,
            progressBarStore: this.progressBarStore,
            setFullscreenRef: noop,
            muxMetadata: {
                playerName: 'Lecture Video Player',
                assetId: asset.id,
                duration: asset.timeEstimation,
                courseId: course.id,
                isPaid: course.isPaid,
            },
            isDownloadEnabled: this.isDownloadable,
            isMockVjsStyleNeeded: IsMockVjsStyleNeeded,
        };

        const isDefaultPlaying = 'isDefaultPlaying' in getQueryParams();
        if (isDefaultPlaying) {
            playerProps.isDefaultPlaying = true;
        } else {
            playerProps.isPlaying = this.videoViewerStore.isPlaying;
        }

        return playerProps;
    }

    get infoMap() {
        return [
            {
                name: gettext('Content type'),
                value: this.props.lectureViewStore.lecture.asset.type,
            },
            {
                name: gettext('Course contains encrypted videos'),
                value: this.props.lectureViewStore.lecture.asset.isCourseDrmed
                    ? gettext('Yes')
                    : gettext('No'),
            },
            {
                name: gettext('Is this video encrypted'),
                value: this.props.lectureViewStore.lecture.asset.isEncrypted
                    ? `${gettext('Yes')}, ${gettext('DRM used')}: ${PlayerGlobalData.drmTechUsed}`
                    : gettext('No'),
            },
        ];
    }

    render() {
        const {isMobileView} = this.props.courseTakingStore;
        const {lecture} = this.props.lectureViewStore;
        const {asset} = lecture;

        const AssetComponent =
            asset.type === ASSET_TYPE.VIDEO_MASHUP ? VideoMashupAsset : VideoAsset;

        return (
            <div
                styleName="container"
                ref={(ref) => {
                    this.ref = ref;
                }}
            >
                <AssetComponent
                    id={asset.id}
                    asset={asset}
                    playerOptions={this.videoPlayerProps}
                    courseId={lecture.courseId}
                    lectureId={lecture.id}
                    isShakaPlayerEnabled={IsShakaPlayerEnabled}
                >
                    {!isMobileView && <VideoToastsContainer />}
                    <Controls.PlayToggle />
                    <Controls.RewindSkipButton />
                    <Controls.PlaybackRateMenu />
                    <Controls.ForwardSkipButton />
                    <Controls.ProgressDisplay />
                    {this.renderBookmarkButton}
                    <Controls.Spacer />
                    <Controls.VolumeControl />
                    {this.transcriptToggle}
                    <Controls.CaptionsMenu />
                    <Controls.SettingsMenu>
                        {this.extraSettings}
                        <ContentInfoOverlay
                            infoMap={this.infoMap}
                            isOpen={this.videoViewerStore.isInfoOverlayVisible}
                            onClose={this.videoViewerStore.hideInfoOverlay}
                            container={this.ref}
                        />
                        <HotkeyOverlay
                            keyMap={this.hotkeyMap}
                            isOpen={this.videoViewerStore.isHotkeyOverlayVisible}
                            onClose={this.videoViewerStore.hideHotkeys}
                            container={this.ref}
                        />
                    </Controls.SettingsMenu>
                    <Controls.FullscreenToggle fullscreenStore={this.props.fullscreenStore} />
                    <TheatreModeToggle
                        componentClass={VideoControlBarButton}
                        fullscreenStore={this.props.fullscreenStore}
                    />
                </AssetComponent>
                {this.videoViewerStore.player && !isMobileBrowser && (
                    <HotkeyFeedback keyMap={this.hotkeyMap} />
                )}

                <VideoBookmarks />

                {this.headerGradient}
                {this.interstitial}
                {!isMobileView && this.videoViewerStore.isCaptionsSurveyModalVisible && (
                    <CaptionsSurveyDialog />
                )}
                {this.fileDownload}
            </div>
        );
    }
}
