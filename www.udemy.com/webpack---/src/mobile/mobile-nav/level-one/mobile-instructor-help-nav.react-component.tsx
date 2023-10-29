import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';

import {useHeaderStore} from '../../../hooks/use-header-store';
import {MobileNavItem, MobileNavL1Nav, MobileNavSection} from '../mobile-nav.react-component';

export const MobileInstructorHelpNav = observer(() => {
    const {instructorURLs} = useHeaderStore();
    const {gettext} = useI18n();
    return (
        <MobileNavL1Nav id="header-toggle-side-nav-instructor-help">
            <MobileNavSection>
                <MobileNavItem
                    href={instructorURLs.TEACH_HUB}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {gettext('Teaching Center')}
                </MobileNavItem>
                <MobileNavItem
                    href={instructorURLs.COMMUNITY}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {gettext('Instructor Community')}
                </MobileNavItem>
                <MobileNavItem
                    href={instructorURLs.SUPPORT}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {gettext('Help and Support')}
                </MobileNavItem>
            </MobileNavSection>
        </MobileNavL1Nav>
    );
});
