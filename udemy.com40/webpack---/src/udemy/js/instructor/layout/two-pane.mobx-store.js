import {action, observable} from 'mobx';
/*
 *  Store used with ./two-pane.react-component.js to control when to toggle panes
 *  and when to display left/right panes.
 * */
export default class TwoPaneStore {
    @observable showLeftPane = true;

    constructor(showLeftPane = true) {
        // User can specify if leftPane should be shown by default
        this.setShowLeftPane(showLeftPane);
    }

    @action // Toggles between left/right panes.
    togglePanes() {
        this.showLeftPane = !this.showLeftPane;
    }

    @action // When true, left pane is shown. When false, right pane is shown.
    setShowLeftPane(value) {
        this.showLeftPane = value;
    }
}
