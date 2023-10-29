import Cookies from 'js-cookie';

import {Tracker} from '@udemy/event-tracking';
import {noop} from '@udemy/shared-utils';
import {udApi} from '@udemy/ud-api';
import {getServerOrClientUDData} from '@udemy/ud-data';

import {ConsentChangeEvent} from './events';
import {ConsentEvent} from './types';

function trackConsentChanged(consentEvent: ConsentEvent) {
    const userConsentCategories = consentEvent.detail.join(',');
    if (userConsentCategories) {
        Tracker.publishEvent(new ConsentChangeEvent({userConsentCategories}));
    }
}

function storeUserCookiePreferences() {
    const udMe = getServerOrClientUDData().me;
    if (!udMe.is_authenticated) {
        return;
    }
    udApi
        .post('/privacy/user-cookie-preferences/')
        .then(noop)
        .catch((e: Error) => {
            throw e;
        });
}

export function cookiePurge(consentEvent: ConsentEvent) {
    const activeGroups = consentEvent.detail;
    const inactiveGroups = window.OneTrust?.GetDomainData().Groups.filter((group) => {
        return !activeGroups.includes(group.CustomGroupId);
    });

    if (!inactiveGroups || inactiveGroups.length === 0) {
        return;
    }

    // Generates all possible domains the cookie could have been set on based on the hostname.
    const hostnameParts: string[] = window.location.hostname.split('.').reverse();
    let hn = '';
    let allDomains: string[] = [];

    hostnameParts.forEach((part) => {
        hn = `.${part}${hn}`;
        allDomains.push(hn);
    });

    if (allDomains.length > 1) {
        allDomains = allDomains.slice(1);
    }

    inactiveGroups.forEach((group) => {
        group.Cookies.forEach((cookie) => {
            allDomains.forEach((domain) => {
                Cookies.remove(cookie.Name, {path: '', domain});
            });
        });
    });
}

export const consentChangeHandlers = [trackConsentChanged, storeUserCookiePreferences, cookiePurge];
