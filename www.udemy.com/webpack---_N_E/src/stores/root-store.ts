import {observable, runInAction} from 'mobx';

import {bootstrapBraze} from '@udemy/braze';
import {Tracker, getVisitorUuid, DOMAIN_CONFIG} from '@udemy/event-tracking';
import {FooterData} from '@udemy/footer';
import {fullstory} from '@udemy/fullstory';
import {initializeOneTrust} from '@udemy/onetrust';
import {initPerformanceCollection} from '@udemy/performance-rum-client';
import {HeaderData} from '@udemy/react-header';
import {udSentry} from '@udemy/sentry';
import {UDData} from '@udemy/ud-data';

import {EVENT_TRACKING_APP_KEY} from 'src/lib/constants';
import {fetchHeaderAndFooterClientProps} from 'src/lib/fetch-header-and-footer-props';
import {getSentryContext} from 'src/lib/sentry';

import {loadTag} from '../lib/gtm';
import {provideMarketingAttribution} from '../lib/marketing-attribution';

export interface StoreInitializationData {
    footerData: FooterData;
    headerData: HeaderData;
    locale: string;
}

export class RootStore {
    @observable isClientDataLoaded = false;
    @observable headerData: HeaderData;
    @observable footerData: FooterData;

    constructor(private readonly data: StoreInitializationData) {
        this.headerData = data.headerData;
        this.footerData = data.footerData;
    }

    /**
     * Loads client data and initializes tracking
     */
    async initializeClient(udData: UDData) {
        initializeOneTrust();
        this.initializeEventTracking(udData);
        this.initializePerformanceTracking(udData);
        await this.loadClientData(udData);
        this.initializeSentry(udData);
        this.loadGTag(udData);
        provideMarketingAttribution();
        this.initializeBraze();
    }

    /**
     * Fetch client-side UD Global data and update stores that depend on it
     */
    private async loadClientData(udData: UDData) {
        // fetch client side data
        // TODO: move to GQL
        const headerAndFooterData = await fetchHeaderAndFooterClientProps(this.data.locale);

        runInAction(() => {
            const {header, footer} = headerAndFooterData;
            this.headerData = {
                ...this.headerData,
                ...header,
                isLoggedIn: udData.me.is_authenticated,
                isClientDataLoaded: true,
            };
            this.footerData = {
                ...this.footerData,
                ...footer,
            };
            this.isClientDataLoaded = true;
        });
    }

    /**
     * Initialize Event Tracking
     */
    private initializeEventTracking(udData: UDData) {
        const {isMobile} = udData.request;

        const organizationId = udData.Config.brand.has_organization
            ? udData.Config.brand.organization.id
            : null;

        // Initialize Tracker
        if (udData.userAgnosticTrackingParams.page_key) {
            Tracker.initialize({
                appKey: EVENT_TRACKING_APP_KEY,
                appLanguage: this.data.locale,
                appVersion: process.env.VERSION,
                clientKey: 'nextjs',
                domainConfig: DOMAIN_CONFIG.USE_CURRENT,
                isMobile,
                isTrackingEnabled: true,
                organizationId,
                pageKey: udData.userAgnosticTrackingParams.page_key,
                printLogs: true,
                sourceServiceName: process.env.APP_NAME,
                userId: udData.me.is_authenticated ? udData.me.id : undefined,
                visitorUuid: getVisitorUuid(),
            });
        } else {
            // eslint-disable-next-line no-console
            console.error('`page_key` is missing');
        }
    }
    /**
     * Initialize Performance Collection
     */
    private initializePerformanceTracking(udData: UDData) {
        const {isMobile, isPC: isDesktop} = udData.request;

        // Initialize Performance RUM collection
        initPerformanceCollection({
            deviceType: isDesktop ? 'desktop' : isMobile ? 'mobile' : 'tablet',
            isFirstTimeVisitor: udData.visiting.is_first_time_visitor,
            isPageCached: false,
        });
    }
    /**
     * Initialize Fullstory, Sentry, event tracking, and performance collection
     */
    private initializeSentry(udData: UDData) {
        if (!this.isClientDataLoaded && process.env.DEPLOY_ENV !== 'prod') {
            // eslint-disable-next-line no-console
            console.warn(
                'WARNING: Attemting to initialize client tracking before loading client data',
            );
        }

        // Initialize Sentry and Fullstory
        if (process.env.DEPLOY_ENV !== 'local') {
            udSentry.initializeSentryContext(getSentryContext(udData));
            const user = this.headerData.user;
            fullstory.initialize({
                udData,
                userData: {
                    isConsumerSubsSubscriber: user.consumer_subscription_active ?? false,
                    encryptedId: udData.me.is_authenticated ? udData.me.encrypted_id : undefined,
                },
                onInitialized: () => {
                    udSentry.sentryInstance?.setTags({fullstory: 'enabled'});
                },
            });
        }
    }

    private loadGTag(udData: UDData) {
        const pageKey = Tracker.context.pageKey;
        const pageConfig = {
            app_key: Tracker.context.appKey,
            env: udData.Config.env,
            isCLP: pageKey === 'course_landing_page',
            isJapanese: this.data.locale === 'ja_JP',
            isLoggedInHomePage: pageKey === 'discovery_logged_in_home',
            isMarketPlaceUS: udData.Config.marketplace_country.id === 'US',
            page_key: pageKey as string,
        };
        loadTag(pageConfig);
    }

    private async initializeBraze() {
        bootstrapBraze();
    }
}
