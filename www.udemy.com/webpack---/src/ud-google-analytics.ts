import {serverOrClient, getConfigData, getRequestData} from '@udemy/shared-utils';

// Extend Typescript window interface to add ga function
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ga: (...args: any[]) => void;
    }
}

export function assignToGlobalScope() {
    serverOrClient.global.UD.GoogleAnalytics = serverOrClient.global.UD.GoogleAnalytics || {};
    serverOrClient.global.UD.GoogleAnalytics.trackEvent = trackEvent;
    serverOrClient.global.UD.GoogleAnalytics.trackPageview = trackPageview;
    serverOrClient.global.UD.GoogleAnalytics.setValue = setValue;
    serverOrClient.global.UD.GoogleAnalytics.trackPurchase = trackPurchase;
    serverOrClient.global.UD.GoogleAnalytics.trackAllPageview = trackAllPageview;
}

export function trackEvent(
    category: string,
    action: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    label: any,
    value?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    propertyName?: string | any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extraParams?: {nonInteraction?: any},
) {
    const udConfig = getConfigData();
    if (!udConfig.brand.has_organization && category && action) {
        if (!window.ga) {
            // eslint-disable-next-line no-console
            console.error('expected ga function to be in the window');
            return false;
        }
        const params = [];
        if (propertyName) {
            params.push(propertyName.concat('.send'));
        } else {
            params.push('send');
        }
        params.push('event');
        params.push(category, action);
        if (label) {
            params.push(label);
        }
        if (value) {
            params.push(parseInt(value, 10) || 0);
        }
        extraParams = extraParams || {};
        if (!extraParams.nonInteraction) {
            extraParams.nonInteraction = 0;
        }
        params.push(extraParams);
        window.ga(...params);
    }
}

export function trackPageview(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    accountId: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    propertyName: string | null | any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    page: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    domainName?: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contentGroup?: any,
) {
    const udConfig = getConfigData();
    const udRequest = getRequestData();
    if (!udConfig.brand.has_organization && accountId) {
        if (!window.ga) {
            // eslint-disable-next-line no-console
            console.error('expected ga function to be in the window');
        }
        serverOrClient.global.UD.GoogleAnalytics.createAccount(accountId, propertyName, domainName);
        window.ga('set', 'location', udRequest.third_party_location);

        if (contentGroup) {
            window.ga('set', 'contentGroup1', contentGroup);
        }

        const params = [];
        if (propertyName) {
            params.push(propertyName.concat('.send'));
        } else {
            params.push('send');
        }
        params.push('pageview');
        if (page) {
            params.push({
                hitType: 'pageview',
                page,
            });
        }
        window.ga(...params);
    }
}

export function setValue(fieldName: unknown, value: unknown, propertyName: string | unknown[]) {
    const udConfig = getConfigData();
    if (!udConfig.brand.has_organization && fieldName && value) {
        const params = [];
        if (propertyName) {
            params.push(propertyName.concat('.set'));
        } else {
            params.push('set');
        }
        params.push(fieldName, value);
        window.ga(...params);
    }
}

export function trackPurchase(transactionObject: unknown) {
    const udConfig = getConfigData();
    if (!udConfig.brand.has_organization && transactionObject) {
        window.ga('require', 'ecommerce');
        window.ga('ecommerce:addTransaction', transactionObject);
        window.ga('ecommerce:send');
    }
}

export function trackAllPageview(page: unknown) {
    const udConfig = getConfigData();
    if (udConfig.brand.has_organization) {
        return;
    }

    // Add content group tracking for course landing page to GA
    trackPageview(udConfig.third_party.google_analytics_id, null, page, null, null);
    if (udConfig.brand.has_custom_google_analytics) {
        trackPageview(udConfig.brand.google_analytics_id, 'brand', page);
    }
    // 15_second event fired from GTM instead
    const instructor = serverOrClient.global.UD.GoogleAnalytics.instructor;
    if (instructor) {
        trackPageview(instructor.accountId, 'instructor', instructor.page);
    }
}
