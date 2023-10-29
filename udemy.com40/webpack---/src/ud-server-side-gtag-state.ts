// Store local event data
import {AnyObject} from '@udemy/shared-utils/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let gtagEventData: {[k: string]: any} = {};

// Store local table of events that have been fired
let eventsFired: Record<string, boolean> = {};

/**
 * Reset local scope - intended for unit tests
 */
export function resetLocalData() {
    eventsFired = {};
    gtagEventData = {};
}

/**
 * Records `eventName` has been fired
 * @param eventName
 */
export function setEventFired(eventName: string) {
    eventsFired[eventName] = true;
}

/**
 * Returns `true` if event has been fired
 * @param eventName
 */
export function hasEventFired(eventName: string): boolean {
    return !!eventsFired[eventName];
}

/**
 * Save event data inside this module
 * @param data
 */
export function saveEventData(data: AnyObject) {
    // Push data to `window.dataLayer` for GTM compatibility
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);

    // Save data to local scope
    gtagEventData = {
        ...gtagEventData,
        ...data,
    };
}

/**
 * Get local event data inside this module
 */
export function getEventData() {
    return gtagEventData;
}
