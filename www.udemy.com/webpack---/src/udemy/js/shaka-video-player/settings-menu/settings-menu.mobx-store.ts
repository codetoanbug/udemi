import {computed} from 'mobx';

import {CONTROL_BAR_MENUS} from '../constants';

export class SettingsMenuStore {
    controlBarStore: any;
    constructor(controlBarStore: any) {
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
        this.controlBarStore.setMenuOpen(CONTROL_BAR_MENUS.SETTINGS);
    };

    closeMenu = () => {
        this.controlBarStore.setMenuClosed();
    };

    @computed
    get isMenuOpen() {
        return this.controlBarStore.activeMenu === CONTROL_BAR_MENUS.SETTINGS;
    }
}
