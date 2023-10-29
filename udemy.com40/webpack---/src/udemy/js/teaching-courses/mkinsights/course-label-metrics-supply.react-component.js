import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import {toJS} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CourseCard from 'base-components/course-card/course-card.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import {HIGH_PERCENTAGE_HIGH_QUALITY_COURSE_THRESHOLD, langDict} from './constants.js';
import HorizontalBar from './horizontal-bar.react-component';
import {InsightsTooltip} from './metrics-tooltip.react-component';
import WidePanel from './wide-panel.react-component';
/* eslint-disable no-unused-vars,import/order */
import baseStyles from './insights.less';
import styles from './course-label-metrics.less';
/* eslint-enable no-unused-vars,import/order */

@observer
export default class CourseLabelMetricsSupply extends Component {
    static propTypes = {
        courseLabelMetrics: PropTypes.object.isRequired,
    };

    renderMetricsColumn({top, middle, bottom, calculation, insight}) {
        return (
            <div styleName="styles.metrics-col styles.metrics-col-3">
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
                        >
                            {middle}
                        </div>
                        <div styleName="baseStyles.rmt-lg">{bottom}</div>
                    </div>
                </InsightsTooltip>
            </div>
        );
    }

    render() {
        const {courseLabelMetrics} = this.props;
        return (
            <div>
                <div
                    className="ud-text-xl"
                    styleName="baseStyles.text-xl baseStyles.text-center baseStyles.rmt-xxl"
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'course-label-metrics-supply:existing',
                        html: interpolate(
                            gettext('Existing %(language)s courses on %(topic)s'),
                            {
                                language: langDict[courseLabelMetrics.course_lang],
                                topic: `<strong>${courseLabelMetrics.course_label.display_name}</strong>`,
                            },
                            true,
                        ),
                    })}
                />
                <WidePanel styleName="baseStyles.mt-md">
                    <div styleName="baseStyles.text-center styles.metrics-row">
                        {this.renderMetricsColumn({
                            top: gettext('Listed as the primary topic'),
                            middle: courseLabelMetrics.num_course,
                            bottom: ngettext('course', 'courses', courseLabelMetrics.num_course),
                            calculation: interpolate(
                                gettext(
                                    'Total number of courses with %s selected as a primary Topic by the instructor.',
                                ),
                                [courseLabelMetrics.course_label.display_name],
                            ),
                            insight: gettext(
                                'Search for Topics at different levels of specificity to get a full picture of what related courses ' +
                                    'are available on Udemy. For example, a Topic can be specific like "Travel Photography" or more broad like "Photography".',
                            ),
                        })}
                        {this.renderMetricsColumn({
                            top: gettext('Courses rated above 4.5'),
                            middle: `${interpolate(
                                gettext('%(percent)s%'),
                                {percent: Math.round(courseLabelMetrics.perc_hq_course)},
                                true,
                            )}`,
                            bottom: (
                                <div aria-hidden={true} styleName="styles.horizontal-bar">
                                    <HorizontalBar percentage={courseLabelMetrics.perc_hq_course} />
                                </div>
                            ),
                            calculation: gettext(
                                'Percent of existing courses with an average rating of 4.5 out of 5 or higher. ' +
                                    'Only courses with 10 or more ratings are included in this metric.',
                            ),
                            insight: interpolate(
                                gettext(
                                    'If this percentage is greater than %s% for your Topic, focus on delivering high quality ' +
                                        'content to meet high student expectations.',
                                ),
                                [HIGH_PERCENTAGE_HIGH_QUALITY_COURSE_THRESHOLD],
                            ),
                        })}
                        {this.renderMetricsColumn({
                            top: gettext('Enrollments going to highly-rated courses'),
                            middle: `${interpolate(
                                gettext('%(percent)s%'),
                                {percent: Math.round(courseLabelMetrics.perc_hq_paid_enrollment)},
                                true,
                            )}`,
                            bottom: (
                                <div aria-hidden={true} styleName="styles.horizontal-bar">
                                    <HorizontalBar
                                        percentage={courseLabelMetrics.perc_hq_paid_enrollment}
                                    />
                                </div>
                            ),
                            calculation: gettext(
                                'Percent of paid enrollments going to courses with a rating of 4.5 out of 5 or higher.',
                            ),
                            insight: interpolate(
                                gettext(
                                    'If this percentage is greater than %s% for your Topic, focus on delivering high quality ' +
                                        'content to meet high student expectations.',
                                ),
                                [HIGH_PERCENTAGE_HIGH_QUALITY_COURSE_THRESHOLD],
                            ),
                        })}
                    </div>
                    <div
                        className="ud-text-lg"
                        styleName="baseStyles.text-lg baseStyles.text-center baseStyles.rmt-xxl"
                    >
                        {gettext('Top earning courses')}
                    </div>
                    <div styleName="styles.course-cards">
                        {courseLabelMetrics.top_courses.map((courseData) => {
                            return (
                                courseData.course && (
                                    <div key={courseData.course.id}>
                                        <CourseCard
                                            course={{
                                                ...toJS(courseData.course),
                                                instructional_level_simple:
                                                    courseData.course.instructional_level,
                                            }}
                                            size="large"
                                            url={courseData.course.url}
                                        />
                                    </div>
                                )
                            );
                        })}
                    </div>
                </WidePanel>
            </div>
        );
    }
}
