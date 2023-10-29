import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import {Button} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import {formatNumber} from 'utils/numeral';

import {CHANNEL_LABELS} from '../instructor-analytics/constants';
import AreaChart from './area-chart.react-component';
import ColumnChart from './column-chart.react-component';
import {langDict} from './constants.js';
import CourseLabelMetricsLink, {
    LINK_ORIGIN,
    LINK_SIZE,
    courseLabelStar,
} from './course-label-metrics-link.react-component';
import {MPI_CHANNELS, RECOMMENDATION} from './course-label-metrics.mobx-model';
import {
    ChannelsTooltip,
    ConversionTooltip,
    InsightsTooltip,
} from './metrics-tooltip.react-component';
import PercentileChart from './percentile-chart.react-component';
import WidePanel from './wide-panel.react-component';
/* eslint-disable no-unused-vars,import/order */
import baseStyles from './insights.less';
import styles from './course-label-metrics.less';
/* eslint-enable no-unused-vars,import/order */

@observer
export default class CourseLabelMetricsDemand extends Component {
    static propTypes = {
        courseLabelMetrics: PropTypes.object.isRequired,
    };

    searchTrendChartData(monthlySearchVolume) {
        return [
            {
                data: monthlySearchVolume.map((obj) => obj.num_visitor_normalized),
                pointStart: (monthlySearchVolume.length > 0
                    ? new Date(monthlySearchVolume[0].month)
                    : new Date()
                ).getTime(),
                pointIntervalUnit: 'month',
            },
        ];
    }

    channelsChartData(channels) {
        return Object.values(MPI_CHANNELS)
            .map((channel) => {
                const obj = channels.find((obj) => obj.channel === channel);
                return (
                    obj && [
                        CHANNEL_LABELS[channel],
                        parseFloat(obj.perc_paid_enrollment.toFixed(1)),
                    ]
                );
            })
            .filter((dataObj) => dataObj);
    }

    render() {
        const {courseLabelMetrics} = this.props;
        const conversionRate = courseLabelMetrics.conversion_rate
            ? interpolate(
                  gettext('%(percent)s%'),
                  {percent: formatNumber(courseLabelMetrics.conversion_rate.toFixed(1))},
                  true,
              )
            : '— —';
        return (
            <div>
                <div
                    className="ud-text-xl"
                    styleName="baseStyles.text-xl baseStyles.text-center baseStyles.rmt-xxl"
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'course-label-metrics-demand:student-demand',
                        html: interpolate(
                            gettext('Student demand for %(language)s courses on %(topic)s'),
                            {
                                language: langDict[courseLabelMetrics.course_lang],
                                topic: `<strong>${courseLabelMetrics.course_label.display_name}</strong>`,
                            },
                            true,
                        ),
                    })}
                />
                <WidePanel styleName="baseStyles.mt-md">
                    <div styleName="styles.metrics-row" data-purpose="search">
                        <div styleName="styles.metrics-col styles.metrics-col-2 styles.search-metrics-col">
                            <InsightsTooltip
                                calculation={interpolate(
                                    gettext(
                                        'Percentile is based on the number of unique students who searched your Topic on Udemy ' +
                                            'over the last 3 months. Demand for this Topic is higher than %s% of Topics currently on Udemy.',
                                    ),
                                    [courseLabelMetrics.search_volume_percentile],
                                )}
                                insight={gettext(
                                    'Search volume can be used to determine how much organic traffic you might expect to your course.',
                                )}
                            >
                                <div styleName="styles.metrics-panel">
                                    <div
                                        className="ud-text-lg"
                                        styleName="baseStyles.text-lg baseStyles.text-center baseStyles.flex"
                                    >
                                        <div styleName="styles.metrics-title">
                                            {gettext('Search volume percentile across topics')}
                                            <InfoIcon
                                                label={false}
                                                styleName="styles.metrics-info-icon"
                                            />
                                        </div>
                                    </div>
                                    <div styleName="baseStyles.mt-md styles.border-box styles.search-metrics-panel-chart">
                                        <PercentileChart
                                            percentile={courseLabelMetrics.search_volume_percentile}
                                        />
                                    </div>
                                </div>
                            </InsightsTooltip>
                        </div>
                        <div styleName="styles.metrics-col styles.metrics-col-2 styles.search-metrics-col">
                            <InsightsTooltip
                                calculation={ninterpolate(
                                    'Relative number of distinct students searching for courses on your Topic over the last month.',
                                    'Relative number of distinct students searching for courses on your Topic over the last %s months.',
                                    courseLabelMetrics.monthly_search_volume.length,
                                )}
                                insight={gettext(
                                    'This trend will likely impact revenue potential over time.',
                                )}
                            >
                                <div styleName="styles.metrics-panel">
                                    <div
                                        className="ud-text-lg"
                                        styleName="baseStyles.text-lg baseStyles.text-center baseStyles.flex"
                                    >
                                        <div styleName="styles.metrics-title">
                                            {gettext('Search volume trend')}
                                            <InfoIcon
                                                label={false}
                                                styleName="styles.metrics-info-icon"
                                            />
                                        </div>
                                    </div>
                                    <div styleName="baseStyles.mt-md styles.border-box styles.search-metrics-panel-chart">
                                        <AreaChart
                                            series={this.searchTrendChartData(
                                                courseLabelMetrics.monthly_search_volume,
                                            )}
                                        />
                                    </div>
                                </div>
                            </InsightsTooltip>
                        </div>
                    </div>
                    <div
                        styleName="baseStyles.rmt-xxl styles.metrics-row styles.related-metrics-row"
                        data-purpose="related"
                    >
                        <div styleName="styles.metrics-col styles.metrics-col-2 styles.related-metrics-col">
                            <InsightsTooltip
                                calculation={gettext(
                                    'Search keywords that led to enrollments in courses on your Topic. ' +
                                        'Only search terms that led to 1% or more of enrollments are included.',
                                )}
                                insight={gettext(
                                    'These are the search keywords that students use to find existing courses on your Topic.',
                                )}
                            >
                                <div styleName="styles.metrics-panel">
                                    <div
                                        className="ud-text-lg"
                                        styleName="baseStyles.text-lg baseStyles.text-center styles.metrics-title"
                                    >
                                        {gettext('Top search keywords')}
                                        <InfoIcon
                                            label={false}
                                            styleName="styles.metrics-info-icon"
                                        />
                                    </div>
                                    <table styleName="baseStyles.mt-md styles.border-box styles.table">
                                        <tbody>
                                            {courseLabelMetrics.limitedTopQueries.map(
                                                (queryData) => (
                                                    <tr key={queryData.id}>
                                                        <td>{queryData.query}</td>
                                                        <td>
                                                            {interpolate(
                                                                gettext('%(percent)s%'),
                                                                {
                                                                    percent: formatNumber(
                                                                        queryData.perc_landed,
                                                                    ),
                                                                },
                                                                true,
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                    {courseLabelMetrics.hasMoreTopQueriesToShow && (
                                        <div styleName="baseStyles.text-center">
                                            <Button
                                                udStyle="ghost"
                                                size="medium"
                                                onClick={courseLabelMetrics.toggleShowMoreQueries}
                                                data-purpose="show-more-queries"
                                            >
                                                {courseLabelMetrics.isShowMoreQueries
                                                    ? gettext('Show less')
                                                    : gettext('Show more')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </InsightsTooltip>
                        </div>
                        <div styleName="styles.metrics-col styles.metrics-col-2 styles.related-metrics-col">
                            <InsightsTooltip
                                calculation={
                                    <>
                                        <p>
                                            {gettext(
                                                'Students searching for your Topic also search for these Topics. This list is sorted by ' +
                                                    'highest interest to lowest interest.',
                                            )}
                                        </p>
                                        <p>
                                            {gettext(
                                                'A star indicates a promising Topic based on high student demand and low number of existing courses.',
                                            )}
                                        </p>
                                    </>
                                }
                                insight={gettext(
                                    'These might be good Topics to cover in your course or to inspire a separate course.',
                                )}
                            >
                                <div styleName="styles.metrics-panel">
                                    <div
                                        className="ud-text-lg"
                                        styleName="baseStyles.text-lg baseStyles.text-center styles.metrics-title"
                                    >
                                        {gettext('Other topics of interest')}
                                        <InfoIcon
                                            label={false}
                                            styleName="styles.metrics-info-icon"
                                        />
                                    </div>
                                    <div styleName="baseStyles.mt-md">
                                        {courseLabelMetrics.limitedRelatedCourseLabels.map(
                                            (courseLabelMetrics) => (
                                                <CourseLabelMetricsLink
                                                    title={
                                                        courseLabelMetrics.course_label.display_name
                                                    }
                                                    lang={courseLabelMetrics.course_lang}
                                                    openInNewTab={true}
                                                    referer={LINK_ORIGIN.RELATED}
                                                    extras={[
                                                        courseLabelStar(
                                                            courseLabelMetrics.recommendation ===
                                                                RECOMMENDATION.GO_FOR_IT,
                                                        ),
                                                    ]}
                                                    category="other_topics"
                                                    size={LINK_SIZE.SMALL}
                                                    key={courseLabelMetrics.course_label.id}
                                                />
                                            ),
                                        )}
                                    </div>
                                    {courseLabelMetrics.hasMoreRelatedCourseLabelsToShow && (
                                        <div styleName="baseStyles.text-center">
                                            <Button
                                                udStyle="ghost"
                                                size="medium"
                                                onClick={
                                                    courseLabelMetrics.toggleShowMoreRelatedCourseLabels
                                                }
                                                data-purpose="show-more-labels"
                                            >
                                                {courseLabelMetrics.isShowMoreRelatedCourseLabels
                                                    ? gettext('Show less')
                                                    : gettext('Show more')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </InsightsTooltip>
                        </div>
                    </div>
                    <div
                        styleName="baseStyles.rmt-xxl styles.metrics-row styles.channel-metrics-row-desktop"
                        data-purpose="channels"
                    >
                        <div styleName="styles.metrics-col">
                            <ChannelsTooltip>
                                <div styleName="styles.metrics-panel">
                                    <div
                                        className="ud-text-lg"
                                        styleName="baseStyles.text-lg baseStyles.text-center baseStyles.flex"
                                    >
                                        <div styleName="styles.metrics-title">
                                            {gettext('Enrollments by channel')}
                                            <InfoIcon
                                                label={false}
                                                styleName="styles.metrics-info-icon"
                                            />
                                        </div>
                                    </div>
                                    <div styleName="baseStyles.mt-md styles.border-box styles.channel-metrics-chart">
                                        {courseLabelMetrics.channels.length > 0 ? (
                                            <ColumnChart
                                                data={this.channelsChartData(
                                                    courseLabelMetrics.channels,
                                                )}
                                            />
                                        ) : (
                                            <div
                                                className="ud-text-xl"
                                                styleName="baseStyles.text-xxl baseStyles.text-center"
                                            >
                                                {'— —'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </ChannelsTooltip>
                        </div>
                        <div styleName="styles.metrics-col">
                            <ConversionTooltip>
                                <div styleName="styles.metrics-panel">
                                    <div
                                        className="ud-text-lg"
                                        styleName="baseStyles.text-lg baseStyles.text-center baseStyles.flex"
                                    >
                                        <div styleName="styles.metrics-title">
                                            {gettext('Conversion rate')}
                                            <InfoIcon
                                                label={false}
                                                styleName="styles.metrics-info-icon"
                                            />
                                        </div>
                                    </div>
                                    <div styleName="baseStyles.mt-md styles.border-box styles.channel-metrics-chart">
                                        <div
                                            className="ud-text-xl"
                                            styleName="baseStyles.text-xxl baseStyles.text-center"
                                        >
                                            {conversionRate}
                                        </div>
                                    </div>
                                </div>
                            </ConversionTooltip>
                        </div>
                    </div>
                    <div styleName="baseStyles.rmt-xxl styles.metrics-row styles.channel-metrics-row-mobile">
                        <div styleName="styles.metrics-col">
                            <ChannelsTooltip>
                                <div styleName="styles.metrics-panel">
                                    <div
                                        className="ud-text-lg"
                                        styleName="baseStyles.text-lg baseStyles.text-center baseStyles.flex"
                                    >
                                        <div styleName="styles.metrics-title">
                                            {gettext('Enrollments by channel')}
                                            <InfoIcon
                                                label={false}
                                                styleName="styles.metrics-info-icon"
                                            />
                                        </div>
                                    </div>
                                    {courseLabelMetrics.channels.length > 0 ? (
                                        <table styleName="baseStyles.mt-md styles.border-box styles.table">
                                            <tbody>
                                                {this.channelsChartData(
                                                    courseLabelMetrics.channels,
                                                ).map(([label, value]) => (
                                                    <tr key={label}>
                                                        <td>{label}</td>
                                                        <td>{`${value}%`}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div styleName="baseStyles.mt-md styles.border-box styles.channel-metrics-chart">
                                            <div
                                                className="ud-text-xl"
                                                styleName="baseStyles.text-xxl baseStyles.text-center"
                                            >
                                                {'— —'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ChannelsTooltip>
                        </div>
                        <div styleName="styles.metrics-col">
                            <ConversionTooltip>
                                <div styleName="styles.border-box styles.metrics-panel styles.conversion-metrics-panel-mobile">
                                    <div
                                        className="ud-text-lg"
                                        styleName="baseStyles.text-lg baseStyles.text-center baseStyles.flex"
                                    >
                                        <div styleName="styles.metrics-title">
                                            {gettext('Conversion rate')}
                                            <InfoIcon
                                                label={false}
                                                styleName="styles.metrics-info-icon"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className="ud-text-xl"
                                        styleName="baseStyles.text-xxl baseStyles.text-center baseStyles.rmt-lg"
                                    >
                                        {conversionRate}
                                    </div>
                                </div>
                            </ConversionTooltip>
                        </div>
                    </div>
                </WidePanel>
            </div>
        );
    }
}
