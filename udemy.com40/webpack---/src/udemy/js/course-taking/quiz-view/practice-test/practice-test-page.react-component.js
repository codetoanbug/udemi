import autobind from 'autobind-decorator';
import {computed} from 'mobx';
import {Provider, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Switch, withRouter} from 'react-router-dom';

import MemoizedBrowserRouter from 'base-components/router/memoized-browser-router.react-component';
import PageTrackingRoute from 'base-components/router/page-tracking-route.react-component';
import {getQueryParams} from 'utils/query-params';

import registers from '../../registry/registers';
import requires from '../../registry/requires';
import KeepRedirect from '../../utils/keep-redirect.react-component.js';
import {isPracticeTestExperimentEnabled} from '../utils';
import PracticeTestStore from './practice-test.mobx-store';
import QuestionPage from './question/question-page.react-component';
import {RevampedResultPage} from './results-revamp/revamped-result-page.react-component';
import DetailedResultPage from './results/detailed-result-page.react-component';
import ResultsPage from './results/results-page.react-component';
import StartPage from './start/start-page.react-component';

@withRouter
@requires('courseTakingStore', 'quizViewStore')
@registers('practiceTestStore')
@observer
export default class PracticeTestPage extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        quizViewStore: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.baseUrl = props.match.url.replace(/\/$/, '');
        this.basePath = this.props.match.path;
        this.practiceTestStore = new PracticeTestStore(
            this.props.courseTakingStore,
            this.props.quizViewStore,
            this.baseUrl,
        );
    }

    componentDidMount() {
        window.addEventListener('pagehide', this.handlePageHide);
    }

    componentWillUnmount() {
        window.removeEventListener('pagehide', this.pauseQuiz);
        this.pauseQuiz();
        this.practiceTestStore.setHistory(null);
    }

    @autobind
    handlePageHide() {
        this.pauseQuiz();
    }

    pauseQuiz() {
        // Always leave quiz in paused state.
        if (this.props.quizViewStore.attempt) {
            this.practiceTestStore.timer.pause();
            this.props.courseTakingStore.shouldResumeCurrentCurriculumItemForMobile = true;
        }
    }

    @autobind
    renderStartPage() {
        // Force the question page if the user is in the middle of an attempt.
        // In particular, we don't want the user to access the start page because the
        // backend doesn't allow creating a new attempt before completing the latest.
        // However, for instructor preview we make sure they always visit the start page first.
        const {courseTakingStore} = this.props;
        if (this.shouldShowInstructorStartPage) {
            return <StartPage />;
        }
        if (
            this.practiceTestStore.isCurrentAttemptCompleted &&
            !this.practiceTestStore.isStartingARetake
        ) {
            return <KeepRedirect keepAll={true} to={`${this.baseUrl}/results`} />;
        }
        return this.practiceTestStore.isTakingTest && !courseTakingStore.isUserInstructor ? (
            <KeepRedirect keepAll={true} to={`${this.baseUrl}/test`} />
        ) : (
            <StartPage />
        );
    }

    @computed
    get shouldShowInstructorStartPage() {
        const queryParams = getQueryParams(this.props.location);
        return (
            this.props.courseTakingStore.isUserInstructor &&
            queryParams.instructorPreviewMode &&
            !this.practiceTestStore.isStartPageLoaded
        );
    }

    @autobind
    renderQuestionPage() {
        if (this.shouldShowInstructorStartPage || !this.props.quizViewStore.attempt) {
            // Force the start page if the instructor is previewing the test,
            // or there's no quiz attempt.
            return <KeepRedirect keepAll={true} to={`${this.baseUrl}`} />;
        } else if (this.props.quizViewStore.attempt.completion_time) {
            // Prevent the user from accessing the question page if the latest attempt
            // is already completed. Note the user should be allowed to access the start page,
            // in order to retake the test.
            return <KeepRedirect keepAll={true} to={`${this.baseUrl}/results`} />;
        }
        return <QuestionPage />;
    }

    @autobind
    renderResultsPage() {
        if (this.shouldShowInstructorStartPage || !this.props.quizViewStore.attempt) {
            // Force the start page if the instructor is previewing the test,
            // or there's no quiz attempt.
            return <KeepRedirect keepAll={true} to={`${this.baseUrl}`} />;
        } else if (this.practiceTestStore.isTakingTest) {
            // Force the question page if the user is in the middle of an attempt.
            // In particular, we don't want the user to access the start page because the
            // backend doesn't allow creating a new attempt before completing the latest.
            return <KeepRedirect keepAll={true} to={`${this.baseUrl}/test`} />;
        }
        return <ResultsPage />;
    }

    @autobind
    renderDetailedResultPage() {
        if (this.shouldShowInstructorStartPage || !this.props.quizViewStore.attempt) {
            // Force the start page if the instructor is previewing the test,
            // or there's no quiz attempt.
            return <KeepRedirect keepAll={true} to={`${this.baseUrl}`} />;
        } else if (this.practiceTestStore.isTakingTest) {
            // Force the question page if the user is in the middle of an attempt.
            // In particular, we don't want the user to access the start page because the
            // backend doesn't allow creating a new attempt before completing the latest.
            return <KeepRedirect keepAll={true} to={`${this.baseUrl}/test`} />;
        }

        return isPracticeTestExperimentEnabled() ? <RevampedResultPage /> : <DetailedResultPage />;
    }

    @autobind
    setRouterRef(routerRef) {
        this.practiceTestStore.setHistory(routerRef ? routerRef.history : null);
    }

    render() {
        return (
            <Provider practiceTestStore={this.practiceTestStore}>
                <MemoizedBrowserRouter ref={this.setRouterRef}>
                    <Switch location={this.props.location}>
                        <PageTrackingRoute
                            pageKey="course_taking_quiz_start"
                            exact={true}
                            path={`${this.basePath}`}
                            render={this.renderStartPage}
                        />
                        <PageTrackingRoute
                            pageKey="course_taking_quiz_test"
                            exact={true}
                            path={`${this.basePath}/test`}
                            render={this.renderQuestionPage}
                        />
                        <PageTrackingRoute
                            pageKey="course_taking_quiz_results"
                            exact={true}
                            path={`${this.basePath}/results`}
                            render={this.renderResultsPage}
                        />
                        {!this.props.quizViewStore.quiz.isCpeFinalExam && (
                            <PageTrackingRoute
                                pageKey="course_taking_quiz_attempt_result"
                                exact={true}
                                path={`${this.basePath}/result/:attemptId(\\d+)`}
                                render={this.renderDetailedResultPage}
                            />
                        )}
                        <KeepRedirect keepAll={true} to={`${this.baseUrl}`} />
                    </Switch>
                </MemoizedBrowserRouter>
            </Provider>
        );
    }
}
