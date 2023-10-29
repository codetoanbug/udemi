import {Tracker} from '@udemy/event-tracking';
import {TextSkeleton} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';

import Carousel from 'base-components/carousel/carousel.react-component';
import {useMatchMediaClientOnly} from 'base-components/responsive/match-media.react-component';
import {ReviewsCarouselScrollEvent, SeeMoreReviewsClickEvent} from 'course-landing-page/events';
import {useOnCarouselScrollEnd} from 'course-landing-page/hooks/use-on-carousel-scroll-end';
import {ReviewsContext} from 'course-landing-page/types/clc-contexts';
import HelpfulnessStore from 'course-reviews/display/helpfulness.mobx-store';
import ReviewsStore from 'course-reviews/display/reviews.mobx-store';

import {
    ReviewsModalContainer,
    ReviewsModalButton,
} from './review-modal/reviews-modal.react-component';
import {ReviewTitle} from './review-title/review-title.react-component';
import {ReviewSkeleton} from './review/review-skeleton.react-component';
import {Review} from './review/review.react-component';
import styles from './reviews.less';

export interface ReviewsProps {
    reviewsStore?: ReviewsStore;
    reviewsRatings?: ReviewsContext;
    frontendTrackingId?: string;
    reviewableObjectId: number;
    reviewableObjectType: string;
    isMobile?: boolean;
    className?: string;
    sectionHeaderClassName?: string;
    mobileCarouselClassName?: string;
    tabletCarouselClassName?: string;
    scrollTargetClassName?: string;
}

export const Reviews = observer(
    ({
        reviewsStore,
        reviewsRatings,
        frontendTrackingId,
        reviewableObjectId,
        reviewableObjectType,
        isMobile: isMobileDevice = true,
        className,
        sectionHeaderClassName,
        mobileCarouselClassName,
        tabletCarouselClassName,
        scrollTargetClassName,
    }: ReviewsProps) => {
        const isMobileMax = useMatchMediaClientOnly('mobile-max');
        const isSmMin = useMatchMediaClientOnly('sm-min');
        const isSmMax = useMatchMediaClientOnly('sm-max');
        const isMobileLayout = isMobileDevice || isSmMax;
        const [isModalOpen, setIsModalOpen] = useState(false);

        useEffect(() => {
            reviewsStore?.fetchReviews();
        }, [reviewsStore]);

        const handleOnModalTriggerButtonClick = () => {
            if (isModalOpen && frontendTrackingId) {
                Tracker.publishEvent(
                    new SeeMoreReviewsClickEvent(
                        frontendTrackingId,
                        reviewableObjectId,
                        reviewableObjectType,
                    ),
                );
            }

            setIsModalOpen(!isModalOpen);
        };

        if (reviewsStore?.isLoading || !reviewsRatings) {
            return (
                <div data-purpose="reviews-loading" id="reviews" className={className}>
                    <TextSkeleton
                        className={classNames(styles['reviews-title'], sectionHeaderClassName)}
                        paragraphCount={0}
                        withTitle={true}
                    />
                    {isMobileLayout ? (
                        <Carousel
                            data-purpose="reviews-mobile-carousel-layout"
                            smallGrid={isMobileMax}
                            pageByFullWidth={!isMobileDevice && isSmMin}
                            showPager={!isMobileDevice}
                            pagerButtonSize="medium"
                            className={classNames(
                                mobileCarouselClassName,
                                !isMobileDevice ? tabletCarouselClassName : null,
                                styles.loading,
                            )}
                        >
                            <ReviewSkeleton className={styles.review} />
                            <ReviewSkeleton className={styles.review} />
                        </Carousel>
                    ) : (
                        <div
                            data-purpose="reviews-desktop-layout"
                            className={styles['reviews-desktop']}
                        >
                            <ReviewSkeleton className={styles.review} isDesktopLayout={true} />
                            <ReviewSkeleton className={styles.review} isDesktopLayout={true} />
                            <ReviewSkeleton className={styles.review} isDesktopLayout={true} />
                            <ReviewSkeleton className={styles.review} isDesktopLayout={true} />
                        </div>
                    )}
                </div>
            );
        }

        if (!reviewsStore?.isReviewSectionVisible) {
            return null;
        }

        const content =
            reviewsStore?.reviews.length > 0 ? (
                <>
                    {isMobileLayout ? (
                        <ReviewsContentMobile
                            reviewsStore={reviewsStore}
                            frontendTrackingId={frontendTrackingId}
                            reviewableObjectType={reviewableObjectType}
                            reviewableObjectId={reviewableObjectId}
                            isMobile={isMobileDevice}
                            mobileCarouselClassName={mobileCarouselClassName}
                            tabletCarouselClassName={tabletCarouselClassName}
                            onModalTriggerButtonClick={handleOnModalTriggerButtonClick}
                        />
                    ) : (
                        <ReviewsContentDesktop
                            reviewsStore={reviewsStore}
                            frontendTrackingId={frontendTrackingId}
                            reviewableObjectType={reviewableObjectType}
                            reviewableObjectId={reviewableObjectId}
                            isMobile={isMobileDevice}
                            onModalTriggerButtonClick={handleOnModalTriggerButtonClick}
                        />
                    )}
                    <ReviewsModalButton
                        frontendTrackingId={frontendTrackingId}
                        reviewableObjectType={reviewableObjectType}
                        reviewableObjectId={reviewableObjectId}
                        fullWidth={isMobileMax}
                        onClick={handleOnModalTriggerButtonClick}
                        className={styles['trigger-button-container']}
                    />
                    <ReviewsModalContainer
                        reviewsRatings={reviewsRatings}
                        frontendTrackingId={frontendTrackingId}
                        reviewableObjectType={reviewableObjectType}
                        reviewableObjectId={reviewableObjectId}
                        isMobile={isMobileDevice}
                        isMobileLayout={isMobileLayout}
                        isOpen={isModalOpen}
                        renderTitle={() => (
                            <ReviewTitle reviewsStore={reviewsStore} isMobile={isMobileDevice} />
                        )}
                        onClose={() => setIsModalOpen(false)}
                        // Only allow two column layout on desktop above small min
                        // explicitly different than isMobileLayout
                        shouldUseTwoColumnLayout={!isMobileDevice && isSmMin}
                    />
                </>
            ) : null;

        return (
            <div data-purpose="reviews" className={className}>
                <span className={scrollTargetClassName} id="reviews" />
                <ReviewTitle
                    reviewsStore={reviewsStore}
                    isMobile={isMobileDevice}
                    className={classNames(styles['reviews-title'], sectionHeaderClassName)}
                />
                {content}
            </div>
        );
    },
);

interface ReviewsContentMobileProps {
    reviewsStore?: ReviewsStore;
    frontendTrackingId?: string;
    reviewableObjectId: number;
    reviewableObjectType: string;
    isMobile: boolean;
    mobileCarouselClassName?: string;
    tabletCarouselClassName?: string;
    onModalTriggerButtonClick: () => void;
}
const ReviewsContentMobile = observer(
    ({
        reviewsStore,
        frontendTrackingId,
        reviewableObjectId,
        reviewableObjectType,
        isMobile,
        mobileCarouselClassName,
        tabletCarouselClassName,
        onModalTriggerButtonClick,
    }: ReviewsContentMobileProps) => {
        const isMobileMax = useMatchMediaClientOnly('mobile-max');
        const isSmMin = useMatchMediaClientOnly('sm-min');
        const carouselScroll = useOnCarouselScrollEnd(trackCarouselScroll);

        function trackCarouselScroll() {
            if (frontendTrackingId) {
                Tracker.publishEvent(
                    new ReviewsCarouselScrollEvent(
                        frontendTrackingId,
                        reviewableObjectId,
                        reviewableObjectType,
                    ),
                );
            }
        }

        if (reviewsStore?.reviews.length === 0) {
            return null;
        }

        return (
            <div>
                <Carousel
                    data-purpose="reviews-mobile-carousel-layout"
                    smallGrid={isMobileMax}
                    pageByFullWidth={!isMobile && isSmMin}
                    showPager={!isMobile}
                    pagerButtonSize="medium"
                    className={classNames(
                        mobileCarouselClassName,
                        !isMobile ? tabletCarouselClassName : null,
                    )}
                    {...carouselScroll.props}
                >
                    {reviewsStore?.reviews.map((review, viewPosition) => (
                        <Review
                            key={review.id}
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
                            isMobile={isMobile}
                            shouldUseInlineShowMore={false}
                            shouldUseDeattachedDropdown={true}
                            shouldCloseAllPoppers={carouselScroll.isScrolling}
                            instructorResponseVisibility="seo-only"
                            onShowMoreModalTriggerClick={onModalTriggerButtonClick}
                        />
                    ))}
                </Carousel>
            </div>
        );
    },
);

interface ReviewsContentDesktopProps {
    reviewsStore?: ReviewsStore;
    frontendTrackingId?: string;
    reviewableObjectId: number;
    reviewableObjectType: string;
    isMobile: boolean;
    onModalTriggerButtonClick: () => void;
}
export const DESKTOP_MAX_NUMBER_OF_DISPLAYED_REVIEWS = 4;
const ReviewsContentDesktop = observer(
    ({
        reviewsStore,
        frontendTrackingId,
        reviewableObjectId,
        reviewableObjectType,
        isMobile,
        onModalTriggerButtonClick,
    }: ReviewsContentDesktopProps) => {
        return (
            <div data-purpose="reviews-desktop-layout" className={styles['reviews-desktop']}>
                {reviewsStore?.reviews
                    .slice(0, DESKTOP_MAX_NUMBER_OF_DISPLAYED_REVIEWS)
                    .map((review, viewPosition) => (
                        <Review
                            key={review.id}
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
                            isMobile={isMobile}
                            isDesktopLayout={true}
                            shouldUseInlineShowMore={false}
                            instructorResponseVisibility="seo-only"
                            onShowMoreModalTriggerClick={onModalTriggerButtonClick}
                        />
                    ))}
            </div>
        );
    },
);

interface NoReviewsMessageProps {
    message: {
        purpose: string;
        message: string;
    };
}

export const NoReviewsMessage = ({message}: NoReviewsMessageProps) => {
    return (
        <p
            className={classNames('ud-text-md', styles['no-reviews-message'])}
            data-purpose={message.purpose}
        >
            {message.message}
        </p>
    );
};
