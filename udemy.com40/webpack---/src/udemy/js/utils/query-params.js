import qs from 'qs';

/**
 * @param location: the location object from React Router.
 * @returns the url query params as an object.
 */
export function getQueryParams(location = window.location) {
    return qs.parse(location.search, {ignoreQueryPrefix: true});
}

export function getParamValueAsBool(value, defaultValue) {
    if (typeof value === 'boolean') {
        return value;
    }
    const boolMap = {
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

export function getParamValueAsChoice(value, choices, defaultValue) {
    if (choices.indexOf(value) >= 0) {
        return value;
    }
    return defaultValue;
}

export function getParamValueAsInt(value, defaultValue) {
    const intValue = parseInt(value, 10);
    if (isNaN(intValue)) {
        return defaultValue;
    }
    return intValue;
}

export function getParamValueAsStr(value, defaultValue) {
    return value || defaultValue;
}

export default qs;
