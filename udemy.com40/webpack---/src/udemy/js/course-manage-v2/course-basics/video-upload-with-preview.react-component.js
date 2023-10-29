import {Image} from '@udemy/react-core-components';
import {FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import VideoAsset from 'asset/video/video-asset.react-component';
import FileUploaderS3Model from 'base-components/ungraduated/form/file-uploader/file-uploader-s3.mobx-model';
import FileUploaderS3 from 'base-components/ungraduated/form/file-uploader/file-uploader-s3.react-component';
import UploadingBackdrop from 'base-components/ungraduated/form/image-upload-preview-with-crop/uploading-backdrop.react-component';
import getConfigData from 'utils/get-config-data';
import {defaultMaxFileSize} from 'utils/s3-upload-configuration';
import udLink from 'utils/ud-link';

import './video-upload-with-preview.less';

const udConfig = getConfigData();

@observer
export default class VideoUploadWithPreview extends Component {
    static propTypes = {
        tips: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
        allowedVideoExtensions: PropTypes.array,
        sizeLimit: PropTypes.number,
    };

    static defaultProps = {
        allowedVideoExtensions: undefined,
        sizeLimit: defaultMaxFileSize,
    };

    constructor(props) {
        super(props);
        this.uploader = new FileUploaderS3Model({
            key: udConfig.third_party.s3.asset.key,
            allowedExtensionsDotted: this.props.allowedVideoExtensions,
            onUploadCompleted: this.onUploadCompleted,
            uploadLabel: gettext('Upload video'),
            sizeLimit: this.props.sizeLimit,
            ...props,
        });
    }

    @observable
    newAssetUploaded = false;

    get isUploading() {
        return !!this.uploader.file && this.uploader.file.progressPercentage < 100;
    }

    @autobind
    onUploadCompleted(id, name, s3json) {
        const assetData = JSON.parse(s3json);
        this.props.store.savePromoAsset(assetData);
        this.newAssetUploaded = true;
    }

    renderAssetChangeInfo() {
        return (
            <div styleName="asset-uploaded">
                <p>
                    {gettext(
                        'Save the changes in order to complete the upload of your file. Once you save it, we will process it to ensure it works smoothly on Udemy.',
                    )}
                </p>
            </div>
        );
    }

    renderPreview(asset) {
        if (asset) {
            const playerOptions = {
                playerId: `playerId__${asset.id}`,
                assetId: asset.id,
                courseId: this.props.store.courseId,
            };
            return <VideoAsset id={asset.id} assetData={asset} playerOptions={playerOptions} />;
        }
        return (
            <div styleName="image-wrapper">
                <Image
                    data-purpose="image-preview"
                    src={udLink.toStorageStaticAsset('course/480x270/placeholder.jpg')}
                    alt={gettext('placeholder')}
                    width={480}
                    height={270}
                />
            </div>
        );
    }

    render() {
        const {store, tips} = this.props;
        const showAssetChangeInfo = store.dirty && this.newAssetUploaded;
        return (
            <div styleName="wrapper">
                <div styleName="preview-wrapper">
                    <div styleName="aspect" />
                    <div styleName="overlay">
                        {!showAssetChangeInfo && this.renderPreview(store.promoAsset)}
                        {showAssetChangeInfo && this.renderAssetChangeInfo()}
                        {this.isUploading && <UploadingBackdrop />}
                    </div>
                </div>
                <div styleName="form-wrapper">
                    <div styleName="tips">{tips}</div>
                    <FormGroup
                        label={gettext('Upload File')}
                        labelProps={{className: 'ud-sr-only'}}
                        {...this.uploader.getValidationProps()}
                    >
                        <FileUploaderS3 uploader={this.uploader} />
                    </FormGroup>
                </div>
            </div>
        );
    }
}
