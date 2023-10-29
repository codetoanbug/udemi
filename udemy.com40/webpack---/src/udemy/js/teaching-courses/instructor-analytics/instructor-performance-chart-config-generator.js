import {tokens} from '@udemy/styles';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import instructorTokens from 'instructor/variables';
import formatCurrency from 'utils/currency-formatter';
import getConfigData from 'utils/get-config-data';
import {formatNumber} from 'utils/numeral';

import {formatRoundNumber, formatPercent, utcDateFromLocalTime} from './helpers';
import './overview-trends.less';

const udConfig = getConfigData();

export const GRAPH_TYPES = {
    REVENUE: 'revenue',
    STUDENTS: 'students',
    RATING: 'rating',
    VISITORS: 'visitors',
    CONVERSION: 'conversion',
    ENGAGEMENT: 'engagement',
};

export const GRAPH_SUBTYPES = {
    ALL: 'all',
    UB: 'ub',
};

const updateColor = (graphSubType, color) => {
    if (graphSubType && graphSubType === GRAPH_SUBTYPES.UB) {
        return instructorTokens['color-data-ub-primary'];
    }
    return color;
};

const MS_IN_DAY = 24 * 3600 * 1000;
const HIGHCHART_MONTH_LENGTH = 30; // Highcharts handles tickamounts *near* month-long to be month-long.
export const GRAPH_INTERVALS = {
    MONTH: MS_IN_DAY * HIGHCHART_MONTH_LENGTH,
    DAY: MS_IN_DAY,
};

export const GRAPH_SETTINGS = {
    [GRAPH_TYPES.REVENUE]: {
        backgroundColor: tokens['color-white'],
        format: (value) => formatCurrency(value, udConfig.price_country.usd_currency_formatter),
        color: [instructorTokens['color-data-primary-all']],
    },
    [GRAPH_TYPES.STUDENTS]: {
        backgroundColor: tokens['color-white'],
        format: (value) => {
            return value % 1 === 0 ? formatNumber(value) : '';
        },
        color: [instructorTokens['color-data-primary-all']],
    },
    [GRAPH_TYPES.RATING]: {
        backgroundColor: tokens['color-white'],
        format: (value) => {
            return formatRoundNumber(value, 2);
        },
        color: [instructorTokens['color-data-primary-all']],
    },
    [GRAPH_TYPES.VISITORS]: {
        backgroundColor: tokens['color-white'],
        format: (value, isTooltip) => {
            if (!isTooltip && value % 1 !== 0) {
                return '';
            }
            if (isTooltip) {
                return ninterpolate('%(num)s visitor', '%(num)s visitors', value, {
                    num: formatNumber(value),
                });
            }
            return formatNumber(value);
        },
        color: [
            instructorTokens['color-blue'],
            instructorTokens['color-orange-dark'],
            instructorTokens['color-primary'],
            instructorTokens['color-danger'],
            instructorTokens['color-green'],
            instructorTokens['color-blue-dark'],
        ],
        yAxisTitle: gettext('Landing page visitors'),
        legend: true,
        visible: [true, false, false, false, false, false],
    },
    [GRAPH_TYPES.CONVERSION]: {
        backgroundColor: tokens['color-white'],
        format: (value) => {
            return formatPercent(value * 100, 2);
        },
        color: [tokens['color-gray-500']],
        yAxisTitle: gettext('Conversion rate'),
    },
    [GRAPH_TYPES.ENGAGEMENT]: {
        backgroundColor: tokens['color-white'],
        type: 'column',
        format: (value) => {
            const roundedValue = Math.round(value);
            return value > 0 && roundedValue < 1
                ? formatRoundNumber(value, 2)
                : formatNumber(roundedValue);
        },
        color: [instructorTokens['color-data-primary-all']],
    },
};

export function configGenerator(
    dataSeries,
    graphType,
    startDate,
    finalizedDate,
    processedDate,
    tickInterval,
    tooltipOnlyDataSeries,
    currencySettings,
    tooltipFormatter,
    breakpoints,
    graphSubType,
    tooltipMoMDataSeries,
    tooltipYoYDataSeries,
) {
    const graphSettings = GRAPH_SETTINGS[graphType];
    const series = seriesGenerator(
        dataSeries,
        graphSettings,
        startDate,
        finalizedDate,
        processedDate,
        tickInterval,
        graphSubType,
    );
    const utcFinalizedDate = finalizedDate ? utcDateFromLocalTime(finalizedDate) : null;
    const utcProcessedDate = processedDate ? utcDateFromLocalTime(processedDate) : null;

    return {
        chart: {
            backgroundColor: graphSettings.backgroundColor || tokens['color-gray-100'],
            type: graphSettings.type || 'line',
            height: breakpoints.isMdMax ? (graphSettings.legend ? 406 : 250) : null,
            useUTC: true,
            marginRight: graphSettings.legend ? null : 0,
            style: {
                fontFamily: tokens['font-stack-text'],
            },
            spacingTop: 24,
        },
        title: {
            text: '',
        },

        subtitle: {
            text: '',
        },

        plotOptions: {
            series: {
                stacking: graphSettings.stacking,
                pointPadding: 0,
                maxPointWidth: 50,
                states: {
                    inactive: {
                        opacity: 1,
                    },
                },
            },
        },

        xAxis: {
            type: 'datetime',
            title: {
                text: '',
            },
            tickInterval: series[0].data.length > 16 ? tickInterval * 2 : tickInterval,
            labels: {
                rotation: -45,
                style: {
                    color: tokens['color-gray-500'],
                    fontSize: '12px',
                },
            },
            dateTimeLabelFormats: {
                day: '%b %e',
            },
            visible: dataSeries[0].data.length > 0,
        },

        yAxis: {
            gridLineWidth: 1,
            gridLineColor: tokens['color-gray-200'],
            title: {
                text: graphSettings.yAxisTitle || '',
                x: -10,
            },
            endOnTick: false,
            labels: {
                formatter() {
                    return graphSettings.format(this.value, false, currencySettings);
                },
                style: {
                    color: tokens['color-gray-500'],
                    fontSize: '12px',
                },
            },
        },

        legend: graphSettings.legend
            ? {
                  layout: breakpoints.isMdMax ? 'horizontal' : 'vertical',
                  align: breakpoints.isMdMax ? 'center' : 'right',
                  verticalAlign: breakpoints.isMdMax ? 'bottom' : 'middle',
                  symbolPadding: 0,
                  symbolWidth: 0,
                  symbolRadius: 0,
                  margin: breakpoints.isMdMax ? 16 : 24,
                  padding: breakpoints.isMdMax ? 8 : 0,
                  itemMarginTop: 4,
                  useHTML: true,
                  labelFormatter() {
                      return legendLabelFormatter(this);
                  },
              }
            : {
                  enabled: false,
              },

        tooltip: {
            borderWidth: 0,
            padding: 0,
            shared: true,
            useHTML: true,
            formatter() {
                return tooltipFormatter(
                    this,
                    graphType,
                    graphSettings,
                    tickInterval,
                    utcFinalizedDate,
                    utcProcessedDate,
                    tooltipOnlyDataSeries,
                    currencySettings,
                    tooltipMoMDataSeries,
                    tooltipYoYDataSeries,
                );
            },
        },
        credits: false,
        exporting: {enabled: false},
        series,
    };
}

export function seriesGenerator(
    dataSeries,
    graphSettings,
    startDate,
    finalizedDate,
    processedDate,
    tickInterval,
    graphSubType,
) {
    const utcStartDate = utcDateFromLocalTime(startDate);
    const utcFinalizedDate = finalizedDate ? utcDateFromLocalTime(finalizedDate) : null;
    const utcProcessedDate = processedDate ? utcDateFromLocalTime(processedDate) : null;
    const pointRadius = dataSeries[0].data.length > 1 ? 0 : 4;

    const defaultZoneEnd = finalizedDate
        ? utcFinalizedDate.getTime() + 1
        : processedDate
        ? utcProcessedDate.getTime() + 1
        : null;

    return dataSeries.map((singleSeries, index) => {
        const zone = [
            {
                value: defaultZoneEnd,
            },
            {
                value: processedDate ? utcProcessedDate.getTime() : null,
                color: tokens['color-gray-300'],
            },
            {
                color: 'rgba(0,0,0,0)',
            },
            {
                color: updateColor(graphSubType, graphSettings.color[index]),
            },
        ];

        return {
            data: singleSeries.data,
            pointStart: utcStartDate.getTime(),
            pointIntervalUnit: tickInterval === GRAPH_INTERVALS.DAY ? 'day' : 'month',
            color: updateColor(graphSubType, graphSettings.color[index]),
            name: singleSeries.name,
            tooltip: singleSeries.tooltip,
            visible: graphSettings.visible ? graphSettings.visible[index] : true,
            lineWidth: 3,
            marker: {
                radius: pointRadius,
            },
            label: {
                enabled: false,
            },
            zoneAxis: 'x',
            zones: zone,
            events: {
                hide() {
                    this.chart.legend.render();
                },
                show() {
                    this.chart.legend.render();
                },
            },
        };
    });
}

export function legendLabelFormatter(series) {
    return ReactDOMServer.renderToStaticMarkup(
        <div className="ud-text-xs" styleName="legend-label">
            <div style={{backgroundColor: series.color}} styleName="legend-color" />
            {series.name}
        </div>,
    );
}
