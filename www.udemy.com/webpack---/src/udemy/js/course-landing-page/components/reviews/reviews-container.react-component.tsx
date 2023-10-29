import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';

import {Reviews} from 'course-landing-page/components/reviews/reviews.react-component';
import CourseLandingComponentsStore from 'course-landing-page/course-landing-components.mobx-store';
import {ReviewsContext} from 'course-landing-page/types/clc-contexts';
import ReviewsStore from 'course-reviews/display/reviews.mobx-store';

import styles from './reviews-container.less';

export interface ReviewsContainerProps {
    clcStore: CourseLandingComponentsStore;
    frontendTrackingId?: string;
    courseId: number;
    isMobile: boolean;
    className?: string;
}

export const ReviewsContainer = observer(
    ({clcStore, frontendTrackingId, courseId, isMobile, className}) => {
        const [reviewsStore, setReviewsStore] = useState<ReviewsStore>();
        const [reviewsRatings, setReviewsRatings] = useState<ReviewsContext>();

        useEffect(() => {
            let isMounted = true;
            clcStore
                .getOrPopulate(['reviews_context'])
                .then((componentProps: {reviews_context: ReviewsContext}) => {
                    const {reviews_context: reviewsRatings} = componentProps;
                    if (isMounted) {
                        setReviewsRatings(reviewsRatings);
                        setReviewsStore(
                            new ReviewsStore(
                                reviewsRatings.courseId,
                                frontendTrackingId,
                                reviewsRatings.ratingDistribution,
                                reviewsRatings.averageRating,
                                reviewsRatings.topReviewAttributes,
                            ),
                        );
                    }
                });
            return () => {
                isMounted = false;
            };
        }, [clcStore, frontendTrackingId]);

        useEffect(() => {
            reviewsStore?.fetchReviews();
        }, [reviewsStore]);

        return (
            <Reviews
                reviewsStore={reviewsStore}
                reviewsRatings={reviewsRatings}
                frontendTrackingId={frontendTrackingId}
                reviewableObjectType="course"
                reviewableObjectId={courseId}
                isMobile={isMobile}
                className={className}
                mobileCarouselClassName={styles['carousel-mobile-full-bleed-grid']}
                tabletCarouselClassName={styles['carousel-tablet-full-bleed-single-item-grid']}
            />
        );
    },
);
