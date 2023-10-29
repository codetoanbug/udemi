import { action, computed, observable } from "mobx";

import { EditableApiModel as BaseEditableModel } from "udemy-django-static/js/utils/editable-api-model.mobx-model";

import { LABS_AUTOSAVE_INTERVAL_MS } from "./constants";

export default class EditableApiModel extends BaseEditableModel {
  @observable validationErrors = {};

  get autoSaveInterval() {
    return LABS_AUTOSAVE_INTERVAL_MS;
  }

  @computed
  get hasUnsavedChanges() {
    return Object.keys(this.changedData).length > 0;
  }

  setFormField = (name, value) => {
    this._resetValidationState(name);
    return this._changeEditableField(name, value);
  };

  forceSave = async () => {
    if (this.hasUnsavedChanges) {
      await this._partialUpdate();
    }
  };

  @action
  _setAPIError(value) {
    super._setAPIError(value);
    this.validationErrors = this.apiError?.response?.data
      ? { ...this.apiError.response.data }
      : {};
  }

  @action _resetValidationState(name) {
    const mappedName = this.editableFieldsMap.get(name);
    if (mappedName && this.validationErrors[mappedName]) {
      delete this.validationErrors[mappedName];
    }
  }
}
