import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import udLink from 'utils/ud-link';

import {langDict} from './constants.js';
import {RECOMMENDATION} from './course-label-metrics.mobx-model';
import {InsightsTooltip} from './metrics-tooltip.react-component';
import Slider from './slider.react-component';
import {trackClick} from './tracking';
import WidePanel from './wide-panel.react-component';
/* eslint-disable no-unused-vars,import/order */
import baseStyles from './insights.less';
import styles from './course-label-metrics.less';
import {AlertBanner} from '@udemy/react-messaging-components';
import SystemMessage from 'utils/ud-system-message';
/* eslint-enable no-unused-vars,import/order */

@observer
export default class CourseLabelMetricsOpportunity extends Component {
    static propTypes = {
        courseLabelMetrics: PropTypes.object.isRequired,
        showMkInsightsDataChangeAlert: PropTypes.bool,
    };

    static defaultProps = {
        showMkInsightsDataChangeAlert: false,
    };

    renderMetricsColumn({top, middle, bottom, calculation, insight}) {
        return (
            <div styleName="styles.metrics-col styles.metrics-col-4">
                <InsightsTooltip calculation={calculation} insight={insight}>
                    <div styleName="baseStyles.rp-lg styles.border-box styles.metrics-panel">
                        <div className="ud-text-lg" styleName="baseStyles.text-lg baseStyles.flex">
                            <div styleName="styles.metrics-title">
                                {top}
                                <InfoIcon label={false} styleName="styles.metrics-info-icon" />
                            </div>
                        </div>
                        <div
                            className="ud-text-xl"
                            styleName="baseStyles.text-xxl baseStyles.rmt-lg"
                            data-purpose="metrics-middle"
                        >
                            {middle}
                        </div>
                        <div styleName="baseStyles.rmt-lg" data-purpose="metrics-bottom">
                            {bottom}
                        </div>
                    </div>
                </InsightsTooltip>
            </div>
        );
    }

    @autobind
    clickTracker() {
        trackClick({
            action: 'click',
            category: 'topic_feedback',
            actionType: 'create_course',
        })();
    }

    render() {
        const {courseLabelMetrics} = this.props;
        let header;

        if (courseLabelMetrics.recommendation === RECOMMENDATION.GO_FOR_IT) {
            header = gettext('🔥 This topic is a great opportunity!');
        } else if (courseLabelMetrics.recommendation === RECOMMENDATION.NEED_QUALITY) {
            header = gettext('🙌 Aim for high ratings to succeed in this topic');
        } else if (courseLabelMetrics.recommendation === RECOMMENDATION.NEED_DIFFERENTIATION) {
            header = gettext('🦄 Differentiate your course to succeed in this topic');
        } else if (courseLabelMetrics.recommendation === RECOMMENDATION.NEED_AUDIENCE) {
            header = gettext('📣 Have a marketing strategy to succeed in this topic');
        } else if (courseLabelMetrics.recommendation === RECOMMENDATION.BRING_A_GAME) {
            header = gettext('💯 Bring your "A" game to succeed in this topic');
        } else {
            return;
        }

        const courseCreateLink = udLink.to('course', 'create', {
            ref: 'mkinsights',
            labelid: courseLabelMetrics.course_label.id,
        });

        const medianTotalRevenueLabel = courseLabelMetrics.median_total_revenue || '— —';
        const avgTopRevenueLabel = courseLabelMetrics.avg_top_revenue || '— —';

        return (
            <div>
                {this.props.showMkInsightsDataChangeAlert && (
                    <AlertBanner
                        styleName="styles.alert-banner"
                        ctaText={gettext('Dismiss')}
                        dismissButtonProps={false}
                        onAction={() =>
                            SystemMessage.seen(SystemMessage.ids.mkinsightsDataChangeAlert)
                        }
                        title={gettext(
                            "We've updated the way we calculate topic-based " +
                                'insights to give you a more accurate understanding ' +
                                'of the opportunities on the platform.',
                        )}
                    />
                )}
                <div
                    className="ud-text-xl"
                    styleName="baseStyles.text-xl baseStyles.text-center baseStyles.rmt-xxl"
                    {...safelySetInnerHTML({
                        descriptionOfCaller:
                            'course-label-metrics-opportunity:opportunity-overview',
                        html: interpolate(
                            gettext('Opportunity overview for %(language)s courses on %(topic)s'),
                            {
                                language: langDict[courseLabelMetrics.course_lang],
                                topic: `<strong>${courseLabelMetrics.course_label.display_name}</strong>`,
                            },
                            true,
                        ),
                    })}
                />
                <WidePanel styleName="baseStyles.text-center baseStyles.mt-md">
                    <div
                        className="ud-text-xl"
                        styleName="baseStyles.text-xxl"
                        data-purpose="header"
                    >
                        {header}
                    </div>
                    <div styleName="baseStyles.rmt-xxl">
                        <Button
                            udStyle="brand"
                            componentClass="a"
                            href={courseCreateLink}
                            onClick={this.clickTracker}
                        >
                            {gettext('Create Your Course')}
                        </Button>
                    </div>
                    <div styleName="baseStyles.rmt-xxl styles.metrics-row">
                        {this.renderMetricsColumn({
                            top: gettext('Student demand'),
                            middle: courseLabelMetrics.demand,
                            bottom: (
                                <Slider percentage={courseLabelMetrics.search_volume_percentile} />
                            ),
                            calculation: gettext(
                                'Based on search volume percentile for courses on your Topic over the last 3 months.',
                            ),
                            insight: gettext(
                                'Search volume can be used to determine how much organic traffic you might expect to your course.',
                            ),
                        })}
                        {this.renderMetricsColumn({
                            top: gettext('Number of courses'),
                            middle: courseLabelMetrics.supply,
                            bottom: (
                                <Slider
                                    percentage={courseLabelMetrics.supplyPercentage}
                                    increasingGradient={false}
                                />
                            ),
                            calculation: gettext('The number of courses with your primary Topic.'),
                            insight: gettext(
                                'If the number of courses is high, you may have to do more to stand out.',
                            ),
                        })}
                        {this.renderMetricsColumn({
                            top: gettext('Median monthly revenue'),
                            middle: medianTotalRevenueLabel,
                            bottom: courseLabelMetrics.median_total_revenue
                                ? gettext('per month')
                                : gettext('no data available'),
                            calculation: (
                                <>
                                    <p>
                                        {gettext(
                                            "Median monthly revenue per course (includes both Udemy's and instructors' share) " +
                                                'over the last 3 months (not including the current month).',
                                        )}
                                    </p>
                                    <p>
                                        {gettext(
                                            'If we do not have enough courses or a diversity of instructors represented, we will not display this metric.',
                                        )}
                                    </p>
                                </>
                            ),
                            insight: gettext(
                                'Revenue is based on student demand for a Topic, how well a course addresses student needs, ' +
                                    'and how effectively a course is promoted. If any one of these factors is not met, revenue will be low.',
                            ),
                        })}
                        {this.renderMetricsColumn({
                            top: gettext('Top monthly revenue'),
                            middle: avgTopRevenueLabel,
                            bottom: courseLabelMetrics.avg_top_revenue
                                ? gettext('per month')
                                : gettext('no data available'),
                            calculation: (
                                <>
                                    <p>
                                        {gettext(
                                            "Average monthly revenue per course (includes both Udemy's and instructors' share) " +
                                                'of the top courses over the last 3 months (not including the current month).',
                                        )}
                                    </p>
                                    <p>
                                        {gettext(
                                            'If we do not have enough courses or a diversity of instructors represented, we will not display this metric.',
                                        )}
                                    </p>
                                </>
                            ),
                            insight: gettext(
                                'Revenue is based on student demand for a Topic, how well a course addresses student needs, ' +
                                    'and how effectively a course is promoted. If any one of these factors is not met, revenue will be low.',
                            ),
                        })}
                    </div>
                </WidePanel>
            </div>
        );
    }
}
