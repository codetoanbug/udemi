import {withI18n, omitI18nProps} from '@udemy/i18n';
import {Image, Button} from '@udemy/react-core-components';
import {FormGroup} from '@udemy/react-form-components';
import {pxToRem} from '@udemy/styles';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import FileUploaderS3Model from 'base-components/ungraduated/form/file-uploader/file-uploader-s3.mobx-model';
import FileUploaderS3 from 'base-components/ungraduated/form/file-uploader/file-uploader-s3.react-component';
import getConfigData from 'utils/get-config-data';

import ImageUploadPreviewWithCropStore, {
    LOADING_STATUS,
} from './image-upload-preview-with-crop.mobx-store';
import ReactCrop, {ERRORS} from './react-crop.react-component';
import UploadingBackdrop from './uploading-backdrop.react-component';
import './image-upload-preview-with-crop.less';

const udConfig = getConfigData();

@observer
class ImageUploadPreviewWithCrop extends Component {
    static propTypes = {
        allowedExtensions: PropTypes.array.isRequired,
        imageUrl: PropTypes.string.isRequired,
        minHeight: PropTypes.number.isRequired,
        minWidth: PropTypes.number.isRequired,
        aspect: PropTypes.number,
        fieldName: PropTypes.string,
        fieldPurpose: PropTypes.string,
        uploadLabel: PropTypes.string,
        onCrop: PropTypes.func,
        onUploadCompleted: PropTypes.func,
        tips: PropTypes.any,
        adjacentTips: PropTypes.any,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        // gettext is provided by `withI18n`
        // eslint-disable-next-line react/require-default-props
        gettext: PropTypes.func,
    };

    static defaultProps = {
        aspect: undefined,
        fieldName: undefined,
        fieldPurpose: '',
        uploadLabel: undefined,
        onCrop: undefined,
        onUploadCompleted: undefined,
        tips: undefined,
        adjacentTips: undefined,
        className: undefined,
        disabled: false,
    };

    constructor(props) {
        super(props);
        const {gettext} = props;
        const {onUploadCompleted, ...uploaderProps} = omitI18nProps(props);
        this.uploader = new FileUploaderS3Model({
            acl: 'public-read',
            bucketUrl: udConfig.third_party.s3.image_asset.bucket_url,
            key: udConfig.third_party.s3.image_asset.key,
            allowedExtensionsDotted: uploaderProps.allowedExtensions,
            onUploadStarted: this.onUploadStarted,
            onUploadCompleted: this.onUploadCompleted,
            ...uploaderProps,
        });
        this.store = new ImageUploadPreviewWithCropStore(this.props.imageUrl, {gettext});
    }

    @autobind
    setImageAsLoaded() {
        this.store.setImageLoadingStatus(null);
    }

    @autobind
    updateCropPreview() {
        const {pixelCrop, asset} = this.store;
        if (this.props.onCrop) {
            this.props.onCrop({
                ...asset,
                ...pixelCrop,
            });
        }

        this.store.updateCropPreview();
        const s3Data = Object.assign(this.store.pixelCrop, {url: this.store.imageUrl});
        this.uploader.setS3Json(JSON.stringify(s3Data));
    }

    @autobind
    onUploadCompleted(id, name, s3json) {
        const parseds3json = JSON.parse(s3json);
        this.store.setDataAssetForCrop(parseds3json);
        if (this.props.onUploadCompleted) {
            this.props.onUploadCompleted(parseds3json);
        }
    }

    @autobind
    onUploadStarted() {
        this.store.cleanError();
        this.store.setImageLoadingStatus(LOADING_STATUS.CROP);
    }

    @autobind
    updateCrop(crop, pixelCrop) {
        this.store.setPixelCrop({
            h: pixelCrop.height,
            w: pixelCrop.width,
            x: pixelCrop.x,
            y: pixelCrop.y,
        });
    }

    resetCropPreview() {
        const {minHeight, minWidth} = this.props;
        this.store.setPixelCrop({
            h: minHeight,
            w: minWidth,
            x: 0,
            y: 0,
        });
        this.updateCropPreview();
    }

    @autobind
    cropError(error, message) {
        if (error === ERRORS.EXACT_SIZE) {
            this.resetCropPreview();
            return;
        }
        this.store.setError(message);
    }

    @autobind
    onChangeSelectedFile() {
        this.store.setImageLoadingStatus(null);
    }

    render() {
        const {
            tips,
            minHeight,
            minWidth,
            aspect,
            fieldName,
            fieldPurpose,
            adjacentTips,
            className,
            uploadLabel,
            disabled,
            gettext,
        } = this.props;
        const {imageUrl, isLoading, isLoadingCrop, isLoadingCropped, cropMode, error} = this.store;

        const validationProps = {};
        if (!cropMode) {
            Object.assign(validationProps, this.uploader.getValidationProps());
        }
        if (error) {
            validationProps.validationState = 'error';
        }

        return (
            <div className={classNames(className, 'udlite-in-udheavy')}>
                <div className="ud-image-upload-preview-wrapper" styleName="preview-wrapper">
                    <div styleName="image-wrapper">
                        {(cropMode || isLoadingCropped) && (
                            <div styleName={classNames('crop-wrapper', {hidden: isLoadingCrop})}>
                                <ReactCrop
                                    src={imageUrl}
                                    onComplete={this.updateCrop}
                                    keepSelection={true}
                                    minHeight={minHeight}
                                    minWidth={minWidth}
                                    aspect={aspect}
                                    onImageLoaded={this.setImageAsLoaded}
                                    onError={this.cropError}
                                />
                            </div>
                        )}
                        {(!cropMode || isLoadingCrop) && (
                            <Image
                                data-purpose="image-preview"
                                src={imageUrl}
                                alt=""
                                onLoad={this.setImageAsLoaded}
                                height={minHeight}
                                width={minWidth}
                                style={{maxHeight: `${pxToRem(minHeight)}rem`}}
                                styleName={classNames({
                                    hidden: isLoadingCropped,
                                    loading: isLoading && !isLoadingCrop,
                                })}
                            />
                        )}
                        {isLoading && <UploadingBackdrop />}
                    </div>
                    {tips && (
                        <div className="ud-text-xs" styleName="note">
                            {tips}
                        </div>
                    )}
                </div>

                <div className="ud-image-upload-form-wrapper">
                    {adjacentTips}
                    <FormGroup
                        label={fieldPurpose || gettext('Add / Change File')}
                        labelProps={!fieldPurpose ? {className: 'ud-sr-only'} : {}}
                        {...validationProps}
                    >
                        {cropMode ? (
                            <Button
                                onClick={this.updateCropPreview}
                                disabled={isLoading}
                                udStyle="secondary"
                            >
                                {gettext('Crop image')}
                            </Button>
                        ) : (
                            <FileUploaderS3
                                uploader={this.uploader}
                                uploadLabel={uploadLabel}
                                onChangeSelectedFile={this.onChangeSelectedFile}
                                disabled={disabled}
                            />
                        )}
                        {error && (
                            <div className="ud-text-xs" styleName="error note">
                                {error}
                            </div>
                        )}
                    </FormGroup>
                    <input type="hidden" name={fieldName} value={this.uploader.s3json} />
                </div>
            </div>
        );
    }
}

export default withI18n(ImageUploadPreviewWithCrop);
