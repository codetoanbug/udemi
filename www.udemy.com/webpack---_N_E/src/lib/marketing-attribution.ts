import {udSentry} from '@udemy/sentry';
import {udApi} from '@udemy/ud-api';

/**
 * Ensures that marketing attribution is provided for this session by calling a monolith
 * endpoint which runs the attribution middleware.
 * For more info, see https://udemyjira.atlassian.net/browse/FRON-390
 */
export async function provideMarketingAttribution() {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        await udApi.post(`/visits/${window.location.search}`);
    } catch (e) {
        udSentry.captureException(e);
    }
}
