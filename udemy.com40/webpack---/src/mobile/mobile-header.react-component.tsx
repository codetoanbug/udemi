import Observer from '@researchgate/react-intersection-observer';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {LegacyRef, useEffect, useMemo, useRef, useState} from 'react';

import {useI18n} from '@udemy/i18n';
import CartIcon from '@udemy/icons/dist/cart.ud-icon';
import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import MenuIcon from '@udemy/icons/dist/menu.ud-icon';
import SearchIcon from '@udemy/icons/dist/search.ud-icon';
import {CheckedStateChangeEvent, CheckedStateCheckbox} from '@udemy/react-checked-state-components';
import {isChecked} from '@udemy/react-checked-state-components';
import {IconButton} from '@udemy/react-core-components';
import {FocusTrappingDialog} from '@udemy/react-dialog-components';
import {SearchFormAutocompleteStore, SearchFormAutocomplete} from '@udemy/search-form-autocomplete';
import {ShoppingClientStore} from '@udemy/shopping';
import {SmartBar, SmartBarSpacer} from '@udemy/smart-bar';
import {UDDataConfig, useUDData} from '@udemy/ud-data';

import {CartBadge} from '../badges.react-component';
import {HeaderContextProvider} from '../contexts/header-context';
import {loadCommonAppContext} from '../external/load-common-app-context';
import {HeaderStore, HeaderStoreProps} from '../header.mobx-store';
import {Logo} from '../logo.react-component';
import {UfbContext} from '../types/ufb-context';
import styles from './mobile-header.module.less';
import {MobileIAStudentNav} from './mobile-nav/mobile-ia-student-nav.react-component';
import {MobileNavStore} from './mobile-nav/mobile-nav.mobx-store';

export interface MobileHeaderProps {
    isInsideDesktopHeader?: boolean;
    persistentSearch?: boolean;
    searchPhrase?: string;
    showAutocompletePopularQueriesOnEmptyState?: string;
    ufbContext?: UfbContext;
    shoppingClient?: ShoppingClientStore;
    useLangPrefixedUrls?: boolean;
    mobileAppLink?: {
        url: string;
    };
}

export const MobileHeader = observer(
    ({
        searchPhrase = '',
        ufbContext,
        isInsideDesktopHeader = false,
        persistentSearch = false,
        showAutocompletePopularQueriesOnEmptyState = 'disabled',
        shoppingClient,
        useLangPrefixedUrls = false,
        mobileAppLink,
    }: MobileHeaderProps) => {
        const isUFB = !!ufbContext;
        const udData = useUDData();
        const udConfig = udData.Config;
        const {gettext, locale} = useI18n();
        const [mobileNavStore] = useState(() => new MobileNavStore());
        const [wasSearchPhraseInitialized, setWasSearchPhraseInitialized] = useState(false);
        const [headerStore] = useState(
            () => new HeaderStore({mobileAppLink, ufbContext, shoppingClient} as HeaderStoreProps),
        );
        const [searchFormAutocompleteStore] = useState(
            () =>
                new SearchFormAutocompleteStore({
                    url: headerStore.urls.SEARCH_SUGGESTIONS,
                    getFormParams: () =>
                        headerStore.formActionParams as unknown as Record<string, string>,
                    isPopularQueriesExperimentEnabled:
                        showAutocompletePopularQueriesOnEmptyState === 'enabled',
                    gettext,
                    inputValue: searchPhrase as string,
                }),
        );
        const ufbStores = useMemo(
            () => ufbContext?.createStores?.(headerStore),
            [headerStore, ufbContext],
        );

        const searchDialogRef = useRef<FocusTrappingDialog>();
        const searchInputRef = useRef<HTMLInputElement>();
        // TODO: do we need this?
        // const searchBarCheckboxRef = useRef<any>();
        const [floatingHeaderIsVisible, setFloatingHeaderIsVisible] = useState(false);

        useEffect(() => {
            (async () => {
                const response = await loadCommonAppContext(locale, isUFB);
                headerStore.setUserSpecificContext(response.data.header);

                searchFormAutocompleteStore.setSearchFormExperimentFeatures(
                    headerStore.userSpecificContext.searchFormExperimentFeatures,
                );

                mobileNavStore.loadNavigationCategories(response.data.header);
            })();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        function handleHeaderIntersection(entry: {intersectionRatio: number}) {
            const intersectionRatio = entry.intersectionRatio;

            // Display floating header if normal header is entirely out of view
            if (!floatingHeaderIsVisible && intersectionRatio === 0) {
                setFloatingHeaderIsVisible(true);
            }
        }

        function handleTopMarkIntersection(entry: {
            boundingClientRect: {top: number};
            intersectionRatio: number;
        }) {
            const {top} = entry.boundingClientRect;

            // However, only restore normal header if we are all the way back at the top of the page.
            if (floatingHeaderIsVisible && top >= 0) {
                setFloatingHeaderIsVisible(false);
            }
        }

        function findSearchBarNodeToFocusOn(): HTMLElement {
            return document.getElementById('header-mobile-search-bar') as HTMLElement;
        }

        function onChangeSearchBar(event: CheckedStateChangeEvent) {
            const isSearchBarStateChecked = isChecked(event);
            searchDialogRef.current?.onToggle(isSearchBarStateChecked);
            if (searchPhrase && !wasSearchPhraseInitialized && isSearchBarStateChecked) {
                // Initialize the search phrase the first time the search bar is opened.
                // We need to do this here, after the search bar receives focus,
                // so that the cursor is positioned at the end of the input value.
                searchFormAutocompleteStore.setInputValue(searchPhrase || '');
                setWasSearchPhraseInitialized(true);
            }
            if (isSearchBarStateChecked) {
                searchFormAutocompleteStore.openMenu();
            } else {
                searchFormAutocompleteStore.closeMenu();
            }
            searchInputRef.current?.focus();
        }

        function getSearchBarLabel() {
            if (isUFB && headerStore.userSpecificContext?.user?.enable_in_lecture_search_segments) {
                return gettext('What would you like to learn today?');
            } else {
                return gettext('Search for anything');
            }
        }

        function renderHeader(udConfig: UDDataConfig, floating: boolean) {
            return (
                <div
                    className={classNames('ud-header', styles.header, styles['with-shadow'], {
                        [styles.floating]: floating,
                    })}
                    data-testid="mobile-header"
                >
                    <div className={classNames(styles.row)}>
                        <IconButton
                            udStyle="ghost"
                            cssToggleId="header-toggle-side-nav"
                            className="ud-mobile-header-btn"
                            data-purpose="side-menu-opener"
                        >
                            <MenuIcon color="neutral" label={gettext('Open side drawer')} />
                        </IconButton>
                        {udConfig.features.shopping_cart && headerStore.showCartDropdown && (
                            <div className={classNames(styles['button-spacer'])} />
                        )}
                        <div className={classNames(styles.row, styles.middle)}>
                            <a href={headerStore.urls.BROWSE}>
                                <Logo
                                    ufbContext={ufbContext}
                                    width={75}
                                    height={28}
                                    style={{verticalAlign: 'middle'}}
                                />
                            </a>
                        </div>
                        <IconButton
                            udStyle="ghost"
                            cssToggleId="header-toggle-search-bar"
                            className="ud-mobile-header-btn"
                        >
                            {/* The ID here is used for the search-form-autocomplete.react-component
                                update with care */}
                            <SearchIcon
                                id="mobile-header-open-search-icon"
                                color="neutral"
                                label={gettext('Open search')}
                            />
                        </IconButton>
                        {udConfig.features.shopping_cart && headerStore.showCartDropdown && (
                            <IconButton
                                udStyle="ghost"
                                componentClass="a"
                                href={headerStore.urls.CART}
                                overlaychildren={
                                    <CartBadge className={classNames(styles['cart-badge'])} />
                                }
                                className="ud-mobile-header-btn"
                            >
                                <CartIcon color="neutral" label={gettext('Go to cart')} />
                            </IconButton>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <HeaderContextProvider
                headerStore={headerStore}
                mobileNavStore={mobileNavStore}
                {...ufbStores}
                ufbContext={ufbContext}
            >
                <>
                    <CheckedStateCheckbox
                        id="header-toggle-search-bar"
                        className="ud-full-page-overlay-checkbox"
                        onChange={onChangeSearchBar}
                        closeOnEscape={true}
                    />
                    {!isInsideDesktopHeader && headerStore.userSpecificContext.user && (
                        <SmartBar
                            isPersonalPlanSubscriber={headerStore.isPersonalPlanSubscriber}
                            isUdemyBusinessSubscriber={Object.keys(ufbContext ?? {}).length > 0}
                        />
                    )}
                    {!isInsideDesktopHeader && headerStore.userSpecificContext.user && (
                        <SmartBarSpacer disableHideButtonWhenVisible={true} />
                    )}
                    <Observer onChange={handleTopMarkIntersection}>
                        <span className={classNames(styles.mark)} />
                    </Observer>
                    <Observer onChange={handleHeaderIntersection}>
                        {renderHeader(udConfig, false)}
                    </Observer>
                    {floatingHeaderIsVisible && persistentSearch && renderHeader(udConfig, true)}
                    <FocusTrappingDialog
                        ref={searchDialogRef as LegacyRef<FocusTrappingDialog>}
                        labelledById="header-mobile-search-bar-title"
                        findNodeToFocusOn={findSearchBarNodeToFocusOn}
                        className={classNames(styles['search-bar'], styles['search-bar-layer'])}
                    >
                        <IconButton
                            udStyle="ghost"
                            cssToggleId="header-toggle-search-bar"
                            className={classNames(
                                'ud-mobile-header-btn',
                                styles['search-bar-close'],
                            )}
                        >
                            <CloseIcon color="neutral" label={gettext('Close search')} />
                        </IconButton>
                        <span className="ud-sr-only">{gettext('Search bar')}</span>
                        <SearchFormAutocomplete
                            searchFormAutocompleteStore={searchFormAutocompleteStore}
                            id="header-mobile-search-bar"
                            formAction={headerStore.urls.SEARCH}
                            formActionParams={
                                headerStore.formActionParams as unknown as Record<string, string>
                            }
                            label={getSearchBarLabel()}
                            inputProps={{
                                className: 'js-header-search-field',
                                name: 'q',
                                /* ref: searchInputRef, */
                            }}
                            reversed={true}
                            className={classNames(styles['search-bar-form'])}
                            showResultsWithImage={
                                !udConfig.brand.has_organization &&
                                !headerStore.isPersonalPlanSubscriber
                            }
                        />
                    </FocusTrappingDialog>
                    <MobileIAStudentNav useLangPrefixedUrls={useLangPrefixedUrls} />
                </>
            </HeaderContextProvider>
        );
    },
);
