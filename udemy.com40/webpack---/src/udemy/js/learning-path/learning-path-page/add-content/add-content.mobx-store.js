import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import {LEARNING_PATH_ERROR_MESSAGES} from '../constants';

export default class AddContentStore {
    @observable isAddItemFormShown = false;
    @observable contentTypeToAdd = null;
    @observable errorMessage = '';
    @observable isSaving = false;

    @action
    showAddItemForm(contentType) {
        this._setErrorMessage('');
        this.isAddItemFormShown = true;
        this.contentTypeToAdd = contentType;
    }

    @autobind
    @action
    hideAddItemForm() {
        this.isAddItemFormShown = false;
        this.contentTypeToAdd = null;
        this._setErrorMessage('');
    }

    @autobind
    handleError(error) {
        let message = LEARNING_PATH_ERROR_MESSAGES.UNABLE_TO_ADD_CONTENT;
        if (
            error.response &&
            error.response.status === 400 &&
            error.response.data &&
            error.response.data.results
        ) {
            message = error.response.data.results[0];
        }
        this._setErrorMessage(message);
    }

    @action
    _setErrorMessage(message) {
        this.errorMessage = message;
    }

    @action setIsSaving(value) {
        this.isSaving = value;
    }
}
