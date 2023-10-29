import {observer} from 'mobx-react';
import React from 'react';

import {LocalizedHtml, useI18n} from '@udemy/i18n';
import {Badge} from '@udemy/react-messaging-components';

import {useHeaderStore} from '../../../hooks/use-header-store';
import styles from '../../../mobile/mobile-nav/mobile-nav.module.less';
import {
    MobileNavItem,
    MobileNavL1Nav,
    MobileNavSection,
} from '../../../mobile/mobile-nav/mobile-nav.react-component';
import {ManageMenuL1Item} from '../../../ufb-desktop/manage/manage-dropdown.react-component';

export const levelTwoNavIdMap: Record<string, string> = {
    'header.manage-ufb.users': 'header-toggle-side-nav-manage-users',
    'header.manage-ufb.assigned': 'header-toggle-side-nav-manage-assigned',
    'header.manage-ufb.insights': 'header-toggle-side-nav-manage-insights',
    'header.manage-ufb.settings': 'header-toggle-side-nav-manage-settings',
    'header.manage-ufb.subscription-and-billing':
        'header-toggle-side-nav-manage-subscription-and-billing',
};

export const MobileL1ManageNav = observer(() => {
    const headerStore = useHeaderStore();
    const {gettext} = useI18n();

    function renderMenuItem(item: ManageMenuL1Item) {
        const cssToggleId = levelTwoNavIdMap[item.id as keyof typeof levelTwoNavIdMap];
        if (item.children) {
            return (
                <MobileNavItem key={item.id} cssToggleId={cssToggleId}>
                    {item.title}
                </MobileNavItem>
            );
        }

        return (
            <MobileNavItem key={item.id} href={item.url}>
                {item.is_beta ? (
                    <LocalizedHtml
                        html={interpolate(
                            gettext('%(title)s <span class="beta">Beta</span>'),
                            {
                                title: item.title,
                            },
                            true,
                        )}
                        interpolate={{beta: <Badge className={styles.beta} />}}
                    />
                ) : (
                    item.title
                )}
            </MobileNavItem>
        );
    }

    const {organizationManageMenu} = headerStore.userSpecificContext;
    return (
        <MobileNavL1Nav id="header-toggle-side-nav-manage" data-testid="mobile-l1-manage-nav">
            <MobileNavSection>{organizationManageMenu.map(renderMenuItem)}</MobileNavSection>
        </MobileNavL1Nav>
    );
});
