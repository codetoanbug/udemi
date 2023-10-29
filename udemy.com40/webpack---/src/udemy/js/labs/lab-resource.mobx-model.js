import {computed, observable} from 'mobx';

import assetModelMap from 'asset/asset-model-map';
import AssetModel from 'asset/asset.mobx-model';

import {labBaseApiUrl} from './apis';
import BaseLabResource from './base-lab-resource.mobx-model';

export default class LabResource extends BaseLabResource {
    @observable.ref lab = null;

    constructor(data, lab) {
        super(data);
        this.lab = lab;
    }

    get editableFieldsMap() {
        return new Map([['title', 'title']]);
    }

    get assetUrl() {
        return this?.lab.assetsUrl;
    }

    get resourceUrl() {
        return `${labBaseApiUrl(this.lab.id)}resources/${this.id}/`;
    }

    @computed
    get displayTitle() {
        return this.asset?.title;
    }

    get apiDataMap() {
        return {
            id: 'id',
            type: 'type',
            title: {
                source: 'asset',
                map: (asset) => asset.title,
            },
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

    _finishSaving() {
        super._finishSaving();
        this.lab?.setForceUnpublishedChanges(true);
    }
}
