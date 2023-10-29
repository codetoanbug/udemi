const strings = {
    recommendations: {
        get alsoLike() {
            return gettext('You might also like');
        },
        get alsoViewed() {
            return gettext('Students Who Viewed This Course Also Viewed');
        },
        get addedToCartTitle() {
            return gettext('Because you added %(title)s');
        },
        get categoryBasedTitle() {
            return gettext('Bestsellers in %(title)s');
        },
        get multipleEnrollmentBasedTitle() {
            return gettext('Based on Your Enrollments');
        },
        get frequentlyBoughtTitle() {
            return gettext('Frequently Bought Together with %(title)s');
        },
        get labelTitle() {
            return gettext('Bestsellers in %(title)s');
        },
        get labelClusterTitle() {
            return gettext('Bestsellers in %(title)s');
        },
        get recentlyViewedTitle() {
            return gettext('Recently viewed');
        },
        get moreFromInstructor() {
            return gettext('More from this Instructor');
        },
        get singleEnrollmentBasedTitle() {
            return gettext('Because you enrolled in %(title)s');
        },
        get wishlistTitle() {
            return gettext('Wishlist');
        },
    },
    exploreAction: {
        get cartSuccess() {
            return gettext('Go to Cart');
        },
        get purchaseSuccess() {
            return gettext('Discover More Courses');
        },
        get singlePurchase() {
            return gettext('Go to course');
        },
    },
};

const config = {
    errors: {
        get default() {
            return gettext('An unknown error occurred.');
        },
        discount: {
            invalid: {
                get singular() {
                    return gettext('<b>%(code)s</b> is invalid, and has been removed.');
                },
                get plural() {
                    return gettext('<b>%(code)s</b> are invalid, and have been removed.');
                },
            },
            expired: {
                get singular() {
                    return gettext('<b>%(code)s</b> is expired, and has been removed.');
                },
                get plural() {
                    return gettext('<b>%(code)s</b> are expired, and have been removed.');
                },
            },
            sold_out: {
                get singular() {
                    return gettext('<b>%(code)s</b> is sold out, and has been removed.');
                },
                get plural() {
                    return gettext('<b>%(code)s</b> are sold out, and have been removed.');
                },
            },
        },
        get discountCodeInputFormat() {
            return gettext(
                'The coupon code entered is not valid for this course. Perhaps you used the wrong coupon code?',
            );
        },
        get discountDuplicated() {
            return gettext('The coupon code entered has already been used.');
        },
    },
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
    strings,
    timing: {
        notificationHide: 10000,
    },
    urls: {
        cartAPI: '/shopping-carts/me/',
        cartSuccess: '/cart/',
        expressCheckoutAPI: '/shopping-carts/me/express/',
        paymentSuccessErrorRedirect: '/home/my-courses/',
        paymentSuccessPage(gatewayTransactionId) {
            return `/cart/success/${gatewayTransactionId}/`;
        },
        purchaseSuccess: '/',
    },
    urlParams: {
        buyableObjectType: 'boType',
        buyableObjectId: 'boId',
    },
    goToUrl: (url) => {
        window.location.href = url;
    },
};

export default config;
