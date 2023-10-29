import {Event, StackFrame} from '@sentry/types';

interface EventFilter {
    (event: Event | null): Event | null;
}

function isModernBrowser() {
    if (typeof window === 'undefined') {
        return true;
    } else {
        return !!window.URLSearchParams;
    }
}

function chainFilters(...filters: EventFilter[]) {
    return function (event) {
        return filters.reduce((currentEvent, currentFilter) => {
            if (!currentEvent) {
                return null;
            }

            return currentFilter(currentEvent);
        }, event);
    } as EventFilter;
}

const ignoreLegacyBrowsers: EventFilter = function (event) {
    return isModernBrowser() ? event : null;
};

const normalizeStackTrace: EventFilter = function (event) {
    // This block normalizes stack traces for better grouping.
    //
    // https://docs.sentry.io/data-management/rollups/?platform=javascript
    // > When Sentry detects a stack trace in the event data (either directly or as part of
    // > an exception), the grouping effectively is based entirely on the stack trace.
    //
    // The problem with our prod stack traces is that native methods are tagged with the page url:
    // > /datascience/learn/lecture/3527284 in Array.prototype.forEach
    // Hence, errors on course landing pages or course taking pages tend to not be grouped.
    // Avoid this by removing such urls.
    getExceptionFrames(event).forEach((frame) => {
        if (frame.filename && !frame.filename.endsWith('.js')) {
            // Note: on dev, these are tagged as <anonymous>.
            // I'm picking a more greppable name so that it's more obvious that we're
            // patching this behavior.
            frame.filename = '<not-a-js-file-see-@udemy-sentry>';
        }
    });

    return event;
};

const groupVideoJSErrors: EventFilter = function (event) {
    const frames: StackFrame[] = getExceptionFrames(event);
    // Group all videojs errors together
    if (frames.length > 0 && frames[frames.length - 1]?.filename?.includes('videojs')) {
        if (event) {
            event.fingerprint = ['videojs'];
        }
    }

    return event;
};

const getExceptionFrames: (e: Event | null) => StackFrame[] = function (event) {
    const exceptionValues = (event?.exception && event?.exception?.values) || [];
    if (exceptionValues.length > 0) {
        const value = exceptionValues[0];
        return (value.stacktrace && value.stacktrace.frames) || [];
    }

    return [];
};

export function beforeSend(event: Event) {
    return chainFilters(ignoreLegacyBrowsers, groupVideoJSErrors, normalizeStackTrace)(event);
}
