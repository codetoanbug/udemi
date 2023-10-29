import {labBaseApiUrl} from 'labs/apis';

export const NOTIFICATION_LEVELS = {
    0: 'success',
    20: 'information',
    30: 'warning',
    40: 'error',
} as const;

export const SYSTEM_EVENTS_API_URL = '/labs/vertical-system-events/';

export const labSeenEventsApiUrl = (labId: number) =>
    `${labBaseApiUrl(labId)}seen-vertical-system-events/`;
