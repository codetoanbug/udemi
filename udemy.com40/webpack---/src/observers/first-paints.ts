import {po} from './po';
import {InternalState, limitPerformanceTiming} from './state';

/**
 * Creates `paint` performance observer to implement reporting of `first-paint` and `first-contentful-paint`
 * Also signals initialization of `longtask` performance observer to collect `tbt` metrics
 *
 * @param {function} reportFn - Report callback for collection of statistics
 * @param {object} - metrics - Shared metrics to coordinate between performance observers
 * @param {function} initTbt - callback to signal initializing observing long tasks to calculate total blocking time
 * @returns {function} - disconnect function
 */
// eslint-disable-next-line import/prefer-default-export
export function initFirstPaints(
    reportFn: Function,
    metrics: InternalState['metrics'],
    initTbt: Function,
) {
    let isDisconnected = false;
    let paintObserver: PerformanceObserver | boolean = false;

    const safeDisconnect = () => {
        if (!isDisconnected && paintObserver) {
            // `paintObserver` can be `false` if no browser support for observer type
            (paintObserver as PerformanceObserver).disconnect();

            // only need to execute this handler once
            isDisconnected = true;
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paintObserver = po('paint', (performanceEntries: any[]) => {
        performanceEntries.forEach((entry: PerformanceEntry) => {
            if (entry.name === 'first-paint') {
                const startTime = limitPerformanceTiming(entry.startTime);
                reportFn('fp', startTime);
            } else if (entry.name === 'first-contentful-paint') {
                // save fcp time to help calculate tbt
                const startTime = limitPerformanceTiming(entry.startTime);
                metrics.fcp = startTime;

                // set fcp entry
                reportFn('fcp', metrics.fcp);

                // Send signal to initialize total blocking time (tbt)
                initTbt();

                // Disconnect this observer, we don't need it anymore
                safeDisconnect();
            }
        });
    });

    return safeDisconnect;
}
