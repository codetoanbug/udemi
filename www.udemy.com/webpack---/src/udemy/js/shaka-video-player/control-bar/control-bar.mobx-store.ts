import {action, observable} from 'mobx';

import {CONTROL_BAR_MENUS} from '../constants';

export class ControlBarStore {
    @observable activeMenu = CONTROL_BAR_MENUS.NONE;

    @action
    setMenuOpen(menu: any) {
        this.activeMenu = menu;
    }

    @action
    setMenuClosed() {
        this.activeMenu = CONTROL_BAR_MENUS.NONE;
    }
}
