import {I18nApi, useI18n, useFormatNumber} from '@udemy/i18n';
import {StarRating} from '@udemy/react-merchandising-components';
import classNames from 'classnames';
import React from 'react';

import styles from './course-card-ratings.module.less';

/**
 * Interpolates text for ARIA label for number of reviews.
 *
 * @param reviewsCount - number of reviews
 * @param i18n - includes i18n function `ninterpolate`
 */
export function reviewsCountAriaLabel(
    reviewsCount: number,
    {ninterpolate}: {ninterpolate: I18nApi['ninterpolate']},
) {
    return ninterpolate('%(count)s review', '%(count)s reviews', reviewsCount, {
        count: reviewsCount,
    });
}

/**
 * Props for `CourseCardRatings` component.
 */
export interface CourseCardRatingsProps {
    /** Rating prop passed to `StarRating` */
    rating: number;
    /** Number of reviews for this course */
    reviewsCount: number;
    /**
     * Number of reviews for this course as text. If present, will be rendered
     * instead of `reviewsCount`
     * */
    reviewsCountText?: string;
}

/**
 * Ratings component for `CourseCard`. Renders `StarRating` and number of reviews.
 *
 * @remarks
 *
 * Will render nothing if there are no `children` and `rating` is `0`.
 */
export const CourseCardRatings = ({
    reviewsCountText,
    reviewsCount,
    rating,
    children,
}: React.PropsWithChildren<CourseCardRatingsProps>) => {
    const {ninterpolate} = useI18n();
    const {formatNumber} = useFormatNumber();

    if (!rating && !children) {
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const reviewsCountTextFinal = reviewsCountText || formatNumber(reviewsCount);
    return (
        <div className={styles.row}>
            {!!rating && (
                <>
                    <StarRating showNumber={true} rating={rating} />
                    <span
                        aria-label={reviewsCountAriaLabel(reviewsCount, {ninterpolate})}
                        className={classNames('ud-text-xs', styles['reviews-text'])}
                    >{`(${reviewsCountTextFinal})`}</span>
                </>
            )}
            {children}
        </div>
    );
};
