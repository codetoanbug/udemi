import {Button} from '@udemy/react-core-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {Pagination} from '@udemy/react-navigation-components';
import autobind from 'autobind-decorator';
import {inject, observer, PropTypes as mobxTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {API_STATE} from 'instructor/constants';
import IAResponsiveHeader from 'instructor/layout/ia-responsive-header.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import {noop} from 'utils/noop';
import qs from 'utils/query-params';
import SystemMessage from 'utils/ud-system-message';

import AnalyticsChart from './analytics-chart.react-component';
import {
    DATE_RANGE,
    DATE_RANGE_VALUES,
    DEFAULT_DATE_FILTER,
    METRIC_SETTINGS,
    TRAFFIC_AND_CONVERSION_CHANNELS,
    visitorTooltip,
    conversionTooltip,
    missingPermissionMessagePerformance,
} from './constants';
import CourseMetricsTable from './course-metrics-table.react-component';
import DateFilter from './date-filter.react-component';
import DesktopTabChart from './desktop-tab-chart.react-component';
import {updateCourseFilter} from './helpers';
import MobileTabChart from './mobile-tab-chart.react-component';
import ReferralLinkTable from './referral-link-table.react-component';
import {
    ErrorState,
    NoPermissionCourse,
    NoPermissionInstructor,
    SearchState,
} from './search-and-error-states.react-component';
import TabChartContent from './tab-chart-content.react-component';
import TabChartTab from './tab-chart-tab.react-component';
/* eslint-disable no-unused-vars,import/order */
import baseStyles from './instructor-analytics.less';
import styles from './conversion-route.less';
import DataScopeFilter from './data-scope-filter.react-component';
/* eslint-enable no-unused-vars,import/order */

const ConversionMetricsPanel = ({
    conversionMetrics,
    daysUnprocessed,
    page,
    setPage,
    totalPages,
    isUBOnlyDataPreviewEnabled,
}) => {
    const columns = [
        {
            title: gettext('Landing page visitors'),
            tooltip: visitorTooltip(daysUnprocessed),
            minWidth: 135,
            data: 'visitorTotal',
        },
        {
            title: gettext('Conversion rate'),
            tooltip: conversionTooltip(daysUnprocessed),
            data: 'conversionTotal',
        },
    ];
    return (
        <div styleName="baseStyles.panel styles.conversion-metrics-panel">
            <CourseMetricsTable
                metrics={conversionMetrics}
                columns={columns}
                defaultPath={`/${METRIC_SETTINGS.VISITORS.path}`}
                isUBOnlyDataPreviewEnabled={isUBOnlyDataPreviewEnabled}
            />
            <Pagination
                pageCount={totalPages}
                activePage={page}
                onPageChange={setPage}
                styleName="baseStyles.pagination"
            />
        </div>
    );
};

ConversionMetricsPanel.propTypes = {
    conversionMetrics: mobxTypes.arrayOrObservableArray.isRequired,
    daysUnprocessed: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired,
    totalPages: PropTypes.number.isRequired,
    isUBOnlyDataPreviewEnabled: PropTypes.bool,
};

ConversionMetricsPanel.defaultProps = {
    isUBOnlyDataPreviewEnabled: false,
};

export const TabData = ({metricType, dataValue, tooltipFuncParams}) => (
    <TabChartTab
        primaryDataLabel={metricType.label}
        primaryData={dataValue}
        hasTooltip={metricType.hasTooltip}
        tooltipText={metricType.tooltipText}
        tooltipFunc={metricType.tooltipFunc}
        tooltipFuncParams={tooltipFuncParams}
        data-purpose="metric-tab"
    />
);

TabData.propTypes = {
    metricType: PropTypes.object.isRequired,
    dataValue: PropTypes.string.isRequired,
    tooltipFuncParams: PropTypes.array.isRequired,
};

@inject('store')
@observer
export default class ConversionRoute extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        isUBOnlyDataPreviewEnabled: PropTypes.bool,
    };

    static defaultProps = {
        isUBOnlyDataPreviewEnabled: false,
    };

    constructor(props) {
        super(props);

        // we do not support all time for conversion so we default the querystring to year if user trying to query all time
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        if (queryParams.date_filter === DATE_RANGE.ALL_TIME) {
            queryParams.date_filter = DEFAULT_DATE_FILTER;
            this.props.history.push({
                pathname: this.props.location.pathname,
                search: qs.stringify(queryParams),
            });
        }

        this.updateRoute(props.location);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const oldParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        const newParams = qs.parse(nextProps.location.search, {ignoreQueryPrefix: true});
        // Reset channel filter for referral link table if changing courses
        if (newParams.course_id !== oldParams.course_id) {
            this.updateRoute(nextProps.location, true);
        }
        if (newParams.date_filter !== oldParams.date_filter) {
            this.updateRoute(nextProps.location, false);
        }
        if (newParams.channel !== oldParams.channel) {
            this.props.store.conversionMetricsStore.referralLinks.setChannel(newParams.channel);
        }
    }

    updateRoute(location, resetChannel) {
        const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
        const isDateFilterInDateRange = DATE_RANGE_VALUES.includes(queryParams.date_filter);

        if (!queryParams.date_filter || !isDateFilterInDateRange) {
            queryParams.date_filter = DEFAULT_DATE_FILTER;
            this.props.history.replace({
                pathname: location.pathname,
                search: qs.stringify(queryParams),
            });
        }

        // Default channel filter to All Channels
        if (resetChannel || !queryParams.channel) {
            queryParams.channel = TRAFFIC_AND_CONVERSION_CHANNELS.ALL;
            this.props.history.push({
                pathname: this.props.location.pathname,
                search: qs.stringify(queryParams),
            });
        }

        const courseId = queryParams.course_id;
        const dateFilter = queryParams.date_filter;
        this.props.store.conversionMetricsStore.referralLinks.setChannel(queryParams.channel);
        this.props.store.conversionMetricsStore.getMetrics(courseId, dateFilter);
        if (courseId) {
            this.props.store.conversionMetricsStore.referralLinks.getMetrics(courseId, dateFilter);
        }
    }

    getRoutes() {
        const {courseMetrics} = this.props.store.conversionMetricsStore;
        return [
            {
                path: METRIC_SETTINGS.VISITORS.path,
                metrics: courseMetrics.visitorTrends,
                tab: (
                    <TabData
                        metricType={METRIC_SETTINGS.VISITORS}
                        dataValue={courseMetrics.visitorTotal}
                        tooltipFuncParams={[
                            this.props.store.conversionMetricsStore.daysUnprocessed,
                        ]}
                    />
                ),
                content: (
                    <TabChartContent
                        content={
                            <>
                                {this.props.store.conversionMetricsStore.showVisitorChartUnique && (
                                    <AlertBanner
                                        styleName="styles.alert-banner-in-tabs"
                                        ctaText={gettext('Dismiss')}
                                        dismissButtonProps={false}
                                        onAction={() =>
                                            SystemMessage.seen(SystemMessage.ids.visitorChartUnique)
                                        }
                                        title={gettext(
                                            'If someone comes to your landing page from one channel' +
                                                ' and again from a different channel,' +
                                                ' this chart attributes the visitor to both channels.',
                                        )}
                                    />
                                )}
                                <AnalyticsChart
                                    metricData={courseMetrics.visitorTrends}
                                    baseUrl={this.props.store.performanceBaseUrl}
                                />
                            </>
                        }
                    />
                ),
            },
            {
                path: METRIC_SETTINGS.CONVERSION.path,
                metrics: courseMetrics.conversionTrends,
                tab: (
                    <TabData
                        metricType={METRIC_SETTINGS.CONVERSION}
                        dataValue={courseMetrics.conversionTotal}
                        tooltipFuncParams={[
                            this.props.store.conversionMetricsStore.daysUnprocessed,
                        ]}
                    />
                ),
                content: (
                    <TabChartContent
                        content={
                            <AnalyticsChart
                                metricData={courseMetrics.conversionTrends}
                                baseUrl={this.props.store.performanceBaseUrl}
                            />
                        }
                    />
                ),
            },
        ];
    }

    renderCourseConversionData(queryParams) {
        const routes = this.getRoutes();
        return (
            <div data-purpose="metrics-content" styleName="baseStyles.chart-container">
                <h2 styleName="styles.description-text">
                    {gettext(
                        'Understand how people get to your landing page and whether they’re enrolling',
                    )}
                </h2>
                {this.props.store.breakpoints.isMdMax ? (
                    <MobileTabChart routes={routes} />
                ) : (
                    <DesktopTabChart
                        routes={routes}
                        redirect={METRIC_SETTINGS.VISITORS.path}
                        searchParams={qs.stringify(queryParams)}
                    />
                )}
            </div>
        );
    }

    renderBannerHint(courseId) {
        if (!this.props.store.conversionMetricsStore.showClpConversionHint) {
            return null;
        }
        return (
            <AlertBanner
                ctaText={gettext('Edit now')}
                actionButtonProps={{
                    componentClass: 'a',
                    href: `${this.props.store.courseManageBaseUrl}course/${courseId}/manage/basics`,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                }}
                onDismiss={() => SystemMessage.seen(SystemMessage.ids.clpConversionHint)}
                title={
                    <span
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'conversion-route:tip',
                            html: gettext(
                                '<strong>Tip:</strong>' +
                                    ' To get more traffic from students browsing courses on Udemy,' +
                                    ' be sure to have an eye-catching course image,' +
                                    ' a specific title,' +
                                    ' and relevant keywords in your subtitle.',
                            ),
                        })}
                    />
                }
            />
        );
    }

    renderContent() {
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        const courseId = queryParams.course_id;
        queryParams.date_filter = queryParams.date_filter
            ? queryParams.date_filter
            : DATE_RANGE.MONTH;
        if (!courseId) {
            const {
                activePageData,
                activePage,
                numPages,
                goToPage,
            } = this.props.store.conversionMetricsStore.allCourses;
            return (
                <ConversionMetricsPanel
                    data-purpose="conversion-metrics"
                    conversionMetrics={activePageData}
                    daysUnprocessed={
                        this.props.store.conversionMetricsStore.allCourses.daysUnprocessed
                    }
                    page={activePage}
                    setPage={goToPage}
                    totalPages={numPages}
                    isUBOnlyDataPreviewEnabled={this.props.isUBOnlyDataPreviewEnabled}
                />
            );
        }
        return (
            <div>
                {this.renderCourseConversionData(queryParams)}
                {this.renderBannerHint(courseId)}
                <ReferralLinkTable />
            </div>
        );
    }

    renderNoData() {
        return (
            <div styleName="baseStyles.no-data">
                <h2>{gettext('No courses yet...')}</h2>
                <p styleName="baseStyles.no-data-subtitle">
                    {gettext(
                        'Once you publish your course, ' +
                            'come here to learn about your traffic & conversion.',
                    )}
                </p>
                <Button
                    componentClass="a"
                    href="/instructor/courses/"
                    udStyle="secondary"
                    styleName="baseStyles.no-data-cta"
                >
                    {gettext('Go to Instructor Dashboard')}
                </Button>
            </div>
        );
    }

    renderNoPermissionInstructor() {
        const noPermissionCourses = this.props.store.coursesWithoutPerformancePermission;
        if (noPermissionCourses.length > 0) {
            const title = ninterpolate(
                'You do not have access to "Traffic & conversion" data for the following course:',
                'You do not have access to "Traffic & conversion" data for the following courses:',
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

    renderNoPermissionCourse() {
        const title = gettext(
            'You do not have access to "Traffic & conversion" data for this course.',
        );
        return (
            <NoPermissionCourse
                title={title}
                missingPermissionMessage={missingPermissionMessagePerformance}
            />
        );
    }

    @autobind
    updateFilter(courseId) {
        updateCourseFilter(this.props.location, this.props.history, courseId);
    }

    render() {
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        const showConversionMigrationBanner = this.props.store.conversionMetricsStore.allCourses
            .showConversionMigrationBanner;
        const courseId = queryParams.course_id;
        const {instructorStore} = this.props.store;
        const hasCoursesToShow =
            instructorStore.publishedCourses.length > 0 ||
            instructorStore.unpublishedCourses.length > 0;
        const allCourseDropdownData = hasCoursesToShow
            ? {
                  data: instructorStore._taughtCourses,
                  selectedId: parseInt(courseId, 10),
                  onCourseSelect: this.updateFilter,
                  disabled:
                      this.props.store.conversionMetricsStore.searchState === API_STATE.SEARCHING,
              }
            : {
                  data: [],
                  selectedId: null,
                  onCourseSelect: noop,
                  disabled: false,
              };
        const isSingleCourseSelected = !courseId;
        return (
            <div data-purpose="conversion-route">
                {instructorStore.taughtCoursesState === API_STATE.SEARCHING && <SearchState />}
                {instructorStore.taughtCoursesState === API_STATE.ERROR && <ErrorState />}
                {instructorStore.taughtCoursesState === API_STATE.DONE && (
                    <div>
                        <IAResponsiveHeader
                            title={gettext('Traffic & conversion')}
                            allCourseDropdownData={allCourseDropdownData}
                            isUBOnlyDataPreviewEnabled={this.props.isUBOnlyDataPreviewEnabled}
                        />
                        {showConversionMigrationBanner && (
                            <AlertBanner
                                styleName="styles.alert-banner-conversion-migration"
                                ctaText={gettext('Dismiss')}
                                dismissButtonProps={false}
                                onAction={() =>
                                    SystemMessage.seen(SystemMessage.ids.conversionMigrationHint)
                                }
                                title={gettext(
                                    "We've updated the way we count the number of unique people " +
                                        'visiting your courses to give you a more accurate ' +
                                        'understanding of your traffic & conversion.',
                                )}
                            />
                        )}

                        {this.props.store.conversionMetricsStore.searchState ===
                            API_STATE.SEARCHING && <SearchState />}
                        {this.props.store.conversionMetricsStore.searchState ===
                            API_STATE.NO_PERMISSION && this.renderNoPermissionCourse()}
                        {this.props.store.conversionMetricsStore.searchState ===
                            API_STATE.ERROR && <ErrorState />}
                        {this.props.store.conversionMetricsStore.searchState === API_STATE.DONE && (
                            <div>{!courseId && this.renderNoPermissionInstructor()}</div>
                        )}
                        <div styleName="styles.date-filter-panel">
                            {isSingleCourseSelected && (
                                <h2 styleName="styles.date-filter-panel-text">
                                    {gettext('To learn more, select a course')}
                                </h2>
                            )}
                            <div styleName="styles.date-filter-wrapper">
                                <DateFilter
                                    dateRangeOptions={[
                                        DATE_RANGE.WEEK,
                                        DATE_RANGE.MONTH,
                                        DATE_RANGE.YEAR,
                                    ]}
                                    placement="bottom-start"
                                />
                            </div>
                        </div>
                        {this.props.store.conversionMetricsStore.searchState === API_STATE.DONE && (
                            <div>
                                {hasCoursesToShow ? this.renderContent() : this.renderNoData()}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
