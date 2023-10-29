import {getUniqueId, onIncrement, onDecrement, onEnterAndSpace} from '@udemy/design-system-utils';
import VolumeOffIcon from '@udemy/icons/dist/volume-off.ud-icon';
import VolumeOnIcon from '@udemy/icons/dist/volume-on.ud-icon';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {VideoControlBarButton} from '../control-bar/video-control-bar-dropdown.react-component';
import VolumeControlStore from './volume-control.mobx-store';

import './volume-control.less';

@inject('videoPlayerStore')
@observer
export default class VolumeControl extends React.Component {
    static propTypes = {
        videoPlayerStore: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.store = new VolumeControlStore(props.videoPlayerStore.volumeStore);
        this.sliderId = getUniqueId('slider');
        this.lastVolume = 0;
    }

    get volumeStore() {
        return this.props.videoPlayerStore.volumeStore;
    }

    @autobind
    openMenu() {
        this.store.setOpen(true);
    }

    @autobind
    closeMenu() {
        this.store.setOpen(false);
        this.stopDragging();
    }

    @autobind
    toggleMuted() {
        const {isMuted} = this.volumeStore;

        const storagedVolume = localStorage.getItem('lastVolume');
        if (isMuted && storagedVolume !== 0.0) {
            this.volumeStore.chooseMuted(false);
            this.volumeStore.chooseVolume(storagedVolume);
        } else {
            this.volumeStore.toggleMuted();
        }
    }

    @autobind
    onMouseMove(event) {
        if (!this.store.isDragging) {
            return;
        }
        const sliderBounds = event.currentTarget
            .querySelector(`#${this.sliderId}`)
            .getBoundingClientRect();
        const height = sliderBounds.height;
        const y = Math.min(Math.max(0, event.clientY - sliderBounds.top), height);
        this.volumeStore.chooseVolume(1 - y / height);
    }

    @autobind
    stopDragging() {
        const {displayVolume} = this.store;
        if (displayVolume !== 0.0) {
            this.lastVolume = this.volumeStore.volume;
            localStorage.setItem('lastVolume', this.lastVolume);
            this.volumeStore.chooseMuted(false);
        } else {
            this.lastVolume = this.volumeStore.volume;
            this.volumeStore.chooseMuted(true);
        }
        this.store.setDragging(false);
    }

    @autobind
    startDragging(event) {
        this.lastVolume = this.volumeStore.volume;
        localStorage.setItem('lastVolume', this.lastVolume);
        this.store.setDragging(true);
        this.onMouseMove(event);
        // We don't want to focus the volume control because it stays open when focussed for a11y.
        event.preventDefault();
    }

    @autobind
    onKeyDown(event) {
        onDecrement(() => {
            this.volumeStore.volumeDown(0.05);
            event.preventDefault();
        })(event);
        onIncrement(() => {
            this.volumeStore.volumeUp(0.05);
            event.preventDefault();
        })(event);
        onEnterAndSpace(() => {
            this.toggleMuted();
            event.preventDefault();
        })(event);
    }

    get slider() {
        const {displayVolume, isDragging, isOpen} = this.store;
        return (
            <div
                data-purpose="volume-control-bar"
                role="slider"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={displayVolume}
                aria-label={gettext('Volume')}
                tabIndex={0}
                styleName={classNames('slider-focus-wrapper', {
                    dragging: isDragging,
                    'invisible-unless-focused': !isOpen,
                })}
                onKeyDown={this.onKeyDown}
                onMouseMove={this.onMouseMove}
                onMouseDown={this.startDragging}
            >
                <div id={this.sliderId} styleName="slider">
                    <div
                        styleName="slider-inner"
                        style={{transform: `scaleY(${displayVolume / 100})`}}
                    />
                </div>
            </div>
        );
    }

    get controlButton() {
        const {isMuted} = this.volumeStore;
        const {displayVolume} = this.store;
        const label = isMuted ? gettext('Unmute') : gettext('Mute');
        let Icon = VolumeOnIcon;
        if (displayVolume === 0.0 || isMuted) {
            Icon = VolumeOffIcon;
        }
        return (
            <VideoControlBarButton data-purpose="volume-control-button" onClick={this.toggleMuted}>
                <Icon label={label} size="medium" />
            </VideoControlBarButton>
        );
    }

    render() {
        return (
            <div
                onMouseEnter={this.openMenu}
                onMouseLeave={this.closeMenu}
                onMouseUp={this.stopDragging}
            >
                {this.slider}
                {this.controlButton}
            </div>
        );
    }
}
