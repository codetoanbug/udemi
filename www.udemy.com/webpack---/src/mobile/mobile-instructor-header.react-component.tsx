import {observer} from 'mobx-react';
import React, {useEffect} from 'react';

import {useI18n} from '@udemy/i18n';
import MenuIcon from '@udemy/icons/dist/menu.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {SmartBar} from '@udemy/smart-bar';

import {HeaderContextProvider} from '../contexts/header-context';
import {loadCommonAppContext} from '../external/load-common-app-context';
import {InstructorHeaderStore, InstructorHeaderStoreProps} from '../instructor-header.mobx-store';
import {UfbContext} from '../types/ufb-context';
import baseStyles from './mobile-header.module.less';
import styles from './mobile-instructor-header.module.less';
import {MobileIAInstructorNav} from './mobile-nav/mobile-ia-instructor-nav.react-component';
import {MobileNavStore} from './mobile-nav/mobile-nav.mobx-store';

export interface MobileInstructorHeaderProps
    extends Omit<InstructorHeaderStoreProps, 'ufbContext'> {
    isInsideDesktopHeader: boolean;
    ufbContext?: UfbContext;
    isSupplyGapsEnabled?: boolean;
}

export const MobileInstructorHeader = observer(
    ({
        isInsideDesktopHeader = false,
        isSupplyGapsEnabled = false,
        ...props
    }: MobileInstructorHeaderProps) => {
        const [headerStore] = React.useState(() => new InstructorHeaderStore(props));
        const [ufbStores] = React.useState(() => props.ufbContext?.createStores?.(headerStore));
        const [mobileNavStore] = React.useState(() => new MobileNavStore());
        const {gettext, locale} = useI18n();

        useEffect(() => {
            (async () => {
                const isUFB = !!props.ufbContext;
                const response = await loadCommonAppContext(locale, isUFB);
                headerStore.setUserSpecificContext(response.data.header);
            })();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        if (!props.isLoggedIn) {
            return null; // Instructor header requires login.
        }

        return (
            <HeaderContextProvider
                headerStore={headerStore}
                mobileNavStore={mobileNavStore}
                ufbContext={props.ufbContext}
                {...ufbStores}
            >
                <>
                    {!isInsideDesktopHeader && <SmartBar />}
                    <div className={`${baseStyles.header} ${styles.header}`}>
                        <div className={`${baseStyles.row}`}>
                            <IconButton
                                udStyle="ghost"
                                cssToggleId="header-toggle-side-nav"
                                className="ud-mobile-header-btn"
                                data-purpose="side-menu-opener"
                            >
                                <MenuIcon label={gettext('Open side drawer')} />
                            </IconButton>
                        </div>
                    </div>
                    <MobileIAInstructorNav isSupplyGapsEnabled={isSupplyGapsEnabled} />
                </>
            </HeaderContextProvider>
        );
    },
);
