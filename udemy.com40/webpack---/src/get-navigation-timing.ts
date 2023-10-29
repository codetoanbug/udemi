import {convertOctetsToKB, isResourceCacheHit, isPerformanceSupported} from './utils';

/**
 * Navigation Timing API provides performance metrics for HTML documents.
 * w3c.github.io/navigation-timing/
 * developers.google.com/web/fundamentals/performance/navigation-and-resource-timing
 *
 * @returns {object} - Object containing navigation entry information
 */
// eslint-disable-next-line import/prefer-default-export
export const getNavigationTiming = () => {
    // Sanity check if performance is supported to prevent null exception errors
    if (!isPerformanceSupported()) {
        return {};
    }

    // Alias
    const WP = window.performance;

    // Legacy timing API (only used for `domCompleteDuration`)
    const legacyTiming = WP.timing;

    // Get primary navigation timing entry
    const n = WP.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    // Return empty object if Navigation entry isn't supported yet
    // https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming
    // Not supported in Safari, Safari Mobile, or IE 11
    if (!n) {
        return {};
    }

    const timings: PerformanceNavigationTimingExtended = {
        // Total decoded size of HTTP body
        decodedBodySize: convertOctetsToKB(n.decodedBodySize),
        // Time spent in browser resolving DNS for the requested HTML resource in `ms`.
        dnsLookupTime: n.domainLookupEnd - n.domainLookupStart,
        // When the parser finished its work on the main document, that is when its Document.readyState changes to 'interactive' and the corresponding readystatechange event is thrown.
        domInteractive: n.domInteractive,
        // HTTP encoded body size
        encodedBodySize: convertOctetsToKB(n.encodedBodySize),
        // App Cache + DNS + TCP + Request + Response Duration
        fetchTime: n.responseEnd - n.fetchStart,
        // HTTP header size
        headerSize: convertOctetsToKB(n.transferSize - n.encodedBodySize),
        // Is Cache Hit?
        isCacheHit: isResourceCacheHit(n),
        // Describes type of browser navigation
        navigationType: n.type,
        // Total amount of redirects
        redirectCount: n.redirectCount,
        // Total time spent in redirects
        redirectDuration: n.redirectEnd - n.redirectStart,
        // Total request duration time (including response)
        requestDuration: n.responseEnd - n.requestStart,
        // Response duration time (just download)
        responseDuration: n.responseEnd - n.responseStart,
        // Total TCP connection time
        tcpConnectTime: n.connectEnd - n.connectStart,
        // Total Secure TCP connection time (IE TLS handshake)
        tcpSecureConnectTime: n.connectEnd - n.secureConnectionStart,
        // Time to First Byte
        ttfb: n.responseStart - n.requestStart,
        // Total transfer size
        transferSize: convertOctetsToKB(n.transferSize),
        // Service worker time plus response time
        workerTime: n.workerStart > 0 ? n.responseEnd - n.workerStart : 0,
    };

    if (legacyTiming.domComplete > 0) {
        // Length of time for HTML parse / DOM construction
        timings.domCompleteDuration = legacyTiming.domComplete - legacyTiming.domLoading;
    }

    if (n.loadEventStart > 0) {
        // Timestamp for load event start
        timings.loadEventStart = n.loadEventStart;
    }

    return timings;
};
