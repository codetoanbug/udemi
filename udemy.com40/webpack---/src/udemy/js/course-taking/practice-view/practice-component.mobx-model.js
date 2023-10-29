import assetModelMap from 'asset/asset-model-map';
import AssetModel from 'asset/asset.mobx-model';
import {APIModel} from 'utils/mobx';

export default class PracticeComponentModel extends APIModel {
    get apiDataMap() {
        return {
            id: 'id',
            body: 'body',
            displayType: 'display_type',
            asset: {
                source: 'asset',
                map: (asset) => {
                    if (!asset) {
                        return;
                    }
                    const AssetClass = assetModelMap[asset.asset_type] || AssetModel;
                    return new AssetClass(asset);
                },
            },
        };
    }
}
