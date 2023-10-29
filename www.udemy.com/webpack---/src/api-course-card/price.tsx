import {PriceTextProps} from '@udemy/react-merchandising-components';

import {priceTextStyleProps} from '../course-card';

/** A subset of Price from cart */
interface CoursePriceAmount {
    /** Numerical price amount, e.g. 145.99 */
    amount?: number;
    /** String-formatted price for display, e.g. '$145.99' */
    price_string?: string;
}

/** A subset of Course API for prices */
interface CoursePrice {
    /** Pricing details for this course */
    price_detail?: CoursePriceAmount;
    /** Discount information (if there is any) */
    discount?: {
        price: CoursePriceAmount;
    } | null;
}

/**
 * Props for price slot (including a subset of Course API type)
 *
 * @remarks
 *
 * @see `browse/types/course` for `course`
 */
export interface APICourseCardPriceProps {
    /** Object including price properties from Course API */
    course: CoursePrice;
    /** Props to pass directly to `StaticPriceText` */
    priceTextProps?: Omit<PriceTextProps, keyof ReturnType<typeof getPriceInfo>>;
}

/**
 * Convert Course API price fields to props suitable for `StaticPriceText` or
 * `DynamicPriceText`.
 *
 * @param course - Course API course object
 * @returns props for `StaticPriceText` or `DynamicPriceText`
 */
export function getPriceInfo({discount, price_detail: priceDetail}: CoursePrice) {
    // Assert arguments to parseFloat as strings, even though they'll be numbers.
    // parseFloat will coerce numbers into strings before parsing:
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
    const listPrice = priceDetail ? parseFloat(priceDetail.amount as unknown as string) : 0;
    const listPriceString = priceDetail ? priceDetail.price_string : undefined;
    const discountPrice = discount
        ? parseFloat(discount.price.amount as unknown as string)
        : listPrice;
    const discountPriceString = discount ? discount.price.price_string : listPriceString;
    return {discountPrice, discountPriceString, listPrice, listPriceString};
}

/**
 * Converts Course API fields to `CourseCard` price props.
 *
 * @remarks
 *
 * @see `browse/types/course`
 */
export const pricePropsFrom = ({
    course: {
        /* eslint-disable @typescript-eslint/naming-convention */
        price_detail,
        discount,
    },
    priceTextProps,
}: /* eslint-enable @typescript-eslint/naming-convention */
APICourseCardPriceProps) => {
    return {
        ...priceTextStyleProps,
        ...getPriceInfo({discount, price_detail}),
        ...priceTextProps,
    };
};
