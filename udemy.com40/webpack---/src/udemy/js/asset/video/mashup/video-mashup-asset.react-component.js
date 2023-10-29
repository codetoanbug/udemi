import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {inject, observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import ProgressBarStore from 'video-player/progress-bar/progress-bar.mobx-store';

import wrappedAssetComponent from '../../asset.react-component';
import {ShakaVideoAssetBase} from '../shaka-video-asset.react-component';
import {VideoAssetBase} from '../video-asset.react-component';
import {MODE} from './constants';
import styles from './video-mashup-asset.less';
import VideoMashupAssetModel from './video-mashup-asset.mobx-model';
import VideoMashupThumbnails from './video-mashup-thumbnails.react-component';

@inject('store')
@observer
export class VideoMashupAssetBase extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        playerOptions: PropTypes.object,
        isShakaPlayerEnabled: PropTypes.bool,
    };

    static defaultProps = {
        playerOptions: {},
        isShakaPlayerEnabled: false,
    };

    constructor(props) {
        super(props);
        this.progressBarStore = props.playerOptions.progressBarStore || new ProgressBarStore();
    }

    componentDidMount() {
        this.setMode(MODE.PRESENTATION);
    }

    componentDidUpdate() {
        if (this.videoPositionLeft === undefined) {
            this.setVideoPositionLeft();
        }
    }

    @observable videoPositionLeft = undefined;
    @observable currentTime = 0;
    @observable player = null;
    @observable isPlaying = false;
    /*
     * For some reason when we try instantiate the player
     * with the presentation mode by default all controls
     * are put inside the video display, so to avoid this
     * we start the player in video mode and after in the
     * didMount function we change to presentation
     */
    @observable mode = MODE.VIDEO;

    ref = React.createRef();

    @action
    setVideoPositionLeft() {
        const isAvailableGetBoundingClientRect =
            this.ref.current && 'getBoundingClientRect' in this.ref.current;

        if (isAvailableGetBoundingClientRect) {
            const {x: videoPositionLeftValue = 0} = this.ref.current.getBoundingClientRect();

            this.videoPositionLeft = videoPositionLeftValue;
        }
    }

    @action
    setMode(mode) {
        this.mode = mode;
    }

    @autobind
    @action
    onTimeUpdate(videoPlayerTime) {
        this.currentTime = videoPlayerTime;
        if (typeof this.props.playerOptions.onTimeUpdate === 'function') {
            this.props.playerOptions.onTimeUpdate(videoPlayerTime);
        }
    }

    /*
     * Each slide have the time property which indicates in what video position it should be rendered
     * So we compare this property with the current video position to get the correct slide
     */
    get currentSlideUrl() {
        const {slides} = this.props.store.asset;

        for (let i = slides.length - 1; i >= 0; i--) {
            if (this.currentTime >= slides[i].time) {
                return `url("${slides[i].url}")`;
            }
        }
        return '';
    }

    @action
    setPlayer(videoPlayer) {
        this.player = videoPlayer;
    }

    @autobind
    renderVideoElement(videoElement) {
        return (
            <>
                <div
                    role="presentation"
                    data-purpose={`mashup-slide-${
                        this.mode === MODE.PRESENTATION ? 'big' : 'small'
                    }-content`}
                    styleName="content"
                >
                    <div styleName="slide" style={{backgroundImage: this.currentSlideUrl}} />
                </div>
                {videoElement}
                {this.mode === MODE.PRESENTATION && (
                    <div data-purpose="video-small-overlay" styleName="video-small-overlay" />
                )}
            </>
        );
    }

    @autobind
    onClick(event) {
        const {target = {nodeName: ''}} = event;

        const clickedInVideoElement = target.classList.contains(styles['video-small-overlay']);
        const clickedInSlideElement =
            target.classList.contains(styles.slide) ||
            target.classList.contains('video-popover-area');
        const isPresentationMode = this.mode === MODE.PRESENTATION;
        const isVideoMode = this.mode === MODE.VIDEO;

        if (isPresentationMode && clickedInSlideElement) {
            // TODO: change this to use a controlled video player
            this.player[this.isPlaying ? 'pause' : 'play']();
        }

        if (isVideoMode && clickedInSlideElement) {
            this.setMode(MODE.PRESENTATION);
        }

        if (isPresentationMode && clickedInVideoElement) {
            this.setMode(MODE.VIDEO);
        }
    }

    @autobind
    @action
    onPlayPauseToggled(isPlaying) {
        this.isPlaying = isPlaying;

        if (typeof this.props.playerOptions.onPlayPauseToggled === 'function') {
            this.props.playerOptions.onPlayPauseToggled(isPlaying);
        }
    }

    @autobind
    @action
    onPlayerReady(player) {
        this.player = player;

        if (typeof this.props.playerOptions.onPlayerReady === 'function') {
            this.props.playerOptions.onPlayerReady(player);
        }
    }

    get wrapperClasses() {
        return classNames(styles['video-wrapper'], {
            [styles['presentation-default-size']]: this.mode === MODE.PRESENTATION,
            [styles['presentation-small-size']]: this.mode === MODE.VIDEO,
        });
    }

    get shouldRenderThumbnails() {
        return !!this.player && !!this.ref.current;
    }

    render() {
        const {playerOptions, ...videoAssetProps} = this.props;
        let playerAsset;
        if (this.props.isShakaPlayerEnabled) {
            playerAsset = (
                <ShakaVideoAssetBase
                    playerOptions={{
                        ...playerOptions,
                        onTimeUpdate: this.onTimeUpdate,
                        onPlayPauseToggled: this.onPlayPauseToggled,
                        onPlayerReady: this.onPlayerReady,
                        renderVideoElement: this.renderVideoElement,
                        playerId: this.props.store.asset.playerId,
                    }}
                    {...videoAssetProps}
                >
                    {this.props.children}
                </ShakaVideoAssetBase>
            );
        } else {
            playerAsset = (
                <VideoAssetBase
                    playerOptions={{
                        ...playerOptions,
                        onTimeUpdate: this.onTimeUpdate,
                        onPlayPauseToggled: this.onPlayPauseToggled,
                        onPlayerReady: this.onPlayerReady,
                        renderVideoElement: this.renderVideoElement,
                        playerId: this.props.store.asset.playerId,
                    }}
                    {...videoAssetProps}
                >
                    {this.props.children}
                </VideoAssetBase>
            );
        }

        return (
            <div
                className={this.wrapperClasses}
                ref={this.ref}
                role="presentation"
                data-purpose="mashup-wrapper"
                onClick={this.onClick}
            >
                {playerAsset}
                {this.shouldRenderThumbnails && (
                    <Provider progressBarStore={this.progressBarStore}>
                        <VideoMashupThumbnails
                            slides={this.props.store.asset.slides}
                            videoWidth={this.ref.current.offsetWidth}
                            videoPositionLeft={this.videoPositionLeft}
                            duration={this.props.store.asset.timeEstimation}
                        />
                    </Provider>
                )}
            </div>
        );
    }
}

export default wrappedAssetComponent(
    'VideoMashupAsset',
    VideoMashupAssetBase,
    VideoMashupAssetModel,
);
