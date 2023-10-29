import filepicker from 'filepicker-js';

import getConfigData from 'utils/get-config-data';
import {
    allowedAudioExtensionsList,
    allowedPresentationExtensionsList,
    allowedScriptsExtensionsList,
    allowedVideoExtensionsList,
} from 'utils/s3-upload-configuration';
import udApi from 'utils/ud-api';
import udApiStat from 'utils/ud-api-stat';
import udMe from 'utils/ud-me';

const udConfig = getConfigData();

filepicker.setKey(udConfig.third_party.filestack.key);

export default class FilePicker {
    constructor(filePickerParams) {
        this.policy = filePickerParams.policy;
        this.signature = filePickerParams.signature;
        this.validExtensions = [];
        this.validServices = [];
        this._allowedTypes = {};
    }

    isAllowedType(type) {
        return !!this._allowedTypes[type];
    }

    allowMultiple() {
        this.multiple = true;
    }

    allowVideo() {
        this._allowedTypes.VIDEO = true;
        this.validExtensions = this.validExtensions.concat(allowedVideoExtensionsList);
        this.validServices = this.validServices.concat([
            'COMPUTER',
            'DROPBOX',
            'GOOGLE_DRIVE',
            'BOX',
            'SKYDRIVE',
            'URL',
        ]);
    }

    allowAudio() {
        this._allowedTypes.AUDIO = true;
        this.validExtensions = this.validExtensions.concat(allowedAudioExtensionsList);
        this.validServices = this.validServices.concat([
            'COMPUTER',
            'DROPBOX',
            'GOOGLE_DRIVE',
            'BOX',
            'SKYDRIVE',
            'URL',
        ]);
    }

    allowPresentation() {
        this._allowedTypes.PRESENTATION = true;
        this.validExtensions = this.validExtensions.concat(allowedPresentationExtensionsList);
        this.validServices = this.validServices.concat([
            'COMPUTER',
            'DROPBOX',
            'GOOGLE_DRIVE',
            'BOX',
            'SKYDRIVE',
            'URL',
        ]);
    }

    allowSupplementaryFiles() {
        this._allowedTypes.MISC = true;
        this.validServices = this.validServices.concat([
            'COMPUTER',
            'DROPBOX',
            'GOOGLE_DRIVE',
            'FACEBOOK',
            'BOX',
            'SKYDRIVE',
            'URL',
        ]);
    }

    pickAndStore() {
        return new Promise((resolve, reject) => {
            filepicker.pickAndStore(
                // Picker options
                {
                    extensions: this.isAllowedType('MISC') ? undefined : this.validExtensions,
                    multiple: this.multiple,
                    policy: this.policy,
                    services: this.validServices,
                    signature: this.signature,
                    language: udMe.language,
                },
                // Store options
                {
                    path: `/${udMe.id}/`,
                },
                // Callback on success.
                (blobs) => this._handlePickAndStoreSuccess(blobs, resolve, reject),

                // Error callback.
                (error) => this._handleError(error),
            );
        });
    }

    _handlePickAndStoreSuccess(blobs, resolve, reject) {
        blobs.forEach((blob) => {
            const data = {
                key: blob.key,
                uuid: blob.key,
                name: blob.filename,
            };

            // Log error if filestack callback did not provide proper S3 info.
            // (Signals S3 integration is failing and assets will not be available to user.)
            if (!data.key) {
                udApiStat.increment('file_picker.asset.s3_failure');
                reject(new Error('Issue with asset transfer.'));
                return;
            }

            const fileExtension = blob.filename.split('.').pop().toLowerCase();
            const dotExtension = `.${fileExtension}`;
            let postUrl = null;

            if (
                this.isAllowedType('VIDEO') &&
                allowedVideoExtensionsList.indexOf(dotExtension) > -1
            ) {
                postUrl = 'users/me/video-assets/';
            } else if (
                this.isAllowedType('AUDIO') &&
                allowedAudioExtensionsList.indexOf(dotExtension) > -1
            ) {
                postUrl = 'users/me/audio-assets/';
            } else if (
                this.isAllowedType('PRESENTATION') &&
                allowedPresentationExtensionsList.indexOf(dotExtension) > -1
            ) {
                postUrl = 'users/me/presentation-assets/';
            } else if (allowedScriptsExtensionsList.indexOf(dotExtension) > -1) {
                postUrl = 'users/me/source-code-assets/';
            } else if (this.isAllowedType('MISC')) {
                postUrl = 'users/me/file-assets/';
            }

            if (!postUrl) {
                reject(new Error('File extension is not supported!'));
                return;
            }

            udApiStat.increment('file_picker.asset.uploaded');

            udApi
                .post(postUrl, data)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    _handleError(error) {
        // Filestack considers the user closing the filestack modal without uploading anything to be
        // an error. We do not want to track and receive alerts for this behavior, so we filter this case.
        // See error codes here: https://api.filestackapi.com/filestack_debug.js
        const MODAL_CLOSE_CODE = 101;
        if (error.code !== MODAL_CLOSE_CODE) {
            udApiStat.increment('file_picker.asset.failed_upload', {code: error.code});
        }
    }
}
