import {Tracker} from '@udemy/event-tracking';
import NextIcon from '@udemy/icons/dist/next.ud-icon';
import {Image, Button} from '@udemy/react-core-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {API_STATE} from 'instructor/constants';
import IAResponsiveHeader from 'instructor/layout/ia-responsive-header.react-component';
import qs from 'utils/query-params';
import Raven from 'utils/ud-raven';

import BrowseImage from '../../instructor/assets/images/browse.png';
import {PopoverTour} from '../../instructor/popover-tour/popover-tour.react-component';
import {WelcomeModal} from '../../instructor/welcome-modal/welcome-modal.react-component';
import MessageContainerExclamationImage from '../instructor-analytics/assets/images/message-container-exclamation.png';
import AnalyticsChart from './analytics-chart.react-component';
import {
    ALL_COURSE_OPTION,
    DATA_SCOPE_FILTERS as DATA_SCOPE_FILTER,
    DATA_SCOPE_FILTERS,
    DATE_RANGE,
    DEFAULT_DATA_SCOPE_FILTER,
    DEFAULT_DATE_FILTER,
    METRIC_SETTINGS,
    missingPermissionMessagePerformance,
} from './constants';
import DataScopeFilter from './data-scope-filter.react-component';
import DesktopTabChart from './desktop-tab-chart.react-component';
import {InstructorUBOnlyOverviewPageViewEvent} from './events';
import {updateCourseFilter} from './helpers';
import MobileTabChart from './mobile-tab-chart.react-component';
import {ubOnlyInsightsPopoverTourSteps} from './popover-tour-steps';
import {
    ErrorState,
    NoPermissionCourse,
    NoPermissionInstructor,
    SearchState,
} from './search-and-error-states.react-component';
import TabChartTab from './tab-chart-tab.react-component';
import './instructor-analytics.less';
import {ubOnlyInsightsWelcomeModalSteps} from './welcome-modal-data';

@inject('store')
@observer
export default class OverviewRoute extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        isUBOnlyDataPreviewEnabled: PropTypes.bool,
        isCourseInUbEver: PropTypes.bool,
    };

    static defaultProps = {
        isUBOnlyDataPreviewEnabled: false,
        isCourseInUbEver: false,
    };

    constructor(props) {
        super(props);
        this.updateRoute(props.location);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.location.search !== this.props.location.search) {
            this.updateRoute(nextProps.location, nextProps.isCourseInUbEver);
        }
    }

    updateRoute(location, isCourseInUbEver) {
        const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});

        const willHistoryBeReplaced = !queryParams.date_filter || !queryParams.data_scope;

        if (!queryParams.date_filter) {
            queryParams.date_filter = DEFAULT_DATE_FILTER;
        }

        if (!queryParams.data_scope) {
            queryParams.data_scope = DEFAULT_DATA_SCOPE_FILTER;
        }

        if (willHistoryBeReplaced) {
            this.props.history.replace({
                pathname: location.pathname,
                search: qs.stringify(queryParams),
            });
        }

        const courseId = queryParams.course_id;
        if (courseId && isNaN(courseId)) {
            Raven.captureException(new Error(`Invalid Course ID: ${courseId}`));
        }
        const dataScope = this.getDataScopeFilter(queryParams);
        const dateFilter = queryParams.date_filter;
        this.getOverviewMetrics(courseId, dataScope, dateFilter, isCourseInUbEver);
    }

    getOverviewMetrics(
        courseId,
        dataScope = DEFAULT_DATA_SCOPE_FILTER,
        dateFilter,
        isCourseInUbEver,
    ) {
        if (dataScope === DATA_SCOPE_FILTERS.UB) {
            const courseDropdownSelection = courseId || ALL_COURSE_OPTION;
            Tracker.publishEvent(
                new InstructorUBOnlyOverviewPageViewEvent(
                    dateFilter,
                    courseDropdownSelection.toString(),
                ),
            );
        }

        this.props.store.overviewStore.getRevenueMetrics(courseId, dataScope, isCourseInUbEver);
        this.props.store.overviewStore.getEnrollmentMetrics(courseId, dataScope, dateFilter);
        this.props.store.overviewStore.getRatingMetrics(courseId, dataScope);
    }

    getDataScopeFilter(queryParams) {
        const isDataScopeUb =
            this.props.isUBOnlyDataPreviewEnabled &&
            queryParams.data_scope === DATA_SCOPE_FILTERS.UB;
        return isDataScopeUb ? DATA_SCOPE_FILTERS.UB : DEFAULT_DATA_SCOPE_FILTER;
    }

    getRouteCustomMessage(metricType, dataScope, dateFilter) {
        return metricType === METRIC_SETTINGS.RATING &&
            dataScope === DATA_SCOPE_FILTER.UB &&
            dateFilter === DATE_RANGE.ALL_TIME ? (
            <div styleName="message-container" data-purpose="last-12-plus-months-message">
                <div className="ud-text-sm">
                    <Image
                        src={MessageContainerExclamationImage}
                        styleName="message-container-icon"
                    />
                    {gettext(
                        'In the "Last 12+ months" date range, the data displayed goes as far back as 2018.',
                    )}
                </div>
            </div>
        ) : (
            <></>
        );
    }

    getRoutes() {
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        const isCourse = !!queryParams.course_id;
        const dataScope = this.getDataScopeFilter(queryParams);
        const dateFilter = queryParams.date_filter;
        const routes = [
            {
                path: METRIC_SETTINGS.REVENUE.path,
                metrics: this.props.store.overviewStore.revenueMetrics,
            },
            {
                path: METRIC_SETTINGS.ENROLLMENT.path,
                metrics: this.props.store.overviewStore.enrollmentMetrics,
            },
            {
                path: METRIC_SETTINGS.RATING.path,
                metrics: this.props.store.overviewStore.ratingMetrics,
            },
        ];
        routes.forEach((route) => {
            const metricData = route.metrics;
            const metricType = metricData.metricType;
            const currentMonth = metricData.formattedCurrentMonth;
            const tooltipText =
                isCourse && metricType.courseTooltipText
                    ? metricType.courseTooltipText
                    : metricType.instructorTooltipText;
            const label =
                metricType === METRIC_SETTINGS.RATING
                    ? !queryParams.course_id
                        ? metricType.instructorLabel
                        : metricType.courseLabel
                    : metricType.label;
            route.tab = (
                <TabChartTab
                    primaryDataLabel={label}
                    primaryData={metricData.formattedTotal}
                    secondaryData={metricType.thisMonthText(currentMonth)}
                    hasTooltip={metricType.hasTooltip}
                    tooltipText={tooltipText}
                    data-purpose="metric-tab"
                    key={label}
                />
            );
            route.message = this.getRouteCustomMessage(metricType, dataScope, dateFilter);
            route.content = (
                <AnalyticsChart
                    metricData={metricData}
                    baseUrl={this.props.store.performanceBaseUrl}
                    data-purpose="analytics-chart"
                    dataScope={this.getDataScopeFilter(queryParams)}
                />
            );
        });
        return routes;
    }

    renderMetrics() {
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        queryParams.date_filter = queryParams.date_filter
            ? queryParams.date_filter
            : DATE_RANGE.YEAR;
        const routes = this.getRoutes();
        return (
            <div data-purpose="metrics-content" styleName="chart-container">
                <h2>{gettext('Get top insights about your performance')}</h2>
                {this.props.store.breakpoints.isMdMax ? (
                    <MobileTabChart routes={routes} />
                ) : (
                    <DesktopTabChart
                        routes={routes}
                        redirect={METRIC_SETTINGS.REVENUE.path}
                        searchParams={qs.stringify(queryParams)}
                    />
                )}
            </div>
        );
    }

    @autobind
    updateFilter(courseId) {
        updateCourseFilter(this.props.location, this.props.history, courseId);
    }

    @autobind
    goBack() {
        this.props.history.goBack();
    }

    renderNotInUBMessage() {
        return (
            <div styleName={'dismissible'} data-purpose="non-ub-collection-banner">
                <Image
                    id={'dismissible-icon'}
                    src={BrowseImage}
                    data-purpose="dismissible-image"
                    styleName={'non-ub-message-icon'}
                />
                <AlertBanner
                    data-purpose="dismissible-message"
                    styleName="alert-banner-with-icon"
                    showIcon={false}
                    ctaText={gettext('Go back')}
                    dismissButtonProps={false}
                    onAction={this.goBack}
                    title={gettext(
                        "The course you've selected is not in the Udemy Business course collection.",
                    )}
                    body=""
                />
            </div>
        );
    }

    @autobind
    isCourseInUBCollectionNow(courseId) {
        const {instructorStore} = this.props.store;
        const taughtCourses = instructorStore._taughtCourses || [];
        const selectedCourse = taughtCourses.find((c) => c.id === parseInt(courseId, 10));
        return selectedCourse ? !!selectedCourse.is_in_any_ufb_content_collection : false;
    }

    @autobind
    hasCourseId(courseId) {
        const {instructorStore} = this.props.store;
        const taughtCourses = instructorStore._taughtCourses || [];
        const selectedCourse = taughtCourses.find((c) => c.id === parseInt(courseId, 10));
        return selectedCourse ? !!selectedCourse.id : false;
    }

    @autobind
    ubInsightsBannersToBeDisplayed() {
        const {instructorStore} = this.props.store;
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        const dataScope = this.getDataScopeFilter(queryParams);
        const courseId = parseInt(queryParams.course_id, 10);

        let renderNonUbBanner = false;
        let renderFormerlyInUbCollectionBanner = false;
        let isCourseInUBNowAndFeatureEnabled = false;

        if (queryParams.course_id) {
            isCourseInUBNowAndFeatureEnabled =
                this.props.isUBOnlyDataPreviewEnabled &&
                this.hasCourseId(courseId) &&
                dataScope === DATA_SCOPE_FILTER.UB &&
                !this.isCourseInUBCollectionNow(courseId);

            renderNonUbBanner =
                isCourseInUBNowAndFeatureEnabled && !instructorStore.isCourseInUbEver(courseId);

            renderFormerlyInUbCollectionBanner =
                isCourseInUBNowAndFeatureEnabled && instructorStore.isCourseInUbEver(courseId);
        }
        return {renderNonUbBanner, renderFormerlyInUbCollectionBanner};
    }

    @autobind
    startPopoverTourWithRedirect(redirectLocation) {
        const {instructorStore} = this.props.store;
        instructorStore.startPopoverTour();
        if (redirectLocation) {
            this.props.history.replace(redirectLocation);
        }
    }

    renderWithState(state, successComponent = null) {
        switch (state) {
            case API_STATE.SEARCHING:
                return <SearchState />;
            case API_STATE.ERROR:
                return <ErrorState />;
            case API_STATE.DONE:
                return successComponent();
            default:
                return null;
        }
    }

    @autobind
    renderParent() {
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        const courseId = parseInt(queryParams.course_id, 10);
        const {instructorStore, overviewStore, numberOfCoursesWithPermission} = this.props.store;
        const {isUBOnlyDataPreviewEnabled} = this.props;

        let courseHasPermission = true;
        if (courseId) {
            courseHasPermission = this.props.store.hasPerformancePermission(courseId);
        }
        return (
            <div>
                <IAResponsiveHeader
                    title={gettext('Overview')}
                    allCourseDropdownData={{
                        data: instructorStore._taughtCourses,
                        selectedId: parseInt(queryParams.course_id, 10),
                        onCourseSelect: this.updateFilter,
                        disabled: overviewStore.metricSearchState === API_STATE.SEARCHING,
                    }}
                    isUBOnlyDataPreviewEnabled={isUBOnlyDataPreviewEnabled}
                />
                <DataScopeFilter
                    data-purpose="data-scope-filter"
                    isEnabled={isUBOnlyDataPreviewEnabled}
                    courseId={courseId}
                    dataTourStep={'1'}
                />
                {!courseId && this.renderNoPermissionInstructor()}
                {courseHasPermission
                    ? numberOfCoursesWithPermission > 0
                        ? this.renderWithState(overviewStore.metricSearchState, this.renderChild)
                        : this.renderRevenueReportLink()
                    : this.renderNoPermissionCourse()}
                <WelcomeModal
                    isOpen={instructorStore.isWelcomeModalOpen}
                    onClose={() => instructorStore.setIsWelcomeModalOpen(false)}
                    onFinish={() =>
                        this.startPopoverTourWithRedirect(instructorStore.popoverTourStartingPoint)
                    }
                    finishButtonText={gettext('See the new experience')}
                    steps={ubOnlyInsightsWelcomeModalSteps}
                />
            </div>
        );
    }

    renderRevenueReportLink() {
        return (
            <div data-purpose="revenue-report-link">
                <Button
                    udStyle="ghost"
                    componentClass="a"
                    href={'/revenue-report'}
                    typography="ud-text-md"
                >
                    {'Revenue Report'}
                    <NextIcon label={false} />
                </Button>
            </div>
        );
    }

    renderNoPermissionCourse() {
        const title = gettext('You do not have access to "Overview" data for this course.');
        return (
            <NoPermissionCourse
                title={title}
                missingPermissionMessage={missingPermissionMessagePerformance}
            />
        );
    }

    renderNoPermissionInstructor() {
        const noPermissionCourses = this.props.store.coursesWithoutPerformancePermission;
        if (noPermissionCourses.length > 0) {
            const title = ninterpolate(
                'You do not have access to "Overview" data for the following course:',
                'You do not have access to "Overview" data for the following courses:',
                noPermissionCourses.length,
            );
            return (
                <NoPermissionInstructor
                    title={title}
                    noPermissionCourses={noPermissionCourses}
                    missingPermissionMessage={missingPermissionMessagePerformance}
                />
            );
        }
        return null;
    }

    @autobind
    renderChild() {
        const {
            renderNonUbBanner,
            renderFormerlyInUbCollectionBanner,
        } = this.ubInsightsBannersToBeDisplayed();
        return (
            <>
                {renderNonUbBanner === true ? (
                    this.renderNotInUBMessage()
                ) : (
                    <div data-purpose="metric-container">
                        {renderFormerlyInUbCollectionBanner === true &&
                            this.renderNotInUBCurrentlyBanner()}
                        {this.renderMetrics()}
                    </div>
                )}
            </>
        );
    }

    renderNotInUBCurrentlyBanner() {
        return (
            <AlertBanner
                data-purpose="formerly-in-ub-collection-message"
                styleName="alert-banner-behavior-hint"
                ctaText={gettext('Dismiss')}
                dismissButtonProps={false}
                title={gettext('This course is not currently in the Udemy Business Collection.')}
            />
        );
    }

    render() {
        const {instructorStore} = this.props.store;
        const {taughtCoursesState} = instructorStore;

        return (
            <div>
                {this.renderWithState(taughtCoursesState, this.renderParent)}
                <PopoverTour
                    open={instructorStore.isPopoverTourOpen}
                    onClose={() => instructorStore.setIsPopoverTourOpen(false)}
                    onRedirect={(redirectUrl) => this.props.history.replace(redirectUrl)}
                    steps={ubOnlyInsightsPopoverTourSteps}
                    maxInterval={instructorStore.popoverTourMaxInterval}
                    startingStep={0}
                />
            </div>
        );
    }
}
