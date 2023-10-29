import {PARAM_DISCOUNT_CODE, PARAM_COUPON_CODE} from './constants';

export function buildItemFromBuyable(buyable, codes) {
    return {
        buyableObjectId: buyable.objectId,
        buyableObjectType: buyable.objectType,
        codes: codes || [],
    };
}

const getDistinct = (array) => [...new Set(array)];
const allValues = (keys, fn) => keys.reduce((a, key) => a.concat(fn(key)), []);
const updateURLWith = (params) => {
    const paramsStr = params.toString();
    let url =
        paramsStr.length > 0
            ? `${window.location.pathname}?${paramsStr}`
            : window.location.pathname;
    if (window.location.hash) {
        url = `${url}${window.location.hash}`;
    }
    window.history.replaceState({}, '', url);
};
export function couponURLHandler(params) {
    const paramValues = (key) => (params.get(key) ? params.get(key).split(',') : []);

    return {
        get: () => getDistinct(allValues([PARAM_COUPON_CODE, PARAM_DISCOUNT_CODE], paramValues)),
        remove: () => {
            params.delete(PARAM_DISCOUNT_CODE);
            params.delete(PARAM_COUPON_CODE);
            updateURLWith(params);
        },
        add: (codes = []) => {
            if (!codes.length) {
                return;
            }

            params.set(PARAM_COUPON_CODE, codes.join(','));
            updateURLWith(params);
        },
    };
}
