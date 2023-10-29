import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {API_STATE} from 'instructor/constants';
import udApi, {TIMEOUT} from 'utils/ud-api';
import udMe from 'utils/ud-me';

import {
    DATA_SCOPE_FILTERS,
    DATE_TYPE,
    DEFAULT_DATA_SCOPE_FILTER,
    METRIC_SETTINGS,
    REVENUE_TYPE,
} from './constants';
import InstructorTopMetrics from './instructor-top-metrics.mobx-model';

export default class InstructorOverviewStore {
    @observable revenueSearchState = API_STATE.SEARCHING;
    @observable enrollmentSearchState = API_STATE.SEARCHING;
    @observable ratingSearchState = API_STATE.SEARCHING;
    @observable shareholderId = null;
    @observable revenueMetrics = null;
    @observable enrollmentMetrics = null;
    @observable ratingMetrics = null;

    @computed
    get metricSearchState() {
        const states = [
            this.revenueSearchState,
            this.enrollmentSearchState,
            this.ratingSearchState,
        ];
        if (states.some((state) => state === API_STATE.ERROR)) {
            return API_STATE.ERROR;
        }
        if (states.some((state) => state === API_STATE.SEARCHING)) {
            return API_STATE.SEARCHING;
        }
        return API_STATE.DONE;
    }

    setEmptyRevenueState() {
        this.revenueMetrics = new InstructorTopMetrics(
            {
                total: {amount: 0, currency: 'usd', currency_symbol: '$'},
                current_month: {amount: 0, currency: 'usd', currency_symbol: '$'},
                daily: [],
                monthly: [],
            },
            METRIC_SETTINGS.REVENUE,
        );
        this.revenueSearchState = API_STATE.DONE;
    }

    @autobind
    @action
    handleRevenueError(error) {
        if (error.response && (error.response.status === 403 || error.response.status === 404)) {
            this.setEmptyRevenueState();
        } else {
            this.revenueSearchState = API_STATE.ERROR;
        }
    }

    getUBRevenueTotal(response, currency) {
        let totalUBRevenue = 0.0;
        try {
            response.data.items.forEach((item) => {
                totalUBRevenue +=
                    item.breakdown.ufb &&
                    item.breakdown.ufb.currency &&
                    item.breakdown.ufb.amount &&
                    item.breakdown.ufb.currency === currency
                        ? parseFloat(item.breakdown.ufb.amount)
                        : 0.0;
            });
        } catch (error) {
            totalUBRevenue = 0.0;
        }
        return {amount: totalUBRevenue, currency};
    }

    @action
    getRevenueMetrics(courseId, dataScope = DEFAULT_DATA_SCOPE_FILTER, isCourseInUbEver = false) {
        this.revenueSearchState = API_STATE.SEARCHING;
        let apiUrl = '/share-holders/v1.0/';
        return udApi
            .get(apiUrl, {
                useCache: true,
                params: {user_id: udMe.id},
                timeout: TIMEOUT,
            })
            .then(
                action((response) => {
                    if (response.data.results.length === 0) {
                        this.setEmptyRevenueState();
                        return;
                    }
                    this.shareholderId = response.data.results[0].id;
                    apiUrl += this.shareholderId;
                    const params = {course_id: courseId};
                    const monthlyPromise = udApi.get(`${apiUrl}/total/`, {
                        useCache: true,
                        params: {aggregate: DATE_TYPE.MONTH, breakdown: REVENUE_TYPE, ...params},
                        timeout: TIMEOUT,
                    });
                    const dailyPromise = udApi.get(`${apiUrl}/total/`, {
                        useCache: true,
                        params: {
                            timeframe: DATE_TYPE.MONTH,
                            aggregate: DATE_TYPE.DAY,
                            breakdown: REVENUE_TYPE,
                            ...params,
                        },
                        timeout: TIMEOUT,
                    });
                    return Promise.all([monthlyPromise, dailyPromise]);
                }),
            )
            .then(
                action((response) => {
                    if (!response) {
                        return;
                    }
                    const ubRevenueTotal = this.getUBRevenueTotal(
                        response[0],
                        response[0].data.amount.currency,
                    );
                    const rawData = {
                        total:
                            dataScope === DATA_SCOPE_FILTERS.UB
                                ? ubRevenueTotal
                                : response[0].data.amount,
                        current_month: {},
                        monthly: response[0].data.items || [],
                        daily: response[1].data.items || [],
                    };
                    this.revenueMetrics = new InstructorTopMetrics(
                        rawData,
                        METRIC_SETTINGS.REVENUE,
                        dataScope,
                        isCourseInUbEver,
                    );
                    this.revenueSearchState = API_STATE.DONE;
                }),
            )
            .catch(this.handleRevenueError);
    }

    @action
    getEnrollmentMetrics(courseId, dataScope = DEFAULT_DATA_SCOPE_FILTER, dateFilter) {
        this.enrollmentSearchState = API_STATE.SEARCHING;
        const params = !courseId
            ? {'fields[user]': 'total,current_month,daily,monthly'}
            : {course_id: courseId, 'fields[course]': 'total,current_month,daily,monthly'};
        return udApi
            .get('/instructor-performance/enrollment-metrics/', {
                useCache: true,
                params: {...params, data_scope: dataScope, date_filter: dateFilter},
                timeout: TIMEOUT,
            })
            .then(
                action((response) => {
                    this.enrollmentMetrics = new InstructorTopMetrics(
                        response.data.results[0],
                        METRIC_SETTINGS.ENROLLMENT,
                        dataScope,
                    );
                    this.enrollmentSearchState = API_STATE.DONE;
                }),
            )
            .catch(
                action(() => {
                    this.enrollmentSearchState = API_STATE.ERROR;
                }),
            );
    }

    @action
    getRatingMetrics(courseId, dataScope = DEFAULT_DATA_SCOPE_FILTER) {
        this.ratingSearchState = API_STATE.SEARCHING;
        const params = !courseId
            ? {'fields[user]': 'total,current_month,daily,monthly'}
            : {course_id: courseId, 'fields[course]': 'total,current_month,daily,monthly'};
        return udApi
            .get('/instructor-performance/rating-metrics/', {
                useCache: true,
                params: {...params, data_scope: dataScope},
                timeout: TIMEOUT,
            })
            .then(
                action((response) => {
                    this.ratingMetrics = new InstructorTopMetrics(
                        response.data.results[0],
                        METRIC_SETTINGS.RATING,
                        dataScope,
                    );
                    this.ratingSearchState = API_STATE.DONE;
                }),
            )
            .catch(
                action(() => {
                    this.ratingSearchState = API_STATE.ERROR;
                }),
            );
    }
}
