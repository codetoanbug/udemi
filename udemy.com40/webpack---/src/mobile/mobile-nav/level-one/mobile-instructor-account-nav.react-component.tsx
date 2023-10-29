import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {useUDData} from '@udemy/ud-data';

import {useHeaderStore} from '../../../hooks/use-header-store';
import {MobileNavItem, MobileNavL1Nav, MobileNavSection} from '../mobile-nav.react-component';

export const MobileInstructorAccountNav = observer(() => {
    const headerStore = useHeaderStore();
    const {instructorURLs} = headerStore;
    const {Config} = useUDData();
    const udConfig = Config;
    const {gettext} = useI18n();

    return (
        <MobileNavL1Nav id="header-toggle-side-nav-instructor-account">
            <MobileNavSection>
                {udConfig.brand.is_profile_functions_enabled && (
                    <MobileNavItem href={instructorURLs.ACCOUNT}>
                        {gettext('Account security')}
                    </MobileNavItem>
                )}
                <MobileNavItem href={instructorURLs.EDIT_NOTIFICATIONS}>
                    {gettext('Notification settings')}
                </MobileNavItem>
                {!udConfig.brand.has_organization && (
                    <MobileNavItem href={instructorURLs.API_CLIENTS}>
                        {gettext('API clients')}
                    </MobileNavItem>
                )}
                {!udConfig.brand.has_organization && (
                    <MobileNavItem href={instructorURLs.CLOSE_ACCOUNT}>
                        {gettext('Close account')}
                    </MobileNavItem>
                )}
            </MobileNavSection>
        </MobileNavL1Nav>
    );
});
