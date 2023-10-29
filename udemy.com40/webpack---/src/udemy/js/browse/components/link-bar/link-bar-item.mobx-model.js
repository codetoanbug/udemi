import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

export default class LinkBarItemModel {
    @observable domOffsetTop = 0;

    constructor(data) {
        Object.assign(this, {...data});
    }

    @computed
    get isInDropdown() {
        return this.domOffsetTop > 0;
    }

    @autobind
    @action
    setDomOffsetTop(value) {
        this.domOffsetTop = value;
    }
}
