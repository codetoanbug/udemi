import {mark, start, end} from './api';
import {UDPerformance} from './types';

/**
 * shimUDPerformance()
 * Shims UD.performance global API, which simply namespaces calls to window.performance (browser API) with 'UD-' prefix.
 * We implement this for interoperability with legacy components.  Components should import APIs directly from this package.
 */
export function shimUDPerformance(overrides: Partial<UDPerformance> = {}) {
    if (typeof window !== 'undefined') {
        window.UD = window.UD || {};
        window.UD.performance = {
            /**
             * @deprecate We can depend on window.performance to provide resource tracking, so we should deprecate `trackResourceTiming`.
             */
            trackResourceTiming: () => false,
            mark,
            start,
            end,
            isPageCached: false,
            ...overrides,
        };
    }
}
