import RewindIcon from '@udemy/icons/dist/rewind.ud-icon';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {ShakaVideoPlayerStore} from 'shaka-video-player/shaka-video-player.mobx-store';

import {SEEK_INTERVAL} from '../constants';
import {VideoControlBarButton} from './video-control-bar-dropdown.react-component';

interface VideoPlayerStoreProps {
    videoPlayerStore: ShakaVideoPlayerStore;
}
@inject('videoPlayerStore')
export class RewindSkipButton extends React.Component<VideoPlayerStoreProps> {
    static propTypes = {
        videoPlayerStore: PropTypes.object.isRequired,
    };

    render() {
        const iconLabel = ninterpolate(
            'Rewind %(seconds)s second',
            'Rewind %(seconds)s seconds',
            SEEK_INTERVAL,
            {seconds: SEEK_INTERVAL},
        );
        const tooltipLabel = interpolate(
            gettext('Rewind %(seconds)ss'),
            {seconds: SEEK_INTERVAL},
            true,
        );
        return (
            <VideoControlBarButton
                data-purpose="rewind-skip-button"
                tooltipProps={{a11yRole: 'none', children: tooltipLabel}}
                onClick={this.props.videoPlayerStore.seekBack}
            >
                <RewindIcon label={iconLabel} size="medium" />
            </VideoControlBarButton>
        );
    }
}
