/**
 * Set up the Sentry SDK.
 */
import autobind from 'autobind-decorator';
import {when} from 'mobx';

import isModernBrowser from 'common/browser/is-modern-browser';
import getConfigData from 'utils/get-config-data';
import udMe from 'utils/ud-me';
import udUserAgnosticTrackingParams from 'utils/ud-user-agnostic-tracking-params';

function beforeSend(event) {
    return chainFilters(ignoreLegacyBrowsers, groupVideoJSErrors, normalizeStackTrace)(event);
}

function chainFilters(...filters) {
    return function (event) {
        return filters.reduce((currentEvent, currentFilter) => {
            if (!currentEvent) {
                return null;
            }

            return currentFilter(currentEvent);
        }, event);
    };
}

function ignoreLegacyBrowsers(event) {
    return isModernBrowser() ? event : null;
}

function normalizeStackTrace(event) {
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
            frame.filename = '<not-a-js-file-see-ud-raven>';
        }
    });

    return event;
}

function groupVideoJSErrors(event) {
    const frames = getExceptionFrames(event);
    // Group all videojs errors together
    if (frames.length > 0 && frames[frames.length - 1].filename.includes('videojs')) {
        event.fingerprint = ['videojs'];
    }

    return event;
}

function getExceptionFrames(event) {
    const exceptionValues = (event.exception && event.exception.values) || [];
    if (exceptionValues.length > 0) {
        const value = exceptionValues[0];
        return (value.stacktrace && value.stacktrace.frames) || [];
    }

    return [];
}

class Sentry {
    constructor() {
        this.sentryInstance = null;
        // Supports calling initializeSentry multiple times from different parts of the code base.
        this.previousSentryOptions = {};
    }

    setSentryInstance(Sentry) {
        this.sentryInstance = Sentry;
    }

    getSentryInstance() {
        return this.sentryInstance;
    }

    initializeSentry(...args) {
        try {
            this._initializeSentry(...args);
        } catch (e) {
            /* eslint-disable-next-line no-console */
            console.error(e);
        }
    }

    _initializeSentry(Sentry, options = {}) {
        // In PROD, we only want errors from our own servers. We don't want to see errors from GTM.
        // However, in dev, people have a range of setups, so we don't care where the errors come from.
        const udConfig = getConfigData();

        const defaultOptions = {
            beforeSend,
            dsn: udConfig.third_party.raven_dsn,
            environment: udConfig.env,
            whitelistUrls: udConfig.env === 'PROD' ? [/udemy\.com/, /udemy\.cn/] : [/./],
            sampleRate: udConfig.env === 'PROD' ? 0.05 : 1,
            autoSessionTracking: false,
        };
        Sentry.init(Object.assign(this.previousSentryOptions, defaultOptions, options));
        when(
            () => !udMe.isLoading,
            () => {
                if (udMe.id) {
                    Sentry.setUser({id: udMe.id});
                }
            },
        );
        Sentry.setTag('app_name', udConfig.app_name);
        Sentry.setTag('brand', udConfig.brand ? udConfig.brand.identifier : null);
        Sentry.setTag('js_bundle', udConfig.js_bundle);
        Sentry.setTag(
            'page_key',
            udUserAgnosticTrackingParams.page_key || `${udConfig.app_name}-without-page-key`,
        );

        this.setSentryInstance(Sentry);
    }

    @autobind captureException(e) {
        if (this.sentryInstance) {
            // eslint-disable-next-line no-console
            console.error('Sentry.captureException called with:', e);
            this.sentryInstance.captureException(e);
        }
    }
}

export default new Sentry();
