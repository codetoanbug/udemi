import {observer} from 'mobx-react';
import React from 'react';

import {useUDData} from '@udemy/ud-data';

import {useMobileNavStore} from '../../hooks/use-mobile-nav-store';
import {MobileStudentProfileNav} from '../../mobile/mobile-nav/level-one/mobile-student-profile-nav.react-component';
import {MobileCustomCategoryNav} from './level-one/mobile-custom-category-nav.react-component';
import {MobileLearningPathFolderNav} from './level-one/mobile-learning-path-folder-nav.react-component';
import {MobileSubcategoryNav} from './level-one/mobile-subcategory-nav.react-component';
import {ManageSubNavs} from './manage-sub-navs.react-component';

export const SubNavs = observer(() => {
    const mobileNavStore = useMobileNavStore();
    const udConfig = useUDData().Config;

    const hasL1 = mobileNavStore.isLevelLoaded(1);
    const isLPEnabled = udConfig.features.organization.learning_path.enabled;

    return (
        <>
            {hasL1 &&
                mobileNavStore.navigationCategories?.map((category) => (
                    <MobileSubcategoryNav
                        key={category.id}
                        parentCategory={category}
                        subcategories={category.children ?? []}
                    />
                ))}
            {hasL1 && <MobileCustomCategoryNav />}
            {hasL1 && isLPEnabled && <MobileLearningPathFolderNav />}
            <ManageSubNavs />
            {hasL1 && <MobileStudentProfileNav />}
        </>
    );
});
