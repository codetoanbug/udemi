import React from 'react';

import {Tracker} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import {useUDData} from '@udemy/ud-data';

import {CategoryNavItemSelectEvent} from '../../../events';
import {getBrowseURL} from '../../../get-browse-url';
import {BrowseNavCategory} from '../../../types/browse-nav-item';
import {MobileNavItem, MobileNavL2Nav, MobileNavSection} from '../mobile-nav.react-component';

export interface MobileSubcategoryNavProps {
    parentCategory: BrowseNavCategory;
    subcategories?: BrowseNavCategory[];
}

export const MobileSubcategoryNav = ({
    parentCategory,
    subcategories,
}: MobileSubcategoryNavProps) => {
    const {gettext, interpolate} = useI18n();
    const udData = useUDData();
    function handleSubcategoryNavClick(item: {id: number}) {
        const context = {
            categoryId: parentCategory.id,
            subcategoryId: item.id,
            topicId: null,
        };
        Tracker.publishEvent(new CategoryNavItemSelectEvent({context}));
    }

    return (
        <MobileNavL2Nav
            id={`header-toggle-side-nav-subcategories-of-${parentCategory.id}`}
            l1NavId="header-toggle-side-nav-categories"
            l1NavTitle={gettext('All Categories')}
        >
            <MobileNavSection>
                <MobileNavItem
                    href={getBrowseURL(
                        parentCategory.absolute_url,
                        udData.Config.brand.has_organization,
                    )}
                >
                    <span className="ud-heading-md">
                        {interpolate(
                            gettext('All %(category)s'),
                            {category: parentCategory.title},
                            true,
                        )}
                    </span>
                </MobileNavItem>
                {subcategories?.map((subcategory) => (
                    <MobileNavItem
                        onClick={() => handleSubcategoryNavClick(subcategory)}
                        key={`l2-mobile-subcategory-id-${subcategory.id}`}
                        href={getBrowseURL(
                            subcategory.absolute_url,
                            udData.Config.brand.has_organization,
                        )}
                        data-purpose="subcategory-item"
                    >
                        {subcategory.title}
                    </MobileNavItem>
                ))}
            </MobileNavSection>
        </MobileNavL2Nav>
    );
};
