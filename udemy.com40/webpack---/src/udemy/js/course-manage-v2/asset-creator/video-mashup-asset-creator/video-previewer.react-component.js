import {getUniqueId} from '@udemy/design-system-utils';
import {PropTypes as mobxTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {ASSET_TYPE} from 'asset/constants';
import VideoMashupAsset from 'asset/video/mashup/video-mashup-asset.react-component';
import VideoPlayer from 'video-player/video-player.react-component';

import {videoBasedAssetTypes} from '../../asset-library/constants';

import './video-mashup-asset-creator.less';

export default class VideoPreviewer extends Component {
    static propTypes = {
        asset: PropTypes.shape({
            asset_type: PropTypes.oneOf(Array.from(videoBasedAssetTypes)).isRequired,
            media_license_token: PropTypes.object,
            media_sources: mobxTypes.arrayOrObservableArray.isRequired,
            length: PropTypes.number,
            time_estimation: PropTypes.number,
            id: PropTypes.number,
            captions: mobxTypes.arrayOrObservableArray,
            slides: mobxTypes.arrayOrObservableArray,
            thumbnail_sprite: PropTypes.object,
        }).isRequired,
    };

    get playerConfig() {
        const config = {
            playerId: getUniqueId('video-previewer'),
            mediaLicenseToken: this.props.asset.media_license_token,
            mediaSources: (this.props.asset.media_sources || []).slice(),
            assetId: this.props.asset.id,
            duration: this.props.asset.time_estimation,
            captions: (this.props.asset.captions || []).slice(),
            thumbnailSprite: this.props.asset.thumbnail_sprite,
        };

        return config;
    }

    render() {
        const AssetComponent =
            this.props.asset.asset_type === ASSET_TYPE.VIDEO_MASHUP
                ? VideoMashupAsset
                : VideoPlayer;

        const assetOptions =
            this.props.asset.asset_type === ASSET_TYPE.VIDEO_MASHUP
                ? {
                      playerOptions: this.playerConfig,
                      id: this.props.asset.id,
                      assetData: this.props.asset,
                  }
                : {...this.playerConfig};

        return (
            <div styleName="asset-preview-container">
                <AssetComponent {...assetOptions} />
            </div>
        );
    }
}
