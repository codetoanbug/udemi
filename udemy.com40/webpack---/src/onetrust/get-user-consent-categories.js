import {serverOrClient} from '../env/server-or-client';

export class OneTrustConsentTypes {
    static STRICTLY_NECESSARY = 'C0001';
    static PERFORMANCE = 'C0002';
    static FUNCTIONAL = 'C0003';
    static ADVERTISING = 'C0004';
    static SOCIAL_MEDIA = 'C0005';
}

export class OneTrustConsent {
    static DEBUG_FORCE_LOAD_GTM = 'debugForceLoadGTM';

    static allows(consentType) {
        const activeGroups = serverOrClient.global.OnetrustActiveGroups;

        // Would only happen if the Onetrust integration is broken
        // It's either fail securely or throw an exception
        if (!activeGroups || typeof consentType == 'undefined') {
            return false;
        }

        return activeGroups.includes(consentType);
    }

    static allowsAllCookieCategories() {
        return (
            this.allows(OneTrustConsentTypes.PERFORMANCE) &&
            this.allows(OneTrustConsentTypes.FUNCTIONAL) &&
            this.allows(OneTrustConsentTypes.ADVERTISING) &&
            this.allows(OneTrustConsentTypes.SOCIAL_MEDIA)
        );
    }

    static requiresCookieOpIn(oneTrust) {
        const consentModel = oneTrust.GetDomainData().ConsentModel;

        return consentModel.Name === 'opt-in';
    }

    static isMx() {
        return !UD.Config.brand.has_organization;
    }

    static isUb() {
        return UD.Config.brand.has_organization;
    }

    static isInCalifornia(oneTrust) {
        const geoData = oneTrust.getGeolocationData();

        return geoData.country === 'US' && geoData.state === 'CA';
    }

    static allowsGoogleAnalytics() {
        // Until we set up Google Analytics consent mode
        // we can't load it without having user's consent to deploy performance cookies
        return this.isMx() && this.allows(OneTrustConsentTypes.PERFORMANCE);
    }

    static allowsGoogleTagManager(urlSearchParams) {
        // Until we fix our GTM - Onetrust integration we need to block loading google tag manager
        // in certain cases unless we have consent for all cookie categories from the user:
        //
        // * UB organizations that have OneTrust enabled
        // * Users in geos that have an opt-in cookie policy
        // * Users in California

        if (
            typeof urlSearchParams !== 'undefined' &&
            urlSearchParams.has(OneTrustConsent.DEBUG_FORCE_LOAD_GTM)
        ) {
            return true;
        }

        const oneTrust = serverOrClient.global.OneTrust;
        if (!oneTrust) {
            // If OneTrust hasn't loaded we don't allow GTM because we can't verify consent
            return false;
        }

        if (this.isUb() || this.requiresCookieOpIn(oneTrust) || this.isInCalifornia(oneTrust)) {
            return this.allowsAllCookieCategories();
        }

        return true;
    }

    static toGtagEventData() {
        return {
            ad_storage: this.allows(OneTrustConsentTypes.ADVERTISING) ? 'true' : 'false',
            analytics_storage: this.allows(OneTrustConsentTypes.PERFORMANCE) ? 'true' : 'false',
            functionality_storage: this.allows(OneTrustConsentTypes.FUNCTIONAL) ? 'true' : 'false',
            personalization_storage: this.allows(OneTrustConsentTypes.SOCIAL_MEDIA)
                ? 'true'
                : 'false',
            security_storage: 'true',
        };
    }
}

export function getUserConsentCategories(consentCategories) {
    const activeGroups = consentCategories || serverOrClient.global.OnetrustActiveGroups;
    if (activeGroups) {
        // Order OneTrust's user consent string ",C0002,C0001,C0003,"
        return activeGroups
            .split(',')
            .filter((x) => x)
            .sort()
            .join(',');
    }
    return '';
}
