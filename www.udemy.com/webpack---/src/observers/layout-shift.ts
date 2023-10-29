import {po} from './po';
import {InternalState} from './state';

/**
 * Creates `layout-shift` performance observer to implement collection of `cls` and `clsFinal` metrics
 *
 * @param {function} reportFn - Report callback for collection of statistics
 * @param {object} - metrics - Shared metrics to coordinate between performance observers
 * @returns {function} - disconnect function
 */
// eslint-disable-next-line import/prefer-default-export
export const initLayoutShift = (
    reportFn: Function,
    metrics: InternalState['metrics'],
): Function => {
    let isDisconnected = false;
    reportFn('clsFinal', 0);
    const shiftObserver = po('layout-shift', (performanceEntries: PerformanceEntryList) => {
        const lastEntry = performanceEntries.pop() as PerformanceEntry;
        // Only count layout shifts without recent user input.
        if (lastEntry && !lastEntry.hadRecentInput && lastEntry.value) {
            // Save `cls` to shared state to report during first input
            metrics.cls += lastEntry.value;

            // Always report `clsFinal`
            reportFn('clsFinal', metrics.cls);
        }
    });

    return () => {
        if (!isDisconnected) {
            // `shiftObserver` can be `false` if no browser support for observer type
            shiftObserver && shiftObserver.disconnect();

            // only need to execute this handler once
            isDisconnected = true;
        }
    };
};
