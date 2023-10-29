import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom';

import CaptionEditorTakeover from 'caption-editor/caption-editor-takeover.react-component';
import SurveyModal from 'survey/survey-modal.react-component';
import SurveyStore from 'survey/survey.mobx-store';
import SystemMessage from 'utils/ud-system-message';

@inject('store')
@withRouter
@observer
export default class LectureCaptionEditor extends React.Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        lecture: PropTypes.object.isRequired,
        title: PropTypes.string.isRequired,
        localeId: PropTypes.string.isRequired,
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.surveyStore = new SurveyStore('caption-editing', props.store.courseId);
    }

    async componentDidMount() {
        await this.surveyStore.getSurvey();
        this.surveyStore.setUserAnswers({});
    }

    @autobind
    onCaptionCreated(caption) {
        this.props.store.refreshCaption(caption, this.props.lecture.id);
    }

    @autobind
    returnToCaptionManage() {
        this.props.history.push(`${this.props.store.relativePath}/${this.props.localeId}/`);
    }

    get hasUserCompletedOrSeenSurvey() {
        return [
            SystemMessage.ids.captionEditorSurvey,
            SystemMessage.ids.captionEditorSurveyPopup,
        ].some((message) => this.props.store.seenSystemMessages[message]);
    }

    openSurvey(exitAfterSurvey = false) {
        this.videoPlayer && this.videoPlayer.pause();
        this.props.store.openSurvey(exitAfterSurvey);
    }

    @autobind
    feedbackButtonHandler() {
        // This method is passed an event as the only argument. Make sure it's not passed on to
        // openSurvey as the exitAfterSurvey argument (as it will evaluate as truthy).
        this.openSurvey();
    }

    @autobind
    onSaveBtnClick() {
        if (!this.hasUserCompletedOrSeenSurvey) {
            this.openSurvey();
        }
    }

    @autobind
    onExitBtnClick() {
        if (!this.hasUserCompletedOrSeenSurvey) {
            this.openSurvey(true);
            // Prevent editor from closing.
            return false;
        }
    }

    @autobind
    onPlayerReady(player) {
        this.videoPlayer = player;
    }

    render() {
        const {lecture, title, localeId, store} = this.props;

        let giveFeedbackButton;
        // Pass seenSystemMessages directly into this component if it needs to be disentangled
        // from the caption manage app.
        if (!this.props.store.seenSystemMessages[SystemMessage.ids.captionEditorSurvey]) {
            giveFeedbackButton = (
                <Button udStyle="ghost" onClick={this.feedbackButtonHandler}>
                    {gettext('Give feedback')}
                </Button>
            );
        }

        return (
            <>
                <CaptionEditorTakeover
                    courseId={this.props.courseId}
                    assetId={lecture.asset.id}
                    title={title}
                    transcriptLocaleId={localeId}
                    relativePath={store.relativePath}
                    uploader={store.fileUploader}
                    onSaveBtnClick={this.onSaveBtnClick}
                    onCaptionCreated={this.onCaptionCreated}
                    onExitBtnClick={this.onExitBtnClick}
                    onExit={this.returnToCaptionManage}
                    actionButtons={giveFeedbackButton}
                    onPlayerReady={this.onPlayerReady}
                    addControlledCloseFn={store.addControlledEditorCloseFn}
                />
                <SurveyModal
                    surveyStore={this.surveyStore}
                    isOpen={store.isEditorFeedbackSurveyVisible}
                    onClose={store.hideEditorFeedbackSurvey}
                    onSubmit={store.onEditorFeedbackSurveySubmit}
                    thankYouPageProps={{
                        text: gettext(
                            'Thanks for taking the time to give us your opinion. ' +
                                'We are working hard to make it easy for you to manage and improve your captions.',
                        ),
                    }}
                />
            </>
        );
    }
}
