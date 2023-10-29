import {observer} from 'mobx-react';
import React, {useEffect} from 'react';

import {useI18n} from '@udemy/i18n';

import {useHeaderStore} from '../../../hooks/use-header-store';
import {useUfbModels} from '../../../hooks/use-ufb-models';
import {
    MobileNavL1Nav,
    MobileNavSection,
    MobileNavItem,
} from '../../../mobile/mobile-nav/mobile-nav.react-component';

export const MobileLearningPathFolderNav = observer(() => {
    const headerStore = useHeaderStore();
    const {learningPathsMenuModel} = useUfbModels();
    const {gettext} = useI18n();

    useEffect(() => {
        learningPathsMenuModel.loadChildren();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MobileNavL1Nav id="header-toggle-side-nav-learning-path-folders">
            <MobileNavSection>
                <MobileNavItem href={learningPathsMenuModel.absolute_url}>
                    {gettext('All paths')}
                </MobileNavItem>
                <MobileNavItem href={headerStore.urls.MY_LEARNING_PATHS}>
                    {gettext('My edited paths')}
                </MobileNavItem>
            </MobileNavSection>
            <MobileNavSection>
                {learningPathsMenuModel.children.map((folder) => (
                    <MobileNavItem key={folder.id} href={folder.absolute_url}>
                        {folder.title}
                    </MobileNavItem>
                ))}
            </MobileNavSection>
        </MobileNavL1Nav>
    );
});
