import autobind from 'autobind-decorator';
import {observable, computed, action} from 'mobx';

export default class SneakPeekStore {
    @observable.ref progressBarStore;
    @observable duration = null;
    @observable sneakPeekTrack = null;

    constructor(progressBarStore) {
        this.setProgressBarStore(progressBarStore);
    }

    @action
    setSneakPeekTrack(sneakPeekTrack) {
        this.sneakPeekTrack = sneakPeekTrack;
    }

    @action
    setProgressBarStore(progressBarStore) {
        this.progressBarStore = progressBarStore;
    }

    @autobind
    @action
    setDuration() {
        this.duration = this.player.duration();
    }

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
    get moveEvent() {
        return this.progressBarStore.moveEvent;
    }

    @computed
    get cueLength() {
        return this.sneakPeekTrack && this.sneakPeekTrack.cues && this.sneakPeekTrack.cues.length;
    }
}
