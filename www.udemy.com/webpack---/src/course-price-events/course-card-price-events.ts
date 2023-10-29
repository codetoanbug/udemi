import {pricePropsFrom, APICourseCardPriceProps} from '@udemy/react-card-components';
import {PURCHASE_PRICE_TYPES} from '@udemy/shopping';

import {PriceTextProps} from '../price-text/with-price-text-tracking.react-component';

/** A subset of Course API for tracking */
interface CourseTracking {
    /** Primary ID */
    id: number;
    /** Unique tracking ID for this course */
    tracking_id?: string;
    frontendTrackingId?: string;
}

type CourseCardPriceProps = Omit<APICourseCardPriceProps, 'course'> & {
    course: APICourseCardPriceProps['course'] & CourseTracking;
};

/**
 * Injects `trackingEventContext` into `pricePropsFrom` function from
 * `@udemy/react-card-components`.
 *
 * @remarks
 *
 * Augments the existing convenience function to pluck course card price props
 * from the `course` object. Adds a tracking event context for the rendered
 * price text component.
 *
 * @see {@link `@udemy/browse-course#StaticPriceText`} and
 * {@link `@udemy/browse-course#DynamicPriceText`}.
 */
export const pricePropsWithTrackingFrom = ({
    course,
    priceTextProps,
}: CourseCardPriceProps): PriceTextProps => ({
    ...pricePropsFrom({course, priceTextProps}),
    trackingEventContext: {
        buyableId: course.id,
        priceType: PURCHASE_PRICE_TYPES.individual_buyable,
        buyableType: 'course' as const,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        buyableTrackingId: course.frontendTrackingId || course.tracking_id,
    },
    ...priceTextProps,
});
