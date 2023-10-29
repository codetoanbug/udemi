/* eslint-disable react/jsx-no-target-blank */
import {observer} from 'mobx-react';
import React from 'react';

import {UFBNoticeClickEvent} from '@udemy/browse-event-tracking';
import {Tracker} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import OpenInNewIcon from '@udemy/icons/dist/open-in-new.ud-icon';
import {toBusinessUdemy} from '@udemy/organization';
import {Avatar, BlockList} from '@udemy/react-core-components';
import {useUDData} from '@udemy/ud-data';

import {ProfileBadge, UnreadActivityNotificationsBadge} from '../../badges.react-component';
import {useHeaderStore} from '../../hooks/use-header-store';
import headerStyles from '../desktop-header.module.less';
import {HeaderButton, HeaderDropdown, HeaderMenu} from '../header-dropdown.react-component';
import menuStyles from '../list-menu.module.less';
import styles from './user-profile-dropdown.module.less';

interface InstructorProfileDropdownProps {
    className?: string;
}

export const InstructorProfileDropdown = observer(({className}: InstructorProfileDropdownProps) => {
    const headerStore = useHeaderStore();
    const {gettext, locale} = useI18n();
    const {Config} = useUDData();

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

    const renderUfbSection = () => {
        const {tryUFBPlacements} = headerStore;
        const {productLink} = headerStore.userSpecificContext;
        const hasOrganization = Config.brand.has_organization;
        return !hasOrganization && productLink ? (
            <a
                className={styles['try-ufb-section']}
                href={toBusinessUdemy('request-demo', {
                    ref: tryUFBPlacements?.profile ?? '',
                })}
                target={productLink.isOnsiteRequestDemo ? undefined : '_blank'}
                rel={productLink.isOnsiteRequestDemo ? undefined : 'noopener'}
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

    const {instructorURLs} = headerStore;
    const {user} = headerStore.userSpecificContext;

    return (
        <HeaderDropdown
            trigger={
                <HeaderButton
                    componentClass="a"
                    href={instructorURLs.EDIT_PROFILE}
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
                <a href={instructorURLs.EDIT_PROFILE} className={styles['user-section']}>
                    <Avatar user={user} alt="NONE" />
                    <div className={styles['user-details']}>
                        <div>
                            <div className="ud-heading-md">{user.display_name}</div>
                            <div className={`ud-text-xs ${styles['email']}`}>{user.email}</div>
                        </div>
                    </div>
                </a>
                <BlockList size="small" className={menuStyles['section']} iconAlignment="right">
                    {Config.brand.is_teaching_enabled && (
                        <BlockList.Item color="neutral" href={instructorURLs.BROWSE}>
                            {Config.brand.has_organization
                                ? gettext('Learner')
                                : gettext('Student')}
                        </BlockList.Item>
                    )}
                </BlockList>
                <BlockList size="small" className={menuStyles['section']} iconAlignment="right">
                    {Config.features.notifications && (
                        <BlockList.Item
                            color="neutral"
                            href={instructorURLs.VIEW_NOTIFICATIONS}
                            icon={<UnreadActivityNotificationsBadge />}
                        >
                            {gettext('Notifications')}
                        </BlockList.Item>
                    )}
                </BlockList>
                <BlockList size="small" className={menuStyles['section']} iconAlignment="right">
                    <BlockList.Item color="neutral" href={instructorURLs.ACCOUNT}>
                        {gettext('Account settings')}
                    </BlockList.Item>
                    {headerStore.isPayoutSettingsEnabled && (
                        <BlockList.Item color="neutral" href={instructorURLs.PAYOUT_SETTINGS}>
                            {gettext('Payout & tax settings')}
                        </BlockList.Item>
                    )}
                    {headerStore.isRevenueReportEnabled && (
                        <BlockList.Item color="neutral" href={instructorURLs.REVENUE_REPORT}>
                            {gettext('Revenue report')}
                        </BlockList.Item>
                    )}
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
                    <BlockList.Item color="neutral" href={instructorURLs.EDIT_PROFILE}>
                        {gettext('Edit profile')}
                    </BlockList.Item>
                </BlockList>
                <BlockList size="small" className={menuStyles['section']} iconAlignment="right">
                    <BlockList.Item
                        color="neutral"
                        href={instructorURLs.SUPPORT}
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
});
