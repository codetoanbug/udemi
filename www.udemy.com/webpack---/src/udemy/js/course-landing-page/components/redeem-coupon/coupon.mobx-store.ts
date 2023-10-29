import {Tracker} from '@udemy/event-tracking';
import {action, observable, runInAction, IObservableArray} from 'mobx';

import {CouponApplyEvent, CouponRemoveEvent, CouponApplicationMethod} from 'browse/events';
import BaseCouponStore from 'cart/components/redeem-coupon/base-coupon.mobx-store';
import {MODES} from 'cart/components/redeem-coupon/constants';
import CourseLandingComponentsStore from 'course-landing-page/course-landing-components.mobx-store';
import {DISCOUNT_STATUSES} from 'shopping-client/constants';
import {couponURLHandler} from 'shopping-client/helpers';
import ShoppingClient from 'shopping-client/shopping-client.mobx-store';

export interface DiscountCode {
    status: string;
    code: string;
}

export interface RedeemCouponComponentContextProps {
    has_already_purchased: boolean;
    discount_attempts: DiscountCode[];
}

interface CouponData {
    redeem_coupon?: RedeemCouponComponentContextProps;
}

interface CreateCouponStoreData {
    clcStore: CourseLandingComponentsStore;
    courseTrackingId: string;
    params: URLSearchParams;
}

export const COMPONENTS_TO_UPDATE = [
    'buy_button',
    'purchase',
    'redeem_coupon',
    'recommendation',
    'discount_expiration',
    'gift_this_course',
    'available_coupons',
];

function findDiscountAttemptsForCode(couponData: CouponData, code: string) {
    if (!couponData?.redeem_coupon) {
        return [];
    }

    return couponData.redeem_coupon.discount_attempts.filter((da) => da.code === code);
}

export class CouponStore extends BaseCouponStore {
    private isInitialized = false;
    params?: URLSearchParams;
    @observable clcStore?: CourseLandingComponentsStore;
    private courseTrackingId = '';

    static create({clcStore, courseTrackingId, params}: CreateCouponStoreData) {
        const store = new CouponStore();
        store.params = params;
        store.courseTrackingId = courseTrackingId;
        store.clcStore = clcStore;
        return store;
    }

    initialize() {
        if (this.isInitialized) {
            return;
        }

        this.isInitialized = true;
        this.clcStore
            ?.getOrPopulate<CouponData>(['redeem_coupon'])
            .then(
                action((data: CouponData) => {
                    couponURLHandler(this.params).remove();
                    this._updateState(data);
                    this.currentMode =
                        this.error || this.currentCodes.length > 0 ? MODES.INPUT : MODES.DISPLAY;

                    // If a coupon codes have been applied at this point, they came from URL params. Publish an event
                    // for each applied code.
                    for (const code of this.currentCodes) {
                        this.publishCouponApplyEvent(code, 'url_param');
                    }
                }),
            );
    }

    @action
    _updateCurrentCodes(codesFromApi: DiscountCode[]) {
        if (!codesFromApi) {
            this.currentCodes = [];
            return;
        }

        const validDiscountAttempts = codesFromApi
            .filter((c) => c.status === DISCOUNT_STATUSES.APPLIED)
            .map((c) => c.code);

        this.currentCodes = validDiscountAttempts;
    }

    @action
    _updateState(data?: CouponData) {
        if (!data || !data.redeem_coupon) {
            return;
        }
        this.hasAlreadyPurchased = data.redeem_coupon.has_already_purchased;
        this._updateCurrentCodes(data.redeem_coupon.discount_attempts);
        const discountAttempts = findDiscountAttemptsForCode(data, this.inputCode);
        this._updateBaseCouponInternalState(discountAttempts);
        couponURLHandler(this.params).add(this.currentCodes);
    }

    removeCouponCode(code: string) {
        return () => {
            this.enterLoadingMode();
            couponURLHandler(this.params).remove();
            runInAction(() => {
                (this.currentCodes as IObservableArray<string>).remove(code);
            });
            return this.clcStore
                ?.populate(COMPONENTS_TO_UPDATE, {
                    discountCode: this.currentCodes.join(','),
                })
                .then((data?: CouponData) => {
                    this.enterInputMode();
                    if (data?.redeem_coupon) {
                        this._updateCurrentCodes(data.redeem_coupon.discount_attempts);
                    }

                    this.publishCouponRemoveEvent(code);
                    return ShoppingClient.removeDiscounts([code]);
                });
        };
    }

    applyInputCode() {
        if (!this.isValidInputCode) {
            this._updateBaseCouponInternalState();
            return Promise.resolve();
        }

        this.enterLoadingMode();
        couponURLHandler(this.params).remove();
        return this.clcStore
            ?.populate(COMPONENTS_TO_UPDATE, {
                discountCode: [this.inputCode, ...this.currentCodes].join(','),
            })
            .then((data: CouponData) => {
                const code = this.inputCode;
                this._updateState(data);

                const lastDiscountAttempt = findDiscountAttemptsForCode(data, code);
                if (lastDiscountAttempt[0]?.status == DISCOUNT_STATUSES.APPLIED) {
                    this.publishCouponApplyEvent(code, 'manual_entry');
                    ShoppingClient.applyDiscounts([code]);
                }
            });
    }

    private publishCouponApplyEvent(code: string, applicationMethod: CouponApplicationMethod) {
        if (this.clcStore) {
            Tracker.publishEvent(
                new CouponApplyEvent(
                    [
                        {
                            type: 'course',
                            id: this.clcStore.courseId,
                            trackingId: this.courseTrackingId,
                        },
                    ],
                    code,
                    applicationMethod,
                ),
            );
        }
    }

    private publishCouponRemoveEvent(code: string) {
        if (this.clcStore) {
            Tracker.publishEvent(
                new CouponRemoveEvent(
                    [
                        {
                            type: 'course',
                            id: this.clcStore.courseId,
                            trackingId: this.courseTrackingId,
                        },
                    ],
                    code,
                ),
            );
        }
    }
}
