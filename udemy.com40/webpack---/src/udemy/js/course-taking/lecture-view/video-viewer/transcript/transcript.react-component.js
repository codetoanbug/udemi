import autobind from 'autobind-decorator';
import {when} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import requires from '../../../registry/requires';
import TranscriptCue from './transcript-cue.react-component';

import './transcript.less';

@inject('scrollContainerRef')
@requires('courseTakingStore', 'transcriptStore')
@observer
export default class Transcript extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        transcriptStore: PropTypes.object.isRequired,
        scrollContainerRef: PropTypes.object,
    };

    static defaultProps = {
        scrollContainerRef: undefined,
    };

    componentDidMount() {
        const {transcriptTrack} = this.props.transcriptStore;
        when(
            () => !!transcriptTrack,
            () => transcriptTrack.loadFromSource(),
        );
    }

    @autobind
    onCueActive(cueRef) {
        // uses an externally defined container e.g. when in the sidebar, or when in the dashboard
        const {scrollContainerRef} = this.props;
        if (scrollContainerRef && cueRef) {
            scrollContainerRef.scrollTop =
                cueRef.offsetTop -
                scrollContainerRef.offsetTop -
                scrollContainerRef.clientHeight / 2 +
                cueRef.clientHeight / 2;
        }
    }

    @autobind
    handleMouseWheel() {
        const transcriptStore = this.props.transcriptStore;
        if (transcriptStore.isAutoscrollEnabled) {
            transcriptStore.disableAutoscroll();
        }
    }

    render() {
        /** the condition for rendering is already computed by the parent
         * i.e. either <Sidebar /> or <DashboardTranscript />
         */
        const {transcriptTrack} = this.props.transcriptStore;

        return (
            <div
                onWheel={this.handleMouseWheel}
                styleName="transcript-panel"
                data-purpose="transcript-panel"
                dir="auto"
            >
                {transcriptTrack &&
                    transcriptTrack.cues.map((cue) => (
                        <TranscriptCue key={cue.id} cue={cue} onCueActive={this.onCueActive} />
                    ))}
            </div>
        );
    }
}
