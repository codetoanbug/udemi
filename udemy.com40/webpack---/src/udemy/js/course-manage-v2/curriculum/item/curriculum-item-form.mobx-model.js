import {observable, action, set} from 'mobx';

/**
 * This is an abstract model which stores curriculum item form data.
 * It is subclassed by specific curriculum item types, e.g. CurriculumLectureFormModel.
 */
export default class CurriculumItemFormModel {
    @observable data;
    @observable error;
    @observable isSaving;

    constructor() {
        this.reset();
    }

    /**
     * Returns the initial data for the form. It should handle both the create case, when
     * curriculumItem is null, and the update case, when curriculumItem is a CurriculumItemModel instance.
     */
    _getInitialData(/* curriculumItem */) {
        throw new Error(
            '_getInitialData(curriculumItem) must be implemented by CurriculumItemFormModel subclasses',
        );
    }

    @action
    reset(curriculumItem) {
        set(this, {
            data: this._getInitialData(curriculumItem),
            error: {},
            isSaving: false,
        });
    }

    @action
    setField(fieldName, fieldValue) {
        this.data[fieldName] = fieldValue;
    }

    @action
    startSaving() {
        this.isSaving = true;
        this.error = {};
    }

    @action
    finishSaving(error) {
        this.isSaving = false;
        this.error = error || {};
    }
}
