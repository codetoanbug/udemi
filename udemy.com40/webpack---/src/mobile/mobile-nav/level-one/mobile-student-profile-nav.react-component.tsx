import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {useUDData} from '@udemy/ud-data';

import {
    UnreadActivityNotificationsBadge,
    UnreadMessagesBadge,
    UnseenCreditsBadge,
} from '../../../badges.react-component';
import {useHeaderStore} from '../../../hooks/use-header-store';
import {
    MobileNavItem,
    MobileNavL1Nav,
    MobileNavSection,
    MobileNavSectionHeading,
} from '../mobile-nav.react-component';

export const MobileStudentProfileNav = observer(() => {
    const udData = useUDData();
    const udConfig = udData.Config;
    const {gettext} = useI18n();
    const headerStore = useHeaderStore();
    const {urls} = headerStore;

    function alertsSection() {
        return renderSection(
            gettext('Alerts'),
            <MobileNavSection>
                {udConfig.features.notifications && (
                    <MobileNavItem
                        href={urls.VIEW_NOTIFICATIONS}
                        icon={<UnreadActivityNotificationsBadge />}
                    >
                        {gettext('Notifications')}
                    </MobileNavItem>
                )}
                {udConfig.brand.is_messaging_enabled && (
                    <MobileNavItem href={urls.MESSAGES} icon={<UnreadMessagesBadge />}>
                        {gettext('Messages')}
                    </MobileNavItem>
                )}
                {!headerStore.isPersonalPlanSubscriber && udConfig.features.wishlist && (
                    <MobileNavItem href={urls.WISHLIST}>{gettext('Wishlist')}</MobileNavItem>
                )}
            </MobileNavSection>,
        );
    }

    function accountSection() {
        return renderSection(
            gettext('Account'),
            <MobileNavSection>
                <MobileNavItem href={urls.ACCOUNT}>{gettext('Account settings')}</MobileNavItem>
                {!udConfig.brand.has_organization && (
                    <MobileNavItem href={urls.PAYMENT_METHODS}>
                        {gettext('Payment methods')}
                    </MobileNavItem>
                )}
                {renderSubscriptionBlock()}
                {!udConfig.brand.has_organization && (
                    <MobileNavItem href={urls.CREDITS} icon={<UnseenCreditsBadge />}>
                        {gettext('Udemy credits')}
                    </MobileNavItem>
                )}
                {!udConfig.brand.has_organization && (
                    <MobileNavItem href={urls.PURCHASE_HISTORY}>
                        {gettext('Purchase history')}
                    </MobileNavItem>
                )}
            </MobileNavSection>,
        );
    }

    function profileSection() {
        const {user} = headerStore.userSpecificContext;
        return renderSection(
            gettext('Profile'),
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
                <MobileNavItem href={urls.EDIT_PROFILE}>{gettext('Edit profile')}</MobileNavItem>
                <MobileNavItem href={user.logout_url}>{gettext('Log out')}</MobileNavItem>
            </MobileNavSection>,
        );
    }

    function renderSubscriptionBlock() {
        const {urls, userSpecificContext} = headerStore;
        if (userSpecificContext.isSubscriptionAware) {
            return (
                <MobileNavItem href={urls.SUBSCRIPTION_MANAGEMENT}>
                    {gettext('Subscriptions')}
                </MobileNavItem>
            );
        }
        return null;
    }

    function renderSection(title: string, list: JSX.Element) {
        if (React.Children.toArray(list.props.children).filter(Boolean).length === 0) {
            return null;
        }
        return (
            <>
                <MobileNavSectionHeading>{title}</MobileNavSectionHeading>
                {list}
            </>
        );
    }

    const {user} = headerStore.userSpecificContext;
    if (!user || !user.id) {
        return null;
    }
    return (
        <MobileNavL1Nav id="header-toggle-side-nav-student-profile">
            {alertsSection()}
            {accountSection()}
            {profileSection()}
        </MobileNavL1Nav>
    );
});
