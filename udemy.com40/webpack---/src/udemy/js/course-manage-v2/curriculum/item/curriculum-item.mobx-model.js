import autobind from 'autobind-decorator';
import {action, extendObservable, computed, observable} from 'mobx';

import udApi, {parseError} from 'utils/ud-api';

import {curriculumItemSuccessDeleteCopy} from './constants';

export default class CurriculumItemModel {
    // The difference between "Form" and "Content" is that the former tends to handle data
    // stored in the curriculum item's main table, while the latter tends to handle data
    // stored in its related tables. For example, lecture form handles 'title', which is
    // stored in 'lecture' table, while lecture content handles stuff stored in 'asset' table.
    @observable isAddContentOpen = false;
    @observable isEditContentOpen = false;
    @observable isEditFormOpen = false;
    @observable canOpenEditFormSection = true;

    @observable selectedContentType = null;
    @observable error = {};
    @observable isSaving = false;
    @observable isDeleting = false;

    constructor(curriculumItem) {
        extendObservable(this, curriculumItem);
    }

    /**
     * Returns a string uniquely identifying a curriculum item instance.
     * This is used as the React `key` prop. It may also be used as a DOM selector,
     * so avoid characters such as `#`, `:`, `.`.
     */
    @computed
    get key() {
        return `${this.keyClass}${this.id}`;
    }

    /**
     * This is the type of a curriculum item instance. It is interchangeable
     * with the `_class` returned by the API, except it distinguishes the quiz types
     * (CurriculumQuizModel overrides this to be the `type` returned by the API).
     * This is for convenience: instead of checking e.g.
     * `if _class is quiz and type is practice test` every time we need to do something
     * different for practice tests vs simple quizzes, we can simply check
     * `if keyClass is practice test`. If we want to do the same thing for all types of quizzes,
     * we can still check `_class`.
     */
    @computed
    get keyClass() {
        return this._class;
    }

    @computed
    get successDeleteMessage() {
        if (this._class in curriculumItemSuccessDeleteCopy) {
            return curriculumItemSuccessDeleteCopy[this._class];
        }
        return null;
    }

    /**
     * @param course: the CurriculumCourseModel which will be attached as this.course.
     * Creates an instance of this curriculum item with @param data. Returns the create API promise.
     * The promise should resolve to the created instance, and reject with parseError(API error).
     */
    static create(/* course, data */) {
        throw new Error(
            'static create(course, data) must be implemented by CurriculumItemModel subclasses',
        );
    }

    /**
     * Updates this curriculum item with @param data. Returns the update API promise.
     * The common implementation is to call this._partialUpdate with the API url and update fields
     * specific to the CurriculumItemModel subclass.
     */
    partialUpdate(/* data */) {
        throw new Error(
            'partialUpdate(data) must be implemented by CurriculumItemModel subclasses',
        );
    }

    @action
    _partialUpdate(apiUrl, data, updateFields) {
        this.isSaving = true;
        return udApi
            .patch(apiUrl, data, {
                params: {[`fields[${this._class}]`]: updateFields.join(',')},
            })
            .then(
                action((response) => {
                    updateFields.forEach((field) => {
                        this[field] = response.data[field];
                    });
                    this.isSaving = false;
                    return this;
                }),
            )
            .catch(
                action((error) => {
                    this.error = parseError(error);
                    this.isSaving = false;
                    throw this.error;
                }),
            );
    }

    /**
     * Deletes this curriculum item. Returns the delete API promise.
     * The common implementation is to call this._delete with the API url specific to
     * the CurriculumItemModel subclass.
     */
    delete() {
        throw new Error('delete() must be implemented by CurriculumItemModel subclasses');
    }

    @action
    _delete(apiUrl) {
        this.isSaving = true;
        this.isDeleting = true;
        return udApi
            .delete(apiUrl)
            .then(
                action(() => {
                    this.isSaving = false;
                    this.isDeleting = false;
                }),
            )
            .catch(
                action((error) => {
                    this.error = parseError(error);
                    this.isSaving = false;
                    this.isDeleting = false;
                    throw this.error;
                }),
            );
    }

    @action
    setObjectIndex(value) {
        this.object_index = value;
    }

    @autobind
    @action
    openEditForm() {
        this.closeAddContent();
        this.closeEditContent();
        this.isEditFormOpen = true;
    }

    @autobind
    @action
    closeEditForm() {
        this.closeAddContent();
        this.closeEditContent();
        this.isEditFormOpen = false;
    }

    @autobind
    @action
    openEditContent() {
        if (this.canOpenEditFormSection) {
            this.isAddContentOpen = false;
            this.isEditContentOpen = true;
            this.selectedContentType = null;
        }
    }

    @autobind
    @action
    closeEditContent() {
        this.isAddContentOpen = false;
        this.isEditContentOpen = false;
        this.selectedContentType = null;
    }

    @autobind
    toggleEditContent() {
        if (this.isEditContentOpen) {
            this.closeEditContent();
        } else {
            this.openEditContent();
        }
    }

    @autobind
    @action
    openAddContent() {
        this.isAddContentOpen = true;
    }

    @autobind
    @action
    closeAddContent() {
        this.isAddContentOpen = false;
        this.selectedContentType = null;
    }

    @autobind
    @action
    setSelectedContentType(value) {
        this.selectedContentType = value;
    }
}
