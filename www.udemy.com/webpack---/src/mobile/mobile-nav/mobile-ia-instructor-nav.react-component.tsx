import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {useUDData} from '@udemy/ud-data';

import {UnreadMessagesBadge, UnreadActivityNotificationsBadge} from '../../badges.react-component';
import {useHeaderStore} from '../../hooks/use-header-store';
import {useMobileNavStore} from '../../hooks/use-mobile-nav-store';
import {ManageSubNavs} from '../../ufb-mobile/mobile-nav/manage-sub-navs.react-component';
import {MobileInstructorAccountNav} from './level-one/mobile-instructor-account-nav.react-component';
import {MobileInstructorCommunicationNav} from './level-one/mobile-instructor-communication-nav.react-component';
import {MobileInstructorHelpNav} from './level-one/mobile-instructor-help-nav.react-component';
import {MobileInstructorPerformanceNav} from './level-one/mobile-instructor-performance-nav.react-component';
import {MobileInstructorProfileNav} from './level-one/mobile-instructor-profile-nav.react-component';
import {MobileInstructorToolsNav} from './level-one/mobile-instructor-tools-nav.react-component';
import styles from './mobile-nav.module.less';
import {
    MobileNav,
    MobileNavItem,
    MobileNavL2Nav,
    MobileNavSection,
    MobileNavWelcomeSection,
} from './mobile-nav.react-component';

export interface MobileIAInstructorNavProps {
    /**
     * Is Supply Gaps enabled
     *
     * @defaultValue false
     */
    isSupplyGapsEnabled?: boolean;
}

export const MobileIAInstructorNav = observer(
    ({isSupplyGapsEnabled = false}: MobileIAInstructorNavProps) => {
        const udData = useUDData();
        const udConfig = udData.Config;
        const headerStore = useHeaderStore();
        const mobileNavStore = useMobileNavStore();
        const {gettext} = useI18n();

        function onToggle() {
            mobileNavStore.ensureLevelIsLoaded(1);
        }

        function iaSwitchSection() {
            const {instructorURLs} = headerStore;
            const {organizationState} = headerStore.userSpecificContext;
            return (
                <MobileNavSection>
                    {udConfig.brand.is_teaching_enabled && (
                        <MobileNavItem href={instructorURLs.BROWSE} color="link">
                            {udConfig.brand.has_organization
                                ? gettext('Switch to learner view')
                                : gettext('Switch to student view')}
                        </MobileNavItem>
                    )}
                    {organizationState?.should_show_manage_menu && (
                        <MobileNavItem cssToggleId="header-toggle-side-nav-manage">
                            {gettext('Manage')}
                        </MobileNavItem>
                    )}
                </MobileNavSection>
            );
        }

        function instructorSection1() {
            const {instructorURLs} = headerStore;
            return (
                <MobileNavSection>
                    <MobileNavItem href={instructorURLs.COURSES}>
                        {gettext('Courses')}
                    </MobileNavItem>
                    <MobileNavItem cssToggleId="header-toggle-side-nav-instructor-communication">
                        {gettext('Communication')}
                        <UnreadMessagesBadge className={styles['inline-notification-badge']} />
                    </MobileNavItem>
                    <MobileNavItem cssToggleId="header-toggle-side-nav-instructor-performance">
                        {gettext('Performance')}
                    </MobileNavItem>
                    <MobileNavItem cssToggleId="header-toggle-side-nav-instructor-tools">
                        {gettext('Tools')}
                    </MobileNavItem>
                    {isSupplyGapsEnabled && (
                        <MobileNavItem href={instructorURLs.INSIGHTS}>
                            {gettext('Insights')}
                        </MobileNavItem>
                    )}
                    <MobileNavItem cssToggleId="header-toggle-side-nav-instructor-help">
                        {gettext('Resources')}
                    </MobileNavItem>
                </MobileNavSection>
            );
        }

        function instructorSection2() {
            const {instructorURLs, userSpecificContext} = headerStore;
            const {user} = userSpecificContext;
            return (
                <MobileNavSection>
                    {udConfig.features.notifications && (
                        <MobileNavItem href={instructorURLs.VIEW_NOTIFICATIONS}>
                            {gettext('Notifications')}
                            <UnreadActivityNotificationsBadge
                                className={styles['inline-notification-badge']}
                            />
                        </MobileNavItem>
                    )}
                    <MobileNavItem cssToggleId="header-toggle-side-nav-instructor-account">
                        {gettext('Account settings')}
                    </MobileNavItem>
                    {headerStore.isPayoutSettingsEnabled && (
                        <MobileNavItem href={instructorURLs.PAYOUT_SETTINGS}>
                            {gettext('Payout & tax settings')}
                        </MobileNavItem>
                    )}
                    {headerStore.isRevenueReportEnabled && (
                        <MobileNavItem href={instructorURLs.REVENUE_REPORT}>
                            {gettext('Revenue report')}
                        </MobileNavItem>
                    )}
                    <MobileNavItem
                        href={headerStore.mobileAppLink?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {gettext('Get the app')}
                    </MobileNavItem>
                    <MobileNavItem href={user.logout_url}>{gettext('Log out')}</MobileNavItem>
                </MobileNavSection>
            );
        }

        function engagementSubMenu() {
            const {basePath, paths} = headerStore.getInstructorPerformancePaths();

            return (
                <MobileNavL2Nav
                    id="header-toggle-side-nav-instructor-performance-engagement"
                    l1NavId="header-toggle-side-nav-instructor-performance"
                    l1NavTitle={gettext('Engagement')}
                >
                    <MobileNavSection>
                        <MobileNavItem href={`${basePath}${paths.engagementPath}`}>
                            {gettext('Course engagement')}
                        </MobileNavItem>
                        <MobileNavItem href={`${basePath}${paths.practiceInsightsPath}`}>
                            {gettext('Practice insights')}
                        </MobileNavItem>
                    </MobileNavSection>
                </MobileNavL2Nav>
            );
        }

        function subNavs() {
            return (
                <>
                    {headerStore.isDisplayPracticeInsightsNewPageWithFunnelViewEnabled &&
                        mobileNavStore.isLevelLoaded(2) &&
                        engagementSubMenu()}
                    {mobileNavStore.isLevelLoaded(1) && <MobileInstructorAccountNav />}
                    {mobileNavStore.isLevelLoaded(1) && <MobileInstructorHelpNav />}
                    {mobileNavStore.isLevelLoaded(1) && <MobileInstructorToolsNav />}
                    {mobileNavStore.isLevelLoaded(1) && <MobileInstructorPerformanceNav />}
                    {mobileNavStore.isLevelLoaded(1) && <MobileInstructorCommunicationNav />}
                    <ManageSubNavs />
                    {mobileNavStore.isLevelLoaded(1) && <MobileInstructorProfileNav />}
                </>
            );
        }

        return (
            <MobileNav onToggle={onToggle} subDrawers={subNavs()}>
                <MobileNavWelcomeSection cssToggleId="header-toggle-side-nav-instructor-profile" />
                {iaSwitchSection()}
                {instructorSection1()}
                {instructorSection2()}
            </MobileNav>
        );
    },
);
