import {shimUDPerformance} from '@udemy/performance-rum-client';
import {serverOrClient} from '@udemy/shared-utils';
import {UDData} from '@udemy/ud-data';

import {i18nPathToBundleMap} from 'next.config.i18n';
import {getRuntimeConfig} from 'src/pages/api/config.api';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const merge = require('deepmerge'); // https://github.com/TehShrike/deepmerge#include

export const transformUDCasing = (udData: UDData) => {
    const apiToGlobalStateKeyFormatLookup: {[key: string]: string} = {
        me_properties: 'meProperties',
        visiting_properties: 'visitingProperties',
        user_specific_tracking: 'userSpecificTrackingParams',
        user_specific_tracking_properties: 'userSpecificTrackingProperties',
        user_agnostic_tracking: 'userAgnosticTrackingParams',
    };
    const apiToGlobalStateKeys = Object.keys(apiToGlobalStateKeyFormatLookup);
    const udDataKeys = Object.keys(udData);
    if (apiToGlobalStateKeys.every((key) => !udDataKeys.includes(key))) {
        return udData;
    }

    const modifiableUdData = merge({}, udData);
    const modifiableUdDataKeys = udDataKeys;
    apiToGlobalStateKeys.map((key: string) => {
        const modifiedKey = apiToGlobalStateKeyFormatLookup[key];
        if (modifiableUdDataKeys.includes(key) && !modifiableUdDataKeys.includes(modifiedKey)) {
            modifiableUdData[modifiedKey] = modifiableUdData[key];
            delete modifiableUdData[key];
        }
    });
    return modifiableUdData;
};

export const addUDDataToGlobalState = (udData: UDData) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    serverOrClient.global.UD = udData as any;

    // Shim UD.performance global API
    shimUDPerformance();

    // We hardcode smartbar to be on for now
    serverOrClient.global.UD.Config.features.notice.smart_bar = true;
};

export const fetchServerUDGlobalContext = async (locale: string) => {
    /**
     * UD API relies on udMe which does not exist on the server side global scope for this project
     * to make the first call to get the UD object. This call uses a vanilla fetch to populate UD
     * on the server side global state.
     */
    const response = await fetch(
        `${getRuntimeConfig('MONOLITH_URL')}/api-2.0/contexts/me/?` +
            new URLSearchParams({
                Config: 'true',
                request: 'true',
                me: 'true',
                me_properties: 'true',
                visiting: 'true',
                visiting_properties: 'true',
                user_specific_tracking: 'true',
                user_specific_tracking_properties: 'true',
                user_agnostic_tracking: 'true',
                experiment: 'true',
                site_stats: 'true',
                for_public_caching: 'true',
            }),
        {
            credentials: 'include',
        },
    );
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const udData = await response.json();
    // This flag is needed for client side ud object refetch with user data
    udData.isGlobalMeContextLoading = true;

    // Hack: ensure localization from our application is enforced
    udData.request.locale = locale;
    udData.request.navigation_locale = locale;

    // local development change url.to_root to localhost to use nextjs rewrite proxy
    if (process.env.DEPLOY_ENV === 'local') {
        udData.Config.url.to_root = `http://localhost:${process.env.PORT}/`;
    }

    /* udData is passed along as server props to the client to
        reattach udData to the client side global state
    */
    return udData;
};

export const getUdDataServerProps = async (locale: string) => {
    const udData = await fetchServerUDGlobalContext(locale);
    // Hack: force version
    udData.Config.version = process.env.VERSION;
    return {
        udData: transformUDCasing(udData),
    };
};

export const fetchClientUDGlobalContext = async (locale: string) => {
    const {loadGlobalMeContext} = await import(
        'udemy-django-static/js/utils/udheavy/load-global-context'
    );
    const data = await loadGlobalMeContext();
    // Hack: force `navigation_locale` to be consistent with set locale
    data.request.locale = i18nPathToBundleMap[locale as keyof typeof i18nPathToBundleMap];
    data.request.navigation_locale =
        i18nPathToBundleMap[locale as keyof typeof i18nPathToBundleMap];
    // Hack: force version
    data.Config.version = process.env.VERSION;

    // Override `third_party_location` from Monolith API response to ensure path is correctly set
    const thirdPartyLocation = new URL(window.location.href);
    // remove email query param so PII doesn't get passed to GA
    thirdPartyLocation.searchParams.delete('email');
    data.request.third_party_location = thirdPartyLocation.toString();

    return transformUDCasing(data);
};
