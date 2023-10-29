import {action, observable, set} from 'mobx';

import udApi, {parseError} from 'utils/ud-api';

export default class IFrameAssetFormModel {
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
                source_url: (asset && asset.source_url) || '',
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
            .post('/users/me/iframe-assets/', this.data)
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
