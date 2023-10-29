export const VALIDATION = Object.freeze({
    success: 'success',
    warning: 'warning',
    error: 'error',
});

/**
 * See related ExcludeExternalURLValidator, ExcludeURLValidator and URLS_REGEX. This REGEX
 * checks whether the required section of urls in our implementation of URLS_REGEX is present
 * and then checks if all the urls are Udemy urls
 */
export function validateExcludeExternalURL({text}) {
    const urlRegex = /([\w-]{1,63}\.[a-zA-Z-]{2,63})/g;
    const udemyUrlRegex = /(ude\.my|udemy\.(com|cn))/;
    const urlMatches = text.match(urlRegex);
    return urlMatches === null || urlMatches.every((url) => url.match(udemyUrlRegex) !== null)
        ? VALIDATION.success
        : VALIDATION.error;
}

/**
 * See related ExcludeExternalURLValidator, ExcludeURLValidator and URLS_REGEX. This REGEX
 * checks whether the required section of urls in our implementation of URLS_REGEX is present
 * and then checks if all the urls are Udemy urls
 */
export function validateUdemyURL({text}) {
    const urlRegex = /^http[s]?:\/\/([\w-]{1,63}\.[a-zA-Z-]{2,63}(\.(com|cn)?)?\/?)/g;
    const udemyUrlRegex = /(ude\.my|udemy\.(com|cn))/;
    const urlMatches = text.match(urlRegex);
    return urlMatches !== null && urlMatches.every((url) => url.match(udemyUrlRegex) !== null)
        ? VALIDATION.success
        : VALIDATION.error;
}

/**
 * expect a list of validators
 * expects an object with the properties that the validators need, such as maximum
 */
export default function applyValidators(validators, params) {
    return validators.every((v) => v(params) === VALIDATION.success)
        ? VALIDATION.success
        : VALIDATION.error;
}
