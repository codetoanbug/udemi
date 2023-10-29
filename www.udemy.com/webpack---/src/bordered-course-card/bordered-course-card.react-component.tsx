import classNames from 'classnames';
import React from 'react';

import {
    CourseCardBadges,
    CourseCardImage,
    CourseCardInstructors,
    CourseCardInstructorsContext,
    CourseCardProps,
    CourseCardPrice,
    CourseCardRatings,
    CourseCardTitle,
} from '@udemy/react-card-components';

import styles from './bordered-course-card.module.less';

/**
 * ### BorderedCourseCard
 *
 * Experimental course card with a border, rounded corners, and additional padding.
 *
 * @remarks
 *
 * This card implements a subset of the behaviors of
 * {@link @udemy/react-card-components#CourseCard}.
 *
 * Contrary to that card, this card renders only one kind of layout and lacks
 * an optional heading and details slot.
 *
 * The following props from `CourseCardProps` are ignored:
 * - `details`
 * - `detailsProps`
 * - `showDetails`
 * - `headline`
 * - `size`
 * - `width`
 *
 * @privateRemarks
 *
 * We accept the full `CourseCardProps` so that `BorderedCourseCard` and `CourseCard` can
 * be rendered interchangeably while we experiment with it.
 */
export const BorderedCourseCard = React.forwardRef<HTMLDivElement, CourseCardProps>(
    (
        {
            badges,
            badgesProps,
            children,
            image,
            imageProps,
            instructors,
            instructorsProps,
            price,
            priceProps,
            ratings,
            ratingsProps,
            title,
            titleProps,
            ...props
        },
        ref,
    ) => {
        // Remove props that should be ignored, but also not passed through to the `<div>`
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {details, detailsProps, headline, showDetails, size, width, ...divProps} = props;

        return (
            <div
                {...divProps}
                className={classNames(divProps.className, styles.container)}
                ref={ref}
            >
                <div className={styles['image-container']}>
                    {image || (imageProps && <CourseCardImage {...imageProps} />)}
                </div>
                <div className={styles['main-content']}>
                    {title || (titleProps && <CourseCardTitle {...titleProps} />)}
                    <CourseCardInstructorsContext.Provider value={{size: 'small'}}>
                        {instructors ||
                            (instructorsProps && <CourseCardInstructors {...instructorsProps} />)}
                    </CourseCardInstructorsContext.Provider>
                    {ratings || (ratingsProps && <CourseCardRatings {...ratingsProps} />)}
                    <div className={styles['price-text-container']}>
                        {price || (priceProps && <CourseCardPrice {...priceProps} />)}
                    </div>
                    <div>{badges || (badgesProps && <CourseCardBadges {...badgesProps} />)}</div>
                    {children}
                </div>
            </div>
        );
    },
);
