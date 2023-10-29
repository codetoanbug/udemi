import ReloadIcon from '@udemy/icons/dist/reload.ud-icon';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {SEEK_INTERVAL} from '../constants';
import {VideoControlBarButton} from './video-control-bar-dropdown.react-component';

interface VideoPlayerStoreProps {
    videoPlayerStore: any;
}
@inject('videoPlayerStore')
export class ForwardSkipButton extends React.Component<VideoPlayerStoreProps> {
    static propTypes = {
        videoPlayerStore: PropTypes.object.isRequired,
    };

    render() {
        const iconLabel = ninterpolate(
            'Forward %(seconds)s second',
            'Forward %(seconds)s seconds',
            SEEK_INTERVAL,
            {seconds: SEEK_INTERVAL},
        );
        const tooltipLabel = interpolate(
            gettext('Forward %(seconds)ss'),
            {seconds: SEEK_INTERVAL},
            true,
        );
        return (
            <VideoControlBarButton
                data-purpose="forward-skip-button"
                tooltipProps={{a11yRole: 'none', children: tooltipLabel}}
                onClick={this.props.videoPlayerStore.seekForward}
            >
                <ReloadIcon label={iconLabel} size="medium" />
            </VideoControlBarButton>
        );
    }
}
