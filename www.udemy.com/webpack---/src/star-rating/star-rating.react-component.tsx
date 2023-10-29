/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import {getUniqueId} from '@udemy/design-system-utils';
import {useI18n, useFormatNumber} from '@udemy/i18n';
import classNames from 'classnames';
import React, {useState} from 'react';
import '@udemy/icons/dist/rating-star.ud-icon';

import styles from './star-rating.module.less';

/**
 *  An array of sizes available for use for setting the StarRating size in JavaScript.
 * 
 * @deprecated Use the {@link StarRatingSize} type in TypeScript instead.

 * @privateRemarks
 * TODO: Remove when review-summary-rating-gauge converted to TypeScript
 */
export const StarRatingSizes = ['small', 'medium', 'large'] as const;

/**
 * The size of a StarRating component rendering.
 *
 * @privateRemarks
 * TODO: when `StarRatingSizes` removed, set to 'small' | 'medium' | 'large'` directly.
 */
export type StarRatingSize = typeof StarRatingSizes[number];

/** The React props interface for the StarRating component */
interface StarRatingProps extends React.ComponentPropsWithoutRef<'span'> {
    /** Aria label for screen readers */
    ariaLabel?: string;
    /** Flag to display as only the rating number + a single star icon */
    numeric?: boolean;
    /** The rating to display. This value is masked in `StarRating` to the nearest .5 value */
    rating?: number;
    /** Localized Rating. Displays if `numeric` or `showNumber` are true */
    localizedRating?: string;
    /** Flag to display as the rating number + 5 star icon scale */
    showNumber?: boolean;
    /** Various sizes available for the `StarRating` component */
    size?: StarRatingSize;
    /** Flag to set if the StarRating is displaying on a dark background; adjusts contrast to account for a11y */
    hasDarkBackground?: boolean;
}

/** The StarRating component. */
export const StarRating = ({
    ariaLabel,
    numeric = false,
    localizedRating,
    rating = 0,
    showNumber = false,
    size = 'medium',
    hasDarkBackground = false,
}: StarRatingProps) => {
    const {formatNumber} = useFormatNumber();
    const {gettext, interpolate} = useI18n();

    // constants
    const FILLED_STAR_DIMENSION = 14;
    const BORDERED_STAR_DIMENSION = 12;
    const [STAR_RATING_MASK] = useState(getUniqueId('star-rating-mask'));

    const numStars = numeric ? 1 : 5;
    let ratingPercentage;

    const getLocalizedRating = (rating: number) => {
        if (localizedRating !== undefined) {
            return localizedRating;
        }

        return formatNumber(Number(rating), {maximumFractionDigits: 1, minimumFractionDigits: 1});
    };

    const getRatingAriaLabel = (rating: number, total = 5) => {
        if (ariaLabel !== undefined) {
            return ariaLabel;
        }
        const label = gettext('Rating: %(rating)s out of %(total)s');
        return interpolate(label, {rating: getLocalizedRating(rating), total}, true);
    };

    if (numeric) {
        ratingPercentage = 100;
    } else {
        ratingPercentage = Number((Math.round(rating * 2) / 2).toFixed(1)) * 20;
    }

    /**
     * We want to show half or full-width star.
     * So, the ratingPercentage is masking the SVG mask that needs to .5 or .0  to precise calculation.
     * Example: 4.6 to 4.5, 4.8 to 5.0
     **/
    const starRatingStyles = classNames(styles['star-wrapper'], styles[size], {
        [styles.numeric]: numeric,
        [styles['dark-background']]: hasDarkBackground,
    });
    const filledStar = [];
    const borderedStar = [];

    for (let i = 0; i < numStars; i++) {
        filledStar.push(
            <use
                key={i}
                xlinkHref="#icon-rating-star"
                width={FILLED_STAR_DIMENSION}
                height={FILLED_STAR_DIMENSION}
                x={i * FILLED_STAR_DIMENSION}
            />,
        );
        borderedStar.push(
            <use
                key={i}
                xlinkHref="#icon-rating-star"
                width={BORDERED_STAR_DIMENSION}
                height={BORDERED_STAR_DIMENSION}
                x={i * FILLED_STAR_DIMENSION + 1}
                y="1"
            />,
        );
    }

    const spanClassNames = {
        small: 'ud-heading-xs',
        medium: 'ud-heading-sm',
        large: 'ud-heading-md',
    };

    return (
        <span className={starRatingStyles}>
            <span className="ud-sr-only">{getRatingAriaLabel(rating)}</span>
            {(showNumber || numeric) && (
                <span
                    className={classNames(spanClassNames[size], styles['rating-number'])}
                    aria-hidden="true"
                    data-purpose="rating-number"
                >
                    {getLocalizedRating(rating)}
                </span>
            )}
            <svg
                aria-hidden="true"
                width="100%"
                height="100%"
                viewBox={`0 0 ${FILLED_STAR_DIMENSION * numStars} ${FILLED_STAR_DIMENSION}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <mask id={STAR_RATING_MASK} data-purpose="star-rating-mask">
                    <rect x="0" y="0" width={`${ratingPercentage}%`} height="100%" fill="white" />
                </mask>
                <g
                    className={styles['star-filled']}
                    mask={`url(#${STAR_RATING_MASK})`}
                    data-purpose="star-filled"
                >
                    {filledStar}
                </g>
                <g
                    fill="transparent"
                    className={styles['star-bordered']}
                    strokeWidth="2"
                    data-purpose="star-bordered"
                >
                    {borderedStar}
                </g>
            </svg>
        </span>
    );
};
