import {po} from './po';
import {InternalState} from './state';

/**
 * Create a long task observer to track total blocking time
 *
 * @param {function} reportFn - Report callback for collection of statistics
 * @param {object} - metrics - Shared metrics to coordinate between performance observers
 * @returns {function} - disconnect function
 */
// eslint-disable-next-line import/prefer-default-export
export const initTotalBlockingTime = (
    reportFn: Function,
    metrics: InternalState['metrics'],
): Function => {
    let isDisconnected = false;
    const longtaskObserver = po('longtask', (performanceEntries: PerformanceEntryList) => {
        performanceEntries.forEach((entry: PerformanceEntry) => {
            if (entry.name !== 'self' || entry.startTime < (metrics.fcp as number)) {
                return;
            }
            const blockingTime = entry.duration - 50;
            if (blockingTime > 0) {
                // Save `tbt` to report during first input, 5s after first input, 10s after first input
                metrics.tbt += blockingTime;

                // Always report `tbtFinal`
                reportFn('tbtFinal', metrics.tbt);
            }
        });
    });
    return () => {
        if (!isDisconnected) {
            // `longtaskObserver` can be `false` if no browser support for observer type
            longtaskObserver && longtaskObserver.disconnect();

            // only need to execute this handler once
            isDisconnected = true;
        }
    };
};
