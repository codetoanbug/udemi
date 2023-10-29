import {expiringLocalStorageWithKeyTTLs} from '@udemy/shared-utils';

// replace with 3rd party package
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let eventTrackingRefIdStorage: any;

function getEventTrackingIDStorage() {
    const TTLHours = 24 * 3;
    const hoursToMins = 60;
    const minsToMsecs = 60000;

    // Only create for the first time its requested on the same page
    if (!eventTrackingRefIdStorage) {
        eventTrackingRefIdStorage = expiringLocalStorageWithKeyTTLs(
            'eventTrackingIDStorage',
            'clpRefIdStorage-1.0',
            TTLHours * hoursToMins * minsToMsecs,
        );
    }
    return eventTrackingRefIdStorage;
}

export function getRefIDFromLocalStorage(objectId: number) {
    const eventTrackingIDStorage = getEventTrackingIDStorage();
    return eventTrackingIDStorage.get(`${objectId}`);
}

export function setRefIDToLocalStorage(objectId: number, trackingId: string) {
    const eventTrackingIDStorage = getEventTrackingIDStorage();
    eventTrackingIDStorage.set(`${objectId}`, trackingId);
}
