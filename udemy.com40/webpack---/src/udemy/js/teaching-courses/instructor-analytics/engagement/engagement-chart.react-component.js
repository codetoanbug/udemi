import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import HighchartsWrapper from 'chart/highcharts-wrapper.react-component';
import qs from 'utils/query-params';

import {graphDataByDateRange} from '../analytics-chart.react-component';
import {DATA_SCOPE_FILTERS, DATE_RANGE} from '../constants';
import {
    configGenerator,
    GRAPH_TYPES,
    GRAPH_SUBTYPES,
} from '../instructor-performance-chart-config-generator';
import {tooltipFormatter, validateDataSeries} from '../overview-trends-chart.react-component';
import './engagement-route.less';

@withRouter
@inject('store')
@observer
export default class EngagementChart extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        data: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        scopeFilter: PropTypes.string,
        dateFilter: PropTypes.string,
        isPracticeInsights: PropTypes.bool,
    };

    static defaultProps = {
        scopeFilter: 'all',
        dateFilter: 'none',
        isPracticeInsights: false,
    };

    generateData(data, type) {
        if (type === 'Month') {
            const emptyRecordCount = 1;
            return this.generateDiffRatioData(data, emptyRecordCount);
        } else if (type === 'Year') {
            const emptyRecordCount = 12;
            return this.generateDiffRatioData(data, emptyRecordCount);
        }
        return null;
    }

    generateDiffRatioData(data, emptyRecordCount) {
        let result = null;
        if (data && data.monthly) {
            result = [];
            for (let i = 0; i < data.monthly.length - 1; i++) {
                if (i - emptyRecordCount >= 0) {
                    const previous = data.monthly[i - emptyRecordCount].minutes_taught;
                    if (previous && previous > 0) {
                        const diffFromPrev = Math.round(
                            100.0 * ((data.monthly[i].minutes_taught - previous) / previous),
                        );
                        result.push(diffFromPrev);
                    } else {
                        result.push(null);
                    }
                } else {
                    result.push(null);
                }
            }
            result.push(null);
        }
        return result;
    }

    render() {
        const {data, dateFilter, isPracticeInsights} = this.props;
        let temp = 'none';
        if (dateFilter) {
            if (dateFilter === 'last_7days') {
                temp = DATE_RANGE.WEEK;
            } else if (dateFilter === 'last_30days') {
                temp = DATE_RANGE.MONTH;
            } else if (dateFilter === 'last_12months') {
                temp = DATE_RANGE.YEAR;
            } else if (dateFilter === 'all') {
                temp = DATE_RANGE.ALL_TIME;
            }
        }
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        queryParams.date_filter = queryParams.date_filter
            ? queryParams.date_filter
            : DATE_RANGE.YEAR;

        const subType =
            this.props.scopeFilter === DATA_SCOPE_FILTERS.UB
                ? GRAPH_SUBTYPES.UB
                : GRAPH_SUBTYPES.ALL;

        const momData = isPracticeInsights ? null : this.generateData(data, 'Month');
        const yoyData = isPracticeInsights ? null : this.generateData(data, 'Year');

        const graphData = graphDataByDateRange(
            temp === 'none' ? queryParams.date_filter : temp,
            data,
            GRAPH_TYPES.ENGAGEMENT,
            momData,
            yoyData,
        );

        if (graphData.dataSeries[0].data.length === 0) {
            return (
                <div styleName="chart-empty" data-purpose="no-data">
                    {gettext('No data to display.')}
                </div>
            );
        }

        validateDataSeries(graphData.dataSeries, graphData.tooltipOnlyDataSeries);

        const config = configGenerator(
            graphData.dataSeries,
            GRAPH_TYPES.ENGAGEMENT,
            graphData.startDate,
            graphData.finalizedDate,
            graphData.processedDate,
            graphData.tickInterval,
            graphData.tooltipOnlyDataSeries,
            {},
            tooltipFormatter,
            this.props.store.breakpoints,
            subType,
            graphData.tooltipMoMDiffDataSeries,
            graphData.tooltipYoYDiffDataSeries,
        );
        return (
            <HighchartsWrapper
                key={`chart-${this.props.store.breakpoints.isMdMax}`}
                allowChartUpdate={false}
                options={config}
                data-purpose="engagement-chart"
            />
        );
    }
}
