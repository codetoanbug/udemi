import autobind from 'autobind-decorator';
import {CancelToken, isCancel} from 'axios';
import {action, computed, observable, reaction} from 'mobx';

import debounce from 'utils/debounce';
import {APIModel} from 'utils/mobx';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

export const DEFAULT_AUTOSAVE_INTERVAL = 1000;

export class EditableApiModel extends APIModel {
    /**
     *  This class is an extended version of APIModel
     *  It keeps the main logic of the base class and provides the opposite mapping:
     *  Maps class properties to API data keys
     *  Besides that it provides update and delete methods for the given resource
     *  And autosave logic to send partial update request when the data is changed
     *
     **/
    @observable isSaving = false;
    @observable formData = {};
    @observable apiError = false;
    debouncedAutoSave = null;
    /*
        These properties must be implemented in subclass
     */

    get editableFieldsMap() {
        throw new Error('Undefined editable fields map');
    }

    get resourceUrl() {
        throw new Error('Undefined url to save');
    }

    get autoSaveInterval() {
        return DEFAULT_AUTOSAVE_INTERVAL;
    }

    @computed
    get changedData() {
        const changedData = {};
        for (const [field, apiField] of this.editableFieldsMap) {
            if (this[field] !== this.formData[field]) {
                changedData[apiField] = this.formData[field];
            }
        }
        return changedData;
    }

    constructor(apiData) {
        super(apiData);
        reaction(() => this.changedData, this._autoSave);
    }

    @action
    setDataFromAPI(apiData) {
        super.setDataFromAPI(apiData);
        const formData = {};
        for (const field of this.editableFieldsMap.keys()) {
            formData[field] = this[field];
        }
        this.formData = formData;
    }

    @autobind
    _autoSave() {
        if (Object.keys(this.changedData).length > 0) {
            this._setSaving(true);
            if (this.debouncedAutoSave) {
                this.debouncedAutoSave.cancel();
            }
            this.debouncedAutoSave = debounce(this._partialUpdate, this.autoSaveInterval);
            this.debouncedAutoSave();
        }
    }

    @autobind
    async _partialUpdate() {
        if (this._cancelTokenSource) {
            // Interrupt the current request before performing the new one
            this._cancelTokenSource.cancel();
        }
        this._cancelTokenSource = CancelToken.source();
        this._setSaving(true);
        try {
            await this._executeUpdate();
            this._setAPIError(false);
            this._finishSaving();
        } catch (e) {
            if (isCancel(e)) {
                return;
            }
            if (e.response) {
                // API error
                this._setAPIError(e);
            }
            // keep tracking how often users face any errors while saving items
            Raven.captureException(e);
            this._finishSaving();
        }
    }

    async _executeUpdate() {
        const response = await udApi.patch(this.resourceUrl, this.changedData);
        this.setDataFromAPI(response.data);
    }

    async delete() {
        try {
            this._setSaving(true);
            await udApi.delete(this.resourceUrl);
        } catch (e) {
            throw e;
        } finally {
            this._setSaving(false);
        }
    }

    @action
    _changeEditableField(fieldName, value) {
        if (this.editableFieldsMap.has(fieldName)) {
            this.formData[fieldName] = value;
        }
    }

    @action
    _setSaving(value) {
        this.isSaving = value;
    }

    @action
    _setAPIError(value) {
        this.apiError = value;
    }

    _finishSaving() {
        this._cancelTokenSource = null;
        this._setSaving(false);
    }
}
