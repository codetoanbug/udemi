import {action, observable} from 'mobx';

export default class SidebarPositionManagerStore {
    static TOP = 'top';
    static STICKY = 'sticky';
    static BOTTOM = 'bottom';

    @observable position = 'top';

    @action
    updatePosition(newPosition) {
        this.position = newPosition;
    }
}
