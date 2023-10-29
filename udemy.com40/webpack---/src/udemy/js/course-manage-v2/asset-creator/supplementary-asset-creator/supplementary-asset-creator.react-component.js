import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Tabs from 'base-components/tabs/tabs.react-component';

import AssetLibrary from '../../asset-library/asset-library.react-component';
import {assetTypes} from '../../asset-library/constants';
import CurriculumLectureModel from '../../curriculum/item/lecture/curriculum-lecture.mobx-model';
import AssetUploader from '../asset-uploader.react-component';
import ExternalLinkAssetCreator from './external-link-asset-creator.react-component';

@observer
export default class SupplementaryAssetCreator extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumLectureModel).isRequired,
        onAssetSelected: PropTypes.func.isRequired,
    };

    render() {
        const curriculumItem = this.props.curriculumItem;
        return (
            <Tabs>
                <Tabs.Tab title={gettext('Downloadable File')}>
                    <AssetUploader
                        store={curriculumItem.assetUploaderStores[assetTypes.misc]}
                        onUpload={this.props.onAssetSelected}
                    />
                </Tabs.Tab>
                <Tabs.Tab title={gettext('Add from library')}>
                    <AssetLibrary
                        store={curriculumItem.assetLibraryStores[assetTypes.misc]}
                        onSelect={this.props.onAssetSelected}
                    />
                </Tabs.Tab>
                <Tabs.Tab title={gettext('External Resource')}>
                    <ExternalLinkAssetCreator
                        curriculumItem={curriculumItem}
                        onSave={this.props.onAssetSelected}
                    />
                </Tabs.Tab>
                <Tabs.Tab title={gettext('Source Code')}>
                    <AssetUploader
                        store={curriculumItem.assetUploaderStores[assetTypes.sourceCode]}
                        onUpload={this.props.onAssetSelected}
                    />
                </Tabs.Tab>
            </Tabs>
        );
    }
}
