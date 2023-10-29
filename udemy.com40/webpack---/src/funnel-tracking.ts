import {getConfigData} from '@udemy/shared-utils';
import {Price} from '@udemy/shopping';
import {udApi} from '@udemy/ud-api';

import {BrowseCourse, CoursePriceStore} from './types/fake-browse-course-types';

const funnelTrackingAPIUrl = 'visits/me/funnel-logs/';

export interface FunnelLogCourse
    extends Partial<Pick<BrowseCourse, 'price' | 'discount' | 'price_detail'>> {
    id: number;
}

export interface FunnelLogContext {
    context?: string;
    context2?: string;
    subcontext?: string;
    subcontext2?: string;
}

export interface LoggingInfo extends FunnelLogContext {
    courses: FunnelLogCourse[];
}

export class FunnelTracking {
    static createContextKey = (contexts: FunnelLogContext) => {
        return [
            contexts.context,
            contexts.subcontext,
            contexts.context2,
            contexts.subcontext2,
        ].join('-');
    };

    /**
     * Provide static method for calling a logAction
     * @deprecated - use `logAction` from `FunnelLogContextProvider` instead
     **/
    static logAction = (
        action: string,
        courses: FunnelLogCourse[],
        funnelLogContext: FunnelLogContext,
        priceStore: CoursePriceStore,
    ) => {
        const loggingInfo: LoggingInfo = {courses, ...funnelLogContext};
        return FunnelTracking.requestToFunnelAPI(action, loggingInfo, priceStore);
    };

    /**
     * Provide static method for calling a markAsSeen
     * @deprecated - use `markAsSeen` from `FunnelLogContextProvider` instead
     **/
    static markAsSeen = (
        course: FunnelLogCourse,
        funnelLogContext: FunnelLogContext,
        priceStore: CoursePriceStore,
    ) => {
        const loggingInfo: LoggingInfo = {courses: [course], ...funnelLogContext};
        FunnelTracking.requestToFunnelAPI('mark-as-seen', loggingInfo, priceStore);
    };

    static requestToFunnelAPI = (
        requestType: string,
        loggingInfo: LoggingInfo,
        priceStore: CoursePriceStore,
    ) => {
        const listPrice: string[] = [];
        const discountPrices: string[] = [];
        const discountedPrices: string[] = [];
        loggingInfo.courses.forEach((course) => {
            let coursePrice;
            if (course.price) {
                coursePrice = {
                    price: course.price,
                    discount: course.discount,
                    price_detail: course.price_detail,
                };
            } else {
                coursePrice = priceStore.priceMap.get(course.id) ?? {};
            }
            if (coursePrice?.price !== undefined) {
                listPrice.push(coursePrice?.price as string);
            } else {
                listPrice.push('');
            }
            if (coursePrice?.discount_price?.amount !== undefined) {
                discountPrices.push(coursePrice?.discount_price?.amount.toString());
            } else {
                discountPrices.push('');
            }
            if (coursePrice?.discount?.price !== undefined) {
                const discountedPrice = coursePrice?.discount?.price as Price;
                discountedPrices.push(discountedPrice.price_string);
            } else {
                discountedPrices.push('');
            }
        });
        return udApi.post(funnelTrackingAPIUrl, {
            type: requestType,
            context: loggingInfo.context ?? '',
            subcontext: loggingInfo.subcontext ?? '',
            context2: loggingInfo.context2 ?? '',
            subcontext2: loggingInfo.subcontext2 ?? '',
            currency: getConfigData().price_country.currency_symbol,
            course_ids: loggingInfo.courses.map((course) => course.id).join(','),
            list_price: listPrice.join('|').replace(/[^0-9|,.]/g, ''),
            discount_price: discountedPrices
                .map((price: string, idx: number) => {
                    return price || discountPrices[idx];
                })
                .join('|')
                .replace(/[^0-9|,.]/g, ''),
        });
    };
}
