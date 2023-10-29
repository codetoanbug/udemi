import {action, observable} from 'mobx';

import udExpiringLocalStorage from 'utils/ud-expiring-local-storage';

const POPOVER_EXPIRATION_DATE = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

export class CareerTrackUnitPopoverStore {
    constructor() {
        this.storage = udExpiringLocalStorage(
            'career-track',
            'newBadgePopOver',
            POPOVER_EXPIRATION_DATE,
        );
    }

    @action
    setPopOverState() {
        this.popOverOpen = !this.storage.get('dismissed');
    }

    private storage;
    @observable popOverOpen = false;

    @action
    onTogglePopOver = () => {
        this.popOverOpen = false;
        this.storage.set('dismissed', true);
    };
}
