import {observer} from 'mobx-react';
import React from 'react';

import HighchartsWrapper from 'chart/highcharts-wrapper.react-component';

import ArrowRightPng from '../../../assets/images/arrow-right.png';
import styles from './quiz-metrics-funnel.less';

interface QuizMetricsFunnelProps {
    series: Array<number>;
    fillColor: string;
    lineColor: string;
    gridLineColor: string;
}
export const QuizMetricsFunnel = observer(
    ({series, fillColor, lineColor, gridLineColor}: QuizMetricsFunnelProps) => {
        function formatArrowMarkers() {
            // ArrowRightPng should match arrow-right.ud-icon. We cannot use the icon because
            // Highcharts removes svg markup. See "Improved security..." in
            // https://www.highcharts.com/blog/changelog/#highcharts-v9.0.0
            return `<div class="${styles['chart-marker']}" style="background-color: ${fillColor}"><img src="${ArrowRightPng}"  width="24" height="24" /></div>`;
        }

        function getConfig() {
            const markerSeries = series.slice(1, series.length - 1).map(() => 0);

            return {
                title: {text: ''},
                credits: {enabled: false},
                tooltip: {enabled: false},
                chart: {
                    type: 'area',
                    height: 200,
                    marginTop: 0,
                    marginBottom: 0,
                    marginLeft: 1,
                    marginRight: 0,
                },
                xAxis: {
                    min: 0,
                    minPadding: 0,
                    maxPadding: 0,
                    tickInterval: 1,
                    gridLineWidth: 1,
                    gridLineColor,
                    gridZIndex: 4,
                    title: {enabled: false},
                    labels: {enabled: false},
                    legend: {enabled: false},
                },
                yAxis: {
                    min: -100,
                    max: 100,
                    lineWidth: 0,
                    gridLineWidth: 0,
                    minorGridLineWidth: 0,
                    title: {enabled: false},
                    labels: {enabled: false},
                    legend: {enabled: false},
                },
                plotOptions: {
                    series: {
                        marker: {enabled: false},
                        enableMouseTracking: false,
                        showInLegend: false,
                        fillOpacity: 0.5,
                    },
                },
                series: [
                    {
                        type: 'area',
                        lineWidth: 3,
                        fillColor,
                        color: lineColor,
                        data: series,
                        zones: [
                            {
                                fillColor,
                            },
                        ],
                    },
                    {
                        type: 'line',
                        data: [null, ...markerSeries, null],
                        color: '#00000000', // transparent
                        dataLabels: {
                            enabled: true,
                            verticalAlign: 'middle',
                            useHTML: true,
                            formatter: formatArrowMarkers,
                        },
                    },
                    {
                        type: 'area',
                        lineWidth: 3,
                        fillColor,
                        color: lineColor,
                        data: series.map((item: number) => -item),
                        zones: [
                            {
                                fillColor,
                            },
                        ],
                    },
                ],
            };
        }

        return <HighchartsWrapper options={getConfig()} />;
    },
);
