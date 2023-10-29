import {Image} from '@udemy/react-core-components';
import {StarRating} from '@udemy/react-merchandising-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LearningPathStore from 'learning-path/learning-path.mobx-store';
import {CourseRetirementBadge} from 'organization-common/course-retirement/course-retirement-badge.react-component';
import {shouldDisplayRetirementBadge} from 'organization-common/utils';
import {formatNumber} from 'utils/numeral';

import './course-autosuggest.less';

@inject('learningPathStore')
@observer
export default class CourseAutosuggestResult extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        course: PropTypes.shape({
            label: PropTypes.string,
            url: PropTypes.string,
            type: PropTypes.string,
            image_75x75: PropTypes.string,
            visible_instructors: PropTypes.list,
            title: PropTypes.string,
            num_reviews: PropTypes.number,
            avg_rating: PropTypes.number,
            retirement_date: PropTypes.string,
            is_course_available_in_org: PropTypes.bool,
        }).isRequired,
    };

    render() {
        const {course, learningPathStore} = this.props;
        return (
            <span styleName="course-card-container" data-purpose="course-menu-item">
                {!learningPathStore.isMobileViewportSize && (
                    <Image
                        src={course.image_75x75}
                        alt=""
                        styleName="course-image"
                        width={75}
                        height={75}
                    />
                )}
                <span styleName="course-details">
                    <span
                        className="ud-heading-md"
                        styleName="row title"
                        data-purpose="course-title"
                    >
                        {course.title}
                    </span>
                    <span className="ud-text-xs" styleName="row" data-purpose="instructor-details">
                        {course.visible_instructors
                            .map((instructor) => instructor.display_name)
                            .join(', ')}
                    </span>
                    <span styleName="row reviews">
                        <StarRating rating={course.avg_rating} />
                        <span className="ud-text-xs" data-purpose="number-reviews">
                            {`(${ninterpolate(
                                '%(numReviews)s rating',
                                '%(numReviews)s ratings',
                                course.num_reviews,
                                {numReviews: formatNumber(course.num_reviews)},
                            )})`}
                        </span>
                    </span>
                    {shouldDisplayRetirementBadge(course) && (
                        <span styleName="row">
                            <CourseRetirementBadge
                                courseId={course.id}
                                retirementDate={course.retirement_date}
                                isCourseAvailableInOrg={course.is_course_available_in_org}
                                showIcon={false}
                            />
                        </span>
                    )}
                </span>
            </span>
        );
    }
}
