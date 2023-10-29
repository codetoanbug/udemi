import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {useUDData} from '@udemy/ud-data';

import {useHeaderStore} from '../../hooks/use-header-store';
import {MobileNavSection, MobileNavItem} from '../../mobile/mobile-nav/mobile-nav.react-component';

export const ManageAndTeachSection = observer(() => {
    const headerStore = useHeaderStore();
    const udConfig = useUDData().Config;
    const {isInstructor, user, organizationState} = headerStore.userSpecificContext;
    const {gettext} = useI18n();
    if (!user || !user.id) {
        return null;
    }
    return (
        <MobileNavSection>
            {udConfig.brand.is_teaching_enabled && isInstructor && (
                <MobileNavItem href={headerStore.urls.TEACH} color="link">
                    {gettext('Switch to instructor view')}
                </MobileNavItem>
            )}
            {organizationState?.should_show_manage_menu && (
                <MobileNavItem cssToggleId="header-toggle-side-nav-manage">
                    {gettext('Manage')}
                </MobileNavItem>
            )}
        </MobileNavSection>
    );
});
