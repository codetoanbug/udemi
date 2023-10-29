import {action, observable} from 'mobx';

import udApi from 'utils/ud-api';

export const LOADING_STATUS = {INITIAL: 'INITIAL', CROP: 'CROP', CROPPED: 'CROPPED'};

export default class ImageUploadPreviewWithCropStore {
    constructor(initialImageUrl, {gettext}) {
        this.setImageUrl(initialImageUrl);
        this.lastValidImage = initialImageUrl;
        this.gettext = gettext;
    }

    @observable loadingStatus = LOADING_STATUS.INITIAL;
    @observable cropMode = false;
    @observable error = null;
    @observable imageUrl;

    asset = {};
    pixelCrop = {};
    lastValidImage;

    get isLoading() {
        return !!this.loadingStatus;
    }

    get isLoadingCrop() {
        return this.loadingStatus === LOADING_STATUS.CROP;
    }

    get isLoadingCropped() {
        return this.loadingStatus === LOADING_STATUS.CROPPED;
    }

    @action
    setDataAssetForCrop(assetData) {
        const url = `https://${assetData.bucket}.s3.amazonaws.com/${assetData.key}`;
        this.asset = {
            ...assetData,
            url,
        };
        this.imageUrl = url;
        this.cropMode = true;
        this.setImageLoadingStatus(LOADING_STATUS.CROP);
    }

    @action
    setError(error) {
        const messages = {
            502: this.gettext('The uploaded image is too large. Please upload a smaller image.'),
        };

        if (error.response) {
            this.error =
                messages[error.response.status] || error.response.data || error.response.statusText;
        } else {
            this.error = error;
        }
        this.imageUrl = this.lastValidImage;
        this.setImageLoadingStatus(null);
        this.cropMode = false;
    }

    @action
    cleanError() {
        this.error = null;
    }

    @action
    setImageLoadingStatus(status) {
        this.loadingStatus = status;
    }

    @action
    setImageUrl(url) {
        this.imageUrl = url;
    }

    setPixelCrop(pixelCrop) {
        this.pixelCrop = pixelCrop;
    }

    @action
    updateCropPreview() {
        const data = {
            ...this.asset,
            ...this.pixelCrop,
        };
        this.setImageLoadingStatus(LOADING_STATUS.CROPPED);
        return udApi
            .post('cropped-images/', data)
            .then(
                action((response) => {
                    this.cropMode = false;
                    this.imageUrl = response.data.url;
                    this.lastValidImage = this.imageUrl;
                }),
            )
            .catch(
                action((error) => {
                    this.setError(error);
                }),
            );
    }
}
