import {formatDuration} from '@udemy/react-date-time-components';
import {observable, computed, action} from 'mobx';
import shaka from 'shaka-player/dist/shaka-player.compiled';

export class ProgressBarStore {
    playDebounced: any;

    @observable.ref player: shaka.Player | undefined;

    @observable playerStore: any;

    @observable.ref ref: any;

    @observable progressHolderRef: any;
    popoverAreaRef: any;

    @observable isDragging = false;

    @observable videoCurrentTime = 0;

    @observable.ref thumbnailSprite: any;

    @observable thumbnailVTTUrl = '';

    @observable isHovering = false;

    @observable moveEvent: any;

    @observable _buffered: any;

    @observable _bufferedPercent = 0;

    @observable progressBarTime = 0;

    @observable currentMouseTime = 0;

    @action
    setMoveEvent(moveEvent: any) {
        this.moveEvent = moveEvent;
    }

    @computed
    get progressInfo() {
        const currentTimeFormatted = formatDuration(
            {
                numSeconds: this.progressBarTime,
                presentationStyle: 'timestamp',
            },
            {gettext, interpolate},
        );

        const totalTimeFormatted = formatDuration(
            {
                numSeconds: this.videoDuration,
                presentationStyle: 'timestamp',
            },
            {gettext, interpolate},
        );

        return interpolate(
            pgettext('current time position in video player. eg.: 03:52 of 06:00', '%s of %s'),
            [currentTimeFormatted, totalTimeFormatted],
        );
    }

    @computed
    get currentTimePercentValue() {
        return ((100 / this.videoDuration) * this.progressBarTime).toFixed(2);
    }

    @computed
    get currentTimePercent() {
        return `${this.currentTimePercentValue}%`;
    }

    get buffers() {
        const buffers = this._buffered;
        const buffersTotal = buffers?.length;

        return [...Array(buffersTotal)].map((ignore, item) => ({
            start: buffers[item]?.start,
            end: buffers[item]?.end,
        }));
    }

    @computed
    get bufferedPercent() {
        return `${Math.floor(this._bufferedPercent * 100)}%`;
    }

    get videoDuration(): number {
        if (this.player instanceof shaka.Player) {
            if (isNaN(this.player.getMediaElement()?.duration as number)) {
                return 0;
            }
            const playerDuration = this.player.getMediaElement()?.duration;
            return playerDuration ?? 0;
        }

        return 0;
    }

    @action
    setHovering(isHovering: any) {
        this.isHovering = isHovering;
    }

    @action
    setBuffered() {
        this._buffered = this.player?.getBufferedInfo ? this.player?.getBufferedInfo()?.total : [];
    }

    @action
    setBufferedPercent() {
        let totalBufferedTime = 0;
        for (let i = 0; i < this._buffered?.length; i++) {
            totalBufferedTime += this._buffered[i].end - this._buffered[i].start;
        }
        this._bufferedPercent = totalBufferedTime / this.videoDuration;
    }

    @action
    attachPlayer(player: shaka.Player, videoElement: HTMLVideoElement) {
        this.player = player;

        videoElement?.addEventListener('progress', this.onProgress);
        videoElement?.addEventListener(
            'timeupdate',
            action((event: any) => {
                if (event?.target?.currentTime) {
                    this.videoCurrentTime = event.target.currentTime;
                }
            }),
        );

        this.onProgress();
    }

    @action
    attachPlayerStore(playerStore: any) {
        this.playerStore = playerStore;
    }

    onProgress = () => {
        this.setBuffered();
        this.setBufferedPercent();
    };

    @action
    setDragging(isDragging: any) {
        this.isDragging = isDragging;
    }

    @action
    setProgressBarTime(progressBarTime: any) {
        this.progressBarTime = progressBarTime;
    }

    @action
    setThumbnailSprite(thumbnailSprite: any) {
        this.thumbnailSprite = thumbnailSprite;
    }

    @action
    setThumbnailsVTTUrl(thumbnailVTTUrl: string) {
        this.thumbnailVTTUrl = thumbnailVTTUrl;
    }

    @action
    setRef = (ref: any) => {
        this.ref = ref;
    };

    @action
    setProgressHolderRef = (ref: any) => {
        this.progressHolderRef = ref;
    };

    @action
    setPopoverAreaRef = (ref: any) => {
        this.popoverAreaRef = ref;
    };

    @action
    setCurrentMouseTime(time: any) {
        this.currentMouseTime = time;
    }

    seekTo(time: any, updatePlayer = true) {
        this.setProgressBarTime(time);

        if (updatePlayer) {
            clearTimeout(this.playDebounced);
            this.playDebounced = setTimeout(() => {
                const videoElement = this?.player?.getMediaElement();
                if (videoElement !== undefined && videoElement !== null) {
                    videoElement.currentTime = time;
                }
            }, 35);
        }
    }

    seekForward = () => {
        if (this.playerStore) {
            this.playerStore.seekForward();
        }
    };

    seekBack = () => {
        if (this.playerStore) {
            this.playerStore.seekBack();
        }
    };
}
