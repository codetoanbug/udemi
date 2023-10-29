import {computed} from 'mobx';

import {pacificTimeDate} from './helpers';

export default class AnalyticsTrends {
    daily = null;
    monthly = null;

    parseDate(dateString) {
        const date = dateString.split('-');
        return new Date(date[0], date[1] - 1, date[2]);
    }

    filterDateRange(dataSet, startDate) {
        return dataSet.filter((dataPoint) => this.parseDate(dataPoint.date) >= startDate);
    }

    @computed
    get lastSevenDays() {
        const startDate = pacificTimeDate(new Date());
        startDate.setDate(startDate.getDate() - 7);
        return this.filterDateRange(this.daily, startDate);
    }

    @computed
    get lastThirtyDays() {
        const startDate = pacificTimeDate(new Date());
        startDate.setDate(startDate.getDate() - 30);
        return this.filterDateRange(this.daily, startDate);
    }

    @computed
    get lastTwelveMonths() {
        const startDate = pacificTimeDate(new Date());
        startDate.setFullYear(startDate.getFullYear() - 1);
        return this.filterDateRange(this.monthly, startDate);
    }

    @computed
    get startDateWeek() {
        if (this.lastSevenDays.length > 0) {
            return this.parseDate(this.lastSevenDays[0].date);
        }
    }

    @computed
    get startDateMonth() {
        if (this.lastThirtyDays.length > 0) {
            return this.parseDate(this.lastThirtyDays[0].date);
        }
    }

    @computed
    get startDateYear() {
        if (this.lastTwelveMonths.length > 0) {
            return this.parseDate(this.lastTwelveMonths[0].date);
        }
    }

    @computed
    get startDateAllTime() {
        if (this.monthly.length > 0) {
            return this.parseDate(this.monthly[0].date);
        }
        return null;
    }

    @computed
    get dataSeriesWeek() {
        return this.getDataSeries(this.lastSevenDays);
    }

    @computed
    get dataSeriesMonth() {
        return this.getDataSeries(this.lastThirtyDays);
    }

    @computed
    get dataSeriesYear() {
        return this.getDataSeries(this.lastTwelveMonths);
    }

    @computed
    get dataSeriesAllTime() {
        return this.getDataSeries(this.monthly);
    }

    @computed
    get tooltipOnlyDataSeriesWeek() {
        return this.getTooltipOnlyDataSeries(this.lastSevenDays);
    }

    @computed
    get tooltipOnlyDataSeriesMonth() {
        return this.getTooltipOnlyDataSeries(this.lastThirtyDays);
    }

    @computed
    get tooltipOnlyDataSeriesYear() {
        return this.getTooltipOnlyDataSeries(this.lastTwelveMonths);
    }

    @computed
    get tooltipOnlyDataSeriesAllTime() {
        return this.getTooltipOnlyDataSeries(this.monthly);
    }

    getDataSeries() {
        throw new Error('Not implemented');
    }

    getTooltipOnlyDataSeries() {
        throw new Error('Not implemented');
    }
}
