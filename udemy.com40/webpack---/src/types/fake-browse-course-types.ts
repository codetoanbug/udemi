/**
 * This file contains some fake interfaces/classes for types normally defined in the browse-course package.
 *
 * This is done to avoid circular dependencies between the browse-course package and the funnel-log-context package; the funnel-log-context package is expected to be deprecated soon, so we don't want to put too much engineering effort into fixing this circular dependency.
 */

interface FakeInternalPrice {
    amount?: number;
    price?: FakeInternalPrice | string;
}

interface FakeCoursePrice {
    discount?: FakeInternalPrice;
    discount_price?: FakeInternalPrice;
    price?: FakeInternalPrice | string;
}

export interface BrowseCourse {
    price: FakeInternalPrice;
    discount: FakeInternalPrice;
    price_detail: FakeInternalPrice;
}

export class CoursePriceStore {
    // Used in the StoreProvider to determine which store to return for a class.
    // Taken from the actual CoursePriceStore: https://github.com/udemy/frontends-components/blob/11140f530c66b76158b3d4f6efdecc11ce057f8b/packages/browse-course/src/course-price-store/course-price-store.ts#L113
    static readonly STORE_ID = 'CoursePriceStore';
    isLoading = false;
    priceMap = new Map<number, FakeCoursePrice>();
}
