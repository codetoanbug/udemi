import {action, computed, observable} from 'mobx';

import {loadSetting, saveSetting} from '../user-settings';
import {DEFAULT_PLAYBACK_RATE, PLAYBACK_RATES, PLAYBACK_RATE_SETTING} from './constants';

export class PlaybackRateStore {
    @observable.ref videoElement: any;
    @observable availablePlaybackRates = PLAYBACK_RATES;
    @observable chosenPlaybackRate: number | undefined;

    @action
    setPlaybackRateOnPlay(videoElement: any) {
        videoElement.addEventListener('play', () => {
            videoElement.playbackRate = this.playbackRate;
        });
    }

    @action
    attachPlaybackRateStore(videoElement: any) {
        this.videoElement = videoElement;
        this.setPlaybackRateOnPlay(videoElement);
    }

    @action
    choosePlaybackRate = (playbackRate: number) => {
        if (playbackRate && playbackRate !== this.playbackRate) {
            this.chosenPlaybackRate = playbackRate;
            this.videoElement.playbackRate = playbackRate;
            saveSetting(PLAYBACK_RATE_SETTING, playbackRate);
        }
    };

    @computed
    get playbackRate() {
        const playbackRate = this.chosenPlaybackRate ?? this.savedPlaybackRate;
        if (this.availablePlaybackRates.includes(playbackRate)) {
            return playbackRate;
        }
        return DEFAULT_PLAYBACK_RATE;
    }

    @action
    speedDown = () => {
        const index = this.availablePlaybackRates.indexOf(this.playbackRate);
        const playbackRate = this.availablePlaybackRates.slice()[index - 1];
        this.choosePlaybackRate(playbackRate);
    };

    @action
    speedUp = () => {
        const index = this.availablePlaybackRates.indexOf(this.playbackRate);
        const playbackRate = this.availablePlaybackRates.slice()[index + 1];
        this.choosePlaybackRate(playbackRate);
    };

    get savedPlaybackRate() {
        return parseFloat(loadSetting(PLAYBACK_RATE_SETTING));
    }
}
