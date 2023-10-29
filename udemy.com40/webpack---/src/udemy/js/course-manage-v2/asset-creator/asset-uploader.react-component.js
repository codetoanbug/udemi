import {FormGroup, FileUploader} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import AssetTable from '../asset-library/asset-table.react-component';
import AssetUploaderStore from './asset-uploader.mobx-store';

@observer
export default class AssetUploader extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(AssetUploaderStore).isRequired,
        onUpload: PropTypes.func.isRequired,
        hideTrashWhenDisabled: PropTypes.bool,
        disabled: PropTypes.bool,
        showNotes: PropTypes.bool,
        validateBeforeUpload: PropTypes.func,
        validationState: PropTypes.oneOf(['neutral', 'error']),
    };

    static defaultProps = {
        disabled: false,
        hideTrashWhenDisabled: false,
        showNotes: true,
        validateBeforeUpload: () => Promise.resolve(true),
        validationState: 'neutral',
    };

    constructor(props) {
        super(props);
        this.props.store.registerUploadCompleteHandler(this.onAssetUpload);
    }

    @autobind
    onAssetUpload({id}) {
        this.props.store.disableAsset();
        this.props.onUpload(id);
    }

    @autobind
    async onFileSelected(event) {
        const selectedFile = event.target.files[0];
        this.props.store.setAsset(selectedFile.name);
        const isFileValid = await this.props.validateBeforeUpload(selectedFile);
        if (isFileValid) {
            this.props.store.upload(selectedFile);
        } else {
            this.props.store.deleteAsset();
        }
    }

    renderUploadForm() {
        // We only use <FileUploader /> to prompt user to select a file to upload.
        // Once file is selected, we unmount <FileUploader /> and mount <AssetTable />.
        // <AssetTable /> displays the upload progress.
        return (
            <FormGroup
                label={this.props.store.uploadLabel}
                labelProps={{className: 'ud-sr-only'}}
                note={this.props.showNotes ? this.props.store.notes : null}
                validationState={this.props.validationState}
            >
                <FileUploader
                    allowedExtensionsDotted={this.props.store.allowedExtensionsDotted}
                    name="asset"
                    onChange={this.onFileSelected}
                    purpose="asset-uploader-input"
                    uploadLabel={this.props.store.uploadLabel}
                />
            </FormGroup>
        );
    }

    render() {
        return (
            <div>
                {!this.props.store.total ? (
                    this.renderUploadForm()
                ) : (
                    <AssetTable
                        store={this.props.store}
                        onDelete={this.props.store.deleteAsset}
                        onToggleInfo={this.props.store.toggleAssetInfo}
                        hideTrashWhenDisabled={this.props.hideTrashWhenDisabled}
                    />
                )}
            </div>
        );
    }
}
