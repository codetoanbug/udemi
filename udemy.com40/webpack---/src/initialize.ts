import {setUpTrackingForOneTrust} from './tracking';
import {ConsentEvent, OneTrust, OneTrustReadyHandler} from './types';

// Alias function for callingg gloabl gtag function.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function callGtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments as unknown as unknown[]);
}

// Wrap custom OneTrust handling logic in a closure to ensure code is only executed once
const attachOneTrustCustomHandlingOnlyOnce = (() => {
    let hasExecuted = false;
    return function () {
        if (hasExecuted === true) {
            return false;
        }
        if (typeof window.dataLayer == 'undefined') {
            window.dataLayer = window.dataLayer || [];
        }

        const OneTrust = window.OneTrust as OneTrust;

        const GRANTED = 'granted';
        const DENIED = 'denied';

        window.optOutConsent = {
            ad_storage: GRANTED,
            analytics_storage: GRANTED,
            functionality_storage: GRANTED,
            personalization_storage: GRANTED,
            security_storage: GRANTED,
        };

        window.optInConsent = {
            ad_storage: DENIED,
            analytics_storage: DENIED,
            functionality_storage: DENIED,
            personalization_storage: DENIED,
            security_storage: GRANTED,
        };

        // initialize the default settings to opt-in to protect against timing conditions with Google Analytics Loading
        callGtag('consent', 'default', window.optInConsent);

        // Add consent change handler.
        OneTrust.OnConsentChanged((consentEvent: ConsentEvent) => {
            window.__onConsentChanged = window.__onConsentChanged || [];
            window.__onConsentChanged.push(consentEvent);
        });
        const queue = window.OneTrustReadyHandlers as Array<(oneTrustApi: unknown) => void>;
        // Call the handlers that are queued after OneTrust is ready.
        window.OneTrustReadyHandlers = {
            push: (cb: OneTrustReadyHandler) => {
                cb(window.OneTrust as OneTrust);
            },
        };
        // Call the handlers that were queued before OneTrust was ready.
        for (let queueIndex = 0; queueIndex < queue.length; queueIndex++) {
            queue[queueIndex](window.OneTrust);
        }

        const defaultDomainData = {ConsentModel: {Name: 'uninitialized'}};

        // be extra conservative in how we load this data, as if OneTrust changes the contract
        // we don't want to blow up the page load on every page on the site
        const domainData = (window.OneTrust as OneTrust).GetDomainData() || defaultDomainData;
        const consentModel = domainData.ConsentModel || defaultDomainData.ConsentModel;
        const consentModelName = consentModel.Name || defaultDomainData.ConsentModel.Name;

        switch (consentModelName) {
            case 'opt-out':
                callGtag('consent', 'default', window.optOutConsent);
                break;
            case 'opt-in':
            default:
                callGtag('consent', 'default', window.optInConsent);
                break;
        }
        // Mark executed to prevent duplicate execution.
        hasExecuted = true;
    };
})();

export function initializeOneTrust() {
    window.isOneTrustActive = true;
    window.OneTrustReadyHandlers = window.OneTrustReadyHandlers || [];
    if (!window.OneTrust) {
        window.OptanonWrapper = function () {
            attachOneTrustCustomHandlingOnlyOnce();
        };
    } else {
        attachOneTrustCustomHandlingOnlyOnce();
    }
    setUpTrackingForOneTrust();
}
