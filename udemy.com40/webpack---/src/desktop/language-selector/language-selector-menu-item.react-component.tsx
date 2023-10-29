import React from 'react';

import {useI18n} from '@udemy/i18n';
import LanguageIcon from '@udemy/icons/dist/language.ud-icon';
import {BlockList, BlockListItemProps} from '@udemy/react-core-components';
import {useUDData} from '@udemy/ud-data';

import styles from './language-selector-menu-item.module.less';

export const LanguageSelectorMenuItem = (props: BlockListItemProps<'div'>) => {
    const {Config: udConfig} = useUDData();
    const {gettext, locale} = useI18n();

    const currentLanguage = React.useMemo(() => {
        const language = udConfig.supported_languages.find(
            (language) => language.locale === locale,
        );
        return language?.name || null;
    }, [locale, udConfig.supported_languages]);

    return (
        <BlockList.Item
            componentClass="button"
            color="neutral"
            icon={<LanguageIcon label={false} size="small" />}
            {...props}
        >
            <div className={styles['item-content']}>
                <span>{gettext('Language')}</span>
                <span className={styles['current-language']}>{currentLanguage}</span>
            </div>
        </BlockList.Item>
    );
};
