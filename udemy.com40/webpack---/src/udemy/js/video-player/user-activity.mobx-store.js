import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import {CONTROL_BAR_MENUS, DEFAULT_ACTIVITY_TIMEOUT} from './constants';
import styles from './user-activity.less';

export default class UserActivityStore {
    @observable isUserActive = true;
    @observable isInitialActivationComplete = false;
    activityOverride = false;

    setControlBarStore(controlBarStore) {
        this.controlBarStore = controlBarStore;
    }

    @autobind
    @action
    setActive() {
        this.isUserActive = true;
    }

    @autobind
    @action
    setInactive() {
        if (
            this.activityOverride ||
            (this.controlBarStore && this.controlBarStore.activeMenu !== CONTROL_BAR_MENUS.NONE)
        ) {
            return;
        }
        this.isUserActive = false;
    }

    @autobind
    setActiveOn() {
        this.activityOverride = true;
        this.setActive();
    }

    @autobind
    unsetActiveOn() {
        this.activityOverride = false;
    }

    setupPlayerListeners(player) {
        player.on('useractive', this.setActive);
        player.on('userinactive', this.setInactive);
        player.listenForUserActivity_();

        setTimeout(
            action(() => {
                /* the player initially sets user activity state to "active" (e.g. to show video controls)
                 * but we want to do some other operations (e.g. enable any toasts) only after that initial window elapses. */
                this.isInitialActivationComplete = true;
            }),
            DEFAULT_ACTIVITY_TIMEOUT + 500, // to move it slightly after and avoid race conditions
        );
    }

    addActiveOnHover(element) {
        // Add an element that, when hovered on, prevents the player being shown as inactive.
        if (element) {
            element.addEventListener('mouseover', this.setActiveOn);
            element.addEventListener('mouseout', this.unsetActiveOn);
        }
    }

    addHideOnInactive(element) {
        // Add an element that will hide when the user is inactive.
        if (element) {
            element.classList.add(styles['hide-when-user-inactive']);
        }
    }
}
