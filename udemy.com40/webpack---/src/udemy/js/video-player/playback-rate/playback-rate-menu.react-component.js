import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import VideoControlBarDropdown from '../control-bar/video-control-bar-dropdown.react-component';
import PlaybackRateMenuStore from './playback-rate-menu.mobx-store';
import './playback-rate.less';

@inject('videoPlayerStore', 'controlBarStore')
@observer
export default class PlaybackRateMenu extends React.Component {
    static propTypes = {
        videoPlayerStore: PropTypes.object.isRequired,
        controlBarStore: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.store = new PlaybackRateMenuStore(this.props.controlBarStore);
    }

    render() {
        const {playbackRateStore} = this.props.videoPlayerStore;
        const {availablePlaybackRates, playbackRate: currentPlaybackRate} = playbackRateStore;
        const button = (
            <VideoControlBarDropdown.Button
                aria-label={gettext('Playback rate')}
                data-purpose="playback-rate-button"
                className="ud-custom-focus-visible"
                styleName="trigger"
                tooltipProps={{a11yRole: 'none', children: gettext('Playback rate')}}
            >
                <span className="ud-focus-visible-target" styleName="trigger-text">
                    {`${currentPlaybackRate}x`}
                </span>
            </VideoControlBarDropdown.Button>
        );
        return (
            <VideoControlBarDropdown
                placement="top-start"
                isOpen={this.store.isMenuOpen}
                onToggle={this.store.toggleMenu}
                styleName="playback-rate"
                trigger={button}
            >
                <VideoControlBarDropdown.Menu data-purpose="playback-rate-menu" styleName="menu">
                    {availablePlaybackRates.map((playbackRate) => (
                        <VideoControlBarDropdown.MenuItem
                            key={playbackRate}
                            onClick={() => playbackRateStore.choosePlaybackRate(playbackRate)}
                            aria-checked={playbackRate === currentPlaybackRate}
                            role="menuitemradio"
                        >
                            <span className="ud-text-bold">{`${playbackRate}x`}</span>
                        </VideoControlBarDropdown.MenuItem>
                    ))}
                </VideoControlBarDropdown.Menu>
            </VideoControlBarDropdown>
        );
    }
}
