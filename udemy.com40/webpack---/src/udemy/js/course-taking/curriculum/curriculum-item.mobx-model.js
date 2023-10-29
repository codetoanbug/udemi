import {getConfigData} from '@udemy/shared-utils';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import assetModelMap from 'asset/asset-model-map';
import AssetModel from 'asset/asset.mobx-model';
import {showErrorToast} from 'course-taking/toasts';
import {APIModel} from 'utils/mobx';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

export default class CurriculumItem extends APIModel {
    @observable isCompleted = false;
    // Used if curriculum item needs some UI checkbox selection
    @observable isSelected = false;
    @observable isLoading = false;
    @observable isCpeFinalExam = false;

    get apiDataMap() {
        return {
            id: {
                source: 'id',
                defaultValue: -1,
            },
            type: '_class',
            isPublished: {
                source: 'is_published',
                defaultValue: true,
            },
            objectIndex: 'object_index',
            sortOrder: 'sort_order',
            title: 'title',
            resources: {
                source: 'supplementary_assets',
                map: (supplementaryAssets) =>
                    supplementaryAssets.map((asset) => {
                        const AssetClass = assetModelMap[asset.asset_type] || AssetModel;
                        return new AssetClass(asset);
                    }),
                defaultValue: [],
            },
        };
    }

    get isExcludedFromCurriculumCount() {
        return false; // any model wanting to exclude itself will define this to return true e.g. Practice (i.e. assignments)
    }

    /**
     *
     * @param apiData
     * @param courseId
     * @param globalOverrides is optional. This was added when refactoring lecture-progress-card to use ud data provider package,
     *  but is optional and falls back to global udConfig to keep the PR to browse components only.
     */
    constructor(apiData, courseId, globalOverrides = {}) {
        super(apiData);

        if (this.constructor === CurriculumItem) {
            throw new Error(
                'Cannot instantiate CurriculumItem base class directly - use one of the available subclasses.',
            );
        }

        // Required for various API endpoints that still encode course ID in the URL.
        this.courseId = courseId;
        this.Config = globalOverrides.Config ?? getConfigData();
    }

    @autobind
    @action
    setIsSelected(value) {
        this.isSelected = value;
    }

    @autobind
    @action
    setComplete() {
        this.isCompleted = true;
    }

    @autobind
    @action
    setIncomplete() {
        this.isCompleted = false;
    }

    @autobind
    @action
    toggleComplete() {
        if (this.isCompleted) {
            return this.markAsIncomplete();
        }

        return this.markAsComplete();
    }

    @autobind
    markAsComplete() {
        // will be defined by supported sub-classes
        throw new Error(`Unable to mark ${this.constructor.name} as completed.`);
    }

    @autobind
    @action
    markAsIncomplete() {
        if (!this.isCompleted) {
            return Promise.resolve();
        }

        this.isLoading = true;
        this.setIncomplete();

        return udApi
            .delete(this.markIncompleteUrl)
            .catch(this.setComplete)
            .finally(
                action(() => {
                    this.isLoading = false;
                }),
            );
    }

    updateProgress(progressData) {
        return udApi.post(this.progressApiUrl, progressData);
    }

    @autobind
    @action
    getResourceExternalURL(resource) {
        return udApi
            .get(`${this.resourcesApiUrl}${resource.id}/`, {
                params: {'fields[asset]': 'external_url'},
            })
            .then(
                action(({data}) => {
                    if (!data.external_url) {
                        throw new Error(
                            `Could not fetch external URL for resource ${resource.id} (${resource.type})`,
                        );
                    }
                    return data.external_url;
                }),
            )
            .catch((error) => {
                Raven.captureException(error);
                showErrorToast(gettext('Unable to redirect to the selected resource.'));
                return error;
            });
    }

    @autobind
    @action
    getResourceDownloadURL(resource) {
        return udApi
            .get(`${this.resourcesApiUrl}${resource.id}/`, {
                params: {'fields[asset]': 'download_urls'},
            })
            .then(
                action(({data}) => {
                    if (
                        data.download_urls &&
                        data.download_urls[resource.type] &&
                        data.download_urls[resource.type].length
                    ) {
                        return data.download_urls[resource.type][0].file;
                    }
                    throw new Error(
                        `Could not fetch download URL for resource ${resource.id} (${resource.type})`,
                    );
                }),
            )
            .catch((error) => {
                Raven.captureException(error);
                showErrorToast(gettext('Unable to download selected item.'));
                return error;
            });
    }

    get titleIndex() {
        return '';
    }

    @computed
    get displayTitle() {
        if (this.isCpeFinalExam) {
            return this.title;
        }
        return `${this.titleIndex} ${this.title}`;
    }

    get canBeCompleted() {
        return this.isPublished;
    }

    get canUserToggleCompletion() {
        return true;
    }

    get resourcesApiUrl() {
        // will be defined by supported sub-classes
        throw new Error('Currriculum item does not support resources.');
    }

    get progressApiUrl() {
        // will be defined by supported sub-classes
        throw new Error('Currriculum item does not support progress updates.');
    }

    get markIncompleteUrl() {
        // will be defined by supported sub-classes
        throw new Error(`Unable to mark ${this.constructor.name} as incomplete.`);
    }
}
