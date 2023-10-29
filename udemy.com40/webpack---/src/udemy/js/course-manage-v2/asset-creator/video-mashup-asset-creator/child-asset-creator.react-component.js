import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {handleUnexpectedAPIError} from 'course-manage-v2/handle-error';

import {assetStatuses, assetTypes} from '../../asset-library/constants';
import {videoMashupAssetFilterParams} from '../../curriculum/item/constants';
import CurriculumLectureModel from '../../curriculum/item/lecture/curriculum-lecture.mobx-model';
import AssetUploader from '../asset-uploader.react-component';
import {SelectedChildAssetCard} from '../selected-asset-cards.react-component';
import SingleAssetTable from '../single-asset-table.react-component';
import {MashupChildModel} from '../video-mashup-asset-creator.mobx-model';
import PresentationPreviewer from './presentation-previewer.react-component';
import VideoPreviewer from './video-previewer.react-component';
import './video-mashup-asset-creator.less';

@observer
export default class ChildAssetCreator extends Component {
    static propTypes = {
        assetType: PropTypes.oneOf([assetTypes.video, assetTypes.presentation]).isRequired,
        child: PropTypes.instanceOf(MashupChildModel).isRequired,
        curriculumItem: PropTypes.instanceOf(CurriculumLectureModel).isRequired,
        saveLabel: PropTypes.string.isRequired,
    };

    componentWillUnmount() {
        this.cancelRefresh && this.cancelRefresh();
    }

    get assetUploaderStore() {
        return this.props.curriculumItem.assetUploaderStores[this.props.assetType];
    }

    @autobind
    onUpload(assetId) {
        const params = {'fields[asset]': videoMashupAssetFilterParams.join(',')};
        this.props.curriculumItem
            .readUnattachedAsset(assetId, params)
            .then((asset) => {
                this.onAssetRefresh(asset);
                this.cancelRefresh = this.props.curriculumItem.refreshUnattachedAsset(
                    asset.id,
                    params,
                    this.onAssetRefresh,
                    undefined,
                    this.shouldContinueAssetRefresh,
                    this.shouldStopAssetRefresh,
                );
            })
            .catch(handleUnexpectedAPIError);
    }

    @autobind
    onCancel() {
        this.props.child.cancel();
        this.assetUploaderStore.deleteAsset();
        this.props.curriculumItem.videoMashupAssetCreator.cancelPreview();
    }

    @autobind
    onAssetRefresh(asset) {
        this.props.child.setAsset(asset);
        this.assetUploaderStore.updateAssetStatus(asset);
    }

    @autobind
    shouldStopAssetRefresh(asset) {
        return !this.props.child.asset || this.props.child.asset.id !== asset.id;
    }

    @autobind
    shouldContinueAssetRefresh() {
        return (
            !!this.props.child.asset && this.props.child.asset.status === assetStatuses.processing
        );
    }

    renderPreviewer() {
        const asset = this.props.child.asset;
        switch (asset.asset_type) {
            case assetTypes.video:
                return <VideoPreviewer asset={asset} />;
            case assetTypes.presentation:
                return <PresentationPreviewer asset={asset} />;
            default:
                throw new Error(
                    `Previewer not available for mashup child asset type ${asset.asset_type}`,
                );
        }
    }

    render() {
        const asset = this.props.child.asset;
        if (!asset) {
            return <AssetUploader store={this.assetUploaderStore} onUpload={this.onUpload} />;
        }
        if (asset.status !== assetStatuses.success) {
            return <SingleAssetTable store={this.assetUploaderStore} onReplace={this.onCancel} />;
        }
        if (this.props.child.isConfirmed) {
            return <SelectedChildAssetCard asset={asset} onEdit={this.onCancel} />;
        }
        return (
            <div data-purpose="preview-box">
                {this.renderPreviewer()}
                <div styleName="action-buttons">
                    <Button
                        size="small"
                        data-purpose="confirm-preview"
                        onClick={this.props.child.confirm}
                    >
                        {this.props.saveLabel}
                    </Button>
                    <Button
                        className="ud-link-neutral"
                        udStyle="ghost"
                        size="small"
                        data-purpose="cancel-preview"
                        onClick={this.onCancel}
                    >
                        {gettext('Cancel')}
                    </Button>
                </div>
            </div>
        );
    }
}
