import {StaticPriceText} from '@udemy/react-merchandising-components';
import {useUDData} from '@udemy/ud-data';
import React, {forwardRef} from 'react';

import {CourseCard, CourseCardProps} from '../course-card';
import {badgesPropsFrom, APICourseCardBadgesProps} from './badges';
import {detailsPropsFrom, APICourseCardDetailsProps} from './details';
import {imagePropsFrom, APICourseCardImageProps} from './image';
import {instructorsPropsFrom, APICourseCardInstructorsProps} from './instructors';
import {pricePropsFrom, APICourseCardPriceProps} from './price';
import {ratingsPropsFrom, APICourseCardRatingsProps} from './ratings';
import {titlePropsFrom, APICourseCardTitleProps} from './title';

/**
 * Props for `APICourseCard`.
 *
 * @remarks
 *
 * Extends `@udemy/react-card-components#CourseCardProps`, but defines its
 * own versions of `*Props` properties for each sub-component slot. These
 * props will be passed to conversion functions described in `APICourseCard`.
 *
 * @see `APICourseCard` for description of sub-component slots specified in these props.
 */
export interface APICourseCardProps
    extends Omit<
        CourseCardProps,
        | 'badgesProps'
        | 'detailsProps'
        | 'imageProps'
        | 'instructorsProps'
        | 'priceProps'
        | 'ratingsProps'
        | 'titleProps'
    > {
    /**
     * Props for badges slot from a Course API object.
     * Converted for `CourseCard` using `badgesPropsFrom`.
     */
    badgesProps?: APICourseCardBadgesProps;
    /**
     * Props for details slot from a Course API object.
     * Converted for `CourseCard` using `detailsPropsFrom`.
     */
    detailsProps?: APICourseCardDetailsProps;
    /** Headline from Course API object. Headline may contain HTML */
    headlineProps?: {course: {headline?: string}};
    /**
     * Props for image slot from a Course API object.
     * Converted for `CourseCard` using `imagePropsFrom`.
     */
    imageProps?: APICourseCardImageProps;
    /**
     * Props for instructor slot from a Course API object.
     * Converted for `CourseCard` using `instructorsPropsFrom`.
     */
    instructorsProps?: APICourseCardInstructorsProps;
    /**
     * Props for price slot from a Course API object.
     * Converted for `CourseCard` using `pricePropsFrom`.
     */
    priceProps?: APICourseCardPriceProps;
    /**
     * Props for ratings slot from a Course API object.
     * Converted for `CourseCard` using `ratingsPropsFrom`.
     */
    ratingsProps?: APICourseCardRatingsProps;
    /**
     * Props for title slot, including title from CourseAPI object.
     * Converted for `CourseCard` using `titlePropsFrom`.
     */
    titleProps?: APICourseCardTitleProps;
}

/**
 * ### APICourseCard
 *
 * Course card component with compatibility layer between the
 * Course API and `@udemy/react-card-components#CourseCard`.
 *
 * @remarks
 *
 * Forwards a `ref` to the containing `<div>` element.
 *
 * This component renders `@udemy/react-card-components#CourseCard`
 * (`CourseCard`), but adds a layer of business logic to convert Course API
 * objects and related props into `CourseCard` props. It follows the _slots_
 * pattern described in the docs for `CourseCard`. (For example, if you pass
 * both `badges` and `badgeProps`, then `badgesProps` will be ignored.)
 *
 * Much of the conversion logic is available directly via `*PropsFrom`
 * functions:
 * - `badgesPropsFrom`
 * - `detailsPropsFrom`
 * - `imagePropsFrom`
 * - `instructorsProps`
 * - `pricePropsFrom`
 * - `ratingsPropsFrom`
 * - `titlePropsFrom`
 *
 * `APICourseCard` uses these functions internally as a convenience, but you
 * can use them directly if you want to render your own using `CourseCard`.
 *
 * @see {@link @udemy/react-card-components#CourseCard}
 */
export const APICourseCard = forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<APICourseCardProps>
>(
    (
        {
            badges,
            badgesProps,
            children,
            detailsProps,
            headline,
            headlineProps,
            imageProps,
            instructorsProps,
            price,
            priceProps,
            ratingsProps,
            titleProps,
            ...courseCardProps
        },
        ref,
    ) => {
        const {Config: udConfig} = useUDData();
        const isUB = !!udConfig.brand.has_organization;

        // Only include badges if not in UB
        const badgesSlot = {
            ...(!isUB && {badges}),
            ...(!isUB &&
                badgesProps && {
                    badgesProps: badgesPropsFrom(badgesProps),
                }),
        };

        const detailsSlot = {
            ...(detailsProps && {detailsProps: detailsPropsFrom(detailsProps)}),
        };

        const imageSlot = {
            ...(imageProps && {imageProps: imagePropsFrom(imageProps)}),
        };

        const headlineSlot = {
            ...{headline},
            // guard against defined `headline` so we don't override it with this:
            ...(!headline && headlineProps && {headline: headlineProps.course.headline}),
        };

        const instructorsSlot = {
            ...(instructorsProps && {instructorsProps: instructorsPropsFrom(instructorsProps)}),
        };

        // Only include price if not in UB
        const priceSlot = {
            ...(!isUB && {price}),
            ...(!isUB &&
                // guard against defined `price` so we don't override it with this:
                !price &&
                priceProps && {price: <StaticPriceText {...pricePropsFrom(priceProps)} />}),
        };

        const ratingsSlot = {
            ...(ratingsProps && {ratingsProps: ratingsPropsFrom(ratingsProps)}),
        };

        const titleSlot = {
            ...(titleProps && {titleProps: titlePropsFrom(titleProps)}),
        };

        return (
            <CourseCard
                ref={ref}
                {...courseCardProps}
                {...badgesSlot}
                {...detailsSlot}
                {...headlineSlot}
                {...imageSlot}
                {...instructorsSlot}
                {...priceSlot}
                {...ratingsSlot}
                {...titleSlot}
            >
                {children}
            </CourseCard>
        );
    },
);
