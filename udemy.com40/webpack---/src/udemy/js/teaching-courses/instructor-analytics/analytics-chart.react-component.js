import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import qs from 'utils/query-params';

import {
    DATA_SCOPE_FILTERS,
    DATE_RANGE,
    DEFAULT_DATA_SCOPE_FILTER,
    METRIC_SETTINGS,
} from './constants';
import DateFilter from './date-filter.react-component';
import {
    GRAPH_INTERVALS,
    GRAPH_SUBTYPES,
    GRAPH_TYPES,
} from './instructor-performance-chart-config-generator';
import OverviewTrendsChart from './overview-trends-chart.react-component';
import TabChartContent from './tab-chart-content.react-component';
import './tab-chart.less';

@withRouter
@inject('store')
@observer
export default class AnalyticsChart extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        metricData: PropTypes.object.isRequired,
        baseUrl: PropTypes.string.isRequired,
        dataScope: PropTypes.string,
    };

    static defaultProps = {
        dataScope: DEFAULT_DATA_SCOPE_FILTER,
    };

    renderGraph() {
        const metricData = this.props.metricData;
        const metricType = metricData.metricType;
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});

        queryParams.date_filter = queryParams.date_filter
            ? queryParams.date_filter
            : DATE_RANGE.YEAR;

        const graphData = graphDataByDateRange(
            queryParams.date_filter,
            metricData,
            metricType.graph,
        );

        const graphSubType =
            this.props.dataScope === DATA_SCOPE_FILTERS.UB ? GRAPH_SUBTYPES.UB : GRAPH_SUBTYPES.ALL;

        let content;
        if (graphData.dataSeries[0].data.length > 0) {
            content = (
                <OverviewTrendsChart
                    dataSeries={graphData.dataSeries}
                    graphType={metricType.graph}
                    startDate={graphData.startDate}
                    tickInterval={graphData.tickInterval}
                    finalizedDate={graphData.finalizedDate}
                    processedDate={graphData.processedDate}
                    tooltipOnlyDataSeries={graphData.tooltipOnlyDataSeries}
                    currencySettings={metricData.currencySettings || {}}
                    data-purpose="graph"
                    graphSubType={graphSubType}
                />
            );
        } else {
            content = (
                <div styleName="no-content" data-purpose="no-data">
                    {gettext('No data to display')}
                </div>
            );
        }

        return (
            <div>
                {metricType.graph !== GRAPH_TYPES.CONVERSION &&
                    metricType.graph !== GRAPH_TYPES.VISITORS && (
                        <div styleName="date-filter">
                            <div className="ud-text-xs">{gettext('Date range: ')}</div>
                            <DateFilter
                                placement={
                                    this.props.store.breakpoints.isMdMax
                                        ? 'bottom-start'
                                        : 'bottom-end'
                                }
                                size="xsmall"
                                dataScope={this.props.dataScope}
                            />
                        </div>
                    )}
                {content}
            </div>
        );
    }

    render() {
        const metricType = this.props.metricData.metricType;
        let link = metricType.link;
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        const courseId = queryParams.course_id;
        if (metricType === METRIC_SETTINGS.ENROLLMENT && courseId && !isNaN(courseId)) {
            link += `?course_id=${courseId}`;
        }
        return (
            <TabChartContent
                content={this.renderGraph()}
                link={link}
                linkLabel={metricType.linkLabel}
                inAppLink={metricType.inAppLink}
                baseUrl={this.props.baseUrl}
            />
        );
    }
}

export function graphDataByDateRange(dateFilter, metricData, graphType, momData, yoyData) {
    let dataSeries, startDate, tickInterval, finalizedDate, processedDate, tooltipOnlyDataSeries;
    const tooltipMoMDiffDataSeries = momData ? [{name: 'MoM', data: momData}] : null;
    const tooltipYoYDiffDataSeries = yoyData ? [{name: 'YoY', data: yoyData}] : null;
    if (
        graphType === GRAPH_TYPES.VISITORS ||
        graphType === GRAPH_TYPES.CONVERSION ||
        graphType === GRAPH_TYPES.ENGAGEMENT
    ) {
        processedDate = metricData.finalizedDateDaily;
    }
    switch (dateFilter) {
        case DATE_RANGE.WEEK:
            tickInterval = GRAPH_INTERVALS.DAY;
            dataSeries = metricData.dataSeriesWeek;
            startDate = metricData.startDateWeek;
            finalizedDate = metricData.finalizedDateDaily;
            tooltipOnlyDataSeries = metricData.tooltipOnlyDataSeriesWeek;
            break;
        case DATE_RANGE.MONTH:
            tickInterval = GRAPH_INTERVALS.DAY;
            dataSeries = metricData.dataSeriesMonth;
            startDate = metricData.startDateMonth;
            finalizedDate = metricData.finalizedDateDaily;
            tooltipOnlyDataSeries = metricData.tooltipOnlyDataSeriesMonth;
            break;
        case DATE_RANGE.ALL_TIME:
            tickInterval = GRAPH_INTERVALS.MONTH;
            dataSeries = metricData.dataSeriesAllTime;
            startDate = metricData.startDateAllTime;
            finalizedDate = metricData.finalizedDateMonthly;
            tooltipOnlyDataSeries = metricData.tooltipOnlyDataSeriesAllTime;
            break;
        case DATE_RANGE.YEAR:
        default:
            tickInterval = GRAPH_INTERVALS.MONTH;
            dataSeries = metricData.dataSeriesYear;
            startDate = metricData.startDateYear;
            finalizedDate = metricData.finalizedDateMonthly;
            tooltipOnlyDataSeries = metricData.tooltipOnlyDataSeriesYear;
            break;
    }
    return {
        dataSeries,
        tickInterval,
        startDate,
        finalizedDate,
        processedDate,
        tooltipOnlyDataSeries,
        tooltipMoMDiffDataSeries,
        tooltipYoYDiffDataSeries,
    };
}
