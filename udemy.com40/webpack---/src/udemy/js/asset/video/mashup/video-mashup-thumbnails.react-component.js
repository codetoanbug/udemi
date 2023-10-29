import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import VideoMashupThumbnail from './video-mashup-thumbnail.react-component';

import './video-mashup-asset.less';

/*
 * Partitions the seekbar into intervals.
 * Slide appears as a thumbnail centered above the hovered interval.
 * Suppose the seekbar looks like this:
 * [   1   |   2   |   3   |   4   |   5   |]
 * Each | represents a time where the slide changes.
 * Each number represents an interval.
 * In the example there are 5 intervals. The last interval is number 5.
 * To ensure that the widths of the intervals sum to 100%,
 * interval 5 has width = 100 - SUM(widths of 1 through 4).
 */
@inject('progressBarStore')
@observer
export default class VideoMashupThumbnails extends React.Component {
    static propTypes = {
        slides: PropTypes.array.isRequired,
        duration: PropTypes.number.isRequired,
        videoWidth: PropTypes.number.isRequired,
        videoPositionLeft: PropTypes.number,
        progressBarStore: PropTypes.object.isRequired,
    };

    static defaultProps = {
        videoPositionLeft: 0,
    };

    mouseXPosition = 0;

    @observable visibleThumbnailIndex = null;

    @action
    setVisibleThumbnailIndex(thumbnailIndex) {
        this.visibleThumbnailIndex = thumbnailIndex;
    }

    @autobind
    onMouseEnter(thumbnailIndex, event) {
        this.mouseXPosition = event.screenX;
        this.setVisibleThumbnailIndex(thumbnailIndex);
    }

    @autobind
    onMouseLeave() {
        this.setVisibleThumbnailIndex(null);
    }

    get thumbnails() {
        const {slides} = this.props;

        let lastInterval = 100;

        return slides.map((slide, thumbnailIndex) => {
            let interval;
            const {slides, duration} = this.props;

            if (thumbnailIndex === slides.length - 1) {
                interval = lastInterval; // Makes sure width percentages sum to exactly 100%.
            } else {
                // Calculate the slide time interval rounding it to 2 decimal places
                interval = Math.round(
                    ((slides[thumbnailIndex + 1].time - slides[thumbnailIndex].time) / duration) *
                        100,
                );
            }
            lastInterval -= interval;

            return (
                <VideoMashupThumbnail
                    key={thumbnailIndex}
                    index={thumbnailIndex}
                    width={`${interval}%`}
                    mouseXPosition={this.mouseXPosition}
                    videoPositionLeft={this.props.videoPositionLeft}
                    videoWidth={this.props.videoWidth}
                    isVisible={this.visibleThumbnailIndex === thumbnailIndex}
                    onMouseEnter={this.onMouseEnter}
                    slideUrl={slide.url}
                />
            );
        });
    }

    render() {
        if (!this.props.progressBarStore.ref) {
            return null;
        }

        return ReactDOM.createPortal(
            <div
                styleName="intervals"
                data-purpose="mashup-thumbnails-intervals"
                onMouseLeave={this.onMouseLeave}
            >
                {this.thumbnails}
            </div>,
            this.props.progressBarStore.progressHolderRef,
        );
    }
}
