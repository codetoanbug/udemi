import {action, computed, observable} from 'mobx';

import {API_STATE} from 'instructor/constants';
import udApi, {TIMEOUT} from 'utils/ud-api';
import SystemMessage from 'utils/ud-system-message';

import {DATE_RANGE, TRAFFIC_AND_CONVERSION_CHANNELS} from './constants';
import ConversionMetrics from './conversion-metrics.mobx-model';
import {PaginatedMetrics} from './students-metrics.mobx-store';

function getApiState(error) {
    if (error && error.response && error.response.status === 403) {
        return API_STATE.NO_PERMISSION;
    }
    return API_STATE.ERROR;
}

export function getParams(courseId, dateFilter) {
    const courseParams = !courseId ? null : {course_id: courseId};
    const paginationParams = {page_size: 999};
    const dateParams = {date_filter: dateFilter};
    const filterFields = [
        'visits',
        'enrollments',
        'is_ufb_instructor',
        'dismissed_messages',
    ].concat(
        !courseId
            ? ['course']
            : [dateFilter === DATE_RANGE.YEAR ? 'monthly' : 'daily', 'days_unprocessed'],
    );
    const fieldParams = {'fields[ds_clp_visit_snapshot_v2]': filterFields.join(',')};
    return Object.assign({}, courseParams, dateParams, fieldParams, paginationParams);
}

export default class ConversionMetricsStore {
    @observable courseSearchState = API_STATE.SEARCHING;
    @observable courseMetrics = null;
    allCourses = null;
    referralLinks = null;
    ufbInstructor = null;
    daysUnprocessed = null;
    @observable courseId = null;
    @observable showVisitorChartUnique = true;
    @observable showClpConversionHint = true;

    constructor() {
        this.allCourses = new AllCoursesConversionMetrics();
        this.referralLinks = new ReferralLinksMetrics();
    }

    @computed
    get searchState() {
        if (!this.courseId) {
            return this.allCourses.searchState;
        }
        const states = [this.courseSearchState, this.referralLinks.searchState];
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
    getMetrics(courseId, dateFilter) {
        this.courseId = courseId;
        if (!this.courseId) {
            return this.allCourses.getMetrics(dateFilter);
        }
        this.courseSearchState = API_STATE.SEARCHING;
        const params = getParams(courseId, dateFilter);
        return udApi
            .get('/instructor-performance/clp-metrics/', {
                useCache: true,
                params,
                timeout: 20000,
            })
            .then(
                action((response) => {
                    this.daysUnprocessed = response.data.results[0].days_unprocessed;
                    this.courseMetrics = new ConversionMetrics(
                        response.data.results[0],
                        true,
                        this.daysUnprocessed,
                    );
                    this.ufbInstructor = response.data.results[0].is_ufb_instructor;
                    const dismissedMsgs = response.data.results[0].dismissed_messages;
                    this.showVisitorChartUnique = !dismissedMsgs.includes(
                        SystemMessage.ids.visitorChartUnique,
                    );
                    this.showClpConversionHint = !dismissedMsgs.includes(
                        SystemMessage.ids.clpConversionHint,
                    );
                    this.allCourses.showConversionMigrationBanner = !dismissedMsgs.includes(
                        SystemMessage.ids.conversionMigrationHint,
                    );
                    this.courseSearchState = API_STATE.DONE;
                }),
            )
            .catch(
                action((error) => {
                    this.courseSearchState = getApiState(error);
                }),
            );
    }
}

class AllCoursesConversionMetrics extends PaginatedMetrics {
    pageSize = 10;
    ufbInstructor = null;
    daysUnprocessed = null;
    @observable showConversionMigrationBanner = false;

    @action
    getMetrics(dateFilter) {
        this.searchState = API_STATE.SEARCHING;
        const params = getParams(null, dateFilter);
        return udApi
            .get('/instructor-performance/clp-metrics/', {
                useCache: true,
                params,
                timeout: TIMEOUT,
            })
            .then(
                action((response) => {
                    const results = response.data.results || [];
                    this.daysUnprocessed = 2; // too expensive to query for every course an instructor has
                    this.metrics = results.map(
                        (course) => new ConversionMetrics(course, false, this.daysUnprocessed),
                    );
                    const dismissedMsgs = results.length > 0 ? results[0].dismissed_messages : [];
                    this.showConversionMigrationBanner = !dismissedMsgs.includes(
                        SystemMessage.ids.conversionMigrationHint,
                    );
                    this.ufbInstructor = results.some((course) => course.is_ufb);
                    this.searchState = API_STATE.DONE;
                }),
            )
            .catch(
                action((error) => {
                    this.searchState = getApiState(error);
                }),
            );
    }
}

class ReferralLinksMetrics extends PaginatedMetrics {
    pageSize = 10;
    @observable channel = TRAFFIC_AND_CONVERSION_CHANNELS.ALL;
    @observable _rawMetrics = null;

    @computed
    get metrics() {
        if (this.channel === TRAFFIC_AND_CONVERSION_CHANNELS.ALL) {
            return this._rawMetrics;
        }
        return this._rawMetrics.filter((referralLink) => referralLink.channel === this.channel);
    }

    @action
    setChannel(channel) {
        this.channel = channel;
    }

    @action
    getMetrics(courseId, dateFilter) {
        this.searchState = API_STATE.SEARCHING;
        const params = {
            course_id: courseId,
            date_filter: dateFilter,
            page_size: 999,
        };
        return udApi
            .get('/instructor-performance/referral-links/', {
                useCache: true,
                params,
                timeout: TIMEOUT,
            })
            .then(
                action((response) => {
                    this._rawMetrics = response.data.results;
                    this.searchState = API_STATE.DONE;
                }),
            )
            .catch(
                action((error) => {
                    this.searchState = getApiState(error);
                }),
            );
    }
}
