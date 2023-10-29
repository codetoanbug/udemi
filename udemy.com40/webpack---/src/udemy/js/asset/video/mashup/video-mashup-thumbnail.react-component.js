import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React from 'react';

import {THUMBNAIL_WIDTH} from './constants';
import './video-mashup-asset.less';

export default class VideoMashupThumbnail extends React.Component {
    static propTypes = {
        index: PropTypes.number.isRequired,
        width: PropTypes.string.isRequired,
        mouseXPosition: PropTypes.number,
        videoWidth: PropTypes.number.isRequired,
        videoPositionLeft: PropTypes.number,
        isVisible: PropTypes.bool.isRequired,
        onMouseEnter: PropTypes.func.isRequired,
        slideUrl: PropTypes.string.isRequired,
    };

    static defaultProps = {
        mouseXPosition: 0,
        videoPositionLeft: 0,
    };

    /*
     * This function will change the default thumbnail position if the thumbnail is the first or the last
     * to avoid the thumbnail image don't appears correctly
     */
    get elementPosition() {
        const {mouseXPosition, videoWidth, videoPositionLeft} = this.props;
        const mouseXPositionInternal = mouseXPosition - videoPositionLeft;
        const spaceAvailableToRight = videoWidth - mouseXPositionInternal;
        if (spaceAvailableToRight > THUMBNAIL_WIDTH) {
            return {left: '10px'};
        }
        const totalOutsideScreen = THUMBNAIL_WIDTH - spaceAvailableToRight;

        return {right: `${totalOutsideScreen / 2 + 10}px`};
    }

    @autobind
    onMouseEnter(event) {
        return this.props.onMouseEnter(this.props.index, event);
    }

    render() {
        return (
            <div
                styleName="interval"
                style={{width: this.props.width}}
                role="presentation"
                data-purpose="mashup-thumbnail"
                onMouseEnter={this.onMouseEnter}
            >
                {this.props.isVisible && (
                    <div className="video-mashup-thumbnail">
                        <div
                            data-purpose="mashup-thumbnail-image"
                            style={{
                                backgroundImage: `url("${this.props.slideUrl}")`,
                                ...this.elementPosition,
                            }}
                        />
                    </div>
                )}
            </div>
        );
    }
}
