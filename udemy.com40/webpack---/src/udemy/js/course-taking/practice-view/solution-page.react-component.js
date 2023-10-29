import {AlertBanner} from '@udemy/react-messaging-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import VideoAsset from 'asset/video/video-asset.react-component';
import getConfigData from 'utils/get-config-data';

import {ITEM_TYPES} from '../curriculum/constants';
import ItemLink from '../curriculum/item-link.react-component';
import requires from '../registry/requires';
import BasePage from './base-page.react-component';
import {SELF_QUESTION_TYPE, PAGES} from './constants';
import Feedback from './feedback.react-component';
import ResourceDownload from './resource-download.react-component';
import Submission from './submission.react-component';

import './practice.less';

const udConfig = getConfigData();

const InfoAlert = ({practice, isMissingAnswer}) => {
    let title, text, buttonText;

    if (isMissingAnswer) {
        title = gettext("You haven't answered the assignment yet.");
        text = gettext(
            'Submit your work to get constructive feedback from your instructors and peers.',
        );
        buttonText = gettext('Add your answer');
    } else {
        title = gettext("You haven't submitted your answer yet.");
        text = gettext('Go to the assignment step to submit your answer.');
        buttonText = gettext('Go to assignment');
    }
    return (
        <AlertBanner
            title={title}
            body={text}
            dismissButtonProps={false}
            ctaText={buttonText}
            actionButtonProps={{
                componentClass: ItemLink,
                itemType: ITEM_TYPES.PRACTICE,
                itemId: practice.id,
                subPath: '/submission',
            }}
        />
    );
};

InfoAlert.propTypes = {
    practice: PropTypes.object.isRequired,
    isMissingAnswer: PropTypes.bool.isRequired,
};

const SubmissionPanel = ({submission, title, children}) => (
    <div styleName="panel">
        <h4 className="ud-heading-md" styleName="mb-xs">
            {title}
        </h4>
        {submission ? <Submission submission={submission} /> : <Loader size="large" block={true} />}
        {children}
    </div>
);

SubmissionPanel.propTypes = {
    submission: PropTypes.object,
    title: PropTypes.string,
    children: PropTypes.any,
};

SubmissionPanel.defaultProps = {
    submission: null,
    title: null,
    children: null,
};

@requires('practiceViewStore')
@observer
export default class SolutionPage extends Component {
    static propTypes = {
        practiceViewStore: PropTypes.object.isRequired,
    };

    @autobind
    onPracticeInitialized() {
        const {practiceViewStore} = this.props;
        return practiceViewStore.getInstructorSubmission().then(() => {
            practiceViewStore.userSubmission.getPracticeQuestionUserAnswers();
            if (
                practiceViewStore.userSubmission.isSubmitted &&
                !practiceViewStore.userSubmission.selfFeedbacksAreLoaded
            ) {
                practiceViewStore.userSubmission.getFeedbackOfType(SELF_QUESTION_TYPE);
            }
        });
    }

    render() {
        const {
            practice,
            userSubmission,
            instructorSubmission,
            solutionVideoComponent,
            solutionDownloadableAssets,
        } = this.props.practiceViewStore;

        const areOrgAssignmentsDisabled = !udConfig.features.organization.course_taking
            .student_assignment_submissions_enabled;
        return (
            <BasePage
                onPracticeInitialized={this.onPracticeInitialized}
                title={gettext('How did you do?')}
                subtitle={gettext("Compare the instructor's example to your own")}
                pageType={PAGES.SOLUTION_PAGE}
            >
                {userSubmission && (
                    <>
                        <SubmissionPanel
                            submission={instructorSubmission}
                            title={gettext('Instructor example')}
                            data-purpose="instructor-submission"
                        >
                            {!!solutionVideoComponent && (
                                <div styleName="practice-component-video">
                                    <VideoAsset
                                        id={solutionVideoComponent.asset.id}
                                        courseId={practice.courseId}
                                        practiceId={practice.id}
                                    />
                                </div>
                            )}
                            {!!solutionDownloadableAssets.length && (
                                <ResourceDownload
                                    practice={practice}
                                    resources={solutionDownloadableAssets.slice()}
                                />
                            )}
                        </SubmissionPanel>
                        <SubmissionPanel
                            submission={userSubmission}
                            title={gettext('Your submission')}
                            data-purpose="user-submission"
                        >
                            {!userSubmission.hasAnswer || !userSubmission.isSubmitted ? (
                                areOrgAssignmentsDisabled ? null : (
                                    <InfoAlert
                                        practice={practice}
                                        isMissingAnswer={!userSubmission.hasAnswer}
                                    />
                                )
                            ) : userSubmission.selfFeedbacksAreLoaded ? (
                                userSubmission.selfFeedbacks.map((feedback) => (
                                    <Feedback
                                        feedback={feedback}
                                        key={feedback.answer.id || 'new-feedback'}
                                    />
                                ))
                            ) : (
                                <Loader size="large" block={true} />
                            )}
                        </SubmissionPanel>
                    </>
                )}
            </BasePage>
        );
    }
}
