import autobind from 'autobind-decorator';
import {action, observable, runInAction} from 'mobx';

import SystemMessage from 'utils/ud-system-message';

export default class SideNavStore {
    // used to control that the menu is closed when a user clicks
    // over an icon in the menu, so the submenu is visible
    @observable noExpandMenu = false;

    // when a user clicks an option in the menu we establish
    // that is in use to block the animations.
    @observable menuInUse = false;

    // when a user focus inside the menu, combined with
    // body.ud-keyboard-navigation-in-use we know is using the keyboard
    // inside the menu
    @observable menuInFocus = false;

    @observable
    showSupplyGapsInProductGuidance = false;

    constructor() {
        SystemMessage.hasSeen(SystemMessage.ids.supplyGapsInproductMessage).then(
            action((response) => {
                this.showSupplyGapsInProductGuidance = !response.data;
            }),
        );
    }

    @autobind
    @action
    hideSupplyGapsInproductMessage() {
        SystemMessage.seen(SystemMessage.ids.supplyGapsInproductMessage);
        runInAction(() => {
            this.showSupplyGapsInProductGuidance = false;
        });
    }

    @action
    blockExpandedMenu() {
        this.noExpandMenu = true;
        setTimeout(this.allowExpandMenu, 200);
    }

    @autobind
    @action
    allowExpandMenu() {
        this.noExpandMenu = false;
    }

    @action
    setMenuInUse(value) {
        this.menuInUse = value;
    }

    @action
    setMenuInFocus(value) {
        this.menuInFocus = value;
    }
}
