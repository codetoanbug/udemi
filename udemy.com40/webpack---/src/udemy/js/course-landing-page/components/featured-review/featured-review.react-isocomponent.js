import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {StarRating} from '@udemy/react-merchandising-components';
import {ShowMore} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import ReviewFeedback from 'course-landing-page/components/reviews/review-feedback.react-component';
import {ReviewImpressionEvent, ReviewExpandEvent} from 'course-landing-page/events';
import HelpfulnessStore from 'course-reviews/display/helpfulness.mobx-store';
import {isomorphic} from 'utils/isomorphic-rendering';

import {InstructorImage} from '../instructors/instructor.react-component.js';
import styles from './featured-review.less';

@isomorphic
@observer
export default class FeaturedReview extends Component {
    static propTypes = {
        review_info: PropTypes.object.isRequired,
        page: PropTypes.string.isRequired,
        className: PropTypes.string,
        showBackgroundColor: PropTypes.bool,
        courseTrackingId: PropTypes.string,
        reviewableObjectId: PropTypes.number,
        reviewableObjectType: PropTypes.string,
    };

    static defaultProps = {
        className: undefined,
        showBackgroundColor: true,
        courseTrackingId: undefined,
        reviewableObjectId: undefined,
        reviewableObjectType: undefined,
    };

    @action
    componentDidMount() {
        const {review_info: reviewInfo, page} = this.props;
        if (reviewInfo.id) {
            this.helpfulnessStore = new HelpfulnessStore(
                reviewInfo.id,
                null,
                reviewInfo.course.id,
                page,
                {},
            );
        }
    }

    @observable helpfulnessStore;
    isShowingMore = false;

    @autobind
    handleShowMoreToggle() {
        if (!this.isShowingMore) {
            const {
                courseTrackingId,
                review_info: reviewInfo,
                reviewableObjectId,
                reviewableObjectType,
            } = this.props;
            if (courseTrackingId) {
                Tracker.publishEvent(
                    new ReviewExpandEvent(
                        courseTrackingId,
                        reviewInfo.id,
                        true,
                        reviewableObjectId,
                        reviewableObjectType,
                    ),
                );
            }
        }
        this.isShowingMore = !this.isShowingMore;
    }

    @autobind
    trackImpression() {
        const {
            courseTrackingId,
            review_info: reviewInfo,
            reviewableObjectId,
            reviewableObjectType,
        } = this.props;
        if (courseTrackingId) {
            Tracker.publishEvent(
                new ReviewImpressionEvent(
                    courseTrackingId,
                    reviewInfo.id,
                    true,
                    [],
                    reviewableObjectId,
                    reviewableObjectType,
                ),
            );
        }
    }

    render() {
        const reviewInfo = this.props.review_info;
        if (!reviewInfo.user) {
            return null;
        }
        const subscribedCourses = reviewInfo.user.total_subscribed_courses;
        const numCourseReviews = reviewInfo.user.num_course_reviews;
        const featuredReviewStyles = classNames(
            'component-margin',
            'ud-text-sm',
            this.props.className,
        );
        return (
            <TrackImpression trackFunc={this.trackImpression}>
                <div
                    styleName={this.props.showBackgroundColor ? 'background-wrapper' : ''}
                    className={featuredReviewStyles}
                >
                    <h2 styleName="unit-title" className="ud-heading-xl">
                        {gettext('Featured review')}
                    </h2>
                    <div styleName="reviewer">
                        <InstructorImage instructor={reviewInfo.user} />
                        <div styleName="reviewer-metadata" data-purpose="reviewer-metadata">
                            <div styleName="title-container">
                                <div
                                    styleName="title"
                                    className="ud-heading-md"
                                    data-purpose="featured-review-user-title"
                                >
                                    {reviewInfo.user.public_display_name || reviewInfo.user.title}
                                </div>
                            </div>
                            {subscribedCourses && (
                                <div styleName="reviewer-stat">
                                    {ninterpolate(
                                        '%(subscribedCourses)s course',
                                        '%(subscribedCourses)s courses',
                                        subscribedCourses,
                                        {subscribedCourses},
                                    )}
                                </div>
                            )}
                            {numCourseReviews && (
                                <div styleName="reviewer-stat">
                                    {ninterpolate(
                                        '%(numCourseReviews)s review',
                                        '%(numCourseReviews)s reviews',
                                        numCourseReviews,
                                        {numCourseReviews},
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div styleName="rating-container">
                        <StarRating size="large" rating={reviewInfo.rating} />
                        <span styleName="review-date">{reviewInfo.created}</span>
                    </div>
                    <ShowMore collapsedHeight={100} withGradient={true}>
                        {reviewInfo.content}
                    </ShowMore>
                    {this.helpfulnessStore && (
                        <ReviewFeedback
                            store={this.helpfulnessStore}
                            className={styles['review-feedback']}
                            courseTrackingId={this.props.courseTrackingId}
                            reviewableObjectId={this.props.reviewableObjectId}
                            reviewableObjectType={this.props.reviewableObjectType}
                            isFeaturedReview={true}
                        />
                    )}
                </div>
            </TrackImpression>
        );
    }
}
