// Load app global styles first to avoid CSS precedence issues
import '../less/_app.global.less';

import 'src/lib/polyfills';
import 'src/lib-server/django-shims';
import {QueryClient, QueryClientProvider, Hydrate} from '@tanstack/react-query';
import {useStaticRendering} from 'mobx-react-lite';
import NextApp, {AppContext} from 'next/app';
import {useEffect, useState} from 'react';

import {CoursePriceStore} from '@udemy/browse-course';
import {detectKeyboardNavigation} from '@udemy/design-system-utils';
import {I18nProvider, useI18n} from '@udemy/i18n';
import {ShoppingClient} from '@udemy/shopping';
import {StoreProvider} from '@udemy/store-provider';
import {udApi} from '@udemy/ud-api';
import {UDDataProvider, useUDData, useUDLink} from '@udemy/ud-data';

import {i18nPathToBundleMap} from 'next.config.i18n';
import {BindI18nGlobals} from 'src/components/bind-i18n-globals/bind-i18n-globals';
import {RootStoreProvider} from 'src/contexts/root-store-context';
import {useDevice} from 'src/hooks/useDevice';
import {AppWithLayoutProps} from 'src/layouts/types';
import {fetchHeaderAndFooterProps} from 'src/lib/fetch-header-and-footer-props';
import {
    addUDDataToGlobalState,
    fetchClientUDGlobalContext,
    getUdDataServerProps,
} from 'src/lib/ud-global-context';
import {RootStore} from 'src/stores/root-store';
import legacyDynamicImports from 'udemy-django-static/js/loaders/dynamic-imports';

// Requests are proxied through Next app, so use relative URL for API calls
const DEPLOY_ENV = process.env.DEPLOY_ENV;
if (DEPLOY_ENV === 'local' || DEPLOY_ENV === 'dev') {
    udApi.configure({
        getBaseUrl: () => `${process.env.APP_BASE_PATH}api-2.0`,
    });
}

// TODO: rehyrdate from pageProps instead
const queryClient = new QueryClient();

/**
 * Prevent observable components to re-render on the server. Other wise this causes a memory leak since lots of mobx
 * references being created on the server and never disposed.
 * @see https://github.com/mobxjs/mobx/tree/main/packages/mobx-react-lite#enablestaticrenderingenable-true
 */
// eslint-disable-next-line react-hooks/rules-of-hooks
useStaticRendering(typeof window === 'undefined');

const I18nAccessBootstrapper = () => {
    const i18n = useI18n();
    const udData = useUDData();
    const udLink = useUDLink();

    useEffect(() => {
        if (!udData.isGlobalMeContextLoading) {
            ShoppingClient.initialize({
                i18n,
                udLink,
                isShoppingCartFeatureEnabled: udData.Config.features.shopping_cart,
            });

            if (udData.me.is_authenticated && udData.me.id) {
                ShoppingClient.setUserId(udData.me.id);
            }

            ShoppingClient.fetch();
        }
    }, [i18n, udData, udLink]);

    return null;
};

export default function App({
    Component,
    pageProps,
    footerProps,
    headerProps,
    locale, // NOTE: this is just the language portion of the locale, i.e. en instead of en_US
    initialUDData,
}: AppWithLayoutProps) {
    const {isMobile, isDesktop, isTablet} = useDevice();
    const fullLocale = i18nPathToBundleMap[locale as keyof typeof i18nPathToBundleMap];
    const [rootStore] = useState(() => {
        const store = new RootStore({
            footerData: footerProps,
            headerData: headerProps,
            locale: fullLocale,
        });
        return store;
    });
    const [udData, setUDData] = useState({
        ...initialUDData,
        isGlobalMeContextLoading: true,
        // Shim device types
        // TODO: deprecate UA based device parsing and prefer responsive design + fresnel
        request: {
            isMobile: isMobile,
            isPC: isDesktop,
            isTablet: isTablet,
            language: locale,
            locale: fullLocale,
        },
    });

    const [coursePriceStore] = useState(new CoursePriceStore());

    // Shim global scope access to UD data (deprecate this)
    addUDDataToGlobalState(udData);

    useEffect(() => {
        async function bootstrapClient() {
            // Get client UD data
            const clientUDData = await fetchClientUDGlobalContext(locale);

            // Update udData and set is me loading to false
            const udDataWithClientData = {
                ...udData,
                ...clientUDData,
            };
            const newUDData = {
                ...udDataWithClientData,
                isGlobalMeContextLoading: false,
                Config: {
                    ...(udDataWithClientData.Config ?? {}),
                    app_name: process.env.APP_NAME,
                },
                userAgnosticTrackingParams: {
                    ...(udDataWithClientData.userAgnosticTrackingParams ?? {}),
                    page_key: pageProps.pageKey,
                },
            };

            setUDData(newUDData);

            // TODO: [deprecate this] shim global scope access to UD data
            addUDDataToGlobalState(newUDData);

            rootStore.initializeClient(newUDData);

            // Turn on keyboard navigation detection
            detectKeyboardNavigation();

            return udData;
        }

        bootstrapClient().then((data) => {
            // If we're on a UB site but not logged in, redirect to home
            const isLoggedOutUB = data.Config.brand.has_organization && !data.me.is_authenticated;
            const isHomePage = window.location.pathname === '' || window.location.pathname === '/';
            if (isLoggedOutUB && !isHomePage) {
                const url = new URL(window.location.origin);
                url.searchParams.set('next', window.location.pathname);
                window.location.assign(url);
            }
        });

        /**
         * TEMPORARY SOLUTION
         * This is for legacy imports that needs to be happen for some of the apps but for now mainly
         * modals. For the AjaxModal, we're using django templates + legacy dynamic import. For those,
         * we need to change both backend + frontend + both environment (next.js & monolith) and
         * making sure that nothing is breaking.
         *
         * This needs to be places in order to doDynamicImport (do-dynamic-import.js) works because this adds event listeners
         * and importing the apps/components via the events that doDynamicImports sends
         */
        legacyDynamicImports();
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    // Use the layout defined at the page level, if available
    // https://nextjs.org/docs/basic-features/layouts#per-page-layouts
    const getLayout = Component.getLayout ?? ((page) => page);

    return (
        <I18nProvider lang={locale} locale={fullLocale} translations={pageProps.translations}>
            <UDDataProvider data={udData}>
                <StoreProvider stores={[coursePriceStore]}>
                    <RootStoreProvider rootStore={rootStore}>
                        <QueryClientProvider client={queryClient}>
                            <Hydrate state={pageProps.dehydratedState}>
                                <BindI18nGlobals />
                                <I18nAccessBootstrapper />
                                {getLayout(<Component {...pageProps} />)}
                            </Hydrate>
                        </QueryClientProvider>
                    </RootStoreProvider>
                </StoreProvider>
            </UDDataProvider>
        </I18nProvider>
    );
}

App.getInitialProps = async function (appContext: AppContext) {
    /**
     * Required step from https://nextjs.org/docs/advanced-features/custom-app#caveats
     *
     * When you add getInitialProps in your custom app, you must import App from "next/app",
     * call App.getInitialProps(appContext) inside getInitialProps and merge the returned object into the return value.
     */
    const locale = appContext.router.locale;
    const [nextAppContext, {udData}, {headerProps, footerProps}] = await Promise.all([
        NextApp.getInitialProps(appContext),
        getUdDataServerProps(locale as string),
        fetchHeaderAndFooterProps(locale as string),
    ]);
    return {
        ...nextAppContext,
        footerProps,
        headerProps,
        locale,
        initialUDData: udData,
    };
};
