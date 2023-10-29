import React from 'react';

import {findFocusables} from '@udemy/design-system-utils';
import {useI18n} from '@udemy/i18n';
import {MenuAimArea} from '@udemy/react-popup-components';

import {useBrowseNavStore} from '../../hooks/use-browse-nav-store';
import {useHeaderStore} from '../../hooks/use-header-store';
import {useUfbContext} from '../../hooks/use-ufb-context';
import {HeaderButton, HeaderDropdown} from '../header-dropdown.react-component';
import styles from './browse-nav.module.less';
import {BrowseNav} from './browse-nav.react-component';

export const getFocusCycle = (container: HTMLElement) => {
    const browseNavLevel1 = container.querySelector<HTMLElement>('.js-browse-nav-level-one');
    const headerButton = container.querySelector<HTMLElement>('.js-header-button');
    if (browseNavLevel1 && headerButton) {
        const categories = findFocusables(browseNavLevel1);
        return categories.concat(headerButton);
    }

    return [];
};

interface BrowseNavDropdownProps {
    className: string;
}

export const BrowseNavDropdown = ({className}: BrowseNavDropdownProps) => {
    const browseNavStore = useBrowseNavStore();
    const headerStore = useHeaderStore();
    const ufbContext = useUfbContext();
    const {user} = headerStore.userSpecificContext;
    const {gettext, locale} = useI18n();

    const renderHeaderButton = () => {
        /* Placeholder renders "Categories" text with style set to hidden to occupy the same width as a localized
         translation of "Categories"
         */
        if (!user) {
            return (
                <div className={styles['placeholder-header-button']}>{gettext('Categories')}</div>
            );
        }

        const showUpdatedNavHeaderButton =
            user.consumer_subscription_active ||
            user?.show_updated_pp_and_ub_navigation ||
            user?.show_updated_mx_navigation;

        let text = gettext('Categories');
        if (ufbContext?.browseNavDropdownText) {
            text = ufbContext.browseNavDropdownText;
        } else if (showUpdatedNavHeaderButton) {
            text = gettext('Explore');
        }

        return <HeaderButton>{text}</HeaderButton>;
    };

    if (!user) {
        className += ` ${styles['placeholder-header-button']}`;
    }

    return (
        <HeaderDropdown
            trigger={renderHeaderButton()}
            className={className}
            componentClass="nav"
            placement="bottom-start"
            onFirstOpen={browseNavStore.loadNavigationCategories.bind(null, locale, !!ufbContext)}
            getFocusCycle={getFocusCycle}
        >
            <BrowseNav
                browseNavStore={browseNavStore}
                headerStore={headerStore}
                ufbContext={ufbContext}
            />
            <MenuAimArea />
        </HeaderDropdown>
    );
};
