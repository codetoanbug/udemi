import IntersectionObserver from '@researchgate/react-intersection-observer';
import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {Avatar} from '@udemy/react-core-components';
import {StarRating} from '@udemy/react-merchandising-components';
import {ShowMore} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {useEffect, useState, useRef} from 'react';

import {useMatchMediaClientOnly} from 'base-components/responsive/match-media.react-component';
import {ReviewFeedback} from 'course-landing-page/components/reviews/review-feedback/review-feedback.react-component';
import {ReviewsModalButton} from 'course-landing-page/components/reviews/review-modal/reviews-modal.react-component';
import {ReviewReport} from 'course-landing-page/components/reviews/review-report/review-report.react-component';
import {ShowMoreButton} from 'course-landing-page/components/reviews/review/show-more-button.react-component';
import {ReviewApiData} from 'course-landing-page/components/reviews/reviews-props';
import {ReviewExpandEvent, ReviewImpressionEvent} from 'course-landing-page/events';
import HelpfulnessStore from 'course-reviews/display/helpfulness.mobx-store';
import ReviewsStore from 'course-reviews/display/reviews.mobx-store';

import {InstructorResponse} from './instructor-response.react-component';
import styles from './review.less';
import showMoreButtonStyles from './show-more-button.less';

interface ReviewComponentProps {
    review: ReviewApiData;
    reviewsStore: ReviewsStore;
    helpfulnessStore: HelpfulnessStore;
    frontendTrackingId?: string;
    reviewableObjectId: number;
    reviewableObjectType: string;
    className?: string;
    isMobile: boolean;
    isDesktopLayout?: boolean;
    shouldUseInlineShowMore?: boolean;
    shouldUseDeattachedDropdown?: boolean;
    shouldCloseAllPoppers?: boolean;
    instructorResponseVisibility?: 'visible' | 'hidden' | 'seo-only';
    onShowMoreModalTriggerClick?: () => void;
}

export const Review = observer(
    ({
        review,
        reviewsStore,
        helpfulnessStore,
        frontendTrackingId,
        reviewableObjectId,
        reviewableObjectType,
        className,
        isMobile: isMobileDevice = true,
        isDesktopLayout = false,
        shouldUseInlineShowMore = true,
        shouldUseDeattachedDropdown = false,
        shouldCloseAllPoppers = false,
        instructorResponseVisibility = 'hidden',
        onShowMoreModalTriggerClick,
    }: ReviewComponentProps) => {
        const isMobileXxsMax = useMatchMediaClientOnly('mobile-xxs-max');
        const isMobileXsMin = useMatchMediaClientOnly('mobile-xs-min');
        const isMobileMin = useMatchMediaClientOnly('mobile-min');
        const isSmMin = useMatchMediaClientOnly('sm-min');
        const isMdMin = useMatchMediaClientOnly('md-min');
        const isLgMin = useMatchMediaClientOnly('lg-min');
        const reviewContentRef = useRef<HTMLDivElement>(null);
        const [isShowingMore, setIsShowingMore] = useState(false);
        const [shouldShowMoreButton, setShouldShowMoreButton] = useState(false);
        const [isInView, setIsInView] = useState(false);

        useEffect(() => {
            // on every breakpoint listed below and the review is in view, listen for the breakpoint change and
            // check if show more button is needed
            if (
                isInView &&
                reviewContentRef.current &&
                (isMobileXxsMax || isMobileXsMin || isMobileMin || isSmMin || isMdMin || isLgMin)
            ) {
                setShouldShowMoreButton(
                    round(reviewContentRef.current.scrollHeight) >
                        round(reviewContentRef.current.clientHeight),
                );
            }
        }, [
            isInView,
            isMobileXxsMax,
            isMobileXsMin,
            isMobileMin,
            isSmMin,
            isMdMin,
            isLgMin,
            setShouldShowMoreButton,
        ]);

        const trackReviewImpression = () => {
            if (!frontendTrackingId) {
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
                    frontendTrackingId,
                    review.id,
                    false,
                    instructorResponses,
                    reviewableObjectId,
                    reviewableObjectType,
                ),
            );
        };

        const handleInlineShowMoreToggle = () => {
            if (!isShowingMore && frontendTrackingId) {
                Tracker.publishEvent(
                    new ReviewExpandEvent(
                        frontendTrackingId,
                        review.id,
                        false,
                        reviewableObjectId,
                        reviewableObjectType,
                    ),
                );
            }

            setIsShowingMore(true);
        };

        const handleShowMoreInModalClick = () => {
            if (onShowMoreModalTriggerClick) {
                onShowMoreModalTriggerClick();
            }
        };

        const round = (n: number, precision = 5) => {
            return Math.round(n / precision) * precision;
        };

        const handleIntersectionChange = (entry: IntersectionObserverEntry) => {
            setIsInView(entry.isIntersecting);
        };

        const renderContent = () => {
            if (shouldUseInlineShowMore) {
                return (
                    <ShowMore
                        collapsedHeight={180}
                        contentClassName="ud-text-md"
                        buttonComponent={ShowMoreButton}
                        hideIcons={true}
                        withGradient={true}
                        onToggle={handleInlineShowMoreToggle}
                    >
                        {reviewsStore.renderContent(review.content, true)}
                    </ShowMore>
                );
            }
            return (
                <>
                    <IntersectionObserver onChange={handleIntersectionChange}>
                        <div
                            ref={reviewContentRef}
                            className={classNames(
                                'ud-text-md',
                                styles['review-content-with-modal-trigger'],
                                {
                                    [styles['with-show-more-button']]: shouldShowMoreButton,
                                },
                            )}
                        >
                            {reviewsStore.renderContent(review.content, false)}
                        </div>
                    </IntersectionObserver>
                    {shouldShowMoreButton && (
                        <ReviewsModalButton
                            frontendTrackingId={frontendTrackingId}
                            reviewableObjectType={reviewableObjectType}
                            reviewableObjectId={reviewableObjectId}
                            label={gettext('Show more')}
                            udStyle="ghost"
                            fullWidth={false}
                            onClick={handleShowMoreInModalClick}
                            className={showMoreButtonStyles.button}
                        />
                    )}
                </>
            );
        };

        const renderInstructorResponse = () => {
            if (!review.response?.content || instructorResponseVisibility === 'hidden') {
                return null;
            }

            if (instructorResponseVisibility === 'seo-only') {
                return (
                    <div className={styles['instructor-response-seo']}>
                        {review.response.content}
                    </div>
                );
            }

            return (
                <InstructorResponse
                    content={review.response.content?.split(/\n+/).map((l, i) => (
                        <p key={i}>{l}</p>
                    ))}
                    user={review.response.user}
                    formattedTimestampSince={review.response.created_formatted_with_time_since}
                />
            );
        };

        return (
            <TrackImpression trackFunc={trackReviewImpression}>
                <div
                    className={classNames(styles['review-container'], className ?? null, {
                        [styles['review-desktop-container']]: isDesktopLayout,
                        [styles['review-desktop-inline']]:
                            isDesktopLayout && shouldUseInlineShowMore,
                    })}
                >
                    <div className={styles['review-heading']}>
                        <div className={styles['review-profile']}>
                            <div className={styles['review-name-and-rating']}>
                                <p className="ud-heading-md">{review.user.public_display_name}</p>
                                <div className={styles['rating-container']}>
                                    <StarRating rating={review.rating} size="medium" />
                                    <span
                                        className={classNames(
                                            'ud-heading-xs',
                                            styles['time-since'],
                                        )}
                                    >
                                        {review.created_formatted_with_time_since}
                                    </span>
                                </div>
                            </div>
                            <Avatar
                                className={styles.avatar}
                                data-purpose="avatar"
                                user={review.user}
                                srcKey="image_50x50"
                                size="medium"
                                alt="NONE"
                            />
                        </div>
                        {isDesktopLayout && (
                            <ReviewReport
                                frontendTrackingId={frontendTrackingId}
                                reviewableObjectType={reviewableObjectType}
                                reviewableObjectId={reviewableObjectId}
                                helpfulnessStore={helpfulnessStore}
                                isMobile={isMobileDevice}
                                isFeaturedReview={false}
                                shouldUseDeattachedDropdown={shouldUseDeattachedDropdown}
                                reviewAuthorName={review.user.public_display_name}
                            />
                        )}
                    </div>
                    {renderContent()}
                    <div className={styles['review-feedback-container']}>
                        <ReviewFeedback
                            helpfulnessStore={helpfulnessStore}
                            frontendTrackingId={frontendTrackingId}
                            reviewableObjectType={reviewableObjectType}
                            reviewableObjectId={reviewableObjectId}
                            isFeaturedReview={false}
                            reviewAuthorName={review.user.public_display_name}
                        />
                        {!isDesktopLayout && (
                            <ReviewReport
                                frontendTrackingId={frontendTrackingId}
                                reviewableObjectType={reviewableObjectType}
                                reviewableObjectId={reviewableObjectId}
                                helpfulnessStore={helpfulnessStore}
                                isMobile={isMobileDevice}
                                isFeaturedReview={false}
                                shouldUseDeattachedDropdown={shouldUseDeattachedDropdown}
                                shouldClosePopper={shouldCloseAllPoppers}
                                placement="top-end"
                                reviewAuthorName={review.user.public_display_name}
                            />
                        )}
                    </div>
                    {renderInstructorResponse()}
                </div>
            </TrackImpression>
        );
    },
);
