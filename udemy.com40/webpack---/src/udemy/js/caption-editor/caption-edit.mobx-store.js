import autobind from 'autobind-decorator';
import {observable, action, computed, when, runInAction} from 'mobx';

import {createFile} from 'caption/caption.mobx-model';
import {noop} from 'utils/noop';
import udApi from 'utils/ud-api';
import udApiStat from 'utils/ud-api-stat';
import userSettings, {SETTINGS} from 'utils/user-settings';
import CaptionsStore from 'video-player/captions/captions.mobx-store';
import {TRACK_MODES} from 'video-player/captions/constants';

import {CAPTION_STATUS_CHOICES} from '../caption/constants';
import {DRAFT_CAPTION_REQUEST_FIELDS} from '../course-captions/constants';
import {
    LOW_CONFIDENCE_THRESHOLD,
    LOW_CAPTION_QUALITY_MESSAGE,
    ERRORS,
    ASSET_REQUEST_FIELDS,
    MONITORING_EVENTS,
} from './constants';

export default class CaptionEditStore {
    captionsStore = null;
    videoPlayer = null;

    @observable.ref asset = null;
    @observable.ref videoCaption = null;
    @observable.ref transcriptCaption = null;

    @observable editingCueId = null;

    @observable error = null;

    @observable pauseWhenTyping = true;

    @observable isEditorLoading = true;
    @observable isAssetLoading = true;
    @observable isVideoPlaying = false;

    @observable isSaving = false;
    @observable isProcessing = false;
    @observable isDirty = false;

    @observable.ref errorModalContent = {title: '', text: '', actions: []};
    @observable isExitModalVisible = false;

    @observable isHotkeyOverlayVisible = false;
    seenMessages = observable.map({});

    _makeKeyMapFn(fn) {
        fn.shouldCall = () => true;
        return fn;
    }

    keyMap = [
        {
            name: gettext('Play / Pause'),
            key: 'shift+space',
            fn: this._makeKeyMapFn(this.toggleVideoPlayPause),
        },
        {
            name: gettext('Go forward one second'),
            key: 'shift+right',
            fn: this._makeKeyMapFn(this.skipVideoPlayerTime.bind(this, 1)),
        },
        {
            name: gettext('Go back one second'),
            key: 'shift+left',
            fn: this._makeKeyMapFn(this.skipVideoPlayerTime.bind(this, -1)),
        },
        {
            name: gettext('Edit next caption'),
            key: 'shift+down',
            fn: this._makeKeyMapFn(this.selectNextCue),
        },
        {
            name: gettext('Edit previous caption'),
            key: 'shift+up',
            fn: this._makeKeyMapFn(this.selectPrevCue),
        },
    ];

    constructor(
        courseId,
        assetId,
        videoCaptionLocaleId,
        transcriptLocaleId,
        uploader,
        onCaptionCreated,
        exitFn,
        onPlayerReady,
    ) {
        this.courseId = courseId;
        this.assetId = assetId;
        this.videoCaptionLocaleId = videoCaptionLocaleId;
        this.transcriptLocaleId = transcriptLocaleId;
        this.uploader = uploader;
        this.onCaptionCreated = onCaptionCreated;
        this.exitFn = exitFn;
        this.onPlayerReadyCallback = onPlayerReady;
        this.setPauseWhenTypingSetting(userSettings.get(SETTINGS.captionEditorPauseWhenTyping));

        when(
            () => this.error,
            () => {
                udApiStat.increment(MONITORING_EVENTS.ERROR, {error: this.error.type});
            },
        );
    }

    get APIFieldFilters() {
        return ASSET_REQUEST_FIELDS;
    }

    initialise() {
        return udApi
            .get(`/assets/${this.assetId}/`, {params: this.APIFieldFilters})
            .then(
                action((response) => {
                    this.asset = response.data;
                    const captionsOfInterest = this.asset.captions.filter((caption) => {
                        return [this.videoCaptionLocaleId, this.transcriptLocaleId].includes(
                            caption.locale_id,
                        );
                    });
                    this.captionsStore = new CaptionsStore(captionsOfInterest, false);
                    this.captionsStore.captions.forEach((caption) => {
                        if (caption.locale === this.videoCaptionLocaleId) {
                            this.videoCaption = caption;
                        }
                        if (caption.locale === this.transcriptLocaleId) {
                            this.transcriptCaption = caption;
                        }
                    });
                    this.videoCaption.setMode(TRACK_MODES.ACTIVE);
                    if (this.transcriptCaption !== this.videoCaption) {
                        // Prevent this appearing in the captions menu on mobile.
                        this.transcriptCaption.setMode(TRACK_MODES.INACTIVE);
                    }
                    this.isAssetLoading = false;
                }),
            )
            .catch(() => this.setError(ERRORS.LOADING));
    }

    async fetchDraftCaptions() {
        const response = await udApi.get(
            `courses/${this.courseId}/assets/${this.assetId}/draft-captions/`,
            {
                ...DRAFT_CAPTION_REQUEST_FIELDS,
                locale: this.videoCaptionLocaleId,
            },
        );
        runInAction(() => {
            const draft = response.data.results.find((dc) =>
                [this.videoCaptionLocaleId, this.transcriptLocaleId].includes(dc.locale_id),
            );
            this.isProcessing = draft?.status === 0;
            if (this.isProcessing) {
                this.setCurrentCue(null);
            }
        });
    }

    get messages() {
        return [this.editingLowQualityCaptionMessage].filter((x) => x);
    }

    @computed
    get editingLowQualityCaptionMessage() {
        if (
            this.transcriptCaption &&
            this.transcriptCaption.confidenceThreshold <= LOW_CONFIDENCE_THRESHOLD
        ) {
            return LOW_CAPTION_QUALITY_MESSAGE;
        }
    }

    hasSeenAlert(messageId) {
        return this.seenMessages.get(messageId);
    }

    @autobind
    @action
    dismissMessageAlert(messageId) {
        this.seenMessages.set(messageId, true);
    }

    @autobind
    @action
    onPlayerReady(player) {
        this.videoPlayer = player;
        this.isEditorLoading = false;

        when(() => this.captionsStore.isLoaded, this.initialiseCues);

        when(
            () => this.captionsStore.hasError,
            () => this.setError(ERRORS.PARSING),
        );

        this.onPlayerReadyCallback(player);
    }

    @autobind
    @action
    onVideoPlayPause(isPlaying) {
        this.isVideoPlaying = isPlaying;
    }

    @autobind
    initialiseCues() {
        if (!this.localCues.length) {
            // Empty captions file.
            return;
        }
        if (this.isProcessing) {
            this.setCurrentCue(null);
            return;
        }
        const firstCue = this.localCues[0];
        this.setVideoPlayerTime(firstCue);
        this.setCurrentCue(firstCue.id);
    }

    @autobind
    @action
    toggleVideoPlayPause(event) {
        // Prevent default shift+space behaviour (i.e. inserting a space).
        event.preventDefault();
        this.isVideoPlaying = !this.isVideoPlaying;
    }

    @autobind
    skipVideoPlayerTime(time, event) {
        // Prevent the selection of text.
        event.preventDefault();
        this.videoPlayer.currentTime(this.videoPlayer.currentTime() + time);
    }

    @autobind
    @action
    setVideoPlayerTime(cue) {
        if (cue.startTime !== this.videoPlayer.currentTime()) {
            this.videoPlayer.currentTime(cue.startTime);
        }
    }

    @autobind
    @action
    setCurrentCue(cueId) {
        this.editingCueId = cueId;
    }

    @autobind
    selectCue(cue) {
        if (!this.playingCueIds.includes(cue.id)) {
            this.setVideoPlayerTime(cue);
        }
        this.setCurrentCue(cue.id);
    }

    @autobind
    selectNextCue(event) {
        // Prevent the selection of text.
        event.preventDefault();
        const nextCue = this.localCues[this.editingCueIndex + 1];
        if (nextCue) {
            this.selectCue(nextCue);
        }
    }

    @autobind
    selectPrevCue(event) {
        // Prevent the selection of text.
        event.preventDefault();
        const prevCue = this.localCues[this.editingCueIndex - 1];
        if (prevCue) {
            this.selectCue(prevCue);
        }
    }

    @autobind
    @action
    onCueContentChange(cue, newText) {
        this.isDirty = true;

        cue.setText(newText);

        if (this.pauseWhenTyping) {
            this.isVideoPlaying = false;
        }
    }

    @action
    markCorrect(cue, isCorrect) {
        this.isDirty = true;
        cue.markCorrect(isCorrect);
    }

    @action
    setPauseWhenTypingSetting(value) {
        this.pauseWhenTyping = value;
    }

    @autobind
    togglePauseWhenTypingSetting() {
        this.setPauseWhenTypingSetting(!this.pauseWhenTyping);
        userSettings.set(SETTINGS.captionEditorPauseWhenTyping, this.pauseWhenTyping);
    }

    @autobind
    @action
    hideCloseEditorModal() {
        this.isExitModalVisible = false;
    }

    @autobind
    @action
    exitEditor(force = false) {
        // When force == true, ignore unsaved changes and just quit the app.
        if (this.isDirty) {
            if (force) {
                this.isDirty = false;
            } else {
                this.isExitModalVisible = true;
                return false;
            }
        }
        this.exitFn();
        return true;
    }

    @autobind
    forceExitEditor() {
        this.exitEditor(true);
    }

    @autobind
    @action
    saveAsFile() {
        this.editingCueId = null;
        this.isSaving = true;

        const fileName = this.transcriptCaption.title;
        const file = createFile(this.transcriptCaption, fileName);
        file.isEdit = true;

        let newCaption = {};
        return new Promise((resolve, reject) => {
            this.uploader.upload(file, this.asset, this.transcriptLocaleId, {
                onError: action((error) => {
                    this.setError(ERRORS.SAVING);
                    this.isSaving = false;
                    reject(error);
                }),
                onProgress: noop,
                onUploadComplete: action((caption) => {
                    newCaption = caption;
                    this.isSaving = false;
                    this.isDirty = false;
                    this.isProcessing = true;
                    newCaption.status = CAPTION_STATUS_CHOICES.PROCESSING;
                    this.onCaptionCreated(newCaption);
                }),
                onProcessComplete: action((status) => {
                    this.isProcessing = false;
                    newCaption.status = status;
                    this.onCaptionCreated(newCaption);
                    resolve(newCaption);
                }),
            });
        });
    }

    @autobind
    @action
    playerErrorHandler() {
        this.isEditorLoading = false;
        this.setError(ERRORS.LOADING);
    }

    @autobind
    @action
    setError(error) {
        // We're using two observables to avoid flicker when the error modal closes.
        this.error = error;
        this.errorModalContent = {
            title: error.title || '',
            text: error.text || '',
            actions: error.actions || [],
        };
    }

    @autobind
    @action
    clearError() {
        this.error = null;
    }

    @autobind
    @action
    toggleOverlayVisibility() {
        this.isHotkeyOverlayVisible = !this.isHotkeyOverlayVisible;
    }

    @computed
    get isLoading() {
        return this.isAssetLoading || this.isEditorLoading || !this.captionsStore.isLoaded;
    }

    @computed
    get playerSettings() {
        return {
            playerId: 'edit-captions-player',
            preload: 'auto',
            captionsStore: this.captionsStore,
            mediaLicenseToken: this.asset.media_license_token,
            mediaSources: this.asset.media_sources,
            assetId: this.asset.id,
            thumbnailSprite: this.asset.thumbnail_sprite,
            onPlayerReady: this.onPlayerReady,
            onPlayerError: this.playerErrorHandler,
            isPlaying: this.isVideoPlaying,
            onPlayPause: this.onVideoPlayPause,
            // the playsinline attribute needs to be lower-camel-cased in React https://github.com/videojs/video.js/issues/4222
            extraVideoAttributes: {playsInline: true},
            userActivityEnabled: false,
            hotkeysEnabled: true,
            fullscreenEnabled: false,
        };
    }

    @computed
    get playingCueIds() {
        return this.transcriptCaption ? this.transcriptCaption.activeCues.map((cue) => cue.id) : [];
    }

    @computed
    get localCues() {
        return this.transcriptCaption ? this.transcriptCaption.cues : [];
    }

    @computed
    get editingCueIndex() {
        return this.localCues.findIndex((cue) => cue.id === this.editingCueId);
    }
}
