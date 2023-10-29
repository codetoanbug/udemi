import {useFormatNumber} from '@udemy/i18n';
import {StarRating} from '@udemy/react-merchandising-components';
import PropTypes from 'prop-types';
import React from 'react';

import './course-stats.less';

const CourseStats = ({course, className}) => {
    const {formatNumber} = useFormatNumber();
    return (
        <div className={className} styleName="course-stats" data-purpose="course-stats">
            <div>
                <StarRating rating={course.rating} numeric={true} size="large" />
                <div styleName="subdued-text" className="ud-text-xs">
                    {interpolate(
                        gettext('%(numReviews)s ratings'),
                        {
                            numReviews: formatNumber(course.num_reviews),
                        },
                        true,
                    )}
                </div>
            </div>
            <div styleName="num-students">
                <div className="ud-heading-md">{formatNumber(course.num_subscribers)}</div>
                <div styleName="subdued-text" className="ud-text-xs">
                    {gettext('Students')}
                </div>
            </div>
            <div styleName="video-length">
                <div className="ud-heading-md">{course.content_info_short}</div>
                <div styleName="subdued-text" className="ud-text-xs">
                    {gettext('Total')}
                </div>
            </div>
        </div>
    );
};

CourseStats.propTypes = {
    className: PropTypes.string,
    course: PropTypes.shape({
        rating: PropTypes.number,
        num_reviews: PropTypes.number,
        num_subscribers: PropTypes.number,
        content_info_short: PropTypes.string,
    }).isRequired,
};
CourseStats.defaultProps = {
    className: undefined,
};
export default CourseStats;
