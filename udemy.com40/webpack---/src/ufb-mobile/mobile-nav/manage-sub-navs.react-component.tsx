import {observer} from 'mobx-react';
import React from 'react';

import {useHeaderStore} from '../../hooks/use-header-store';
import {useMobileNavStore} from '../../hooks/use-mobile-nav-store';
import {MobileL1ManageNav} from './level-one/mobile-l1-manage-nav.react-component';
import {MobileL2ManageNav} from './level-two/mobile-l2-manage-nav.react-component';

export const ManageSubNavs = observer(() => {
    const headerStore = useHeaderStore();
    const mobileNavStore = useMobileNavStore();

    function renderL2ManageNav(l1NavItemId: string) {
        const {organizationManageMenu} = headerStore.userSpecificContext;
        const l1NavItem = organizationManageMenu.find((item) => item.id === l1NavItemId);
        return l1NavItem && <MobileL2ManageNav l1NavItem={l1NavItem} />;
    }

    const {user, organizationState} = headerStore.userSpecificContext;
    if (!user || !organizationState?.should_show_manage_menu) {
        return null;
    }

    const hasL1 = mobileNavStore.isLevelLoaded(1);
    const hasL2 = mobileNavStore.isLevelLoaded(2);
    return (
        <div>
            {hasL2 && renderL2ManageNav('header.manage-ufb.users')}
            {hasL2 && renderL2ManageNav('header.manage-ufb.insights')}
            {hasL2 && renderL2ManageNav('header.manage-ufb.assigned')}
            {hasL2 && renderL2ManageNav('header.manage-ufb.settings')}
            {hasL2 && renderL2ManageNav('header.manage-ufb.subscription-and-billing')}
            {hasL1 && <MobileL1ManageNav />}
        </div>
    );
});
