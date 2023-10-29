import {TrackImpression} from '@udemy/event-tracking';
import ThumbDownIcon from '@udemy/icons/dist/thumb-down.ud-icon';
import ThumbUpIcon from '@udemy/icons/dist/thumb-up.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import {FormGroup, TextInput} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import './fast-feedback.less';

import withExperiment from 'experiment/with-experiment.react-component';

import FastFeedbackStore from './fast-feedback.mobx-store';

@withExperiment({fast_feedback_course_taking_variant: null})
@observer
export default class FastFeedback extends React.Component {
    static propTypes = {
        onStayInFlow: PropTypes.func.isRequired,
        onFinishFlow: PropTypes.func.isRequired,
        experiment: PropTypes.object.isRequired,
        courseTakingStore: PropTypes.object.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.fastFeedbackStore = new FastFeedbackStore(props.experiment, props.courseTakingStore);
    }

    @autobind
    stayInFlow() {
        this.props.onStayInFlow();
        this.fastFeedbackStore.trackMouseEnter();
    }

    @autobind
    thumbUpClicked() {
        this.fastFeedbackStore.thumbUp();
        this.fastFeedbackStore.trackSelected();
        this.props.onFinishFlow();
    }

    @autobind
    thumbDownClicked() {
        this.fastFeedbackStore.thumbDown();
        this.fastFeedbackStore.trackSelected();
        this.props.onFinishFlow();
    }

    @autobind
    sendFeedbackClicked() {
        this.fastFeedbackStore.sendFeedback();
        this.props.onFinishFlow();
        this.fastFeedbackStore.trackSent();
    }

    @autobind
    textFeedbackChanged(event) {
        this.fastFeedbackStore.setTextFeedback(event.target.value);
        this.fastFeedbackStore.trackTyped();
    }

    @autobind
    trackSeen() {
        // autobind is needed to bind 'this' correctly when passed into TrackImpression
        this.fastFeedbackStore.trackSeen();
    }

    @autobind
    skip() {
        this.fastFeedbackStore.skip();
        this.props.onFinishFlow();
    }

    renderInitialContent() {
        return (
            <>
                <div
                    className="ud-heading-md"
                    styleName="question-text"
                    data-purpose="question-text"
                >
                    {this.fastFeedbackStore.isAfterSection && gettext('How did this section go?')}
                    {this.fastFeedbackStore.isAfterLecture && gettext('How did this lecture go?')}
                </div>
                <IconButton styleName="thumb-button" onClick={this.thumbUpClicked}>
                    <ThumbUpIcon
                        label={false}
                        color="inherit"
                        aria-label={gettext('It went well')}
                    />
                </IconButton>
                <IconButton styleName="thumb-button" onClick={this.thumbDownClicked}>
                    <ThumbDownIcon
                        label={false}
                        color="inherit"
                        aria-label={gettext('It could be improved')}
                    />
                </IconButton>
            </>
        );
    }

    renderTextEntryContent() {
        return (
            <FormGroup
                label={gettext('Submit Answer')}
                styleName="answer-form-group"
                labelProps={{className: 'ud-sr-only'}}
            >
                <TextInput
                    styleName="answer-input"
                    onChange={this.textFeedbackChanged}
                    placeholder={this.fastFeedbackStore.placeholderText}
                    onMouseEnter={this.props.onStayInFlow}
                />
                <Button styleName="button" onClick={this.sendFeedbackClicked} data-purpose="send">
                    {gettext('Send')}
                </Button>
                <Button
                    styleName="button"
                    onClick={this.skip}
                    udStyle="secondary"
                    data-purpose="skip"
                >
                    {gettext('Skip')}
                </Button>
            </FormGroup>
        );
    }

    renderResultContent() {
        return (
            <div className="ud-heading-md" styleName="result-text" data-purpose="result-text">
                {gettext('Thank you! Your feedback helps improve Udemy for everyone.')}
            </div>
        );
    }

    render() {
        if (!this.fastFeedbackStore.isDisplayed) {
            return null;
        }
        return (
            <>
                <TrackImpression trackFunc={this.trackSeen}>
                    <div
                        styleName="container"
                        onMouseEnter={this.stayInFlow}
                        data-purpose="fast-feedback-container"
                    >
                        {this.fastFeedbackStore.isInitial && this.renderInitialContent()}
                        {this.fastFeedbackStore.isTextEntry && this.renderTextEntryContent()}
                        {this.fastFeedbackStore.isResult && this.renderResultContent()}
                    </div>
                </TrackImpression>
                {this.fastFeedbackStore.isTextEntry && (
                    <div
                        className="ud-heading-sm"
                        styleName="confidential-text"
                        data-purpose="confidential-text"
                    >
                        {gettext('Your feedback is confidential.')}
                    </div>
                )}
            </>
        );
    }
}
