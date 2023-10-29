import {action, observable, set} from 'mobx';

import {validateHref} from './helpers';

export class AnchorFormModel {
    @observable initial;
    @observable isEditing;
    @observable data;
    @observable error;

    constructor({gettext}) {
        this.reset();
        this.gettext = gettext;
    }

    @action
    reset(state = {data: {}, isEditing: false}) {
        const data = {
            href: '',
            text: '',
            ...state.data,
        };
        set(this, {
            initial: data,
            isEditing: state.isEditing,
            data: {...data},
            error: {},
        });
    }

    /**
     * Returns whether the form data is valid.
     * If { commit: false }, do not change any observables.
     */
    @action
    isValid(options = {commit: true}) {
        const validatedData = {};
        const error = {};
        validateHref(this.data.href, validatedData, error, true, this.gettext);
        if (validatedData.href && !this.data.text) {
            validatedData.text = validatedData.href;
        } else if (this.data.text?.trim()) {
            validatedData.text = this.data.text;
        } else {
            error.text = this.gettext('This field is required.');
        }
        const hasNoErrors = Object.keys(error).length === 0;
        if (options.commit) {
            this.error = error;
            if (hasNoErrors) {
                this.data = {...this.data, ...validatedData};
            }
        }
        return hasNoErrors;
    }

    hasFieldChanged(fieldName) {
        return this.data[fieldName] !== this.initial[fieldName];
    }

    @action
    setIsEditing(value) {
        this.isEditing = value;
    }

    @action
    setData(name, value) {
        this.data[name] = value;
    }
}
