import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import CourseCard from 'base-components/course-card/course-card.react-component';
import WrapWithText from 'base-components/ungraduated/text/wrap-with-text.react-component';
import {API_STATE} from 'instructor/constants';
import qs from 'utils/query-params';

import InfoTooltip from './info-tooltip.react-component';
import ResponsiveCardCarousel from './responsive-card-carousel.react-component';
import './student-enrollments.less';

@withRouter
@inject('store')
@observer
export default class StudentEnrollments extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    renderCourseImage(Component, props) {
        return <Component {...props} className={props.className} styleName="card-image" />;
    }

    render() {
        const {enrollments} = this.props.store.studentStore;
        if (enrollments.searchState !== API_STATE.DONE || enrollments.courses.length === 0) {
            return null;
        }

        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        return (
            <div styleName="student-enrollments" data-purpose="students-courses-list">
                <WrapWithText
                    componentClass="h3"
                    styleName="title"
                    text={gettext('See the other courses most popular with your students')}
                    graphic={
                        <InfoTooltip>
                            {gettext(
                                "This is calculated based on your students' enrollments in the past 3 months. ",
                            )}
                            {!queryParams.course_id && gettext('(Your courses are excluded.)')}
                        </InfoTooltip>
                    }
                />
                <ResponsiveCardCarousel
                    renderItems={(isListView) => {
                        return enrollments.courses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                renderCourseImage={this.renderCourseImage}
                                showDetails={false}
                                size={isListView ? 'small' : 'medium'}
                                styleName={isListView ? 'card' : 'card card-desktop'}
                                width={isListView ? 'fixed' : 'flexible'}
                                url={course.url}
                            />
                        ));
                    }}
                />
            </div>
        );
    }
}
