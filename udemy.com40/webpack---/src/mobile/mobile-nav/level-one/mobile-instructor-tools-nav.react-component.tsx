import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';

import {useHeaderStore} from '../../../hooks/use-header-store';
import {MobileNavItem, MobileNavL1Nav, MobileNavSection} from '../mobile-nav.react-component';

export const MobileInstructorToolsNav = observer(() => {
    const {instructorURLs} = useHeaderStore();
    const {gettext} = useI18n();
    return (
        <MobileNavL1Nav id="header-toggle-side-nav-instructor-tools">
            <MobileNavSection>
                <MobileNavItem href={instructorURLs.TEST_VIDEO}>
                    {gettext('Test Video')}
                </MobileNavItem>
                <MobileNavItem href={instructorURLs.MARKETPLACE_INSIGHTS}>
                    {gettext('Marketplace Insights')}
                </MobileNavItem>
            </MobileNavSection>
        </MobileNavL1Nav>
    );
});
