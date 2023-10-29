import {po} from './po';
import {limitPerformanceTiming} from './state';
import {InternalState} from './state';

/**
 * Creates `largest-contentful-paint` observer to implement collection of `lcp` metrics
 *
 * @param {function} reportFn - Report callback for collection of statistics
 * @param {object} - metrics - Shared metrics to coordinate between performance observers
 * @returns {function} - disconnect function
 */
// eslint-disable-next-line import/prefer-default-export
export const initLargestContentfulPaint = (
    reportFn: Function,
    metrics: InternalState['metrics'],
): Function => {
    let isDisconnected = false;
    const lcpObserver = po(
        'largest-contentful-paint',
        (performanceEntries: PerformanceEntryList) => {
            const lastEntry = performanceEntries.pop();
            if (lastEntry) {
                // Save `lcp` value to report during first input
                // The startTime attribute returns the value of the renderTime if it is not 0,
                // and the value of the loadTime otherwise.
                metrics.lcp = limitPerformanceTiming(lastEntry.startTime);

                // Always report lcpFinal
                reportFn('lcpFinal', metrics.lcp);
            }
        },
    );

    // Safe disconnect function
    const safeDisconnect = () => {
        if (!isDisconnected) {
            // Report LCP, if available
            if (metrics.lcp) {
                reportFn('lcp', metrics.lcp);
            }
            // `lcpObserver` can be `false` if no browser support for observer type
            lcpObserver && lcpObserver.disconnect();

            // only need to execute this handler once
            isDisconnected = true;
        }
    };

    // The browser will stop reporting new entries as soon as the user interacts with the page (via a tap, scroll, or keypress)
    // as user interaction often changes what's visible to the user (which is especially true with scrolling).
    // Note: while scrolling is an input that stop LCP observation, it's unreliable since it can be programmatically
    // generated. See: https://github.com/GoogleChrome/web-vitals/issues/75
    ['keydown', 'click'].forEach((type) => {
        window.addEventListener(type, safeDisconnect, {once: true, capture: true});
    });

    return safeDisconnect;
};
