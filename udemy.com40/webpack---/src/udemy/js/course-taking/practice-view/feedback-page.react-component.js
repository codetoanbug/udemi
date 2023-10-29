import SuccessIcon from '@udemy/icons/dist/success.ud-icon';
import {AlertBanner} from '@udemy/react-messaging-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import getConfigData from 'utils/get-config-data';

import requires from '../registry/requires';
import BasePage from './base-page.react-component';
import {PAGES} from './constants';
import Feedback from './feedback.react-component';
import FooterButton from './footer-button.react-component';
import GoToFeedbackButton from './go-to-feedback-button.react-component';
import Submission from './submission.react-component';

import './practice.less';

const udConfig = getConfigData();

const NoSubmissionMessage = () => (
    <div styleName="empty-message">
        <SuccessIcon label={false} size="large" styleName="empty-message-icon" />
        <h4 className="ud-heading-md" styleName="empty-message-title">
            {gettext("Congratulations, you're the first student to complete this assignment")}
        </h4>
        <p>
            {gettext(
                'There are no other student submissions to review at this time, but you can ' +
                    "check back later if you'd like to help other students with what you've learned " +
                    'on this assignment.',
            )}
        </p>
    </div>
);

@requires('courseTakingStore', 'practiceViewStore')
@observer
export default class FeedbackPage extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        practiceViewStore: PropTypes.object.isRequired,
    };

    @autobind
    renderRightButtons() {
        return (
            <>
                <FooterButton
                    url={this.props.practiceViewStore.prevUrl}
                    className="ud-link-neutral"
                    udStyle="ghost"
                >
                    {gettext('Previous')}
                </FooterButton>
                <GoToFeedbackButton />
            </>
        );
    }

    render() {
        const {
            getAssignedSubmissions,
            submissionsLoaded,
            assignedSubmissions,
        } = this.props.practiceViewStore;

        const areOrgAssignmentsDisabled = !udConfig.features.organization.course_taking
            .student_assignment_submissions_enabled;
        return (
            <BasePage
                onPracticeInitialized={getAssignedSubmissions}
                title={gettext('Give feedback to 3 other students')}
                subtitle={gettext(
                    "Reflecting on other students' work is likely to increase your own understanding",
                )}
                renderRightButtons={this.renderRightButtons}
                pageType={PAGES.FEEDBACK_PAGE}
            >
                {areOrgAssignmentsDisabled && (
                    <AlertBanner
                        showCta={false}
                        title={gettext('Assignment feedback is disabled for your organization.')}
                        styleName="mb-md"
                    />
                )}
                {!submissionsLoaded && <Loader size="large" block={true} />}
                {submissionsLoaded && !assignedSubmissions.length && <NoSubmissionMessage />}
                {submissionsLoaded &&
                    assignedSubmissions.map((submission) => (
                        <div styleName="panel" key={submission.id} data-purpose="submission-panel">
                            <Submission submission={submission} />
                            {areOrgAssignmentsDisabled ? null : submission.peerFeedbacksAreLoaded ? (
                                submission.peerFeedbacks.map((feedback) => (
                                    <Feedback
                                        feedback={feedback}
                                        key={feedback.answer.id || 'new-feedback'}
                                        data-purpose="practice-feedback"
                                    />
                                ))
                            ) : (
                                <Loader size="large" block={true} />
                            )}
                        </div>
                    ))}
            </BasePage>
        );
    }
}
