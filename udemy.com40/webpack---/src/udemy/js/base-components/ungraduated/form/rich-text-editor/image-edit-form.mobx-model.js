import {action, observable, set} from 'mobx';

import {validateHref} from './helpers';

export default class ImageEditFormModel {
    @observable initial;
    @observable data;
    @observable error;

    constructor({gettext}) {
        this.gettext = gettext;
        this.reset();
    }

    @action
    reset(state = {data: {}}) {
        const data = {
            alt: '',
            caption: '',
            height: '',
            href: '',
            src: '',
            width: '',
            ...state.data,
        };
        set(this, {
            initial: data,
            data: {...data},
            error: {},
        });
    }

    /**
     * Return whether the form data is valid.
     * If { commit: false }, do not change any observables.
     */
    @action
    isValid(options = {commit: true}) {
        const validatedData = {};
        const error = {};
        validateHref(this.data.href, validatedData, error, false, this.gettext);
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
    setData(name, value) {
        this.data[name] = value;
    }
}
