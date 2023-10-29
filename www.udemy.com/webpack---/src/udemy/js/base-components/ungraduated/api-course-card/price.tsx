import {pricePropsFrom, APICourseCardPriceProps} from '@udemy/react-card-components';

import {PriceTextProps} from '../../price-text/base-price-text.react-component';
import PURCHASE_PRICE_TYPES from '../../price-text/constants';

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
 */
export const pricePropsFromWithTracking = ({
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
