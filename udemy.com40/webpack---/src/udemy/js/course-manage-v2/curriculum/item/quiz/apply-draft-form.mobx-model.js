import autobind from 'autobind-decorator';
import {action, computed, observable, set} from 'mobx';

import {minLengthOfApplyDraftDescription} from '../constants';

export default class ApplyDraftFormModel {
    @observable data;
    @observable error;

    constructor() {
        this.reset();
    }

    @action
    reset() {
        set(this, {
            data: {
                description: '',
                sendAnnouncement: false,
            },
            error: {},
        });
    }

    @computed
    get isValid() {
        return this.data.description.trim().length >= minLengthOfApplyDraftDescription;
    }

    @autobind
    @action
    setField(fieldName, fieldValue) {
        this.data[fieldName] = fieldValue;
    }
}
