import React from 'react';

import {useI18n} from '@udemy/i18n';
import {useUDData} from '@udemy/ud-data';

import {getBrowseURL} from '../../../get-browse-url';
import {
    MobileNavItem,
    MobileNavL1Nav,
    MobileNavSection,
} from '../../../mobile/mobile-nav/mobile-nav.react-component';
import {BrowseNavCategory} from '../../../types/browse-nav-item';

export interface MobileSubcategoryNavProps {
    parentCategory: BrowseNavCategory;
    subcategories: BrowseNavCategory[];
}
export const MobileSubcategoryNav = ({
    parentCategory,
    subcategories,
}: MobileSubcategoryNavProps) => {
    const {gettext, interpolate} = useI18n();
    const udData = useUDData();
    return (
        <MobileNavL1Nav id={`header-toggle-side-nav-subcategories-of-${parentCategory.id}`}>
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
                {subcategories.map((subcategory) => (
                    <MobileNavItem
                        key={subcategory.id}
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
        </MobileNavL1Nav>
    );
};
