import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import ErrorBoundary from 'base-components/error-boundary/error-boundary.react-component';
import {mergeObjectsWithArrayMerge} from 'utils/merge-objects';
import VideoPlayer from 'video-player/video-player.react-component';

import wrappedAssetComponent from '../asset.react-component';
import VideoAssetSchemaMarkup from './video-asset-schema-markup.react-component.js';
import VideoAssetModel from './video-asset.mobx-model';

@inject('store')
@observer
export class VideoAssetBase extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        id: PropTypes.number.isRequired,
        playerOptions: PropTypes.object,
        addGoogleVideoSchema: PropTypes.bool,
        course: PropTypes.object,
        title: PropTypes.string,
        muxMetadata: PropTypes.object,
        extraVideoAttributes: PropTypes.object,
    };

    static defaultProps = {
        playerOptions: {},
        addGoogleVideoSchema: false,
        course: {},
        title: '',
        asset: {},
        muxMetadata: {},
        extraVideoAttributes: {},
    };

    render() {
        // extend player options with API-supplied options
        let videoPlayerProps = mergeObjectsWithArrayMerge(
            this.props.playerOptions,
            this.props.store.asset.videoPlayerProps,
        );

        // mergeObjectsWithArrayMerge converts arrays to objects, making VideoPlayer PropTypes explode, wrap with toJS
        videoPlayerProps = toJS(videoPlayerProps);

        if (!videoPlayerProps.muxMetadata) {
            videoPlayerProps.muxMetadata = this.props.muxMetadata;
        }

        return (
            <>
                <ErrorBoundary>
                    {this.props.addGoogleVideoSchema && (
                        <VideoAssetSchemaMarkup
                            title={this.props.title}
                            course={this.props.course}
                            asset={this.props.store.asset}
                        />
                    )}
                </ErrorBoundary>
                <VideoPlayer
                    {...videoPlayerProps}
                    extraVideoAttributes={this.props.extraVideoAttributes}
                >
                    {this.props.children}
                </VideoPlayer>
            </>
        );
    }
}

export default wrappedAssetComponent('VideoAsset', VideoAssetBase, VideoAssetModel);
