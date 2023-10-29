import {observer} from 'mobx-react';
import React from 'react';

import {LocalizedHtml, useI18n} from '@udemy/i18n';
import {BlockList} from '@udemy/react-core-components';
import {Badge} from '@udemy/react-messaging-components';

import headerStyles from '../../desktop/desktop-header.module.less';
import {
    HeaderButton,
    HeaderDropdown,
    HeaderMenu,
} from '../../desktop/header-dropdown.react-component';
import menuStyles from '../../desktop/list-menu.module.less';
import {useHeaderStore} from '../../hooks/use-header-store';

export interface ManageMenuL1Item {
    id: string;
    icon?: string;
    url: string;
    hidden?: boolean;
    is_beta?: boolean;
    is_pro?: boolean;
    event_onclick?: {
        key: string;
        context?: unknown;
    };
    title: string;
    children?: ManageMenuL2Item[];
}

export interface ManageMenuL2Item {
    key: string;
    href: string;
    is_beta?: boolean;
    is_pro?: boolean;
    title: string;
}

export const ManageDropdown = observer(() => {
    const headerStore = useHeaderStore();
    const {gettext} = useI18n();

    const renderMenuItem = (item: ManageMenuL1Item, key: number) => {
        return (
            <BlockList.Item
                key={key}
                href={item.url}
                color="neutral"
                data-intercom-target={item.id}
            >
                {item.is_beta ? (
                    <LocalizedHtml
                        html={interpolate(
                            gettext('%(title)s <span class="beta">Beta</span>'),
                            {
                                title: item.title,
                            },
                            true,
                        )}
                        interpolate={{beta: <Badge className={menuStyles['beta']} />}}
                    />
                ) : (
                    item.title
                )}
            </BlockList.Item>
        );
    };

    const {organizationState, organizationManageMenu} = headerStore.userSpecificContext;
    if (!organizationState?.should_show_manage_menu) {
        return null;
    }

    return (
        <HeaderDropdown
            trigger={
                <HeaderButton data-intercom-target="header.manage-ufb">
                    {gettext('Manage')}
                </HeaderButton>
            }
            className={`${menuStyles['list-menu-container']} ${headerStyles['gap-button']}`}
        >
            <HeaderMenu>
                <BlockList size="small" className={menuStyles['section']}>
                    {organizationManageMenu.map(renderMenuItem)}
                </BlockList>
            </HeaderMenu>
        </HeaderDropdown>
    );
});
