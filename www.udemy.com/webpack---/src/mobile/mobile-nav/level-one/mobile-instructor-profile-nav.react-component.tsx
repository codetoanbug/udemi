import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {useUDData} from '@udemy/ud-data';

import {useHeaderStore} from '../../../hooks/use-header-store';
import {MobileNavItem, MobileNavL1Nav, MobileNavSection} from '../mobile-nav.react-component';

export const MobileInstructorProfileNav = observer(() => {
    const udData = useUDData();
    const udConfig = udData.Config;
    const {instructorURLs, userSpecificContext} = useHeaderStore();
    const {user} = userSpecificContext;
    const {gettext} = useI18n();
    return (
        <MobileNavL1Nav id="header-toggle-side-nav-instructor-profile">
            <MobileNavSection>
                {!!(
                    udConfig.brand.is_profile_functions_enabled &&
                    udConfig.brand.is_user_profiles_public &&
                    user.url
                ) && (
                    <MobileNavItem
                        href={user.url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                    >
                        {gettext('Public profile')}
                    </MobileNavItem>
                )}
                <MobileNavItem href={instructorURLs.EDIT_PROFILE}>
                    {gettext('Udemy profile')}
                </MobileNavItem>
                <MobileNavItem href={instructorURLs.EDIT_PHOTO}>
                    {gettext('Profile picture')}
                </MobileNavItem>
                {!!(
                    udConfig.brand.is_profile_functions_enabled &&
                    udConfig.brand.is_user_profiles_public
                ) && (
                    <MobileNavItem href={instructorURLs.EDIT_PRIVACY}>
                        {gettext('Privacy settings')}
                    </MobileNavItem>
                )}
            </MobileNavSection>
        </MobileNavL1Nav>
    );
});
