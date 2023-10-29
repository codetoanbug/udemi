import {convertOctetsToKB} from '../utils';
import {po} from './po';

// Used to initialize resource summary objects
const defaultResourceSummaryObject = {
    count: 0,
    duration: 0,
    transferSize: 0,
};

/**
 * Creates `resource` performance observer to implement collection of resource metrics
 *
 * @param {function} reportFn - Report callback for collection of statistics
 * @returns {function} - disconnect function
 */
// eslint-disable-next-line import/prefer-default-export
export function initResources(reportFn: Function) {
    let isDisconnected = false;
    // Create a resource map to track resource consumption efficiently
    const resourceMap = {
        all: {
            ...defaultResourceSummaryObject,
        },
    };
    // Report `all` resource once.
    reportFn('all', resourceMap.all);
    const resourceObserver = po('resource', (performanceEntries: PerformanceEntryList) => {
        performanceEntries.forEach((entry) => {
            const type = entry.initiatorType as keyof typeof resourceMap;
            if (!resourceMap[type]) {
                resourceMap[type] = {
                    ...defaultResourceSummaryObject,
                };
            }
            // Count resource statistics
            resourceMap[type].count++;
            resourceMap.all.count++;
            resourceMap[type].duration += entry.duration;
            resourceMap.all.duration += entry.duration;

            if (entry.transferSize) {
                const bodySize = convertOctetsToKB(entry.transferSize);
                resourceMap[type].transferSize += bodySize;
                resourceMap.all.transferSize += bodySize;
            }
            // Report `type` resource type.  Future updates happen via reference
            reportFn(type, resourceMap[type]);
            reportFn('all', resourceMap.all);
        });
    });

    return () => {
        if (!isDisconnected) {
            // `resourceObserver` can be `false` if no browser support for observer type
            resourceObserver && resourceObserver.disconnect();

            // only need to execute this handler once
            isDisconnected = true;
        }
    };
}
