import DeprecatedAssetModel from '../deprecated/deprecated-asset.mobx-model';

export default class ImportContentAssetModel extends DeprecatedAssetModel {
    static requestFields = DeprecatedAssetModel.requestFields.concat(['external_url']);

    get apiDataMap() {
        return {
            ...super.apiDataMap,
            externalUrl: 'external_url',
        };
    }

    get downloadUrl() {
        return this.externalUrl;
    }
}
