import React from 'react';

import {LocalizedHtml, useI18n} from '@udemy/i18n';
import {ProBadge} from '@udemy/learning-path';
import {Badge} from '@udemy/react-messaging-components';

import styles from '../../../mobile/mobile-nav/mobile-nav.module.less';
import {
    MobileNavL2Nav,
    MobileNavSection,
    MobileNavItem,
} from '../../../mobile/mobile-nav/mobile-nav.react-component';
import {
    ManageMenuL1Item,
    ManageMenuL2Item,
} from '../../../ufb-desktop/manage/manage-dropdown.react-component';
import {levelTwoNavIdMap} from '../level-one/mobile-l1-manage-nav.react-component';

export interface MobileL2ManageNavProps {
    l1NavItem: ManageMenuL1Item;
}

export const MobileL2ManageNav = ({l1NavItem}: MobileL2ManageNavProps) => {
    const {gettext} = useI18n();

    function getTitle(item: ManageMenuL2Item) {
        let title: React.ReactNode = item.title;
        if (item.is_pro) {
            title = (
                <>
                    {title} <ProBadge />
                </>
            );
        } else if (item.is_beta) {
            title = (
                <LocalizedHtml
                    html={interpolate(
                        gettext('%(title)s <span class="beta">Beta</span>'),
                        {
                            title,
                        },
                        true,
                    )}
                    interpolate={{beta: <Badge className={styles.beta} />}}
                />
            );
        }

        return title;
    }

    return (
        <MobileNavL2Nav
            id={levelTwoNavIdMap[l1NavItem.id as keyof typeof levelTwoNavIdMap]}
            data-testid="mobile-l2-manage-nav"
            l1NavId="header-toggle-side-nav-manage"
            l1NavTitle={gettext('Manage')}
        >
            <MobileNavSection>
                {l1NavItem.children?.map((item) => (
                    <MobileNavItem key={item.key} href={item.href}>
                        {getTitle(item)}
                    </MobileNavItem>
                ))}
            </MobileNavSection>
        </MobileNavL2Nav>
    );
};
