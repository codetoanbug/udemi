import {observer} from 'mobx-react';
import React, {useEffect} from 'react';

import {useUDData} from '@udemy/ud-data';

import {getBrowseURL} from '../../../get-browse-url';
import {useUfbModels} from '../../../hooks/use-ufb-models';
import {
    MobileNavL1Nav,
    MobileNavSection,
    MobileNavItem,
} from '../../../mobile/mobile-nav/mobile-nav.react-component';

export const MobileCustomCategoryNav = observer(() => {
    const {customCategoriesModel} = useUfbModels();
    const udData = useUDData();

    useEffect(() => {
        customCategoriesModel.loadChildren();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (customCategoriesModel.children.length === 0) {
        return null;
    }

    return (
        <MobileNavL1Nav id="header-toggle-side-nav-custom-categories">
            <MobileNavSection>
                {customCategoriesModel.children.map((category) => (
                    <MobileNavItem
                        key={category.id}
                        href={getBrowseURL(
                            category.absolute_url,
                            udData.Config.brand.has_organization,
                        )}
                    >
                        {category.title}
                    </MobileNavItem>
                ))}
            </MobileNavSection>
        </MobileNavL1Nav>
    );
});
