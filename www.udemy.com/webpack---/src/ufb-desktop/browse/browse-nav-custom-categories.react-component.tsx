import React from 'react';

import {BlockList} from '@udemy/react-core-components';

import {BrowseNavItem} from '../../desktop/browse/browse-nav.react-component';
import styles from '../../desktop/list-menu.module.less';
import {useBrowseNavStore} from '../../hooks/use-browse-nav-store';

export const BrowseNavCustomCategories = () => {
    const browseNavStore = useBrowseNavStore();

    return (
        <BlockList size="small" className={styles['section']} iconAlignment="right">
            {browseNavStore.selectedLevelOneItem?.children?.map((item) => (
                <BrowseNavItem
                    key={item.id}
                    navItem={item}
                    id={`header-browse-nav-${item.type}-${item.id}`}
                />
            ))}
        </BlockList>
    );
};
