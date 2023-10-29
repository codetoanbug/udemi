import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import {Switch, Redirect, withRouter} from 'react-router-dom';

import PageTrackingRoute from 'base-components/router/page-tracking-route.react-component';

import registers from '../registry/registers';
import requires from '../registry/requires';
import FeedbackPage from './feedback-page.react-component';
import IntroductionPage from './introduction-page.react-component';
import PracticeViewStore from './practice-view.mobx-store';
import SolutionPage from './solution-page.react-component';
import StartPage from './start-page.react-component';
import SubmissionPage from './submission-page.react-component';
import SummaryDetailPage from './summary-detail-page.react-component';
import SummaryPage from './summary-page.react-component';

@withRouter
@requires('courseTakingStore')
@registers('practiceViewStore')
@observer
export default class PracticeView extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.baseUrl = props.match.url;
        this.practiceViewStore = new PracticeViewStore(props.courseTakingStore, this.baseUrl);
    }

    componentDidMount() {
        this.practiceViewStore.loadPractice();
    }

    render() {
        const basePath = this.props.match.path;
        return (
            <Switch location={this.props.location}>
                <PageTrackingRoute
                    pageKey="course_taking_practice"
                    exact={true}
                    path={`${basePath}`}
                    component={StartPage}
                />
                <PageTrackingRoute
                    pageKey="course_taking_practice_introduction"
                    exact={true}
                    path={`${basePath}/introduction`}
                    component={IntroductionPage}
                />
                <PageTrackingRoute
                    pageKey="course_taking_practice_submission"
                    exact={true}
                    path={`${basePath}/submission`}
                    component={SubmissionPage}
                />
                <PageTrackingRoute
                    pageKey="course_taking_practice_instructor_solution"
                    exact={true}
                    path={`${basePath}/instructor-solution`}
                    component={SolutionPage}
                />
                <PageTrackingRoute
                    pageKey="course_taking_practice_feedback"
                    exact={true}
                    path={`${basePath}/give-feedback`}
                    component={FeedbackPage}
                />
                <PageTrackingRoute
                    pageKey="course_taking_practice_summary"
                    exact={true}
                    path={`${basePath}/summary`}
                    component={SummaryPage}
                />
                <PageTrackingRoute
                    pageKey="course_taking_practice_summary_detail"
                    exact={true}
                    path={`${basePath}/summary/:submissionId/feedback/:feedbackId`}
                    component={SummaryDetailPage}
                />
                <Redirect to={`${basePath}`} />
            </Switch>
        );
    }
}
