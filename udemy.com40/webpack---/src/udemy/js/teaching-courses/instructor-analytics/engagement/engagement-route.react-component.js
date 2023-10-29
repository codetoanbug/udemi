import {Tracker} from '@udemy/event-tracking';
import {useI18n, withI18n} from '@udemy/i18n';
import EditIcon from '@udemy/icons/dist/edit.ud-icon';
import InfoOutlineIcon from '@udemy/icons/dist/info-outline.ud-icon';
import NextIcon from '@udemy/icons/dist/next.ud-icon';
import {Image, Button} from '@udemy/react-core-components';
import {AlertBanner, Badge, Meter} from '@udemy/react-messaging-components';
import {Pagination} from '@udemy/react-navigation-components';
import {Accordion} from '@udemy/react-reveal-components';
import {Table} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {action, runInAction} from 'mobx';
import {PropTypes as mobxTypes, inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import SystemMessagePopover from 'base-components/ungraduated/popover/system-message-popover.react-component';
import curriculumItemIcon from 'course-landing-page/components/curriculum/curriculum-item-icon';
import {API_STATE} from 'instructor/constants';
import IAResponsiveHeader from 'instructor/layout/ia-responsive-header.react-component';
import {noop} from 'utils/noop';
import {formatNumber} from 'utils/numeral';
import qs from 'utils/query-params';
import SystemMessage from 'utils/ud-system-message';

import BrowseImage from '../../../instructor/assets/images/browse.png';
import FinanceImage from '../../../instructor/assets/images/finance.png';
import {
    ALL_COURSE_OPTION,
    DATE_RANGE,
    DATE_RANGE_VALUES,
    DEFAULT_DATA_SCOPE_FILTER,
    DEFAULT_DATE_FILTER,
    DATA_SCOPE_FILTERS,
    getStudentListUrl,
    COURSE_ENGAGEMENT_HEADER_TEXT_STATEMENTS,
    missingPermissionMessagePerformance,
} from '../constants';
import CourseMetricsTable from '../course-metrics-table.react-component';
import DateFilter from '../date-filter.react-component';
import {formatPercent, updateCourseFilter} from '../helpers';
import {
    ErrorState,
    NoPermissionCourse,
    NoPermissionInstructor,
    SearchState,
} from '../search-and-error-states.react-component';
import TableColumnHeader from '../table-column-header.react-component';
import EngagementChart from './engagement-chart.react-component';
import LectureHighlights from './lecture-highlights.react-component';
/* eslint-disable no-unused-vars,import/order */
import baseStyles from '../instructor-analytics.less';
import styles from './engagement-route.less';
import {
    PerformanceEngagementCourseSelectedEvent,
    PerformanceEngagementDateRangeFilterChangedEvent,
    PracticeInsightsPresented,
} from '../events';
import DataScopeFilter from '../data-scope-filter.react-component';
import IAMetricsHeaderItem from '../ia-metrics-header-item.react-component';
import InfoTooltip from '../info-tooltip.react-component';
import WrapWithText from 'base-components/ungraduated/text/wrap-with-text.react-component';
import {useHistory} from 'react-router-dom';
import {BarPercentageChart} from './bar-percentage-chart.react-component.tsx';
import {adjustCourseConsumptionDeviceBreakdownOrder} from './bar-percentage-chart-helpers';
import {WelcomeModal} from '../../../instructor/welcome-modal/welcome-modal.react-component';
import {ubOnlyInsightsWelcomeModalSteps} from '../welcome-modal-data';
import {PopoverTour} from '../../../instructor/popover-tour/popover-tour.react-component';
import {ubOnlyInsightsPopoverTourSteps} from '../popover-tour-steps';
import {Popover} from '@udemy/react-popup-components';
import {InProductGuidance} from './in-product-guidance/in-product-guidance.react-component';
/* eslint-enable no-unused-vars,import/order */

export const EngagementMetricsPanel = ({
    engagementMetrics,
    page,
    setPage,
    totalPages,
    sortBy,
    onSort,
    isUBOnlyDataPreviewEnabled,
}) => {
    const {gettext} = useI18n();
    const columns = [
        {
            title: gettext('Minutes taught'),
            data: 'minutesTaught',
            initialSortOrder: 'ascending',
            type: 'number',
        },
        {
            title: gettext('Active learners'),
            data: 'activeStudents',
            initialSortOrder: 'ascending',
            type: 'number',
        },
        {
            title: gettext('Minutes taught per active learner'),
            data: 'minutesTaughtPerActiveStudents',
            initialSortOrder: 'ascending',
            type: 'number',
        },
    ];
    const defaultPath = '';

    return (
        <div styleName="baseStyles.panel styles.engagement-metrics-panel">
            <CourseMetricsTable
                metrics={engagementMetrics}
                columns={columns}
                defaultPath={defaultPath}
                sortBy={sortBy}
                onSort={onSort}
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

EngagementMetricsPanel.propTypes = {
    engagementMetrics: mobxTypes.arrayOrObservableArray.isRequired,
    page: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired,
    totalPages: PropTypes.number.isRequired,
    sortBy: PropTypes.object.isRequired,
    onSort: PropTypes.func.isRequired,
    isUBOnlyDataPreviewEnabled: PropTypes.bool,
};

EngagementMetricsPanel.defaultProps = {
    isUBOnlyDataPreviewEnabled: false,
};

@inject('store')
@observer
class EngagementRoute extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        isEngagementDismissibleMessageEnabled: PropTypes.bool,
        isUBOnlyDataPreviewEnabled: PropTypes.bool,
        isDisplayInstructorAllTimeCourseEngagementDataEnabled: PropTypes.bool,
        isDisplayPracticeInsightsNewPageWithFunnelViewEnabled: PropTypes.bool,
        gettext: PropTypes.func.isRequired,
        ninterpolate: PropTypes.func.isRequired,
    };

    static defaultProps = {
        isEngagementDismissibleMessageEnabled: false,
        isUBOnlyDataPreviewEnabled: false,
        isDisplayInstructorAllTimeCourseEngagementDataEnabled: false,
        isDisplayPracticeInsightsNewPageWithFunnelViewEnabled: false,
    };

    constructor(props) {
        super(props);

        // we do not support all time for engagement, so we default the querystring to year if user trying to query all time
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        if (
            !this.props.isDisplayInstructorAllTimeCourseEngagementDataEnabled &&
            queryParams.date_filter === DATE_RANGE.ALL_TIME
        ) {
            queryParams.date_filter = DEFAULT_DATE_FILTER;
            this.props.history.push({
                pathname: this.props.location.pathname,
                search: qs.stringify(queryParams),
            });
        }

        SystemMessage.hasSeen(SystemMessage.ids.engagementDataDiscrepancy).then(
            action((response) => {
                this.props.store.engagementMetricsStore.showEngagementDataDiscrepancy = !response.data;
            }),
        );
        SystemMessage.hasSeen(SystemMessage.ids.courseEngagementAllTimeDataAlertBanner).then(
            action((response) => {
                this.props.store.engagementMetricsStore.showAllTimeDataAlertBanner = !response.data;
            }),
        );
        SystemMessage.hasSeen(
            SystemMessage.ids.inProductGuidanceForCodingExerciseInsightsSingle,
        ).then(
            action((response) => {
                this.props.store.engagementMetricsStore.showInProductGuidanceForCodingExerciseInsightsSingle = !response.data;
            }),
        );
        SystemMessage.hasSeen(SystemMessage.ids.inProductGuidanceForCodingExerciseInsightsAll).then(
            action((response) => {
                this.props.store.engagementMetricsStore.showInProductGuidanceForCodingExerciseInsightsAll = !response.data;
            }),
        );
        SystemMessage.hasSeen(SystemMessage.ids.inProductGuidanceForMoMYoYTrendInsights).then(
            action((response) => {
                this.props.store.engagementMetricsStore.showInProductGuidanceForMoMAndYoYTrendInsights = !response.data;
            }),
        );
        this.updateRoute(props.location);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.location.search !== this.props.location.search) {
            this.updateRoute(nextProps.location);
        }
    }

    updateRoute(location) {
        const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
        const isDateFilterInDateRange = DATE_RANGE_VALUES.includes(queryParams.date_filter);
        let willHistoryBeReplaced =
            !queryParams.date_filter || !queryParams.data_scope || !isDateFilterInDateRange;

        if (!this.props.isDisplayInstructorAllTimeCourseEngagementDataEnabled) {
            willHistoryBeReplaced =
                willHistoryBeReplaced || queryParams.date_filter === DATE_RANGE.ALL_TIME;

            if (
                !queryParams.date_filter ||
                !isDateFilterInDateRange ||
                queryParams.date_filter === DATE_RANGE.ALL_TIME
            ) {
                queryParams.date_filter = DEFAULT_DATE_FILTER;
            }
        } else if (!queryParams.date_filter || !isDateFilterInDateRange) {
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

        const dateFilter = queryParams.date_filter;
        const scopeFilter = this.getScopeFilter(queryParams);
        const courseId = queryParams.course_id;
        runInAction(() => {
            this.props.store.engagementMetricsStore.courseId = courseId;
        });
        this.props.store.engagementMetricsStore.getTopMetrics(courseId, dateFilter, scopeFilter);
        if (courseId) {
            this.props.store.engagementMetricsStore.getConsumptionMetrics(
                courseId,
                scopeFilter,
                dateFilter,
            );
        }
    }

    getScopeFilter(queryParams) {
        // this is a global variable
        return this.props.isUBOnlyDataPreviewEnabled
            ? queryParams.data_scope
            : DEFAULT_DATA_SCOPE_FILTER;
    }

    getShowDetailsUrlToRedirect = (quizId) => {
        let queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        queryParams = {
            course_id: queryParams.course_id,
            quiz_id: quizId,
            date_filter: queryParams.date_filter,
            data_scope: this.getScopeFilter(queryParams),
            has_ref: true,
        };
        return `/instructor/performance/practice-insights/?${qs.stringify(queryParams)}`;
    };

    renderDateFilterWithSystemMessagePopover() {
        const {gettext} = this.props;
        const dateRangeOptions = [DATE_RANGE.WEEK, DATE_RANGE.MONTH, DATE_RANGE.YEAR];
        if (this.props.isDisplayInstructorAllTimeCourseEngagementDataEnabled) {
            dateRangeOptions.push(DATE_RANGE.ALL_TIME);
        }

        let popoverPlacement = 'left';
        if (window.screen.width <= 820) {
            popoverPlacement = 'bottom-end';
        }

        return (
            <SystemMessagePopover
                systemMessageId="course_engagement_all_time_data_popover"
                placement={popoverPlacement}
                withArrow={true}
                trigger={
                    <div>
                        <DateFilter
                            dateRangeOptions={dateRangeOptions}
                            placement="bottom-start"
                            data-purpose="date-filter"
                            filterUpdated={(dateType) =>
                                this.publishPerformanceEngagementDateRangeFilterChangedEvent(
                                    dateType,
                                )
                            }
                        />
                    </div>
                }
            >
                <div styleName="styles.system-message-popover-header">
                    <Badge styleName="styles.system-message-popover-ub-badge">
                        {gettext('New')}
                    </Badge>
                    <b>{gettext('Historical data is here!')}</b>
                </div>
                <p>
                    {gettext(
                        'Choose “Last 12+ months” to view your learner engagement over multiple years.',
                    )}
                </p>
            </SystemMessagePopover>
        );
    }

    renderMetricsHeader() {
        const {gettext} = this.props;
        const dateRangeOptions = [DATE_RANGE.WEEK, DATE_RANGE.MONTH, DATE_RANGE.YEAR];
        if (this.props.isDisplayInstructorAllTimeCourseEngagementDataEnabled) {
            dateRangeOptions.push(DATE_RANGE.ALL_TIME);
        }

        return (
            <div>
                <div styleName="baseStyles.heading-without-top-margin">
                    <h2 className="ud-heading-lg">
                        {gettext('Minutes consumed by active learners')}
                    </h2>
                    {this.props.isDisplayInstructorAllTimeCourseEngagementDataEnabled ? (
                        this.renderDateFilterWithSystemMessagePopover()
                    ) : (
                        <DateFilter
                            dateRangeOptions={dateRangeOptions}
                            placement="bottom-start"
                            data-purpose="date-filter"
                            filterUpdated={(dateType) =>
                                this.publishPerformanceEngagementDateRangeFilterChangedEvent(
                                    dateType,
                                )
                            }
                        />
                    )}
                </div>
            </div>
        );
    }

    getIAMetricsHeaderItem(dataPurpose, headline, textStatement) {
        return (
            <IAMetricsHeaderItem
                data-purpose={dataPurpose}
                headline={headline}
                textStatement={textStatement}
            />
        );
    }

    renderGraph(courseId, isPracticeTestOnlyCourse) {
        const {gettext} = this.props;
        const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
        const scopeFilter = this.getScopeFilter(queryParams);
        const postfix = scopeFilter === DATA_SCOPE_FILTERS.UB ? ' Udemy Business' : '';
        const {topMetrics} = this.props.store.engagementMetricsStore;
        const minutesTaught =
            topMetrics.minutes_taught % 1 === 0
                ? formatNumber(topMetrics.minutes_taught)
                : formatNumber(topMetrics.minutes_taught.toFixed(2));
        let minutesTaughtHeadline = ninterpolate(
            '%s minute taught',
            '%s minutes taught',
            minutesTaught,
        );
        minutesTaughtHeadline += postfix;
        const minutesTaughtHeader = this.getIAMetricsHeaderItem(
            'minutes-taught-header',
            minutesTaughtHeadline,
            isPracticeTestOnlyCourse
                ? COURSE_ENGAGEMENT_HEADER_TEXT_STATEMENTS.practiceTestOnlyCourse.minutesTaught
                : COURSE_ENGAGEMENT_HEADER_TEXT_STATEMENTS.lectureCourses.minutesTaught,
        );
        const activeStudents =
            topMetrics.active_students % 1 === 0
                ? formatNumber(topMetrics.active_students)
                : formatNumber(topMetrics.active_students.toFixed(2));
        let activeStudentsHeadline = ninterpolate(
            '%s active learner',
            '%s active learners',
            activeStudents,
        );
        activeStudentsHeadline += postfix;
        const activeStudentsHeader = this.getIAMetricsHeaderItem(
            'active-students-header',
            activeStudentsHeadline,
            isPracticeTestOnlyCourse
                ? COURSE_ENGAGEMENT_HEADER_TEXT_STATEMENTS.practiceTestOnlyCourse.activeStudents
                : COURSE_ENGAGEMENT_HEADER_TEXT_STATEMENTS.lectureCourses.activeStudents,
        );

        return (
            <div styleName="baseStyles.chart-container baseStyles.panel">
                <div styleName="baseStyles.panel-header" data-purpose="engagement-chart-headline">
                    <WrapWithText
                        componentClass="h3"
                        className="ud-heading-md"
                        text={gettext('Minutes Taught')}
                    />
                </div>
                <div styleName="styles.top-stats-group">
                    {minutesTaughtHeader}
                    {activeStudentsHeader}
                </div>
                <EngagementChart
                    data={this.props.store.engagementMetricsStore.topMetrics}
                    scopeFilter={scopeFilter}
                />
                {!!courseId && (
                    <div styleName="styles.chart-footer">
                        <Button
                            udStyle="ghost"
                            componentClass="a"
                            href={getStudentListUrl(courseId)}
                            size="small"
                            typography="ud-text-md"
                        >
                            {gettext('Go to learner list')}
                            <NextIcon label={false} />
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    renderNoLectures() {
        const {gettext} = this.props;
        return <div styleName="styles.no-lectures">{gettext('No lectures in this section')}</div>;
    }

    getLectureTableMeterCell(lecture, dataScope) {
        const {gettext} = this.props;
        if (lecture.is_coding_exercise) {
            return (
                <div styleName="styles.meter-with-background">
                    <div styleName="styles.meter-info">
                        <p>
                            <b>{gettext('Success Ratio')}</b>
                            {`: ${formatPercent(lecture.engagement.avg_percent_watched)}`}
                        </p>
                        <Popover
                            canToggleOnHover={true}
                            placement="left"
                            detachFromTarget={true}
                            trigger={<InfoOutlineIcon label={false} />}
                        >
                            {gettext(
                                'The percentage of learners who submitted a passing solution out of all the learners who attempted this coding exercise (clicked "Run tests").',
                            )}
                        </Popover>
                    </div>
                    <Meter
                        aria-hidden={true}
                        value={lecture.engagement.avg_percent_watched}
                        min={0}
                        max={100}
                        label={gettext('%(percent)s%')}
                        styleName="styles.meter-teal"
                    />
                </div>
            );
        }
        if (!lecture.video_asset_id) {
            return (
                <div styleName="styles.table-cell-flex">
                    <p>{'--'}</p>
                </div>
            );
        }
        return (
            <>
                {formatPercent(lecture.engagement.avg_percent_watched)}
                <Meter
                    aria-hidden={true}
                    value={lecture.engagement.avg_percent_watched}
                    min={0}
                    max={100}
                    label={gettext('%(percent)s%')}
                    styleName={
                        dataScope && dataScope !== 'ub'
                            ? 'styles.meter-mustard'
                            : 'styles.meter-indigo'
                    }
                />
            </>
        );
    }

    renderLectureTable(section, dataScope) {
        const {gettext, ninterpolate} = this.props;
        return (
            <Table
                styleName="styles.lecture-table"
                padding="xs"
                noBackgroundColor={true}
                noBorder={true}
                columns={[
                    {
                        fieldName: 'lecture',
                        headerName: <TableColumnHeader minWidth={200} title={gettext('Lecture')} />,
                    },
                    {
                        fieldName: 'watched',
                        headerName: (
                            <TableColumnHeader
                                title={gettext('Viewed')}
                                tooltip={gettext(
                                    'This is the number of learners who’ve watched more than 15 seconds of a lecture.',
                                )}
                            />
                        ),
                    },
                    {
                        fieldName: 'dropped',
                        headerName: (
                            <TableColumnHeader
                                title={gettext('Dropped')}
                                tooltip={gettext(
                                    'This is the percentage of learners who started the lecture and then stopped watching within 15 seconds.',
                                )}
                            />
                        ),
                    },
                    {
                        fieldName: 'amountWatched',
                        headerName: (
                            <TableColumnHeader
                                title={gettext('Amount consumed')}
                                tooltip={gettext(
                                    'This is the amount of the lecture that learners, on average, completed watching.',
                                )}
                            />
                        ),
                    },
                ]}
                rows={section.lectures.map((lecture) => {
                    const LectureIcon = curriculumItemIcon(lecture.icon_class);
                    const isCodingExerciseItem =
                        lecture.item_type === 'quiz' && lecture.is_coding_exercise === true;
                    let identifierExpression = '';

                    if (isCodingExerciseItem) {
                        identifierExpression += `${gettext('Coding Exercise')} ${
                            lecture.object_index
                        }: ${lecture.title}`;
                    } else {
                        identifierExpression += `${lecture.object_index}. ${lecture.title}`;
                    }

                    return {
                        lecture: (
                            <div styleName="styles.lecture-details">
                                <div>
                                    {isCodingExerciseItem && (
                                        <Badge styleName="styles.ub-badge">{gettext('New')}</Badge>
                                    )}
                                    <LectureIcon label={false} styleName="styles.lecture-icon" />
                                    <span>{identifierExpression}</span>
                                    {lecture.video_asset_id && (
                                        <span
                                            className="ud-heading-xs"
                                            styleName="styles.lecture-content-summary"
                                        >
                                            {`(${lecture.content_summary})`}
                                        </span>
                                    )}
                                </div>
                                <div styleName="styles.coding-exercise-link">
                                    {/* isDisplayPracticeInsightsNewPageWithFunnelViewEnabled is added
                                     to make sure that show details link is enabled with beta2 scope */}
                                    {isCodingExerciseItem &&
                                        this.props
                                            .isDisplayPracticeInsightsNewPageWithFunnelViewEnabled && (
                                            <a
                                                href={this.getShowDetailsUrlToRedirect(lecture.id)}
                                                styleName="styles.show-details-group"
                                                onClick={this.publishPracticeInsightsPresentedEvent}
                                            >
                                                <div>
                                                    <p>{gettext('Show details')}</p>
                                                </div>
                                                <div styleName="styles.show-details-icon-wrapper">
                                                    <NextIcon
                                                        label={false}
                                                        styleName="styles.show-details-icon"
                                                    />
                                                </div>
                                            </a>
                                        )}
                                </div>
                            </div>
                        ),
                        watched: (
                            <div styleName="styles.table-cell-flex">
                                <p>
                                    {ninterpolate(
                                        '%s learner',
                                        '%s learners',
                                        formatNumber(lecture.engagement.watched_students),
                                    )}
                                </p>
                                {lecture.is_coding_exercise ? (
                                    <Popover
                                        canToggleOnHover={true}
                                        placement="top"
                                        detachFromTarget={true}
                                        trigger={<InfoOutlineIcon label={false} />}
                                    >
                                        {gettext(
                                            'Number of learners who opened this coding exercise.',
                                        )}
                                    </Popover>
                                ) : null}
                            </div>
                        ),
                        dropped: (
                            <div styleName="styles.table-cell-flex">
                                <p>{formatPercent(lecture.engagement.percent_skipped)}</p>
                                {lecture.is_coding_exercise ? (
                                    <Popover
                                        canToggleOnHover={true}
                                        placement="top"
                                        detachFromTarget={true}
                                        trigger={<InfoOutlineIcon label={false} />}
                                    >
                                        {gettext(
                                            'The percentage of learners who viewed this coding exercise but never clicked "Run tests."',
                                        )}
                                    </Popover>
                                ) : null}
                            </div>
                        ),
                        amountWatched: this.getLectureTableMeterCell(lecture, dataScope),
                    };
                })}
            />
        );
    }

    @autobind
    openAllSections() {
        this.props.store.engagementMetricsStore.openAllSections();
    }

    @autobind
    closeAllSections() {
        this.props.store.engagementMetricsStore.closeAllSections();
    }

    renderLectureBreakdown(dataScope) {
        const {gettext} = this.props;
        const {showEngagementBanner, topMetrics} = this.props.store.engagementMetricsStore;
        const anyPanelCollapsed = topMetrics.lectureMetrics.some((section) => !section.isExpanded);
        return (
            <div data-purpose="lecture-breakdown">
                <div styleName="baseStyles.heading">
                    <h2 className="ud-heading-lg">{gettext('Lecture details')}</h2>
                </div>
                {showEngagementBanner && (
                    <AlertBanner
                        styleName="styles.alert-banner-behavior-hint"
                        ctaText={gettext('Dismiss')}
                        dismissButtonProps={false}
                        onAction={() =>
                            SystemMessage.seen(SystemMessage.ids.engagementBehaviorHint)
                        }
                        title={gettext(
                            'Expect a decrease in active learners from your first lecture to your last. ' +
                                'This is normal for online courses.',
                        )}
                    />
                )}
                <div styleName="styles.toggle-all-lecture-metrics">
                    <Button
                        udStyle="ghost"
                        onClick={anyPanelCollapsed ? this.openAllSections : this.closeAllSections}
                    >
                        {anyPanelCollapsed ? gettext('Expand all') : gettext('Collapse all')}
                    </Button>
                </div>
                <Accordion size="medium" styleName="styles.lecture-metrics">
                    {topMetrics.lectureMetrics.map((section) => (
                        <div key={section.index}>
                            <Accordion.Panel
                                title={section.displayTitle}
                                expanded={section.isExpanded}
                                onToggle={section.toggle}
                            >
                                {section.lectures.length === 0
                                    ? this.renderNoLectures()
                                    : this.renderLectureTable(section, dataScope)}
                            </Accordion.Panel>
                        </div>
                    ))}
                </Accordion>
            </div>
        );
    }

    renderLectureHighlights(courseId) {
        const {gettext} = this.props;
        const {mostBookmarked, mostSkipped} = this.props.store.engagementMetricsStore.topMetrics;
        const link = `${this.props.store.courseManageBaseUrl}course/${courseId}/manage/curriculum`;
        return (
            <div>
                <div styleName="baseStyles.heading">
                    <h2 className="ud-heading-lg">{gettext('Lecture highlights')}</h2>
                    <Button
                        udStyle="secondary"
                        componentClass="a"
                        href={link}
                        target="_blank"
                        size="small"
                    >
                        <EditIcon label={false} />
                        {gettext('Edit course')}
                    </Button>
                </div>
                <LectureHighlights bookmarks={mostBookmarked} dropped={mostSkipped} />
            </div>
        );
    }

    renderContent() {
        const {gettext} = this.props;
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        const courseId = queryParams.course_id;
        const scopeFilter = this.getScopeFilter(queryParams);
        const {instructorStore} = this.props.store;
        const {_taughtCourses} = instructorStore;
        let isPracticeTestOnlyCourse = false;
        const isEligibleToViewAllTimeDataAlertBanner =
            queryParams.date_filter === DATE_RANGE.ALL_TIME &&
            this.props.store.engagementMetricsStore.showAllTimeDataAlertBanner;

        if (
            courseId &&
            _taughtCourses &&
            _taughtCourses.length > 0 &&
            _taughtCourses.filter((course) => course.id === parseInt(courseId, 10))[0]
                .is_practice_test_course
        ) {
            isPracticeTestOnlyCourse = true;
        }
        let content;
        if (!courseId) {
            const {
                activePageData,
                activePage,
                numPages,
                goToPage,
            } = this.props.store.engagementMetricsStore.allCourses;
            const {onSort, sortBy} = this.props.store.engagementMetricsStore;

            content = (
                <EngagementMetricsPanel
                    data-purpose="engagement-metrics"
                    engagementMetrics={activePageData}
                    page={activePage}
                    setPage={goToPage}
                    totalPages={numPages}
                    onSort={onSort}
                    sortBy={sortBy}
                    isUBOnlyDataPreviewEnabled={this.props.isUBOnlyDataPreviewEnabled}
                />
            );
        } else {
            const breakdownGroups = this.props.store.engagementMetricsStore.consumptionMetrics;
            const isBarPercentageChartVisible = breakdownGroups && breakdownGroups.length > 0;
            content = (
                <div>
                    {isBarPercentageChartVisible && (
                        <>
                            <SystemMessagePopover
                                trigger={<div></div>}
                                getTriggerRect={(currentRect) =>
                                    this.getBadgeRectForPopover(currentRect)
                                }
                                placement="right"
                                detachFromTarget={true}
                                systemMessageId={SystemMessage.ids.deviceBreakdownPopover}
                            >
                                <div>
                                    {gettext(
                                        'New: Device insights. Choose a specific course to see the breakdown of learner consumption happening mobile vs. desktop for that course.',
                                    )}
                                </div>
                            </SystemMessagePopover>
                            <BarPercentageChart
                                breakdownGroups={
                                    adjustCourseConsumptionDeviceBreakdownOrder(breakdownGroups) // This is for proper ordering of desktop type breakdown
                                }
                                colorPalette={scopeFilter}
                            />
                        </>
                    )}
                    {!isPracticeTestOnlyCourse && this.renderLectureHighlights(courseId)}
                    {!isPracticeTestOnlyCourse && this.renderLectureBreakdown(scopeFilter)}
                </div>
            );
        }

        return (
            <div>
                {this.renderMetricsHeader()}
                {isEligibleToViewAllTimeDataAlertBanner && (
                    <AlertBanner
                        data-purpose="all-time-dismissible-message"
                        styleName="styles.alert-banner-with-icon"
                        ctaText={gettext('Dismiss')}
                        dismissButtonProps={false}
                        onAction={this.dismissAllTimeDataAlertBanner}
                        title={gettext(
                            'In the “Last 12+ months” date range, the data displayed goes as far back as October 2020.',
                        )}
                    />
                )}
                {this.renderGraph(courseId, isPracticeTestOnlyCourse)}
                {content}
            </div>
        );
    }

    renderNoData() {
        const {gettext} = this.props;
        return (
            <div styleName="baseStyles.no-data">
                <h2>{gettext('No courses yet...')}</h2>
                <p styleName="baseStyles.no-data-subtitle">
                    {gettext(
                        'Once you publish your course, ' +
                            'come here to learn about your course engagement.',
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
        const {ninterpolate} = this.props;
        const noPermissionCourses = this.props.store.coursesWithoutPerformancePermission;
        if (noPermissionCourses.length > 0) {
            const title = ninterpolate(
                'You do not have access to "Course engagement" data for the following course:',
                'You do not have access to "Course engagement" data for the following courses:',
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
        const {gettext} = this.props;
        const title = gettext(
            'You do not have access to "Course engagement" data for this course.',
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
        this.publishPerformanceEngagementCourseSelectedEvent(courseId);
    }

    @autobind
    publishPerformanceEngagementDateRangeFilterChangedEvent(dateType) {
        Tracker.publishEvent(new PerformanceEngagementDateRangeFilterChangedEvent(dateType));
    }

    @autobind
    publishPerformanceEngagementCourseSelectedEvent(selectedCourseDropdownData) {
        let event;
        if (selectedCourseDropdownData !== null) {
            event = new PerformanceEngagementCourseSelectedEvent(
                selectedCourseDropdownData.toString(),
            );
        } else {
            event = new PerformanceEngagementCourseSelectedEvent(ALL_COURSE_OPTION);
        }
        Tracker.publishEvent(event);
    }

    @autobind
    publishPracticeInsightsPresentedEvent() {
        const uiRegion = 'performance_engagement_lecture_breakdown';
        Tracker.publishEvent(new PracticeInsightsPresented(uiRegion));
    }

    @autobind
    @action
    hideDismissibleIcon() {
        this.props.store.engagementMetricsStore.showEngagementDataDiscrepancy = false;
        SystemMessage.seen(SystemMessage.ids.engagementDataDiscrepancy);
    }

    @autobind
    @action
    hideDismissibleInProductGuidanceForCodingExerciseInsightsSingle() {
        this.props.store.engagementMetricsStore.showInProductGuidanceForCodingExerciseInsightsSingle = false;
        SystemMessage.seen(SystemMessage.ids.inProductGuidanceForCodingExerciseInsightsSingle);
    }

    @autobind
    @action
    hideDismissibleInProductGuidanceForMoMAndYoYTrendInsights() {
        this.props.store.engagementMetricsStore.showInProductGuidanceForMoMAndYoYTrendInsights = false;
        SystemMessage.seen(SystemMessage.ids.inProductGuidanceForMoMYoYTrendInsights);
    }

    @autobind
    @action
    hideDismissibleInProductGuidanceForCodingExerciseInsightsAll() {
        this.props.store.engagementMetricsStore.showInProductGuidanceForCodingExerciseInsightsAll = false;
        SystemMessage.seen(SystemMessage.ids.inProductGuidanceForCodingExerciseInsightsAll);
    }

    @autobind
    @action
    dismissAllTimeDataAlertBanner() {
        this.props.store.engagementMetricsStore.showAllTimeDataAlertBanner = false;
        SystemMessage.seen(SystemMessage.ids.courseEngagementAllTimeDataAlertBanner);
    }

    @autobind
    goBack() {
        this.props.history.goBack();
    }

    @autobind
    isCourseInUBCollectionNow() {
        const courseId = this.props.store.engagementMetricsStore.courseId;
        const taughtCourses = this.props.store.instructorStore._taughtCourses.filter(
            (course) => course.id === parseInt(courseId, 10),
        );
        if (taughtCourses && taughtCourses.length > 0) {
            return taughtCourses.at(0).is_in_any_ufb_content_collection;
        }
        return false;
    }

    renderNotInUBMessage() {
        const {gettext} = this.props;
        return (
            <div styleName={'styles.dismissible'} data-purpose="non-ub-collection-banner">
                <Image
                    id={'dismissible-icon'}
                    src={BrowseImage}
                    data-purpose="dismissible-image"
                    styleName={'styles.non-ub-message-icon'}
                />
                <AlertBanner
                    data-purpose="dismissible-message"
                    styleName="styles.alert-banner-with-icon"
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
    startPopoverTourWithRedirect(redirectLocation) {
        const {instructorStore} = this.props.store;
        instructorStore.startPopoverTour();
        if (redirectLocation) {
            this.props.history.replace(redirectLocation);
        }
    }

    getBadgeRectForPopover(currentRect) {
        const badge = document.querySelector('[class*="bar-percentage-chart--ub-badge"]');
        return badge ? badge.getBoundingClientRect() : currentRect.getBoundingClientRect();
    }

    render() {
        const {gettext} = this.props;
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        const courseId = parseInt(queryParams.course_id, 10);
        const dataScope = this.getScopeFilter(queryParams);
        const {instructorStore} = this.props.store;
        const hasCoursesToShow =
            instructorStore.publishedCourses.length > 0 ||
            instructorStore.unpublishedCourses.length > 0;

        const baseUBBanner =
            this.props.isUBOnlyDataPreviewEnabled &&
            !!this.props.store.engagementMetricsStore.courseId &&
            dataScope === DATA_SCOPE_FILTERS.UB;

        const allCourseDropdownData = hasCoursesToShow
            ? {
                  data: instructorStore._taughtCourses,
                  selectedId: courseId,
                  onCourseSelect: this.updateFilter,
                  disabled:
                      this.props.store.engagementMetricsStore.searchState === API_STATE.SEARCHING,
              }
            : {
                  data: [],
                  selectedId: null,
                  onCourseSelect: noop,
                  disabled: false,
              };

        // Coding exercise insights in product guidance related preparation
        const ceGuidanceTitle = gettext(
            'Coding exercise insights are available for a single course!',
        );
        const ceGuidanceDescriptionSingle = gettext(
            'Scroll down to the Lecture details to see the learner engagement to a Coding exercise.',
        );
        const ceGuidanceDescriptionAll = gettext(
            'Get started with selecting a course and then scroll down to the Lecture details to see the learner engagement to a Coding exercise.',
        );
        const ceGuidanceBadgeText = gettext('New');

        // MoM and YoY trend in tooltip
        const momYoYTrendTitle = gettext(
            "We've added trend insights to your Minutes Taught report!",
        );
        const momYoYTrendDescription = gettext(
            'Hover over the bars below to see how consumption from one month stacks up against consumption from the previous month, or from the same month a year earlier. Select the "Last 12 months" or "Last 12+ months" date range to check out your new insights.',
        );
        const momYoYTrendBadgeText = gettext('New');

        return (
            <div data-purpose="engagement-route">
                {instructorStore.taughtCoursesState === API_STATE.SEARCHING && <SearchState />}
                {instructorStore.taughtCoursesState === API_STATE.ERROR && <ErrorState />}
                {instructorStore.taughtCoursesState === API_STATE.DONE && (
                    <div>
                        <IAResponsiveHeader
                            title={gettext('Course engagement')}
                            allCourseDropdownData={allCourseDropdownData}
                            isUBOnlyDataPreviewEnabled={this.props.isUBOnlyDataPreviewEnabled}
                        />
                        <DataScopeFilter
                            data-purpose="data-scope-filter"
                            isEnabled={this.props.isUBOnlyDataPreviewEnabled}
                            courseId={courseId}
                            dataTourStep={'4'}
                        />
                        {this.props.store.engagementMetricsStore.searchState ===
                            API_STATE.SEARCHING && <SearchState />}
                        {this.props.store.engagementMetricsStore.searchState ===
                            API_STATE.NO_PERMISSION && this.renderNoPermissionCourse()}
                        {this.props.store.engagementMetricsStore.searchState ===
                            API_STATE.ERROR && <ErrorState />}
                        {this.props.store.engagementMetricsStore.searchState === API_STATE.DONE && (
                            <div>
                                {this.props.store.engagementMetricsStore
                                    .showInProductGuidanceForMoMAndYoYTrendInsights && (
                                    <InProductGuidance
                                        title={momYoYTrendTitle}
                                        description={momYoYTrendDescription}
                                        badgeText={momYoYTrendBadgeText}
                                        handleClick={
                                            this
                                                .hideDismissibleInProductGuidanceForMoMAndYoYTrendInsights
                                        }
                                        data-purpose="mom-yoy-trend-insights-in-product"
                                    />
                                )}
                                {!isNaN(courseId) &&
                                    this.props.store.instructorStore.hasCourseAPublishedCodingExercise(
                                        courseId,
                                    ) &&
                                    this.props.store.engagementMetricsStore
                                        .showInProductGuidanceForCodingExerciseInsightsSingle && (
                                        <InProductGuidance
                                            title={ceGuidanceTitle}
                                            description={ceGuidanceDescriptionSingle}
                                            badgeText={ceGuidanceBadgeText}
                                            handleClick={
                                                this
                                                    .hideDismissibleInProductGuidanceForCodingExerciseInsightsSingle
                                            }
                                            data-purpose="coding-exercise-insights-in-product-guidance-single"
                                        />
                                    )}
                                {isNaN(courseId) &&
                                    this.props.store.engagementMetricsStore
                                        .showInProductGuidanceForCodingExerciseInsightsAll && (
                                        <InProductGuidance
                                            title={ceGuidanceTitle}
                                            description={ceGuidanceDescriptionAll}
                                            badgeText={ceGuidanceBadgeText}
                                            handleClick={
                                                this
                                                    .hideDismissibleInProductGuidanceForCodingExerciseInsightsAll
                                            }
                                            data-purpose="coding-exercise-insights-in-product-guidance-all"
                                        />
                                    )}
                                {this.props.isEngagementDismissibleMessageEnabled &&
                                    this.props.store.engagementMetricsStore
                                        .showEngagementDataDiscrepancy && (
                                        <div styleName={'styles.dismissible'}>
                                            <Image
                                                id={'dismissible-icon'}
                                                src={FinanceImage}
                                                data-purpose="dismissible-image"
                                                styleName={'styles.dismissible-icon'}
                                            />
                                            <AlertBanner
                                                data-purpose="dismissible-message"
                                                styleName="styles.alert-banner-with-icon"
                                                ctaText={gettext('Dismiss')}
                                                dismissButtonProps={false}
                                                onAction={this.hideDismissibleIcon}
                                                title={gettext(
                                                    "We've updated the way we calculate course consumption to better reflect overall learner engagement.",
                                                )}
                                                body={gettext(
                                                    'This includes incorporating time spent engaging with on-platform practice activities like quizzes and coding exercises, and adjusting for factors such as watch speed and repeat viewing.',
                                                )}
                                            />
                                        </div>
                                    )}
                                {(baseUBBanner &&
                                    !this.isCourseInUBCollectionNow() &&
                                    !this.props.store.instructorStore.isCourseInUbEver(
                                        courseId,
                                    )) === true ? (
                                    this.renderNotInUBMessage()
                                ) : (
                                    <div>
                                        {baseUBBanner &&
                                            !this.isCourseInUBCollectionNow() &&
                                            this.props.store.instructorStore.isCourseInUbEver(
                                                courseId,
                                            ) && (
                                                <AlertBanner
                                                    data-purpose="formerly-in-ub-collection-message"
                                                    styleName="styles.alert-banner-behavior-hint"
                                                    ctaText={gettext('Dismiss')}
                                                    dismissButtonProps={false}
                                                    title={gettext(
                                                        'This course is not currently in the Udemy Business Collection.',
                                                    )}
                                                />
                                            )}
                                        {!courseId && this.renderNoPermissionInstructor()}
                                        {hasCoursesToShow
                                            ? this.renderContent()
                                            : this.renderNoData()}
                                        <WelcomeModal
                                            isOpen={instructorStore.isWelcomeModalOpen}
                                            onClose={() =>
                                                instructorStore.setIsWelcomeModalOpen(false)
                                            }
                                            onFinish={() =>
                                                this.startPopoverTourWithRedirect(
                                                    instructorStore.popoverTourStartingPoint,
                                                )
                                            }
                                            finishButtonText={gettext('See the new experience')}
                                            steps={ubOnlyInsightsWelcomeModalSteps}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                <PopoverTour
                    open={instructorStore.isPopoverTourOpen}
                    onClose={() => instructorStore.setIsPopoverTourOpen(false)}
                    steps={ubOnlyInsightsPopoverTourSteps}
                    maxInterval={instructorStore.popoverTourMaxInterval}
                    startingStep={3}
                />
            </div>
        );
    }
}

export default withI18n(EngagementRoute);
