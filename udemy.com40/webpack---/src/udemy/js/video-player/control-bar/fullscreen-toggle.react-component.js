import CollapseDiagonalIcon from '@udemy/icons/dist/collapse-diagonal.ud-icon';
import ExpandDiagonalIcon from '@udemy/icons/dist/expand-diagonal.ud-icon';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './fullscreen-toggle.less';
import {VideoControlBarButton} from './video-control-bar-dropdown.react-component';

@inject('fullscreenStore')
@observer
export default class FullscreenToggle extends React.Component {
    static propTypes = {
        fullscreenStore: PropTypes.shape({
            toggleFullscreen: PropTypes.func,
            isFullscreen: PropTypes.bool,
        }).isRequired,
    };

    @autobind
    handleToggleFullscreen(e) {
        this.props.fullscreenStore.toggleFullscreen();
        e.currentTarget.blur();
    }

    render() {
        const {isFullscreen} = this.props.fullscreenStore;
        const fullscreenLabel = gettext('Exit fullscreen');
        const nonFullscreenLabel = gettext('Fullscreen');
        return (
            <>
                <VideoControlBarButton
                    className={classNames({
                        [styles.hidden]: !isFullscreen,
                    })}
                    tooltipProps={{a11yRole: 'none', children: fullscreenLabel}}
                    onClick={this.handleToggleFullscreen}
                >
                    <CollapseDiagonalIcon label={fullscreenLabel} size="medium" />
                </VideoControlBarButton>
                <VideoControlBarButton
                    className={classNames({[styles.hidden]: isFullscreen})}
                    tooltipProps={{
                        a11yRole: 'none',
                        children: nonFullscreenLabel,
                        detachFromTarget: true,
                    }}
                    onClick={this.handleToggleFullscreen}
                >
                    <ExpandDiagonalIcon label={nonFullscreenLabel} size="medium" />
                </VideoControlBarButton>
            </>
        );
    }
}
