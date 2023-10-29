export const DISCOUNT_STATUSES = {
    INVALID: 'invalid',
    EXPIRED: 'expired',
    SOLD_OUT: 'sold_out',
    UNUSED: 'unused',
    APPLIED: 'applied',
    APPLIED_HIDDEN: 'applied_hidden',
};

export const PARAM_DISCOUNT_CODE = 'discountCode';
export const PARAM_COUPON_CODE = 'couponCode';

export const SHOPPING_LIST_ACTIONS = {
    ADD: 'add',
    REMOVE: 'remove',
    MOVE: 'move',
};

export type ShoppingListActionsKeys = keyof typeof SHOPPING_LIST_ACTIONS;
export type ShoppingListActionsValues = (typeof SHOPPING_LIST_ACTIONS)[ShoppingListActionsKeys];
