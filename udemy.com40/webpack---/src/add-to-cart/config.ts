import {I18nApi} from '@udemy/i18n';

const errors = (gettext: I18nApi['gettext']) => ({
    get failAddToCart() {
        return gettext("We couldn't add this item.");
    },
    get cartUnavailableShort() {
        return gettext('Unavailable');
    },
    get cartUnavailable() {
        return gettext('Sorry, the shopping cart is temporarily unavailable.');
    },
    get stillWorking() {
        return gettext('Still working on it...');
    },
});

const timing = {
    addToCartSlow: 5000,
};

export const urls = {
    cartPage: '/cart/',
    checkoutPage: '/payment/checkout/',
    keepShopping: '/',
    wishlistPage: '/home/my-courses/wishlist/',
};

export const addToCartConfig = {
    errors,
    timing,
    urls,
};
