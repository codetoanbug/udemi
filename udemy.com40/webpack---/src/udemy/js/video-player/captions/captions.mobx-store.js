import autobind from 'autobind-decorator';
import Cookies from 'js-cookie';
import {action, computed, observable} from 'mobx';
import videojs from 'video.js';

import getRequestData from 'utils/get-request-data';

import {CAPTION_COOKIE_KEY, TRACK_MODES} from './constants';
import VideoCaption from './video-caption.mobx-model';

const udRequest = getRequestData();

export default class CaptionsStore {
    @observable captions = [];
    @observable.ref player = null;
    videoPlayerStore;
    isDefaultCaptionOn;

    constructor(
        apiData,
        autoSelect = true,
        languagePriorities = {[udRequest.locale.split('_')[0]]: 1},
        isDefaultCaptionOn = false,
    ) {
        apiData.forEach((captionData) => {
            this.addCaptionFromAPI(captionData);
        });
        this.isDefaultCaptionOn = isDefaultCaptionOn;
        if (autoSelect) {
            this.autoSelectCaption();
        }
        this.languagePriorities = languagePriorities;
    }

    attachPlayerStore(videoPlayerStore) {
        this.videoPlayerStore = videoPlayerStore;
    }

    setNativeTracksForMobile(useNativeTextTracks) {
        const html5Tech = videojs.getTech('Html5');
        html5Tech.prototype.featuresNativeTextTracks = useNativeTextTracks;
    }

    @autobind
    getSortOrder(caption) {
        return this.languagePriorities[caption.language] || caption.label.codePointAt(0);
    }

    @computed
    get sortedCaptions() {
        return this.captions.sort((a, b) => this.getSortOrder(a) - this.getSortOrder(b));
    }

    @action
    addCaptionFromAPI(captionData) {
        this.captions.push(new VideoCaption(captionData));
    }

    setActiveCaption(activeCaption = null, persist = true) {
        this.captions.forEach((caption) => {
            if (activeCaption && caption.id === activeCaption.id) {
                this.setCaptionMode(caption, TRACK_MODES.ACTIVE);
            } else if (caption.mode === TRACK_MODES.ACTIVE) {
                this.setCaptionMode(caption, TRACK_MODES.HIDDEN);
            }
        });
        if (persist) {
            this.persistSelectedCaption(activeCaption);
        }
    }

    setCaptionMode(caption, mode) {
        caption.setMode(mode);
    }

    @autobind
    updateCaptionModesFromNativeTrack() {
        let activeCaption;
        this.captions.forEach((caption) => {
            if (!caption.textTrack) {
                return;
            }
            if (caption.textTrack.mode === TRACK_MODES.ACTIVE) {
                activeCaption = caption;
            }
            caption.setMode(caption.textTrack.mode);
        });
        this.persistSelectedCaption(activeCaption);
    }

    @computed
    get autoSelectedCaption() {
        let cookieCaptionLanguage, userCaptionLanguage, defaultCaptionLanguage;

        // If user has already selected a preference, just try to apply it
        const languageCookie = Cookies.get(CAPTION_COOKIE_KEY);
        if (languageCookie !== undefined) {
            // cookie value is an empty string if you turned your captions off
            // if user has explicitly switched captions off previously, respect that
            if (!languageCookie) {
                return;
            }
            cookieCaptionLanguage = languageCookie;
        }

        // If user never selected a preference, we auto-enable captions for non-English users.
        const userLanguage = udRequest.locale.substr(0, 2);
        if (userLanguage !== 'en' || this.isDefaultCaptionOn) {
            userCaptionLanguage = userLanguage;
            defaultCaptionLanguage = 'en';
        }

        let cookieCaption, userCaption, defaultCaption;
        this.captions.forEach((caption) => {
            if (cookieCaptionLanguage && caption.language === cookieCaptionLanguage) {
                cookieCaption = caption;
            } else if (userCaptionLanguage && caption.language === userCaptionLanguage) {
                userCaption = caption;
            } else if (defaultCaptionLanguage && caption.language === defaultCaptionLanguage) {
                defaultCaption = caption;
            }
        });

        let selectedCaption;
        if (cookieCaption) {
            selectedCaption = cookieCaption;
        } else if (userCaption) {
            selectedCaption = userCaption;
        } else if (defaultCaption) {
            selectedCaption = defaultCaption;
        }

        return selectedCaption;
    }

    autoSelectCaption() {
        const selectedCaption = this.autoSelectedCaption;

        if (!selectedCaption) {
            return;
        }

        // Don't persist the selected caption in a cookie if it was selected automatically (and no need
        // to persist it if we extracted it from a cookie).
        this.setActiveCaption(selectedCaption, false);
    }

    persistSelectedCaption(caption) {
        Cookies.set(CAPTION_COOKIE_KEY, caption ? caption.language : '', {expires: 30, path: '/'});
    }

    @action
    attachPlayer(player) {
        this.player = player;

        this.captions.forEach((caption) => {
            caption.attachPlayer(player, this.videoPlayerStore.isUsingNativeControls);
        });

        if (this.videoPlayerStore.isUsingNativeControls) {
            // Using native player to show tracks, need to respond to user changing tracks.
            player.textTracks().addEventListener('change', this.updateCaptionModesFromNativeTrack);
        }
    }

    @computed
    get isLoaded() {
        return this.captions.every((caption) => caption.isLoaded);
    }

    @computed
    get hasError() {
        return this.captions.some((caption) => caption.error);
    }

    @computed
    get activeTracks() {
        return this.captions.filter((caption) => caption.mode === TRACK_MODES.ACTIVE);
    }

    @computed
    get hasMachineTranslatedCaptions() {
        return this.captions.some((caption) => caption.isTranslation);
    }

    @autobind
    toggleDefaultCaption() {
        const activeTrack = this.activeTracks.length ? this.activeTracks[0] : null;

        if (activeTrack) {
            this.setActiveCaption(null);
        } else {
            let selectedCaption = this.autoSelectedCaption;

            if (!selectedCaption) {
                selectedCaption = this.sortedCaptions[0];
            }
            this.setActiveCaption(selectedCaption);
        }
    }
}
