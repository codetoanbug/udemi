export interface InternalState {
    metrics: {
        cls: number;
        tbt: number;
        fcp?: number;
        fcpStart?: number;
        lcp?: number;
    };
}

/**
 * Create an object that can be used to share information between performance observers
 * `metrics` - Used to track metrics
 *
 * @returns {InternalState} - state object to coordinate between performance observers
 */
export function createState(): InternalState {
    return {
        metrics: {
            cls: 0,
            tbt: 0,
        },
    };
}

/**
 * Limits max time
 * @param {number} timing - time representing performance timeline start
 * @returns {number}
 */
export function limitPerformanceTiming(timing: number, defaultMaxAllowed = 60000) {
    return timing < defaultMaxAllowed ? timing : defaultMaxAllowed;
}
