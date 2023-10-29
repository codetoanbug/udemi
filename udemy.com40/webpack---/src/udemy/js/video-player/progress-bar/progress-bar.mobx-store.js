import {formatDuration} from '@udemy/react-date-time-components';
import autobind from 'autobind-decorator';
import {observable, computed, action} from 'mobx';

export default class ProgressBarStore {
    @observable.ref player;
    @observable playerStore;
    @observable.ref ref;
    @observable progressHolderRef;
    popoverAreaRef;
    @observable isDragging = false;
    @observable videoCurrentTime = 0;
    @observable.ref thumbnailSprite;

    @observable isHovering = false;
    @observable moveEvent;
    @observable _buffered = [];
    @observable _bufferedPercent = 0;
    @observable progressBarTime = 0;
    @observable currentMouseTime = 0;

    @action
    setMoveEvent(moveEvent) {
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
        const buffersTotal = buffers.length;

        return [...Array(buffersTotal)].map((_, item) => ({
            start: buffers.start(item),
            end: buffers.end(item),
        }));
    }

    @computed
    get bufferedPercent() {
        return `${Math.floor(this._bufferedPercent * 100)}%`;
    }

    get videoDuration() {
        const playerDuration = this.player && this.player.duration();
        return playerDuration || 0;
    }

    @action
    setHovering(isHovering) {
        this.isHovering = isHovering;
    }

    @action
    setBuffered() {
        this._buffered = this.player.buffered ? this.player.buffered() : [];
    }

    @action
    setBufferedPercent() {
        this._bufferedPercent = this.player.bufferedPercent ? this.player.bufferedPercent() : 0;
    }

    @action
    attachPlayer(player) {
        this.player = player;

        this.player.on('progress', this.onProgress);
        this.player.on(
            'timeupdate',
            action(() => {
                this.videoCurrentTime = this.player.currentTime();
            }),
        );

        this.onProgress();
    }

    @action
    attachPlayerStore(playerStore) {
        this.playerStore = playerStore;
    }

    @autobind
    onProgress() {
        this.setBuffered();
        this.setBufferedPercent();
    }

    @action
    setDragging(isDragging) {
        this.isDragging = isDragging;
    }

    @action
    setProgressBarTime(progressBarTime) {
        this.progressBarTime = progressBarTime;
    }

    @action
    setThumbnailSprite(thumbnailSprite) {
        this.thumbnailSprite = thumbnailSprite;
    }

    @autobind
    @action
    setRef(ref) {
        this.ref = ref;
    }

    @autobind
    @action
    setProgressHolderRef(ref) {
        this.progressHolderRef = ref;
    }

    @autobind
    @action
    setPopoverAreaRef(ref) {
        this.popoverAreaRef = ref;
    }

    @action
    setCurrentMouseTime(time) {
        this.currentMouseTime = time;
    }

    seekTo(time, updatePlayer = true) {
        this.setProgressBarTime(time);

        if (updatePlayer) {
            clearTimeout(this.playDebounced);
            this.playDebounced = setTimeout(() => {
                if (this && this.player) {
                    this.player.currentTime(time);
                }
            }, 35);
        }
    }

    remoteTextTracks() {
        return this.player.remoteTextTracks ? this.player.remoteTextTracks() : [];
    }

    @autobind
    seekForward() {
        if (this.playerStore) {
            this.playerStore.seekForward();
        }
    }

    @autobind
    seekBack() {
        if (this.playerStore) {
            this.playerStore.seekBack();
        }
    }
}
