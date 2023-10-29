import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {loadSetting, saveSetting} from '../user-settings';
import {
    DEFAULT_VOLUME,
    VOLUME_INTERVAL,
    VOLUME_MAX,
    VOLUME_MIN,
    MUTE_SETTING,
    VOLUME_SETTING,
} from './constants';

export default class VolumeStore {
    player;
    @observable _chosenVolume;
    @observable _chosenIsMuted;
    constructor(isDefaultMuted, prioritizeDefaultMuted = false) {
        this.isDefaultMuted = isDefaultMuted;
        this.prioritizeDefaultMuted = prioritizeDefaultMuted;
    }

    @action
    setup(player) {
        this.player = player;
        player.volume(this.volume);
        player.muted(this.isMuted);
    }

    // VOLUME
    @computed
    get volume() {
        function isFinite(n) {
            return typeof n === 'number' && !isNaN(n) && n !== Infinity;
        }
        const volume = [this._chosenVolume, this.savedVolume, DEFAULT_VOLUME].find(isFinite);
        return this.normalizeVolume(volume);
    }

    @autobind
    @action
    chooseVolume(volume) {
        if (!this.isEnabled) {
            return;
        }
        const newVolume = this.normalizeVolume(volume);
        this._chosenVolume = newVolume;
        this.player.volume(newVolume);
        saveSetting(VOLUME_SETTING, newVolume);
        this.chooseMuted(false);
    }

    get savedVolume() {
        return parseFloat(loadSetting(VOLUME_SETTING));
    }

    normalizeVolume(volume) {
        const clampedVolume = Math.min(Math.max(volume, VOLUME_MIN), VOLUME_MAX);
        return Math.round(100 * clampedVolume) / 100;
    }

    @autobind
    @action
    volumeUp(volumeInterval = VOLUME_INTERVAL) {
        this.chooseVolume(this.volume + volumeInterval);
    }

    @autobind
    @action
    volumeDown(volumeInterval = VOLUME_INTERVAL) {
        this.chooseVolume(this.volume - volumeInterval);
    }

    // MUTE
    @computed
    get isMuted() {
        function isBoolean(value) {
            return typeof value === 'boolean';
        }

        // If the user has specifically chosen a muted/unmuted value, we skip the prioritizeDefaultMuted check
        // and just return that value
        if (isBoolean(this._chosenIsMuted)) {
            return this._chosenIsMuted;
        }

        // Otherwise, we prioritize the isDefaultMuted value if prioritizeDefaultMuted is true
        return this.prioritizeDefaultMuted
            ? this.isDefaultMuted
            : [this.savedIsMuted, this.isDefaultMuted].find(isBoolean);
    }

    @autobind
    @action
    chooseMuted(isMuted) {
        if (!this.isEnabled) {
            return;
        }
        this._chosenIsMuted = isMuted;
        this.player.muted(isMuted);
        saveSetting(MUTE_SETTING, isMuted ? '1' : 0);
    }

    @autobind
    toggleMuted() {
        this.chooseMuted(!this.isMuted);
    }

    get savedIsMuted() {
        // If the setting is illegal, it'll be undefined.
        const settingMap = {0: false, 1: true};
        const setting = loadSetting(MUTE_SETTING);
        return settingMap[setting];
    }

    get isEnabled() {
        return this.player && this.player.techName_;
    }
}
