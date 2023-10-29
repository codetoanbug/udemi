import PropTypes from 'prop-types';
import React, {Component} from 'react';

import HighchartsWrapper from 'chart/highcharts-wrapper.react-component';

import styles from './area-chart.less';

export default class AreaChart extends Component {
    static propTypes = {
        series: PropTypes.array.isRequired,
        showXLabels: PropTypes.bool,
    };

    static defaultProps = {
        showXLabels: true,
    };

    render() {
        const {series, showXLabels} = this.props;

        const config = {
            chart: {
                type: 'area',
                spacing: 0,
            },
            title: {text: null},
            xAxis: {
                allowDecimals: false,
                labels: {enabled: showXLabels},
                type: 'datetime',
                dateTimeLabelFormats: {month: '%b'},
                tickLength: 0,
                maxPadding: 0,
                minPadding: 0,
            },
            yAxis: {
                visible: false,
                endOnTick: false,
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
                },
                area: {
                    lineWidth: 0,
                    marker: {enabled: false},
                },
            },
            series,
        };

        return (
            <HighchartsWrapper
                allowChartUpdate={false}
                containerProps={{className: styles['area-chart']}}
                options={config}
            />
        );
    }
}
