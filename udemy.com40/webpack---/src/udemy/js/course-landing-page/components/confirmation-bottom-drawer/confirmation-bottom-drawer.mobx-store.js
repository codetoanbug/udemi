import autobind from 'autobind-decorator';
import {action, extendObservable, runInAction} from 'mobx';

import {
    CONFIRMATION_BOTTOM_DRAWER_DEFAULT_STATE,
    CONFIRMATION_BOTTOM_DRAWER_LOADING_STATE,
    CONFIRMATION_BOTTOM_DRAWER_FINISHED_STATE,
} from './constants';

export default class ConfirmationBottomDrawerStore {
    constructor(props) {
        extendObservable(this, {
            drawerOpen: props.initialOpenState || false,
            drawerState: CONFIRMATION_BOTTOM_DRAWER_DEFAULT_STATE,
        });
        this.onDrawerClose = props.onDrawerClose;
        this.handleConfirmation = props.handleConfirmation;
        this.onDrawerConfirmation = props.onDrawerConfirmation;
        this.onDrawerInitialization = props.onDrawerInitialization;

        this.onDrawerInitialization();
    }

    @autobind
    @action
    closeDrawer() {
        this.drawerOpen = false;
        this.drawerState = CONFIRMATION_BOTTOM_DRAWER_DEFAULT_STATE;
        this.onDrawerClose();
    }

    @autobind
    @action
    openDrawer() {
        this.drawerOpen = true;
    }

    @autobind
    @action
    confirmDrawer() {
        this.drawerState = CONFIRMATION_BOTTOM_DRAWER_LOADING_STATE;
        return this.handleConfirmation().then(() => {
            runInAction(() => {
                this.drawerState = CONFIRMATION_BOTTOM_DRAWER_FINISHED_STATE;
            });
            this.onDrawerConfirmation();
        });
    }
}
