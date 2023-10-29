import {I18nApi} from '@udemy/i18n';

export const shoppingConfig = {
    errors: (gettext: I18nApi['gettext']) => ({
        default: gettext('An unknown error occurred.'),
        discount: {
            invalid: {
                singular: gettext('<b>%(code)s</b> is invalid, and has been removed.'),
                plural: gettext('<b>%(code)s</b> are invalid, and have been removed.'),
            },
            expired: {
                singular: gettext('<b>%(code)s</b> is expired, and has been removed.'),
                plural: gettext('<b>%(code)s</b> are expired, and have been removed.'),
            },
            sold_out: {
                singular: gettext('<b>%(code)s</b> is sold out, and has been removed.'),
                plural: gettext('<b>%(code)s</b> are sold out, and have been removed.'),
            },
        },
        discountCodeInputFormat: gettext(
            'The coupon code entered is not valid for this course. Perhaps you used the wrong coupon code?',
        ),
        discountDuplicated: gettext('The coupon code entered has already been used.'),
    }),
    patterns: {
        validDiscountCode: /^([a-zA-Z0-9._-]){4,255}$/,
    },
    shoppingListNamespaces: ['cartPage', 'checkout', 'dropdown'],
    shoppingListTypes: ['cart', 'express', 'saved_for_later', 'wishlist'],
    storage: {
        status: {
            notReady: 'notReady',
            ready: 'ready',
            unAvailable: 'unAvailable',
        },
    },
    strings: (gettext: I18nApi['gettext']) => ({
        recommendations: {
            alsoLike: gettext('You might also like'),
            alsoViewed: gettext('Students Who Viewed This Course Also Viewed'),
            addedToCartTitle: gettext('Because you added %(title)s'),
            categoryBasedTitle: gettext('Bestsellers in %(title)s'),
            multipleEnrollmentBasedTitle: gettext('Based on Your Enrollments'),
            frequentlyBoughtTitle: gettext('Frequently Bought Together with %(title)s'),
            labelTitle: gettext('Bestsellers in %(title)s'),
            labelClusterTitle: gettext('Bestsellers in %(title)s'),
            recentlyViewedTitle: gettext('Recently viewed'),
            moreFromInstructor: gettext('More from this Instructor'),
            singleEnrollmentBasedTitle: gettext('Because you enrolled in %(title)s'),
            wishlistTitle: gettext('Wishlist'),
        },
        exploreAction: {
            cartSuccess: gettext('Go to Cart'),
            purchaseSuccess: gettext('Discover More Courses'),
            singlePurchase: gettext('Go to course'),
        },
    }),
    timing: {
        notificationHide: 10000,
    },
    urls: {
        cartAPI: '/shopping-carts/me/',
        cartSuccess: '/cart/',
        expressCheckoutAPI: '/shopping-carts/me/express/',
        paymentSuccessErrorRedirect: '/home/my-courses/',
        paymentSuccessPage(gatewayTransactionId: string) {
            return `/cart/success/${gatewayTransactionId}/`;
        },
        purchaseSuccess: '/',
    },
    urlParams: {
        buyableObjectType: 'boType',
        buyableObjectId: 'boId',
    },
};

export type ShoppingErrors = ReturnType<(typeof shoppingConfig)['errors']>;
