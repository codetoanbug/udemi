import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {BlockList, Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {Loader, TextSkeleton} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';

import {noReviewsMessage} from 'course-landing-page/components/reviews/course-review-display.react-isocomponent';
import {ReviewSkeleton} from 'course-landing-page/components/reviews/review/review-skeleton.react-component';
import {Review} from 'course-landing-page/components/reviews/review/review.react-component';
import {NoReviewsMessage} from 'course-landing-page/components/reviews/reviews.react-component';
import SearchWidget from 'course-landing-page/components/reviews/search-widget.react-component';
import {RatingsSummaryImpressionEvent, SeeMoreReviewsClickEvent} from 'course-landing-page/events';
import {ReviewsContext} from 'course-landing-page/types/clc-contexts';
import ReviewSummaryWidget from 'course-reviews/common/review-summary/review-summary-widget.react-component';
import HelpfulnessStore from 'course-reviews/display/helpfulness.mobx-store';
import ReviewsStore from 'course-reviews/display/reviews.mobx-store';

import styles from './reviews-modal.less';

interface ReviewsModalButtonProps {
    frontendTrackingId?: string;
    reviewableObjectId: number;
    reviewableObjectType: string;
    label?: string;
    className?: string;
    fullWidth?: boolean;
    udStyle?: 'secondary' | 'ghost';
    onClick: () => void;
}

export const ReviewsModalButton = ({
    frontendTrackingId,
    reviewableObjectId,
    reviewableObjectType,
    label = gettext('Show all reviews'),
    className,
    fullWidth = true,
    udStyle = 'secondary',
    onClick,
}: ReviewsModalButtonProps) => {
    const trackSeeMoreReviewsClick = () => {
        if (frontendTrackingId) {
            Tracker.publishEvent(
                new SeeMoreReviewsClickEvent(
                    frontendTrackingId,
                    reviewableObjectId,
                    reviewableObjectType,
                ),
            );
        }
    };

    const handleOnButtonClick = () => {
        trackSeeMoreReviewsClick();
        onClick();
    };

    return (
        <Button
            onClick={handleOnButtonClick}
            data-purpose="show-reviews-modal-trigger-button"
            size="medium"
            udStyle={udStyle}
            className={classNames(className, {
                'ud-link-underline': udStyle === 'ghost',
                [styles['full-width-button']]: fullWidth,
            })}
        >
            {label}
        </Button>
    );
};

interface ReviewsModalContainerProps {
    reviewsRatings?: ReviewsContext;
    frontendTrackingId?: string;
    reviewableObjectId: number;
    reviewableObjectType: string;
    isMobile: boolean;
    isMobileLayout: boolean;
    isOpen: boolean;
    renderTitle: () => React.ReactNode;
    onClose: () => void;
    shouldUseTwoColumnLayout?: boolean;
}
export const ReviewsModalContainer = observer(
    ({
        reviewsRatings,
        frontendTrackingId,
        reviewableObjectId,
        reviewableObjectType,
        isMobile: isMobileDevice,
        isMobileLayout,
        isOpen,
        renderTitle,
        onClose,
        shouldUseTwoColumnLayout = false,
    }: ReviewsModalContainerProps) => {
        /* The modal requires a separate reviews store to manage an independent list of reviews.
            When the search and filter controls in the modal are used, it fetches a new list of reviews.
            If the reviews list on the page and modal were tied, it would cause the page to rerender the reviews section
        */
        const [reviewsStoreForModal, setReviewsStoreForModal] = useState<ReviewsStore>();

        useEffect(() => {
            if (reviewsRatings) {
                setReviewsStoreForModal(
                    new ReviewsStore(
                        reviewsRatings.courseId,
                        frontendTrackingId,
                        reviewsRatings.ratingDistribution,
                        reviewsRatings.averageRating,
                        reviewsRatings.topReviewAttributes,
                    ),
                );
            }
        }, [frontendTrackingId, reviewsRatings]);

        useEffect(() => {
            if (reviewsStoreForModal) {
                reviewsStoreForModal.fetchReviews();
            }
        }, [reviewsStoreForModal]);

        const handleOnModalClose = () => {
            onClose();
            if (reviewsStoreForModal) {
                reviewsStoreForModal.onResetControls();
                reviewsStoreForModal.fetchReviews();
            }
        };

        return (
            <Modal
                onClose={handleOnModalClose}
                className={classNames(styles['reviews-modal'], {
                    [styles['reviews-modal-desktop']]: !isMobileDevice,
                    [styles['larger-modal']]: !isMobileLayout,
                })}
                isOpen={isOpen}
                fullPage={isMobileDevice}
                title={renderTitle()}
            >
                <ReviewsModalContent
                    reviewsStore={reviewsStoreForModal}
                    isFreeSEOExp={reviewsRatings?.isFreeSEOExp}
                    frontendTrackingId={frontendTrackingId}
                    reviewableObjectType={reviewableObjectType}
                    reviewableObjectId={reviewableObjectId}
                    isMobileDevice={isMobileDevice}
                    isMobileLayout={isMobileLayout}
                    shouldUseTwoColumnLayout={shouldUseTwoColumnLayout}
                />
            </Modal>
        );
    },
);

interface ReviewsModalContentProps {
    reviewsStore?: ReviewsStore;
    isFreeSEOExp?: boolean;
    frontendTrackingId?: string;
    reviewableObjectId: number;
    reviewableObjectType: string;
    isMobileDevice: boolean;
    isMobileLayout: boolean;
    shouldUseTwoColumnLayout: boolean;
}

const ReviewsModalContent = observer(
    ({
        reviewsStore,
        isFreeSEOExp = false,
        frontendTrackingId,
        reviewableObjectId,
        reviewableObjectType,
        isMobileDevice,
        isMobileLayout,
        shouldUseTwoColumnLayout,
    }: ReviewsModalContentProps) => {
        if (!reviewsStore) {
            return (
                <ReviewsModalContentLoadingSkeleton
                    isMobileLayout={isMobileLayout}
                    shouldUseTwoColumnLayout={shouldUseTwoColumnLayout}
                />
            );
        }

        const trackRatingsSummaryImpression = () => {
            if (frontendTrackingId) {
                Tracker.publishEvent(
                    new RatingsSummaryImpressionEvent(
                        frontendTrackingId,
                        reviewableObjectId,
                        reviewableObjectType,
                    ),
                );
            }
        };

        const trackSeeMoreReviewsClick = () => {
            if (frontendTrackingId) {
                Tracker.publishEvent(
                    new SeeMoreReviewsClickEvent(
                        frontendTrackingId,
                        reviewableObjectId,
                        reviewableObjectType,
                    ),
                );
            }
        };

        const onSeeMoreReviewsClicked = () => {
            trackSeeMoreReviewsClick();
            reviewsStore.loadMore();
        };

        return (
            <div
                className={classNames(styles['reviews-modal-content'], {
                    [styles['reviews-two-column-layout']]: shouldUseTwoColumnLayout,
                })}
            >
                <div className={styles['reviews-controls']}>
                    <TrackImpression trackFunc={trackRatingsSummaryImpression}>
                        <div className={styles['ratings-filter-container']}>
                            <ReviewSummaryWidget
                                isFreeSEOExp={isFreeSEOExp}
                                showAverageRating={false}
                                averageRating={reviewsStore.averageRating}
                                ratingDistribution={reviewsStore.ratingDistribution}
                                ratingSize="medium"
                                selectedRating={reviewsStore.selectedRating}
                                onRatingSelected={reviewsStore.onRatingSelected}
                                onSeen={reviewsStore.onReviewSummarySeen}
                                totalDistributionCount={reviewsStore.totalDistributionCount}
                            />
                        </div>
                    </TrackImpression>
                    <SearchWidget
                        onSubmit={reviewsStore.onSearchSubmitted}
                        onClear={reviewsStore.onSearchCleared}
                        store={reviewsStore.searchWidgetStore}
                        size="small"
                        submitButtonProps={{
                            udStyle: 'secondary',
                            className: styles['search-submit-button'],
                        }}
                    />
                </div>
                <div className={styles['reviews-list-section']}>
                    <ReviewsSection
                        reviewsStore={reviewsStore}
                        frontendTrackingId={frontendTrackingId}
                        reviewableObjectType={reviewableObjectType}
                        reviewableObjectId={reviewableObjectId}
                        isMobileDevice={isMobileDevice}
                        isMobileLayout={isMobileLayout}
                    />
                    {!reviewsStore.isLoading && !reviewsStore.hideShowMoreButton && (
                        <Button
                            data-purpose="show-more-review-button"
                            disabled={reviewsStore.showMoreBtnIsLoading}
                            onClick={onSeeMoreReviewsClicked}
                            className={classNames(
                                styles['show-more-reviews-button'],
                                styles['full-width-button'],
                            )}
                            size="medium"
                            udStyle="secondary"
                        >
                            {reviewsStore.showMoreBtnIsLoading ? (
                                <Loader color="inherit" size="medium" />
                            ) : null}
                            {gettext('Show more reviews')}
                        </Button>
                    )}
                </div>
            </div>
        );
    },
);

interface ReviewsSectionProps {
    reviewsStore: ReviewsStore;
    frontendTrackingId?: string;
    reviewableObjectId: number;
    reviewableObjectType: string;
    isMobileDevice: boolean;
    isMobileLayout: boolean;
}

const ReviewsSection = observer(
    ({
        reviewsStore,
        frontendTrackingId,
        reviewableObjectId,
        reviewableObjectType,
        isMobileDevice,
        isMobileLayout,
    }: ReviewsSectionProps) => {
        if (reviewsStore.isLoading) {
            return <ReviewsSectionLoadingSkeleton isMobileLayout={isMobileLayout} />;
        }

        if (reviewsStore.reviews.length === 0) {
            return <NoReviewsMessage message={noReviewsMessage(reviewsStore)} />;
        }

        return (
            <BlockList size="large" className={styles['reviews-list']}>
                {reviewsStore.reviews.map((review, viewPosition) => (
                    <BlockList.Item key={review.id} className={styles['reviews-list-item']}>
                        <Review
                            review={review}
                            reviewsStore={reviewsStore}
                            helpfulnessStore={
                                new HelpfulnessStore(
                                    review.id,
                                    viewPosition,
                                    reviewableObjectId,
                                    reviewsStore.page,
                                    {},
                                )
                            }
                            frontendTrackingId={frontendTrackingId}
                            reviewableObjectType={reviewableObjectType}
                            reviewableObjectId={reviewableObjectId}
                            className={styles.review}
                            isMobile={isMobileDevice}
                            isDesktopLayout={!isMobileLayout}
                            shouldUseInlineShowMore={true}
                            instructorResponseVisibility="visible"
                        />
                    </BlockList.Item>
                ))}
            </BlockList>
        );
    },
);

interface ReviewsModalContentLoadingSkeletonProps {
    isMobileLayout: boolean;
    shouldUseTwoColumnLayout: boolean;
}

const ReviewsModalContentLoadingSkeleton = ({
    isMobileLayout,
    shouldUseTwoColumnLayout,
}: ReviewsModalContentLoadingSkeletonProps) => (
    <div
        className={classNames(styles['reviews-modal-content'], {
            [styles['reviews-two-column-layout']]: shouldUseTwoColumnLayout,
        })}
    >
        <div className={styles['reviews-controls']}>
            <TextSkeleton lineCountPerParagraph={5} />
        </div>
        <ReviewsSectionLoadingSkeleton isMobileLayout={isMobileLayout} />
    </div>
);

interface ReviewsSectionLoadingSkeletonProps {
    isMobileLayout: boolean;
}

const ReviewsSectionLoadingSkeleton = ({isMobileLayout}: ReviewsSectionLoadingSkeletonProps) => (
    <BlockList size="large" className={styles['reviews-list']}>
        {[...Array(4)].map((el, i) => (
            <BlockList.Item className={styles['reviews-list-item']} key={i}>
                <ReviewSkeleton
                    className={styles.review}
                    isDesktopLayout={!isMobileLayout}
                    inlineLayout={!isMobileLayout}
                />
            </BlockList.Item>
        ))}
    </BlockList>
);
