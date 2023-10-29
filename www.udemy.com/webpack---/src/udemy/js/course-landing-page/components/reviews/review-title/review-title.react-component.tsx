import {useFormatRoundNumber} from '@udemy/i18n';
import BulletIcon from '@udemy/icons/dist/bullet.ud-icon';
import RatingStarIcon from '@udemy/icons/dist/rating-star.ud-icon';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import {useMatchMediaClientOnly} from 'base-components/responsive/match-media.react-component';
import {formatNumberCompact} from 'browse/lib/format-number-compact';
import ReviewsStore from 'course-reviews/display/reviews.mobx-store';

import styles from './review-title.less';

interface ReviewTitleProps {
    reviewsStore?: ReviewsStore;
    isMobile: boolean;
    className?: string;
}
export const ReviewTitle = observer(({reviewsStore, isMobile, className}: ReviewTitleProps) => {
    const isSmMin = useMatchMediaClientOnly('sm-min');
    const {formatRoundNumber} = useFormatRoundNumber();
    const courseRatingNumber = formatRoundNumber(reviewsStore?.averageRating, 1);
    const courseRating = isMobile
        ? courseRatingNumber
        : interpolate(gettext('%(rating)s course rating'), {rating: courseRatingNumber}, true);
    const ratings = ninterpolate(
        '%(rating)s rating',
        '%(rating)s ratings',
        Number.parseInt(reviewsStore?.totalDistributionCount, 10),
        {rating: formatNumberCompact(reviewsStore?.totalDistributionCount)},
    );

    const fontSizeClassName = isSmMin ? 'ud-heading-xl' : 'ud-heading-lg';
    return (
        <div className={classNames(styles['review-title'], className)}>
            <RatingStarIcon styleName="star-rating-icon" size="medium" label={false} />
            <span className={fontSizeClassName}>{courseRating}</span>
            <BulletIcon
                className={styles['bullet-separation']}
                color="subdued"
                size="xsmall"
                label={false}
            />
            <span className={fontSizeClassName}>{ratings}</span>
        </div>
    );
});
