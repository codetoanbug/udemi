import {initFirstInputDelay} from './observers/first-input-delay';
import {initFirstPaints} from './observers/first-paints';
import {initLargestContentfulPaint} from './observers/largest-contentful-paint';
import {initLayoutShift} from './observers/layout-shift';
import {initMarksAndMeasures} from './observers/marks-and-measures';
import {initResources} from './observers/resources';
import {createState} from './observers/state';
import {initTotalBlockingTime} from './observers/total-blocking-time';
import {now} from './utils';

/**
 * Create performance observer specifically for Udemy performance eventing
 *
 * @param {function} markAndMeasureReportFn - Report callback for collection of mark and measure statistics.
 * @param {function} resourceReportFn - Report callback for collection of resource statistics.
 * @param {function} generalReporterFn - Report callback for general metrics
 * @returns {function(): void} - disconnects all performance observers
 */
// eslint-disable-next-line import/prefer-default-export
export const createPerformanceObservers = (
    markAndMeasureReportFn: Function,
    resourceReportFn: Function,
    generalReporterFn: Function,
) => {
    // Create a state object for performance observers to share
    const {metrics} = createState();

    // Create array of tasks to disconnect
    // TODO: define clear interface
    let disconnectTasks: Array<Function> | boolean = [];

    // Create Performance Observer to collect "mark" and "measure" entries
    // We are not going to disconnect marks / measures to allow late phase collection
    // of custom performance metrics
    initMarksAndMeasures(markAndMeasureReportFn);

    // Create Performance Observer to collect "resource" entries
    disconnectTasks.push(initResources(resourceReportFn));

    // Create Performance Observer to collect various paint type entries
    disconnectTasks.push(
        initFirstPaints(generalReporterFn, metrics, () => {
            // initialize total blocking time observer
            (disconnectTasks as Array<Function>).push(
                initTotalBlockingTime(generalReporterFn, metrics),
            );

            // initialize time on site (since FCP)
            metrics.fcpStart = now();
        }),
    );

    // Create Performance Observer to collect largest contentful paint
    disconnectTasks.push(initLargestContentfulPaint(generalReporterFn, metrics));

    // Create Performance Observer to collect cumulative layout shift
    disconnectTasks.push(initLayoutShift(generalReporterFn, metrics));

    // Create Performance Observer to collect first input delay
    disconnectTasks.push(initFirstInputDelay(generalReporterFn, metrics));

    return () => {
        if (disconnectTasks) {
            (disconnectTasks as Array<Function>).forEach((disconnectTask: Function) => {
                disconnectTask && disconnectTask();
            });

            disconnectTasks = false; // do not re-process these

            // Report custom resource timing metrics as performance measures given a url
            const wUD = window.UD;
            const trackedResources = wUD && wUD.performance && wUD.performance._trackedResources;
            if (trackedResources) {
                trackedResources.forEach((name: string) => {
                    const resourceObj = window.performance
                        .getEntriesByType('resource')
                        .find((entry) => {
                            return entry.name.match(name);
                        });
                    if (resourceObj) {
                        const {duration, startTime} = resourceObj;
                        markAndMeasureReportFn('measure', {
                            name,
                            startTime,
                            duration: typeof duration !== 'undefined' ? duration : null,
                        });
                    }
                });
            }
            return true;
        }
        return false;
    };
};
