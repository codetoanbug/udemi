import {serverOrClient} from '../env/server-or-client';

// Allow manual override of udRequest keys via URL query string.
// Can be used for debugging.
//
// The code in this function used to run at import time. It has been
// moved into a function to prevent side-effects to global state during
// import. It is used by website-django:
// https://github.com/udemy/website-django/blob/master/static/src/udemy/js/utils/get-request-data.js
export function mergeRequestKeysFromQueryString() {
    if (serverOrClient.isClient && location.search) {
        const udRequest = serverOrClient.global.UD.request;
        const parts = location.search.substring(1).split('&');
        for (let i = 0; i < parts.length; i++) {
            const [propertyName, propertyValue] = parts[i].split('=');
            if (propertyName && propertyName.indexOf('_request__') === 0) {
                udRequest[propertyName.replace('_request__', '')] = propertyValue || true;
            }
        }
    }
}

export function getRequestData() {
    return serverOrClient.global.UD.request;
}
