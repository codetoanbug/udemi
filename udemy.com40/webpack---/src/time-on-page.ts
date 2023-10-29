/* eslint-disable @typescript-eslint/no-explicit-any */
import {now} from './utils';

// simple throttle helper function for optimization
function throttle(callback: {(): boolean; apply?: any}, limit: number | undefined, scope: any) {
    let wait = false;
    return (...rest: any) => {
        if (!wait) {
            wait = true;
            setTimeout(() => {
                wait = false;
            }, limit);
            return callback.apply(scope, ...rest);
        }
        return false;
    };
}

export const defaults = {
    idleTimeout: 10000,
};

/**
 * Class that tracks internal state of how much active time a user has spent on a page.
 */

interface TimeOnPageArgs {
    idleTimeout?: number;
}
export class TimeOnPage {
    trackingTimeout?: ReturnType<typeof setTimeout>;
    idleTimeout: number;
    startTrackingThrottled: (...rest: any) => any;
    currentTime?: number | boolean;
    timeElapsed: any;
    document: any;
    constructor({idleTimeout}: TimeOnPageArgs = {}) {
        // initialize configuration with sane defaults
        this.idleTimeout = idleTimeout || defaults.idleTimeout;
        // Optimized throttle alias for high frequency listeners (mousemove, scroll)
        this.startTrackingThrottled = throttle(this.startTracking, 250, this);
    }

    /**
     * Returns total time on page regardless if user was idle or switched tabs, etc.
     * @returns {float}
     */
    getTotalTimeOnPage() {
        return now();
    }

    /**
     * Returns total active time spent on page, minus idle or inactive periods.
     * @returns {float}
     */
    getActiveTimeOnPage() {
        return this.timeElapsed;
    }

    /**
     * Stops active tracking of user.  Uses `this.currentTime` as a proxy to detect if we are currently tracking a user.
     *
     * Note: return signal is for unit test purposes.
     *
     * @returns {boolean}
     */
    stopTracking = () => {
        if (this.currentTime === false) {
            // already stopped
            return false;
        }
        // Collect elapsed time
        this.timeElapsed += (now() - (this.currentTime as number)) as number;

        // Reset timestamp
        this.currentTime = false;

        return true;
    };

    /**
     * Starts active tracking of a user.  Subsequent activity events will reset idle timeout `this.trackingTimeout`.
     *
     * Note: return signal is for unit test purposes.
     */
    startTracking = () => {
        // If not set, set start point
        if (!this.currentTime) {
            this.currentTime = now();
        }
        // reset timeout
        clearTimeout(this.trackingTimeout);
        this.trackingTimeout = setTimeout(this.stopTracking, this.idleTimeout);
        return true;
    };

    /**
     * Handler for visibility change events in the document
     */
    handleVisibilityChange = () => {
        const isHidden = this.document.hidden;
        if (isHidden) {
            return this.stopTracking();
        }
        return this.startTracking();
    };

    /**
     * Private initialization handler.  Makes unit tests more convenient.
     * @param window
     * @param document
     * @private
     */
    _initialize(window: Window, document: Document) {
        // initialize state
        this.timeElapsed = 0;
        this.currentTime = document.hidden ? false : 0;
        this.document = document; // save reference to document for `handleVisibilityChange()`

        // listen for page visibility change events
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        window.addEventListener('blur', this.stopTracking);
        window.addEventListener('focus', this.startTracking);

        // listen for activity events in document
        document.addEventListener('mousemove', this.startTrackingThrottled);
        document.addEventListener('keyup', this.startTrackingThrottled);
        document.addEventListener('touchstart', this.startTrackingThrottled);
        document.addEventListener('scroll', this.startTrackingThrottled);
    }

    /**
     * Public initialization handler
     */
    initialize() {
        this._initialize(window, document);
    }
}
