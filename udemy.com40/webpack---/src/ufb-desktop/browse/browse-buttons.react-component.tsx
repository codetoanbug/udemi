import React from 'react';

import {useI18n} from '@udemy/i18n';
import {useUDData} from '@udemy/ud-data';

import {BrowseNavDropdown} from '../../desktop/browse/browse-nav-dropdown.react-component';
import styles from '../../desktop/desktop-header.module.less';
import {HeaderButton} from '../../desktop/header-dropdown.react-component';
import {useHeaderStore} from '../../hooks/use-header-store';

export const BrowseButtons = () => {
    const headerStore = useHeaderStore();
    const {Config} = useUDData();
    const {gettext} = useI18n();

    return (
        <>
            <BrowseNavDropdown className={styles['gap-button']} />
            {Config.features.organization.learning_path.enabled && (
                <div className={styles['gap-button group-a']}>
                    <HeaderButton componentClass="a" href={headerStore.urls.LEARNING_PATHS}>
                        {gettext('Learning paths')}
                    </HeaderButton>
                </div>
            )}
        </>
    );
};
