import PropTypes from 'prop-types';
import React from 'react';

import './video-feedback.less';

export const VIDEO_FEEDBACK_DURATION = 300;

export default class VideoFeedback extends React.Component {
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
