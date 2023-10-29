import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {ControlBarStore} from 'shaka-video-player/control-bar/control-bar.mobx-store';
import {ShakaVideoPlayerStore} from 'shaka-video-player/shaka-video-player.mobx-store';

import {VideoControlBarDropdown} from '../control-bar/video-control-bar-dropdown.react-component';
import {PlaybackRateMenuStore} from './playback-rate-menu.mobx-store';

import './playback-rate.less';

interface PlaybackRateMenuProps {
    videoPlayerStore: ShakaVideoPlayerStore;
    controlBarStore: ControlBarStore;
}

/* eslint-disable @typescript-eslint/ban-ts-comment */
@inject('videoPlayerStore', 'controlBarStore')
@observer
export class PlaybackRateMenu extends React.Component<PlaybackRateMenuProps> {
    static propTypes = {
        videoPlayerStore: PropTypes.object.isRequired,
        controlBarStore: PropTypes.object.isRequired,
    };

    constructor(props: any) {
        super(props);
        this.store = new PlaybackRateMenuStore(this.props.controlBarStore);
    }

    store: any;

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
                // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                placement="top-start"
                isOpen={this.store.isMenuOpen}
                onToggle={this.store.toggleMenu}
                styleName="playback-rate"
                trigger={button}
            >
                <VideoControlBarDropdown.Menu data-purpose="playback-rate-menu" styleName="menu">
                    {availablePlaybackRates.map((playbackRate: any) => (
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
