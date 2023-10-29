import {observable} from 'mobx';

import DeprecatedAssetModel from '../deprecated/deprecated-asset.mobx-model';

export default class EBookAssetModel extends DeprecatedAssetModel {
    @observable objectUrl = '';

    static requestFields = DeprecatedAssetModel.requestFields.concat(['url_set']);

    get apiDataMap() {
        return {
            ...super.apiDataMap,
            objectUrl: {
                source: ['asset_type', 'url_set'],
                map: (assetType, urlSet) => {
                    if (urlSet[assetType] && urlSet[assetType].length) {
                        return urlSet[assetType][0].file;
                    }
                },
            },
        };
    }
}
