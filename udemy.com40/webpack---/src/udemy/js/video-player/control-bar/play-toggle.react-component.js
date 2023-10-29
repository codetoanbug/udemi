import PauseIcon from '@udemy/icons/dist/pause.ud-icon';
import PlayArrowIcon from '@udemy/icons/dist/play-arrow.ud-icon';
import autobind from 'autobind-decorator';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {VideoControlBarButton} from './video-control-bar-dropdown.react-component';

@inject('getControlBarProps')
export default class PlayToggle extends React.Component {
    static propTypes = {
        getControlBarProps: PropTypes.func.isRequired,
    };

    @autobind
    onTogglePlay() {
        const {isPlaying, onPlayPause} = this.props.getControlBarProps();
        onPlayPause(!isPlaying);
    }

    render() {
        const {isPlaying} = this.props.getControlBarProps();
        const label = isPlaying ? gettext('Pause') : gettext('Play');
        const Icon = isPlaying ? PauseIcon : PlayArrowIcon;
        return (
            <VideoControlBarButton
                data-purpose={isPlaying ? 'pause-button' : 'play-button'}
                tooltipProps={{a11yRole: 'none', children: label}}
                onClick={this.onTogglePlay}
            >
                <Icon label={label} size="medium" />
            </VideoControlBarButton>
        );
    }
}
