import {action, runInAction} from 'mobx';

import {Tracker} from '@udemy/event-tracking';
import {I18nApi} from '@udemy/i18n';

import {DISCOUNT_STATUSES} from '../shopping-client/constants';
import {ShoppingClientStore} from '../shopping-client/shopping-client-store';
import {BaseCouponStore} from './base-coupon-store';
import {CouponApplyEvent, CouponRemoveEvent} from './events';

export class CouponStore extends BaseCouponStore {
    constructor(
        private readonly shoppingClient: ShoppingClientStore,
        i18n: Pick<I18nApi, 'gettext'>,
    ) {
        super(i18n);
    }

    initialize() {
        this._updateState();
    }

    @action
    _updateCurrentCodes() {
        this.currentCodes = this.shoppingClient.discounts.attempts
            .filter((c) => c.status === DISCOUNT_STATUSES.APPLIED)
            .map((c) => c.code);
    }

    @action
    _updateCurrentDiscounts() {
        this.shoppingClient.discounts.attempts
            .filter((c) => c.status === DISCOUNT_STATUSES.APPLIED)
            .map((c) => this.currentDiscounts.set(c.code, c.amount));
    }

    updateDiscountState() {
        this._updateCurrentCodes();
        this._updateCurrentDiscounts();
    }

    _updateState() {
        this.updateDiscountState();
        const lastDiscountAttempt = this.shoppingClient.discounts.attempts.filter(
            (da) => da.code === this.inputCode,
        );

        this._updateBaseCouponInternalState(lastDiscountAttempt);
    }

    removeCouponCode(code: string) {
        return () => {
            this.enterLoadingMode();
            this.shoppingClient.removeDiscounts([code]).then(() => {
                this.updateDiscountState();
                this.enterInputMode();
                // This is needed to remove the error state of the inline input
                // when another valid code is applied from the currentCodes list
                if (this.currentCodes.includes(this.submittedCode)) {
                    runInAction(() => {
                        this.submittedCode = '';
                        this.error = '';
                    });
                }
                this._publishCouponRemoveEvent(code);
            });
        };
    }

    applyInputCode() {
        if (!this.isValidInputCode) {
            this._updateBaseCouponInternalState();
            return Promise.resolve();
        }

        this.enterLoadingMode();
        return this.shoppingClient.applyDiscounts([this.inputCode]).then(() => {
            this._publishCouponApplyEvent(this.inputCode);
            this._updateState();
        });
    }

    _publishCouponApplyEvent(code: string) {
        Tracker.publishEvent(new CouponApplyEvent(this._getBuyables(), code, 'manual_entry'));
    }

    _publishCouponRemoveEvent(code: string) {
        Tracker.publishEvent(new CouponRemoveEvent(this._getBuyables(), code));
    }

    _getBuyables() {
        return this.shoppingClient.lists.cart.items.map((item) => ({
            id: item.buyable.id,
            type: item.buyable.buyable_object_type,
            trackingId: item.buyable.frontendTrackingId as string,
        }));
    }
}
