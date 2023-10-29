import {pxToRem} from '@udemy/styles';
import {action, computed, observable, reaction} from 'mobx';
import shaka from 'shaka-player/dist/shaka-player.ui';
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'storage'.
import storage from 'store';

import {CONTROL_BAR_MENUS} from '../constants';
import {parsedUserAgent} from '../utils';
import {
    DEFAULT_FONT_SIZE,
    DEFAULT_TRACK_OPACITY,
    DEFAULT_WELL_ENABLED,
    MENU_PAGES,
    USER_PREFERENCES_STORAGE_KEY,
    CAPTIONS_DISPLAY_DEFAULTS,
} from './constants';

export class CaptionDisplayStore {
    captionsStore: any;
    controlBarStore: any;
    player: shaka.Player | undefined;
    userHasFontSizePreference: any;
    userHasOpacityPreference: any;
    userHasWellPreference: any;
    videoPlayerStore: any;
    @observable activeFontSize = DEFAULT_FONT_SIZE;
    @observable activeOpacity = DEFAULT_TRACK_OPACITY;
    @observable isWellEnabled = DEFAULT_WELL_ENABLED;
    @observable menuPage = MENU_PAGES.TRACKS;
    @observable cuePosition = 0;

    constructor(controlBarStore: any, captionsStore: any, videoPlayerStore: any) {
        this.controlBarStore = controlBarStore;
        this.captionsStore = captionsStore;
        this.videoPlayerStore = videoPlayerStore;
        this.userHasFontSizePreference = false;
        this.userHasOpacityPreference = false;
        this.userHasWellPreference = false;

        this.loadUserPreferences();

        reaction(
            () => [this.activeFontSize, this.activeOpacity, this.isWellEnabled],
            this.updateUserPreferences,
        );
    }

    attachPlayer(player: any) {
        this.player = player;
        player.getMediaElement()?.addEventListener('timeupdate', this.calculateCuePosition);
    }

    toggleMenu = (isOpen: any) => {
        if (isOpen) {
            this.controlBarStore.setMenuOpen(CONTROL_BAR_MENUS.CAPTIONS);
        } else {
            this.setSubmenu(MENU_PAGES.TRACKS);
            this.controlBarStore.setMenuClosed();
        }
    };

    @computed
    get isMenuOpen() {
        return this.controlBarStore.activeMenu === CONTROL_BAR_MENUS.CAPTIONS;
    }

    @action
    setSubmenu(page: any) {
        this.menuPage = page;
    }

    @action
    selectFontSize(fontSize: any) {
        this.userHasFontSizePreference = true;
        this.activeFontSize = fontSize;
    }

    @action
    selectTrackOpacity(opacity: any) {
        this.userHasOpacityPreference = true;
        this.activeOpacity = opacity;
    }

    @action
    toggleWellEnabled = () => {
        this.userHasWellPreference = true;
        this.isWellEnabled = !this.isWellEnabled;
    };

    updateUserPreferences = () => {
        if (
            this.userHasFontSizePreference ||
            this.userHasOpacityPreference ||
            this.userHasWellPreference
        ) {
            // TODO: tsmigrate move it as instance variable
            const preferences = {
                fontSize: -1,
                opacity: -1,
                isWellEnabled: false,
            };

            if (this.userHasFontSizePreference) {
                preferences.fontSize = this.activeFontSize;
            }
            if (this.userHasOpacityPreference) {
                preferences.opacity = this.activeOpacity;
            }
            if (this.userHasWellPreference) {
                preferences.isWellEnabled = this.isWellEnabled;
            }
            storage.set(USER_PREFERENCES_STORAGE_KEY, preferences);
        } else {
            storage.remove(USER_PREFERENCES_STORAGE_KEY);
        }
    };

    @action
    loadUserPreferences() {
        const preferences = storage.get(USER_PREFERENCES_STORAGE_KEY);
        if (preferences) {
            if (preferences.fontSize !== undefined) {
                this.activeFontSize = preferences.fontSize;
                this.userHasFontSizePreference = true;
            }
            if (preferences.opacity !== undefined) {
                this.activeOpacity = preferences.opacity;
                this.userHasOpacityPreference = true;
            }
            if (preferences.isWellEnabled !== undefined) {
                this.isWellEnabled = preferences.isWellEnabled;
                this.userHasWellPreference = true;
            }
        }
    }

    @action
    reset = () => {
        this.userHasFontSizePreference = false;
        this.userHasOpacityPreference = false;
        this.userHasWellPreference = false;
        this.activeFontSize = DEFAULT_FONT_SIZE;
        this.activeOpacity = DEFAULT_TRACK_OPACITY;
        this.isWellEnabled = DEFAULT_WELL_ENABLED;
    };

    @action
    calculateCuePosition = () => {
        // Returns the current time progress through the current cue as a value between 0 and 1.
        if (!this.activeCue) {
            this.cuePosition = 0;
            return;
        }
        const cueDuration = this.activeCue.endTime - this.activeCue.startTime;
        this.cuePosition =
            (this.videoPlayerStore.currentTime - this.activeCue.startTime) / cueDuration;
    };

    @computed
    get activeTrack() {
        if (!this.captionsStore.activeTracks.length) {
            return null;
        }
        // Possible for multiple tracks to be marked active, but we don't support that for display.
        return this.captionsStore.activeTracks[0];
    }

    @computed
    get activeCue() {
        if (!this.activeTrack || !this.activeTrack.activeCues.length) {
            return null;
        }
        // Possible for overlapping cues, but again, we don't support that for display.
        return this.activeTrack.activeCues[0];
    }

    @computed
    get activeCueText() {
        if (!this.activeCue) {
            return '';
        }
        return this.activeCue.displayText;
    }

    @computed
    get captionStyle() {
        const playerHeight = this.videoPlayerStore.playerHeight;
        let baseFontSize;
        if (!playerHeight) {
            baseFontSize = CAPTIONS_DISPLAY_DEFAULTS.FONT_SIZE_DEFAULT;
        } else {
            // 4% of the video player
            baseFontSize = Math.max(playerHeight * 0.04, CAPTIONS_DISPLAY_DEFAULTS.FONT_SIZE_MIN);
        }
        const effectiveFontSize = (this.activeFontSize / 100) * baseFontSize;
        return {
            fontSize: `${pxToRem(effectiveFontSize)}rem`,
            opacity: this.activeOpacity / 100,
        };
    }

    @computed
    get shouldDisplayWell() {
        return this.isWellEnabled && this.activeTrack && !parsedUserAgent.isMobile;
    }
}
