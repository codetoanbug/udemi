import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, computed, intercept, observable} from 'mobx';

import {CourseManageActionEvent} from 'course-manage-v2/events';
import udApi, {parseError, startPollApi} from 'utils/ud-api';
import udLink from 'utils/ud-link';

import ArticleAssetFormModel from '../../../asset-creator/article-asset-form.mobx-model';
import AssetUploaderStore from '../../../asset-creator/asset-uploader.mobx-store';
import ExternalLinkAssetFormModel from '../../../asset-creator/external-link-asset-form.mobx-model';
import IFrameAssetFormModel from '../../../asset-creator/i-frame-asset-form.mobx-model';
import VideoMashupAssetCreatorModel from '../../../asset-creator/video-mashup-asset-creator.mobx-model';
import AssetLibraryStore from '../../../asset-library/asset-library.mobx-store';
import {
    assetStatuses,
    assetTypes,
    textBasedAssetTypes,
    videoBasedAssetTypes,
    lhaTypes,
} from '../../../asset-library/constants';
import {lectureFilterParams, lectureMainAssetFilterParams, assetFilterParams} from '../constants';
import CurriculumItemModel from '../curriculum-item.mobx-model';

const defaultRefreshInterval = 10000;

export default class CurriculumLectureModel extends CurriculumItemModel {
    @observable isDescriptionFormOpen = false;
    @observable toBeDeletedSupplementaryAssetId = null;
    @observable showReplaceWithVideoConfirmation = false;

    constructor(curriculumItem) {
        super(curriculumItem);
        this.assetForms = {
            [assetTypes.article]: new ArticleAssetFormModel(),
            [assetTypes.externalLink]: new ExternalLinkAssetFormModel(),
            [assetTypes.iFrame]: new IFrameAssetFormModel(),
        };
        this.assetUploaderStores = {
            [assetTypes.audio]: new AssetUploaderStore(assetTypes.audio),
            [assetTypes.ebook]: new AssetUploaderStore(assetTypes.ebook),
            [assetTypes.misc]: new AssetUploaderStore(assetTypes.misc),
            [assetTypes.presentation]: new AssetUploaderStore(assetTypes.presentation),
            [assetTypes.sourceCode]: new AssetUploaderStore(assetTypes.sourceCode),
            [assetTypes.video]: new AssetUploaderStore(assetTypes.video),
        };
        this.assetLibraryStores = {
            [assetTypes.audio]: new AssetLibraryStore(assetTypes.audio),
            [assetTypes.ebook]: new AssetLibraryStore(assetTypes.ebook),
            [assetTypes.misc]: new AssetLibraryStore(assetTypes.misc),
            [assetTypes.presentation]: new AssetLibraryStore(assetTypes.presentation),
            [assetTypes.video]: new AssetLibraryStore(assetTypes.video),
        };
        this.videoMashupAssetCreator = new VideoMashupAssetCreatorModel();

        intercept(this, 'selectedContentType', this._clearPreviouslyUploadedAsset);
    }

    @computed
    get hasCompletedAssetContent() {
        return !!this.asset && this.asset.status === assetStatuses.success;
    }

    @computed
    get hasTextBasedAssetContent() {
        return !!this.asset && textBasedAssetTypes.has(this.asset.asset_type);
    }

    @computed
    get hasVideoBasedAssetContent() {
        return !!this.asset && videoBasedAssetTypes.has(this.asset.asset_type);
    }

    @computed
    get previewAsInstructorUrl() {
        return udLink.toCourseTaking(this.course.url, `lecture/${this.id}`, {
            instructorPreviewMode: 'instructor_v4',
        });
    }

    @computed
    get previewAsStudentUrl() {
        return udLink.toCourseTaking(this.course.url, `lecture/${this.id}`, {
            instructorPreviewMode: 'student_v4',
        });
    }

    @computed
    get classifiedSupplementaryAssets() {
        const classified = {
            interactive: [],
            downloadable: [],
            external: [],
        };
        this.supplementary_assets.forEach((asset) => {
            switch (asset.asset_type) {
                case assetTypes.sourceCode:
                    classified.interactive.push(asset);
                    break;
                case assetTypes.externalLink:
                    classified.external.push(asset);
                    break;
                default:
                    classified.downloadable.push(asset);
                    break;
            }
        });
        return classified;
    }

    @autobind
    @action
    _clearPreviouslyUploadedAsset(change) {
        if (this.selectedContentType !== change.newValue) {
            if (change.newValue === assetTypes.videoMashup) {
                this.assetUploaderStores[assetTypes.video].deleteAsset();
                this.assetUploaderStores[assetTypes.presentation].deleteAsset();
            }
            if (change.newValue === assetTypes.file) {
                this.assetUploaderStores[assetTypes.misc].deleteAsset();
                this.assetUploaderStores[assetTypes.sourceCode].deleteAsset();
            }
            if (this.assetUploaderStores[change.newValue]) {
                this.assetUploaderStores[change.newValue].deleteAsset();
            }
            if (
                change.newValue === null &&
                this.asset &&
                this.assetUploaderStores[this.asset.asset_type]
            ) {
                // change.newValue === null happens when we closeAddContent.
                // We want to restore this.asset if it exists.
                this.assetUploaderStores[this.asset.asset_type].initializeAsset(this.asset);
            }
        }
        return change;
    }

    @autobind
    @action
    openDescriptionForm() {
        this.isDescriptionFormOpen = true;
    }

    @autobind
    @action
    closeDescriptionForm() {
        this.isDescriptionFormOpen = false;
    }

    @autobind
    @action
    setDescription(value) {
        this.description = value;
    }

    @autobind
    @action
    openDeleteSupplementaryAssetConfirmation(assetId) {
        this.toBeDeletedSupplementaryAssetId = assetId;
    }

    @autobind
    @action
    closeDeleteSupplementaryAssetConfirmation() {
        this.toBeDeletedSupplementaryAssetId = null;
    }

    @action
    deleteSupplementaryAsset() {
        const assetId = this.toBeDeletedSupplementaryAssetId;
        if (assetId === null) {
            return Promise.resolve();
        }
        this.closeDeleteSupplementaryAssetConfirmation();
        this.isSaving = true;
        return udApi
            .delete(
                `/users/me/taught-courses/${this.course.id}/lectures/${this.id}/assets/${assetId}/`,
            )
            .then(
                action(() => {
                    for (let i = 0; i < this.supplementary_assets.length; i++) {
                        if (this.supplementary_assets[i].id === assetId) {
                            this.supplementary_assets.splice(i, 1);
                            break;
                        }
                    }
                    this.isSaving = false;
                }),
            )
            .catch(
                action((error) => {
                    this.error = parseError(error);
                    this.isSaving = false;
                    throw this.error;
                }),
            );
    }

    retrieve(params) {
        return udApi
            .get(`/users/me/taught-courses/${this.course.id}/lectures/${this.id}/`, {
                params,
            })
            .then((response) => {
                return response.data;
            })
            .catch(
                action((error) => {
                    this.error = parseError(error);
                    throw this.error;
                }),
            );
    }

    static create(course, data) {
        return udApi
            .post(`/users/me/taught-courses/${course.id}/lectures/`, data, {
                params: {
                    'fields[lecture]': lectureFilterParams.join(','),
                    'fields[asset]': assetFilterParams.join(','),
                },
            })
            .then((response) => {
                Tracker.publishEvent(
                    new CourseManageActionEvent({
                        courseId: course.id,
                        category: 'create_lecture',
                        action: 'create',
                        objectType: 'lecture',
                        objectId: response.data.id,
                    }),
                );
                return new CurriculumLectureModel({...response.data, course});
            })
            .catch((error) => {
                throw parseError(error);
            });
    }

    @action
    partialUpdate(data) {
        return this._partialUpdate(
            `/users/me/taught-courses/${this.course.id}/lectures/${this.id}/`,
            data,
            Object.keys(data),
        );
    }

    delete() {
        return this._delete(`/users/me/taught-courses/${this.course.id}/lectures/${this.id}/`);
    }

    /**
     * Retrieves unattached asset from API. This is used to read child assets in mashup
     * creator. For attached assets (this.asset or this.supplementary_assets),
     * call `this.retrieve` and check `lecture.asset` or `lecture.supplementary_assets` respectively.
     * This method has the drawback of returning 404 for co-instructors who did not upload the asset.
     */
    readUnattachedAsset(assetId, params) {
        return udApi
            .get(`/users/me/assets/${assetId}/`, {
                params,
            })
            .then((response) => {
                return response.data;
            })
            .catch(
                action((error) => {
                    this.error = parseError(error);
                    throw this.error;
                }),
            );
    }

    @action
    onRefreshError(error, onError) {
        this.error = error;
        if (onError) {
            onError(error);
        }
    }

    refreshUnattachedAsset(
        assetId,
        params,
        onSuccess,
        onError,
        shouldContinueFn,
        shouldStopFn,
        interval = defaultRefreshInterval,
    ) {
        return startPollApi(
            `/users/me/assets/${assetId}/`,
            params,
            onSuccess,
            (error) => this.onRefreshError(error, onError),
            shouldContinueFn,
            shouldStopFn,
            interval,
        );
    }

    refreshMainAsset(onError, interval = defaultRefreshInterval) {
        return startPollApi(
            `/users/me/taught-courses/${this.course.id}/lectures/${this.id}/`,
            {
                'fields[lecture]': lectureMainAssetFilterParams.join(','),
                'fields[asset]': assetFilterParams.join(','),
            },
            this._setMainAsset,
            (error) => this.onRefreshError(error, onError),
            () => !!this.asset && this.asset.status === assetStatuses.processing,
            (lecture) => !this.asset || this.asset.id !== lecture.asset.id,
            interval,
        );
    }

    refreshSupplementaryAssets(onError, interval = defaultRefreshInterval) {
        return startPollApi(
            `/users/me/taught-courses/${this.course.id}/lectures/${this.id}/`,
            {
                'fields[lecture]': 'supplementary_assets',
                'fields[asset]': assetFilterParams.join(','),
            },
            action((lecture) => {
                // Doing `this.supplementary_assets = lecture.supplementary_assets;`
                // is risky here because instructor could have added or deleted supplementary assets
                // while a refresh call was in progress.
                const idToAsset = {};
                lecture.supplementary_assets.forEach((asset) => {
                    idToAsset[asset.id] = asset;
                });
                this.supplementary_assets.forEach((asset) => {
                    const updatedAsset = idToAsset[asset.id];
                    if (updatedAsset) {
                        Object.assign(asset, updatedAsset);
                    }
                });
            }),
            (error) => this.onRefreshError(error, onError),
            () =>
                this.supplementary_assets.some(
                    (asset) => asset.status === assetStatuses.processing,
                ),
            undefined,
            interval,
        );
    }

    @action
    attachMainAsset(assetId) {
        this.isSaving = true;
        return udApi
            .post(`/users/me/taught-courses/${this.course.id}/lectures/${this.id}/assets/`, {
                asset_id: assetId,
                type: lhaTypes.main,
            })
            .then(() => {
                Tracker.publishEvent(
                    new CourseManageActionEvent({
                        courseId: this.course.id,
                        category: 'create_lecture_asset',
                        action: 'create',
                        objectType: 'asset',
                        objectId: assetId,
                    }),
                );
                return this.retrieve({
                    'fields[lecture]': lectureMainAssetFilterParams.join(','),
                    'fields[asset]': assetFilterParams.join(','),
                });
            })
            .then(
                action((lecture) => {
                    this._setMainAsset(lecture);
                    this.isSaving = false;
                    return this.asset;
                }),
            )
            .catch(
                action((error) => {
                    this.error = parseError(error);
                    this.isSaving = false;
                    throw this.error;
                }),
            );
    }

    @action
    attachSupplementaryAsset(assetId) {
        this.isSaving = true;
        return udApi
            .post(`/users/me/taught-courses/${this.course.id}/lectures/${this.id}/assets/`, {
                asset_id: assetId,
                type: lhaTypes.supplementary,
            })
            .then(() => {
                return this.retrieve({
                    'fields[lecture]': 'supplementary_assets',
                    'fields[asset]': assetFilterParams.join(','),
                });
            })
            .then(
                action((lecture) => {
                    this.supplementary_assets = lecture.supplementary_assets;
                    this.isSaving = false;
                    return this;
                }),
            )
            .catch(
                action((error) => {
                    this.error = parseError(error);
                    this.isSaving = false;
                    throw this.error;
                }),
            );
    }

    @autobind
    @action
    openReplaceWithVideoConfirmation() {
        this.showReplaceWithVideoConfirmation = true;
    }

    @autobind
    @action
    closeReplaceWithVideoConfirmation() {
        this.showReplaceWithVideoConfirmation = false;
    }

    @autobind
    @action
    replaceWithVideo() {
        this.showReplaceWithVideoConfirmation = false;
        this.isSaving = true;
        const oldLecture = this;
        return CurriculumLectureModel.create(this.course, {
            title: this.title,
            description: this.description,
            object_index: this.object_index,
            sort_order: this.sort_order,
        })
            .then((newLecture) => {
                return udApi
                    .delete(
                        `/users/me/taught-courses/${oldLecture.course.id}/lectures/${oldLecture.id}/assets/${oldLecture.asset.id}/`,
                    )
                    .then(() => newLecture);
            })
            .then((newLecture) => {
                return udApi
                    .delete(
                        `/users/me/taught-courses/${oldLecture.course.id}/lectures/${oldLecture.id}/`,
                    )
                    .then(() => newLecture);
            })
            .then((newLecture) => {
                let assets = [];

                // If the old asset is of a non-plaintext type, attach it as a supplementary asset.
                if (oldLecture.asset && !oldLecture.hasTextBasedAssetContent) {
                    assets.push(oldLecture.asset);
                }

                // Attach all other supplementary assets to new lecture.
                assets = assets.concat(oldLecture.supplementary_assets.slice());
                return Promise.all(
                    assets.map((asset) => {
                        return newLecture.attachSupplementaryAsset(asset.id);
                    }),
                ).then(() => newLecture);
            })
            .then((newLecture) => {
                // Make sure we have the most recent data. In particular, the previous step attaches
                // multiple supplementary assets at the same time, so the final result of
                // newLecture.supplementary_assets may not be accurate.
                return newLecture.retrieve({
                    'fields[lecture]': lectureFilterParams.join(','),
                    'fields[asset]': assetFilterParams.join(','),
                });
            })
            .then(
                action((newLecture) => {
                    Object.assign(this, newLecture);
                    this.closeEditContent();
                    this.setSelectedContentType(assetTypes.video);
                    this.openAddContent();
                    this.isSaving = false;
                    return this;
                }),
            )
            .catch(
                action((error) => {
                    this.error = parseError(error);
                    this.isSaving = false;
                    throw this.error;
                }),
            );
    }

    @autobind
    @action
    _setMainAsset(lecture) {
        this.asset = lecture.asset;
        this.is_downloadable = lecture.is_downloadable;
        const assetUploaderStore = this.assetUploaderStores[this.asset.asset_type];
        if (assetUploaderStore) {
            assetUploaderStore.updateAssetStatus(this.asset);
        }
    }
}
