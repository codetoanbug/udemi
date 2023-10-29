import {observer} from 'mobx-react';
import React, {useRef, useState} from 'react';

import {UFBNoticeClickEvent, UFBNoticeImpressionEvent} from '@udemy/browse-event-tracking';
import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import {LanguageSelectorButton, LanguageSeoLinks} from '@udemy/language-selector';
import {ProBadge} from '@udemy/learning-path';
import {toBusinessUdemy} from '@udemy/organization';
import {range} from '@udemy/shared-utils';
import {UDEMY_PRO_PLACEHOLDER_URL} from '@udemy/subscription-browse';
import {AuthenticatedUser, udLink, useUDData} from '@udemy/ud-data';

import {ProfileBadge} from '../../badges.react-component';
import {BROWSE_LEARNING_TYPES, BADGING_NAV, BROWSE_LEARNING_TYPE} from '../../browse-constants';
import {LanguageSelectorLocation} from '../../constants';
import {
    CategoryNavItemSelectEvent,
    LearningTypeNavItemSelectEvent,
    BadgeNavItemSelectEvent,
    BadgeNavItemType,
    LearningTypeNavItemType,
} from '../../events';
import {MOST_POPULAR_SUBCATEGORY_IDS} from '../../fetch-popular-topics';
import {useHeaderStore} from '../../hooks/use-header-store';
import {useMobileNavStore} from '../../hooks/use-mobile-nav-store';
import {useUfbContext} from '../../hooks/use-ufb-context';
import {BrowseNavCategory, BrowseNavItem} from '../../types/browse-nav-item';
import {LanguageSelectorOverlay} from './language-selector/language-selector-overlay.react-component';
import {MobileCategoryNav} from './level-one/mobile-category-nav.react-component';
import {MobilePopularTopicNavs} from './level-one/mobile-popular-topic-navs.react-component';
import {MobileStudentProfileNav} from './level-one/mobile-student-profile-nav.react-component';
import {MobileSubcategoryNav} from './level-two/mobile-subcategory-nav.react-component';
import styles from './mobile-nav.module.less';
import {
    MobileNavSection,
    MobileNavItem,
    MobileNavSectionHeading,
    MobileNav,
    MobileNavWelcomeSection,
} from './mobile-nav.react-component';

interface MobileIAStudentNavProps {
    useLangPrefixedUrls?: boolean;
}

export const MobileIAStudentNav = observer(({useLangPrefixedUrls}: MobileIAStudentNavProps) => {
    const {gettext, locale} = useI18n();
    const headerStore = useHeaderStore();
    const mobileNavStore = useMobileNavStore();
    const ufbContext = useUfbContext();
    const udData = useUDData();

    const udMe = udData.me;

    const sideDrawerRef = useRef<HTMLElement>(null);

    const [isLanguageSelectorOpen, setLanguageSelectorOpen] = useState(false);

    function handleLanguageSelectorButtonClick() {
        setLanguageSelectorOpen(true);
        sideDrawerRef.current?.scrollTo(0, 0);
    }

    function handleBrowseLearningItemClick(item: BrowseNavItem) {
        Tracker.publishEvent(
            new LearningTypeNavItemSelectEvent(item.type as LearningTypeNavItemType),
        );
    }

    function handleBadgeNavItemClick(item: BrowseNavItem) {
        Tracker.publishEvent(new BadgeNavItemSelectEvent(item.type as BadgeNavItemType));
    }

    function handleSubcategoryNavClick(item: BrowseNavCategory) {
        const context = {
            categoryId: item.parentId as number,
            subcategoryId: item.id,
            topicId: null,
        };
        Tracker.publishEvent(new CategoryNavItemSelectEvent({context}));
    }

    function onToggle() {
        setLanguageSelectorOpen(false);
        mobileNavStore.ensureLevelIsLoaded(1);
        mobileNavStore.loadMostPopularTopicsForSubcategories(locale);
    }

    function loggedOutSection() {
        const {user} = headerStore.userSpecificContext;
        if (!user || user.id) {
            return null;
        }

        return (
            <MobileNavSection>
                <MobileNavItem
                    href={udLink.toAuth({showLogin: true, responseType: 'html'})}
                    color="link"
                >
                    {gettext('Log in')}
                </MobileNavItem>
                <MobileNavItem
                    href={udLink.toAuth({
                        ...headerStore.signupParams,
                        responseType: 'html',
                    })}
                    color="link"
                    data-purpose="header-signup-mobile-nav"
                >
                    {gettext('Sign up')}
                </MobileNavItem>
            </MobileNavSection>
        );
    }

    function iaSwitchSection() {
        const {isInstructor, user} = headerStore.userSpecificContext;
        if (!user || !user.id || !isInstructor) {
            return null;
        }

        return (
            <MobileNavSection>
                <MobileNavItem href={headerStore.urls.TEACH} color="link">
                    {gettext('Switch to instructor view')}
                </MobileNavItem>
            </MobileNavSection>
        );
    }

    function learnSection() {
        const {user} = headerStore.userSpecificContext;
        if (!user || !user.id) {
            return null;
        }

        return (
            <>
                <MobileNavSectionHeading>{gettext('Learn')}</MobileNavSectionHeading>
                <MobileNavSection>
                    <MobileNavItem href={headerStore.urls.MY_LEARNING}>
                        {gettext('My learning')}
                    </MobileNavItem>
                    {user.sms_subscriptions_active && (
                        <MobileNavItem href={UDEMY_PRO_PLACEHOLDER_URL} color="link">
                            {gettext('All programs')}
                        </MobileNavItem>
                    )}
                    {headerStore.enableCartOnMobileNav &&
                        headerStore.notificationBadgeContext.cartBuyables > 0 && (
                            <MobileNavItem href={headerStore.urls.CART}>
                                {gettext('My cart')}
                            </MobileNavItem>
                        )}
                </MobileNavSection>
            </>
        );
    }

    function showPersonalPlanNav() {
        const {user} = headerStore.userSpecificContext;
        return user?.consumer_subscription_active;
    }

    function showUBProNav() {
        const udConfig = udData.Config;
        return (
            udConfig.brand.has_organization &&
            (udConfig.features.organization.learning_path.pro_path ||
                (udMe as AuthenticatedUser)?.organization?.is_pro_license_holder)
        );
    }

    function showBadgingNavChangesForPPUB() {
        const {user} = headerStore.userSpecificContext;
        return user?.show_updated_pp_and_ub_navigation;
    }

    function showBadgingNavChangesForMX() {
        const {user} = headerStore.userSpecificContext;
        return user?.show_updated_mx_navigation;
    }

    function renderLearningTypeNavItem(item: BROWSE_LEARNING_TYPE) {
        return (
            <MobileNavItem
                data-purpose={`link-${item.type}`}
                onClick={() => handleBrowseLearningItemClick(item)}
                href={item.absolute_url}
            >
                {item.title}
            </MobileNavItem>
        );
    }

    function learningTypesSectionTitle() {
        if (showPersonalPlanNav() && showBadgingNavChangesForPPUB())
            return gettext('Explore active learning ');
        else if (showUBProNav() && showBadgingNavChangesForPPUB()) return gettext('Explore Pro');
        return gettext('Explore by type');
    }

    function learningTypesSection() {
        const {user} = headerStore.userSpecificContext;
        return (
            <>
                <MobileNavSectionHeading data-purpose="section-active-learning">
                    <div className={styles['learning-types-section']}>
                        {learningTypesSectionTitle()}
                        {showUBProNav() && <ProBadge />}
                    </div>
                </MobileNavSectionHeading>
                <MobileNavSection>
                    {(user?.enableLabsInPersonalPlan || showUBProNav()) &&
                        renderLearningTypeNavItem(BROWSE_LEARNING_TYPES(gettext).LABS)}
                    {renderLearningTypeNavItem(BROWSE_LEARNING_TYPES(gettext).ASSESSMENTS)}
                    {showUBProNav() &&
                        showBadgingNavChangesForPPUB() &&
                        renderLearningTypeNavItem(BROWSE_LEARNING_TYPES(gettext).UDEMY_PRO_PATHS)}
                </MobileNavSection>
            </>
        );
    }

    function badgesSection() {
        // Hide Badges section for UB China
        const {brand} = udData.Config;
        if (brand.organization && brand.organization?.is_enterprise_china) {
            return null;
        }

        return (
            <>
                <MobileNavSectionHeading data-purpose="section-badges">
                    {gettext('Explore badges')}
                </MobileNavSectionHeading>
                <MobileNavSection>
                    <MobileNavItem
                        data-purpose="certifications-link"
                        onClick={() => handleBadgeNavItemClick(BADGING_NAV(gettext).CERTIFICATIONS)}
                        href={BADGING_NAV(gettext).CERTIFICATIONS.absolute_url}
                    >
                        {BADGING_NAV(gettext).CERTIFICATIONS.title}
                    </MobileNavItem>
                </MobileNavSection>
            </>
        );
    }

    function mostPopularSection() {
        return (
            <>
                <MobileNavSectionHeading>
                    {showPersonalPlanNav() || showBadgingNavChangesForMX()
                        ? gettext('Explore by category')
                        : gettext('Most popular')}
                </MobileNavSectionHeading>
                <MobileNavSection>
                    {mobileNavStore.mostPopularSubcategories
                        ? mobileNavStore.mostPopularSubcategories.map((s) => (
                              <MobileNavItem
                                  onClick={() => handleSubcategoryNavClick(s)}
                                  key={`most-popular-subcategory-item-${s.id}`}
                                  cssToggleId={`header-toggle-side-nav-popular-topics-of-${s.id}`}
                                  data-purpose="most-popular-subcategory-item"
                              >
                                  {s.title}
                              </MobileNavItem>
                          ))
                        : range(MOST_POPULAR_SUBCATEGORY_IDS.length).map((i) => (
                              <MobileNavItem key={`most-popular-id-${i}`} loading={true} />
                          ))}
                    {mobileNavStore.navigationCategories ? (
                        <MobileNavItem cssToggleId="header-toggle-side-nav-categories">
                            {gettext('All categories')}
                        </MobileNavItem>
                    ) : (
                        <MobileNavItem loading={true} />
                    )}
                </MobileNavSection>
            </>
        );
    }

    const ubHookPlacement = 'ufb_header_mobile';

    function trackUFBNoticeImpressionEvent() {
        Tracker.publishEvent(
            new UFBNoticeImpressionEvent({
                locale,
                placement: ubHookPlacement,
                url: '/udemy-business/request-demo-mx/',
            }),
        );
    }

    function handleTryUFBClick() {
        Tracker.publishEvent(
            new UFBNoticeClickEvent({
                locale,
                placement: ubHookPlacement,
                url: '/udemy-business/request-demo-mx/',
            }),
        );
    }

    function moreFromUdemySection() {
        const udConfig = udData.Config;
        const {mobileAppLink, urls} = headerStore;
        const hasOrganization = udConfig.brand.has_organization;
        return (
            <>
                <MobileNavSectionHeading>{gettext('More from Udemy')}</MobileNavSectionHeading>
                <MobileNavSection>
                    {!hasOrganization && (
                        <MobileNavItem
                            href={toBusinessUdemy('request-demo', {ref: ubHookPlacement})}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-purpose="try-ufb-link"
                            onClick={handleTryUFBClick}
                        >
                            <TrackImpression trackFunc={trackUFBNoticeImpressionEvent}>
                                <div>{gettext('Udemy Business')}</div>
                            </TrackImpression>
                        </MobileNavItem>
                    )}
                    <MobileNavItem
                        href={mobileAppLink?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {gettext('Get the app')}
                    </MobileNavItem>
                    {!hasOrganization && (
                        <MobileNavItem href={urls.INVITE}>
                            {gettext('Invite friends')}
                        </MobileNavItem>
                    )}
                    <MobileNavItem href={urls.SUPPORT} target="_blank" rel="noopener noreferrer">
                        {gettext('Help')}
                    </MobileNavItem>
                </MobileNavSection>
            </>
        );
    }

    function subNavs() {
        return (
            <>
                <div>
                    {mobileNavStore.isLevelLoaded(2) &&
                        mobileNavStore.navigationCategories?.map((category) => (
                            <MobileSubcategoryNav
                                key={`mobile-subcategory-nav-${category.id}`}
                                parentCategory={category}
                                subcategories={category.children as BrowseNavCategory[]}
                            />
                        ))}
                    {mobileNavStore.isLevelLoaded(1) && <MobileCategoryNav />}
                </div>
                {mobileNavStore.isLevelLoaded(1) && <MobilePopularTopicNavs />}
                {mobileNavStore.isLevelLoaded(1) && <MobileStudentProfileNav />}
            </>
        );
    }

    const {user} = headerStore.userSpecificContext;

    return (
        <MobileNav
            ref={sideDrawerRef}
            onToggle={onToggle}
            subDrawers={ufbContext?.subNavs ?? subNavs()}
        >
            {isLanguageSelectorOpen ? (
                <LanguageSelectorOverlay useLangPrefixedUrls={useLangPrefixedUrls} />
            ) : (
                <>
                    {loggedOutSection()}
                    <MobileNavWelcomeSection
                        cssToggleId="header-toggle-side-nav-student-profile"
                        badge={<ProfileBadge dot={true} className={styles['profile-badge']} />}
                    />
                    {ufbContext?.manageAndTeachSection ?? iaSwitchSection()}
                    {learnSection()}
                    {(showBadgingNavChangesForPPUB() || showBadgingNavChangesForMX()) &&
                        badgesSection()}
                    {(showPersonalPlanNav() ||
                        (showUBProNav() && showBadgingNavChangesForPPUB())) &&
                        learningTypesSection()}
                    {ufbContext?.browseSection ?? mostPopularSection()}
                    {moreFromUdemySection()}
                    <div className={styles['nav-item']} data-testid="language-selector">
                        <LanguageSelectorButton
                            publishEvents={{uiRegion: LanguageSelectorLocation.MOBILE_NAV}}
                            onClick={handleLanguageSelectorButtonClick}
                        />
                        {/* Make sure this is rendered client-side since it needs to access location.pathname */}
                        {user && <LanguageSeoLinks />}
                    </div>
                </>
            )}
        </MobileNav>
    );
});
