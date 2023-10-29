import {Tracker, generateTrackingId, defaultWebAppKey, DOMAIN_CONFIG} from '@udemy/event-tracking';
import Cookies from 'js-cookie';

import getConfigData from 'utils/get-config-data';
import getRequestData from 'utils/get-request-data';
import udApiStat from 'utils/ud-api-stat';
import udMe from 'utils/ud-me';
import udUserAgnosticTrackingParams from 'utils/ud-user-agnostic-tracking-params';
import udUserSpecificTrackingParams from 'utils/ud-user-specific-tracking-params';
import udVisiting from 'utils/ud-visiting';

import getVisitorUUID from '../utils/ud-visitor-uuid';
import {sourceServiceName} from './constants';

const versionLength = 7;

export function getAppKey() {
    return defaultWebAppKey;
}

/**
 * Returns the organization ID of the page being currently browsed.
 * @returns Udemy organization ID or null for the marketplace.
 */
export function getOrganizationId() {
    const udConfig = getConfigData();
    if (udConfig.brand.has_organization && udConfig.brand.organization) {
        return udConfig.brand.organization.id;
    }
    return null; // Marketplace
}

/**
 * Returns the header section of the web client common App context for the page being currently browsed.
 * @returns header section of app context or null or undefined.
 */
export function getUserDataFromAppContext(commonAppContext: any) {
    return commonAppContext?.data?.header;
}

/**
 * The tracker starts with some default parameters. Some of these parameters should be overridden
 * externally. This method creates an object to change these default values with the values
 * specific to the website-django frontend.
 */
export function getExternalTrackerParameters(user: any) {
    const udConfig = getConfigData();
    const udRequest = getRequestData();
    // This line below is for us to understand why `getVisitorUUID` is null rarely.
    // We do it at this level instead of the ud-visiting to be less expensive to datadog
    const visitorUuid = getVisitorUUID();
    if (!visitorUuid) {
        const tags = {
            ud_visiting_is_loading: udVisiting.isLoading,
            visitor_uuid_defined: Boolean(udVisiting.visitor_uuid),
            cookie_defined: Boolean(Cookies.get('__udmy_2_v57r')),
            is_mobile: udRequest.isMobile,
            initial_page_key: udUserAgnosticTrackingParams.page_key,
        };
        udApiStat.increment('js_event_tracking.visitor_uuid.is_empty', tags);
    }

    return {
        appKey: getAppKey(),
        appLanguage: udRequest.locale,
        appVersion: udConfig.version.substr(0, versionLength),
        clientId: generateTrackingId(),
        clientRetries: true,
        domainConfig: DOMAIN_CONFIG.USE_CURRENT,
        isD2CSubscriber: user?.consumer_subscription_active,
        isMobile: udRequest.isMobile,
        isTrackingEnabled: udUserSpecificTrackingParams.tracking_enabled,
        organizationId: getOrganizationId(),
        // Use the pageKey in the tracking context if it's already set by PageTrackingRoute
        pageKey: Tracker.context.pageKey ?? udUserAgnosticTrackingParams.page_key ?? 'no-page-key',
        pageTrackingId: generateTrackingId(),
        printLogs: udConfig.env === 'DEV',
        sourceServiceName,
        userId: udMe.id,
        visitorUuid,
    };
}
