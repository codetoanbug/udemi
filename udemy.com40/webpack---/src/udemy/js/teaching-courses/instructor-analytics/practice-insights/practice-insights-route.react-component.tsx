import {Tracker} from '@udemy/event-tracking';
import {useI18n, useFormatNumber} from '@udemy/i18n';
import './practice-insights-string-tokens';
import CollapseIcon from '@udemy/icons/dist/collapse.ud-icon';
import EditIcon from '@udemy/icons/dist/edit.ud-icon';
import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import NextIcon from '@udemy/icons/dist/next.ud-icon';
import {Button} from '@udemy/react-core-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {TableRow} from '@udemy/react-structure-components';
import {TableColumn} from '@udemy/react-structure-components/dist/@types/table/table.react-component';
import {runInAction} from 'mobx';
import {observer} from 'mobx-react';
import qs from 'qs';
import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';

import udLink from 'utils/ud-link';

import Tabs, {Tab} from '../../../base-components/tabs/tabs.react-component';
import {QUIZ_TYPES} from '../../../course-taking/curriculum/constants';
import {API_STATE} from '../../../instructor/constants';
import IAResponsiveHeader from '../../../instructor/layout/ia-responsive-header.react-component';
import {noop} from '../../../utils/noop';
import NoInsightImage from '../assets/images/no-insight.png';
import {
    DATA_SCOPE_FILTERS,
    DEFAULT_DATA_SCOPE_FILTER,
    missingPermissionMessagePerformance,
} from '../constants';
import {DateSpanFilter} from '../date-span-filter/date-span-filter.react-component';
import {DateSpan} from '../date-span-filter/types';
import EngagementChart from '../engagement/engagement-chart.react-component';
import {QuizMetricsFunnelGroup} from '../engagement/quiz-metrics-funnel-group/quiz-metrics-funnel-group.react-component';
import {EditCodingExerciseSelected, PracticeInsightsFiltered} from '../events';
import {formatPercent} from '../helpers';
import baseStyles from '../instructor-analytics.less';
import {MetricTable} from '../metric-table/metric-table.react-component';
import {QuizFilter} from '../quiz-filter/quiz-filter.react-component';
import {QuizMeta} from '../quiz-filter/types';
import {
    ErrorState,
    NoPermissionCourse,
    SearchState,
} from '../search-and-error-states.react-component';
import TableColumnHeader from '../table-column-header.react-component';
import {GenericMessage} from './generic-message.react-component';
import {
    dateSpans,
    DEFAULT_DATE_SPAN,
    getDataColorsByDataScope,
    QUIZ_TYPE_CODING_EXERCISE,
    getDateSpanFromValue,
} from './helpers';
import styles from './practice-insights.less';
import {PracticeInsightsStore} from './practice-insights.mobx-store';
import {InstructorStore, DataColors, TaughtCourse} from './types';

interface PracticeInsightsRouteProps {
    isUBOnlyDataPreviewEnabled: boolean;
    instructorStore: InstructorStore;
    practiceInsightsStore: PracticeInsightsStore;
}
export const PracticeInsightsRoute = observer(
    // eslint-disable-next-line max-statements
    ({
        isUBOnlyDataPreviewEnabled,
        instructorStore,
        practiceInsightsStore,
    }: PracticeInsightsRouteProps) => {
        const [isHovering, setIsHovering] = useState(false);
        const {gettext, ninterpolate} = useI18n();
        const {formatNumber} = useFormatNumber();
        const location = useLocation();
        const history = useHistory();

        const hasCoursesToShow =
            instructorStore.publishedCourses.length > 0 ||
            instructorStore.unpublishedCourses.length > 0;

        const allCourseDropdownData = hasCoursesToShow
            ? {
                  data: filterCoursesHavingAtLeastOneCodingExercise(),
                  selectedId: practiceInsightsStore.courseId,
                  onCourseSelect: onCourseSelected,
                  disabled: false,
              }
            : {
                  data: [],
                  selectedId: null,
                  onCourseSelect: noop,
                  disabled: false,
              };

        const dataColors: DataColors = getDataColorsByDataScope(practiceInsightsStore.dataScope);

        function onCourseSelected(courseId: number) {
            runInAction(() => {
                practiceInsightsStore.courseId = courseId;
                if (
                    !isEligibleToViewDataScopeFilter(
                        isUBOnlyDataPreviewEnabled,
                        practiceInsightsStore.courseId,
                    )
                ) {
                    practiceInsightsStore.dataScope = DATA_SCOPE_FILTERS.ALL;
                }
                publishPracticeInsightsFilteredEvent();
            });
        }

        function onTabChanged(tabId: unknown) {
            runInAction(() => {
                practiceInsightsStore.dataScope = tabId as string;
            });
            publishPracticeInsightsFilteredEvent();
        }

        function filterCoursesHavingAtLeastOneCodingExercise() {
            if (!instructorStore._taughtCourses) {
                return [];
            }
            return instructorStore._taughtCourses.filter(
                (course: TaughtCourse) =>
                    course.has_course_a_published_coding_exercise && course.is_published,
            );
        }

        function getFirstCourse(): TaughtCourse {
            if (practiceInsightsStore.isRedirectedFromEngagement) {
                const taughtCourse = instructorStore._taughtCourses.find(
                    (course: TaughtCourse) => course.id === practiceInsightsStore.courseId,
                ) as TaughtCourse;
                return taughtCourse;
            }
            return filterCoursesHavingAtLeastOneCodingExercise()[0];
        }

        function getFirstQuiz(): QuizMeta | null {
            if (practiceInsightsStore.isRedirectedFromEngagement) {
                const quizMeta = practiceInsightsStore.quizzesOfTheCourse.find(
                    (quiz: QuizMeta) => quiz.id === practiceInsightsStore.selectedQuiz?.id,
                ) as QuizMeta;
                return quizMeta;
            }
            return practiceInsightsStore.quizzesOfTheCourse.length > 0
                ? practiceInsightsStore.quizzesOfTheCourse[0]
                : null;
        }

        const isEligibleToViewDataScopeFilter = (isEnabled: boolean, courseId: number | null) => {
            if (!isEnabled) {
                return false;
            }
            if (!isNaN(courseId as number)) {
                const isCourseInUbEver = instructorStore.isCourseInUbEver(courseId as number);
                if (!isCourseInUbEver) {
                    return false;
                }
            }
            return true;
        };

        useEffect(
            (() => {
                let queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
                if (
                    queryParams.course_id &&
                    queryParams.quiz_id &&
                    queryParams.date_filter &&
                    queryParams.data_scope &&
                    queryParams.has_ref &&
                    queryParams.has_ref === 'true'
                ) {
                    runInAction(() => {
                        practiceInsightsStore.isRedirectedFromEngagement = true;
                        practiceInsightsStore.courseId = Number(queryParams.course_id);
                        practiceInsightsStore.selectedDate = getDateSpanFromValue(
                            queryParams.date_filter as string,
                        );
                        practiceInsightsStore.dataScope = queryParams.data_scope as string;
                        practiceInsightsStore.selectedQuiz = {
                            type: '',
                            id: Number(queryParams.quiz_id),
                            title: '',
                        };
                    });
                }
                if (Object.keys(queryParams).length) {
                    queryParams = {};
                    history.replace({
                        pathname: location.pathname,
                        search: qs.stringify(queryParams),
                    });
                }
                /*
                The section below represents the default state of the page rendering where no
                redirection, etc. takes place. In other words, the instructor should browse the
                very first course and quiz in the lists for default data scope (ALL) and default
                date span.
                 */
                if (!practiceInsightsStore.isRedirectedFromEngagement) {
                    runInAction(() => {
                        practiceInsightsStore.dataScope = DEFAULT_DATA_SCOPE_FILTER;
                        practiceInsightsStore.selectedDate = DEFAULT_DATE_SPAN;
                    });
                }
            }) as VoidFunction,
            [],
        );

        useEffect(
            (() => {
                if (instructorStore._taughtCourses) {
                    const coursesHavingAtLeastOneCodingExercise = filterCoursesHavingAtLeastOneCodingExercise();
                    if (coursesHavingAtLeastOneCodingExercise.length === 0) {
                        runInAction(() => {
                            practiceInsightsStore.quizzesOfTheCourseSearchState = API_STATE.DONE;
                            practiceInsightsStore.quizMetricsSearchState = API_STATE.DONE;
                            practiceInsightsStore.quizConsumptionMetricsSearchState =
                                API_STATE.DONE;
                        });
                    } else {
                        runInAction(() => {
                            practiceInsightsStore.courseId = getFirstCourse().id;
                        });
                    }
                }
            }) as VoidFunction,
            [instructorStore._taughtCourses],
        );

        useEffect(
            (async () => {
                if (practiceInsightsStore.courseId) {
                    await practiceInsightsStore.fetchQuizzesOfACourse(
                        String(practiceInsightsStore.courseId),
                        QUIZ_TYPE_CODING_EXERCISE,
                    );
                    runInAction(() => {
                        practiceInsightsStore.selectedQuiz = getFirstQuiz();
                    });
                }
            }) as VoidFunction,
            [practiceInsightsStore.courseId],
        );

        useEffect(
            (async () => {
                runInAction(async () => {
                    if (
                        practiceInsightsStore.selectedQuiz &&
                        practiceInsightsStore.quizzesOfTheCourseSearchState === API_STATE.DONE
                    ) {
                        await practiceInsightsStore.getQuizMetricsOfAQuiz(
                            practiceInsightsStore.selectedQuiz?.id,
                            practiceInsightsStore.courseId,
                        );
                        await practiceInsightsStore.getEngagementChartMetrics(
                            practiceInsightsStore.selectedQuiz?.id,
                            practiceInsightsStore.courseId,
                            QUIZ_TYPES.CODING_EXERCISE,
                        );
                    }
                });
            }) as VoidFunction,
            [
                practiceInsightsStore.selectedQuiz,
                practiceInsightsStore.dataScope,
                practiceInsightsStore.selectedDate,
            ],
        );

        function publishPracticeInsightsFilteredEvent() {
            Tracker.publishEvent(
                new PracticeInsightsFiltered(
                    practiceInsightsStore.courseId,
                    practiceInsightsStore.selectedQuiz?.id,
                    practiceInsightsStore.dataScope,
                    practiceInsightsStore.selectedDate.value,
                ),
            );
        }

        function publishEditCodingExerciseSelectedEvent() {
            Tracker.publishEvent(new EditCodingExerciseSelected());
        }

        const toggleQuizFilter = (quiz: QuizMeta) => {
            runInAction(() => {
                practiceInsightsStore.selectedQuiz = quiz;
            });
            publishPracticeInsightsFilteredEvent();
        };

        const toggleDateFilter = (date: DateSpan) => {
            runInAction(() => {
                practiceInsightsStore.selectedDate = date;
            });
            publishPracticeInsightsFilteredEvent();
        };

        const getTargetExerciseEditLink = (courseId: string, quizId: string) => {
            return `/course/${courseId}/manage/coding-exercise/?quizId=${quizId}`;
        };

        function renderIfThereIsAQuiz() {
            if (practiceInsightsStore.courseId && !practiceInsightsStore.hasAnyLearnerViewedQuiz) {
                return renderAnyUBLearnerDidNotViewQuizContent();
            }
            if (practiceInsightsStore.hasAtLeastOneQuiz) {
                return renderContent();
            }
            return renderNoDataContent();
        }

        function renderGenericMessage(
            image: string,
            title: string,
            messageRows: (string | JSX.Element)[],
        ) {
            return <GenericMessage image={image} title={title} messageRows={messageRows} />;
        }

        function renderAnyUBLearnerDidNotViewQuizContent() {
            const title = gettext('No data available');
            const messages = [
                gettext('There is no learner engagement to report for this time'),
                gettext('period. Please change the date filter or come back'),
                gettext('later to see if there are any insights.'),
            ];
            return renderGenericMessage(NoInsightImage, title, messages);
        }

        function renderNoDataContent() {
            const title = gettext("Oops! It looks like you don't have any coding exercises.");
            const messages = [
                gettext(
                    'Coding exercises give learners hands-on practice with the technical topics you',
                ),
                gettext(
                    'teach. When you create some, you’ll see related learner engagement data show',
                ),
                <>
                    {gettext('up on this page (more practice types coming soon!). Check out ')}
                    <a href={udLink.toSupportLink('how_to_create_coding_exercise', false)}>
                        {gettext('these instructions')}
                    </a>
                </>,
                gettext('to get started with your first coding exercise.'),
            ];
            return renderGenericMessage(NoInsightImage, title, messages);
        }

        function renderFormerlyInUBCollectionMessage() {
            return (
                <AlertBanner
                    data-purpose="formerly-in-ub-collection-message"
                    styleName="styles.alert-banner-behavior-hint"
                    showCta={false}
                    dismissButtonProps={false}
                    title={gettext(
                        "The course you've selected is not in the Udemy Business course collection anymore.",
                    )}
                />
            );
        }

        function isCourseInUbEver(courseId: number | null) {
            const result = instructorStore._taughtCourses.find(
                (course) => course.id === courseId && course.is_course_in_ub_ever,
            );
            return result !== undefined;
        }

        function isCourseInUBCollectionNow(courseId: number | null) {
            const taughtCourses = instructorStore._taughtCourses.filter(
                (course) => course.id === parseInt(String(courseId), 10),
            );
            if (taughtCourses && taughtCourses.length > 0) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                return taughtCourses.at(0).is_in_any_ufb_content_collection;
            }
            return false;
        }

        const getMetricTableColumnHeaderIcon = (fieldName: string) => {
            const isTarget = fieldName === practiceInsightsStore.activeSortKeyOfMetricTable;
            const isMouseOver =
                fieldName === practiceInsightsStore.hoveredColumnKeyOfMetricTable && isHovering;
            if (isTarget) {
                if (practiceInsightsStore.sortOrderDesc) {
                    return <ExpandIcon label={false} />;
                }
                return <CollapseIcon label={false} />;
            }
            if (!isMouseOver) {
                return <CollapseIcon label={false} style={{opacity: 0}} />;
            }
            return <CollapseIcon label={false} />;
        };

        const onTableColumnHeaderHover = (fieldName: string) => {
            setIsHovering(true);
            practiceInsightsStore.setHoveredColumnKeyOfMetricTable(fieldName);
        };

        const onTableColumnHeaderOut = (fieldName: string) => {
            setIsHovering(false);
            practiceInsightsStore.setHoveredColumnKeyOfMetricTable(fieldName);
        };

        const metricTableColumns: TableColumn[] = [
            {
                fieldName: 'quiz',
                headerName: (
                    <TableColumnHeader
                        minWidth={400}
                        title={gettext('Coding exercise')}
                        tooltip={undefined}
                    />
                ),
            },
            {
                fieldName: 'viewed',
                headerName: (
                    <div
                        styleName="styles.table-column-header"
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                            practiceInsightsStore.sortQuizTableMetrics('viewed_learners')
                        }
                        onKeyDown={() =>
                            practiceInsightsStore.sortQuizTableMetrics('viewed_learners')
                        }
                        onMouseOver={() => onTableColumnHeaderHover('viewed_learners')}
                        onMouseLeave={() => onTableColumnHeaderOut('viewed_learners')}
                        onFocus={noop}
                    >
                        <TableColumnHeader
                            minWidth={1}
                            title={gettext('Viewed')}
                            tooltip={gettext('Number of learners who viewed this coding exercise')}
                        />
                        {getMetricTableColumnHeaderIcon('viewed_learners')}
                    </div>
                ),
            },
            {
                fieldName: 'runTest',
                headerName: (
                    <div
                        styleName="styles.table-column-header"
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                            practiceInsightsStore.sortQuizTableMetrics('attempted_learners')
                        }
                        onKeyDown={() =>
                            practiceInsightsStore.sortQuizTableMetrics('attempted_learners')
                        }
                        onMouseOver={() => onTableColumnHeaderHover('attempted_learners')}
                        onMouseLeave={() => onTableColumnHeaderOut('attempted_learners')}
                        onFocus={noop}
                    >
                        <TableColumnHeader
                            minWidth={1}
                            title={gettext('Ran Test')}
                            tooltip={gettext(
                                'Number of learners who opened this coding exercise and clicked "Run tests"',
                            )}
                        />
                        {getMetricTableColumnHeaderIcon('attempted_learners')}
                    </div>
                ),
            },
            {
                fieldName: 'completed',
                headerName: (
                    <div
                        styleName="styles.table-column-header"
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                            practiceInsightsStore.sortQuizTableMetrics('successful_learners')
                        }
                        onKeyDown={() =>
                            practiceInsightsStore.sortQuizTableMetrics('successful_learners')
                        }
                        onMouseOver={() => onTableColumnHeaderHover('successful_learners')}
                        onMouseLeave={() => onTableColumnHeaderOut('successful_learners')}
                        onFocus={noop}
                    >
                        <TableColumnHeader
                            minWidth={1}
                            title={gettext('Completed')}
                            tooltip={gettext(
                                'Number of the learners opened this coding exercise and completed successfully',
                            )}
                        />
                        {getMetricTableColumnHeaderIcon('successful_learners')}
                    </div>
                ),
            },
            {
                fieldName: 'detailsLink',
                headerName: <TableColumnHeader minWidth={1} title="" tooltip={undefined} />,
            },
        ];

        function buildMetricTableRows() {
            const quizTableMetrics = practiceInsightsStore.paginatedMetricTableData;
            const rows: TableRow[] = [];
            quizTableMetrics.forEach((rowMetric) => {
                rows.push({
                    quiz: (
                        <div>
                            <p>{rowMetric.quiz_name}</p>
                        </div>
                    ),
                    viewed: (
                        <div>
                            <p>
                                {ninterpolate(
                                    '%(count)s learner',
                                    '%(count)s learners',
                                    rowMetric.viewed_learners,
                                    {
                                        count: formatNumber(rowMetric.viewed_learners),
                                    },
                                )}
                            </p>
                        </div>
                    ),
                    runTest: (
                        <div>
                            <p>{formatPercent(rowMetric.attempted_learners)}</p>
                        </div>
                    ),
                    completed: (
                        <div>
                            <p>{formatPercent(rowMetric.successful_learners)}</p>
                        </div>
                    ),
                    detailsLink: (
                        <div styleName={'styles.show-details-cell'}>
                            <Button
                                udStyle="link"
                                styleName={'styles.show-details-button'}
                                onClick={() => {
                                    runInAction(() => {
                                        practiceInsightsStore.selectedQuiz = {
                                            id: rowMetric.quiz_id,
                                            title: rowMetric.quiz_name,
                                            type: QUIZ_TYPE_CODING_EXERCISE,
                                        } as QuizMeta;
                                        window.scrollTo({
                                            top: 0,
                                            behavior: 'smooth',
                                        });
                                    });
                                }}
                            >
                                {gettext('Show details')}
                                <NextIcon label={false} styleName="styles.show-details-icon" />
                            </Button>
                        </div>
                    ),
                });
            });
            return rows;
        }

        function renderHeader() {
            const badgeColorClass = 'badge';
            const badgeColorText = gettext('New');
            return (
                <IAResponsiveHeader
                    title={gettext('Practice insights')}
                    allCourseDropdownData={allCourseDropdownData}
                    isUBOnlyDataPreviewEnabled={isUBOnlyDataPreviewEnabled}
                    includeAllCourses={false}
                    badgeColorClass={badgeColorClass}
                    badgeColorText={badgeColorText}
                />
            );
        }

        function renderAllOrUbTabs() {
            return (
                <>
                    {isEligibleToViewDataScopeFilter(
                        isUBOnlyDataPreviewEnabled,
                        practiceInsightsStore.courseId,
                    ) && (
                        <Tabs
                            activeTabId={practiceInsightsStore.dataScope}
                            data-purpose="data-scope-filter-container"
                            onSelect={onTabChanged}
                        >
                            <Tab id={DATA_SCOPE_FILTERS.ALL} title={gettext('All')}></Tab>
                            <Tab id={DATA_SCOPE_FILTERS.UB} title={gettext('Udemy Business')}></Tab>
                        </Tabs>
                    )}
                </>
            );
        }

        function renderQuizAndDateSpanFilters() {
            return (
                practiceInsightsStore.courseId && (
                    <>
                        <div className={styles['horizontal-selector-group']}>
                            <QuizFilter
                                quizzes={practiceInsightsStore.quizzesOfTheCourse}
                                selectedQuiz={practiceInsightsStore.selectedQuiz}
                                handleOnClick={toggleQuizFilter}
                            />
                            <DateSpanFilter
                                handleOnClick={toggleDateFilter}
                                selectedDate={practiceInsightsStore.selectedDate}
                                dateSpans={dateSpans}
                            />
                        </div>
                    </>
                )
            );
        }

        function renderFunnelWithHeader() {
            return (
                <>
                    <div className={baseStyles['heading-without-top-margin']}>
                        <h2 className="ud-heading-lg">{gettext('Performance funnel')}</h2>
                        <div>
                            <Button
                                data-purpose="edit-coding-exercise-button"
                                udStyle="secondary"
                                componentClass="a"
                                href={getTargetExerciseEditLink(
                                    String(practiceInsightsStore.courseId),
                                    String(practiceInsightsStore.selectedQuiz?.id),
                                )}
                                target="_blank"
                                size="xsmall"
                                onClick={() => publishEditCodingExerciseSelectedEvent()}
                            >
                                <EditIcon label={false} />
                                {gettext('Edit coding exercise')}
                            </Button>
                        </div>
                    </div>
                    <QuizMetricsFunnelGroup
                        quizMetrics={practiceInsightsStore.quizMetrics}
                        fillColor={dataColors.fillColor}
                        lineColor={dataColors.lineColor}
                        gridLineColor={dataColors.gridLineColor}
                    />
                </>
            );
        }

        function renderContent() {
            const isEligibleToViewMetricTable = practiceInsightsStore.selectedQuiz?.id === null;
            const metricTableRows: TableRow[] = buildMetricTableRows();
            return (
                <div data-purpose="practice-insights-component">
                    {isCourseInUbEver(practiceInsightsStore.courseId) &&
                        !isCourseInUBCollectionNow(practiceInsightsStore.courseId) &&
                        renderFormerlyInUBCollectionMessage()}
                    {!isEligibleToViewMetricTable && renderFunnelWithHeader()}
                    {practiceInsightsStore.engagementChartMetrics && (
                        <>
                            <div className={baseStyles['heading-without-top-margin']}>
                                <h2 className="ud-heading-lg">{gettext('Minutes spent')}</h2>
                            </div>
                            <div className={`${baseStyles['chart-container']}`}>
                                <>
                                    <div
                                        className={`ud-heading-md ${baseStyles['chart-data-text']}`}
                                    >
                                        {ninterpolate(
                                            '%(consumed)s minutes',
                                            '%(consumed)s minutes',
                                            Number(
                                                practiceInsightsStore.engagementChartMetrics
                                                    .minutesTaught,
                                            ),
                                            {
                                                consumed:
                                                    practiceInsightsStore.engagementChartMetrics
                                                        .minutesTaught,
                                            },
                                        )}
                                    </div>
                                    <div>
                                        {gettext(
                                            'The total amount of time your learners have spent taking all coding exercises over the specified time period.',
                                        )}
                                    </div>
                                </>

                                <EngagementChart
                                    data={practiceInsightsStore.engagementChartMetrics}
                                    scopeFilter={practiceInsightsStore.dataScope}
                                    dateFilter={practiceInsightsStore.selectedDate.value}
                                    isPracticeInsights={true}
                                />
                            </div>
                            {isEligibleToViewMetricTable && (
                                <div>
                                    <div className={styles['metric-table-heading']}>
                                        <h2 className="ud-heading-lg">
                                            {gettext('Performance data')}
                                        </h2>
                                    </div>
                                    <MetricTable
                                        data-purpose="practice-insights-metric-table"
                                        columns={metricTableColumns}
                                        rows={metricTableRows}
                                        pageCount={practiceInsightsStore.pageCount}
                                        activePage={practiceInsightsStore.activeTableMetricPage}
                                        onPageChange={practiceInsightsStore.onMetricTablePageChange}
                                        tableProps={{
                                            noBackgroundColor: true,
                                            noBorder: true,
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            );
        }

        function renderNoPermissionCourse() {
            const title = gettext(
                'You do not have access to "Practice insights" data for this course.',
            );
            return (
                <NoPermissionCourse
                    title={title}
                    missingPermissionMessage={missingPermissionMessagePerformance}
                />
            );
        }

        return (
            <>
                {practiceInsightsStore.apiState === API_STATE.SEARCHING && <SearchState />}
                {practiceInsightsStore.apiState === API_STATE.ERROR && <ErrorState />}
                {(practiceInsightsStore.apiState === API_STATE.DONE ||
                    practiceInsightsStore.apiState === API_STATE.NO_PERMISSION) &&
                    renderHeader()}
                {(practiceInsightsStore.apiState === API_STATE.DONE ||
                    practiceInsightsStore.apiState === API_STATE.NO_PERMISSION) &&
                    renderAllOrUbTabs()}
                {practiceInsightsStore.apiState === API_STATE.NO_PERMISSION &&
                    renderNoPermissionCourse()}
                {practiceInsightsStore.apiState === API_STATE.DONE &&
                    practiceInsightsStore.selectedQuiz &&
                    renderQuizAndDateSpanFilters()}
                {practiceInsightsStore.apiState === API_STATE.DONE && renderIfThereIsAQuiz()}
            </>
        );
    },
);
