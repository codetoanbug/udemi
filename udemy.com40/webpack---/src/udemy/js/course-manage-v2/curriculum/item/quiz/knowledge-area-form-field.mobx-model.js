import autobind from 'autobind-decorator';
import {action, computed, observable, set} from 'mobx';

import {showErrorToast} from 'instructor/toasts';

/**
 * This model represents the "Knowledge Area" field within a multiple choice or multiple
 * select assessment form. It is essentially a <select /> field that allows user to
 * add, edit, and delete options.
 * The options are retrieved at quiz level by selecting distinct `AssessmentModel.knowledgeArea`
 * from all related assessments. The selected option is stored at assessment level
 * (see `MultipleChoiceAssessmentFormModel.selectedKnowledgeAreaIndex`).
 */
export default class KnowledgeAreaFormFieldModel {
    // null means CurriculumQuizModel.refresh request has not completed.
    @observable _options = null;
    @observable toBeAddedOptionValue;
    @observable toBeDeletedOptionIndex;

    constructor() {
        this.reset();
    }

    @action
    reset() {
        // We don't reset `_options` because it's expensive to re-fetch all related assessments.
        set(this, {
            toBeAddedOptionValue: '',
            toBeDeletedOptionIndex: null,
        });
    }

    @computed
    get options() {
        return this._options ? this._options.filter((option) => !option.isDeleted) : null;
    }

    @action
    setOptions(options) {
        this._options = options.map((option) => {
            return {
                value: option,
                initialValue: option,
                isDeleted: false,
            };
        });
    }

    /**
     * This is used by backend to understand which knowledge areas were renamed or deleted.
     */
    @computed
    get nameMap() {
        const map = {};
        this._options.forEach((option) => {
            if (option.isDeleted) {
                map[option.initialValue] = '';
            } else if (option.value && option.initialValue !== option.value) {
                map[option.initialValue] = option.value;
            }
        });
        return Object.entries(map);
    }

    @action
    setToBeAddedOptionValue(value) {
        this.toBeAddedOptionValue = value;
    }

    @autobind
    @action
    add() {
        if (
            !this.toBeAddedOptionValue?.trim() ||
            this.options.some(
                (option) =>
                    option.value.localeCompare(this.toBeAddedOptionValue, undefined, {
                        sensitivity: 'accent',
                    }) === 0,
            )
        ) {
            showErrorToast(gettext('Knowledge Area must not be blank or repeated.'));
        } else {
            this._options.push({
                value: this.toBeAddedOptionValue,
                initialValue: this.toBeAddedOptionValue,
                isDeleted: false,
            });
            this.toBeAddedOptionValue = '';
        }
    }

    @action
    editAtIndex(index, value) {
        this.options[index].value = value;
    }

    @action
    markAsToBeDeleted(index) {
        this.toBeDeletedOptionIndex = index;
    }

    @autobind
    @action
    unmarkAsToBeDeleted() {
        this.toBeDeletedOptionIndex = null;
    }

    @autobind
    @action
    delete() {
        this.options[this.toBeDeletedOptionIndex].isDeleted = true;
        this.unmarkAsToBeDeleted();
    }
}
