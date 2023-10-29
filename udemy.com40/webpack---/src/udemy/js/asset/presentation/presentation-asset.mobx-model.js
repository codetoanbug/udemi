import {observable} from 'mobx';

import AssetModel from '../asset.mobx-model';

export default class PresentationAssetModel extends AssetModel {
    @observable slideUrls = [];

    static requestFields = AssetModel.requestFields.concat(['slide_urls']);

    get apiDataMap() {
        return {
            ...super.apiDataMap,
            slideUrls: 'slide_urls',
        };
    }
}
