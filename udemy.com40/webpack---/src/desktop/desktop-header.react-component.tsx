import Observer from '@researchgate/react-intersection-observer';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import {
    ActivityNotificationsStore,
    setGlobalActivityNotificationsStore,
} from '@udemy/activity-notifications';
import {useMatchMedia} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import LanguageIcon from '@udemy/icons/dist/language.ud-icon';
import {LabsLearningBanner} from '@udemy/labs';
import {LanguageSeoLinks, ModalLanguageSelector} from '@udemy/language-selector';
import {IconButton} from '@udemy/react-core-components';
import {SkipToContentButton} from '@udemy/react-navigation-components';
import {SearchFormAutocomplete, SearchFormAutocompleteStore} from '@udemy/search-form-autocomplete';
import {ShoppingClientStore} from '@udemy/shopping';
import {SmartBar, SmartBarSpacer} from '@udemy/smart-bar';
import {tokens} from '@udemy/styles';
import {useUDData} from '@udemy/ud-data';

import {LanguageSelectorLocation} from '../constants';
import {HeaderContextProvider} from '../contexts/header-context';
import {CommonAppContext, loadCommonAppContext} from '../external/load-common-app-context';
import {HeaderStore, HeaderData} from '../header.mobx-store';
import {Logo} from '../logo.react-component';
import {BrowseNavDropdown} from './browse/browse-nav-dropdown.react-component';
import {BrowseNavStore} from './browse/browse-nav.mobx-store';
import styles from './desktop-header.module.less';
import {HeaderAuthButton} from './header-auth-button.react-component';
import {InstructorDropdown} from './instructor/instructor-dropdown.react-component';
import {MyLearningDropdown} from './my-learning/my-learning-dropdown.react-component';
import {MyLearningStore} from './my-learning/my-learning.mobx-store';
import {NotificationDropdown} from './notification/notification-dropdown.react-component';
import {CartDropdown} from './shopping/cart-dropdown.react-component';
import {WishlistDropdown} from './shopping/wishlist-dropdown.react-component';
import {TryUFBDropdown} from './try-ufb/try-ufb-dropdown.react-component';
import {UserProfileDropdown} from './user-profile/user-profile-dropdown.react-component';

export interface DesktopHeaderProps extends Omit<HeaderData, 'shoppingClient'> {
    persistentSearch?: boolean;
    searchPhrase?: string;
    showAutocompletePopularQueriesOnEmptyState?: string;
    shoppingClient?: ShoppingClientStore;
    useLangPrefixedUrls?: boolean;
    _mockStores?: {
        headerStore?: HeaderStore;
        activityNotificationsStore?: ActivityNotificationsStore;
    };
}

export const DesktopHeader = observer(
    ({
        searchPhrase,
        persistentSearch,
        showAutocompletePopularQueriesOnEmptyState = 'disabled',
        shoppingClient,
        useLangPrefixedUrls = false,
        _mockStores,
        ...headerData
    }: DesktopHeaderProps) => {
        const isUFB = !!headerData.ufbContext;
        const i18n = useI18n();
        const locale = i18n.locale;
        const udData = useUDData();
        const [headerStore] = React.useState(
            () => _mockStores?.headerStore ?? new HeaderStore({...headerData, shoppingClient}),
        );
        const [browseNavStore] = React.useState(
            () =>
                new BrowseNavStore(
                    i18n.gettext,
                    i18n.locale,
                    udData.request.navigation_locale,
                    isUFB,
                ),
        );
        const [searchFormAutocompleteStore] = React.useState(() => {
            const store = new SearchFormAutocompleteStore({
                url: headerStore.urls.SEARCH_SUGGESTIONS,
                getFormParams: () => headerStore.formActionParams,
                isPopularQueriesExperimentEnabled:
                    showAutocompletePopularQueriesOnEmptyState === 'enabled',
                gettext: i18n.gettext,
            });
            store.setInputValue(searchPhrase ?? '');
            return store;
        });
        const [myLearningStore] = React.useState(() => new MyLearningStore(headerStore));
        const [activityNotificationsStore] = React.useState(() => {
            const store =
                _mockStores?.activityNotificationsStore ?? new ActivityNotificationsStore(i18n);
            setGlobalActivityNotificationsStore(store);
            return store;
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [MobileHeader, setMobileHeader] = React.useState<React.ComponentType<any> | null>(
            null,
        );
        const [floatingHeaderIsVisible, setFloatingHeaderIsVisible] = React.useState(false);
        const isMobile =
            useMatchMedia(`(max-width: ${tokens['breakpoint-header-mobile-max']})`) ?? false;

        React.useEffect(() => {
            const isUFB = !!headerData.ufbContext;
            loadCommonAppContext(locale, isUFB, (response: CommonAppContext) => {
                // TODO: rewire how `navigationCategories is resolved from `loadCommonAppContext()` response
                headerStore.setUserSpecificContext(response.data.header);
                activityNotificationsStore.setUserSpecificContext({
                    user: headerStore.userSpecificContext.user,
                    // If `nav_user_type = 'instructor'`, InstructorHeader is rendered.
                    userType: null,
                });

                searchFormAutocompleteStore.setSearchFormExperimentFeatures(
                    headerStore.userSpecificContext.searchFormExperimentFeatures,
                );
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        React.useEffect(() => {
            if (isMobile) {
                import('../mobile/mobile-header.react-component').then((headerModule) =>
                    setMobileHeader(headerModule.MobileHeader),
                );
            }
        }, [isMobile]);

        function getSearchBarLabel() {
            if (isUFB && headerStore.userSpecificContext?.user?.enable_in_lecture_search_segments) {
                return i18n.gettext('What would you like to learn today?');
            } else {
                return i18n.gettext('Search for anything');
            }
        }

        function handleHeaderIntersection(entry: IntersectionObserverEntry) {
            const intersectionRatio = entry.intersectionRatio;

            // If the header fully exits view, show the floating header.
            if (!floatingHeaderIsVisible && intersectionRatio === 0) {
                setFloatingHeaderIsVisible(true);
            }
        }

        function handleTopMarkIntersection(entry: IntersectionObserverEntry) {
            const {top} = entry.boundingClientRect;

            // However, only restore the non-floating header if we scroll back up to the top of the page.
            if (floatingHeaderIsVisible && top >= 0) {
                setFloatingHeaderIsVisible(false);
            }
        }

        function renderLoggedInPart() {
            const {organizationState} = headerStore.userSpecificContext;
            const myLearningGroup = organizationState?.should_show_manage_menu ? 'group-b' : '';
            return (
                <>
                    {!headerStore.isPersonalPlanSubscriber && (
                        <TryUFBDropdown
                            className={classNames(styles['gap-button'], styles['group-a'])}
                        />
                    )}
                    {headerData.ufbContext?.packageAlert}
                    {udData.Config.brand.is_teaching_enabled &&
                        headerStore.showInstructorDropdown && (
                            <InstructorDropdown
                                className={classNames(styles['gap-button'], styles['group-b'])}
                            />
                        )}
                    {headerData.ufbContext?.manageDropdown}
                    <MyLearningDropdown
                        className={classNames(styles['gap-button'], styles[myLearningGroup])}
                    />
                    {!headerStore.isPersonalPlanSubscriber && udData.Config.features.wishlist && (
                        <WishlistDropdown className={styles['group-c']} />
                    )}
                    {udData.Config.features.shopping_cart && headerStore.showCartDropdown && (
                        <CartDropdown className="" />
                    )}
                    {udData.Config.features.notifications && (
                        <NotificationDropdown className={styles['group-c']} />
                    )}
                    <UserProfileDropdown className="" useLangPrefixedUrls={useLangPrefixedUrls} />
                </>
            );
        }

        function renderLoggedOutPart() {
            return (
                <>
                    <TryUFBDropdown
                        className={classNames(styles['gap-button'], styles['group-a'])}
                    />
                    {udData.Config.brand.is_teaching_enabled && (
                        <InstructorDropdown
                            className={classNames(styles['gap-button'], styles['group-b'])}
                        />
                    )}
                    {udData.Config.features.shopping_cart && headerStore.showCartDropdown && (
                        <CartDropdown className="" />
                    )}
                    <div className={styles['gap-auth-button']}>
                        <HeaderAuthButton
                            udStyle="secondary"
                            authParams={{showLogin: true}}
                            data-purpose="header-login"
                        >
                            {i18n.gettext('Log in')}
                        </HeaderAuthButton>
                    </div>
                    <div className={styles['gap-auth-button']}>
                        <HeaderAuthButton
                            data-purpose="header-signup"
                            authParams={headerStore.signupParams}
                        >
                            {i18n.gettext('Sign up')}
                        </HeaderAuthButton>
                    </div>
                    <div className={styles['gap-auth-button']}>
                        <ModalLanguageSelector
                            uiRegion={LanguageSelectorLocation.DESKTOP_HEADER}
                            useLangPrefixedUrls={useLangPrefixedUrls}
                            trigger={
                                <IconButton udStyle="secondary" size="medium">
                                    <LanguageIcon
                                        color="neutral"
                                        label={i18n.gettext('Choose a language')}
                                    />
                                </IconButton>
                            }
                        />
                        <LanguageSeoLinks />
                    </div>
                </>
            );
        }

        function renderUserSpecificPart() {
            const {user} = headerStore.userSpecificContext;
            if (!user) {
                return <div style={{flex: 1}} />;
            }
            if (!user.id) {
                return renderLoggedOutPart();
            }

            return renderLoggedInPart();
        }

        function renderHeaderBar(floating: boolean) {
            return (
                <div
                    className={classNames(
                        'ud-header',
                        'ud-text-sm',
                        styles.header,
                        styles['flex-middle'],
                        {
                            [styles.floating]: floating,
                        },
                    )}
                    data-purpose="header"
                >
                    {!floating && (
                        <SkipToContentButton
                            goToContentSelector=".ud-main-content"
                            label={i18n.gettext('Skip to content')}
                        />
                    )}
                    <a
                        href={headerStore.urls.BROWSE}
                        className={classNames(styles['flex-middle'], styles.logo)}
                    >
                        <Logo ufbContext={headerData.ufbContext} width={91} height={34} />
                    </a>
                    {headerData.ufbContext?.browseButtons ?? (
                        <BrowseNavDropdown className={styles['gap-button']} />
                    )}
                    <SearchFormAutocomplete
                        searchFormAutocompleteStore={searchFormAutocompleteStore}
                        formAction={headerStore.urls.SEARCH}
                        formActionParams={headerStore.formActionParams}
                        label={getSearchBarLabel()}
                        inputProps={{className: 'js-header-search-field', name: 'q'}}
                        reversed={true}
                        textSize="small"
                        className={styles['search-bar']}
                        showResultsWithImage={
                            !udData.Config.brand.has_organization &&
                            !headerStore.isPersonalPlanSubscriber
                        }
                    />
                    {renderUserSpecificPart()}
                </div>
            );
        }

        const headerProviderContext = {
            headerStore: headerStore,
            browseNavStore: browseNavStore,
            myLearningStore: myLearningStore,
            activityNotificationsStore: activityNotificationsStore,
            ufbContext: headerData.ufbContext,
        };

        return (
            <HeaderContextProvider {...headerProviderContext}>
                {headerStore.userSpecificContext.user && (
                    <SmartBar
                        isPersonalPlanSubscriber={headerStore.isPersonalPlanSubscriber}
                        isUdemyBusinessSubscriber={
                            Object.keys(headerData.ufbContext ?? {}).length > 0
                        }
                    />
                )}
                {headerStore.userSpecificContext.user && (
                    <SmartBarSpacer disableHideButtonWhenVisible={true} />
                )}
                {headerStore.userSpecificContext.user?.id && (!MobileHeader || !isMobile) && (
                    <LabsLearningBanner />
                )}
                <div className={styles['mobile-header']}>
                    {MobileHeader ? (
                        React.createElement(MobileHeader, {
                            ...headerData,
                            ufbContext: headerData.ufbContext?.mobileContext,
                            isInsideDesktopHeader: true,
                            useLangPrefixedUrls,
                        })
                    ) : (
                        <div
                            data-testid="mobile-header-placeholder"
                            className={styles['mobile-header-placeholder']}
                        />
                    )}
                </div>
                <Observer onChange={handleTopMarkIntersection}>
                    <span className={styles.mark} />
                </Observer>
                <Observer onChange={handleHeaderIntersection}>{renderHeaderBar(false)}</Observer>
                {floatingHeaderIsVisible && persistentSearch && renderHeaderBar(true)}
            </HeaderContextProvider>
        );
    },
);
