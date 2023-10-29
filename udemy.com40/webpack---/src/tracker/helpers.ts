import {v4 as uuid} from 'uuid';

import {Deferred} from '../types';

/**
 * Gets the offset of the timezone. For example -4 for GMT-4
 */
export function getTimezoneOffset() {
    return (new Date().getTimezoneOffset() / 60) * -1;
}

/**
 * Decorates the function with a retry behavior.
 * The decorated function is retried if it throws an exception.
 * If shouldRetry function is not provided or if it returns false the retry can be cancelled.
 * @param fn: Function to be decorated
 * @param retryCount: How many times to retry after first try
 * @param retryGap: Gap between retries in milliseconds
 * @param shouldRetry: An optional function that decides to retry or not based on the
 * error - caller can assume the type of the error
 */
export function makeRetryingFunction<TArgs extends unknown[], TReturn, TError extends Error>(
    fn: (...args: TArgs) => TReturn,
    retryCount: number,
    retryGap = 0,
    shouldRetry: (e: TError) => boolean = () => true,
) {
    return async function (...args: TArgs) {
        for (let i = 0; i < retryCount; i++) {
            try {
                return await fn(...args);
            } catch (exception) {
                const lastAttempt = i + 1 === retryCount;
                const stopRetry = !shouldRetry(exception as TError);
                if (lastAttempt || stopRetry) {
                    throw exception;
                }
                retryGap && (await delay(retryGap));
            }
        }

        return fn(...args);
    };
}

export const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * This is a decorator that wraps an async function with a mechanism that prevents another
 * invocation while there is an unfinished one.
 */
export function preventOverlappingCall<TArgs extends unknown[], TReturn>(
    fn: (...args: TArgs) => TReturn,
) {
    let awaiting = false;
    return async function (...args: TArgs) {
        if (awaiting) {
            return;
        }
        awaiting = true;
        const result = await fn(...args);
        awaiting = false;
        return result;
    };
}

let printLogs = true;

/**
 * This functions turns on the log printing on or off.
 */
export function setPrintLogs(value: boolean) {
    printLogs = value;
}

export function log(...args: Parameters<typeof console.log>) {
    if (printLogs) {
        // eslint-disable-next-line no-console
        console.log(...args);
    }
}

export function logError(...args: Parameters<typeof console.error>) {
    if (printLogs) {
        // eslint-disable-next-line no-console
        console.error(...args);
    }
}

/**
 * Use this to generate slug uuids for your objects
 * to be used for tracking
 */
export function generateTrackingId() {
    // @ts-expect-error - 'binary' option is deprecated and it doesn't live on @types/uuid
    const bytes: string = uuid('binary');
    return uuidToSlug(bytes);
}

/**
 * Generates short and url safe version of a UUID
 */
function uuidToSlug(uuidBytes: string) {
    const base64 =
        typeof window === 'undefined'
            ? globalThis.Buffer.from(uuidBytes).toString()
            : btoa(uuidBytes);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').substring(0, 22); // Drop '==' padding
}

/**
 * @returns {{promise: Promise; resolve: () => void; reject: () => void}}
 */
export function createDeferred() {
    const deferred = {} as Deferred;
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
    return deferred;
}
