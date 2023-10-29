import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {Avatar} from '@udemy/react-core-components';
import {StarRating} from '@udemy/react-merchandising-components';
import {ShowMore} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {ReviewImpressionEvent, ReviewExpandEvent} from 'course-landing-page/events';
import HelpfulnessStore from 'course-reviews/display/helpfulness.mobx-store';

import InstructorResponse from './instructor-response.react-component';
import ReviewFeedback from './review-feedback.react-component';
import './individual-review.less';

@observer
export default class IndividualReview extends Component {
    static propTypes = {
        helpfulnessStore: PropTypes.instanceOf(HelpfulnessStore),
        review: PropTypes.object.isRequired,
        renderContent: PropTypes.func,
        viewPosition: PropTypes.number,
        courseTrackingId: PropTypes.string,
        reviewableObjectId: PropTypes.number,
        reviewableObjectType: PropTypes.string,
    };

    static defaultProps = {
        helpfulnessStore: null,
        renderContent: (content) => content.split(/\n+/).map((l, i) => <p key={i}>{l}</p>),
        viewPosition: null,
        courseTrackingId: undefined,
        reviewableObjectId: undefined,
        reviewableObjectType: undefined,
    };

    isShowingMore = false;

    @autobind
    handleShowMoreToggle() {
        if (!this.isShowingMore) {
            const {courseTrackingId, review, reviewableObjectId, reviewableObjectType} = this.props;
            if (courseTrackingId) {
                Tracker.publishEvent(
                    new ReviewExpandEvent(
                        courseTrackingId,
                        review.id,
                        false,
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
        const {courseTrackingId, review, reviewableObjectId, reviewableObjectType} = this.props;
        if (!courseTrackingId) {
            return;
        }

        const instructorResponses = review.response
            ? [
                  {
                      responseId: review.response.id,
                      instructorTrackingId: review.response.user.tracking_id,
                  },
              ]
            : [];
        Tracker.publishEvent(
            new ReviewImpressionEvent(
                courseTrackingId,
                review.id,
                false,
                instructorResponses,
                reviewableObjectId,
                reviewableObjectType,
            ),
        );
    }

    renderReviewContent() {
        const {renderContent, review} = this.props;

        if (review.content === '') {
            return (
                <div
                    styleName="individual-review__comment individual-review__comment--empty"
                    data-purpose="review-comment-content"
                    className="ud-text-sm"
                >
                    {gettext('There are no written comments for your review.')}
                </div>
            );
        }

        return (
            <TrackImpression trackFunc={this.trackImpression}>
                <ShowMore
                    collapsedHeight={100}
                    withGradient={true}
                    onToggle={this.handleShowMoreToggle}
                >
                    <div
                        styleName="individual-review__comment"
                        className="ud-text-sm"
                        data-purpose="review-comment-content"
                    >
                        {renderContent(review.content)}
                    </div>
                </ShowMore>
            </TrackImpression>
        );
    }

    render() {
        const {
            helpfulnessStore,
            review,
            renderContent,
            reviewableObjectId,
            reviewableObjectType,
        } = this.props;

        return (
            <div styleName="individual-review" data-purpose="individual-review">
                <div styleName="individual-review-author-avatar">
                    <Avatar
                        data-purpose="avatar"
                        user={review.user}
                        srcKey="image_50x50"
                        size="medium"
                        alt="NONE"
                    />
                </div>
                <div styleName="individual-review-content">
                    <div styleName="individual-review__name-container">
                        <div
                            className="ud-heading-md"
                            styleName="individual-review__name"
                            data-purpose="review-detail-user-name"
                        >
                            {review.user.public_display_name}
                        </div>
                    </div>
                    <div styleName="individual-review__detail">
                        <StarRating rating={review.rating} size="large" />
                        <span className="ud-text-sm" styleName="individual-review__detail-date">
                            {review.created_formatted_with_time_since}
                        </span>
                    </div>
                    {this.renderReviewContent()}
                    {helpfulnessStore && (
                        <div styleName="individual-review__feedback">
                            <ReviewFeedback
                                store={helpfulnessStore}
                                courseTrackingId={this.props.courseTrackingId}
                                reviewableObjectId={reviewableObjectId}
                                reviewableObjectType={reviewableObjectType}
                                isFeaturedReview={false}
                            />
                        </div>
                    )}
                    {review.response && (
                        <InstructorResponse
                            content={review.response.content}
                            renderContent={renderContent}
                            user={review.response.user}
                            formatedTimestampSince={
                                review.response.created_formatted_with_time_since
                            }
                        />
                    )}
                </div>
            </div>
        );
    }
}
