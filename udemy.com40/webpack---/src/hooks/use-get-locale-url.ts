import React from 'react';

import {useI18n} from '@udemy/i18n';
import {serverOrClient} from '@udemy/shared-utils';
import {useUDData} from '@udemy/ud-data';

export function useGetLocaleUrl(currentUrl?: string, useLangPrefixedUrls = true) {
    const i18n = useI18n();
    const {Config} = useUDData();

    const getLocaleUrl = React.useCallback(
        (locale: string) => {
            // The URL constructor requires that a hostname be provided. If the URL we have does not include
            // the hostname, we can just provide a dummy value (we don't actually need to use it)
            // https://developer.mozilla.org/en-US/docs/Web/API/URL/URL#parameters
            const urlStr = currentUrl ?? serverOrClient.global.location?.pathname ?? '';
            const url = urlStr.startsWith('http')
                ? new URL(urlStr)
                : new URL(`http://example.com${urlStr}`);
            const params = new URLSearchParams(serverOrClient.global.location.search);
            params.set('persist_locale', '');
            params.set('locale', locale);

            // Replace instances of multiple forward slashes with a single slash
            let path = url.pathname.replaceAll(/\/+/g, '/');
            const splitPath = path.split('/');

            if (Config.supported_languages.find((item) => item.lang === splitPath[1])) {
                // "/es/topic/python/" -> "/topic/python/"
                params.set('previous_locale', i18n.locale);
                path = `/${splitPath.slice(2).join('/')}`;
            }

            if (locale !== 'en_US' && !Config.brand.has_organization && useLangPrefixedUrls) {
                const lang = Config.supported_languages.find(
                    (item) => item.locale === locale,
                )?.lang;
                path = `/${lang}${path}`;
            }

            return {path, params};
        },
        [
            Config.brand.has_organization,
            Config.supported_languages,
            currentUrl,
            i18n.locale,
            useLangPrefixedUrls,
        ],
    );

    return getLocaleUrl;
}
