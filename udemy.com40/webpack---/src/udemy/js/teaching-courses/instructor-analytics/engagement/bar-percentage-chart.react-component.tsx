import {Badge} from '@udemy/react-messaging-components';
import React, {Component} from 'react';
import {renderToString} from 'react-dom/server';

import HighchartsWrapper from '../../../chart/highcharts-wrapper.react-component';
import {Breakdown, BreakdownGroup} from '../types';

import './bar-percentage-chart.less';

interface BarPercentageChartProps {
    title: string;
    subtitle: string;
    colorPalette: 'all' | 'ub';
    breakdownGroups: Array<BreakdownGroup>;
}

export class BarPercentageChart extends Component<BarPercentageChartProps> {
    static defaultProps = {
        title: gettext('Device trends for course consumption'),
        subtitle: gettext(
            'This chart shows the overall consumption of the selected course by device usage over the selected time period. Hover to see more details.',
        ),
        colorPalette: 'all',
    };

    generateTooltip(breakdownGroup: BreakdownGroup) {
        let result = this.generateTooltipHeadline(breakdownGroup);
        const details = gettext('Details');
        if (breakdownGroup.breakdowns.length > 1) {
            result += '<hr /><p class="details">';
            result += details;
            result += '</p>';
            for (let i = 0; i < breakdownGroup.breakdowns.length; i++) {
                result += this.generateTooltipBreakdownLine(breakdownGroup.breakdowns[i]);
            }
        }
        return result;
    }

    generateTooltipHeadline(breakdownGroup: BreakdownGroup) {
        const {percentage, type} = breakdownGroup;
        return `<p class="headline"><b>${percentage.toFixed(
            1,
        )}${'% '}</b>${this.firstLetterToUpperCase(type)}</p>`;
    }

    generateTooltipBreakdownLine(breakdown: Breakdown) {
        const {percentage, type} = breakdown;
        return `<p class="breakdown"><b>${percentage.toFixed(
            1,
        )}%</b>${' '}${this.firstLetterToUpperCase(type)}</p>`;
    }

    firstLetterToUpperCase(text: string) {
        return text[0].toUpperCase() + text.slice(1);
    }

    convertToSeries(breakdownGroups: Array<BreakdownGroup>, colorPalette: string) {
        const allColors = ['#B4690E', '#2D907F'];
        const ubColors = ['#5524D0', '#2D907F'];
        const objects = [];
        const valueLength = breakdownGroups.length;
        for (let i = 0; i < valueLength; i++) {
            objects.push({
                name: breakdownGroups[i].headline,
                data: [breakdownGroups[i].percentage],
                color: colorPalette === 'all' ? allColors[i] : ubColors[i],
                events: {
                    legendItemClick(e: Event) {
                        e.preventDefault();
                    },
                },
                index: i,
                tooltip: {
                    pointFormat: this.generateTooltip(breakdownGroups[i]),
                },
            });
        }
        return objects;
    }

    render() {
        const {subtitle, breakdownGroups, colorPalette} = this.props;
        const series = this.convertToSeries(breakdownGroups, colorPalette);
        const title = (
            <>
                {this.props.title}
                <Badge styleName="ub-badge">{gettext('New')}</Badge>
            </>
        );

        const properties = {
            chart: {
                type: 'bar',
                padding: 0,
                margin: 0,
                height: 200,
            },
            credits: {enabled: false},
            title: {
                text: renderToString(title),
                useHTML: true,
                align: 'left',
                margin: 0,
                padding: 0,
                style: {
                    fontWeight: 'bold',
                },
            },
            subtitle: {
                margin: 0,
                padding: 0,
                text: subtitle,
                align: 'left',
            },
            xAxis: {
                categories: [''],
                visible: true,
                lineWidth: 0,
                minorGridLineWidth: 0,
                lineColor: 'transparent',
                margin: 0,
            },
            yAxis: {
                visible: false,
                margin: 0,
            },
            legend: {
                reversed: true,
                margin: 0,
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    pointWidth: 40,
                },
            },
            tooltip: {
                useHTML: true,
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderColor: 'rgba(255, 255, 255, 1)',
                margin: 0,
                padding: 0,
            },
            responsive: {
                rules: [
                    {
                        condition: {
                            maxWidth: 500,
                        },
                        chartOptions: {
                            subtitle: {
                                text: '',
                            },
                        },
                    },
                ],
            },
            series,
        };
        return (
            <div styleName="panel consumption" data-purpose="consumption-chart">
                <div styleName="container chart-container">
                    <HighchartsWrapper
                        key={`chart-device-consumption`}
                        allowChartUpdate={false}
                        options={properties}
                        data-purpose="consumption-chart-div"
                    />
                </div>
                <div styleName="summary"></div>
            </div>
        );
    }
}
