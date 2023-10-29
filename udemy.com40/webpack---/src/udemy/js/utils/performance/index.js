import {initPerformanceCollection as _initPerformanceCollection} from '@udemy/performance-rum-client';
import {getRequestData, udVisiting} from '@udemy/shared-utils';
/**
 * Determines device type from globally scoped Udemy object
 *
 * @returns {string|null} - type of device
 */
function getDeviceType() {
    const udRequest = getRequestData();
    if (udRequest.isMobile) {
        return 'mobile';
    } else if (udRequest.isTablet) {
        return 'tablet';
    } else if (udRequest.isPC) {
        return 'desktop';
    }

    return null;
}

/**
 * Initializes performance client collection
 *
 * @returns {boolean} - indicates whether or not performance collection was initialized
 */
// eslint-disable-next-line import/prefer-default-export
export function initPerformanceCollection() {
    const deviceType = getDeviceType();
    return _initPerformanceCollection({
        deviceType,
        isFirstTimeVisitor: udVisiting().is_first_time_visitor,
        isPageCached: false,
    });
}
