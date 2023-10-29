import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {API_STATE, MAX_PAGE_SIZE} from 'instructor/constants';
import udApi, {TIMEOUT, MAX_TIMEOUT} from 'utils/ud-api';
import SystemMessage from 'utils/ud-system-message';

import {ALL_COURSE_OPTION, DATA_SCOPE_FILTERS, DATE_RANGE} from '../constants';
import {InstructorUBOnlyCourseEngagementPageViewEvent} from '../events';
import {PaginatedMetrics} from '../students-metrics.mobx-store';
import EngagementMetrics from './engagement-metrics.mobx-model';

export function getTopMetricsParams(courseId, dateFilter, scopeFilter) {
    const courseParams = !courseId ? null : {course_id: courseId};
    const paginationParams = {page_size: MAX_PAGE_SIZE};
    const dateParams = {date_filter: dateFilter};
    const dataScopeParams = {data_scope: scopeFilter};
    const snapshotType =
        dateFilter === DATE_RANGE.WEEK || dateFilter === DATE_RANGE.MONTH ? 'daily' : 'monthly';
    const filterFields = ['@default', snapshotType]
        .concat(courseId ? ['curriculum', 'lecture_metrics'] : ['course_metrics'])
        .join(',');
    const fieldParams = courseId
        ? {
              'fields[ds_course_engagement_snapshot]': filterFields,
          }
        : {
              'fields[ds_instructor_course_engagement_snapshot]': filterFields,
              'fields[ds_course_engagement_snapshot]': '@min,course',
          };
    return Object.assign(
        {},
        courseParams,
        dateParams,
        dataScopeParams,
        fieldParams,
        paginationParams,
    );
}

function getApiState(error) {
    if (error && error.response && error.response.status === 403) {
        return API_STATE.NO_PERMISSION;
    }
    return API_STATE.ERROR;
}

export default class EngagementMetricsStore {
    defaultSortField = {fieldName: 'course', ascending: true};

    @observable topMetricsSearchState = API_STATE.SEARCHING;
    @observable consumptionSearchState = API_STATE.DONE;
    allCourses = null;
    @observable courseId = null;
    @observable topMetrics = null;
    @observable consumptionMetrics = null;
    @observable showEngagementBanner = true;
    @observable sortBy = this.defaultSortField;
    @observable showEngagementDataDiscrepancy = false;
    @observable showAllTimeDataAlertBanner = false;
    @observable quizzes = null;
    @observable showInProductGuidanceForCodingExerciseInsightsSingle = true;
    @observable showInProductGuidanceForMoMAndYoYTrendInsights = true;
    @observable showInProductGuidanceForCodingExerciseInsightsAll = true;

    @computed
    get searchState() {
        const states = [this.topMetricsSearchState, this.consumptionSearchState];
        if (states.some((state) => state === API_STATE.NO_PERMISSION)) {
            return API_STATE.NO_PERMISSION;
        }
        if (states.some((state) => state === API_STATE.ERROR)) {
            return API_STATE.ERROR;
        }
        if (states.some((state) => state === API_STATE.SEARCHING)) {
            return API_STATE.SEARCHING;
        }
        return API_STATE.DONE;
    }

    @action
    openAllSections() {
        this.topMetrics.lectureMetrics.forEach((section) => section.open());
    }

    @action
    closeAllSections() {
        this.topMetrics.lectureMetrics.forEach((section) => section.close());
    }

    hasAtLeastOneCodingExercise(curriculum) {
        const isCodingExercise = (item) => {
            return item.item_type === 'quiz' && item.is_coding_exercise === true;
        };
        const hasCodingExercise = (curriculum) => {
            return curriculum.items.some(isCodingExercise);
        };
        return curriculum.some(hasCodingExercise);
    }

    @action
    getTopMetrics(courseId, dateFilter, scopeFilter) {
        if (scopeFilter && scopeFilter === DATA_SCOPE_FILTERS.UB) {
            const courseDropdownSelection = courseId || ALL_COURSE_OPTION;
            Tracker.publishEvent(
                new InstructorUBOnlyCourseEngagementPageViewEvent(
                    dateFilter,
                    courseDropdownSelection.toString(),
                ),
            );
        }
        this.topMetricsSearchState = API_STATE.SEARCHING;
        const params = getTopMetricsParams(courseId, dateFilter, scopeFilter);
        return udApi
            .get('/instructor-performance/engagement-metrics/', {
                useCache: true,
                params,
                timeout: MAX_TIMEOUT,
            })
            .then(
                action((response) => {
                    this.topMetrics = new EngagementMetrics(response.data.results[0]);
                    const dismissedMsgs = response.data.results[0].dismissed_messages;
                    let quizMetricsPromise;
                    if (courseId) {
                        this.showEngagementBanner = !dismissedMsgs.includes(
                            SystemMessage.ids.engagementBehaviorHint,
                        );
                        const shouldGetQuizMetrics = this.hasAtLeastOneCodingExercise(
                            response.data.results[0].curriculum,
                        );
                        if (shouldGetQuizMetrics) {
                            quizMetricsPromise = udApi.get('/instructor-analytics/quiz-metrics/', {
                                useCache: true,
                                params: this.getQuizMetricsRequestParams(
                                    courseId,
                                    dateFilter,
                                    scopeFilter,
                                ),
                                timeout: MAX_TIMEOUT,
                            });
                        }
                    } else {
                        this.sortBy = this.defaultSortField;

                        this.allCourses = new AllCoursesEngagementMetrics(
                            response.data.results[0].course_metrics,
                        );
                    }
                    return quizMetricsPromise;
                }),
            )
            .then(
                action((response) => {
                    if (response) {
                        this.topMetrics.quizMetrics = response.data.results[0];
                    }
                    this.topMetricsSearchState = API_STATE.DONE;
                }),
            )
            .catch(
                action((error) => {
                    this.topMetricsSearchState = getApiState(error);
                }),
            );
    }

    @autobind
    @action
    onSort(col) {
        const isActive = col.fieldName === this.sortBy.fieldName;
        this.sortBy = {
            fieldName: col.fieldName,
            ascending: isActive ? !this.sortBy.ascending : col.initialSortOrder === 'ascending',
        };

        return this.sortAllCoursesEngagementMetrics(
            col.sortField ? col.sortField : this.sortBy.fieldName,
            this.sortBy.ascending,
            col.type,
        );
    }

    @action
    sortAllCoursesEngagementMetrics(fieldName, ascending, type) {
        this.allCourses.metrics = this.allCourses.metrics.sort((metricA, metricB) => {
            let valA = this.getNode(metricA, fieldName);
            let valB = this.getNode(metricB, fieldName);
            if (!ascending) {
                [valA, valB] = [valB, valA];
            }
            if (type === 'number') {
                const decimalSeperatorRegex = /[.,]/g;
                return (
                    valA.replaceAll(decimalSeperatorRegex, '') -
                    valB.replaceAll(decimalSeperatorRegex, '')
                );
            }
            return valA.localeCompare(valB);
        });
    }

    getNode(data, key) {
        if (!key) {
            return null;
        }
        const slicedKey = key.split('.');
        if (slicedKey.length === 1) {
            return data[slicedKey];
        }
        const parentKey = slicedKey.shift();
        return this.getNode(data[parentKey], slicedKey.join(','));
    }

    @autobind
    modifyConsumptionMetricsForStackedChart(consumptions) {
        const modifiedMetrics = [];
        const breakdownGroups =
            consumptions && consumptions.length > 0 ? consumptions[0].breakdown_groups : [];
        for (let i = 0; i < breakdownGroups.length; i++) {
            const breakdownGroup = breakdownGroups[i];
            breakdownGroup.headline =
                breakdownGroup.type.toString().toLowerCase() === 'desktop'
                    ? gettext('Desktop')
                    : gettext('Mobile (App & Mobile Web)');
            modifiedMetrics.push(breakdownGroup);
        }

        return modifiedMetrics;
    }

    @autobind
    @action
    getConsumptionMetrics(courseId, scopeFilter, dateFilter) {
        this.consumptionSearchState = API_STATE.SEARCHING;

        const apiUrl = `/instructor-analytics/course/${courseId}/consumption-device-breakdown/`;
        const params = {
            data_scope: scopeFilter,
            date_filter: this.getDateFilterMappedValue(dateFilter),
        };
        return udApi
            .get(apiUrl, {
                useCache: true,
                params,
                timeout: TIMEOUT,
            })
            .then(
                action((response) => {
                    this.consumptionMetrics = this.modifyConsumptionMetricsForStackedChart(
                        response.data.results[0].consumptions,
                    );
                    this.consumptionSearchState = API_STATE.DONE;
                }),
            )
            .catch(
                action((error) => {
                    this.consumptionSearchState = getApiState(error);
                }),
            );
    }

    @autobind
    getDateFilterMappedValue(dateFilter) {
        if (dateFilter === DATE_RANGE.WEEK) {
            return 'last_7_days';
        }
        if (dateFilter === DATE_RANGE.MONTH) {
            return 'last_30_days';
        }
        if (dateFilter === DATE_RANGE.YEAR) {
            return 'last_12_months';
        }
        return 'all';
    }

    @autobind
    getDateFilterMappedValueForQuizMetrics(dateFilter) {
        if (dateFilter === DATE_RANGE.WEEK) {
            return 'last_7days';
        }
        if (dateFilter === DATE_RANGE.MONTH) {
            return 'last_30days';
        }
        if (dateFilter === DATE_RANGE.YEAR) {
            return 'last_12months';
        }
        return 'all';
    }

    @autobind
    getQuizMetricsRequestParams(courseId, dateFilter, scopeFilter) {
        const params = {
            inquiry_id: courseId,
            inquiry_type: courseId ? 'course' : '',
            quiz_type: 'coding-exercise',
            date_filter: this.getDateFilterMappedValueForQuizMetrics(dateFilter),
            data_scope: scopeFilter,
        };
        return params;
    }
}

export class AllCoursesEngagementMetrics extends PaginatedMetrics {
    pageSize = 10;

    constructor(data) {
        super();
        this.metrics = data.map((courseData) => new EngagementMetrics(courseData));
    }
}
