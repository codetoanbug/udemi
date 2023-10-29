import Cookies from 'js-cookie';

import udVisiting from 'utils/ud-visiting';

const VISITOR_UUID_COOKIE_KEY = '__udmy_2_v57r';

export default function getVisitorUUID() {
    if (udVisiting.isLoading) {
        return null;
    }
    return udVisiting.visitor_uuid || Cookies.get(VISITOR_UUID_COOKIE_KEY) || null;
}

/**
 * Clear visitor ID in order to clear recently viewed courses for MVP experiment.
 * Will be replaced by a more robust solution if experiment wins.
 */
export function clearVisitorUUID() {
    if (udVisiting.isLoading) {
        return;
    }

    UD.visiting.visitor_uuid = null;
    Cookies.remove(VISITOR_UUID_COOKIE_KEY, {
        path: '/',
        domain: window.location.hostname.replace('www', ''),
    });
}
