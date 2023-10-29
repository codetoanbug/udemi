import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

export default class SearchWidgetStore {
    @observable searchTerm = '';
    @observable isClearButtonShown = false;

    @autobind
    @action
    handleChange(e) {
        this.searchTerm = e.target.value;
    }

    @autobind
    @action
    clearSearchTerm() {
        this.searchTerm = '';
        this.hideClearButton();
    }

    @autobind
    @action
    showClearButton() {
        this.isClearButtonShown = true;
    }

    @autobind
    @action
    hideClearButton() {
        this.isClearButtonShown = false;
    }
}
