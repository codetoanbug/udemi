import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Switch, Redirect, withRouter} from 'react-router-dom';

import AssignmentsRoute from 'assignments/assignments.react-component';
import PageTrackingRoute from 'base-components/router/page-tracking-route.react-component';
import FeaturedQuestionsRoute from 'featured-questions/featured-questions.react-component';
import MessagingRoute from 'messaging/new-ia/messaging.react-component';
import QuestionAnswerRoute from 'question-answer/question-answer.react-component';

import AnnouncementsRoute from './communication/announcements/announcements.react-component';

@withRouter
@observer
export default class Communications extends Component {
    static propTypes = {
        hasQAPermission: PropTypes.bool,
        isInstructorSendAnnouncementEnabled: PropTypes.bool,
        isUBOnlyDataPreviewEnabled: PropTypes.bool,
        isTaughtCoursesApiSlimVersionEnabled: PropTypes.bool,
        isInQAAITargetGroup: PropTypes.bool,
    };

    static defaultProps = {
        hasQAPermission: false,
        isInstructorSendAnnouncementEnabled: true,
        isUBOnlyDataPreviewEnabled: false,
        isTaughtCoursesApiSlimVersionEnabled: false,
        isInQAAITargetGroup: false,
    };

    baseUrl = '/communication';

    render() {
        /* eslint-disable react/jsx-no-bind */
        const {
            hasQAPermission,
            isInstructorSendAnnouncementEnabled,
            isUBOnlyDataPreviewEnabled,
            isTaughtCoursesApiSlimVersionEnabled,
            isInQAAITargetGroup,
        } = this.props;
        return (
            <Switch>
                <PageTrackingRoute
                    pageKey="instructor_communications_messages"
                    path={`${this.baseUrl}/messages/`}
                    render={() => <MessagingRoute baseUrl={`${this.baseUrl}/messages`} />}
                />
                <PageTrackingRoute
                    pageKey="instructor_communications_qa"
                    path={`${this.baseUrl}/qa/`}
                    render={() => (
                        <QuestionAnswerRoute
                            baseUrl={`${this.baseUrl}/qa`}
                            isUBOnlyDataPreviewEnabled={isUBOnlyDataPreviewEnabled}
                            isTaughtCoursesApiSlimVersionEnabled={
                                isTaughtCoursesApiSlimVersionEnabled
                            }
                            isInQAAITargetGroup={isInQAAITargetGroup}
                        />
                    )}
                />
                {hasQAPermission && (
                    <PageTrackingRoute
                        pageKey="instructor_communications_featuredquestions"
                        path={`${this.baseUrl}/featured_questions/`}
                        render={() => (
                            <FeaturedQuestionsRoute
                                baseUrl={`${this.baseUrl}/featured_questions`}
                                isUBOnlyDataPreviewEnabled={isUBOnlyDataPreviewEnabled}
                                isTaughtCoursesApiSlimVersionEnabled={
                                    isTaughtCoursesApiSlimVersionEnabled
                                }
                            />
                        )}
                    />
                )}
                <PageTrackingRoute
                    pageKey="instructor_communications_assignments"
                    path={`${this.baseUrl}/assignments/`}
                    render={() => (
                        <AssignmentsRoute
                            baseUrl={`${this.baseUrl}/assignments`}
                            isUBOnlyDataPreviewEnabled={isUBOnlyDataPreviewEnabled}
                            isTaughtCoursesApiSlimVersionEnabled={
                                isTaughtCoursesApiSlimVersionEnabled
                            }
                        />
                    )}
                />
                <PageTrackingRoute
                    pageKey="instructor_communications_announcements"
                    path={`${this.baseUrl}/announcements/`}
                    render={() => (
                        <AnnouncementsRoute
                            baseUrl={`${this.baseUrl}/announcements`}
                            isInstructorSendAnnouncementEnabled={
                                isInstructorSendAnnouncementEnabled
                            }
                            isUBOnlyDataPreviewEnabled={isUBOnlyDataPreviewEnabled}
                            isTaughtCoursesApiSlimVersionEnabled={
                                isTaughtCoursesApiSlimVersionEnabled
                            }
                        />
                    )}
                />
                <Redirect to={`${this.baseUrl}/qa`} />
            </Switch>
        );
        /* eslint-enable react/jsx-no-bind */
    }
}
