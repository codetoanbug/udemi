import {action, observable, when} from 'mobx';
import {inject, observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import {ProgressBar} from '../progress-bar/progress-bar.react-component';
import * as Controls from './controls';

import './shaka-control-bar.less';

interface ControlBarProps {
    progressBarStore: any;
    userActivityStore: any;
    player: any;
    isPlaying: boolean;
    onPlayPause: any;
    container: any;
}

/* eslint-disable @typescript-eslint/ban-ts-comment */
@inject('progressBarStore', 'userActivityStore')
@observer
export class ControlBar extends React.Component<ControlBarProps> {
    static defaultProps = {userActivityStore: null, container: null};
    static propTypes = {
        progressBarStore: PropTypes.object.isRequired,
        userActivityStore: PropTypes.object,
        player: PropTypes.object.isRequired,
        isPlaying: PropTypes.bool.isRequired,
        onPlayPause: PropTypes.func.isRequired,
        container: PropTypes.object,
    };

    constructor(props: any) {
        super(props);
        when(
            () => this.ref && this.props.userActivityStore,
            () => {
                this.props.userActivityStore.addHideOnInactive(this.ref);
                this.props.userActivityStore.addActiveOnHover(this.ref);
            },
        );
    }

    @observable.ref ref: any;

    @action
    setRef = (ref: any) => {
        this.ref = ref;
    };

    getControlBarProps = () => {
        // Controls.PlayToggle needs these.
        return {isPlaying: this.props.isPlaying, onPlayPause: this.props.onPlayPause};
    };

    get defaultControls() {
        return (
            <>
                {/* @ts-expect-error */}
                <Controls.PlayToggle />
                {/* @ts-expect-error */}
                <Controls.RewindSkipButton />
                {/* @ts-expect-error */}
                <Controls.PlaybackRateMenu />
                {/* @ts-expect-error */}
                <Controls.ForwardSkipButton />
                {/* @ts-expect-error */}
                <Controls.ProgressDisplay />
                <Controls.Spacer />
                {/* @ts-expect-error */}
                <Controls.VolumeControl />
                {/* @ts-expect-error */}
                <Controls.CaptionsMenu />
                {/* @ts-expect-error */}
                <Controls.SettingsMenu />
                {/* @ts-expect-error */}
                <Controls.FullscreenToggle />
            </>
        );
    }

    render() {
        const container = this.props.container;
        const controlBarContainerId = `${this.props.container?.id.replace('video', 'control-bar')}`;
        const controlBarVideoPopoverContainerId = `${controlBarContainerId}-popover-area`;
        const componentNode = (
            <div
                id={controlBarContainerId}
                styleName="control-bar-wrapper"
                data-purpose="video-control-bar"
            >
                <div
                    id={controlBarVideoPopoverContainerId}
                    className="video-popover-area"
                    styleName="popover-area"
                    ref={this.props.progressBarStore.setPopoverAreaRef}
                />
                <div styleName="control-bar-container" ref={this.setRef}>
                    <ProgressBar progressBarStore={this.props.progressBarStore} />
                    <Provider getControlBarProps={this.getControlBarProps}>
                        <div styleName="control-bar" data-purpose="video-controls">
                            {this.props.children ?? this.defaultControls}
                        </div>
                    </Provider>
                </div>
            </div>
        );

        return ReactDOM.createPortal(componentNode, container);
    }
}
