import autobind from 'autobind-decorator';
import {action, observable, when} from 'mobx';
import {inject, observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import ProgressBar from 'video-player/progress-bar/progress-bar.react-component';

import * as Controls from './controls';
import './control-bar.less';

@inject('progressBarStore', 'userActivityStore')
@observer
export default class ControlBar extends React.Component {
    static defaultProps = {userActivityStore: null};
    static propTypes = {
        progressBarStore: PropTypes.object.isRequired,
        userActivityStore: PropTypes.object,
        player: PropTypes.object.isRequired,
        isPlaying: PropTypes.bool.isRequired,
        onPlayPause: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        when(
            () => this.ref && this.props.userActivityStore,
            () => {
                this.props.userActivityStore.addHideOnInactive(this.ref);
                this.props.userActivityStore.addActiveOnHover(this.ref);
            },
        );
    }

    @observable.ref ref;

    @autobind
    @action
    setRef(ref) {
        this.ref = ref;
    }

    @autobind
    getControlBarProps() {
        // Controls.PlayToggle needs these.
        return {isPlaying: this.props.isPlaying, onPlayPause: this.props.onPlayPause};
    }

    get defaultControls() {
        return (
            <>
                <Controls.PlayToggle />
                <Controls.RewindSkipButton />
                <Controls.PlaybackRateMenu />
                <Controls.ForwardSkipButton />
                <Controls.ProgressDisplay />
                <Controls.Spacer />
                <Controls.VolumeControl />
                <Controls.CaptionsMenu />
                <Controls.SettingsMenu />
                <Controls.FullscreenToggle />
            </>
        );
    }

    render() {
        const componentNode = (
            <div styleName="control-bar-wrapper" data-purpose="video-control-bar">
                <div
                    className="video-popover-area"
                    styleName="popover-area"
                    ref={this.props.progressBarStore.setPopoverAreaRef}
                />
                <div styleName="control-bar-container" ref={this.setRef}>
                    <ProgressBar />
                    <Provider getControlBarProps={this.getControlBarProps}>
                        <div styleName="control-bar" data-purpose="video-controls">
                            {this.props.children || this.defaultControls}
                        </div>
                    </Provider>
                </div>
            </div>
        );

        return ReactDOM.createPortal(componentNode, this.props.player.el());
    }
}
