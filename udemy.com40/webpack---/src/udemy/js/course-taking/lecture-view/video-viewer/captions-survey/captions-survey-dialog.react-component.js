import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import requires from 'course-taking/registry/requires';
import SurveyModal from 'survey/survey-modal.react-component';

import {
    ANSWERS_THAT_TRIGGER_DISSATISFIED_QUESTION,
    ANSWER_THAT_TRIGGERS_FURTHER_INFO_QUESTION,
    FURTHER_INFO_QUESTION,
    IF_SATISFIED_QUESTION,
    WHY_DISSATISFIED_QUESTION,
} from './constants';

@requires('videoViewerStore')
@observer
export default class CaptionsSurveyDialog extends Component {
    static propTypes = {
        videoViewerStore: PropTypes.object.isRequired,
    };

    @autobind
    isQuestionVisible(question) {
        const surveyStore = this.props.videoViewerStore.captionsSurveyStore;
        // If user answer to 'are you satisfied' question is less than satisfied,
        // show extra question (asks user why they are dissatisfied)
        if (question.text_code === WHY_DISSATISFIED_QUESTION) {
            const questionId = surveyStore.questionCodeToId[IF_SATISFIED_QUESTION];
            const userAnswer = surveyStore.userAnswers[questionId];
            const userAnswerCode = surveyStore.answerIdToCode[userAnswer];
            return ANSWERS_THAT_TRIGGER_DISSATISFIED_QUESTION.includes(userAnswerCode);
        }

        // If user answer to 'why are you dissatisfied' question is 'other',
        // show extra question (textbox to ask user to give more info)
        if (question.text_code === FURTHER_INFO_QUESTION) {
            const questionId = surveyStore.questionCodeToId[WHY_DISSATISFIED_QUESTION];
            const userAnswers = surveyStore.userAnswers[questionId] || [];
            const userAnswersCodes = userAnswers.map((id) => surveyStore.answerIdToCode[id]);
            return userAnswersCodes.includes(ANSWER_THAT_TRIGGERS_FURTHER_INFO_QUESTION);
        }
        return true;
    }

    @autobind
    onSubmit() {
        this.props.videoViewerStore.markAsSeenCaptionsSurvey(
            this.props.videoViewerStore.captionsSurveyStore.surveyCode,
        );
    }

    render() {
        return (
            <SurveyModal
                surveyStore={this.props.videoViewerStore.captionsSurveyStore}
                isOpen={this.props.videoViewerStore.isCaptionsSurveyModalVisible}
                onClose={this.props.videoViewerStore.hideCaptionsFeedbackModal}
                onSubmit={this.onSubmit}
                isQuestionVisible={this.isQuestionVisible}
                thankYouPageProps={{
                    title: gettext('Feedback complete!'),
                    text: gettext('Thank you for providing feedback!'),
                }}
            />
        );
    }
}
