import {computed, extendObservable} from 'mobx';

import {formatNumber} from 'utils/numeral';

import AnalyticsTrends from './analytics-trends.mobx-model';
import {METRIC_SETTINGS} from './constants';
import {formatPercent, pacificTimeDate} from './helpers';

export default class ConversionMetrics {
    visitorTrends = null;
    conversionTrends = null;

    constructor(conversionMetrics, includeTrend, daysUnproccessed) {
        extendObservable(this, {
            visits: conversionMetrics.visits,
            enrollments: conversionMetrics.enrollments,
            course: conversionMetrics.course,
            daily: conversionMetrics.daily,
            monthly: conversionMetrics.monthly,
        });
        if (includeTrend) {
            this.visitorTrends = new ConversionTrends(
                this.daily || null,
                this.monthly || null,
                METRIC_SETTINGS.VISITORS,
                daysUnproccessed,
            );
            this.conversionTrends = new ConversionTrends(
                this.daily || null,
                this.monthly || null,
                METRIC_SETTINGS.CONVERSION,
                daysUnproccessed,
            );
        }
    }

    @computed
    get visitorTotal() {
        return formatNumber(this.visits);
    }

    @computed
    get conversionTotal() {
        const enrolledPercent = (this.enrollments / this.visits) * 100;
        return formatPercent(enrolledPercent || 0, 2);
    }
}

export class ConversionTrends extends AnalyticsTrends {
    metricType = null;
    daysUnprocessed = null;

    constructor(daily, monthly, metricType, daysUnprocessed) {
        super();
        this.daily = daily;
        this.monthly = monthly;
        this.metricType = metricType;
        this.daysUnprocessed = daysUnprocessed;
    }

    getDataSeries(dataSet) {
        if (this.metricType === METRIC_SETTINGS.CONVERSION) {
            if (!dataSet.some((value) => value.enrollments !== 0)) {
                return [
                    {
                        data: [],
                        name: gettext('Conversion Rate'),
                    },
                ];
            }
            const data = dataSet.map((dataPoint) =>
                dataPoint.enrollments ? dataPoint.enrollments / dataPoint.total : 0,
            );
            return [
                {
                    data,
                    name: gettext('Conversion Rate'),
                },
            ];
        }

        const totalDataSeries = {
            data: dataSet.map((dataPoint) => dataPoint.total),
            name: gettext('Total visitors'),
            tooltip: gettext('All the people who came to your course landing page.'),
        };
        if (!totalDataSeries.data.some((value) => value !== 0)) {
            return [
                {
                    data: [],
                    name: gettext('Total visitors'),
                    tooltip: gettext('All the people who came to your course landing page.'),
                },
            ];
        }
        const discoveryDataSeries = {
            data: dataSet.map((dataPoint) => dataPoint.discovery),
            name: gettext('Udemy discovery'),
            tooltip: gettext(
                'The people who came to your course landing page from Udemy email or homepage recommendations.',
            ),
        };
        const searchDataSeries = {
            data: dataSet.map((dataPoint) => dataPoint.search),
            name: gettext('Udemy search'),
            tooltip: gettext(
                'The people who came to your course landing page from searching on Udemy.',
            ),
        };
        const adsAffiliatesDataSeries = {
            data: dataSet.map((dataPoint) => dataPoint.paid),
            name: gettext('Udemy ads and affiliates'),
            tooltip: gettext(
                'The people who came to your course landing page from ads paid for by Udemy or its affiliates.',
            ),
        };
        const promoDataSeries = {
            data: dataSet.map((dataPoint) => dataPoint.instructor),
            name: gettext('Instructor promo'),
            tooltip: gettext(
                'The people who came to your course landing page from your promotions.',
            ),
        };
        const outsideDataSeries = {
            data: dataSet.map((dataPoint) => dataPoint.external_organic),
            name: gettext('Outside sources'),
            tooltip: gettext(
                'The people who came to your landing page from, say, a Google search, ' +
                    'word of mouth, or other sources that we can’t determine.',
            ),
        };
        return [
            totalDataSeries,
            discoveryDataSeries,
            searchDataSeries,
            adsAffiliatesDataSeries,
            promoDataSeries,
            outsideDataSeries,
        ];
    }

    getTooltipOnlyDataSeries(dataSet) {
        if (this.metricType === METRIC_SETTINGS.CONVERSION) {
            const enrollmentDataSeries = {
                data: dataSet.map((dataPoint) => dataPoint.enrollments),
                name: gettext('Enrollments'),
            };
            const visitorDataSeries = {
                data: dataSet.map((dataPoint) => dataPoint.total),
                name: gettext('Visitors'),
            };
            return [enrollmentDataSeries, visitorDataSeries];
        }
        return [];
    }

    @computed
    get finalizedDateDaily() {
        const finalizedDate = pacificTimeDate(new Date());
        finalizedDate.setDate(finalizedDate.getDate() - this.daysUnprocessed);
        return finalizedDate;
    }

    @computed
    get finalizedDateMonthly() {
        const finalizedDate = pacificTimeDate(new Date());
        finalizedDate.setMonth(finalizedDate.getMonth() - 1);
        finalizedDate.setDate(1);
        return finalizedDate;
    }
}
