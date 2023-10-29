import {po} from './po';
import {limitPerformanceTiming, InternalState} from './state';

/**
 * Creates `first-input` performance observer to implement reporting of first input delay.
 * Also reports `lcp`, `cls`, `tbt`, `tbt5s`, `tbt10s`, and `tbtFinal` as a side effect
 *
 * @param {function} reportFn - Report callback for collection of statistics
 * @param {object} - metrics - Shared metrics to coordinate between performance observers
 * @returns {function} - disconnect function
 */
// eslint-disable-next-line import/prefer-default-export
export function initFirstInputDelay(reportFn: Function, metrics: InternalState['metrics']) {
    let timeout5s: ReturnType<typeof setTimeout> | undefined;
    let timeout10s: ReturnType<typeof setTimeout> | undefined;
    let isDisconnected = false;
    const fidObserver = po('first-input', (performanceEntries: PerformanceEntryList) => {
        const lastEntry = performanceEntries.pop();
        if (lastEntry) {
            // Measure the delay to begin processing the first input event (max of 5s)
            const inputDelayTime = lastEntry.processingStart - lastEntry.startTime;
            reportFn('fid', limitPerformanceTiming(inputDelayTime, 5000));
            // Measure when a user first starts interacting with site
            reportFn('fidStart', lastEntry.startTime);
        }
        // Disconnect this observer since callback is only triggered once
        (fidObserver as PerformanceObserver).disconnect();

        // Report `lcp` at first input
        // We also listen for `keydown` and `click` events in `./largest-contentful-paint.js`
        // so between both events we should report LCP at first input
        reportFn('lcp', metrics.lcp);

        // Report `cls` at first input
        reportFn('cls', metrics.cls);

        // Report `tbt` at first input
        reportFn('tbt', metrics.tbt);

        // TBT with 5 second delay after FID
        timeout5s = setTimeout(() => {
            reportFn('tbt5S', metrics.tbt);
        }, 5000);

        // TBT with 10 second delay after FID
        timeout10s = setTimeout(() => {
            reportFn('tbt10S', metrics.tbt);
        }, 10000);
    });

    // Return function to disconnect performance observers and clear any running timers
    return () => {
        if (!isDisconnected) {
            // Report final `tbt` time
            reportFn('tbtFinal', metrics.tbt);

            // Clear timeouts, if outstanding
            clearTimeout(timeout5s);
            clearTimeout(timeout10s);

            // `fidObserver` can be `false` if no browser support for observer type
            fidObserver && fidObserver.disconnect();

            // only need to execute this handler once
            isDisconnected = true;
        }
    };
}
