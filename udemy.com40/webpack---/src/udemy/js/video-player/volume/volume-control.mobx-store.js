import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

export default class VolumeControlStore {
    @observable isOpen = false;
    @observable isDragging = false;

    constructor(volumeStore) {
        this.volumeStore = volumeStore;
    }

    @autobind
    @action
    setOpen(isOpen) {
        this.isOpen = isOpen;
    }

    @autobind
    @action
    setDragging(isDragging) {
        this.isDragging = isDragging;
    }

    @computed
    get displayVolume() {
        const volume = this.volumeStore.isMuted ? 0 : this.volumeStore.volume;
        return Math.round(100 * volume);
    }
}
