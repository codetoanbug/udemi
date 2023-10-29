import autobind from 'autobind-decorator';
import {action, computed, observable, set} from 'mobx';

import udApi, {parseError} from 'utils/ud-api';

export default class ArticleAssetFormModel {
    @observable data;
    @observable error;
    @observable isSaving;

    constructor() {
        this.reset();
    }

    @action
    reset(asset) {
        set(this, {
            data: {
                body: (asset && asset.body) || '',
                ignore_warnings: false, // Django expects snake_case.
            },
            error: {},
            isSaving: false,
        });
    }

    @computed
    get bodyError() {
        if (!this.error.body) {
            return null;
        }
        const bodyError = this.error.body[0];
        if (typeof bodyError === 'string') {
            // Example: empty content triggers "this field is required" error.
            return {
                messages: [bodyError],
                type: 'error',
            };
        }
        // Example: content containing external links triggers warning messages.
        return {
            messages: bodyError.messages || [],
            type: bodyError.type || 'error',
        };
    }

    @autobind
    @action
    setBody(value) {
        if (this.data.body !== value) {
            this.data.ignore_warnings = false;
        }
        this.data.body = value;
    }

    @action
    save(onSuccess, onError) {
        // We're passing in `onSuccess` callback instead of chaining `.then(onSuccess)`
        // because we want `onSuccess(response.data)` and `this.isSaving = false;` to run in the
        // same `action`. This prevents the form submit button, which has
        // `disabled={ this.isSaving || curriculumItem.isSaving }`, from flickering undisabled state.
        this.isSaving = true;
        return udApi
            .post('/users/me/article-assets/', this.data)
            .then(
                action((response) => {
                    this.isSaving = false;
                    return onSuccess ? onSuccess(response.data) : response.data;
                }),
            )
            .catch(
                action((error) => {
                    this.error = parseError(error);
                    if (this.bodyError.type === 'warning') {
                        this.data.ignore_warnings = true;
                    }
                    this.isSaving = false;
                    return onError ? onError(this.error) : this.error;
                }),
            );
    }
}
