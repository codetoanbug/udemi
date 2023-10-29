import axios from 'axios';
import utils from 'axios/lib/utils';
import Cookies from 'js-cookie';

import getConfigData, {updateUDWith} from 'utils/get-config-data';
import {noop} from 'utils/noop';
import serverOrClient from 'utils/server-or-client';
import udMe from 'utils/ud-me';
import Raven from 'utils/ud-raven';

const udConfig = getConfigData();

const rootURL = serverOrClient.isClient
    ? udConfig.url.to_root
    : '/server-side-rendering-does-not-allow-api-calls/';

export const defaultErrorMessage = gettext('Unexpected error occurred');
export const version = 'api-2.0';
export const baseURL = `${rootURL}${version}/`;
export const baseURLPayment = `${rootURL}`;
export const baseURLUFBAnalytics = `${rootURL}organization-analytics/`;
export const baseURLTapen = `${rootURL}tapen/${version}/`;
export const TIMEOUT = 20000;
export const MAX_TIMEOUT = 60000;
const ADDITIONAL_CONTEXT_HEADER = 'x-udemy-additional-context';
const ACCEPT_LANGUAGE_HEADER = 'Accept-Language';
export const ADDITIONAL_CONTEXT_REQUESTED_COOKIE = 'X-Udemy-Additional-Context-Requested';
export const apiHeaders = {
    'X-Requested-With': 'XMLHttpRequest',
    ...createAdditionalContextHeader(),
    ...populateAcceptLanguageHeader(),
};
let cache;

const udApi = createAPI({baseURL});
udApi.get = getWithCacheSupport(udApi.get);
udApi.get = withTrailingSlashCheck(udApi.get);
udApi.post = withTrailingSlashCheck(udApi.post);
udApi.put = withTrailingSlashCheck(udApi.put);
udApi.patch = withTrailingSlashCheck(udApi.patch);
export default udApi;

const udTapenApi = createAPI({baseURL: baseURLTapen});
udTapenApi.get = withTrailingSlashCheck(udTapenApi.get);
udTapenApi.post = withTrailingSlashCheck(udTapenApi.post);
udTapenApi.put = withTrailingSlashCheck(udTapenApi.put);
udTapenApi.patch = withTrailingSlashCheck(udTapenApi.patch);
export {udTapenApi};

export const udPaymentApi = createAPI({
    baseURL: baseURLPayment,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
});
// TODO this is temporary! we need to move the endpoints into DRF!
export const udUFBAnalyticsApi = createAPI({baseURL: baseURLUFBAnalytics});

export function populateUDFromResponse(additionalContextResponse) {
    updateUDWith(additionalContextResponse.data);
    return additionalContextResponse;
}

function populateUDFromResponseHeader(response) {
    if (response.headers && response.headers[ADDITIONAL_CONTEXT_HEADER]) {
        updateUDWith(response.headers[ADDITIONAL_CONTEXT_HEADER]);
        Cookies.remove(ADDITIONAL_CONTEXT_REQUESTED_COOKIE);
    }
    return response;
}

export function createAPI(params) {
    const api = axios.create({
        headers: apiHeaders,
        timeout: MAX_TIMEOUT,
        paramsSerializer: udParamsSerializer,
        ...params,
    });
    api.interceptors.response.use(
        (response) => populateUDFromResponseHeader(response),
        (error) => {
            const headers = error.response && error.response.headers;
            if (
                headers &&
                headers['x-udemy-failed-permission'] === 'user-auth' &&
                !udMe.isLoading &&
                udMe.id
            ) {
                // If the user needs to be logged in, and was logged in,
                // but his session expired/terminated,
                // redirect him to the login page so that he can log back in.
                // By refreshing the page, we let Django redirect to the correct login page
                // (it's different depending on marketplace, UFB, UFB SSO).
                // The x-udemy-failed-permission header is set in our DRF custom_exception_handler.
                serverOrClient.global.location.reload();

                // We've already handled the error by refreshing the page.
                // Return a promise that never resolves, so that chained .catch() callbacks
                // don't get triggered.
                return new Promise(noop);
            }
            return Promise.reject(error);
        },
    );
    return api;
}

function createAdditionalContextHeader() {
    try {
        const cookie = Cookies.get(ADDITIONAL_CONTEXT_REQUESTED_COOKIE);
        const contextRequested = cookie && JSON.parse(cookie);
        return contextRequested && !contextRequested.requires_api_call
            ? {
                  'X-Udemy-Additional-Context-Requested': JSON.stringify(contextRequested.value),
              }
            : {};
    } catch (error) {
        Raven.captureException(error);
        return {};
    }
}

// Adds support for our HTTP caching framework: udemy.utils.http_cache
export function getHttpCacheHeaders() {
    const cookies = Cookies.getJSON() || {};

    /*
     * While the backend can disable client caching for any further
     * requests, the client can ensure that previously-cached requests
     * are cleared by disabling cache-identification headers if the
     * cache override cookie is set.
     */
    if (Object.prototype.hasOwnProperty.call(cookies, 'ud_client_cache_off')) {
        return {};
    }

    /*
     * Our client caching layer needs to transfer "cache identifiers"
     * between client & server as follows:
     * 1. Server sends "cache identifiers" in the form of cookies
     *    named "ud_cache_id_name"
     * 2. Client should return these identifiers as headers in the
     *    format "X-Udemy-Cache-Id-Name"
     *
     * This code follows this specification to enable client-side caching.
     * See details inside udemy/utils/http_cache/README.md
     */
    const headers = {};
    Object.entries(cookies)
        .filter((entry) => entry[0].startsWith('ud_cache_'))
        .forEach((entry) => {
            const suffix = entry[0].split('ud_cache_')[1];
            const name = suffix
                .split('_')
                .map((s) => s.slice(0, 1).toUpperCase() + s.slice(1))
                .join('-');
            const key = `X-Udemy-Cache-${name}`;
            headers[key] = String(entry[1]);
        });
    return headers;
}

function populateAcceptLanguageHeader() {
    const cookies = Cookies.getJSON() || {};
    if (cookies.ud_locale) {
        const udLocaleConverted = cookies.ud_locale.split('_').join('-');
        return {
            [ACCEPT_LANGUAGE_HEADER]: udLocaleConverted,
        };
    }
}

export function resetCache() {
    cache = {};
}

function withTrailingSlashCheck(req) {
    return function (url, ...rest) {
        if (udConfig.env !== 'PROD') {
            const errorMessage = `Deprecated API call without trailing slash detected: "${url}". Fix this by adding trailing slash`;
            const parsedUrl = new URL(url, 'https://example.com');
            if (!parsedUrl.pathname.endsWith('/')) {
                throw Error(errorMessage);
            }
            if (parsedUrl.pathname.includes('//')) {
                throw Error(
                    `Double slashes detected in: ${url}. Might be a hint that the url is wrong`,
                );
            }
        }
        return req(url, ...rest);
    };
}

export function getWithCacheSupport(get) {
    resetCache();

    /**
     * Extends the ordinary axios.get method by adding two cache layers,
     * one that interacts with our server-side HTTP caching,
     * and another that caches explicitly in-memory.
     *
     * @param {string} url - url to make the GET request to like in axios
     * @param {import('axios').AxiosRequestConfig} config - axios config object, now accepts:
     * @property {boolean} config.useCache - whether to use caching or not
     * @property {number} config.expires -  seconds after which the cache will expire
     **/
    return function (url, config = {}) {
        // For HTTP caching, we update our headers with fresh cache info.
        // See udemy/utils/http_cache/README.md for details
        config.headers = {...config.headers, ...getHttpCacheHeaders()};

        if (!config.useCache) {
            // no in-memory cache
            return get(url, config);
        }

        // We only want to make the request if the config and url are *exactly* the same.
        const cacheKey = JSON.stringify(Object.assign({url}, config));
        const now = new Date().getTime();
        // Default expires is one hour, can be specified in seconds.
        const expires = config.expires * 1000 || 1000 * 60 * 60;

        if (cache[cacheKey]) {
            if (cache[cacheKey].expires <= now) {
                delete cache[cacheKey];
            } else {
                return cache[cacheKey].request;
            }
        }
        const request = get(url, config);
        cache[cacheKey] = {request, expires: now + expires};
        return request.catch((reason) => {
            delete cache[cacheKey];
            // We throw so that you can still do .catch()
            throw reason;
        });
    };
}

/**
 * udApi.get(...).catch(error => { parseError(error); });
 * - When error comes from API, error.response.data is an object.
 *   - If error is returned by DRF Response(serializer.errors), the keys are the names of the
 *     fields that have invalid data. The values are arrays of error strings, except for
 *     WarningRaisingSerializer, in which case the values are arrays of objects
 *     { messages: <array of error strings>, type: <either 'warning' or 'error'> }.
 *   - If error is raised by a Python Exception, then the key is "detail", and
 *     error.response.data.detail is a string containing the exception message
 *     (e.g. "Bad Request" or "Resource not found" or "Internal server error").
 * - When error comes from frontend (e.g. a bug in the promise callback), error.response is
 *   not defined. Instead, error.message is a string containing the error message.
 */
export const parseError = (error) => {
    if (error.isParsedError) {
        return error;
    }
    if (error.response) {
        return Object.assign(
            {isParsedError: true, statusCode: error.response.status},
            error.response.data,
        );
    }
    return {detail: error.message, JSError: error, isParsedError: true};
};

/**
 * Calls `url` every `interval` milliseconds until `shouldContinueFn` returns false,
 * or `shouldStopFn` is defined and returns true, or the API returns an error.
 * We have `shouldContinueFn` to stop the next cycle after `onSuccess`, and `shouldStopFn`
 * to stop before `onSuccess`. This is used to update asset status until it is no longer
 * `assetStatuses.processing`.
 * Returns a function which may be called to cancel the refreshing.
 */

function _pollApi(
    url,
    params,
    onSuccess,
    onError,
    shouldContinueFn,
    shouldStopFn,
    interval,
    _canceler,
) {
    if (shouldContinueFn() && !_canceler.isCanceled) {
        _canceler.timeoutId = setTimeout(() => {
            udApi
                .get(url, {params})
                .then((response) => {
                    if (shouldStopFn && shouldStopFn(response.data)) {
                        return;
                    }
                    if (onSuccess) {
                        onSuccess(response.data);
                    }
                    _pollApi(
                        url,
                        params,
                        onSuccess,
                        onError,
                        shouldContinueFn,
                        shouldStopFn,
                        interval,
                        _canceler,
                    );
                })
                .catch((error) => {
                    if (onError) {
                        onError(parseError(error));
                    }
                });
        }, interval);
    }
    return _canceler.cancel;
}

export function startPollApi(
    url,
    params,
    onSuccess,
    onError,
    shouldContinueFn,
    shouldStopFn,
    interval,
) {
    const _canceler = {
        isCanceled: false,
        timeoutId: undefined,
        cancel() {
            clearInterval(_canceler.timeoutId);
            _canceler.isCanceled = true;
        },
    };

    return _pollApi(
        url,
        params,
        onSuccess,
        onError,
        shouldContinueFn,
        shouldStopFn,
        interval,
        _canceler,
    );
}

export function udParamsSerializer(params, options) {
    // This is mostly copy-pasted from the `else` case in axios/lib/helpers/buildURL.js.
    // We made the following changes:
    // 1. We don't undo the encoding for colons (`replace(/%3A/gi, ':')`)
    //    because DRF expects them to be encoded.
    // 2. We added `arrayBrackets` option because some of our Django APIs expect
    //    ?k=v1&k=v2, not ?k[]=v1&k[]=v2.
    options = {arrayBrackets: true, ...options};

    const parts = [];

    utils.forEach(params, (val, key) => {
        if (val === null || typeof val === 'undefined') {
            return;
        }

        if (utils.isArray(val)) {
            if (options.arrayBrackets) {
                key = `${key}[]`;
            }
        } else {
            val = [val];
        }

        utils.forEach(val, (v) => {
            if (utils.isDate(v)) {
                v = v.toISOString();
            } else if (utils.isObject(v)) {
                v = JSON.stringify(v);
            }
            parts.push(`${_encode(key)}=${_encode(v)}`);
        });
    });

    return parts.join('&');
}

function _encode(val) {
    return encodeURIComponent(val)
        .replace(/%40/gi, '@')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']');
}

export function fetchAllPages(firstUrl, params, config = undefined) {
    /*
    Fetches paginated results sequentially, until no more results are available. Relies on a data
    response of the form {results: [...], next: ...}
     */
    const results = [];
    function fetchPage(url, params) {
        params = Object.assign({}, {params}, config);
        return udApi.get(url, params).then((response) => {
            results.push(...response.data.results);
            const nextPageUrl = response.data.next;
            if (!nextPageUrl) {
                return results;
            }
            // Query params are included in the 'next' URL, so no need to send them on subsequent requests.
            return fetchPage(nextPageUrl);
        });
    }
    return fetchPage(firstUrl, params);
}
