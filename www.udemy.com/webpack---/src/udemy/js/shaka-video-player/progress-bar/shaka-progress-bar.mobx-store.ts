import {action} from 'mobx';

import {ProgressBarStore} from './progress-bar.mobx-store';

export class ShakaProgressBarStore extends ProgressBarStore {
    playDebounced: any;
    player: any;

    videoElement: HTMLVideoElement | undefined;

    @action
    attachPlayer(player: any, videoElement: HTMLVideoElement) {
        this.player = player;
        this.videoElement = videoElement;

        this.videoElement.addEventListener('progress', this.onProgress);
        this.videoElement.addEventListener(
            'timeupdate',
            action((event: any) => {
                if (event?.target?.currentTime) {
                    this.videoCurrentTime = event.target.currentTime;
                }
            }),
        );

        this.onProgress();
    }

    get videoDuration() {
        if (isNaN(this.videoElement?.duration as number)) {
            return 0;
        }
        const playerDuration = this.videoElement?.duration;
        return playerDuration ?? 0;
    }

    seekTo(time: any, updatePlayer = true) {
        this.setProgressBarTime(time);

        if (updatePlayer) {
            clearTimeout(this.playDebounced);
            this.playDebounced = setTimeout(() => {
                if (this && this.player) {
                    if (this.videoElement) {
                        this.videoElement.currentTime = time;
                    }
                }
            }, 35);
        }
    }
}
