import PropTypes from 'prop-types';
import React, {Component} from 'react';

import HighchartsWrapper from 'chart/highcharts-wrapper.react-component';
import tokens from 'instructor/variables';
import {formatNumber} from 'utils/numeral';

import styles from './column-chart.less';

export default class ColumnChart extends Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
    };

    formatColumnPercentage() {
        return interpolate(
            gettext('%(percent)s%'),
            {percent: formatNumber(this.y.toFixed(1))},
            true,
        );
    }

    render() {
        const {data} = this.props;

        const config = {
            chart: {
                type: 'column',
                spacing: 1,
            },
            title: {text: null},
            xAxis: {
                type: 'category',
                allowDecimals: false,
                tickLength: 0,
                maxPadding: 0,
                minPadding: 0,
                labels: {
                    style: {textOverflow: 'none'},
                    align: 'center',
                },
            },
            yAxis: {
                visible: true,
                labels: {enabled: false},
                title: {text: null},
                tickInterval: 10,
                max: 100,
                maxPadding: 0,
                minPadding: 0,
            },
            legend: {enabled: false},
            exporting: {enabled: false},
            tooltip: {enabled: false},
            credits: {enabled: false},
            plotOptions: {
                series: {
                    animation: false,
                    states: {
                        hover: {enabled: false},
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: this.formatColumnPercentage,
                    },
                },
                column: {
                    colors: [
                        tokens['color-data-primary-light'],
                        tokens['color-data-primary'],
                        tokens['color-data-secondary-darker'],
                        tokens['color-data-secondary-dark'],
                        tokens['color-data-secondary'],
                    ],
                },
            },
            series: [
                {
                    colorByPoint: true,
                    data,
                },
            ],
        };

        return (
            <HighchartsWrapper
                allowChartUpdate={false}
                containerProps={{className: styles['column-chart']}}
                options={config}
            />
        );
    }
}
