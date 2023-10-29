import autobind from 'autobind-decorator';
import {inject, observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter, Redirect, Switch} from 'react-router-dom';

import PageTrackingRoute from 'base-components/router/page-tracking-route.react-component';
import AnalyticsCommonStore from 'teaching-courses/instructor-analytics/analytics-common.mobx-store';
import ConversionRoute from 'teaching-courses/instructor-analytics/conversion-route.react-component';
import EngagementRoute from 'teaching-courses/instructor-analytics/engagement/engagement-route.react-component';
import OverviewRoute from 'teaching-courses/instructor-analytics/overview-route.react-component';
import {PracticeInsightsRoute} from 'teaching-courses/instructor-analytics/practice-insights/practice-insights-route.react-component';
import ReviewsRoute from 'teaching-courses/instructor-analytics/reviews-route.react-component';
import StudentsRoute from 'teaching-courses/instructor-analytics/students-route.react-component';
import qs from 'utils/query-params';

import {DATA_SCOPE_FILTERS} from '../teaching-courses/instructor-analytics/constants';
import {PracticeInsightsStore} from '../teaching-courses/instructor-analytics/practice-insights/practice-insights.mobx-store';

@inject('instructorStore')
@withRouter
@observer
export default class Performance extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        instructorStore: PropTypes.object.isRequired,
        performanceBaseUrl: PropTypes.string.isRequired,
        courseManageBaseUrl: PropTypes.string.isRequired,
        performanceEnabled: PropTypes.bool.isRequired,
        isUBOnlyDataPreviewEnabled: PropTypes.bool,
        isEngagementDismissibleMessageEnabled: PropTypes.bool,
        isTaughtCoursesApiSlimVersionEnabled: PropTypes.bool,
        isUBInsightsProductTourEnabled: PropTypes.bool,
        isDisplayInstructorAllTimeCourseEngagementDataEnabled: PropTypes.bool,
        isDisplayPracticeInsightsNewPageWithFunnelViewEnabled: PropTypes.bool,
    };

    static defaultProps = {
        isUBOnlyDataPreviewEnabled: false,
        isEngagementDismissibleMessageEnabled: false,
        isTaughtCoursesApiSlimVersionEnabled: false,
        isUBInsightsProductTourEnabled: false,
        isDisplayInstructorAllTimeCourseEngagementDataEnabled: false,
        isDisplayPracticeInsightsNewPageWithFunnelViewEnabled: false,
    };

    constructor(props) {
        super(props);
        this.store = new AnalyticsCommonStore(
            props.instructorStore,
            props.performanceBaseUrl,
            props.courseManageBaseUrl,
            props.isDisplayPracticeInsightsNewPageWithFunnelViewEnabled,
        );
        this.store.setUpMQLs();
        this.practiceInsightsStore = new PracticeInsightsStore();
    }

    componentDidMount() {
        this.props.isTaughtCoursesApiSlimVersionEnabled
            ? this.props.instructorStore.loadTaughtCoursesSlim()
            : this.props.instructorStore.loadTaughtCourses();
        const isReadyToOpenWelcomeModal =
            this.props.isUBOnlyDataPreviewEnabled && this.props.isUBInsightsProductTourEnabled;
        if (isReadyToOpenWelcomeModal) {
            this.props.instructorStore.loadInitialWelcomeModalStatus();
            this.props.instructorStore.isReadyToOpenWelcomeModal = true;
        }
    }

    componentWillUnmount() {
        this.store.tearDownMQLs();
    }

    @autobind
    getRouteWithProtectedDataScope(routeComponent, relativeURL) {
        if (!relativeURL) {
            return routeComponent;
        }
        return <Redirect to={relativeURL} />;
    }

    @autobind
    getProtectedRouteWithRedirect(routeComponent, condition) {
        if (condition) {
            return routeComponent;
        }
        return <Redirect to="/performance/overview/revenue/?date_filter=year" />;
    }

    render() {
        const {
            performanceEnabled,
            instructorStore,
            location,
            isDisplayPracticeInsightsNewPageWithFunnelViewEnabled,
        } = this.props;
        const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
        const isDataScopeUb = queryParams.data_scope === DATA_SCOPE_FILTERS.UB;
        const courseId = parseInt(queryParams.course_id, 10);

        let relativeURL = null;
        let isUbCourse = false;
        if (courseId && instructorStore._taughtCourses) {
            isUbCourse = instructorStore.isCourseInUbEver(courseId);

            if (!isUbCourse && isDataScopeUb) {
                const replacedSearch = location.search.replace('data_scope=ub', 'data_scope=all');
                relativeURL = `${location.pathname}${replacedSearch}`;
            }
        }

        const redirect = performanceEnabled
            ? '/performance/overview/revenue/?date_filter=year'
            : '/performance/engagement/?date_filter=year';
        return (
            <Provider store={this.store}>
                <Switch>
                    {performanceEnabled && (
                        <PageTrackingRoute
                            pageKey="instructor_performance_overview"
                            path="/performance/overview/"
                            render={(props) =>
                                this.getRouteWithProtectedDataScope(
                                    <OverviewRoute
                                        {...props}
                                        isCourseInUbEver={isUbCourse}
                                        isUBOnlyDataPreviewEnabled={
                                            this.props.isUBOnlyDataPreviewEnabled
                                        }
                                    />,
                                    relativeURL,
                                )
                            }
                        />
                    )}
                    {performanceEnabled && (
                        <PageTrackingRoute
                            exact={true}
                            pageKey="instructor_performance_students"
                            path="/performance/students/"
                            render={(props) =>
                                this.getRouteWithProtectedDataScope(
                                    <StudentsRoute
                                        {...props}
                                        isUBOnlyDataPreviewEnabled={
                                            this.props.isUBOnlyDataPreviewEnabled
                                        }
                                    />,
                                    relativeURL,
                                )
                            }
                        />
                    )}
                    <PageTrackingRoute
                        exact={true}
                        pageKey="instructor_performance_reviews"
                        path="/performance/reviews/"
                        component={(props) =>
                            this.getRouteWithProtectedDataScope(
                                <ReviewsRoute
                                    {...props}
                                    isUBOnlyDataPreviewEnabled={
                                        this.props.isUBOnlyDataPreviewEnabled
                                    }
                                />,
                                relativeURL,
                            )
                        }
                    />
                    {performanceEnabled && (
                        <PageTrackingRoute
                            pageKey="instructor_performance_conversion"
                            path="/performance/conversion/"
                            render={(props) => (
                                <ConversionRoute
                                    {...props}
                                    isUBOnlyDataPreviewEnabled={
                                        this.props.isUBOnlyDataPreviewEnabled
                                    }
                                />
                            )}
                        />
                    )}
                    <PageTrackingRoute
                        exact={true}
                        pageKey="instructor_performance_engagement"
                        path="/performance/engagement/"
                        render={(props) =>
                            this.getRouteWithProtectedDataScope(
                                <EngagementRoute
                                    {...props}
                                    isEngagementDismissibleMessageEnabled={
                                        this.props.isEngagementDismissibleMessageEnabled
                                    }
                                    isUBOnlyDataPreviewEnabled={
                                        this.props.isUBOnlyDataPreviewEnabled
                                    }
                                    isDisplayInstructorAllTimeCourseEngagementDataEnabled={
                                        this.props
                                            .isDisplayInstructorAllTimeCourseEngagementDataEnabled
                                    }
                                    isDisplayPracticeInsightsNewPageWithFunnelViewEnabled={
                                        this.props
                                            .isDisplayPracticeInsightsNewPageWithFunnelViewEnabled
                                    }
                                />,
                                relativeURL,
                            )
                        }
                    />
                    <PageTrackingRoute
                        exact={true}
                        pageKey="instructor_performance_practice_insights"
                        path="/performance/practice-insights/"
                        render={(props) =>
                            this.getProtectedRouteWithRedirect(
                                <PracticeInsightsRoute
                                    {...props}
                                    practiceInsightsStore={this.practiceInsightsStore}
                                    isUBOnlyDataPreviewEnabled={
                                        this.props.isUBOnlyDataPreviewEnabled
                                    }
                                    instructorStore={this.props.instructorStore}
                                />,
                                isDisplayPracticeInsightsNewPageWithFunnelViewEnabled,
                            )
                        }
                    />

                    <Redirect to={redirect} />
                </Switch>
            </Provider>
        );
    }
}
