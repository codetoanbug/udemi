/* eslint-disable react/jsx-no-target-blank */
import {observer} from 'mobx-react';
import React from 'react';

import {UFBNoticeClickEvent} from '@udemy/browse-event-tracking';
import {Tracker} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import OpenInNewIcon from '@udemy/icons/dist/open-in-new.ud-icon';
import {ModalLanguageSelector} from '@udemy/language-selector';
import {ProBadge} from '@udemy/learning-path';
import {toBusinessUdemy} from '@udemy/organization';
import {Avatar, BlockList} from '@udemy/react-core-components';
import {Badge} from '@udemy/react-messaging-components';
import {useUDData} from '@udemy/ud-data';

import {
    CartBadge,
    ProfileBadge,
    UnreadActivityNotificationsBadge,
    UnreadMessagesBadge,
    UnseenCreditsBadge,
} from '../../badges.react-component';
import {LanguageSelectorLocation} from '../../constants';
import {useHeaderStore} from '../../hooks/use-header-store';
import headerStyles from '../desktop-header.module.less';
import {HeaderDropdown, HeaderButton, HeaderMenu} from '../header-dropdown.react-component';
import {LanguageSelectorMenuItem} from '../language-selector/language-selector-menu-item.react-component';
import menuStyles from '../list-menu.module.less';
import styles from './user-profile-dropdown.module.less';

interface UserProfileDropdownProps {
    className: string;
    useLangPrefixedUrls?: boolean;
}

export const UserProfileDropdown = observer(
    ({className, useLangPrefixedUrls = false}: UserProfileDropdownProps) => {
        const headerStore = useHeaderStore();
        const {gettext, locale} = useI18n();
        const {Config, me} = useUDData();

        const handleTryUFBClick = () => {
            if (headerStore.tryUFBPlacements) {
                Tracker.publishEvent(
                    new UFBNoticeClickEvent({
                        locale,
                        placement: headerStore.tryUFBPlacements?.profile,
                    }),
                );
            }
        };

        const renderSubscriptionBlock = () => {
            const {urls, userSpecificContext} = headerStore;

            if (userSpecificContext.isSubscriptionAware) {
                return (
                    <BlockList.Item color="neutral" href={urls.SUBSCRIPTION_MANAGEMENT}>
                        <div className={styles['subscription-menu-item']}>
                            {gettext('Subscriptions')}
                            {userSpecificContext.user.consumer_subscription_active && (
                                <Badge className={styles['badge-personal-plan']}>
                                    {gettext('Personal Plan')}
                                </Badge>
                            )}
                        </div>
                    </BlockList.Item>
                );
            }
            return null;
        };

        const renderUfbSection = () => {
            const {tryUFBPlacements} = headerStore;
            const {productLink} = headerStore.userSpecificContext;
            const hasOrganization = Config.brand.has_organization;
            return !hasOrganization ? (
                <a
                    className={styles['try-ufb-section']}
                    href={toBusinessUdemy('request-demo', {
                        ref: tryUFBPlacements?.profile ?? '',
                    })}
                    target={productLink.isOnsiteRequestDemo ? undefined : '_blank'}
                    rel={productLink.isOnsiteRequestDemo ? undefined : 'noopener noreferrer'}
                    onClick={handleTryUFBClick}
                >
                    <div>
                        <div className="ud-heading-md">{'Udemy Business'}</div>
                        <div className={`ud-text-sm ${styles['try-ufb-subtitle']}`}>
                            {gettext('Bring learning to your company')}
                        </div>
                    </div>
                    <OpenInNewIcon size="medium" label={false} />
                </a>
            ) : null;
        };

        const {urls} = headerStore;
        const {user, isInstructor} = headerStore.userSpecificContext;

        const userIsPro =
            me.is_authenticated &&
            me.organization?.is_pro_license_holder &&
            Config.features.organization.is_ub_pro_onboarding_v2_enabled;

        return (
            <HeaderDropdown
                trigger={
                    <HeaderButton
                        componentClass="a"
                        href={urls.EDIT_PROFILE}
                        udStyle="image"
                        aria-label={gettext('My profile')}
                        data-purpose="user-dropdown"
                    >
                        <Avatar
                            user={user}
                            alt="NONE"
                            size="small"
                            aria-hidden="true"
                            className={styles['dropdown-button-avatar']}
                        />
                        <ProfileBadge dot={true} className={headerStyles['dropdown-dot-badge']} />
                    </HeaderButton>
                }
                className={`${className} ${menuStyles['list-menu-container']}`}
            >
                <HeaderMenu>
                    <a
                        href={urls.EDIT_PROFILE}
                        className={userIsPro ? styles['pro-user-section'] : styles['user-section']}
                    >
                        <Avatar user={user} alt="NONE" className={styles['user-section-avatar']} />
                        <div className={styles['user-details']}>
                            <div>
                                <div className="ud-heading-md">{user.display_name}</div>
                                <div className={`ud-text-xs ${styles['email']}`}>{user.email}</div>
                                {userIsPro && (
                                    <div>
                                        <ProBadge />
                                    </div>
                                )}
                            </div>
                        </div>
                    </a>
                    <BlockList size="small" className={menuStyles['section']} iconAlignment="right">
                        <BlockList.Item color="neutral" href={urls.MY_LEARNING}>
                            {gettext('My learning')}
                        </BlockList.Item>
                        {Config.features.shopping_cart && (
                            <BlockList.Item color="neutral" href={urls.CART} icon={<CartBadge />}>
                                {gettext('My cart')}
                            </BlockList.Item>
                        )}
                        {Config.features.wishlist && (
                            <BlockList.Item color="neutral" href={urls.WISHLIST}>
                                {gettext('Wishlist')}
                            </BlockList.Item>
                        )}
                        {Config.brand.is_teaching_enabled && (
                            <BlockList.Item color="neutral" href={urls.TEACH}>
                                {isInstructor
                                    ? gettext('Instructor dashboard')
                                    : gettext('Teach on Udemy')}
                            </BlockList.Item>
                        )}
                    </BlockList>
                    {userIsPro && (
                        <BlockList
                            size="small"
                            className={menuStyles['section']}
                            iconAlignment="right"
                        >
                            {headerStore.ufbContext?.proFeaturesPopover}
                        </BlockList>
                    )}
                    <BlockList size="small" className={menuStyles['section']} iconAlignment="right">
                        {Config.features.notifications && (
                            <BlockList.Item
                                color="neutral"
                                href={urls.VIEW_NOTIFICATIONS}
                                icon={<UnreadActivityNotificationsBadge />}
                            >
                                {gettext('Notifications')}
                            </BlockList.Item>
                        )}
                        {Config.brand.is_messaging_enabled && (
                            <BlockList.Item
                                color="neutral"
                                href={urls.MESSAGES}
                                icon={<UnreadMessagesBadge />}
                            >
                                {gettext('Messages')}
                            </BlockList.Item>
                        )}
                    </BlockList>
                    <BlockList size="small" className={menuStyles['section']} iconAlignment="right">
                        <BlockList.Item color="neutral" href={urls.ACCOUNT}>
                            {gettext('Account settings')}
                        </BlockList.Item>
                        {!Config.brand.has_organization && (
                            <BlockList.Item color="neutral" href={urls.PAYMENT_METHODS}>
                                {gettext('Payment methods')}
                            </BlockList.Item>
                        )}

                        {renderSubscriptionBlock()}

                        {!Config.brand.has_organization && (
                            <BlockList.Item
                                color="neutral"
                                href={urls.CREDITS}
                                icon={<UnseenCreditsBadge />}
                            >
                                {gettext('Udemy credits')}
                            </BlockList.Item>
                        )}
                        {!Config.brand.has_organization && (
                            <BlockList.Item color="neutral" href={urls.PURCHASE_HISTORY}>
                                {gettext('Purchase history')}
                            </BlockList.Item>
                        )}
                    </BlockList>
                    <BlockList size="small" className={menuStyles['section']} iconAlignment="right">
                        <ModalLanguageSelector
                            uiRegion={LanguageSelectorLocation.DESKTOP_HEADER}
                            useLangPrefixedUrls={useLangPrefixedUrls}
                            trigger={<LanguageSelectorMenuItem className={menuStyles.item} />}
                        />
                    </BlockList>
                    <BlockList size="small" className={menuStyles['section']} iconAlignment="right">
                        {!!(
                            Config.brand.is_profile_functions_enabled &&
                            Config.brand.is_user_profiles_public &&
                            user.url
                        ) && (
                            <BlockList.Item
                                color="neutral"
                                href={user.url}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                            >
                                {gettext('Public profile')}
                            </BlockList.Item>
                        )}
                        <BlockList.Item color="neutral" href={urls.EDIT_PROFILE}>
                            {gettext('Edit profile')}
                        </BlockList.Item>
                    </BlockList>
                    <BlockList size="small" className={menuStyles['section']} iconAlignment="right">
                        <BlockList.Item
                            color="neutral"
                            href={urls.SUPPORT}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {gettext('Help')}
                        </BlockList.Item>
                        <BlockList.Item color="neutral" href={user.logout_url}>
                            {gettext('Log out')}
                        </BlockList.Item>
                    </BlockList>
                    {renderUfbSection()}
                </HeaderMenu>
            </HeaderDropdown>
        );
    },
);
