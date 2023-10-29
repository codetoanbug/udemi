/**
 * PerformanceObserver subscribes to performance events as they happen
 * and respond asynchronously as they happen
 *
 * @param eventType - performance event type
 * @param cb - user callback to calculate performance entries of given `eventType`
 * @returns {function|false} - disconnect function (or false if exception)
 */
// eslint-disable-next-line import/prefer-default-export
export const po = (eventType: string, cb: Function): PerformanceObserver | false => {
    try {
        if (PerformanceObserver.supportedEntryTypes.includes(eventType)) {
            // More extensive feature detect needed for Firefox due to:
            // https://github.com/GoogleChrome/web-vitals/issues/142
            if (eventType === 'first-input' && !('PerformanceEventTiming' in self)) {
                return false;
            }
            const perfObserver = new PerformanceObserver((entryList) => {
                cb(entryList.getEntries());
            });
            // Retrieve buffered events and subscribe to newer events
            perfObserver.observe({type: eventType, buffered: true});
            return perfObserver;
        }
    } catch (e: unknown) {
        // eslint-disable-next-line no-console
        console.warn('po:', (e as Error).message);
    }
    return false;
};
