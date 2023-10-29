import CertificateIcon from '@udemy/icons/dist/certificate.ud-icon';
import PeopleIcon from '@udemy/icons/dist/people.ud-icon';
import PlayIcon from '@udemy/icons/dist/play.ud-icon';
import RatingStarIcon from '@udemy/icons/dist/rating-star.ud-icon';
import {Avatar, BlockList} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import getConfigData from 'utils/get-config-data';
import {formatNumber} from 'utils/numeral';

import InstructorDescription from './instructor-description.react-component';

import './instructor.less';

export const InstructorStats = ({instructor}) => {
    const udConfig = getConfigData();
    if (!udConfig.features.course_landing_page.instructor_bio.stats) {
        return null;
    }

    const starRatingText =
        instructor.avg_rating_recent === 0
            ? '--'
            : formatNumber(Number(instructor.avg_rating_recent).toFixed(1));
    const numRatingText =
        instructor.total_num_reviews === 0 ? '--' : formatNumber(instructor.total_num_reviews);
    const numStudentText =
        instructor.total_num_students === 0 ? '--' : formatNumber(instructor.total_num_students);
    const numCourseText =
        instructor.total_num_taught_courses === 0
            ? '--'
            : formatNumber(instructor.total_num_taught_courses);

    return (
        <BlockList size="small" padding="tight">
            <BlockList.Item data-purpose="stat" key={0} icon={<RatingStarIcon label={false} />}>
                {interpolate(
                    gettext('%(rating)s Instructor Rating'),
                    {rating: starRatingText},
                    true,
                )}
            </BlockList.Item>
            <BlockList.Item data-purpose="stat" key={1} icon={<CertificateIcon label={false} />}>
                {ninterpolate(
                    '%(count)s Review',
                    '%(count)s Reviews',
                    instructor.total_num_reviews,
                    {count: numRatingText},
                )}
            </BlockList.Item>
            <BlockList.Item data-purpose="stat" key={2} icon={<PeopleIcon label={false} />}>
                {ninterpolate(
                    '%(count)s Student',
                    '%(count)s Students',
                    instructor.total_num_students,
                    {count: numStudentText},
                )}
            </BlockList.Item>
            <BlockList.Item data-purpose="stat" key={3} icon={<PlayIcon label={false} />}>
                {ninterpolate(
                    '%(count)s Course',
                    '%(count)s Courses',
                    instructor.total_num_taught_courses,
                    {count: numCourseText},
                )}
            </BlockList.Item>
        </BlockList>
    );
};

InstructorStats.propTypes = {
    instructor: PropTypes.object.isRequired,
};

export const InstructorTitle = ({instructor}) => {
    return (
        <div>
            <div styleName="instructor__title" className="ud-heading-lg ud-link-underline">
                <a href={instructor.absolute_url || instructor.url}>{instructor.title}</a>
            </div>
            {instructor.job_title ? (
                <div styleName="instructor__job-title" className="ud-text-md">
                    {instructor.job_title}
                </div>
            ) : null}
        </div>
    );
};

InstructorTitle.propTypes = {
    instructor: PropTypes.object.isRequired,
};

export const InstructorImage = ({instructor}) => {
    const udConfig = getConfigData();
    if (!udConfig.features.course_landing_page.instructor_bio.image) {
        return null;
    }
    return (
        <a styleName="instructor__image-link" href={instructor.absolute_url}>
            <Avatar
                srcKey="image_200_H"
                styleName="instructor__image"
                user={instructor}
                alt="DISPLAY_NAME"
            />
        </a>
    );
};

InstructorImage.propTypes = {
    instructor: PropTypes.object.isRequired,
};

export const InstructorImageAndStats = ({instructor}) => {
    const udConfig = getConfigData();
    if (
        !udConfig.features.course_landing_page.instructor_bio.image &&
        !udConfig.features.course_landing_page.instructor_bio.stats
    ) {
        return null;
    }
    return (
        <div styleName="instructor__image-and-stats">
            <InstructorImage instructor={instructor} />
            <InstructorStats instructor={instructor} />
        </div>
    );
};

InstructorImageAndStats.propTypes = {
    instructor: PropTypes.object.isRequired,
};

@observer
export default class Instructor extends React.Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        index: PropTypes.number,
        instructor: PropTypes.object.isRequired,
    };

    static defaultProps = {
        index: undefined,
    };

    render() {
        const {index, instructor} = this.props;
        return (
            <div styleName="instructor" data-purpose="instructor-bio">
                <span className="in-page-offset-anchor" id={`instructor-${index}`} />
                <InstructorTitle instructor={instructor} />
                <InstructorImageAndStats instructor={instructor} />
                {instructor.description && (
                    <InstructorDescription description={instructor.description} />
                )}
            </div>
        );
    }
}
