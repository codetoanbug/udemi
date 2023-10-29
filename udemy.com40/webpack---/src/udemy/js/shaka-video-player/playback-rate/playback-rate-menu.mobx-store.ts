import {computed} from 'mobx';

import {CONTROL_BAR_MENUS} from '../constants';
import {ControlBarStore} from '../control-bar/control-bar.mobx-store';

export class PlaybackRateMenuStore {
    controlBarStore: ControlBarStore;
    constructor(controlBarStore: ControlBarStore) {
        this.controlBarStore = controlBarStore;
    }

    toggleMenu = (toggleOpen: any) => {
        if (toggleOpen) {
            this.openMenu();
        } else {
            this.closeMenu();
        }
    };

    openMenu = () => {
        this.controlBarStore.setMenuOpen(CONTROL_BAR_MENUS.PLAYBACK_RATE);
    };

    closeMenu = () => {
        this.controlBarStore.setMenuClosed();
    };

    @computed
    get isMenuOpen() {
        return this.controlBarStore.activeMenu === CONTROL_BAR_MENUS.PLAYBACK_RATE;
    }
}
