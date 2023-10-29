export const EXPIRED_TRIAL_CONTENT = 'expired-trial';
export const EXTEND_TRIAL_CONTENT = 'trial-extension';
export const EXPIRED_SUBSCRIPTION_CONTENT = 'expired-subscription';
export const EXPIRED_ADMIN_SUBSCRIPTION_CONTENT = 'expired-admin-subscription';
export const EXPIRING_ADMIN_SUBSCRIPTION_CONTENT = 'expiring-admin-subscription';

// id : marketo list id
export const REASONS = [
    // TODO: use a more specific name
    {
        id: 7410,
        text: gettext('I want more time to explore the product'),
        analyticsLabel: 'More time to explore',
    },
    {
        id: 7411,
        text: gettext('I need more time to get approval to buy this product'),
        analyticsLabel: 'More time to get approval',
    },
    {
        id: 7412,
        text: gettext('I want more time to show this product to my team'),
        analyticsLabel: 'More time to show product to team',
    },
];

export const EXPIRED_MESSAGE_PREVIEW = gettext('Your preview has expired');
export const EXPIRED_MESSAGE_TRIAL = gettext('Your trial has expired');
export const EXTEND_LINK_TEMPLATE_PREVIEW = gettext('Extend your preview for three days');
export const EXTEND_LINK_TEMPLATE_TRIAL = gettext('Extend your trial for three days');
export const EXTEND_REASON_TRIAL = gettext('Why do you want to extend your trial?');
export const EXTEND_REASON_PREVIEW = gettext('Why do you want to extend your preview?');

export const EXTENDING_MESSAGE_PREVIEW = gettext('We are extending your preview');
export const EXTENDING_MESSAGE_TRIAL = gettext('We are extending your trial');
