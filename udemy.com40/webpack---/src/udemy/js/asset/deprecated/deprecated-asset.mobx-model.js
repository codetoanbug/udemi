import {observable} from 'mobx';

import AssetModel from '../asset.mobx-model';

export default class DeprecatedAssetModel extends AssetModel {
    @observable description = '';

    static requestFields = AssetModel.requestFields.concat(['description', 'download_urls']);

    get apiDataMap() {
        return {
            ...super.apiDataMap,
            description: 'description',
        };
    }
}
