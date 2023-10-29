import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {ASSET_TYPE} from 'asset/constants';
import SurveyStore from 'survey/survey.mobx-store';
import getConfigData from 'utils/get-config-data';
import getRequestData from 'utils/get-request-data';
import udApi from 'utils/ud-api';
import SystemMessage from 'utils/ud-system-message';
import userSettings, {SETTINGS} from 'utils/user-settings';
import {VideoPlayerErrors} from 'video-player/constants';

import {TRACKING_CATEGORIES} from '../../constants';
import {LECTURE_START_PARAM, MAIN_CONTENT} from '../../curriculum/constants';
import {SYSTEM_MESSAGE_FOR_SURVEY} from './captions-survey/constants';
import {
    CAPTIONS_SURVEY_MINIMUM_CONSUMPTION_THRESHOLD,
    TRACKING_ACTIONS,
    UB_MT_CAPTIONS_SURVEY_EXCLUDED_ORGS,
    VIDEO_COMPLETION_OFFSET,
    VIDEO_PROGRESS_BATCH_COUNT,
    VIDEO_START_OFFSET_WINDOW,
} from './constants';

const udConfig = getConfigData();
const udRequest = getRequestData();

export default class VideoViewerStore {
    @observable.ref player;
    isPlayerReady = false;
    wasPlayerPreviouslyPlaying;
    videoProgressBatchData = [];
    captionsSurveyStore;

    @observable isAutoplayEnabled = false;
    @observable isInterstitialVisible = false;
    @observable isHotkeyOverlayVisible = false;
    @observable isInfoOverlayVisible = false;
    @observable hasSeenCaptionsSurveys = observable.map();
    @observable isCaptionsSurveyModalVisible = false;
    @observable downloadLectureUrl = '';
    @observable currentTime = 0;
    @observable isPlaying = false;

    constructor(courseTakingStore, lectureViewStore, userActivityStore, captionsStore) {
        this.courseTakingStore = courseTakingStore;
        this.lectureViewStore = lectureViewStore;
        this.captionsStore = captionsStore;

        let url = lectureViewStore.lecture.downloadUrl;
        if (url && url.indexOf('/api-2.0/') >= 0) {
            url = url.split('/api-2.0/')[1];
        }
        this.downloadApiUrl = url;

        this._setAutoplay(userSettings.get(SETTINGS.interstitialAutoplay));
        // Autoplay if the video is the first item viewed in the course taking session.
        this.setPlayPause(!this.courseTakingStore.isFirstCurriculumItemViewed);
    }

    @autobind
    @action
    setPlayPause(isPlaying) {
        this.isPlaying = isPlaying;
    }

    @action
    _setAutoplay(value) {
        this.isAutoplayEnabled = value;
    }

    @autobind
    toggleAutoplay() {
        const autoplay = !this.isAutoplayEnabled;

        this.courseTakingStore.track(
            TRACKING_CATEGORIES.PLAYER_SETTINGS,
            TRACKING_ACTIONS.AUTOPLAY_TOGGLE,
            {newValue: autoplay},
        );

        userSettings.set(SETTINGS.interstitialAutoplay, autoplay);
        this._setAutoplay(autoplay);
    }

    @action
    showInterstitial() {
        this.isInterstitialVisible = true;
    }

    @action
    hideInterstitial() {
        this.isInterstitialVisible = false;
    }

    @autobind
    @action
    showInfoOverlay() {
        this.pause();
        this.isInfoOverlayVisible = true;
    }

    @autobind
    @action
    hideInfoOverlay() {
        this.isInfoOverlayVisible = false;
        this.resume();
    }

    @autobind
    toggleInfoOverlay() {
        if (this.isInfoOverlayVisible) {
            this.hideInfoOverlay();
        } else {
            this.showInfoOverlay();
        }
    }

    @autobind
    @action
    showHotkeys() {
        this.pause();
        this.isHotkeyOverlayVisible = true;
    }

    @autobind
    @action
    hideHotkeys() {
        this.isHotkeyOverlayVisible = false;
        this.resume();
    }

    @autobind
    toggleHotkeys() {
        if (this.isHotkeyOverlayVisible) {
            this.hideHotkeys();
        } else {
            this.showHotkeys();
        }
    }

    @autobind
    @action
    onVideoUnavailable() {
        this.player = null;
        this.isPlayerReady = false;
    }

    @autobind
    pause() {
        this.wasPlayerPreviouslyPlaying = this.isPlaying;
        this.setPlayPause(false);
    }

    @autobind
    resume() {
        if (this.wasPlayerPreviouslyPlaying) {
            this.setPlayPause(true);
        }
    }

    @autobind
    seekTo(position) {
        if (this.player && Number.isInteger(position)) {
            this.player.currentTime(position);
        }
    }

    @action
    onPlayerReady(player) {
        this.player = player;
        const {lastWatchedSecond} = this.lectureViewStore.lecture;
        const startParam = new URLSearchParams(window.location.search).get(LECTURE_START_PARAM);
        const startTime = parseInt(startParam, 10) || lastWatchedSecond;
        if (startTime) {
            this.player.currentTime(startTime);
            const duration = this.player.duration() || 0;
            if (duration - startTime < VIDEO_COMPLETION_OFFSET) {
                // Keep the player paused if seeking to a point near the end of a lecture.
                this.setPlayPause(false);
            }
        }

        this.isPlayerReady = true;
        this.lectureViewStore.onContentReady();
    }

    @autobind
    async onPlayerError(error) {
        // If the video player cannot access the media source or the DRM license we assume that
        // the signed URLs are expired and we try to refresh them.
        // The video player will automatically retry with the new data when the parent component
        // updates its props.
        const {lecture} = this.lectureViewStore;

        if (
            (error === VideoPlayerErrors.CANNOT_ACCESS_MEDIA_SOURCE && lecture.isDataExpired) ||
            (error === VideoPlayerErrors.CANNOT_RETRIEVE_DRM_LICENSE &&
                lecture.isLicenseTokenExpired)
        ) {
            await this.lectureViewStore.loadLecture();
            return false;
        }

        return true;
    }

    @autobind
    onVideoProgress(event, progressData) {
        // Only fire LectureStarted if video is actually playing, from (near) the beginning
        if (progressData.position <= VIDEO_START_OFFSET_WINDOW && this.isPlaying) {
            this.lectureViewStore.fireLectureStartedEvent();
        }
        if (
            progressData.position > 0 &&
            progressData.position > progressData.total - VIDEO_COMPLETION_OFFSET
        ) {
            this.courseTakingStore.markCurrentItemComplete();
            this.lectureViewStore.fireLectureCompletedEvent();
        }
        if (this.videoProgressBatchData.length >= VIDEO_PROGRESS_BATCH_COUNT) {
            this.sendLectureProgress();
        }
        progressData.time = new Date().toISOString();
        const activeTrack = this.captionsStore.activeTracks[0];
        progressData.captions = activeTrack && activeTrack.language;
        progressData.openPanel = this.courseTakingStore.activeSidebarContent;
        progressData.isFullscreen = this.lectureViewStore.fullscreenStore.isFullscreen;
        progressData.context = {type: 'Lecture'};
        this.videoProgressBatchData.push(progressData);
    }

    @autobind
    sendLectureProgress() {
        if (this.videoProgressBatchData.length) {
            this.lectureViewStore.lecture.updateProgress(this.videoProgressBatchData);
            this.videoProgressBatchData = [];
        }
    }

    @autobind
    @action
    onTimeUpdate(currentTime) {
        const {timeEstimation} = this.lectureViewStore.lecture.asset;

        let position = parseInt(currentTime, 10);
        this.currentTime = position;
        // If watched video lecture to the end, reset position to start.
        if (timeEstimation - position < VIDEO_COMPLETION_OFFSET) {
            position = undefined;
        }
        this.lectureViewStore.lecture.setLastWatchedSecond(position);
    }

    @autobind
    download() {
        return udApi
            .get(this.downloadApiUrl, {
                params: {
                    'fields[lecture]': 'asset',
                    'fields[asset]': 'download_urls',
                },
            })
            .then(
                action((response) => {
                    // Pick the most appropriate url to download:
                    // - If there is a url that matches the player's current resolution, use it.
                    // - Otherwise, use the generic 'download' url. This happens for Audio assets.
                    // - Otherwise, use the last url, which has the highest resolution. This happens for
                    //   HLS videos, since the player resolution is HD/SD, vs the download urls
                    //   are e.g. 360/720/1080.
                    const lecture = response.data;
                    if (!lecture.asset.download_urls) {
                        return;
                    }
                    let url = '';
                    if (this.lectureViewStore.lecture.asset.type === ASSET_TYPE.VIDEO_MASHUP) {
                        if (lecture.asset.download_urls.Presentation) {
                            url = lecture.asset.download_urls.Presentation[0].file;
                        }
                    } else {
                        const urls =
                            lecture.asset.download_urls.Video || lecture.asset.download_urls.Audio;
                        url = urls[urls.length - 1].file;
                        for (let i = 0; i < urls.length; i++) {
                            if (urls[i].label === 'download') {
                                url = urls[i].file;
                            }
                            // Client may have left the player by the time this async code is resolving
                            if (this.player && urls[i].label === this.player.resolution) {
                                url = urls[i].file;
                                break;
                            }
                        }
                    }
                    this.downloadLectureUrl = url;
                }),
            );
    }

    @autobind
    @action
    finishDownload() {
        this.downloadLectureUrl = '';
        this.lectureViewStore.lecture.markAsComplete(true);
        this.courseTakingStore.track(TRACKING_CATEGORIES.LECTURE_DOWNLOAD);
    }

    @autobind
    onVideoEnd() {
        if (this.courseTakingStore.showReviewPromptIfNeeded()) {
            return;
        }

        if (this.courseTakingStore.showLabsPromptIfNeeded()) {
            return;
        }

        if (this.courseTakingStore.nextCurriculumItem) {
            this.showInterstitial();
        } else {
            // Show end screen on the last video end
            this.courseTakingStore.setMainContentType(MAIN_CONTENT.END_SCREEN);
        }
    }

    @action
    setHasSeenCaptionsSurvey(surveyCode, seen) {
        this.hasSeenCaptionsSurveys.set(surveyCode, seen);
    }

    @action
    async showCaptionsFeedbackModal(surveyCode) {
        this.pause();
        if (this.isCaptionsSurveyModalVisible) {
            return;
        }

        this.captionsSurveyStore = new SurveyStore(surveyCode, this.courseTakingStore.courseId);
        this.isCaptionsSurveyModalVisible = true;
        await this.captionsSurveyStore.getSurvey();
        this.captionsSurveyStore.setUserAnswers({});

        const {organization} = udConfig.brand;
        const {activeTracks} = this.captionsStore;
        this.captionsSurveyStore.setUserAnswerData({
            captionsLanguage: activeTracks.length ? activeTracks[0].language : undefined,
            requestLocale: udRequest.locale,
            organizationId: organization ? organization.id : null,
        });
    }

    @autobind
    @action
    hideCaptionsFeedbackModal() {
        this.isCaptionsSurveyModalVisible = false;
        this.captionsSurveyStore = undefined;
    }

    @autobind
    checkHasSeenCaptionsSurvey(surveyCode) {
        SystemMessage.hasSeen(SYSTEM_MESSAGE_FOR_SURVEY[surveyCode], {
            obj_id: this.courseTakingStore.courseId,
            obj_type: 'course',
        }).then((response) => this.setHasSeenCaptionsSurvey(surveyCode, response.data));
    }

    markAsSeenCaptionsSurvey(surveyCode) {
        SystemMessage.seen(SYSTEM_MESSAGE_FOR_SURVEY[surveyCode], {
            obj_id: this.courseTakingStore.courseId,
            obj_type: 'course',
        });
        this.setHasSeenCaptionsSurvey(surveyCode, true);
    }

    @computed
    get canShowCaptionSurveyToast() {
        // Do not show survey if the user is not using captions
        const {completedVideoContentLength} = this.courseTakingStore;

        if (completedVideoContentLength < CAPTIONS_SURVEY_MINIMUM_CONSUMPTION_THRESHOLD) {
            return false;
        }

        // For UB, show survey if the org is not excluded
        if (udConfig.brand.has_organization) {
            return !UB_MT_CAPTIONS_SURVEY_EXCLUDED_ORGS.includes(udConfig.brand.organization.id);
        }

        return true;
    }
}
