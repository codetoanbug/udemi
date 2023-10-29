import React from 'react';

import CourseCompletionConfetti from './confetti/course-completion-confetti.react-component';
import './end-screen-overlay.less';

export default class EndScreenOverlay extends React.Component {
    render() {
        return (
            <div styleName="container">
                <CourseCompletionConfetti />
                <div styleName="content">{this.props.children}</div>
            </div>
        );
    }
}
