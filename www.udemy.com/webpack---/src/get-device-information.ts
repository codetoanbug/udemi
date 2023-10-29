/**
 * Returns the approximate amount of device memory in gigabytes.
 *
 * @returns {number} - The approximate amount of device memory in gigabytes.
 */
export function getDeviceMemory(): number {
    return window.navigator.deviceMemory;
}

/**
 * Returns the number of logical processors available to run threads on the user's computer.
 *
 * @returns {int} - The number of logical processors available to run threads on the user's computer.
 */
export function getHardwareConcurrency(): number | null {
    return !isNaN(window.navigator.hardwareConcurrency)
        ? Number(window.navigator.hardwareConcurrency)
        : null;
}

/**
 * Round given number to nearest 2 decimal precision
 *
 * @param num
 * @returns {number}
 */
export const roundByTwo = (num: number): number => {
    return parseFloat(num.toFixed(2));
};

/**
 * Converts a numeric value that is an estimation of capacity in navigator.storage.estimate()
 * https://developer.mozilla.org/en-US/docs/Web/API/StorageEstimate/quota
 *
 * @param bytes
 * @returns {null|number}
 */
export const convertToKB = (bytes: number) => {
    if (typeof bytes !== 'number') {
        return null;
    }
    return roundByTwo(bytes / Math.pow(1024, 2));
};

/**
 * Determined from combination of the score of RAM and CPU
 *
 * @returns {boolean} - true if low end device
 */
export const getIsLowEndDevice = () => {
    // If number of logical processors available to run threads <= 4
    if (getHardwareConcurrency() && (getHardwareConcurrency() as number) <= 4) {
        return true;
    }
    // If the approximate amount of RAM client device has <= 4
    if (getDeviceMemory() && getDeviceMemory() <= 4) {
        return true;
    }
    return false;
};

/**
 * Determined from combination of the score of RAM, CPU, NetworkStatus and SaveData.
 *
 * @param effectiveConnectionType
 * @param saveData
 * @returns {boolean} - true if low end experience
 */
export const getIsLowEndExperience = (effectiveConnectionType: string, saveData: boolean) => {
    // If the effective type of the connection meaning
    // one of 'slow-2g', '2g', '3g', or '4g' is !== 4g
    switch (effectiveConnectionType) {
        case 'slow-2g':
            return true;
        case '2g':
            return true;
        case '3g':
            return true;
        default:
            // Data Saver preference
            return getIsLowEndDevice() || saveData;
    }
};

/**
 * Reports metrics on device network, device, and storage
 *
 * @param {function} reportFn - Report callback for collection of statistics
 * @returns None
 */
export function getDeviceInformation(reportFn: (metric: string, value: unknown) => void) {
    let ect = null;
    let saveData = null;
    const dataConnection = window.navigator && window.navigator.connection;

    if (dataConnection && typeof dataConnection === 'object') {
        ect = dataConnection.effectiveType;
        saveData = !!dataConnection.saveData;
        reportFn('downlink', dataConnection.downlink);
        reportFn('ect', dataConnection.effectiveType);
        reportFn('rtt', dataConnection.rtt);
        reportFn('saveData', !!dataConnection.saveData);
    }

    const serviceWorkerStatus =
        'serviceWorker' in window.navigator
            ? window.navigator.serviceWorker.controller
                ? 'controlled'
                : 'supported'
            : 'unsupported';
    reportFn('deviceMemory', getDeviceMemory());
    reportFn('hardwareConcurrency', getHardwareConcurrency());
    reportFn('serviceWorkerStatus', serviceWorkerStatus);
    reportFn('isLowEndDevice', getIsLowEndDevice());
    reportFn('isLowEndExperience', getIsLowEndExperience(ect as string, saveData as boolean));

    if (window.navigator.storage && typeof window.navigator.storage.estimate === 'function') {
        window.navigator.storage.estimate().then((storageInfo) => {
            reportFn('storageQuota', convertToKB(storageInfo.quota as number));
            reportFn('storageUsage', convertToKB(storageInfo.usage as number));
        });
    }
    reportFn('url', window.location.href);
}
