import {eventNamePrefix} from './constants';
import {isPerformanceSupported} from './utils';

/**
 * Namespaces and formats performance events for consistency
 *
 * @param {string} eventName - name of the event
 * @param {null|string} position - can be null, "start" or "end"
 * @returns {string} - formatted event string
 */
export function formatEventName(eventName: string, position: string | null = null): string {
    if (position) {
        return `${eventNamePrefix}${eventName}-${position}`;
    }
    return `${eventNamePrefix}${eventName}`;
}

/**
 * Wraps `window.performance.mark` to namespace Udemy performance events as `UD-{name}`
 * `window.performance.mark` creates a timestamp in the browser's performance entry buffer with the given name.
 * https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark
 *
 * @param {string} eventName - name of mark event
 * @returns {boolean} - success signal (primarily to improve unit testing)
 */
export function mark(eventName: string): boolean {
    if (isPerformanceSupported()) {
        window.performance.mark(formatEventName(eventName));
        return true;
    }
    return false;
}

/**
 * Creates start performance mark of format `UD-{eventName}-start`
 *
 * @param {string} eventName - name of starting performance mark event
 * @returns {boolean} - success signal (primarily to improve unit testing)
 */
export function start(eventName: string): boolean {
    if (isPerformanceSupported()) {
        window.performance.mark(formatEventName(eventName, 'start'));
        return true;
    }
    return false;
}

/**
 * Creates mark of format `UD-{eventName}-end` and measure `UD-{eventName}`
 *
 * @param {string} eventName - name of ending performance mark event
 * @returns {boolean} - success signal (primarily to improve unit testing)
 */
export function end(eventName: string) {
    if (isPerformanceSupported()) {
        const endMark = formatEventName(eventName, 'end');
        const startMark = formatEventName(eventName, 'start');
        window.performance.mark(endMark);
        if (window.performance.getEntriesByName(startMark).length > 0) {
            const mark = formatEventName(eventName);
            window.performance.measure(mark, startMark, endMark);
        }
        return true;
    }
    return false;
}

export const udPerf = {
    end,
    mark,
    start,
};
