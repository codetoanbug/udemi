import {observable} from 'mobx';

import {APIModel} from 'utils/mobx';

export default class AssetModel extends APIModel {
    @observable id = null;
    @observable title = '';
    @observable status = null;
    @observable delayedAssetMessage = '';
    @observable processingErrors = [];
    @observable fileName = '';

    static requestFields = ['status', 'delayed_asset_message', 'processing_errors'];

    static extraParams = {};

    get apiDataMap() {
        return {
            id: 'id',
            type: 'asset_type',
            fileName: 'filename',
            externalUrl: 'external_url',
            timeEstimation: 'time_estimation',
            mediaLicenseToken: 'media_license_token',
            courseIsDrmed: 'course_is_drmed',
            downloadUrls: 'download_urls',
            title: 'title',
            status: 'status',
            delayedAssetMessage: 'delayed_asset_message',
            processingErrors: 'processing_errors',
            isExternal: 'is_external',
        };
    }

    get isCourseDrmed() {
        return !!this.courseIsDrmed;
    }

    get isEncrypted() {
        return !!this.mediaLicenseToken;
    }

    get downloadUrl() {
        const urls = this.downloadUrls && this.downloadUrls[this.type];
        if (urls && urls.length > 0) {
            return urls[0].file;
        }
    }
}
