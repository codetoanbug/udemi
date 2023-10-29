import {observable} from 'mobx';

import AssetModel from '../asset.mobx-model';

export default class IFrameAssetModel extends AssetModel {
    @observable sourceUrl = '';

    static requestFields = AssetModel.requestFields.concat(['source_url']);

    get apiDataMap() {
        return {
            ...super.apiDataMap,
            sourceUrl: 'source_url',
        };
    }
}
