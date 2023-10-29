import PropTypes from 'prop-types';
import React, {ElementType} from 'react';

import './video-feedback.less';

export const VIDEO_FEEDBACK_DURATION = 300;

interface VideoFeedbackProps {
    // TODO: check is ElementType the correct type of icon
    icon: ElementType;
}
export class VideoFeedback extends React.Component<VideoFeedbackProps> {
    static propTypes = {
        icon: PropTypes.elementType.isRequired,
    };

    render() {
        const {icon: Icon} = this.props;
        return (
            <div styleName="container">
                <div styleName="circle">
                    <Icon label={false} color="inherit" size="xxlarge" />
                </div>
            </div>
        );
    }
}
