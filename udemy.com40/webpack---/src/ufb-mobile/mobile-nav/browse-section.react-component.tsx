import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {range} from '@udemy/shared-utils';
import {useUDData} from '@udemy/ud-data';

import {useHeaderStore} from '../../hooks/use-header-store';
import {useMobileNavStore} from '../../hooks/use-mobile-nav-store';
import {useUfbModels} from '../../hooks/use-ufb-models';
import {
    MobileNavSectionHeading,
    MobileNavSection,
    MobileNavItem,
} from '../../mobile/mobile-nav/mobile-nav.react-component';

export const BrowseSection = observer(() => {
    const udData = useUDData();
    const udConfig = udData.Config;
    const {gettext} = useI18n();
    const headerStore = useHeaderStore();
    const mobileNavStore = useMobileNavStore();
    const {customCategoriesModel, learningPathsMenuModel} = useUfbModels();

    function showBadgingNavChangesForPPUB() {
        const {user} = headerStore.userSpecificContext;
        return user?.show_updated_pp_and_ub_navigation;
    }

    function renderCategories() {
        return (
            <>
                <MobileNavSectionHeading>
                    {showBadgingNavChangesForPPUB()
                        ? gettext('Explore by category')
                        : gettext('All categories')}
                </MobileNavSectionHeading>
                <MobileNavSection>
                    {mobileNavStore.navigationCategories
                        ? mobileNavStore.navigationCategories.map((c) => (
                              <MobileNavItem
                                  key={c.id}
                                  cssToggleId={`header-toggle-side-nav-subcategories-of-${c.id}`}
                                  data-purpose="category-item"
                              >
                                  {c.title}
                              </MobileNavItem>
                          ))
                        : range(13).map((i) => <MobileNavItem key={i} loading={true} />)}
                </MobileNavSection>
            </>
        );
    }

    const learningPathsLink = !udConfig.features.organization.learning_path.enabled ? null : (
        <MobileNavItem cssToggleId="header-toggle-side-nav-learning-path-folders">
            {learningPathsMenuModel.title}
        </MobileNavItem>
    );

    const hasCustomCategories = customCategoriesModel.children.length > 0;
    const customCategoriesLink = !hasCustomCategories ? null : (
        <MobileNavItem cssToggleId="header-toggle-side-nav-custom-categories">
            {customCategoriesModel.title}
        </MobileNavItem>
    );

    if (!learningPathsLink && !customCategoriesLink) {
        return renderCategories();
    }

    return (
        <>
            <MobileNavSectionHeading>{gettext('My organization')}</MobileNavSectionHeading>
            <MobileNavSection>
                {learningPathsLink}
                {customCategoriesLink}
            </MobileNavSection>
            {renderCategories()}
        </>
    );
});
