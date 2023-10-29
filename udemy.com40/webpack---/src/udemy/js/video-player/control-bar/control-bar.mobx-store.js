import {action, observable} from 'mobx';

import {CONTROL_BAR_MENUS} from '../constants';

export default class ControlBarStore {
    @observable activeMenu = CONTROL_BAR_MENUS.NONE;

    @action
    setMenuOpen(menu) {
        this.activeMenu = menu;
    }

    @action
    setMenuClosed() {
        this.activeMenu = CONTROL_BAR_MENUS.NONE;
    }
}
