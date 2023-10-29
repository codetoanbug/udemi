import {observable, action, set} from 'mobx';

import {APIModel} from 'utils/mobx';

export default class Theme extends APIModel {
    @observable checked;

    constructor(data, checked) {
        super(data);
        this.title = data.title;
        this.titleEnglish = data.title_in_english;
        this.description = data.description;
        this.type = data.type.toLowerCase();
        this.imageUrl = data.image_url;
        set(this, {checked});
    }

    @action check(isChecked = true) {
        this.checked = isChecked;
    }
}
