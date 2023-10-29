import {action, observable} from 'mobx';

import {APIModel} from 'utils/mobx';

export default class LabHasUser extends APIModel {
    @observable.ref lab = null;
    @observable lastAttemptedMode = null;
    @observable isCompleted = false;

    constructor(data, lab) {
        super(data);
        this.lab = lab;
    }

    get apiDataMap() {
        return {
            id: 'id',
            isCompleted: 'is_completed',
            firstCompletedTime: 'first_completed_time',
            firstCompletedMode: 'first_completed_mode',
            lastAttemptedMode: 'last_attempted_mode',
            lastAttemptedTime: 'last_attempted_time',
            created: 'created',
            modified: 'modified',
        };
    }

    @action
    setIsCompleted(value) {
        this.isCompleted = value;
    }
}
