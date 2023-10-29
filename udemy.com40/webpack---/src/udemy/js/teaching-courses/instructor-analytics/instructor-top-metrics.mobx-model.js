import {action, computed, observable, set} from 'mobx';

import formatCurrency from 'utils/currency-formatter';
import getConfigData from 'utils/get-config-data';
import getRequestData from 'utils/get-request-data';
import {formatNumber} from 'utils/numeral';

import AnalyticsTrends from './analytics-trends.mobx-model';
import {
    REVENUE_CHANNELS,
    DATE_TYPE,
    METRIC_SETTINGS,
    DATA_SCOPE_FILTERS,
    DEFAULT_DATA_SCOPE_FILTER,
} from './constants';
import {formatRoundNumber, pacificTimeDate} from './helpers';

const udConfig = getConfigData();
const udRequest = getRequestData();

export default class InstructorTopMetrics extends AnalyticsTrends {
    @observable total;
    @observable metricType;
    // eslint-disable-next-line camelcase
    @observable current_month;
    @observable daily;
    @observable monthly;
    @observable dataScope;

    constructor(
        instructorTopMetrics,
        metricType,
        dataScope = DEFAULT_DATA_SCOPE_FILTER,
        isCourseInUbEver = false,
    ) {
        super();
        set(this, {
            total: instructorTopMetrics.total,
            current_month: instructorTopMetrics.current_month,
            daily: instructorTopMetrics.daily,
            monthly: instructorTopMetrics.monthly,
            isCourseInUbEver,
            dataScope,
            metricType,
        });
        if (metricType === METRIC_SETTINGS.REVENUE) {
            this.formatRevenueData();
        }
    }

    @computed
    get formattedTotal() {
        switch (this.metricType) {
            case METRIC_SETTINGS.REVENUE:
                return formatCurrency(
                    this.total.amount,
                    udConfig.price_country.usd_currency_formatter,
                );
            case METRIC_SETTINGS.ENROLLMENT:
                return formatNumber(this.total);
            case METRIC_SETTINGS.RATING:
                return formatRoundNumber(this.total, 2);
        }
    }

    @computed
    get formattedCurrentMonth() {
        switch (this.metricType) {
            case METRIC_SETTINGS.REVENUE:
                return formatCurrency(
                    this.current_month.amount,
                    udConfig.price_country.usd_currency_formatter,
                );
            case METRIC_SETTINGS.ENROLLMENT:
            case METRIC_SETTINGS.RATING:
                return formatNumber(this.current_month);
        }
    }

    @computed
    get finalizedDateDaily() {
        const finalizedDate = pacificTimeDate(new Date());
        switch (this.metricType) {
            case METRIC_SETTINGS.RATING:
                return null;
            case METRIC_SETTINGS.REVENUE:
                return this.revenueFinalizedDate();
            case METRIC_SETTINGS.ENROLLMENT:
                // Current day is not finalized in daily view
                finalizedDate.setDate(finalizedDate.getDate() - 1);
                return finalizedDate;
        }
    }

    @computed
    get finalizedDateMonthly() {
        const finalizedDate = pacificTimeDate(new Date());
        switch (this.metricType) {
            case METRIC_SETTINGS.RATING:
                return null;
            case METRIC_SETTINGS.REVENUE:
                return this.revenueFinalizedDate();
            case METRIC_SETTINGS.ENROLLMENT:
                // Current month is not finalized in monthly view
                finalizedDate.setMonth(finalizedDate.getMonth() - 1);
                finalizedDate.setDate(1);
                return finalizedDate;
        }
    }

    @computed
    get revenueTooltipSeriesTypes() {
        const metricType = this.metricType;
        if (metricType !== METRIC_SETTINGS.REVENUE) {
            return new Set([]);
        }

        const seriesNamesSet = new Set(['marketplace']);
        const tooltipPoints = this.monthly;
        let maxSize = 3;
        for (let i = 0; i < tooltipPoints.length; ++i) {
            // For a single course, check if the course is in UB collection ever
            // For all courses, check ufb amount
            // to add ufb to tooltip
            if (this.isCourseInUbEver || tooltipPoints[i].ufb.amount !== 0) {
                seriesNamesSet.add('ufb');
            }
            if (tooltipPoints[i].partner.amount !== 0) {
                maxSize = 4;
                seriesNamesSet.add('partner');
            }
            if (tooltipPoints[i].other.amount !== 0) {
                seriesNamesSet.add('other');
            }
            if (seriesNamesSet.size >= maxSize) {
                return seriesNamesSet;
            }
        }
        return seriesNamesSet;
    }

    revenueFinalizedDate() {
        // Current and previous calendar months are not finalized
        const finalizedDate = pacificTimeDate(new Date());
        finalizedDate.setMonth(finalizedDate.getMonth() - 2);
        finalizedDate.setDate(1);
        return finalizedDate;
    }

    getDataSeries(dataSet) {
        const metricType = this.metricType;
        let data, name;
        switch (metricType) {
            case METRIC_SETTINGS.REVENUE:
                data = dataSet.map((dataPoint) => dataPoint.total.amount);
                name = gettext('Revenue');
                break;
            case METRIC_SETTINGS.ENROLLMENT:
                data = dataSet.map((dataPoint) => dataPoint.value);
                name = gettext('Students');
                break;
            case METRIC_SETTINGS.RATING:
                data = dataSet.map((dataPoint) => parseFloat(dataPoint.value.toFixed(2)));
                name = gettext('Rating');
                break;
        }
        data = data.some((value) => value !== 0) ? data : [];
        return [{data, name}];
    }

    getTooltipOnlyDataSeries(dataSet) {
        const metricType = this.metricType;
        if (metricType === METRIC_SETTINGS.REVENUE) {
            const validTooltipNames = this.revenueTooltipSeriesTypes;
            if (validTooltipNames.size < 2) {
                return [];
            }

            const marketplaceData = {
                data: dataSet.map((dataPoint) => dataPoint.marketplace.amount),
                name: gettext('Marketplace'),
            };
            const tooltipDataSeries = [marketplaceData];

            if (validTooltipNames.has('ufb')) {
                tooltipDataSeries.push({
                    data: dataSet.map((dataPoint) => dataPoint.ufb.amount),
                    name: 'UB',
                });
            }
            if (validTooltipNames.has('partner')) {
                tooltipDataSeries.push({
                    data: dataSet.map((dataPoint) => dataPoint.partner.amount),
                    name: gettext('External Partners'),
                });
            }
            if (validTooltipNames.has('other')) {
                tooltipDataSeries.push({
                    data: dataSet.map((dataPoint) => dataPoint.other.amount),
                    name: gettext('Adjustments'),
                });
            }

            return tooltipDataSeries;
        }
        return [];
    }

    dateString(date) {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    @action
    formatRevenueData() {
        this.daily = this.formatAggregateRevenue(this.daily, DATE_TYPE.DAY);
        this.monthly = this.formatAggregateRevenue(this.monthly, DATE_TYPE.MONTH);
        this.current_month = this.computeCurrentMonthRevenue();
    }

    convertDataPoints(data) {
        const dateDict = {};
        data.forEach((dataPoint) => {
            const date = dataPoint.identifier;
            dateDict[date] = {total: dataPoint.amount};
            Object.keys(dataPoint.breakdown).forEach((key) => {
                dateDict[date][key] = dataPoint.breakdown[key];
            });
        });
        return dateDict;
    }

    addLatestDate(data, dateType) {
        if (data.length === 0) {
            return data;
        }
        const today = new Date(udRequest.serverTimestamp);
        today.setHours(0, 0, 0, 0);
        const emptyRevenue = {
            total: {amount: 0},
            marketplace: {amount: 0},
            ufb: {amount: 0},
            other: {amount: 0},
            partner: {amount: 0},
        };
        const lastDate = data[data.length - 1].rawDate.getTime();
        if (dateType === DATE_TYPE.DAY) {
            if (lastDate !== today.getTime()) {
                data.push({date: this.dateString(today), rawDate: today, ...emptyRevenue});
            }
        } else if (dateType === DATE_TYPE.MONTH) {
            const startOfMonth = today;
            startOfMonth.setDate(1);
            if (lastDate !== startOfMonth.getTime()) {
                data.push({
                    date: this.dateString(startOfMonth),
                    rawDate: startOfMonth,
                    ...emptyRevenue,
                });
            }
        } else {
            throw new Error('Invalid date type');
        }
    }

    getDatesToFill(startDate, endDate, dateType) {
        const dates = [];
        const currentDate = startDate;
        if (dateType === DATE_TYPE.DAY) {
            while (currentDate < endDate) {
                dates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
        } else if (dateType === DATE_TYPE.MONTH) {
            while (currentDate < endDate) {
                dates.push(new Date(currentDate));
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        } else {
            throw new Error('Invalid date type');
        }
        return dates;
    }

    fillInGaps(dataPoints, dateType) {
        this.addLatestDate(dataPoints, dateType);
        if (dataPoints.length === 0) {
            return dataPoints;
        }
        const filledInDates = [];
        let expectedDate = dataPoints[0].rawDate;
        for (let i = 0; i < dataPoints.length; i++) {
            const dataPoint = dataPoints[i];
            const currentDate = dataPoint.rawDate;
            if (expectedDate < currentDate) {
                const fillDates = this.getDatesToFill(expectedDate, currentDate, dateType);
                for (let j = 0; j < fillDates.length; j++) {
                    filledInDates.push({
                        date: this.dateString(fillDates[j]),
                        total: {amount: 0},
                        marketplace: {amount: 0},
                        ufb: {amount: 0},
                        other: {amount: 0},
                        partner: {amount: 0},
                    });
                }
                expectedDate = currentDate;
            }
            delete dataPoint.rawDate;
            filledInDates.push(dataPoint);
            if (dateType === DATE_TYPE.DAY) {
                expectedDate.setDate(expectedDate.getDate() + 1);
            } else if (dateType === DATE_TYPE.MONTH) {
                expectedDate.setMonth(expectedDate.getMonth() + 1);
            } else {
                throw new Error('Invalid date type');
            }
        }
        return filledInDates;
    }

    fillInChannels(dates) {
        const dateList = [];
        Object.keys(dates).forEach((date) => {
            REVENUE_CHANNELS.forEach((channel) => {
                if (!Object.prototype.hasOwnProperty.call(dates[date], channel)) {
                    dates[date][channel] = {amount: 0};
                }
            });
            dateList.push({date, rawDate: this.parseDate(date), ...dates[date]});
        });
        return dateList;
    }

    formatAggregateRevenue(rawData, dateType) {
        const dateDict = this.convertDataPoints(rawData);
        const dataPoints = this.fillInChannels(dateDict).sort((a, b) => {
            if (a.rawDate < b.rawDate) return -1;
            if (b.rawDate < a.rawDate) return 1;
            return 0;
        });
        return this.fillInGaps(dataPoints, dateType);
    }

    computeCurrentMonthRevenue() {
        if (this.dataScope === DATA_SCOPE_FILTERS.UB) return {amount: 0};
        if (!this.monthly || this.monthly.length === 0) {
            return {amount: 0};
        }
        return {amount: this.monthly[this.monthly.length - 1].total.amount};
    }
}
