import {Loader} from '@udemy/react-reveal-components';
import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import wrappedAssetComponent from '../asset/asset.react-component';
import VideoAssetModel from '../asset/video/video-asset.mobx-model';
import {mergeObjectsWithArrayMerge} from '../utils/merge-objects';
import {ApiClass} from './targeted-media-modal.mobx-store';

const VideoPlayer = React.lazy(
    () =>
        import(/* webpackChunkName: "video-player" */ 'video-player/video-player.react-component'),
);

interface InternalVideoPlayerProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store: any;
    id: number;
    playerOptions?: unknown;
    mediaModalStore: ApiClass;
}
@inject('store')
@observer
class InternalVideoPlayer extends React.Component<InternalVideoPlayerProps> {
    static propTypes = {
        store: PropTypes.object.isRequired,
        id: PropTypes.number.isRequired,
        playerOptions: PropTypes.object,
        mediaModalStore: PropTypes.object.isRequired,
    };

    static defaultProps = {
        playerOptions: {},
        asset: {},
    };

    componentDidMount() {
        const videoPlayerId = this.props.store.asset?.videoPlayerProps?.playerId;
        this.props.mediaModalStore.updateVideoPlayerId(videoPlayerId);
    }

    render() {
        // extend player options with API-supplied options
        let videoPlayerProps = this.props.store.asset?.videoPlayerProps
            ? mergeObjectsWithArrayMerge(
                  this.props.playerOptions,
                  this.props.store.asset.videoPlayerProps,
              )
            : this.props.playerOptions;

        // mergeObjectsWithArrayMerge converts arrays to objects, making VideoPlayer PropTypes explode, wrap with toJS
        videoPlayerProps = toJS(videoPlayerProps);

        return (
            <React.Suspense fallback={<Loader />}>
                <VideoPlayer {...videoPlayerProps}>{this.props.children}</VideoPlayer>
            </React.Suspense>
        );
    }
}

export const ModalVideoPlayer = wrappedAssetComponent(
    'ModalVideoPlayer',
    InternalVideoPlayer,
    VideoAssetModel,
);
