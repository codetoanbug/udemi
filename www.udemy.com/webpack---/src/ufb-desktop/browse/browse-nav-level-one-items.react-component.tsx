import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {BlockList} from '@udemy/react-core-components';
import {useUDData} from '@udemy/ud-data';

import {BrowseNavItem, BrowseNavItemFinders} from '../../desktop/browse/browse-nav.react-component';
import {DesktopNavSectionHeading} from '../../desktop/browse/desktop-nav.react-component';
import styles from '../../desktop/list-menu.module.less';
import {useBrowseNavStore} from '../../hooks/use-browse-nav-store';
import {useHeaderStore} from '../../hooks/use-header-store';
import {BrowseNavItem as BrowseNavItemType} from '../../types/browse-nav-item';
import {CustomCategoriesModel, LearningPathsMenuModel} from '../../ufb-browse-types';

interface BrowseNavLevelOneItemsProps {
    itemFinders: BrowseNavItemFinders;
}

export const BrowseNavLevelOneItems = observer(({itemFinders}: BrowseNavLevelOneItemsProps) => {
    const headerStore = useHeaderStore();
    const browseNavStore = useBrowseNavStore();
    const {browse, Config} = useUDData();
    const {gettext, interpolate} = useI18n();
    const [learningPathsMenu] = React.useState(new LearningPathsMenuModel(headerStore, {gettext}));
    const [customCategories] = React.useState(
        new CustomCategoriesModel(headerStore, {gettext, interpolate}, {browse, Config}),
    );

    React.useEffect(() => {
        customCategories.loadChildren();
    }, [customCategories]);

    React.useEffect(() => {
        if (
            !!browseNavStore.navigationCategories &&
            Config.features.organization.learning_path.enabled
        ) {
            learningPathsMenu.loadChildren();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderNavItem = (item: BrowseNavItemType) => {
        return (
            <BrowseNavItem
                navItem={item}
                href={item.absolute_url}
                onSelect={browseNavStore.selectLevelOneItem}
                findFirstSubNavItem={itemFinders.findFirstLevelTwoItem}
                isSelected={item === browseNavStore.selectedLevelOneItem}
                subNavId="header-browse-nav-level-two"
                id={`header-browse-nav-${item.type}-${item.id}`}
            />
        );
    };

    const hasLearningPaths = Config.features.organization.learning_path.enabled;
    const hasCustomCategories = customCategories.children.length > 0;
    if (!hasLearningPaths && !hasCustomCategories) {
        return null;
    }

    return (
        <>
            <DesktopNavSectionHeading>{gettext('My organization')}</DesktopNavSectionHeading>
            <BlockList size="small" className={styles['section']} iconAlignment="right">
                {hasLearningPaths && renderNavItem(learningPathsMenu)}
                {hasCustomCategories && renderNavItem(customCategories)}
            </BlockList>
            {/* Categories are rendered by marketplace categoryNav. */}
        </>
    );
});
