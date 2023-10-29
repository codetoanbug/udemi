export const couponsApiDefaultParams = Object.freeze({
    ordering: '-created',
    page: 1,
    page_size: 10,
    search: '',
    show_inactive: false,
});

export const courseFieldFilters = Object.freeze({
    'fields[course]': getCourseFields().join(','),
    'fields[course_feature]': 'promotions_create',
});

export const courseFields = getCourseFields();

export const coursePriceUpdateFieldFilters = Object.freeze({
    'fields[course]': getPriceFields().join(','),
});

export const defaultCurrency = 'usd';

export const emptyInputValue = ''; // React controlled inputs do not accept null as a value.

export const loadingState = Object.freeze({
    initial: 'initial',
    loading: 'loading',
    loaded: 'loaded',
});

export const noResultFoundText = gettext('No coupon found');

export const couponTableFields = {
    CODE: {
        name: 'code',
        label: gettext('Code'),
    },
    DISCOUNT: {
        name: 'discount_value',
        label: gettext('Discount'),
    },
    USES: {
        name: 'number_of_uses',
        mobile: {
            label: gettext('Remaining redemptions'),
        },
        desktop: {
            label: gettext('Redemptions'),
        },
    },
    CREATED: {
        name: 'created',
        label: gettext('Start date'),
    },
    ENDTIME: {
        name: 'end_time',
        mobile: {
            label: gettext('End date'),
        },
        desktop: {
            valid: {
                label: gettext('Time remaining'),
            },
            invalid: {
                label: gettext('End date'),
            },
        },
    },
    LINK: {
        name: 'link',
        mobile: {
            label: null,
        },
        desktop: {
            label: gettext('Link'),
        },
    },
    STATUS: {
        name: 'is_disabled',
        label: gettext('Status'),
    },
};

function getCourseFields() {
    return getPriceFields().concat([
        '_class',
        'features',
        'id',
        'is_published',
        'published_time',
        'is_practice_test_course',
        'num_published_practice_tests',
        'is_owner',
        'owner_is_premium_instructor',
        'url',
    ]);
}

function getPriceFields() {
    return ['base_price_detail', 'is_paid', 'min_price', 'num_paid_switches', 'price_updated_date'];
}

export const couponCodeCreationModalValidStates = Object.freeze({
    loading: 'loading',
    coupon_type: 'coupon_type',
    coupon_details: 'coupon_details',
    review_coupon: 'review_coupon',
    creation_success: 'creation_success',
});

export const couponCreationTypes = Object.freeze({
    urgency_discount: {
        name: 'urgency_discount',
        label: gettext('Current best price'),
        redemption_info: gettext('Unlimited redemptions'),
        tooltip: gettext(
            'This coupon matches the lowest price Udemy would offer any student for this course at the time you create the coupon.',
        ),
        type: 'paid',
        version: 'urgency',
    },
    long_discount: {
        name: 'long_discount',
        label: gettext('Custom price'),
        redemption_info: gettext('Unlimited redemptions'),
        tooltip: gettext(
            'The lower bound of this range represents a typical promotional price Udemy might offer. It maybe higher or lower than the Udemy sale price on a given day.',
        ),
        type: 'paid',
        version: 'long',
    },
    urgency_free: {
        name: 'urgency_free',
        label: gettext('Free: Open'),
        type: 'free',
        version: 'urgency',
    },
    scarcity_free: {
        name: 'scarcity_free',
        label: gettext('Free: Targeted'),
        type: 'free',
        version: 'scarcity',
    },
});

export const couponValidationErrors = Object.freeze({
    0: gettext('Invalid parameters.'),
    1: gettext("You don't have permission to validate coupons for this course."),
    2: gettext('Incorrect course id.'),
    3: gettext(
        'Your coupon code must be between 6 and 20 characters, and contain only CAPITAL letters (A-Z), numbers (0-9), periods ("."), dashes ("-") and underscores ("_")',
    ),
    4: gettext('That coupon code has already been used.'),
    5: gettext('Incorrect price format of coupon.'),
    6: gettext('Incorrect type of coupon.'),
    7: gettext('This coupon has an invalid price.'),
    8: gettext('This coupon code is reserved. Please try a different code.'),
    9: gettext('Date format is invalid.'),
    10: gettext('Start date cannot be in the past.'),
    11: gettext('Start date cannot be beyond the current month.'),
});
