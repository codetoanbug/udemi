import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import ErrorBoundary from 'base-components/error-boundary/error-boundary.react-component';
import {mergeObjectsWithArrayMerge} from 'utils/merge-objects';

import {ShakaVideoPlayer} from '../../shaka-video-player/shaka-video-player.react-component';
import {wrappedVideoAssetComponent} from '../asset-video-react-component';
import VideoAssetSchemaMarkup from './video-asset-schema-markup.react-component';
import VideoAssetModel from './video-asset.mobx-model';

interface ShakaVideoAssetBaseProps {
    store: any;
    id: number;
    playerOptions: any;
    addGoogleVideoSchema: boolean;
    course: any;
    title: string;
    muxMetadata: any;
    extraVideoAttributes: any;
}
@inject('store')
@observer
export class ShakaVideoAssetBase extends React.Component<ShakaVideoAssetBaseProps> {
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

    // captionsStore: any;

    // TODO: from where does video player come into picture?
    // @autobind
    // videoPlayerReady() {
    //     this.captionsStore.attachPlayer(this.videoPlayer);
    // }

    render() {
        let videoPlayerProps = mergeObjectsWithArrayMerge(
            this.props.playerOptions,
            this.props.store.asset.videoPlayerProps,
        );

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
                <ShakaVideoPlayer
                    {...videoPlayerProps}
                    extraVideoAttributes={this.props.extraVideoAttributes}
                >
                    {this.props.children}
                </ShakaVideoPlayer>
            </>
        );
    }
}

export const ShakaVideoAsset: any = wrappedVideoAssetComponent(
    'ShakaVideoAsset',
    ShakaVideoAssetBase,
    VideoAssetModel,
);
