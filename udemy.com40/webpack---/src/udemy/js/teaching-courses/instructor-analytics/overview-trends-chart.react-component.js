import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

import HighchartsWrapper from 'chart/highcharts-wrapper.react-component';
import {toLocaleDateString} from 'utils/date';
import {formatNumber} from 'utils/numeral';

import {utcDateFromUTC} from './helpers';
import InfoTooltip from './info-tooltip.react-component';
import {
    configGenerator,
    GRAPH_INTERVALS,
    GRAPH_SUBTYPES,
    GRAPH_TYPES,
} from './instructor-performance-chart-config-generator';
import './overview-trends.less';

export function validateDataSeries(dataSeries, tooltipOnlyDataSeries) {
    const initialDataSeriesLength = dataSeries.length > 0 ? dataSeries[0].data.length : 0;

    dataSeries.forEach((series) => {
        if (series.data.length !== initialDataSeriesLength) {
            throw new RangeError(`OTC: there are dataseries of different lengths:
                ${series.data.length} and ${initialDataSeriesLength}`);
        }
    });

    if (tooltipOnlyDataSeries) {
        tooltipOnlyDataSeries.forEach((series) => {
            if (series.data.length !== initialDataSeriesLength) {
                throw new RangeError(`OTC: there are tooltip ds of different lengths:
                    ${series.data.length} and ${initialDataSeriesLength}`);
            }
        });
    }
}

/**
 * This should be called in the `callback` of `HighchartsWrapper`.
 * For each legend item, it prepends a checkbox, and optionally appends a tooltip.
 */
export const afterRender = (chart) => {
    if (
        !chart ||
        !chart.series ||
        !chart.legend ||
        !chart.legend.allItems ||
        chart.legend.allItems.length === 0
    ) {
        return;
    }

    const tooltips = chart.series.map((x) => x.userOptions.tooltip);
    chart.legend.allItems.forEach((item, index) => {
        const replaceElem = item.legendGroup.div;
        if (!replaceElem) {
            return;
        }

        const label = replaceElem.children[0];
        const labelTop = label.style.top;

        // Add a checkbox to each legend label. Ideally it would be inside the label,
        // but it can't be because Highcharts removes svg markup. See "Improved security..." in
        // https://www.highcharts.com/blog/changelog/#highcharts-v9.0.0
        const checkboxElem = document.createElement('div');
        checkboxElem.setAttribute(
            'style',
            `display:flex; pointer-events:none; position:absolute; left:0; top:${labelTop};`,
        );
        ReactDOM.render(
            <TickIcon label={false} size="xsmall" styleName="legend-checkbox" />,
            checkboxElem,
        );
        replaceElem.appendChild(checkboxElem);

        const tooltip = tooltips[index];
        if (tooltip) {
            // Remove Highcharts tooltip.
            const legendToolId = `legendTool${index}`;
            const prevTooltipElem = document.getElementById(legendToolId);
            if (prevTooltipElem) {
                prevTooltipElem.parentElement.removeChild(prevTooltipElem);
            }

            // Insert our own tooltip. Unlike the checkbox, the tooltip should be outside the
            // label because we don't want it to toggle the series's onclick.
            const labelRight = label.offsetWidth - 20;
            const tooltipElem = document.createElement('div');
            tooltipElem.setAttribute('id', legendToolId);
            // z-index:999 renders tooltip in front of `.highcharts-a11y-proxy-button`.
            tooltipElem.setAttribute(
                'style',
                `display:flex; position:absolute; left:${labelRight}px; top:${labelTop}; z-index:999;`,
            );
            replaceElem.appendChild(tooltipElem);
            ReactDOM.render(
                <InfoTooltip placement="left" size="xsmall">
                    {tooltip}
                </InfoTooltip>,
                tooltipElem,
            );
        }
    });
};

@inject('store')
@observer
export default class OverviewTrendsChart extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        dataSeries: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                data: PropTypes.arrayOf(PropTypes.number),
            }),
        ).isRequired,
        graphType: PropTypes.oneOf([
            GRAPH_TYPES.REVENUE,
            GRAPH_TYPES.RATING,
            GRAPH_TYPES.STUDENTS,
            GRAPH_TYPES.VISITORS,
            GRAPH_TYPES.CONVERSION,
        ]).isRequired,
        startDate: PropTypes.instanceOf(Date).isRequired,
        finalizedDate: PropTypes.instanceOf(Date),
        processedDate: PropTypes.instanceOf(Date),
        tickInterval: PropTypes.oneOf([GRAPH_INTERVALS.MONTH, GRAPH_INTERVALS.DAY]),
        tooltipOnlyDataSeries: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                data: PropTypes.arrayOf(PropTypes.number),
            }),
        ),
        currencySettings: PropTypes.object,
        graphSubType: PropTypes.string,
    };

    static defaultProps = {
        finalizedDate: undefined,
        processedDate: null,
        tickInterval: GRAPH_INTERVALS.MONTH,
        tooltipOnlyDataSeries: undefined,
        currencySettings: {},
        graphSubType: undefined,
    };

    renameANameOfTooltipOnlyDataSeries(tooltipOnlyDataSeries, oldName, newName) {
        tooltipOnlyDataSeries.forEach((dataSeries) => {
            dataSeries.name = dataSeries.name === oldName ? newName : dataSeries.name;
        });
    }

    render() {
        const {
            dataSeries,
            graphType,
            startDate,
            finalizedDate,
            processedDate,
            tickInterval,
            tooltipOnlyDataSeries,
            currencySettings,
            graphSubType,
        } = this.props;

        validateDataSeries(dataSeries, tooltipOnlyDataSeries);
        if (tooltipOnlyDataSeries && tooltipOnlyDataSeries.length > 0) {
            this.renameANameOfTooltipOnlyDataSeries(tooltipOnlyDataSeries, 'UB', 'Udemy Business');
        }

        if (graphSubType === GRAPH_SUBTYPES.UB) {
            tooltipOnlyDataSeries.forEach((tooltipData) => {
                if (tooltipData.name === 'Udemy Business') {
                    dataSeries[0].data = [];
                    dataSeries[0].data.push(...tooltipData.data);
                }
            });
        }

        const config = configGenerator(
            dataSeries,
            graphType,
            startDate,
            finalizedDate,
            processedDate,
            tickInterval,
            tooltipOnlyDataSeries,
            currencySettings,
            tooltipFormatter,
            this.props.store.breakpoints,
            graphSubType,
        );
        return (
            <div styleName="overview-box">
                <HighchartsWrapper
                    key={`chart-${this.props.store.breakpoints.isMdMax}`}
                    allowChartUpdate={false}
                    options={config}
                    callback={afterRender}
                />
            </div>
        );
    }
}

export function tooltipFormatter(
    dataPoint,
    graphType,
    graphSettings,
    tickInterval,
    finalDate,
    processedDate,
    tooltipOnlyDataSeries,
    currencySettings,
    tooltipMoMDataSeries,
    tooltipYoYDataSeries,
) {
    if (!dataPoint) {
        return;
    }

    const date = utcDateFromUTC(new Date(dataPoint.x));
    const showProcessBand =
        processedDate &&
        (tickInterval === GRAPH_INTERVALS.DAY
            ? dataPoint.x > processedDate.getTime()
            : (date.getMonth() > processedDate.getMonth() &&
                  date.getFullYear() === processedDate.getFullYear()) ||
              date.getFullYear() > processedDate.getFullYear());

    const dateFormat = {year: 'numeric', month: 'long', timeZone: 'UTC'};
    if (tickInterval === GRAPH_INTERVALS.DAY) {
        dateFormat.day = 'numeric';
    }
    const title = toLocaleDateString(date, dateFormat);

    if (showProcessBand) {
        return ReactDOMServer.renderToStaticMarkup(
            <div className="ud-text-xs" styleName="data-point-tooltip">
                <div>{title}</div>
                <div>{gettext('Data is being processed')}</div>
            </div>,
        );
    }

    const subtitleText =
        graphType === GRAPH_TYPES.REVENUE
            ? gettext('(not yet finalized)')
            : gettext('(not yet complete)');
    const subtitle = finalDate && dataPoint.x > finalDate.getTime() ? subtitleText : '';

    if (
        !dataPoint.points ||
        !dataPoint.points[0].point ||
        dataPoint.points[0].point.index === null ||
        typeof dataPoint.points[0].point.index === 'undefined'
    ) {
        return;
    }
    const index = dataPoint.points[0].point.index;

    const tooltipOnlyDataPoints = tooltipOnlyDataSeries
        ? tooltipOnlyDataSeries.map((x) => {
              return {
                  name: x.name,
                  data: x.data[index],
              };
          })
        : [];

    const tooltipMoMDataPoints = tooltipMoMDataSeries
        ? tooltipMoMDataSeries.map((x) => {
              return {
                  name: x.name,
                  data: x.data[index],
              };
          })
        : [];

    const tooltipYoYDataPoints = tooltipYoYDataSeries
        ? tooltipYoYDataSeries.map((x) => {
              return {
                  name: x.name,
                  data: x.data[index],
              };
          })
        : [];

    const tooltipProps = {
        title,
        subtitle,
        points: dataPoint.points,
        valueFormatter: (value) => graphSettings.format(value, true),
        tooltipOnlyDataPoints,
        tooltipMoMDataPoints,
        tooltipYoYDataPoints,
    };

    if (graphType === GRAPH_TYPES.CONVERSION) {
        return ReactDOMServer.renderToStaticMarkup(conversionTooltip(tooltipProps));
    } else if (graphType === GRAPH_TYPES.ENGAGEMENT) {
        return ReactDOMServer.renderToStaticMarkup(engagementTooltip(tooltipProps));
    }
    Object.assign(tooltipProps, {
        valueFormatter: (value) => graphSettings.format(value, true, currencySettings),
        currencySettings,
    });
    return ReactDOMServer.renderToStaticMarkup(overviewTooltip(tooltipProps));
}

function generateDateDiffTooltip(type, dataPoints, index, valueFormatter) {
    if (type === 'MoM') {
        return momTooltip(dataPoints, index, valueFormatter);
    } else if (type === 'YoY') {
        return yoyTooltip(dataPoints, index, valueFormatter);
    }
    return null;
}

function momTooltip(dataPoints, index, valueFormatter) {
    if (dataPoints && dataPoints.length > 0 && dataPoints[0].data !== null) {
        return (
            <div key={`mom${index}`}>
                {dataPoints[0].data > -1 && dataPoints[0].data < 1 ? (
                    <b>{gettext('Less than 1% change compared to previous month')}</b>
                ) : dataPoints[0].data > 0 ? (
                    <b>
                        {ninterpolate(
                            '+%(increase)s% compared to previous month',
                            '+%(increase)s% compared to previous month',
                            dataPoints[0].data,
                            {
                                increase: valueFormatter(dataPoints[0].data),
                            },
                        )}
                    </b>
                ) : (
                    <b>
                        {ninterpolate(
                            '%(decrease)s% compared to previous month',
                            '%(decrease)s% compared to previous month',
                            dataPoints[0].data,
                            {
                                decrease: valueFormatter(dataPoints[0].data),
                            },
                        )}
                    </b>
                )}
            </div>
        );
    }
}

function yoyTooltip(dataPoints, index, valueFormatter) {
    if (dataPoints && dataPoints.length > 0 && dataPoints[0].data !== null) {
        return (
            <div key={`yoy${index}`}>
                {dataPoints[0].data > -1 && dataPoints[0].data < 1 ? (
                    <b>{gettext('Less than 1% change compared to previous year')}</b>
                ) : dataPoints[0].data > 0 ? (
                    <b>
                        {ninterpolate(
                            '+%(increase)s% compared to previous year',
                            '+%(increase)s% compared to previous year',
                            dataPoints[0].data,
                            {
                                increase: valueFormatter(dataPoints[0].data),
                            },
                        )}
                    </b>
                ) : (
                    <b>
                        {ninterpolate(
                            '%(decrease)s% compared to previous year',
                            '%(decrease)s% compared to previous year',
                            dataPoints[0].data,
                            {
                                decrease: valueFormatter(dataPoints[0].data),
                            },
                        )}
                    </b>
                )}
            </div>
        );
    }
}

function engagementTooltip(props) {
    const {
        title,
        subtitle,
        points,
        valueFormatter,
        tooltipOnlyDataPoints,
        tooltipMoMDataPoints,
        tooltipYoYDataPoints,
    } = props;

    const rows = points.map((point, index) => (
        <div key={index} className="ud-text-bold">
            {ninterpolate('%(minutes)s minute taught', '%(minutes)s minutes taught', point.y, {
                minutes: valueFormatter(point.y),
            })}
        </div>
    ));

    const tooltipOnlyRows = tooltipOnlyDataPoints
        ? tooltipOnlyDataPoints.map((point, index) => (
              <div key={`all${index}`}>
                  <div key={`opt${index}`}>
                      {ninterpolate(
                          '(%(students)s student)',
                          '(%(students)s students)',
                          tooltipOnlyDataPoints[0].data,
                          {students: valueFormatter(tooltipOnlyDataPoints[0].data)},
                      )}
                  </div>
                  {generateDateDiffTooltip('MoM', tooltipMoMDataPoints, index, valueFormatter)}
                  {generateDateDiffTooltip('YoY', tooltipYoYDataPoints, index, valueFormatter)}
              </div>
          ))
        : [];

    return (
        <div className="ud-text-xs" styleName="data-point-tooltip">
            <div>
                {title}
                {subtitle && ' '}
                {subtitle}
            </div>
            {rows}
            {tooltipOnlyRows}
        </div>
    );
}

function conversionTooltip(props) {
    const {title, subtitle, points, valueFormatter, tooltipOnlyDataPoints} = props;

    const rows = points.map((point, index) => {
        const series = point.series;
        const rowProps = {
            pointColor: series.color,
            title: series.name,
            value: valueFormatter(point.y),
            secondaryValue: ninterpolate(
                '(%(enrolls)s enrollment from %(visitors)s visitors)',
                '(%(enrolls)s enrollments from %(visitors)s visitors)',
                tooltipOnlyDataPoints[0].data,
                {
                    enrolls: formatNumber(tooltipOnlyDataPoints[0].data),
                    visitors: formatNumber(tooltipOnlyDataPoints[1].data),
                },
            ),
            key: index,
        };
        return overviewTooltipRow(rowProps);
    });

    return (
        <div className="ud-text-xs" styleName="data-point-tooltip">
            <div>
                {title}
                {subtitle && ' '}
                {subtitle}
            </div>
            {rows}
        </div>
    );
}

function overviewTooltip(props) {
    const {
        title,
        subtitle,
        points,
        valueFormatter,
        tooltipOnlyDataPoints,
        currencySettings,
    } = props;
    const rows = points.map((point, index) => {
        const series = point.series;
        const rowProps = {
            pointColor: series.color,
            title: series.name,
            value: valueFormatter(point.y, currencySettings),
            key: index,
        };
        return overviewTooltipRow(rowProps);
    });

    const tooltipOnlyRows = tooltipOnlyDataPoints
        ? tooltipOnlyDataPoints.map((point, index) => {
              const rowProps = {
                  title: point.name,
                  value: valueFormatter(point.data, currencySettings),
                  key: `opt${index}`,
              };
              return overviewTooltipRow(rowProps);
          })
        : [];

    return (
        <div className="ud-text-xs" styleName="data-point-tooltip">
            <div>
                {title}
                {subtitle && ' '}
                {subtitle}
            </div>
            {rows}
            {tooltipOnlyRows.length > 0 && <hr />}
            {tooltipOnlyRows}
        </div>
    );
}

const propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    points: PropTypes.arrayOf(PropTypes.object).isRequired,
    valueFormatter: PropTypes.func.isRequired,
    tooltipOnlyDataPoints: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            data: PropTypes.number,
        }),
    ),
    tooltipMoMDataPoints: PropTypes.arrayOf(
        PropTypes.shape({
            data: PropTypes.number,
        }),
    ),
    tooltipYoYDataPoints: PropTypes.arrayOf(
        PropTypes.shape({
            data: PropTypes.number,
        }),
    ),
};

const defaultProps = {
    subtitle: undefined,
    tooltipOnlyDataPoints: undefined,
    tooltipMoMDataPoints: undefined,
    tooltipYoYDataPoints: undefined,
};

overviewTooltip.propTypes = {
    ...propTypes,
    currencySettings: PropTypes.object,
};

overviewTooltip.defaultProps = {
    ...defaultProps,
    currencySettings: undefined,
};

conversionTooltip.propTypes = propTypes;

conversionTooltip.defaultProps = defaultProps;

engagementTooltip.propTypes = propTypes;

engagementTooltip.defaultProps = defaultProps;

function overviewTooltipRow(props) {
    const {pointColor, title, value, secondaryValue, key} = props;
    const colorStyle = pointColor ? {color: pointColor} : {opacity: 0};
    return (
        <div key={key}>
            <span style={colorStyle}>{'\u25CF '}</span>
            {title}
            {': '}
            <span className="ud-text-bold">{value}</span>
            {secondaryValue && ' '}
            {secondaryValue}
        </div>
    );
}

overviewTooltipRow.propTypes = {
    pointColor: PropTypes.string,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    secondaryValue: PropTypes.string,
    key: PropTypes.number.isRequired,
};

overviewTooltipRow.defaultProps = {
    pointColor: undefined,
    secondaryValue: undefined,
};
