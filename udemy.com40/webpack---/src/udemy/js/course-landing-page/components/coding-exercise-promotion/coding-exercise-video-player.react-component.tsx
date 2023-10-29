/*
    2023-03-08 CP - This component is nearly identical as VideoAsset component. I chose to duplicate the component and
    modify it to be able to be used in a server side isorendering capacity. Due to this being an experiment, I did not
    want to introduce potential rendering or performance issues to the VideoAsset component that may come from
    lazy loading the VideoPlayer
*/

import {Loader} from '@udemy/react-reveal-components';
import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import wrappedAssetComponent from 'asset/asset.react-component';
import VideoAssetModel from 'asset/video/video-asset.mobx-model';
import {mergeObjectsWithArrayMerge} from 'utils/merge-objects';

const VideoPlayer = React.lazy(
    () =>
        import(/* webpackChunkName: "video-player" */ 'video-player/video-player.react-component'),
);

interface CodingExerciseInternalVideoPlayerProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store: any;
    id: number;
    playerOptions?: unknown;
}

@inject('store')
@observer
class CodingExerciseInternalVideoPlayer extends React.Component<CodingExerciseInternalVideoPlayerProps> {
    static propTypes = {
        store: PropTypes.object.isRequired,
        id: PropTypes.number.isRequired,
        playerOptions: PropTypes.object,
    };

    static defaultProps = {
        playerOptions: {},
        asset: {},
    };

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

export const CodingExerciseVideoPlayer = wrappedAssetComponent(
    'CodingExerciseVideoPlayer',
    CodingExerciseInternalVideoPlayer,
    VideoAssetModel,
);
