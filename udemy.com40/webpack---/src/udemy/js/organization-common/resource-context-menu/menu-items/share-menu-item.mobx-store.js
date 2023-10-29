import {action, observable, runInAction} from 'mobx';

import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

export default class ShareMenuItemStore {
    @observable isModalShown = false;
    @observable shareData = [];

    constructor(resourceId, resourceType, context) {
        this.resourceId = resourceId;
        this.resourceType = resourceType;
        this.context = context;
    }

    @action
    hideModal = () => {
        this.isModalShown = false;
    };

    @action
    showModal = (shareData) => {
        this.shareData = shareData;
        this.isModalShown = true;
    };

    resourcePreview = async () => {
        try {
            const response = await udApi.get(
                `/share/${this.resourceType}/${this.resourceId}/preview/`,
            );
            this.showModal(response.data.share_data);
        } catch (e) {
            Raven.captureException(e);
            // if there is an error when getting the preview, we still want to show the modal
            runInAction(() => {
                this.isModalShown = true;
            });
        }
    };
}
