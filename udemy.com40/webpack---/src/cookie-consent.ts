import {serverOrClient} from '@udemy/shared-utils';
import {getServerOrClientUDData} from '@udemy/ud-data';

export class OneTrustConsentTypes {
    static STRICTLY_NECESSARY = 'C0001';
    static PERFORMANCE = 'C0002';
    static FUNCTIONAL = 'C0003';
    static ADVERTISING = 'C0004';
    static SOCIAL_MEDIA = 'C0005';
}

export class CookieConsent {
    static allows(consentType: string) {
        const activeGroups = serverOrClient.global.OnetrustActiveGroups;

        // Would only happen if the Onetrust integration is broken
        // It's either fail securely or throw an exception
        if (!activeGroups || typeof consentType == 'undefined') {
            return false;
        }

        return activeGroups.includes(consentType);
    }

    static allowsPerformanceCookies() {
        return this.allows(OneTrustConsentTypes.PERFORMANCE);
    }

    static allowsFunctionalCookies() {
        return this.allows(OneTrustConsentTypes.FUNCTIONAL);
    }

    static allowsAdvertisingCookies() {
        return this.allows(OneTrustConsentTypes.ADVERTISING);
    }

    static allowsSocialMediaCookies() {
        return this.allows(OneTrustConsentTypes.SOCIAL_MEDIA);
    }

    static isMx() {
        return !getServerOrClientUDData().Config.brand.has_organization;
    }

    static allowsGoogleAnalytics() {
        // Until we set up Google Analytics consent mode
        // we can't load it without having user's consent to deploy performance cookies
        return this.isMx() && this.allows(OneTrustConsentTypes.PERFORMANCE);
    }

    static toGtagEventData() {
        return {
            ad_storage: this.allowsAdvertisingCookies() ? 'true' : 'false',
            analytics_storage: this.allowsPerformanceCookies() ? 'true' : 'false',
            functionality_storage: this.allowsFunctionalCookies() ? 'true' : 'false',
            personalization_storage: this.allowsSocialMediaCookies() ? 'true' : 'false',
            security_storage: 'true',
        };
    }
}

export function getUserConsentCategories(consentCategories?: string) {
    const activeGroups = consentCategories || serverOrClient.global.OnetrustActiveGroups;
    if (activeGroups) {
        // Order OneTrust's user consent string ",C0002,C0001,C0003,"
        return activeGroups
            .split(',')
            .filter((x: string) => x)
            .sort()
            .join(',');
    }
    return '';
}
