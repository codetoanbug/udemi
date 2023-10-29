import PauseIcon from '@udemy/icons/dist/pause.ud-icon';
import PlayArrowIcon from '@udemy/icons/dist/play-arrow.ud-icon';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {VideoFeedback, VIDEO_FEEDBACK_DURATION} from './video-feedback.react-component';
import './video-feedback.less';

const CenteredPlayIcon = (props: any) => <PlayArrowIcon {...props} styleName="play-icon" />;

interface PlayPauseFeedbackProps {
    isPlaying: boolean;
}
@observer
export class PlayPauseFeedback extends React.Component<PlayPauseFeedbackProps> {
    static propTypes = {
        isPlaying: PropTypes.bool.isRequired,
    };

    componentDidUpdate(prevProps: any) {
        if (prevProps.isPlaying !== this.props.isPlaying) {
            this.showFeedback(this.props.isPlaying);
        }
    }

    iconTimeout: any;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    @observable.ref Icon: NonNullable<PropTypes.ReactComponentLike> | null | undefined;

    @action
    showFeedback(isPlaying: any) {
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
        // eslint-disable-next-line react/prop-types
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
        return this.Icon ? <VideoFeedback icon={this.Icon} /> : null;
    }
}
