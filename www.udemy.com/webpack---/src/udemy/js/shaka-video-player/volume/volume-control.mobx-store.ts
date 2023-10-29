import {action, computed, observable} from 'mobx';

import {VolumeStore} from './volume.mobx-store';

export class VolumeControlStore {
    volumeStore: VolumeStore;

    @observable isOpen = false;

    @observable isDragging = false;

    constructor(volumeStore: VolumeStore) {
        this.volumeStore = volumeStore;
    }

    @action
    setOpen = (isOpen: boolean) => {
        this.isOpen = isOpen;
    };

    @action
    setDragging = (isDragging: boolean) => {
        this.isDragging = isDragging;
    };

    @computed
    get displayVolume(): number {
        const volume = this.volumeStore.isMuted ? 0 : this.volumeStore.volume;
        return Math.round(100 * volume);
    }
}
