import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import userSettings, {SETTINGS} from 'utils/user-settings';

export default class MessagePreferencesStore {
    @observable hasLoadedSettings = false;
    @observable isDirectMessagingDisabled = false;
    @observable isSubmitting = false;
    @observable isUpdated = false;

    constructor() {
        this.isUpdated = false;
    }

    @autobind
    @action
    async getSettings() {
        this.isDirectMessagingDisabled = !userSettings.get(SETTINGS.directMessagingEnabled);
        this.hasLoadedSettings = true;
    }

    @autobind
    @action
    setDisableDirectMessagingData(fieldValue) {
        this.isDirectMessagingDisabled = fieldValue;
        this.isSubmitting = true;
    }

    @autobind
    @action
    async updateMessageSetting() {
        this.isSubmitting = true;
        userSettings.set(SETTINGS.directMessagingEnabled, !this.isDirectMessagingDisabled);
        this.isSubmitting = false;
        this.isUpdated = true;
    }
}
