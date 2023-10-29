import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import requires from 'course-taking/registry/requires';

import './caption-survey-toast.less';

@requires('videoViewerStore', 'courseTakingStore', 'progressBarStore')
@observer
export default class CaptionSurveyToast extends React.Component {
    static propTypes = {
        videoViewerStore: PropTypes.object.isRequired,
        courseTakingStore: PropTypes.object.isRequired,
        progressBarStore: PropTypes.object.isRequired,
        surveyCode: PropTypes.string.isRequired,
    };

    @autobind
    onDismiss() {
        this.props.videoViewerStore.markAsSeenCaptionsSurvey(this.props.surveyCode);
    }

    @autobind
    onLaunch() {
        this.props.videoViewerStore.showCaptionsFeedbackModal(this.props.surveyCode);
    }

    render() {
        const toast = (
            <div styleName="toast">
                <div className="ud-heading-md">{gettext('What do you think of the captions?')}</div>
                <div styleName="btns">
                    <Button
                        size="small"
                        onClick={this.onLaunch}
                        data-purpose="launch-caption-survey"
                    >
                        {gettext('Caption feedback')}
                    </Button>
                    <Button
                        size="small"
                        className="ud-link-neutral"
                        udStyle="ghost"
                        onClick={this.onDismiss}
                    >
                        {gettext('Dismiss')}
                    </Button>
                </div>
            </div>
        );
        return ReactDOM.createPortal(toast, this.props.progressBarStore.popoverAreaRef);
    }
}
