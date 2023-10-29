import {AxiosResponse} from 'axios';
import {observable, action} from 'mobx';

import {serverOrClient} from '@udemy/shared-utils';
import {Price as ShoppingPrice} from '@udemy/shopping';
import {udApi} from '@udemy/ud-api';

const BATCH_SIZE = 10;

export const PRICING_API = 'pricing/';
const PRICING_API_FIELDS = 'price,discount_price,list_price,price_detail,price_serve_tracking_id';

// TODO: Remove once typing is finalized
//updatePriceMap price value - pulled from logging in monolith LOHP
// const priceResult: CoursePriceOrStatus = {
//     discount: {
//         price: {
//             amount: 149,
//             currency: 'MXN',
//             price_string: 'MX$149',
//             currency_symbol: 'MX$',
//         },
//     },
//     discount_price: {
//         amount: 149,
//         currency: 'MXN',
//         price_string: 'MX$149',
//         currency_symbol: 'MX$',
//     },
//     price: 'MX$479',
//     price_detail: {
//         amount: 479,
//         currency: 'MXN',
//         price_string: 'MX$479',
//         currency_symbol: 'MX$',
//     },
//     price_serve_tracking_id: '6VKK6nV1QJicjphhTNg8ZA',
//     status: PriceStatus.PRICE_STATUS_LOADED,
// };

/**
 * === API TYPES ===
 * These types represent the data returned from the pricing API
 * ===
 */
interface PricingApiResponse {
    courses: {
        [id: string]: ApiCoursePrice;
    };
}

type Price = Partial<ShoppingPrice>;

interface ApiCoursePrice {
    discount_price: Price;
    list_price: Price;
    price: Price;
    price_detail?: Price;
    price_serve_tracking_id: string;
}

/**
 * === EXTERNAL TYPES ===
 * These types represent the data that is passed into the CoursePriceStore via
 * its public API
 * ===
 */
export interface CoursePrice {
    discount?: {price: Price} | null;
    discount_price?: Price;
    list_price?: Price;
    price?: string;
    price_detail?: Price;
    price_serve_tracking_id?: string;
}

/**
 * === INTERNAL TYPES ===
 * These types represent the data that is stored inside the CoursePriceStore. They are
 * typically similar to the external types but also account for async loading of prices
 * ===
 */
export interface AsyncCoursePrice extends CoursePrice {
    status?: PriceStatus;
}

export enum PriceStatus {
    PRICE_STATUS_LOADING = 'loading',
    PRICE_STATUS_LOADED = 'loaded',
    PRICE_STATUS_ERROR = 'error',
}

export interface PriceStoreCourse extends CoursePrice {
    id: number;
    _course?: AsyncCoursePrice;
}

/**
 * Loads and caches course prices so that they can be shared across the site.
 * See the above types along with the associated comments for details on how
 * this store handles the various data formats.
 */
export class CoursePriceStore {
    static readonly STORE_ID = 'CoursePriceStore';
    @observable priceMap = observable.map<number, AsyncCoursePrice>(
        {},
        {name: 'priceMap', deep: false},
    );
    @observable modelMap = observable.map<number, PriceStoreCourse>(
        {},
        {name: 'modelMap', deep: false},
    );
    isLoading = false;
    _courseIdsToFetch: number[] = [];
    private _timeouts: number[] = [];

    registerCourse = (course: PriceStoreCourse, initialPrice?: CoursePrice) => {
        // Store the original model so we can update it once we get the price (in _updatePriceMap).
        // This is done just for funnel-logging. Once migrate off it, this should be removed.
        this.modelMap.set(+course.id, course);

        const existingPrice = this.priceMap.get(course.id);
        if (existingPrice && existingPrice.status !== PriceStatus.PRICE_STATUS_ERROR) {
            return;
        }
        this.setCoursePrice(course.id, initialPrice);
        if (this._courseIdsToFetch.length === 0) {
            this._courseIdsToFetch.push(course.id);
            this._loadCourses();
        } else {
            this._courseIdsToFetch.push(course.id);
        }
    };

    reloadCourses = () => {
        // this is used to reload prices in Discovery Units:
        // - in you `You Might Like' in the cart after applying a coupon
        this.priceMap.forEach((price, courseId) => {
            price.status = PriceStatus.PRICE_STATUS_ERROR;
            const course = this.modelMap.get(courseId);
            if (course) {
                this.registerCourse(course);
            }
        });
    };

    _loadCourses = () => {
        if (serverOrClient.isClient) {
            this.isLoading = true;
            const timeoutId = setTimeout(this.requestInBatches, 250);
            this._timeouts.push(timeoutId as unknown as number);
        }
    };

    private requestInBatches = () => {
        const sortedCourseIds = this._courseIdsToFetch.sort();
        while (sortedCourseIds.length !== 0) {
            const courseIds = sortedCourseIds.splice(0, BATCH_SIZE);
            udApi
                .get(PRICING_API, {
                    params: {
                        course_ids: courseIds.join(','),
                        'fields[pricing_result]': PRICING_API_FIELDS,
                    },
                })
                .then(this.updatePriceMap)
                .catch(this.updateErrorState(courseIds));
        }
        this.isLoading = false;
    };

    @action
    private updatePriceMap = (responseData: AxiosResponse<PricingApiResponse>) => {
        Object.entries(responseData.data.courses).forEach(([courseId, priceResult]) => {
            const priceObj: AsyncCoursePrice = {
                discount: {
                    price: priceResult.price,
                },
                discount_price: priceResult.discount_price,
                price: priceResult.list_price?.price_string,
                price_detail: priceResult.price_detail,
                price_serve_tracking_id: priceResult.price_serve_tracking_id,
                status: PriceStatus.PRICE_STATUS_LOADED,
            };
            const courseIdNumber = parseInt(courseId, 10);
            this.priceMap.set(courseIdNumber, priceObj);

            const courseModel = this.modelMap.get(Number(courseId));
            if (courseModel && courseModel._course) {
                Object.assign(courseModel._course, priceObj);
            }
        });
    };

    private updateErrorState = (courseIds: number[]) => {
        return action(() => {
            courseIds.forEach((courseId) => {
                const existingPrice = this.priceMap.get(courseId);
                const newStatus: AsyncCoursePrice = {
                    ...(existingPrice ?? {}),
                    status: PriceStatus.PRICE_STATUS_ERROR,
                };
                this.priceMap.set(courseId, newStatus);
            });
        });
    };

    @action
    private setCoursePrice(id: number, price?: CoursePrice) {
        this.priceMap.set(id, {...(price ?? {}), status: PriceStatus.PRICE_STATUS_LOADING});
    }

    @action
    reset() {
        // utility for testing
        this.priceMap.clear();
        this.isLoading = false;
        this._courseIdsToFetch = [];
        this._timeouts.forEach((timeoutId) => {
            clearTimeout(timeoutId);
        });
    }
}
