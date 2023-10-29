import Cookies from 'js-cookie';
import React from 'react';

import {udApi} from '@udemy/ud-api';
import {useUDData} from '@udemy/ud-data';

import {useGetLocaleUrl} from './use-get-locale-url';

export function useUpdateUserLocale(useLangPrefixedUrls = true) {
    const data = useUDData();
    const getLocaleUrl = useGetLocaleUrl(undefined, useLangPrefixedUrls);
    const [queuedLocaleUpdate, setQueuedLocaleUpdate] = React.useState<string>();

    React.useEffect(() => {
        if (!data.isGlobalMeContextLoading && queuedLocaleUpdate) {
            if (data.me.is_authenticated) {
                udApi.patch('users/me/', {locale: queuedLocaleUpdate}).catch(() => {
                    // Swallow error
                });
            }

            // update `ud_locale` and `ud_cache_language` cookies for best compatibility with matching to cached responses.
            // These will likely be overwritten by the next `set-cookie` response headers, so we don't need a long TTL here
            Cookies.set('ud_locale', queuedLocaleUpdate, {expires: 1});
            Cookies.set('ud_cache_language', queuedLocaleUpdate.slice(0, 2), {expires: 1});
            const {path, params} = getLocaleUrl(queuedLocaleUpdate);
            window.location.assign(`${path}?${params.toString()}`);
        }
    }, [
        data.isGlobalMeContextLoading,
        data.me.is_authenticated,
        getLocaleUrl,
        queuedLocaleUpdate,
        useLangPrefixedUrls,
    ]);

    return setQueuedLocaleUpdate;
}
