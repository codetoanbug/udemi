import {ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import {computed, observable} from 'mobx';

import assetModelMap from 'asset/asset-model-map';
import AssetModel from 'asset/asset.mobx-model';
import {ERROR_NOTIFICATION_PROPS, NOTIFICATION_OPTIONS, RESOURCE_TYPE_HOW_TO} from 'labs/constants';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

import BaseLabResource from './base-lab-resource.mobx-model';

export default class LabTaskResource extends BaseLabResource {
    /** @type {LabTask} task */
    @observable.ref task = null;

    constructor(data, labTask) {
        super(data);
        this.task = labTask;
    }

    get editableFieldsMap() {
        return new Map([
            ['title', 'title'],
            ['body', 'body'],
            ['url', 'url'],
        ]);
    }

    get assetUrl() {
        return this?.task?.lab.assetsUrl;
    }

    get resourceUrl() {
        return `${this.task.taskResourcesUrl}${this.id}/`;
    }

    @computed
    get displayTitle() {
        if (this.type === RESOURCE_TYPE_HOW_TO) {
            return this.task.title;
        }
        return this.asset?.title || this.task.title;
    }

    get apiDataMap() {
        return {
            id: 'id',
            type: 'type',
            title: {
                source: 'asset',
                map: (asset) => asset.title,
            },
            body: {
                source: 'asset',
                map: (asset) => asset.body,
            },
            url: {
                source: 'asset',
                map: (asset) => asset.external_url,
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

    async getResourceExternalUrl() {
        if (!this.resourceAssetUrl) {
            return false;
        }
        this._setIsLoading(true);
        try {
            const response = await udApi.get(this.resourceAssetUrl, {
                params: {'fields[asset]': 'external_url'},
            });
            const url = response?.data?.external_url;
            if (url) {
                return url;
            }
            throw new Error(
                `Could not fetch external URL for resource ${this.asset.id} (${this.asset.type})`,
            );
        } catch (e) {
            Raven.captureException(e);
            toasterStore.addAlertBannerToast(
                {
                    ...ERROR_NOTIFICATION_PROPS,
                    title: gettext('Unable to redirect to the selected resource.'),
                },
                NOTIFICATION_OPTIONS,
            );
        } finally {
            this._setIsLoading(false);
        }
    }

    _finishSaving() {
        super._finishSaving();
        this.task?.lab?.setForceUnpublishedChanges(true);
    }
}
