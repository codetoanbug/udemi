import React from 'react';

import {I18nContext} from './i18n-context';
import {I18nApi} from './types';

export const ERROR_MESSAGE =
    'Unable to access i18n API. Make sure you either 1) wrap your app in the @udemy/i18n provider or 2) make the i18n API available in the global scope';

export const WARNING_MESSAGE =
    'Unable to resolve I18n context; falling back to global scope. This warning is shown because the environment variable UD_FRONTENDS_LOG_WARNINGS is set to "true".';

/**
 * Hook used to access i18n APIs from within a React component. Uses the API provided by the
 * `I18nProvider` if available, otherwise it falls back to checking for global APIs
 *
 * @returns an instance of I18nApi
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const {lang, locale, gettext} = useI18n();
 *
 *   return (
 *     <div>
 *       <h1>{gettext('Hello translated world!')}</h1>
 *       <h2>{gettext('Current language')}: {lang}</h2>
 *       <h2>{gettext('Current locale')}: {locale}</h2>
 *     </div>
 *   );
 * };
 * ```
 */
export function useI18n() {
    const i18nApi = React.useContext(I18nContext);
    if (i18nApi) {
        return i18nApi;
    }

    const globalI18nApi = getGlobalI18nApi();
    if (globalI18nApi) {
        if (
            process.env.NODE_ENV !== 'production' &&
            process.env.UD_FRONTENDS_LOG_WARNINGS === 'true'
        ) {
            // eslint-disable-next-line no-console
            console.warn(WARNING_MESSAGE);
        }
        return globalI18nApi;
    }

    throw new Error(ERROR_MESSAGE);
}

function getGlobalI18nApi() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalObj = (typeof window === 'undefined' ? global : window) as any;
    if (typeof globalObj.gettext !== 'function' || typeof globalObj.UD?.request === 'undefined') {
        return null;
    }

    const locale = globalObj.UD.request.locale ?? 'en_US';
    const api: I18nApi = {
        gettext: globalObj.gettext,
        dgettext: globalObj.dgettext,
        dngettext: globalObj.dngettext,
        dpgettext: globalObj.dpgettext,
        ngettext: globalObj.ngettext,
        npgettext: globalObj.npgettext,
        pgettext: globalObj.pgettext,
        interpolate: globalObj.interpolate,
        ninterpolate: globalObj.ninterpolate,
        locale,
        lang: locale.split('_')[0],
    };
    return api;
}
