import React from 'react';

import {Tracker} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {SupportedLanguage, useUDData} from '@udemy/ud-data';

import {LanguageSelectorActionEvent, ACTIONS} from '../events';
import {useGetLocaleUrl} from '../hooks/use-get-locale-url';
import {useUpdateUserLocale} from '../hooks/use-update-user-locale';
import styles from './language-list.module.less';

export interface LanguageListProps {
    /**
     * The region in the UI where this component is located (e.g. header, footer).
     * Passed to `LanguageSelectorActionEvent`
     */
    uiRegion: string;
    /**
     * If true, will add the language prefix to navigation URLs (e.g. /fr/topic/python)
     * @default true
     */
    useLangPrefixedUrls?: boolean;
}

/**
 * Renders a list of available languages as links. Available languages are pulled from the
 * `supported_languages` field of the UD `Config` object
 */
export const LanguageList = React.forwardRef<HTMLDivElement, LanguageListProps>(
    ({uiRegion, useLangPrefixedUrls = true}, ref) => {
        const {locale} = useI18n();
        const {Config} = useUDData();
        const getLocaleUrl = useGetLocaleUrl(undefined, useLangPrefixedUrls);
        const updateUserLocale = useUpdateUserLocale(useLangPrefixedUrls);

        const activeLanguage = Config.supported_languages.find(
            (language) => language.locale === locale,
        );
        const activeLocale = activeLanguage?.locale ?? 'en_US';

        function handleLanguageClick(e: React.MouseEvent, language: SupportedLanguage) {
            e.preventDefault();
            updateUserLocale(language.locale);
            Tracker.publishEvent(
                new LanguageSelectorActionEvent({
                    action: ACTIONS.selectLanguage,
                    selectorLocation: uiRegion,
                    selectedLocale: language.locale,
                }),
            );
        }

        return (
            <div ref={ref} className={styles['root']}>
                {Config.supported_languages.map((language) => (
                    <Button
                        key={language.locale}
                        className={styles['button']}
                        data-active={language.locale === activeLocale ? true : undefined}
                        componentClass="a"
                        href={getLocaleUrl(language.locale).path}
                        udStyle="ghost"
                        size="medium"
                        typography="ud-text-md"
                        onClick={(e) => handleLanguageClick(e, language)}
                    >
                        <span lang={language.lang}>{language.name}</span>
                    </Button>
                ))}
            </div>
        );
    },
);
