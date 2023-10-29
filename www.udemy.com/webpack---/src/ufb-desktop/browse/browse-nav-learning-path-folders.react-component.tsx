import React from 'react';

import {useI18n} from '@udemy/i18n';
import {BlockList} from '@udemy/react-core-components';

import {BrowseNavItem} from '../../desktop/browse/browse-nav.react-component';
import styles from '../../desktop/list-menu.module.less';
import {useBrowseNavStore} from '../../hooks/use-browse-nav-store';
import {useHeaderStore} from '../../hooks/use-header-store';

export const BrowseNavLearningPathFolders = () => {
    const headerStore = useHeaderStore();
    const browseNavStore = useBrowseNavStore();
    const {gettext} = useI18n();

    return (
        <>
            <BlockList size="small" className={styles['section']} iconAlignment="right">
                <BlockList.Item
                    data-id="all-learning-paths"
                    href={browseNavStore.selectedLevelOneItem?.absolute_url}
                    color="neutral"
                    className={styles['item']}
                >
                    {gettext('All paths')}
                </BlockList.Item>
                <BlockList.Item
                    data-id="my-learning-paths"
                    href={headerStore.urls.MY_LEARNING_PATHS}
                    color="neutral"
                    className={styles['item']}
                >
                    {gettext('My edited paths')}
                </BlockList.Item>
            </BlockList>
            <BlockList size="small" className={styles['section']} iconAlignment="right">
                {browseNavStore.selectedLevelOneItem?.children?.map((item) => (
                    <BrowseNavItem
                        key={item.id}
                        navItem={item}
                        href={item.absolute_url}
                        id={`header-browse-nav-${item.type}-${item.id}`}
                    />
                ))}
            </BlockList>
        </>
    );
};
