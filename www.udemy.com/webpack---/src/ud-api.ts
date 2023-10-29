/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, {Axios, AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import Cookies from 'js-cookie';

import {
    udMe as _udMe,
    noop,
    serverOrClient,
    getConfigData,
    updateUDWith,
} from '@udemy/shared-utils';
import {AuthenticatedUser, UDDataMe} from '@udemy/ud-data';

import {isDate, forEach, isObject, isArray} from './utils';

// Cast to UDDataMe for localized typing of me.
const udMe = (): UDDataMe => _udMe() as unknown as UDDataMe;

export const version = 'api-2.0';
export const TIMEOUT = 20000;
export const MAX_TIMEOUT = 60000;
const ADDITIONAL_CONTEXT_HEADER = 'x-udemy-additional-context';
const ACCEPT_LANGUAGE_HEADER = 'Accept-Language';
export const ADDITIONAL_CONTEXT_REQUESTED_COOKIE = 'X-Udemy-Additional-Context-Requested';

let cache: {[x: string]: any};

function getRootURL() {
    const udConfig = getConfigData();
    return serverOrClient.isClient
        ? udConfig.url.to_root
        : '/server-side-rendering-does-not-allow-api-calls/';
}

export function getApiHeaders() {
    return {
        'X-Requested-With': 'XMLHttpRequest',
        ...createAdditionalContextHeader(),
        ...populateAcceptLanguageHeader(),
    };
}

export function getDefaultErrorMessage(gettext: (text: string) => string) {
    return gettext('Unexpected error occurred');
}

export function getBaseURLPayment() {
    const rootURL = getRootURL();
    return `${rootURL}`;
}

export function getBaseURLUFBAnalytics() {
    const rootURL = getRootURL();
    return `${rootURL}organization-analytics/`;
}

export function getBaseURLTapen() {
    const rootURL = getRootURL();
    return `${rootURL}tapen/${version}/`;
}

declare module 'axios' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface AxiosRequestConfig<D = any> {
        useCache?: boolean;
    }
}

/**
 * Configurable options for a UD api instance
 */
export interface UdApiConfig extends AxiosRequestConfig {
    /**
     * Function that returns the base URL for a request
     * @default () => `${UD.config.url.to_root}${version}`
     */
    getBaseUrl(): string;
}

/**
 * A single UD api instance. Extension Axios with some custom configuration
 */
export interface UdApiInstance extends AxiosInstance {
    hasMockBaseUrlInterceptor: boolean;
    /**
     * Configuration for this UD api instance
     *
     * **NOTE:** Don't set this field directly. Instead, use the `configure` method
     */
    config: UdApiConfig;
    /**
     * Modify the configuration for this UD api instance
     * @param config object containing config values to set
     * @example udApi.configure({getBaseUrl: () => 'my-base-url'})
     */
    configure(config: Partial<UdApiConfig>): void;
}

export const udApi = createUDApi();
export const udTapenApi = createTapenApi();
export const udPaymentApi = createUDPaymentsApi();
export const udUFBAnalyticsApi = createUDUFBAnalyticsApi();

export function createUDApi() {
    const udApi = createAPI();
    udApi.interceptors.request.use((config) => {
        config.baseURL = udApi.config.getBaseUrl();
        return config;
    });
    udApi.get = getWithCacheSupport(udApi.get);
    udApi.get = withTrailingSlashCheck(udApi.get);
    udApi.post = withTrailingSlashCheck(udApi.post);
    udApi.put = withTrailingSlashCheck(udApi.put);
    udApi.patch = withTrailingSlashCheck(udApi.patch);
    return udApi;
}

export function createTapenApi() {
    const udTapenApi = createAPI();
    udTapenApi.interceptors.request.use((config) => {
        config.baseURL = getBaseURLTapen();
        return config;
    });
    udTapenApi.get = withTrailingSlashCheck(udTapenApi.get);
    udTapenApi.post = withTrailingSlashCheck(udTapenApi.post);
    udTapenApi.put = withTrailingSlashCheck(udTapenApi.put);
    udTapenApi.patch = withTrailingSlashCheck(udTapenApi.patch);
    return udTapenApi;
}

export function createUDPaymentsApi() {
    const udPaymentsApi = createAPI({
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'X-CSRFToken',
    });
    udPaymentsApi.interceptors.request.use((config) => {
        config.baseURL = getBaseURLPayment();
        return config;
    });
    return udPaymentsApi;
}

// TODO this is temporary! we need to move the endpoints into DRF!
export function createUDUFBAnalyticsApi() {
    const udUFBAnalyticsApi = createAPI();
    udUFBAnalyticsApi.interceptors.request.use((config) => {
        config.baseURL = getBaseURLUFBAnalytics();
        return config;
    });
    return udUFBAnalyticsApi;
}

export function populateUDFromResponse(additionalContextResponse: {data: any}) {
    updateUDWith(additionalContextResponse.data);
    return additionalContextResponse;
}

function populateUDFromResponseHeader(response: AxiosResponse<any, any>) {
    if (response.headers && response.headers[ADDITIONAL_CONTEXT_HEADER]) {
        updateUDWith(response.headers[ADDITIONAL_CONTEXT_HEADER]);
        Cookies.remove(ADDITIONAL_CONTEXT_REQUESTED_COOKIE);
    }
    return response;
}

export function createAPI(params?: AxiosRequestConfig<any>): UdApiInstance {
    const apiHeaders = getApiHeaders();
    const api = axios.create({
        headers: apiHeaders,
        timeout: MAX_TIMEOUT,
        paramsSerializer: udParamsSerializer as AxiosRequestConfig['paramsSerializer'],
        ...params,
    }) as UdApiInstance;
    api.interceptors.response.use(
        (response) => populateUDFromResponseHeader(response),
        (error: AxiosError) => {
            const headers = error.response && error.response.headers;
            const udMeId = (udMe() as AuthenticatedUser).id;
            const udMeLoading = udMe().isLoading;
            if (
                headers &&
                headers['x-udemy-failed-permission'] === 'user-auth' &&
                !udMeLoading &&
                udMeId
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
                return noop;
            }
            return Promise.reject(error);
        },
    );

    api.config = {
        getBaseUrl: () => {
            const rootURL = getRootURL();
            return `${rootURL}${version}/`;
        },
    };
    api.configure = (config) => {
        api.config = {...api.config, ...config};
    };

    return api;
}

function createAdditionalContextHeader():
    | {'X-Udemy-Additional-Context-Requested': string}
    | Record<string, unknown> {
    try {
        const cookie = Cookies.get(ADDITIONAL_CONTEXT_REQUESTED_COOKIE);
        const contextRequested = cookie && JSON.parse(cookie);
        if (contextRequested && !contextRequested.requires_api_call) {
            const headerValue = JSON.stringify(contextRequested.value) as string;
            return {
                'X-Udemy-Additional-Context-Requested': headerValue,
            };
        }
    } catch (error) {
        // TODO: create shared package to support this
        // Raven.captureException(error);
        return {};
    }
    return {};
}

// Adds support for our HTTP caching framework: udemy.utils.http_cache
export function getHttpCacheHeaders() {
    const cookies = Cookies.get() || {};

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
    const headers: Record<string, string> = {};
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
    const cookies = Cookies.get() || {};
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

function withTrailingSlashCheck(req: any) {
    return function (url: string | URL, ...rest: any) {
        const udConfig = getConfigData();
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
        return req(url as string, ...rest);
    };
}

export function getWithCacheSupport(get: Axios['get']): any {
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
    return function (
        url: string,
        config: {useCache?: boolean; expires?: number; headers?: Record<string, string>} = {},
    ) {
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
        const expires = config.expires ? config.expires * 1000 : 1000 * 60 * 60;

        if (cache[cacheKey]) {
            if (cache[cacheKey].expires <= now) {
                delete cache[cacheKey];
            } else {
                return cache[cacheKey].request;
            }
        }
        const request = get(url, config);
        cache[cacheKey] = {request, expires: now + expires};
        return request.catch((reason: any) => {
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
export const parseError = (error: {
    isParsedError: boolean;
    response: {status: number; data: any};
    message: string;
}) => {
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
    url: string,
    params: any,
    onSuccess: (arg0: any) => void,
    onError: (arg0: any) => void,
    shouldContinueFn: () => any,
    shouldStopFn: (arg0: any) => any,
    interval: number | undefined,
    _canceler: {isCanceled: any; timeoutId: any; cancel: any},
) {
    const udApi = createUDApi();
    if (shouldContinueFn() && !_canceler.isCanceled) {
        _canceler.timeoutId = setTimeout(() => {
            udApi
                .get(url, {params})
                .then((response: {data: any}) => {
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
                .catch(
                    (error: {
                        isParsedError: boolean;
                        response: {status: number; data: any};
                        message: string;
                    }) => {
                        if (onError) {
                            onError(parseError(error));
                        }
                    },
                );
        }, interval);
    }
    return _canceler.cancel;
}

export function startPollApi(
    url: string,
    params: any,
    onSuccess: (arg0: any) => void,
    onError: (arg0: any) => void,
    shouldContinueFn: () => any,
    shouldStopFn: (arg0: any) => any,
    interval: number | undefined,
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

export function udParamsSerializer(params: any, options: any) {
    // This is mostly copy-pasted from the `else` case in axios/lib/helpers/buildURL.js.
    // We made the following changes:
    // 1. We don't undo the encoding for colons (`replace(/%3A/gi, ':')`)
    //    because DRF expects them to be encoded.
    // 2. We added `arrayBrackets` option because some of our Django APIs expect
    //    ?k=v1&k=v2, not ?k[]=v1&k[]=v2.
    options = {arrayBrackets: true, ...options};

    const parts: string[] = [];

    forEach(params, (val: any, key: string) => {
        if (val === null || typeof val === 'undefined') {
            return;
        }

        if (isArray(val)) {
            if (options.arrayBrackets) {
                key = `${key}[]`;
            }
        } else {
            val = [val];
        }

        forEach(val, (v: Date | string) => {
            if (isDate(v)) {
                v = (v as Date).toISOString();
            } else if (isObject(v)) {
                v = JSON.stringify(v);
            }
            parts.push(`${_encode(key)}=${_encode(v as string)}`);
        });
    });

    return parts.join('&');
}

function _encode(val: string | number | boolean) {
    return encodeURIComponent(val)
        .replace(/%40/gi, '@')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']');
}

export function fetchAllPages(firstUrl: string, params: any, config?: any, _udApi?: AxiosInstance) {
    /*
    Fetches paginated results sequentially, until no more results are available. Relies on a data
    response of the form {results: [...], next: ...}
     */
    const results: any[] = [];
    const udApi = _udApi || createUDApi();
    function fetchPage(url: any, params?: any): Promise<any> {
        params = Object.assign({}, {params}, config);

        return udApi.get(url, params).then((response: any) => {
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
