import {action} from 'mobx';

import {EditableApiModel as BaseEditableModel} from 'utils/editable-api-model.mobx-model';

import {LEARNING_PATH_AUTOSAVE_INTERVAL} from './learning-path-page/constants';

export default class EditableApiModel extends BaseEditableModel {
    get autoSaveInterval() {
        return LEARNING_PATH_AUTOSAVE_INTERVAL;
    }

    @action
    _changeEditableField(fieldName, value) {
        if (this.editableFieldsMap.has(fieldName)) {
            this.formData[fieldName] = typeof value === 'string' ? value.trim() : value;
        }
    }
}
