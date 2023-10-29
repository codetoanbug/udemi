import {useMatchMedia} from '@udemy/hooks';
import {safelySetInnerHTML} from '@udemy/shared-utils';
import {tokens} from '@udemy/styles';
import classNames from 'classnames';
import React from 'react';

import {CourseCardBadges, CourseCardBadgesProps} from './course-card-badges.react-component';
import {CourseCardDetails, CourseCardDetailsProps} from './course-card-details.react-component';
import {
    CourseCardImage,
    CourseCardImageProps,
    CourseCardImageContext,
} from './course-card-image.react-component';
import {
    CourseCardInstructors,
    CourseCardInstructorsProps,
} from './course-card-instructors.react-component';
import {
    CourseCardPrice,
    CourseCardPriceProps,
    CourseCardPriceContext,
} from './course-card-price.react-component';
import {CourseCardRatings, CourseCardRatingsProps} from './course-card-ratings.react-component';
import {
    CourseCardTitle,
    CourseCardTitleProps,
    CourseCardTitleContext,
} from './course-card-title.react-component';
import styles from './course-card.module.less';

/**
 * Style props for `StaticPriceText` and `DynamicPriceText` components to make
 * it more convenient to use those components as price text.
 *
 * @see Price text components
 * {@link @udemy/react-merchandising-components#StaticPriceText} and
 * {@link @udemy/react-merchandising-components#DynamicPriceText}
 *
 * @privateRemarks
 *
 * These classes are exported by this card component rather than the price sub-component
 * because they are used to manage layout at the card level.
 */
export const priceTextStyleProps = {
    className: styles['price-text-base-price-text-component'],
    listPriceClassName: styles['price-text-base-price-text-component-list-price'],
    discountPriceClassName: styles['price-text-base-price-text-component-discount-price'],
} as const;

type CardSize = 'small' | 'medium' | 'large' | 'large-grid-9-columns' | 'large-grid-12-columns';

/**
 * Props for `CourseCard` component.
 *
 * @remarks
 *
 * Extends props for `<div>`, which are applied to the containing `<div>` element.
 *
 * @see `CourseCard` for description of sub-component slots specified in these props.
 */
export interface CourseCardProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
    /**
     * Content for the badge slot. Will usurp `badgesProps`.
     */
    badges?: React.ReactNode;
    /**
     * Props for {@link CourseCardBadges} to render badges slot.
     */
    badgesProps?: CourseCardBadgesProps;
    /**
     * Content for the details slot. Will usurp `detailsProps`.
     */
    details?: React.ReactNode;
    /**
     * Props for {@link CourseCardDetails} to render details slot.
     */
    detailsProps?: CourseCardDetailsProps;
    /**
     * Content for the image slot. Will usurp `imageProps`.
     */
    image?: React.ReactNode;
    /**
     * Props for {@link CourseCardImage} to render image slot.
     */
    imageProps?: CourseCardImageProps;
    /**
     * Content for the instructors slot. Will usurp 'instructorsProps`.
     */
    instructors?: React.ReactNode;
    /**
     * Props for {@link CourseCardInstructors} to render instructors slot.
     */
    instructorsProps?: CourseCardInstructorsProps;
    /**
     * Additional text to describe course with on `'large'` layout. Can include HTML.
     */
    headline?: string;
    /**
     * Content for the ratings slot. Will usurp `ratingsProps`.
     */
    ratings?: React.ReactNode;
    /**
     * Props for {@link CourseCardRatings} to render ratings slot.
     */
    ratingsProps?: CourseCardRatingsProps;
    /**
     * Flag to hide headline and details slot, even if they are provided as props.
     *
     * @defaultValue `true` in `CourseCard`
     */
    showDetails?: boolean;
    /**
     * Preset sizes. `'small'` is compact with a square course image.
     * `'medium'` renders a rectangular course image that takes the
     * full width of the card. 'large' is meant for wider layouts, with
     * the price to the right.
     *
     * @defaultValue `'medium'` in `CourseCard`
     */
    size?: CardSize;
    /**
     * Optional handler if user clicks on CourseCard.
     *
     * @deprecated
     *
     * @remarks
     * This prop is added to satisfy a consumer of CourseCard in TypeScript.  It is not
     * recommended for use, as CourseCard is not an interactive element and does not have
     * the associated `role` or keyboard event handlers required for a11y.
     */
    onClick?: React.MouseEventHandler;
    /**
     * Content for the price slot. Will usurp `priceProps`.
     */
    price?: React.ReactNode;
    /**
     * Props for {@link CourseCardPrice} to render price slot.
     */
    priceProps?: CourseCardPriceProps;
    /**
     * Content for the title slot. Will usurp `titleProps`.
     */
    title?: React.ReactNode;
    /**
     * Props for {@link CourseCardTitle} to render title slot.
     */
    titleProps?: CourseCardTitleProps;
    /**
     * Card width layout behavior.
     *
     * - `'flexible'`: card width will flex with its container
     * - `'fixed'`: lock the width of the card; sets width to the
     * lower limit for a medium sized card
     *
     * @defaultValue `'flexible'` in `CourseCard`
     */
    width?: 'fixed' | 'flexible';
}

/**
 * Return className for any given course card size prop.
 *
 * @internal
 */
const sizeClassName = (size: CardSize) => {
    switch (size) {
        case 'large-grid-12-columns':
        case 'large-grid-9-columns':
            return classNames(styles['large-grid'], styles[size]);
    }

    return styles[size];
};

/**
 * Return `size` prop for `CourseImage` from card `size` prop value.
 *
 * @internal
 */
const cardSizeToImageSize = (size: CardSize) => {
    switch (size) {
        case 'large-grid-12-columns':
        case 'large-grid-9-columns':
            return 'large';
    }

    return size;
};

/**
 * ### CourseCard
 *
 * Card component for a course.
 *
 * @remarks
 *
 * Forwards a `ref` to the containing `<div>` element.
 *
 * #### Slots
 *
 * The card is divided into distinct rendering areas ("slots"):
 * - badges
 * - details
 * - image
 * - instructors
 * - price
 * - ratings
 * - title
 *
 * Each slot has two props. One is for the props passed to a default
 * sub-component (e.g., `imageProps` for the image slot).
 * The other slot prop will completely override the slot nodes (e.g.,
 * `image`). If both props for a slot are specified, `CourseCard`
 * will render the override prop (e.g., `image`) instead of the
 * default component.
 *
 * Each slot is rendered independently, and is omitted by default.
 * This pattern allows for a mixing of default and custom rendering.
 */
export const CourseCard = Object.assign(
    React.forwardRef<HTMLDivElement, CourseCardProps>(
        (
            {
                badges,
                badgesProps,
                children,
                details,
                detailsProps,
                headline,
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
                showDetails = true,
                size = 'medium',
                width = 'flexible',
                ...htmlProps
            },
            ref,
        ) => {
            const layout12ColumnPage4ColumnsMinToken =
                tokens['layout-12-column-page-12-columns-min'];
            const isSmallMinViewport = useMatchMedia('sm-min');
            const is12ColumnMinViewport = useMatchMedia(
                `(min-width: ${layout12ColumnPage4ColumnsMinToken})`,
            );

            const isWideLayout =
                (size === 'large' && isSmallMinViewport) ||
                ((size === 'large-grid-12-columns' || size === 'large-grid-9-columns') &&
                    is12ColumnMinViewport);

            const priceLayoutDirection = isWideLayout ? 'vertical' : 'horizontal';

            const renderedPrice = price || (priceProps && <CourseCardPrice {...priceProps} />);
            const hasPrice = !!renderedPrice;
            return (
                <div
                    {...htmlProps}
                    data-purpose="container"
                    className={classNames(
                        htmlProps.className,
                        styles.container,
                        sizeClassName(size),
                        {
                            [styles.fixed]: width === 'fixed',
                        },
                    )}
                    ref={ref}
                >
                    <div className={styles['image-container']}>
                        <CourseCardImageContext.Provider
                            value={{
                                size: cardSizeToImageSize(size),
                                className: styles['course-image'],
                            }}
                        >
                            {image || (imageProps && <CourseCardImage {...imageProps} />)}
                        </CourseCardImageContext.Provider>
                    </div>
                    <div
                        className={classNames(styles['main-content'], {
                            [styles['has-price-text']]: hasPrice,
                        })}
                    >
                        <div className={styles['title-container']}>
                            <CourseCardTitleContext.Provider
                                value={{size: size === 'small' ? 'small' : 'medium'}}
                            >
                                {title || (titleProps && <CourseCardTitle {...titleProps} />)}
                            </CourseCardTitleContext.Provider>
                        </div>
                        {showDetails && size === 'large' && headline && (
                            <p
                                className={classNames('ud-text-sm', styles['course-headline'])}
                                {...safelySetInnerHTML({
                                    descriptionOfCaller: 'course-card:course-headline',
                                    html: headline,
                                })}
                            />
                        )}
                        {instructors ||
                            (instructorsProps && <CourseCardInstructors {...instructorsProps} />)}
                        {ratings || (ratingsProps && <CourseCardRatings {...ratingsProps} />)}
                        {showDetails &&
                            (details || (detailsProps && <CourseCardDetails {...detailsProps} />))}
                        <div className={styles['price-text-container']}>
                            <CourseCardPriceContext.Provider
                                value={{layoutDirection: priceLayoutDirection}}
                            >
                                {renderedPrice}
                            </CourseCardPriceContext.Provider>
                        </div>
                        <div className={styles['badges-container']}>
                            {badges || (badgesProps && <CourseCardBadges {...badgesProps} />)}
                        </div>
                        {children}
                    </div>
                </div>
            );
        },
    ),
    {
        /* eslint-disable @typescript-eslint/naming-convention */
        Badges: CourseCardBadges,
        Details: CourseCardDetails,
        Image: CourseCardImage,
        Instructors: CourseCardInstructors,
        Price: CourseCardPrice,
        Ratings: CourseCardRatings,
        Title: CourseCardTitle,
        /* eslint-enable @typescript-eslint/naming-convention */
    },
);
