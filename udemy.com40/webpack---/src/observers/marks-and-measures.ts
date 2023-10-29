import {po} from './po';

/**
 * Processes Udemy performance marks and measures by reporting any performance mark/measure prefixed with "UD-"
 *
 * @param {List(PerformanceEntry)} performanceEntries - List of https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry
 * @param {function} reportFn - Report callback for collection of statistics
 * @param {object} - state.entryHasBeenProcessedMap - Optimization map to prevent duplicate entries being calculated
 *
 * @returns None
 */
export function processPerformanceMarksAndMeasures(
    performanceEntries: PerformanceEntryList,
    reportFn: Function,
    entryHasBeenProcessedMap: {[name: string]: boolean},
): void {
    performanceEntries.forEach((entry) => {
        const name = entry.name;

        // filter out incorrectly reported names
        if (typeof name !== 'string') {
            return;
        }

        if (!entryHasBeenProcessedMap[name]) {
            entryHasBeenProcessedMap[name] = true;

            reportFn(entry.entryType, {
                name,
                startTime: entry.startTime,
                duration: typeof entry.duration !== 'undefined' ? entry.duration : null,
            });
        }
    });
}

/**
 * Creates `mark` and `measure` performance observers to implement collection of mark and measure metrics
 *
 * @param {function} reportFn - Report callback for collection of statistics
 * @returns {function} - disconnect function
 */
export function initMarksAndMeasures(reportFn: Function) {
    let isDisconnected = false;
    // Optimization map to prevent duplicate entries being calculated
    const entryHasBeenProcessedMap = {};

    // Create performance observer for processing "mark" and "measure" performance entries
    const marksObserver = po('mark', (performanceEntries: PerformanceEntryList) => {
        processPerformanceMarksAndMeasures(performanceEntries, reportFn, entryHasBeenProcessedMap);
    });

    const measuresObserver = po('measure', (performanceEntries: PerformanceEntryList) => {
        processPerformanceMarksAndMeasures(performanceEntries, reportFn, entryHasBeenProcessedMap);
    });

    return () => {
        if (!isDisconnected) {
            // `marksObserver` and `measuresObserver` can be `false` if no browser support for observer type
            marksObserver && marksObserver.disconnect();
            measuresObserver && measuresObserver.disconnect();

            // only need to execute this handler once
            isDisconnected = true;
        }
    };
}
