import {NOTICES_API_RELOAD_KEY} from '@udemy/smart-bar';
import {action, computed} from 'mobx';

import messagingStore from 'shopping-client/messages.mobx-store';
import udExpiringLocalStorage from 'utils/ud-expiring-local-storage';
import udLink from 'utils/ud-link';
import udMe from 'utils/ud-me';
import {OnEnrolledMessage} from 'webview/types';
import {NativeAppWebviewBridge} from 'webview/webview-utils';

import getIsMobileApp from '../utils/user-agent/get-is-mobile-app';
import config from './config';
import shoppingDiscounts from './shopping-discounts';
import shoppingList from './shopping-list';
import shoppingStorage from './shopping-storage.mobx-store';

function shoppingClient() {
    const NOTICE_REFRESH_EXPIRATION_DATE = new Date(Date.now() + 10 * 60 * 1000);
    let noticesApiLocalStorage = udExpiringLocalStorage(
        'notices',
        'api',
        NOTICE_REFRESH_EXPIRATION_DATE,
    );
    const store = shoppingStorage();
    const webviewBridge = new NativeAppWebviewBridge();
    let removeDiscountPromise = null;

    const state = {
        credit: store.credit,
        discounts: shoppingDiscounts(store.discounts),
        lists: {
            cart: shoppingList('cart', store.lists.cart),
            wishlist: shoppingList('wishlist', store.lists.wishlist),
            saved_for_later: shoppingList('saved_for_later', store.lists.saved_for_later),
            express: shoppingList('express', store.lists.express),
            checkout: shoppingList('checkout', []),
        },
    };

    // populate checkout list from frozen data if available
    try {
        const items = JSON.parse(window.sessionStorage.getItem('checkoutItems')) || [];
        state.lists.checkout = shoppingList('checkout', items);
    } catch (error) {
        state.lists.checkout = shoppingList('checkout', []);
    }

    class Client {
        constructor() {
            this.credit = state.credit;
            this.discounts = state.discounts;
            this.lists = state.lists;
            this.status = store.status;
            this.couponStore = null;
            this.availableCoupons = store.availableCoupons;
        }

        @computed
        get hasPendingOperations() {
            return Object.keys(state.lists).some(
                (listName) => state.lists[listName].hasPendingOperations,
            );
        }

        addToList(listName, buyables, context = null) {
            const items = Object.values(buyables).map((buyable) => ({
                buyable: {
                    buyable_object_type: buyable.buyable_object_type,
                    id: buyable.id,
                },
            }));

            return store.addItems(listName, items, context).then(() => {
                if (['cart', 'wishlist'].includes(listName)) {
                    noticesApiLocalStorage = udExpiringLocalStorage('notices', 'api');
                    noticesApiLocalStorage.delete(NOTICES_API_RELOAD_KEY);
                }
            });
        }

        cancelCheckout() {
            messagingStore('notifications').sendMessage('checkoutCancel');
        }

        notify(reason, options = {}) {
            const message = {
                message: reason && reason.message ? reason.message : reason,
            };
            if (options) {
                message.options = options;
            }
            messagingStore('notifications').sendMessage(message);
        }

        removeFromList(listName, item) {
            const afterRemove = () => {
                state.lists[listName].remove(item);
                if (this.couponStore) {
                    this.couponStore.updateDiscountState();
                }
                if (['cart', 'wishlist'].includes(listName) && state.lists[listName].isEmpty) {
                    noticesApiLocalStorage.set(NOTICES_API_RELOAD_KEY, true);
                }
            };
            return store
                .removeItem(listName, item)
                .then(() => {
                    afterRemove();
                    return Promise.resolve(true);
                })
                .catch(() => {
                    state.lists[listName].add(item)();
                    afterRemove();
                    return Promise.reject(false);
                });
        }

        moveToList(srcName, destName, item) {
            const postAddItems = () => {
                state.lists[destName].add(item);
                state.lists[srcName].remove(item);
                if (this.couponStore) {
                    this.couponStore.updateDiscountState();
                }
            };
            return store
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
            return store.fetch();
        }

        /*
         * Discounts
         */
        applyDiscounts(codes) {
            if (!codes || !codes.length) {
                return Promise.resolve(true);
            }
            const discountCodes = codes.map((c) => c.toUpperCase());
            return store.applyDiscounts(discountCodes);
        }

        removeDiscounts(codes) {
            if (!codes || !codes.length) {
                return Promise.resolve(true);
            }
            return store.removeDiscounts(codes);
        }

        validateDiscounts() {
            if (removeDiscountPromise) {
                return removeDiscountPromise;
            }
            const notApplicableCodes = {};
            const setNotApplicableCodes = (key, codes) => {
                if (codes.length > 0) {
                    notApplicableCodes[key] = codes;
                }
            };
            setNotApplicableCodes('invalid', state.discounts.invalidCodes);
            setNotApplicableCodes('expired', state.discounts.expiredCodes);
            setNotApplicableCodes('sold_out', state.discounts.soldOutCodes);
            Object.entries(notApplicableCodes).forEach(([type, codes]) => {
                const string =
                    config.errors.discount[type][codes.length > 1 ? 'plural' : 'singular'];
                const message = interpolate(
                    string,
                    {
                        code: codes.join(', '),
                    },
                    true,
                );
                this.notify(message, {reason: type});
            });
            removeDiscountPromise = this.removeDiscounts(
                [].concat(...Object.values(notApplicableCodes)),
            );
            return removeDiscountPromise.then((result) => {
                removeDiscountPromise = null;
                return result;
            });
        }

        /*
         * Checkout
         */
        @computed
        get isCheckoutAvailable() {
            return Boolean(state.lists.checkout && !state.lists.checkout.isEmpty && udMe.id);
        }

        /**
         * Freezes a list into a separate "checkout" list.
         *
         * This method *must* be called before checkout can be attempted.
         */
        freezeCheckoutList(listName) {
            state.lists.checkout.setItems([...state.lists[listName].items]);
            window.sessionStorage.setItem(
                'checkoutItems',
                JSON.stringify(state.lists.checkout.items),
            );
        }

        /**
         * Completes the checkout process, reverting checkout state to initial values.
         *
         * @param {Object} data - Information about completed checkout. Must have a
         *                        gatewayTransactionid property.
         */
        completeCheckout(data) {
            const boughtBuyables = state.lists.checkout.items.map((item) => {
                return item.buyable;
            });
            resetCheckoutList();
            return store.clearDiscounts().then(() => {
                performTerminalAction(data, boughtBuyables);
            });
        }

        setExpressCheckoutListFromItem(item) {
            resetCheckoutList();
            const buyables = [
                {
                    buyable: {
                        id: item.buyableObjectId,
                        buyable_object_type: item.buyableObjectType,
                    },
                },
            ];

            const codes = item.codes;
            return store.createExpressCheckoutSession(buyables, codes).then(() => {
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
                        state.lists.checkout.purchasePriceAmount - state.credit.amount > 0,
                    items: createCheckoutAttemptData(state.lists.checkout),
                });
            });
        }

        @action
        getTotalDue() {
            return Math.max(this.lists.checkout.purchasePriceAmount - this.credit.amount, 0);
        }
    }

    const client = new Client();

    function resetCheckoutList() {
        state.lists.checkout.clear();
        window.sessionStorage.removeItem('checkoutItems');
    }

    /**
     * Last step process called when everything else has been completed.
     * This supports different workflows for different devices
     *
     * @param {Object} data - Information about completed checkout. Must have a
     *                        gatewayTransactionid property.
     * @param {Array} buyables - List of buyable objects
     */
    function performTerminalAction(data, buyables) {
        if (getIsMobileApp()) {
            // Send both the legacy onEnrolledAdditionalData message and the new OnEnrolledMessage
            // until Android adoption is significant enough to full deprecate the onEnrolledAdditionalData call
            // Note: onEnrolledAdditionalData call is not sent to iOS clients; it's only for Android backwards compatibility
            webviewBridge.onEnrolledAdditionalData(data.purchasePrice, buyables);
            webviewBridge.sendMessage(new OnEnrolledMessage(buyables, data.purchasePrice));
        } else {
            const successUrl = data.redirect_url
                ? data.redirect_url
                : udLink.to(config.urls.paymentSuccessPage(data.gatewayTransactionId));
            config.goToUrl(successUrl);
        }
    }

    function createCheckoutAttemptData(list) {
        const result = {};
        result.items = list.items.map((item) => {
            let itemDiscount = null;
            let buyable = item.buyable;

            if (item.current_discount && item.current_discount.code) {
                itemDiscount = {
                    code: item.current_discount.code,
                };
            }

            const data = {discountInfo: itemDiscount, purchasePrice: item.purchase_price};

            if (buyable.buyable_object_type === 'license') {
                data.licenseId = buyable.id;
                buyable = buyable.course;
            } else if (buyable.buyable_object_type === 'gift') {
                data.giftId = buyable.id;
                buyable = buyable.course;
            }

            // TODO: add course invite and course password support

            data.buyableType = buyable.buyable_object_type;
            data.buyableId = buyable.id;

            return data;
        });
        return result;
    }

    return client;
}

export default shoppingClient();
