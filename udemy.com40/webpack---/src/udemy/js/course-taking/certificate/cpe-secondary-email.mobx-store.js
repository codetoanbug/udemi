import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import udApi from 'utils/ud-api';

export default class CpeSecondaryEmailStore {
    @observable isLoading = false;
    @observable validationState = null;
    @observable isSecondaryEmailProvided = false;
    @observable isSecondaryEmailModalOpen = false;
    @observable secondaryEmail = '';

    @action
    openModal() {
        this.isSecondaryEmailModalOpen = true;
    }

    @autobind
    @action
    closeModal() {
        this.secondaryEmail = '';
        this.isSecondaryEmailModalOpen = false;
    }

    @action
    setSecondaryEmail(value) {
        // reset validation state on typing
        this.validationState = null;
        this.secondaryEmail = value;
    }

    async updateSecondaryEmail() {
        this._setIsLoading(true);
        await udApi.post('/users/me/settings/', {
            setting: 'secondary_email',
            value: this.secondaryEmail,
        });
        this.setIsSecondaryEmailProvided(true);
        this._setIsLoading(false);
    }

    @action
    validateEmail() {
        if (!this.secondaryEmail || !this.secondaryEmail.match(/.+@.+\...+/)) {
            this.validationState = 'error';
        }
        return this.validationState !== 'error';
    }

    @action
    setIsSecondaryEmailProvided(value) {
        this.isSecondaryEmailProvided = value;
    }

    @action
    _setIsLoading(value) {
        this.isLoading = value;
    }
}
