export const PURCHASE_SECTION_VARIATION = {
    DEFAULT: 'default',
    SIDEBAR: 'sidebar',
};

export const PURCHASE_OPTION_TYPES = {
    subscription: {
        name: 'subscription',
        order: ['subscription', 'transactional'],
    },
    transactional: {
        name: 'transactional',
        order: ['transactional', 'subscription'],
    },
};
