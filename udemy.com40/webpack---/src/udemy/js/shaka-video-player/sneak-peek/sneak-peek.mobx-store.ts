import {observable, computed, action} from 'mobx';

export class SneakPeekStore {
    @observable.ref progressBarStore: any;

    @observable duration = null;

    @observable thumbnailsVTTUrl = '';

    sneakPeekCues: [];

    constructor(progressBarStore: any) {
        this.setProgressBarStore(progressBarStore);
        this.thumbnailsVTTUrl = this.progressBarStore?.thumbnailSprite?.vtt_url;
        this.sneakPeekCues = [];
    }

    @action
    setProgressBarStore(progressBarStore: any) {
        this.progressBarStore = progressBarStore;
    }

    @action
    setDuration = () => {
        this.duration = this.player.getMediaElement().duration;
    };

    @computed
    get isHovering() {
        return this.progressBarStore.isHovering;
    }

    @computed
    get portalElement() {
        return this.progressBarStore.ref;
    }

    @computed
    get thumbSpriteUrl() {
        return new URL(this.progressBarStore.thumbnailSprite.img_url);
    }

    @computed
    get player() {
        return this.progressBarStore.player;
    }

    @computed
    get videoElement() {
        return this.progressBarStore.videoElement;
    }

    @computed
    get moveEvent() {
        return this.progressBarStore.moveEvent;
    }
}
