import {getUniqueId} from '@udemy/design-system-utils';
import {observable} from 'mobx';

import AssetModel from '../asset.mobx-model';

export default class VideoAssetModel extends AssetModel {
    @observable.ref mediaLicenseToken;
    @observable.ref mediaSources;
    @observable.ref thumbnailSprite;

    static requestFields = AssetModel.requestFields.concat([
        'time_estimation',
        'media_license_token',
        'media_sources',
        'thumbnail_url',
        'captions',
        'thumbnail_sprite',
        'created',
    ]);

    static extraParams = Object.assign({}, AssetModel.extraParams, {
        'fields[caption]': '@default,is_translation',
    });

    get apiDataMap() {
        return {
            ...super.apiDataMap,
            thumbnailUrl: 'thumbnail_url',
            thumbnailSprite: 'thumbnail_sprite',
            mediaLicenseToken: 'media_license_token',
            mediaSources: 'media_sources',
            captions: {
                source: 'captions',
                defaultValue: [],
            },
            created: 'created',
        };
    }

    constructor(apiData) {
        super(apiData);
        this.playerId = getUniqueId(`playerId__${this.id}`);
    }

    get videoPlayerProps() {
        return {
            playerId: this.playerId,
            assetId: this.id,
            mediaLicenseToken: this.mediaLicenseToken,
            mediaSources: (this.mediaSources || []).slice(),
            duration: this.timeEstimation,
            captions: (this.captions || []).slice(),
            thumbnailSprite: this.thumbnailSprite,
        };
    }
}
