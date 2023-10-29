import React from 'react';

import {createGettextApi} from './gettext-api';
import {CompactTranslations, I18nApi} from './types';

export const I18nContext = React.createContext<I18nApi | null>(null);

interface I18nProviderProps {
    /**
     * The current language code without region (e.g. en)
     */
    lang: string;
    /**
     * The current locale code in the format language_REGION (e.g. en_US)
     */
    locale: string;
    /**
     * An object containing translations
     */
    translations: CompactTranslations;
    children: React.ReactNode;
}

/**
 * Wrap your app in this provider to allow components to access gettext APIs via the useI18n hook
 */
export const I18nProvider = ({lang, locale, translations, children}: I18nProviderProps) => {
    const i18nApi = React.useMemo(() => {
        const api = createGettextApi(translations, lang) as unknown as I18nApi;
        api.lang = lang;
        api.locale = locale;
        return api;
    }, [lang, locale, translations]);

    return <I18nContext.Provider value={i18nApi}>{children}</I18nContext.Provider>;
};
