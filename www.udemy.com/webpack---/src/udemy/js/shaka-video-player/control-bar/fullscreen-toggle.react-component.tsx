import CollapseDiagonalIcon from '@udemy/icons/dist/collapse-diagonal.ud-icon';
import ExpandDiagonalIcon from '@udemy/icons/dist/expand-diagonal.ud-icon';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {VideoControlBarButton} from './video-control-bar-dropdown.react-component';

interface FullscreenToggleProps {
    fullscreenStore: {
        toggleFullscreen: any;
        isFullscreen: any;
    };
}

@inject('fullscreenStore')
@observer
export class FullscreenToggle extends React.Component<FullscreenToggleProps> {
    static propTypes = {
        fullscreenStore: PropTypes.shape({
            toggleFullscreen: PropTypes.func,
            isFullscreen: PropTypes.bool,
        }).isRequired,
    };

    handleToggleFullscreen = (e: any) => {
        this.props.fullscreenStore.toggleFullscreen();
        e.currentTarget.blur();
    };

    render() {
        const {isFullscreen} = this.props.fullscreenStore;
        const label = isFullscreen ? gettext('Exit fullscreen') : gettext('Fullscreen');
        const Icon = isFullscreen ? CollapseDiagonalIcon : ExpandDiagonalIcon;
        return (
            <VideoControlBarButton
                tooltipProps={{a11yRole: 'none', children: label}}
                onClick={this.handleToggleFullscreen}
            >
                <Icon label={label} size="medium" />
            </VideoControlBarButton>
        );
    }
}
