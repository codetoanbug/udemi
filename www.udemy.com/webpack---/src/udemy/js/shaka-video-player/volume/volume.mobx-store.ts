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

export class VolumeStore {
    isDefaultMuted: boolean;
    prioritizeDefaultMuted: boolean;
    player: any;

    @observable _chosenVolume: number;

    @observable _chosenIsMuted: number;
    constructor(isDefaultMuted: boolean, prioritizeDefaultMuted = false) {
        this.isDefaultMuted = isDefaultMuted;
        this.prioritizeDefaultMuted = prioritizeDefaultMuted;
        this._chosenVolume = loadSetting(VOLUME_SETTING) as number;
        this._chosenIsMuted = loadSetting(MUTE_SETTING) as number;
    }

    @action
    setup(player: any) {
        this.player = player;
        player.volume = this.volume;
        player.muted = this.isMuted;
    }

    // VOLUME
    @computed
    get volume() {
        function isFinite(n: any) {
            return typeof n === 'number' && !isNaN(n) && n !== Infinity;
        }
        const volume = [this._chosenVolume, this.savedVolume, DEFAULT_VOLUME].find(isFinite);
        return this.normalizeVolume(volume);
    }

    @action
    chooseVolume = (volume: any) => {
        if (!this.isEnabled) {
            return;
        }
        const newVolume = this.normalizeVolume(volume);
        this._chosenVolume = newVolume;
        this.player.volume = newVolume;
        saveSetting(VOLUME_SETTING, newVolume);
        this.chooseMuted(false);
    };

    get savedVolume() {
        return parseFloat(loadSetting(VOLUME_SETTING));
    }

    normalizeVolume(volume: any) {
        const clampedVolume = Math.min(Math.max(volume, VOLUME_MIN), VOLUME_MAX);
        return Math.round(100 * clampedVolume) / 100;
    }

    @action
    volumeUp = (volumeInterval = VOLUME_INTERVAL) => {
        this.chooseVolume(this.volume + volumeInterval);
    };

    @action
    volumeDown = (volumeInterval = VOLUME_INTERVAL) => {
        this.chooseVolume(this.volume - volumeInterval);
    };

    // MUTE
    @computed
    get isMuted() {
        function isBoolean(value: any) {
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

    @action
    chooseMuted = (isMuted: any) => {
        if (!this.isEnabled) {
            return;
        }
        this._chosenIsMuted = isMuted;
        this.player.muted = isMuted;
        saveSetting(MUTE_SETTING, isMuted ? '1' : 0);
    };

    toggleMuted = () => {
        this.chooseMuted(!this.isMuted);
    };

    get savedIsMuted(): boolean {
        // If the setting is illegal, it'll be undefined.
        const settingMap = new Map<number, boolean>([
            [0, false],
            [1, true],
        ]);
        const setting = loadSetting(MUTE_SETTING) as number;
        return settingMap.get(setting) as boolean;
    }

    get isEnabled() {
        return this.player;
    }
}
