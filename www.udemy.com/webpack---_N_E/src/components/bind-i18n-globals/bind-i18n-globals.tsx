import {useI18n} from '@udemy/i18n';
import {serverOrClient} from '@udemy/shared-utils';

/**
 * Temporary solution to ensure global translation APIs are bound for DS/monolith components that
 * have not been migrated to use the new @udemy/i18n package
 */
export const BindI18nGlobals = () => {
    const i18n = useI18n();
    Object.assign(serverOrClient.global, i18n);
    return null;
};
