import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {loadSetting, saveSetting} from '../user-settings';
import {DEFAULT_PLAYBACK_RATE, PLAYBACK_RATES, PLAYBACK_RATE_SETTING} from './constants';

export default class PlaybackRateStore {
    @observable.ref player;
    @observable availablePlaybackRates = PLAYBACK_RATES;
    @observable chosenPlaybackRate;

    @action
    setup(player) {
        this.player = player;

        // On IE11 playback rate can only be changed when playing, so every time the video plays
        // we update to the latest playback rate selected. This also handles setting the initial
        // playback rate.
        player.on('play', () => {
            player.playbackRate(this.playbackRate);
        });
    }

    @autobind
    @action
    choosePlaybackRate(playbackRate) {
        if (playbackRate && playbackRate !== this.playbackRate) {
            this.chosenPlaybackRate = playbackRate;
            this.player.playbackRate(playbackRate);
            saveSetting(PLAYBACK_RATE_SETTING, playbackRate);
        }
    }

    @computed
    get playbackRate() {
        const playbackRate = this.chosenPlaybackRate || this.savedPlaybackRate;
        if (this.availablePlaybackRates.includes(playbackRate)) {
            return playbackRate;
        }
        return DEFAULT_PLAYBACK_RATE;
    }

    @autobind
    @action
    speedDown() {
        const index = this.availablePlaybackRates.indexOf(this.playbackRate);
        const playbackRate = this.availablePlaybackRates.slice()[index - 1];
        this.choosePlaybackRate(playbackRate);
    }

    @autobind
    @action
    speedUp() {
        const index = this.availablePlaybackRates.indexOf(this.playbackRate);
        const playbackRate = this.availablePlaybackRates.slice()[index + 1];
        this.choosePlaybackRate(playbackRate);
    }

    get savedPlaybackRate() {
        return parseFloat(loadSetting(PLAYBACK_RATE_SETTING));
    }
}
