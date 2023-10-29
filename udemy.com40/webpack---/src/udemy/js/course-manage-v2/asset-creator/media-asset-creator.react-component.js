import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Tabs from 'base-components/tabs/tabs.react-component';

import AssetLibraryStore from '../asset-library/asset-library.mobx-store';
import AssetLibrary from '../asset-library/asset-library.react-component';
import {assetLabels, assetTypes} from '../asset-library/constants';
import AssetUploaderStore from './asset-uploader.mobx-store';
import AssetUploader from './asset-uploader.react-component';

@observer
export default class MediaAssetCreator extends Component {
    static propTypes = {
        libraryStore: PropTypes.instanceOf(AssetLibraryStore).isRequired,
        uploaderStore: PropTypes.instanceOf(AssetUploaderStore).isRequired,
        type: PropTypes.oneOf([
            assetTypes.audio,
            assetTypes.ebook,
            assetTypes.presentation,
            assetTypes.video,
        ]).isRequired,
        onAssetSelected: PropTypes.func.isRequired,
    };

    render() {
        return (
            <Tabs>
                <Tabs.Tab
                    title={interpolate(
                        gettext('Upload %(type)s'),
                        {type: assetLabels[this.props.type]},
                        true,
                    )}
                >
                    <AssetUploader
                        store={this.props.uploaderStore}
                        onUpload={this.props.onAssetSelected}
                    />
                </Tabs.Tab>
                <Tabs.Tab title={gettext('Add from library')}>
                    <AssetLibrary
                        store={this.props.libraryStore}
                        onSelect={this.props.onAssetSelected}
                    />
                </Tabs.Tab>
            </Tabs>
        );
    }
}
