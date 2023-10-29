import {when} from 'mobx';

import getConfigData from 'utils/get-config-data';
import getRequestData from 'utils/get-request-data';
import udMe from 'utils/ud-me';
import getVisitorUUID from 'utils/ud-visitor-uuid';

export default async function getLoggingHeaders() {
    await when(() => !udMe.isLoading);
    const udConfig = getConfigData();
    const udRequest = getRequestData();
    const headers = {
        'X-Udemy-Locale': JSON.stringify({
            browser_locales: window.navigator.languages,
            user_locale: udMe.locale ? [`locale:${udMe.locale}`] : '',
            site_locale: udRequest.locale,
        }).replace(/"/g, "'"),
    };

    if (udMe.id) {
        headers['X-Udemy-User-ID'] = udMe.id;
    }

    const visitorUUID = getVisitorUUID();
    if (visitorUUID) {
        headers['X-Udemy-Visitor-UUID'] = visitorUUID;
    }

    if (udConfig.brand.has_organization) {
        headers['X-Udemy-Org-Id'] = udConfig.brand.organization.id;
    }

    return headers;
}
