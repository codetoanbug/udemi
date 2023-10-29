import {observer} from 'mobx-react';
import React from 'react';

import {
    ActivityNotificationsStore,
    setGlobalActivityNotificationsStore,
} from '@udemy/activity-notifications';
import {AboveTheFoldProvider} from '@udemy/design-system-utils';
import {useI18n} from '@udemy/i18n';
import {SmartBar} from '@udemy/smart-bar';
import {useUDData} from '@udemy/ud-data';

import {HeaderContextProvider} from '../contexts/header-context';
import {CommonAppContext, loadCommonAppContext} from '../external/load-common-app-context';
import {InstructorHeaderStore, InstructorHeaderStoreProps} from '../instructor-header.mobx-store';
import {MobileInstructorHeader as MobileInstructorHeader} from '../mobile/mobile-instructor-header.react-component';
import {createUFBContext} from '../ufb-desktop/create-ufb-context';
import baseStyles from './desktop-header.module.less';
import styles from './desktop-instructor-header.module.less';
import {LearnerDropdown} from './instructor/learner-dropdown.react-component';
import {NotificationDropdown} from './notification/notification-dropdown.react-component';
import {InstructorProfileDropdown} from './user-profile/instructor-profile-dropdown.react-component';

// Keep in sync with $breakpoint-instructor-mobile-max in instructor/variables.less in monolith
export const BREAKPOINT_INSTRUCTOR_MOBILE_MAX =
    'unit(round((767 * @px-to-rem / @font-size-md), 2), em)';

export interface DesktopInstructorHeaderProps extends InstructorHeaderStoreProps {
    isLoggedIn: boolean;
    isSupplyGapsEnabled?: boolean;
}

export const DesktopInstructorHeader = observer(
    ({isLoggedIn, isSupplyGapsEnabled = false, ...storeProps}: DesktopInstructorHeaderProps) => {
        const udData = useUDData();
        const i18n = useI18n();
        const locale = i18n.locale;
        const [ufbContext] = React.useState(() => {
            if (udData.Config.brand.has_organization) {
                return createUFBContext(udData, i18n);
            }
        });
        const [headerStore] = React.useState(
            () => new InstructorHeaderStore({isLoggedIn, ufbContext, ...storeProps}),
        );
        const [activityNotificationsStore] = React.useState(() => {
            const store = new ActivityNotificationsStore(i18n);
            setGlobalActivityNotificationsStore(store);
            return store;
        });

        React.useEffect(() => {
            const isUFB = !!ufbContext;
            loadCommonAppContext(locale, isUFB, (response: CommonAppContext) => {
                headerStore.setUserSpecificContext(response.data.header);
                activityNotificationsStore.setUserSpecificContext({
                    user: headerStore.userSpecificContext.user,
                    userType: 'instructor',
                });
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        function renderLoggedInPart() {
            return (
                <>
                    {ufbContext?.packageAlert}
                    {ufbContext?.manageDropdown}
                    {udData.Config.brand.is_teaching_enabled && (
                        <LearnerDropdown className={baseStyles['gap-button']} />
                    )}
                    {udData.Config.features.notifications && <NotificationDropdown className="" />}
                    <InstructorProfileDropdown className="" />
                </>
            );
        }

        function renderUserSpecificPart() {
            // Instructor header requires login.
            return isLoggedIn ? renderLoggedInPart() : null;
        }

        const headerProviderContext = {
            headerStore,
            activityNotificationsStore,
            ufbContext,
        };

        return (
            <HeaderContextProvider {...headerProviderContext}>
                <AboveTheFoldProvider
                    headerStore={headerStore}
                    activityNotificationsStore={activityNotificationsStore}
                    ufbContext={ufbContext}
                >
                    <>
                        <SmartBar />
                        <div
                            className={`${baseStyles['mobile-header']} ${styles['mobile-header']}`}
                        >
                            <MobileInstructorHeader
                                {...storeProps}
                                isLoggedIn={isLoggedIn}
                                ufbContext={ufbContext?.mobileContext}
                                isInsideDesktopHeader={true}
                                isSupplyGapsEnabled={isSupplyGapsEnabled}
                            />
                        </div>
                        <div
                            className={`ud-text-sm ${baseStyles['header']} ${styles['header']}`}
                            data-purpose="header"
                        >
                            <div style={{flex: 1}} />
                            {renderUserSpecificPart()}
                        </div>
                    </>
                </AboveTheFoldProvider>
            </HeaderContextProvider>
        );
    },
);
