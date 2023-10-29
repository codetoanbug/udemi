import React from 'react';

import {LanguageList} from '@udemy/language-selector';

import {LanguageSelectorLocation} from '../../../constants';
import styles from './language-selector-overlay.module.less';

interface LanguageSelectorOverlayProps {
    useLangPrefixedUrls?: boolean;
}

export const LanguageSelectorOverlay = ({
    useLangPrefixedUrls = false,
}: LanguageSelectorOverlayProps) => {
    return (
        <div className={styles['container']}>
            <LanguageList
                uiRegion={LanguageSelectorLocation.MOBILE_NAV}
                useLangPrefixedUrls={useLangPrefixedUrls}
            />
        </div>
    );
};
