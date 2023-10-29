import {
    getCourseBadgeFromType,
    COURSE_BADGE_CODING_EXERCISES,
    COURSE_BADGE_FREE,
} from '@udemy/browse-course';
import {StarRating} from '@udemy/react-merchandising-components';
import PropTypes from 'prop-types';
import React from 'react';

import getConfigData from 'utils/get-config-data';
import {formatNumber} from 'utils/numeral';

import './lead.less';

export default class Lead extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        badge_family: PropTypes.string,
        is_free_seo_exp: PropTypes.bool.isRequired,
        rating: PropTypes.number.isRequired,
        num_reviews: PropTypes.number.isRequired,
        num_students: PropTypes.number.isRequired,
        is_coding_exercises_badge_eligible: PropTypes.bool,
        showCodingExercisesBadge: PropTypes.bool,
    };

    static defaultProps = {
        badge_family: null,
        is_coding_exercises_badge_eligible: false,
        showCodingExercisesBadge: false,
    };

    getCourseBadge() {
        let badgeName = this.props.badge_family;

        if (!badgeName) {
            badgeName = this.props.is_free_seo_exp ? COURSE_BADGE_FREE : null;
        }

        if (badgeName) {
            const Badge = getCourseBadgeFromType(badgeName);
            return (
                <div styleName="badge" data-purpose="badge">
                    <Badge />
                </div>
            );
        }

        return null;
    }

    getCodingExercisesBadge() {
        const CodingExercisesBadgeComponent = getCourseBadgeFromType(COURSE_BADGE_CODING_EXERCISES);
        return (
            <div styleName="badge" data-purpose="badge">
                <CodingExercisesBadgeComponent />
            </div>
        );
    }

    get enrollment() {
        return ninterpolate(
            '%(numStudents)s student',
            '%(numStudents)s students',
            this.props.num_students,
            {numStudents: formatNumber(this.props.num_students)},
        );
    }

    get reviewCount() {
        return ninterpolate(
            '(%(numReviews)s rating)',
            '(%(numReviews)s ratings)',
            this.props.num_reviews,
            {numReviews: formatNumber(this.props.num_reviews)},
        );
    }

    render() {
        const udConfig = getConfigData();
        return (
            <div styleName="lead">
                <div styleName="title" data-purpose="title">
                    {this.props.title}
                </div>
                <div styleName="info">
                    {udConfig.features.course_badge && this.getCourseBadge()}
                    {this.props.showCodingExercisesBadge &&
                        udConfig.features.course_badge &&
                        this.props.is_coding_exercises_badge_eligible &&
                        this.getCodingExercisesBadge()}
                    <a
                        href="#reviews"
                        className="ud-text-sm"
                        styleName="rating"
                        data-purpose="rating"
                    >
                        <StarRating
                            showNumber={true}
                            rating={this.props.rating}
                            numeric={true}
                            hasDarkBackground={true}
                        />{' '}
                        <span>{this.reviewCount}</span>
                    </a>
                    <div className="ud-text-sm" data-purpose="enrollment">
                        <span>{this.enrollment}</span>
                    </div>
                </div>
            </div>
        );
    }
}
