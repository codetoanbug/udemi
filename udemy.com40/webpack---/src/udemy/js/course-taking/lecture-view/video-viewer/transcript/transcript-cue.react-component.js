import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {computed} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {TRACKING_CATEGORIES} from '../../../constants';
import requires from '../../../registry/requires';
import {TRANSCRIPT_ACTIONS} from './constants';

import './transcript.less';

@requires('courseTakingStore', 'videoViewerStore', 'transcriptStore')
@observer
export default class TranscriptCue extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        videoViewerStore: PropTypes.object.isRequired,
        transcriptStore: PropTypes.object.isRequired,
        cue: PropTypes.shape({
            id: PropTypes.number.isRequired,
            text: PropTypes.string.isRequired,
            displayText: PropTypes.string.isRequired,
            startTime: PropTypes.number.isRequired,
        }).isRequired,
        onCueActive: PropTypes.func.isRequired,
    };

    componentDidUpdate() {
        if (!this.props.transcriptStore.isAutoscrollEnabled) {
            return;
        }

        if (this.isActiveCue) {
            this.props.onCueActive(this.cueRef);
        }
    }

    @autobind
    onCueClick() {
        const {startTime} = this.props.cue;
        const {isPlayerReady, player} = this.props.videoViewerStore;
        const {enableAutoscroll} = this.props.transcriptStore;
        // Cues  may render and be clickable before the player is ready, just ignore
        if (!isPlayerReady) {
            return;
        }
        if (startTime !== player.currentTime()) {
            player.currentTime(startTime);
        }
        enableAutoscroll();
        this.props.courseTakingStore.track(
            TRACKING_CATEGORIES.TRANSCRIPT,
            TRANSCRIPT_ACTIONS.CUE_CLICK,
        );
    }

    @autobind
    trackCopyCue() {
        this.props.courseTakingStore.track(
            TRACKING_CATEGORIES.TRANSCRIPT,
            TRANSCRIPT_ACTIONS.CUE_COPY,
        );
    }

    @computed
    get isActiveCue() {
        return this.props.cue.id === this.props.transcriptStore.activeCueId;
    }

    render() {
        const cueStyle = classNames({
            'highlight-cue': this.isActiveCue,
        });

        return (
            <div
                ref={(cueRef) => {
                    this.cueRef = cueRef;
                }}
                styleName="cue-container"
            >
                <p
                    data-purpose={this.isActiveCue ? 'transcript-cue-active' : 'transcript-cue'}
                    styleName="underline-cue"
                    role="button"
                    tabIndex="-1"
                    onClick={this.onCueClick}
                    onKeyDown={this.onCueClick}
                >
                    <span styleName={cueStyle} onCopy={this.trackCopyCue} data-purpose="cue-text">
                        {this.props.cue.displayText}
                    </span>
                </p>
            </div>
        );
    }
}
