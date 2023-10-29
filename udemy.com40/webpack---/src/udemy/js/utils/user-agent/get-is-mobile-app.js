import {getQueryParams} from 'utils/query-params';
import serverOrClient from 'utils/server-or-client';

let cachedDisplayType = null;

export function resetCache() {
    cachedDisplayType = null;
}

/**
 * The mobile app reuses code from the web app via WebView, e.g. for quizzes on course taking.
 * We determine this use-case by looking for `?display_type=mobile_app`.
 * If options.cache, we only care about the param value from the initial page load.
 * It's default to true because the main use-case thus far is on course taking, which
 * doesn't preserve query params when the route changes.
 */
export default function getIsMobileApp(options = {cache: true}) {
    let displayType = cachedDisplayType;
    if (!displayType || !options.cache) {
        displayType = getQueryParams(serverOrClient.global.location).display_type;
        if (options.cache) {
            cachedDisplayType = displayType;
        }
    }
    return displayType === 'mobile_app';
}
