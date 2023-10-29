import {Image} from '@udemy/react-core-components';
import {Checkbox} from '@udemy/react-form-components';
import {StarRating} from '@udemy/react-merchandising-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LearningPathStore from 'learning-path/learning-path.mobx-store';
import getIsMobileApp from 'utils/user-agent/get-is-mobile-app';

import courseRecommendationsEventTracker from '../course-recommendations-event-tracker';
import RecommendedCourse from './recommended-course.mobx-model';

import '../course-recommendations.less';

@inject('learningPathStore')
@observer
export default class CourseItem extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        course: PropTypes.instanceOf(RecommendedCourse).isRequired,
        isCheckboxShown: PropTypes.bool,
        containerClassName: PropTypes.string,
    };

    static defaultProps = {
        isCheckboxShown: true,
        containerClassName: undefined,
    };

    @autobind
    handleChange(e) {
        this.props.course.setIsChecked(e.target.checked);
        if (e.target.checked) {
            courseRecommendationsEventTracker.courseSelected(this.props.course.id);
        }
    }

    get image() {
        return this.props.learningPathStore.isMobileViewportSize
            ? this.props.course.imageMobile
            : this.props.course.image;
    }

    @autobind
    onCourseClick() {
        courseRecommendationsEventTracker.courseClicked(this.props.course.id);
    }

    render() {
        const {containerClassName} = this.props;
        const {isChecked, url, title, rating, numReviews} = this.props.course;

        return (
            <div styleName="course-container" className={containerClassName}>
                {this.props.isCheckboxShown && (
                    <Checkbox
                        checked={isChecked}
                        onChange={this.handleChange}
                        data-purpose="select-course"
                    >
                        <span className="ud-sr-only">{gettext('Select course')}</span>
                    </Checkbox>
                )}
                <a
                    href={url}
                    target={getIsMobileApp() ? null : '_blank'}
                    onClick={this.onCourseClick}
                    styleName="course-content"
                >
                    <Image
                        styleName="course-image"
                        src={this.image}
                        alt={gettext('Course image')}
                        height={70}
                        width={125}
                    />
                    <div styleName="course-details">
                        <p>{title}</p>
                        <div styleName="course-rating">
                            <StarRating rating={rating} size="large" />
                            <span styleName="course-rating-text">
                                <span>{(Math.round(rating * 100) / 100).toFixed(1)}</span>
                                <span>
                                    {ninterpolate('(%s rating)', '(%s ratings)', numReviews)}
                                </span>
                            </span>
                        </div>
                    </div>
                </a>
            </div>
        );
    }
}
