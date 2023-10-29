import autobind from 'autobind-decorator';
import {CancelToken, isCancel} from 'axios';
import {action, computed, observable} from 'mobx';

import debounce from 'utils/debounce';
import udApi, {udParamsSerializer} from 'utils/ud-api';

import {assetFilterParams} from '../curriculum/item/constants';
import {assetTypes} from './constants';

export default class AssetLibraryStore {
    type;
    cancelSource;
    @observable isInitialized = false;
    @observable isLoading = false;

    @observable page = 1;
    @observable pageSize = 10;
    @observable total = 0;
    @observable unused = true;
    @observable assets = [];
    @observable searchQuery = '';
    @observable sortBy = {fieldName: 'created', ascending: false};

    sortableFields = ['title', 'created'];

    constructor(type) {
        this.type = type;
        this._debouncedSearchAssets = debounce(this._searchAssets, 200);
    }

    @computed
    get numPages() {
        return Math.ceil(this.total / this.pageSize);
    }

    @autobind
    @action
    setPage(page) {
        this.page = page;
        return this._loadAssets();
    }

    @action
    setSearchQuery(searchQuery) {
        this.searchQuery = searchQuery;
        this._debouncedSearchAssets();
    }

    @autobind
    @action
    _searchAssets() {
        this.page = 1;
        this._loadAssets();
    }

    @autobind
    @action
    setSortBy(col) {
        const isActive = col.fieldName === this.sortBy.fieldName;
        this.sortBy = {
            fieldName: col.fieldName,
            ascending: isActive ? !this.sortBy.ascending : col.initialSortOrder === 'ascending',
        };

        return this._loadAssets();
    }

    @action
    _loadAssets() {
        if (this.isLoading) {
            this.cancelSource.cancel();
        }

        this.isLoading = true;
        this.cancelSource = CancelToken.source();

        const params = {
            page: this.page,
            unused: this.unused,
            page_size: this.pageSize,
            'fields[asset]': assetFilterParams.join(','),
        };

        if (this.sortBy.ascending) {
            params.ordering = this.sortBy.fieldName;
        } else {
            params.ordering = `-${this.sortBy.fieldName}`;
        }

        if (this.searchQuery) {
            params.search = this.searchQuery;
        }

        if (this.type) {
            if (this.type === 'Misc') {
                // This list includes all valid supplementary asset types, i.e. one of:
                // - assetTypes.file (downloadable resource)
                // - assetTypes.externalLink (external link)
                // - assetTypes.sourceCode (functionally the same as assetTypes.file, but
                //   for legacy reasons it still has its own asset type)
                // - any downloadable asset type (functionally the same as assetTypes.file,
                //   but for example if user uploads a .mp4 file using the bulk uploader,
                //   assetTypes.video takes precedence over assetTypes.file)
                this.type = [
                    assetTypes.audio,
                    assetTypes.ebook,
                    assetTypes.externalLink,
                    assetTypes.file,
                    assetTypes.presentation,
                    assetTypes.sourceCode,
                    assetTypes.video,
                    assetTypes.videoMashup,
                ];
            }
            params.asset_type = this.type;
        }

        return udApi
            .get('/users/me/assets/', {
                params,
                cancelToken: this.cancelSource.token,
                // This is needed to make `asset_type` filter work. The default serializer sends
                // `?asset_type[]`. We want `?asset_type`.
                paramsSerializer: (params) => udParamsSerializer(params, {arrayBrackets: false}),
            })
            .then(
                action(({data}) => {
                    this.assets = data.results.map((result) => {
                        result.isDisabled = false;
                        result.openExtraInfo = false;
                        return result;
                    });
                    this.total = data.count;
                }),
            )
            .catch(
                action((err) => {
                    if (!isCancel(err)) {
                        this.assets = [];
                        this.total = 0;
                    }
                }),
            )
            .then(
                action(() => {
                    this.isInitialized = true;
                    this.isLoading = false;
                }),
            );
    }

    @autobind
    @action
    deleteAsset(assetId) {
        const asset = this.assets.find((asset) => asset.id == assetId);
        asset.isDisabled = true;
        return udApi
            .delete(`/users/me/assets/${assetId}/`)
            .then(
                action(() => {
                    this.assets.remove(asset);
                    this.total -= 1;
                }),
            )
            .catch(
                action(() => {
                    asset.isDisabled = false;
                }),
            );
    }

    @autobind
    @action
    toggleAssetInfo(assetId) {
        const asset = this.assets.find((asset) => asset.id == assetId);
        asset.openExtraInfo = !asset.openExtraInfo;
    }

    @computed
    get isDisabled() {
        return this.assets.some((asset) => asset.isDisabled);
    }

    @action
    disableAsset(assetId) {
        const asset = this.assets.find((asset) => asset.id == assetId);
        asset.isDisabled = true;
    }
}
