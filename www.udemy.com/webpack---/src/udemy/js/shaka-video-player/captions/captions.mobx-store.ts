import Cookies from 'js-cookie';
import {action, computed, observable} from 'mobx';
import shaka from 'shaka-player/dist/shaka-player.compiled';

import getRequestData from 'utils/get-request-data';

import {CAPTION_COOKIE_KEY, TRACK_MODES} from './constants';
import {VideoCaption} from './video-caption.mobx-model';

const udRequest = getRequestData();

export class CaptionsStore {
    languagePriorities: any;
    @observable captions: Array<VideoCaption> = [];
    @observable.ref player: shaka.Player | undefined;
    videoPlayerStore: any;
    isDefaultCaptionOn;

    constructor(
        apiData: any,
        autoSelect = true,
        languagePriorities = {[udRequest.locale.split('_')[0]]: 1},
        isDefaultCaptionOn = false,
    ) {
        apiData.forEach((captionData: any) => {
            this.addCaptionFromAPI(captionData);
        });
        this.isDefaultCaptionOn = isDefaultCaptionOn;
        if (autoSelect) {
            this.autoSelectCaption();
        }
        this.languagePriorities = languagePriorities;
    }

    attachPlayerStore(videoPlayerStore: any) {
        this.videoPlayerStore = videoPlayerStore;
    }

    getSortOrder = (caption: any) => {
        return this.languagePriorities[caption.language] || caption.label.codePointAt(0);
    };

    @computed
    get sortedCaptions() {
        return this.captions.sort((a, b) => this.getSortOrder(a) - this.getSortOrder(b));
    }

    @action
    addCaptionFromAPI(captionData: any) {
        this.captions.push(new VideoCaption(captionData));
    }

    setActiveCaption(activeCaption: VideoCaption | null, persist = true) {
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

    setCaptionMode(caption: VideoCaption, mode: any) {
        caption.setMode(mode);
    }

    updateCaptionModesFromNativeTrack = () => {
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
    };

    @computed
    get autoSelectedCaption(): VideoCaption | null {
        let cookieCaptionLanguage: any, userCaptionLanguage: any, defaultCaptionLanguage: any;

        // If user has already selected a preference, just try to apply it
        const languageCookie = Cookies.get(CAPTION_COOKIE_KEY);
        if (languageCookie !== undefined) {
            // cookie value is an empty string if you turned your captions off
            // if user has explicitly switched captions off previously, respect that
            if (!languageCookie) {
                return null;
            }
            cookieCaptionLanguage = languageCookie;
        }

        // If user never selected a preference, we auto-enable captions for non-English users.
        const userLanguage = udRequest.locale.substr(0, 2);
        if (userLanguage !== 'en' || this.isDefaultCaptionOn) {
            userCaptionLanguage = userLanguage;
            defaultCaptionLanguage = 'en';
        }

        let cookieCaption,
            userCaption,
            defaultCaption: VideoCaption | null = null;
        this.captions.forEach((caption) => {
            if (cookieCaptionLanguage && caption.language === cookieCaptionLanguage) {
                cookieCaption = caption;
            } else if (userCaptionLanguage && caption.language === userCaptionLanguage) {
                userCaption = caption;
            } else if (defaultCaptionLanguage && caption.language === defaultCaptionLanguage) {
                defaultCaption = caption;
            }
        });

        let selectedCaption: VideoCaption | null = null;
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
        const selectedCaption: VideoCaption | null = this.autoSelectedCaption;

        if (!selectedCaption) {
            return;
        }

        // Don't persist the selected caption in a cookie if it was selected automatically (and no need
        // to persist it if we extracted it from a cookie).
        this.setActiveCaption(selectedCaption, false);
    }

    persistSelectedCaption(caption: any) {
        Cookies.set(CAPTION_COOKIE_KEY, caption ? caption.language : '', {expires: 30, path: '/'});
    }

    @action
    attachPlayer(player: shaka.Player) {
        this.player = player;

        this.captions.forEach((caption) => {
            caption.attachPlayer(player, this.videoPlayerStore.isUsingNativeControls);
        });

        if (this.videoPlayerStore.isUsingNativeControls) {
            // TODO: tsmigrate subscribe to Shaka TextChanged event.
            // Using native player to show tracks, need to respond to user changing tracks.
            // player.getTextTracks().addEventListener('change', this.updateCaptionModesFromNativeTrack);
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

    toggleDefaultCaption = () => {
        const activeTrack = this.activeTracks.length ? this.activeTracks[0] : null;

        if (activeTrack) {
            this.setActiveCaption(null);
        } else {
            let selectedCaption: VideoCaption | null = this.autoSelectedCaption;

            if (!selectedCaption) {
                selectedCaption = this.sortedCaptions[0];
            }
            this.setActiveCaption(selectedCaption);
        }
    };
}
