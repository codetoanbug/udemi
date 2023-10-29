import PauseIcon from '@udemy/icons/dist/pause.ud-icon';
import PlayArrowIcon from '@udemy/icons/dist/play-arrow.ud-icon';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import VideoFeedback, {VIDEO_FEEDBACK_DURATION} from './video-feedback.react-component';
import './video-feedback.less';

const CenteredPlayIcon = (props) => <PlayArrowIcon {...props} styleName="play-icon" />;

@observer
export default class PlayPauseFeedback extends React.Component {
    static propTypes = {
        isPlaying: PropTypes.bool.isRequired,
    };

    componentDidUpdate(prevProps) {
        if (prevProps.isPlaying !== this.props.isPlaying) {
            this.showFeedback(this.props.isPlaying);
        }
    }

    @observable.ref Icon = null;

    @action
    showFeedback(isPlaying) {
        clearTimeout(this.iconTimeout);
        this.Icon = isPlaying ? CenteredPlayIcon : PauseIcon;
        this.iconTimeout = setTimeout(
            action(() => {
                this.Icon = null;
            }),
            VIDEO_FEEDBACK_DURATION,
        );
    }

    render() {
        return this.Icon ? <VideoFeedback icon={this.Icon} /> : null;
    }
}
