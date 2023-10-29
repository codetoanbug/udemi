import autobind from 'autobind-decorator';
import {action, computed, observable, set} from 'mobx';

import udApi, {parseError} from 'utils/ud-api';
import udMe from 'utils/ud-me';

import {assetStatuses} from '../asset-library/constants';
import {videoMashupAssetFilterParams} from '../curriculum/item/constants';

export class MashupChildModel {
    @observable asset = null;
    @observable isConfirmed = false;

    @autobind
    @action
    confirm() {
        this.isConfirmed = true;
    }

    @autobind
    @action
    cancel() {
        this.asset = null;
        this.isConfirmed = false;
    }

    @autobind
    @action
    setAsset(asset) {
        this.asset = asset;
    }
}

export default class VideoMashupAssetCreatorModel {
    @observable videoChild;
    @observable presentationChild;
    @observable showPreviewConfirmation;
    @observable previewAsset;
    @observable slideTimestamps;
    @observable error;
    @observable isLoadingPreview;
    @observable isSaving;

    constructor() {
        this.reset();
    }

    @autobind
    @action
    reset() {
        set(this, {
            videoChild: new MashupChildModel(),
            presentationChild: new MashupChildModel(),
            showPreviewConfirmation: false,
            previewAsset: null,
            slideTimestamps: '1, 0',
            error: {},
            isLoadingPreview: false,
            isSaving: false,
        });
    }

    _parsedSeconds(hhmmss) {
        let total = 0;
        hhmmss
            .split(':')
            .reverse()
            .forEach((time, index) => {
                total += parseInt(time, 10) * Math.pow(60, index);
            });
        return total;
    }

    @computed
    get parsedSlideTimestamps() {
        const lines = this.slideTimestamps.split('\n');
        const parsed = [];
        lines.forEach((line) => {
            line = line.trim();
            const match = line.match(/(\d+)[\s,]+([\d:]+)/i);
            if (match) {
                parsed.push({slide: match[1] - 1, time: this._parsedSeconds(match[2])});
            }
        });
        return parsed;
    }

    @computed
    get data() {
        if (this.videoChild.asset && this.presentationChild.asset) {
            // Video and Presentation ids must both be in the payload in order for API creation
            // response to be successful.
            return {
                video_asset_id: this.videoChild.asset.id,
                presentation_asset_id: this.presentationChild.asset.id,
                syndication: this.parsedSlideTimestamps,
                title: `${this.videoChild.asset.title} / ${this.presentationChild.asset.title}`,
            };
        }
        return {
            video_asset_id: null,
            presentation_asset_id: null,
            syndication: [],
            title: null,
        };
    }

    @computed
    get isPreviewable() {
        return !!(
            this.videoChild.asset &&
            this.videoChild.isConfirmed &&
            this.videoChild.asset.status === assetStatuses.success &&
            this.presentationChild.asset &&
            this.presentationChild.isConfirmed &&
            this.presentationChild.asset.status === assetStatuses.success
        );
    }

    @computed
    get isProcessing() {
        const videoIsProcessing = !!(
            this.videoChild.asset && this.videoChild.asset.status === assetStatuses.processing
        );
        const presentationIsProcessing = !!(
            this.presentationChild.asset &&
            this.presentationChild.asset.status === assetStatuses.processing
        );
        return videoIsProcessing || presentationIsProcessing;
    }

    @computed
    get numSlides() {
        return (this.presentationChild.asset && this.presentationChild.asset.length) || 0;
    }

    @autobind
    @action
    setSlideTimestamps(value) {
        this.slideTimestamps = value;
    }

    @autobind
    @action
    setShowPreviewConfirmation(value) {
        this.showPreviewConfirmation = value;
    }

    @autobind
    @action
    cancelPreview() {
        this.previewAsset = null;
    }

    @autobind
    @action
    preview() {
        const data = this.data;
        this.isLoadingPreview = true;
        return udApi
            .post(
                '/users/me/preview-mashup-assets/',
                {
                    title: gettext('Preview Mashup'),
                    user: udMe.id,
                    status: assetStatuses.success,
                    data: {
                        videoAssetId: data.video_asset_id,
                        presentationAssetId: data.presentation_asset_id,
                        syndication: data.syndication,
                    },
                },
                {
                    params: {
                        'fields[asset]': videoMashupAssetFilterParams.join(','),
                        tracking_tag: 'mashup_preview',
                    },
                },
            )
            .then(
                action((response) => {
                    this.isLoadingPreview = false;
                    this.previewAsset = response.data;
                    return response.data;
                }),
            )
            .catch(
                action((error) => {
                    this.error = parseError(error);
                    this.isLoadingPreview = false;
                    throw this.error;
                }),
            );
    }

    @autobind
    @action
    save(onSuccess, onError) {
        // See ArticleAssetFormModel.save for comment about why we have `onSuccess` argument.
        this.isSaving = true;
        return udApi
            .post('/users/me/mashup-assets/', this.data)
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
