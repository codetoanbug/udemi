import {PARAM_DISCOUNT_CODE, PARAM_COUPON_CODE} from './constants';

function allValues(keys: string[], fn: (key: string) => string[]) {
    return keys.reduce((a, key) => a.concat(fn(key)), [] as string[]);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateUrlWith(params: any) {
    const paramsStr = params.toString();
    let url =
        paramsStr.length > 0
            ? `${window.location.pathname}?${paramsStr}`
            : window.location.pathname;
    if (window.location.hash) {
        url = `${url}${window.location.hash}`;
    }

    window.history.replaceState({}, '', url);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function couponUrlHandler(params: any) {
    const paramValues = (key: string) => (params.get(key) ? params.get(key).split(',') : []);

    return {
        get: () => [...new Set(allValues([PARAM_COUPON_CODE, PARAM_DISCOUNT_CODE], paramValues))],
        remove: () => {
            params.delete(PARAM_DISCOUNT_CODE);
            params.delete(PARAM_COUPON_CODE);
            updateUrlWith(params);
        },
        add: (codes: string[] = []) => {
            if (!codes.length) {
                return;
            }

            params.set(PARAM_COUPON_CODE, codes.join(','));
            updateUrlWith(params);
        },
    };
}
