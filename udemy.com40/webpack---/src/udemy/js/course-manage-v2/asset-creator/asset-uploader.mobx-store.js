import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';
import React from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import {noop} from 'utils/noop';
import {
    allowedAudioExtensionsList,
    allowedPresentationExtensionsList,
    allowedScriptsExtensionsList,
    allowedVideoExtensionsList,
} from 'utils/s3-upload-configuration';
import udApi, {parseError} from 'utils/ud-api';
import S3FineUploader from 'utils/ud-s3fineuploader';

import {assetStatuses, assetTypes} from '../asset-library/constants';

export default class AssetUploaderStore {
    _completeCallback = noop;
    @observable isInitialized = false;
    @observable isLoading = false;

    @observable asset = null;

    sortableFields = [];
    uploadLabelsOverride;
    changeLabelsOverride;

    constructor(type, uploadLabelsOverride, changeLabelsOverride) {
        this.type = type;
        this.fileUploader = new S3FineUploader({
            sizeLimit: this.maxFileSize,
            acl: 'private',
            allowedExtensionsDotted: this.allowedExtensionsDotted,
            onProgress: this.onUploadProgress,
            onComplete: this._onUploadComplete,
            onError: this._onError,
        });
        this.uploadLabelsOverride = uploadLabelsOverride || {};
        this.changeLabelsOverride = changeLabelsOverride || {};
    }

    get displayedAssetType() {
        return this.type === assetTypes.misc ? assetTypes.file : this.type;
    }

    @autobind
    @action
    deleteAsset() {
        if (this.asset) {
            this.asset.isDisabled = true;
            this.asset = null;
            this.fileUploader.cancel();
            this.fileUploader.reset();
        }
    }

    @autobind
    @action
    initializeAsset(asset) {
        this.setAsset(asset.title);
        this.updateAssetStatus(asset);
    }

    @action
    setAsset(filename) {
        this.asset = {
            id: 'placeholder',
            progress_percentage: 0,
            status: assetStatuses.uploading,
            title: filename,
            created: new Date(),
            asset_type: this.displayedAssetType,
            isDisabled: false,
            openExtraInfo: false,
            processing_errors: [],
            delayed_asset_message: null,
        };
        this.isInitialized = true;
    }

    @action
    updateAssetStatus(data) {
        if (!this.asset) {
            return;
        }
        ['status', 'processing_errors', 'delayed_asset_message'].forEach((key) => {
            if (key in data) {
                this.asset[key] = data[key];
            }
        });
        if (this.asset.status === assetStatuses.failed) {
            this.asset.openExtraInfo = true; // Show processing_errors.
            this.asset.isDisabled = false; // Make sure extra info toggle button is enabled.
        }
    }

    @computed
    get isDisabled() {
        return this.assets.some((asset) => asset.isDisabled);
    }

    disableAsset() {
        this.assets.forEach(
            action((asset) => {
                asset.isDisabled = true;
            }),
        );
    }

    @computed
    get assets() {
        if (this.asset) {
            return [this.asset];
        }

        return [];
    }

    @computed
    get total() {
        return this.assets.length;
    }

    get maxFileSize() {
        if (this.type === assetTypes.video) {
            return 1000 * 1000 * 4000; // 4Gb;
        }
        return 1000 * 1000 * 1000; // 1Gb;
    }

    get notes() {
        let note;
        switch (this.type) {
            case assetTypes.video:
                note = gettext(
                    '<b>Note</b>: All files should be at least 720p and less than 4.0 GB.',
                );
                break;
            case assetTypes.audio:
                note = gettext(
                    '<b>Note</b>: An audio lecture lets your voice do the teaching. ' +
                        'An aural experience can be useful to stimulate the imagination and ' +
                        'promote independent visualization and knowledge association. ' +
                        'If you use an audio lecture, make sure your audio is clean, crisp, and easy to listen to!',
                );
                break;
            case assetTypes.presentation:
                note = gettext(
                    '<b>Note</b>: A presentation means slides (e.g. PowerPoint, Keynote). ' +
                        'Slides are a great way to combine text and visuals to explain concepts in an effective and efficient way. ' +
                        'Use meaningful graphics and clearly legible text!',
                );
                break;
            case assetTypes.ebook:
                note = gettext(
                    '<b>Note</b>: A document lecture is for any type of PDF document or handout for your students. ' +
                        'You can make this a downloadable document for easy and quick reference. ' +
                        'Make sure everything is legible and the file size is less than 1 GiB.',
                );
                break;
            case assetTypes.sourceCode:
                note = gettext(
                    '<b>Note</b>: Only available for Python and Ruby for now. You can upload .py and .rb files.',
                );
                break;
            case assetTypes.file:
            case assetTypes.misc:
                note = gettext(
                    '<b>Note</b>: A resource is for any type of document that can be used to help students in the lecture. ' +
                        'This file is going to be seen as a lecture extra. Make sure everything is legible and the file size is less than 1 GiB.',
                );
                break;
            default:
                break;
        }

        // Notes specific to assetStatuses override notes specific to assetTypes.
        // The assetStatuses.failed (AKA asset.processing_errors) case is not handled here because
        // we already display processing_errors in <AssetTable />.
        if (this.asset && this.asset.status === assetStatuses.processing) {
            note = interpolate(
                gettext(
                    '<b>Note:</b> This %(type)s is still being processed. We will send you an email when it is ready.',
                ),
                {type: this.type.toLowerCase()},
                true,
            );
        } else if (this.asset && this.asset.delayed_asset_message) {
            note = interpolate(
                gettext('<b>Note:</b> %(note)s'),
                {note: this.asset.delayed_asset_message},
                true,
            );
        }

        if (!note) {
            return null;
        }
        return (
            <div
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'asset-uploader:note',
                    html: note,
                })}
            />
        );
    }

    get allowedExtensions() {
        return this.fileUploader.allowedExtensions;
    }

    get allowedExtensionsDotted() {
        switch (this.type) {
            case assetTypes.video:
                return allowedVideoExtensionsList;
            case assetTypes.audio:
                return allowedAudioExtensionsList;
            case assetTypes.presentation:
            case assetTypes.ebook:
                return allowedPresentationExtensionsList;
            case assetTypes.sourceCode:
                return allowedScriptsExtensionsList;
            case assetTypes.file:
            case assetTypes.misc:
            default:
                return []; // This means "allow everything".
        }
    }

    get uploadLabel() {
        switch (this.type) {
            case assetTypes.video:
                return this.uploadLabelsOverride[this.type] || gettext('Select Video');
            case assetTypes.audio:
                return this.uploadLabelsOverride[this.type] || gettext('Select Audio');
            case assetTypes.presentation:
            case assetTypes.ebook:
                return this.uploadLabelsOverride[this.type] || gettext('Select PDF');
            default:
                return this.uploadLabelsOverride[this.type] || gettext('Select File');
        }
    }

    get changeLabel() {
        switch (this.type) {
            case assetTypes.video:
                return this.changeLabelsOverride[this.type] || gettext('Change Video');
            case assetTypes.audio:
                return this.changeLabelsOverride[this.type] || gettext('Change Audio');
            case assetTypes.presentation:
            case assetTypes.ebook:
                return this.changeLabelsOverride[this.type] || gettext('Change PDF');
            default:
                return this.changeLabelsOverride[this.type] || gettext('Change File');
        }
    }

    upload(file) {
        this.fileUploader.upload(file);
    }

    @autobind
    @action
    onUploadProgress(totalUploadedBytes, totalBytes) {
        if (this.asset) {
            this.asset.progress_percentage = Math.round((totalUploadedBytes / totalBytes) * 100);
        }
    }

    @autobind
    registerUploadCompleteHandler(callback) {
        this._completeCallback = callback;
    }

    @autobind
    _onUploadComplete(data) {
        let postUrl = null;

        switch (this.type) {
            case assetTypes.video:
                postUrl = 'users/me/video-assets/';
                break;
            case assetTypes.audio:
                postUrl = 'users/me/audio-assets/';
                break;
            case assetTypes.presentation:
                postUrl = 'users/me/presentation-assets/';
                break;
            case assetTypes.ebook:
                postUrl = 'users/me/ebook-assets/';
                break;
            case assetTypes.sourceCode:
                postUrl = 'users/me/source-code-assets/';
                break;
            case assetTypes.file:
            case assetTypes.misc:
                postUrl = 'users/me/file-assets/';
                break;
        }

        if (!postUrl) {
            this._onError(data.id, data.name, 'File extension is not supported!');
            return;
        }

        udApi
            .post(postUrl, data)
            .then(
                action((response) => {
                    // this.asset can be null if this.deleteAsset is called right when the upload completes.
                    if (this.asset) {
                        this.asset.status = assetStatuses.processing;
                        this._completeCallback(response.data);
                    }
                }),
            )
            .catch((err) => {
                this._onError(data.id, data.name, parseError(err).detail);
            });
    }

    @autobind
    @action
    _onError(id, name, errorReason) {
        // this.asset can be null if this.deleteAsset is called during the upload.
        if (this.asset && name) {
            this.asset.status = assetStatuses.failed;
            this.asset.processing_errors = [{message: errorReason}];
            this.asset.openExtraInfo = true;
        }
    }

    @autobind
    @action
    toggleAssetInfo() {
        this.asset.openExtraInfo = !this.asset.openExtraInfo;
    }
}
