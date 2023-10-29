import {useRouter} from 'next/router';
import {useCallback, useEffect, useState} from 'react';

import {constructCanonicalUrl} from 'src/lib/canonical-url';

/**
 * A hook that construct canonical URL in the server side and updates on the client side when component mounted for
 * next.js apps.
 *
 * Until component mount on the client side, it will try to construct the canonical url from given baseUrl and router
 * after mount, it will use window.location.href to construct the canonical url.
 *
 * @param searchParamsToKeep search params to keep in the canonical url, if not give, it will remove all search params
 * @param baseUrl base url to construct the canonical url, if not given, it will return empty string
 * @param overrideDefaultLocale override the default locale that will be removed from the canonical url if it exists. Default is 'en'
 */
export const useCanonicalUrl = (
    searchParamsToKeep: string[] = [],
    baseUrl?: string,
    overrideDefaultLocale?: string,
): {url: string} => {
    const router = useRouter();
    const locale = router.locale as string;
    const defaultLocale = overrideDefaultLocale ?? 'en';
    const domain = baseUrl ?? 'https://www.udemy.com/';

    const getCanonicalUrl = useCallback(
        (url: string) => constructCanonicalUrl(url, searchParamsToKeep, defaultLocale),
        [searchParamsToKeep, defaultLocale],
    );

    // Return the initial URL that will be returned when this hook called for the first time
    const getInitialUrl = () => {
        // This is purely handling trailing slash for the URLs both have or don't have trailing slash
        const url = domain.trim().replace(/\/$/, '') + '/';
        const pathWithSearchParams = router.asPath;
        return getCanonicalUrl(`${url}${locale}${pathWithSearchParams}`);
    };

    const [url, setUrl] = useState(getInitialUrl());

    useEffect(() => {
        // If we're in the client, update the canonical URL with the current window location
        setUrl(getCanonicalUrl(window.location.href));
    }, [getCanonicalUrl]);

    return {url};
};
