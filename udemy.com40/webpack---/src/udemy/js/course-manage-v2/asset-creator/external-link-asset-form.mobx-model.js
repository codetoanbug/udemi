import {action, observable, set} from 'mobx';

import udApi, {parseError} from 'utils/ud-api';

export default class ExternalLinkAssetFormModel {
    @observable data;
    @observable error;
    @observable isSaving;

    constructor() {
        this.reset();
    }

    @action
    reset() {
        set(this, {
            data: {
                title: '',
                url: '',
            },
            error: {},
            isSaving: false,
        });
    }

    @action
    setField(fieldName, fieldValue) {
        this.data[fieldName] = fieldValue;
    }

    @action
    save(onSuccess, onError) {
        // See ArticleAssetFormModel.save for comment about why we have `onSuccess` argument.
        this.isSaving = true;
        return udApi
            .post('/users/me/external-link-assets/', this.data)
            .then(
                action((response) => {
                    this.isSaving = false;
                    return onSuccess ? onSuccess(response.data) : response.data;
                }),
            )
            .catch(
                action((error) => {
                    this.error = parseError(error);
                    this.isSaving = false;
                    return onError ? onError(this.error) : this.error;
                }),
            );
    }
}
