import {action, computed, observable} from 'mobx';

import {I18nApi} from '@udemy/i18n';
import {udExpiringLocalStorage, isMobileApp, NativeAppWebviewBridge} from '@udemy/shared-utils';
import {UDLinkApi} from '@udemy/ud-data';

import {CouponStore} from '../coupon-store/coupon-store';
import {Buyable, BuyableObjectType, Price, ShoppingItem} from '../types/shopping-types';
import {shoppingConfig, ShoppingErrors} from './config';
import {getMessagingStore, MessageData} from './messaging-store';
import {OnEnrolledMessage} from './on-enrolled-message';
import {ShoppingDiscounts} from './shopping-discounts';
import {ShoppingList} from './shopping-list';
import {ListName, ShoppingStorage} from './shopping-storage';

function assertValue<T>(value: T | undefined, valueName = 'value'): T {
    if (!value) {
        throw new Error(`Attempting to access ${valueName} before is has been set`);
    }

    return value;
}

const NOTICES_API_RELOAD_KEY = 'reload';

interface CheckoutItem {
    buyable?: Buyable;
    buyableId: number;
    buyableType: string;
    discountInfo?: {
        code: string;
    };
    giftId?: number;
    licenseId?: number;
    purchasePrice: Price;
}

interface CompleteCheckoutData {
    gatewayTransactionId: string;
    redirect_url: string;
    purchasePrice: {
        price: number;
        currency: string;
    };
}

interface InitializeOptions {
    i18n: Pick<I18nApi, 'gettext' | 'interpolate'>;
    udLink: Pick<UDLinkApi, 'to'>;
    isShoppingCartFeatureEnabled: boolean;
}

export class ShoppingClientStore {
    private readonly NOTICE_REFRESH_EXPIRATION_DATE = new Date(Date.now() + 10 * 60 * 1000);
    private noticesApiLocalStorage = udExpiringLocalStorage(
        'notices',
        'api',
        this.NOTICE_REFRESH_EXPIRATION_DATE,
    );
    private readonly webviewBridge = new NativeAppWebviewBridge();
    private removeDiscountPromise: Promise<unknown> | null = null;
    private userId?: number;
    private readonly state;
    couponStore: CouponStore | null = null;
    private _i18n?: Pick<I18nApi, 'gettext' | 'interpolate'>;
    private _udLink?: Pick<UDLinkApi, 'to'>;

    constructor(readonly storage: ShoppingStorage) {
        this.state = {
            credit: this.storage.credit,
            discounts: new ShoppingDiscounts(this.storage.discounts),
            lists: {
                cart: new ShoppingList('cart', this.storage.lists.cart),
                wishlist: new ShoppingList('wishlist', storage.lists.wishlist),
                saved_for_later: new ShoppingList('saved_for_later', storage.lists.saved_for_later),
                express: new ShoppingList('express', storage.lists.express),
                checkout: new ShoppingList('checkout', observable.array()),
            },
        };

        // populate checkout list from frozen data if available
        try {
            const storedCheckoutItems = window.sessionStorage.getItem('checkoutItems');
            const items = JSON.parse(storedCheckoutItems as string) ?? [];
            this.state.lists.checkout = new ShoppingList('checkout', items);
        } catch (error) {
            this.state.lists.checkout = new ShoppingList('checkout', observable.array());
        }
    }

    initialize(options: InitializeOptions) {
        this._i18n = options.i18n;
        this._udLink = options.udLink;
        this.storage.setIsFeatureEnabled(options.isShoppingCartFeatureEnabled);
    }

    private get i18n() {
        return assertValue(this._i18n);
    }

    private get udLink() {
        return assertValue(this._udLink);
    }

    @computed
    get credit() {
        return this.state.credit;
    }

    @computed
    get discounts() {
        return this.state.discounts;
    }

    @computed
    get lists() {
        return this.state.lists;
    }

    @computed
    get status() {
        return this.storage.status;
    }

    @computed
    get availableCoupons() {
        return this.storage.availableCoupons;
    }

    @computed
    get hasPendingOperations() {
        return Object.keys(this.state.lists).some(
            (listName) => this.state.lists[listName as ListName].hasPendingOperations,
        );
    }

    @action
    setUserId(id: number) {
        this.userId = id;
        this.storage.setUserId(id);
    }

    addToList(
        listName: ListName,
        buyables: Pick<Buyable, 'id' | 'buyable_object_type'>[],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        context: any = null,
    ) {
        const items = Object.values(buyables).map((buyable) => ({
            buyable: {
                buyable_object_type: buyable.buyable_object_type,
                id: buyable.id,
            },
        }));

        return this.storage.addItems(listName, items as ShoppingItem[], context).then(() => {
            if (['cart', 'wishlist'].includes(listName)) {
                this.noticesApiLocalStorage = udExpiringLocalStorage('notices', 'api');
                this.noticesApiLocalStorage.delete(NOTICES_API_RELOAD_KEY);
            }
        });
    }

    cancelCheckout() {
        getMessagingStore('notifications').sendMessage('checkoutCancel');
    }

    notify(reason: string | {message: string}, options = {}) {
        const message: MessageData = {
            message: typeof reason === 'string' ? reason : reason.message,
            options,
        };
        getMessagingStore('notifications').sendMessage(message);
    }

    removeFromList(listName: ListName, item: ShoppingItem) {
        const afterRemove = () => {
            this.state.lists[listName].remove(item);
            if (this.couponStore) {
                this.couponStore.updateDiscountState();
            }
            if (['cart', 'wishlist'].includes(listName) && this.state.lists[listName].isEmpty) {
                this.noticesApiLocalStorage.set(NOTICES_API_RELOAD_KEY, true);
            }
        };
        return this.storage
            .removeItem(listName, item)
            .then(() => {
                afterRemove();
                return Promise.resolve(true);
            })
            .catch(() => {
                this.state.lists[listName].add(item)();
                afterRemove();
                return Promise.reject(false);
            });
    }

    moveToList(srcName: ListName, destName: ListName, item: ShoppingItem) {
        const postAddItems = () => {
            this.state.lists[destName].add(item);
            this.state.lists[srcName].remove(item);
            if (this.couponStore) {
                this.couponStore.updateDiscountState();
            }
        };
        return this.storage
            .addItems(destName, [item])
            .then(() => {
                postAddItems();
                return Promise.resolve(true);
            })
            .catch(() => {
                postAddItems();
                return Promise.reject(false);
            });
    }

    fetch() {
        return this.storage.fetch();
    }

    /*
     * Discounts
     */
    applyDiscounts(codes: string[]) {
        if (!codes || !codes.length) {
            return Promise.resolve(true);
        }

        const discountCodes = codes.map((c) => c.toUpperCase());
        return this.storage.applyDiscounts(discountCodes);
    }

    removeDiscounts(codes: string[]) {
        if (!codes || !codes.length) {
            return Promise.resolve(true);
        }

        return this.storage.removeDiscounts(codes);
    }

    validateDiscounts() {
        if (this.removeDiscountPromise) {
            return this.removeDiscountPromise;
        }

        const notApplicableCodes: Record<string, string[]> = {};
        const setNotApplicableCodes = (key: string, codes: string[]) => {
            if (codes.length > 0) {
                notApplicableCodes[key] = codes;
            }
        };

        setNotApplicableCodes('invalid', this.state.discounts.invalidCodes);
        setNotApplicableCodes('expired', this.state.discounts.expiredCodes);
        setNotApplicableCodes('sold_out', this.state.discounts.soldOutCodes);
        Object.entries(notApplicableCodes).forEach(([type, codes]) => {
            const errors = shoppingConfig.errors(this.i18n.gettext);
            const typeKey = type as keyof ShoppingErrors['discount'];
            const string = errors.discount[typeKey][codes.length > 1 ? 'plural' : 'singular'];
            const message = this.i18n.interpolate(
                string,
                {
                    code: codes.join(', '),
                },
                true,
            );
            this.notify(message, {reason: type});
        });

        this.removeDiscountPromise = this.removeDiscounts(
            ([] as string[]).concat(...Object.values(notApplicableCodes)),
        );

        return this.removeDiscountPromise.then((result) => {
            this.removeDiscountPromise = null;
            return result;
        });
    }

    /*
     * Checkout
     */
    @computed
    get isCheckoutAvailable() {
        return Boolean(
            this.state.lists.checkout && !this.state.lists.checkout.isEmpty && this.userId,
        );
    }

    /**
     * Freezes a list into a separate "checkout" list.
     *
     * This method *must* be called before checkout can be attempted.
     */
    freezeCheckoutList(listName: ListName) {
        this.state.lists.checkout.setItems([...this.state.lists[listName].items]);
        window.sessionStorage.setItem(
            'checkoutItems',
            JSON.stringify(this.state.lists.checkout.items),
        );
    }

    /**
     * Completes the checkout process, reverting checkout state to initial values.
     *
     * @param data - Information about completed checkout. Must have a gatewayTransactionid property.
     */
    completeCheckout(data: CompleteCheckoutData) {
        const boughtBuyables = this.state.lists.checkout.items.map((item) => {
            return item.buyable;
        });
        this.resetCheckoutList();
        return this.storage.clearDiscounts().then(() => {
            this.performTerminalAction(data, boughtBuyables);
        });
    }

    setExpressCheckoutListFromItem(item: {
        buyableObjectId: number;
        buyableObjectType: BuyableObjectType;
        codes: string[];
    }) {
        this.resetCheckoutList();
        const buyables = [
            {
                buyable: {
                    id: item.buyableObjectId,
                    buyable_object_type: item.buyableObjectType,
                },
            },
        ];

        const codes = item.codes;
        return this.storage.createExpressCheckoutSession(buyables, codes).then(() => {
            this.freezeCheckoutList('express');
            return Promise.resolve(true);
        });
    }

    /**
     * Return purchase information about the current checkout state.
     * Requires that the client's checkout state is at least "Available".
     *
     * Returns an object in format:
     * {
     *   isPaymentRequired: true iff checkout list price is greater than user's current credit
     *   items: items in current checkout list
     * }
     */
    getCheckoutData() {
        return new Promise((resolve) => {
            return resolve({
                isPaymentRequired:
                    this.isCheckoutAvailable &&
                    this.state.lists.checkout.purchasePriceAmount - this.state.credit.amount > 0,
                items: this.createCheckoutAttemptData(this.state.lists.checkout),
            });
        });
    }

    @action
    getTotalDue() {
        return Math.max(this.lists.checkout.purchasePriceAmount - this.credit.amount, 0);
    }

    private resetCheckoutList() {
        this.state.lists.checkout.clear();
        window.sessionStorage.removeItem('checkoutItems');
    }

    /**
     * Last step process called when everything else has been completed.
     * This supports different workflows for different devices
     *
     * @param data - Information about completed checkout. Must have a gatewayTransactionid property.
     * @param buyables - List of buyable objects
     */
    private performTerminalAction(data: CompleteCheckoutData, buyables: Buyable[]) {
        if (isMobileApp()) {
            this.webviewBridge.sendMessage(
                new OnEnrolledMessage(buyables, data.purchasePrice.price.toString()),
            );
        } else {
            const successUrl = data.redirect_url
                ? data.redirect_url
                : this.udLink.to(shoppingConfig.urls.paymentSuccessPage(data.gatewayTransactionId));

            window.location.href = successUrl;
        }
    }

    private createCheckoutAttemptData(list: ShoppingList) {
        const items = list.items.map((item) => {
            let itemDiscount = undefined;

            if (item.current_discount && item.current_discount.code) {
                itemDiscount = {
                    code: item.current_discount.code,
                };
            }

            const data: Partial<CheckoutItem> = {
                discountInfo: itemDiscount,
                purchasePrice: item.purchase_price,
            };

            let buyable: Buyable = item.buyable;
            if (item.buyable.buyable_object_type === 'license') {
                data.licenseId = item.buyable.id;
                buyable = item.buyable.course;
            } else if (item.buyable.buyable_object_type === 'gift') {
                data.giftId = item.buyable.id;
                buyable = item.buyable.course as Buyable;
            }

            // TODO: add course invite and course password support
            data.buyableType = buyable.buyable_object_type;
            data.buyableId = buyable.id;

            return data as CheckoutItem;
        });

        return {items};
    }
}
