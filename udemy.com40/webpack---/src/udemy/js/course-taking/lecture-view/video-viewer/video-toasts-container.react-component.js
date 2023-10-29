import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {withErrorBoundary} from 'base-components/error-boundary/error-boundary.react-component';
import requires from 'course-taking/registry/requires';

import CaptionSurveyToast from './captions-survey/caption-survey-toast.react-component';
import {AUTO_CAPTIONS_SURVEY_CODE, MT_CAPTIONS_SURVEY_CODE} from './captions-survey/constants';

@withErrorBoundary
@requires('videoViewerStore', 'userActivityStore')
@observer
export default class VideoToastsContainer extends React.Component {
    static propTypes = {
        videoViewerStore: PropTypes.shape({
            courseTakingStore: PropTypes.shape({
                course: PropTypes.object,
            }),
            captionsStore: PropTypes.shape({
                activeTracks: PropTypes.array,
            }),
            checkHasSeenCaptionsSurvey: PropTypes.func,
            setHasSeenCaptionsSurvey: PropTypes.func,
            hasSeenCaptionsSurveys: PropTypes.object,
            canShowCaptionSurveyToast: PropTypes.bool,
        }).isRequired,
        userActivityStore: PropTypes.shape({
            isInitialActivationComplete: PropTypes.bool,
        }).isRequired,
    };

    componentDidMount() {
        const {
            courseTakingStore,
            captionsStore,
            canShowCaptionSurveyToast,
            checkHasSeenCaptionsSurvey,
        } = this.props.videoViewerStore;

        if (!canShowCaptionSurveyToast) {
            return;
        }

        const activeTrack = captionsStore.activeTracks.length
            ? captionsStore.activeTracks[0]
            : null;
        if (!activeTrack) {
            return;
        }

        const courseLocale = courseTakingStore.course.locale.locale.split('_')[0];
        const captionSurveyType =
            activeTrack.language === courseLocale
                ? AUTO_CAPTIONS_SURVEY_CODE
                : MT_CAPTIONS_SURVEY_CODE;
        this.setCaptionSurveyType(captionSurveyType);

        checkHasSeenCaptionsSurvey(this.captionSurveyType);
    }

    @action
    setCaptionSurveyType(surveyType) {
        this.captionSurveyType = surveyType;
    }

    @observable captionSurveyType;

    render() {
        const {videoViewerStore, userActivityStore} = this.props;
        if (!userActivityStore.isInitialActivationComplete) {
            return null;
        }

        if (videoViewerStore.hasSeenCaptionsSurveys.get(this.captionSurveyType) === false) {
            return <CaptionSurveyToast surveyCode={this.captionSurveyType} />;
        }

        return null;
    }
}
