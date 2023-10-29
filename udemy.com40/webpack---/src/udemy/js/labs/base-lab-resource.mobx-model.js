import {ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {ASSET_TYPE} from 'asset/constants';
import {ERROR_NOTIFICATION_PROPS, NOTIFICATION_OPTIONS} from 'labs/constants';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

import EditableApiModel from './editable-api-model.mobx-model';

export default class BaseLabResource extends EditableApiModel {
    @observable id;
    @observable type;
    /** @type {AssetApiData} asset */
    @observable asset = null;
    @observable isLoading = false;

    get assetUrl() {
        throw new Error('Undefined assetUrl');
    }

    @computed
    get resourceAssetUrl() {
        const assetsUrl = this.assetUrl;
        if (assetsUrl && [ASSET_TYPE.FILE, ASSET_TYPE.EXTERNAL_LINK].includes(this?.asset.type)) {
            return `${assetsUrl}${this.asset.id}/`;
        }
    }

    get displayTitle() {
        throw new Error('Undefined display title');
    }

    @autobind
    async getResourceDownloadUrl() {
        if (!this.resourceAssetUrl) {
            return false;
        }
        this._setIsLoading(true);
        try {
            const response = await udApi.get(this.resourceAssetUrl, {
                params: {'fields[asset]': 'download_urls'},
            });
            const urlsData = response?.data?.download_urls;
            const urls = urlsData[this.asset.type];
            const downloadUrl = urls?.length ? urls[0].file : null;
            if (downloadUrl) {
                return downloadUrl;
            }
            throw new Error(
                `Could not fetch download URL for resource ${this.asset.id} (${this.asset.type})`,
            );
        } catch (e) {
            Raven.captureException(e);
            toasterStore.addAlertBannerToast(
                {...ERROR_NOTIFICATION_PROPS, title: gettext('Unable to download selected item.')},
                NOTIFICATION_OPTIONS,
            );
        } finally {
            this._setIsLoading(false);
        }
    }

    @action
    _setIsLoading(value) {
        this.isLoading = value;
    }
}
