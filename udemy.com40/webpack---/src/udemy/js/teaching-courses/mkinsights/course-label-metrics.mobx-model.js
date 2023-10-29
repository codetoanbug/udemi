import autobind from 'autobind-decorator';
import {action, computed, observable, extendObservable} from 'mobx';

import {trackClick} from './tracking';

const MAX_NUM_COURSE = 36;

const SHOW_LESS_Q_SIZE = 6;
const SHOW_LESS_CL_SIZE = 5;
const SHOW_MORE_SIZE = 15;

export const SUPPLY_DEMAND_LABELS = {
    LOW: gettext('low'),
    AVERAGE: gettext('average'),
    HIGH: gettext('high'),
};

export const RECOMMENDATION = {
    GO_FOR_IT: 'GO_FOR_IT',
    NEED_QUALITY: 'NEED_QUALITY',
    NEED_DIFFERENTIATION: 'NEED_DIFFERENTIATION',
    NEED_AUDIENCE: 'NEED_AUDIENCE',
    BRING_A_GAME: 'BRING_A_GAME',
};

export const MPI_CHANNELS = {
    DISCOVERY: 'discovery',
    SEARCH: 'search',
    OUTSIDE: 'external organic',
    INSTRUCTOR: 'instructor',
    PAID: 'paid',
};

export default class CourseLabelMetrics {
    constructor(courseLabelMetrics) {
        extendObservable(this, {
            course_label: courseLabelMetrics.course_label,
            num_course: courseLabelMetrics.num_course,
            perc_hq_course: courseLabelMetrics.perc_hq_course,
            perc_hq_paid_enrollment: courseLabelMetrics.perc_hq_paid_enrollment,
            median_total_revenue: courseLabelMetrics.median_total_revenue,
            avg_top_revenue: courseLabelMetrics.avg_top_revenue,
            search_volume_percentile: courseLabelMetrics.search_volume_percentile,
            conversion_rate: courseLabelMetrics.conversion_rate,
            channels: courseLabelMetrics.channels,
            monthly_search_volume: courseLabelMetrics.monthly_search_volume,
            top_courses: courseLabelMetrics.top_courses,
            top_queries: courseLabelMetrics.top_queries,
            recommendation: courseLabelMetrics.recommendation,
            related_course_label_metrics_list: courseLabelMetrics.related_course_label_metrics_list,
            available_languages: courseLabelMetrics.available_languages,
            course_lang: courseLabelMetrics.course_lang,
        });
    }

    @observable isShowMoreQueries = false;
    @observable isShowMoreRelatedCourseLabels = false;

    @autobind
    @action
    toggleShowMoreQueries() {
        this.isShowMoreQueries = !this.isShowMoreQueries;
        if (this.isShowMoreQueries) {
            trackClick({
                action: 'click',
                category: 'top_search_keywords',
                actionType: 'show_more',
            })();
        }
    }

    @autobind
    @action
    toggleShowMoreRelatedCourseLabels() {
        this.isShowMoreRelatedCourseLabels = !this.isShowMoreRelatedCourseLabels;
        if (this.isShowMoreRelatedCourseLabels) {
            trackClick({
                action: 'click',
                category: 'other_topics',
                actionType: 'show_more',
            })();
        }
    }

    @computed
    get limitedTopQueries() {
        const limit = this.isShowMoreQueries ? SHOW_MORE_SIZE : SHOW_LESS_Q_SIZE;
        return this.top_queries.slice(0, limit);
    }

    @computed
    get limitedRelatedCourseLabels() {
        const limit = this.isShowMoreRelatedCourseLabels ? SHOW_MORE_SIZE : SHOW_LESS_CL_SIZE;
        return this.related_course_label_metrics_list.slice(0, limit);
    }

    @computed
    get hasMoreTopQueriesToShow() {
        return this.top_queries.length > SHOW_LESS_Q_SIZE;
    }

    @computed
    get hasMoreRelatedCourseLabelsToShow() {
        return this.related_course_label_metrics_list.length > SHOW_LESS_CL_SIZE;
    }

    @computed
    get demand() {
        if (this.search_volume_percentile <= 100 / 3) {
            return SUPPLY_DEMAND_LABELS.LOW;
        } else if (this.search_volume_percentile <= (100 * 2) / 3) {
            return SUPPLY_DEMAND_LABELS.AVERAGE;
        }
        return SUPPLY_DEMAND_LABELS.HIGH;
    }

    @computed
    get supply() {
        if (this.num_course <= MAX_NUM_COURSE / 3) {
            return SUPPLY_DEMAND_LABELS.LOW;
        } else if (this.num_course <= (MAX_NUM_COURSE * 2) / 3) {
            return SUPPLY_DEMAND_LABELS.AVERAGE;
        }
        return SUPPLY_DEMAND_LABELS.HIGH;
    }

    @computed
    get supplyPercentage() {
        return (100 * Math.min(this.num_course, MAX_NUM_COURSE)) / MAX_NUM_COURSE;
    }

    @computed
    get hasNoDemand() {
        return !this.search_volume_percentile;
    }
}
