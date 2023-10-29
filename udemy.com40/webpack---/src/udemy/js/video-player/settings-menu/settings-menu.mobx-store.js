import autobind from 'autobind-decorator';
import {computed} from 'mobx';

import {CONTROL_BAR_MENUS} from '../constants';

export default class SettingsMenuStore {
    constructor(controlBarStore) {
        this.controlBarStore = controlBarStore;
    }

    @autobind
    toggleMenu(toggleOpen) {
        if (toggleOpen) {
            this.openMenu();
        } else {
            this.closeMenu();
        }
    }

    @autobind
    openMenu() {
        this.controlBarStore.setMenuOpen(CONTROL_BAR_MENUS.SETTINGS);
    }

    @autobind
    closeMenu() {
        this.controlBarStore.setMenuClosed();
    }

    @computed
    get isMenuOpen() {
        return this.controlBarStore.activeMenu === CONTROL_BAR_MENUS.SETTINGS;
    }
}
