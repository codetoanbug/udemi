import {AlertBanner} from '@udemy/react-messaging-components';
import {Pagination} from '@udemy/react-navigation-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import WrapWithText from 'base-components/ungraduated/text/wrap-with-text.react-component';
import qs from 'utils/query-params';
import udLink from 'utils/ud-link';

import CourseLabelMetricsLink, {
    LINK_ORIGIN,
    courseLabelPopularity,
    LINK_SIZE,
} from '../mkinsights/course-label-metrics-link.react-component';
import InfoTooltip from './info-tooltip.react-component';
/* eslint-disable no-unused-vars,import/order */
import baseStyles from './instructor-analytics.less';
import styles from './student-interests.less';
import {DEFAULT_DATA_SCOPE_FILTER} from './constants';
/* eslint-enable no-unused-vars,import/order */

const interestsHeader = (courseId) => (
    <WrapWithText
        componentClass="h3"
        text={gettext('See the other topics most popular with your students')}
        graphic={
            <InfoTooltip>
                {gettext(
                    'This is calculated based on your students’ enrollments in other courses over the past 6 months. ',
                )}
                {!courseId
                    ? gettext('Note that all topics you teach are excluded from this list.')
                    : gettext('Note that only the topic of this course is excluded.')}
            </InfoTooltip>
        }
    />
);

@withRouter
@inject('store')
@observer
export default class StudentInterests extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        dataScope: PropTypes.string,
    };

    static defaultProps = {
        dataScope: DEFAULT_DATA_SCOPE_FILTER,
    };

    render() {
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        const {interests} = this.props.store.studentStore;
        return (
            <div data-purpose="student-interests-list">
                {interestsHeader(queryParams.course_id)}
                {interests.activePageData.length === 0 ? (
                    <p data-purpose="interests-not-found" styleName="styles.no-data">
                        {gettext('No data yet...')}
                    </p>
                ) : (
                    <div styleName="styles.interests">
                        <div styleName="styles.flex">
                            {interests.activePageData.map((courseLabelMetrics) => (
                                <CourseLabelMetricsLink
                                    title={courseLabelMetrics.course_label.display_name}
                                    openInNewTab={true}
                                    referer={LINK_ORIGIN.STUDENT_INTEREST}
                                    extras={[
                                        courseLabelPopularity({
                                            absolute: courseLabelMetrics.num_students,
                                            percent: courseLabelMetrics.percentage,
                                        }),
                                    ]}
                                    size={LINK_SIZE.SMALL}
                                    category="student_interests"
                                    key={courseLabelMetrics.course_label.id}
                                    dataScope={this.props.dataScope}
                                />
                            ))}
                            <Pagination
                                pageCount={interests.numPages}
                                activePage={interests.activePage}
                                onPageChange={interests.goToPage}
                                styleName="baseStyles.pagination"
                            />
                        </div>
                        <div styleName="styles.flex">
                            <AlertBanner
                                title={
                                    <>
                                        <strong>{gettext('Tip:')}</strong>{' '}
                                        {gettext('Your students want to learn more.')}
                                    </>
                                }
                                body={gettext('Consider creating new courses to meet that demand.')}
                                ctaText={gettext('Create a new course')}
                                actionButtonProps={{
                                    componentClass: 'a',
                                    href: udLink.to('course', 'create', {ref: 'student-interests'}),
                                }}
                                dismissButtonProps={false}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
