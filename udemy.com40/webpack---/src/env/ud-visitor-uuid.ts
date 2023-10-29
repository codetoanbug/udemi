import Cookies from 'js-cookie';

import {serverOrClient} from './server-or-client';
import {udVisiting} from './ud-visiting';

const VISITOR_UUID_COOKIE_KEY = '__udmy_2_v57r';

export function getVisitorUUID() {
    const visiting = udVisiting();

    if (visiting.isLoading) {
        return null;
    }
    return visiting.visitor_uuid || Cookies.get(VISITOR_UUID_COOKIE_KEY) || null;
}

/**
 * Clear visitor ID in order to clear recently viewed courses for MVP experiment.
 * Will be replaced by a more robust solution if experiment wins.
 */
export function clearVisitorUUID() {
    const visiting = udVisiting();

    if (visiting.isLoading) {
        return;
    }

    serverOrClient.global.UD.visiting.visitor_uuid = null;
    Cookies.remove(VISITOR_UUID_COOKIE_KEY, {
        path: '/',
        domain: serverOrClient.global.location.hostname.replace('www', ''),
    });
}
