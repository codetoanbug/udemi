import qs from 'qs';

/**
 * @param location: the location object from React Router.
 * @returns the url query params as an object.
 */
export function getQueryParams(location = window.location) {
    return qs.parse(location.search, {ignoreQueryPrefix: true});
}

export function getParamValueAsBool(value: string, defaultValue: boolean) {
    if (typeof value === 'boolean') {
        return value;
    }
    const boolMap: Record<string, boolean> = {
        0: false,
        1: true,
        false: false,
        true: true,
        on: true,
        off: false,
        enabled: true,
        disabled: false,
    };
    const boolMapKey = (value || '').toLowerCase();
    if (boolMap[boolMapKey] === undefined) {
        return defaultValue;
    }
    return boolMap[boolMapKey];
}

export function getParamValueAsChoice(value: string, choices: string[], defaultValue: string) {
    if (choices.indexOf(value) >= 0) {
        return value;
    }
    return defaultValue;
}

export function getParamValueAsInt(value: string, defaultValue: number) {
    const intValue = parseInt(value, 10);
    if (isNaN(intValue)) {
        return defaultValue;
    }
    return intValue;
}

export function getParamValueAsStr(value: string, defaultValue: string) {
    return value || defaultValue;
}
