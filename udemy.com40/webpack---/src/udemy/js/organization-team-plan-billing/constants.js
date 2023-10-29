import udLink from '../utils/ud-link';

export const NEW_SUBSCRIPTION_MIN_LICENSES = 5;
export const SUBSCRIPTION_UPGRADE_MIN_LICENSES = 1;
export const MAX_LICENSES = 20;

export const PAYMENT_CARD_PANEL_DEFAULT = 'payment-card-panel-default';
export const PAYMENT_CARD_PANEL_CHECKOUT = 'payment-card-panel-checkout';

export const ANALYTICS_SUB_CATEGORY_DELETE_PAYMENT_METHOD = 'DeletePaymentMethod';
export const ANALYTICS_SUB_CATEGORY_PAYMENT = 'Payment';

export const PANEL_HEADER_PREVIEW = gettext('Team Plan Preview');
export const PANEL_HEADER_TRIAL = gettext('Team Plan Trial');
export const PANEL_HEADER_SUBSCRIPTION = gettext('Subscriptions');
export const PREVIEW_ENDS_LABEL = gettext('Preview Ends');
export const PREVIEW_ENDED_LABEL = gettext('Preview Ended');
export const SUBSCRIPTION_ENDS_LABEL = gettext('Subscription Ends');
export const SUBSCRIPTION_ENDED_LABEL = gettext('Subscription Ended');
export const TRIAL_ENDS_LABEL = gettext('Trial Ends');
export const TRIAL_ENDED_LABEL = gettext('Trial Ended');

export const RESTRICTED_REGIONS = new Set(['IN']);

export const COMPLETING_PURCHASE_TERMS_MESSAGE = interpolate(
    gettext(
        'By completing your purchase you agree to these <a href="%(link)s">Terms of Service</a>.',
    ),
    {link: '/terms/ub/'},
    true,
);

// We show an error inside the StripeCardForm but if you have a saved card the form is not expanded
// so the error is hidden. That's why we keep track of the position using these 2 positions
export const ERROR_POSITIONS = {
    INSIDE_PAYMENT_FORM: 'inside',
    OUTSIDE_PAYMENT_FORM: 'outside',
};

export const SUBSCRIPTION_AND_BILLING_PAGES = Object.freeze({
    SUBSCRIPTION: 'subscription',
    BILLING: 'billing',
});

export const SIDEBAR_MENU_ITEMS = Object.freeze([
    {
        key: SUBSCRIPTION_AND_BILLING_PAGES.SUBSCRIPTION,
        title: gettext('Subscription management'),
        href: udLink.toUFBSettingsSubscription(),
    },
    {
        key: SUBSCRIPTION_AND_BILLING_PAGES.BILLING,
        title: gettext('Billing'),
        href: udLink.toUFBSettingsBilling(),
    },
]);
