/**
 * require.js allows you to load external URLs in the same way that you load internal ones.
 * However, since Webpack is really more of a compile-time bundler, it doesn't have runtime
 * features like that. Hence, this module takes care of loading external libraries in an
 * asynchronous manner using script.js. Note that Karma and server-side isomorphic rendering
 * override 'scriptjs' to 'utils/mock-scriptjs' so that we don't make real network requests.
 *
 * This module returns an object containing loaders for each external source. If external sources
 * are disabled, the loaders are basically no-ops. It's safe to call the loaders twice, but with
 * different callbacks.
 */
import * as Sentry from '@sentry/browser';
import SentryFullStory from '@sentry/fullstory';
import {fullstory, FullstoryBrowser} from '@udemy/fullstory';
import {loadGtag} from '@udemy/gtag';
import {CookieConsent} from '@udemy/onetrust';
import {
    getConfigData,
    getRequestData,
    udVisiting,
    udUserAgnosticTrackingParams,
} from '@udemy/shared-utils';
import $script from 'scriptjs';

import loadCommonAppContext from 'common/load-common-app-context';
import {INSTRUCTOR_PARTNERS} from 'user-profile/instructor/constants';
import ANALYTICS_PARAMS from 'utils/constants';
import {getAllAssignedVariantIds} from 'utils/get-experiment-data';
import udLink from 'utils/ud-link';
import udMe from 'utils/ud-me';
import Raven from 'utils/ud-raven';
import getVisitorUUID from 'utils/ud-visitor-uuid';

const loaders = {};

loaders.loadSignInWithApple = function loadSignInWithApple(cb) {
    const udConfig = getConfigData();
    if (udConfig.brand.is_external_sources_enabled) {
        const url =
            'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
        $script(url, () => {
            if (typeof cb !== 'undefined' && typeof window.AppleID !== 'undefined') {
                cb(window.AppleID);
            }
        });
    }
};

loaders.loadFacebookSDK = function loadFacebookSDK(cb) {
    const udConfig = getConfigData();
    if (
        udConfig.brand.is_external_sources_enabled &&
        udConfig.brand.is_third_party_marketing_enabled
    ) {
        const url = 'https://connect.facebook.net/en_US/sdk.js';
        $script(url, () => {
            if (typeof cb !== 'undefined' && typeof window.FB !== 'undefined') {
                cb(window.FB);
            }
        });
    }
};

loaders.loadPayPalLogin = function loadPayPalLogin(cb) {
    const udConfig = getConfigData();
    if (udConfig.brand.is_external_sources_enabled) {
        const url = 'https://www.paypalobjects.com/js/external/api.js';
        $script(url, () => {
            // instead of paypal, we need to use requirejs to override paypal.use method
            if (typeof cb !== 'undefined' && typeof window.requirejs !== 'undefined') {
                cb(window.requirejs);
            }
        });
    }
};

loaders.loadGoogleAnalytics = function loadGoogleAnalytics(cb, options) {
    const udConfig = getConfigData();
    if (udConfig.env !== 'PROD' || !CookieConsent.allowsGoogleAnalytics()) {
        return;
    }
    options = options || {};
    const debug = options.debug;
    let url = '//www.google-analytics.com/analytics';
    if (debug) {
        url += '_debug';
    }
    url += '.js';
    $script(url, () => {
        if (typeof cb !== 'undefined' && typeof window.ga !== 'undefined') {
            cb(window.ga);
        }
    });
};

loaders.loadGtag = function (cb) {
    const udConfig = getConfigData();
    const forceLoadGtag = new URLSearchParams(window.location.search).has('forceLoadGtag');
    if (
        forceLoadGtag ||
        (udConfig.brand.is_external_sources_enabled &&
            udConfig.brand.is_third_party_marketing_enabled)
    ) {
        loadGtag(cb);
    }
};

loaders.loadGoogleAuth = function loadGoogleAuth(cb) {
    const udConfig = getConfigData();
    if (udConfig.brand.is_external_sources_enabled) {
        window.udGoogleAuthLoaderCallback = () => {
            if (typeof cb !== 'undefined' && typeof window.google !== 'undefined') {
                cb(window.google);
            }
        };
        window.udGoogleAuthLoaderCallback();
        $script('https://accounts.google.com/gsi/client', window.udGoogleAuthLoaderCallback);
    }
};

loaders.loadGoogleTagManager = function loadGoogleTagManager() {
    const udConfig = getConfigData();
    if (
        udConfig.brand.is_external_sources_enabled &&
        udConfig.brand.is_third_party_marketing_enabled
    ) {
        ((w, d, s, l, i) => {
            // initialize the dataLayer if it doesn't exist, add to the layer if it does
            if (!w[l]) {
                w[l] = [];
            }
            w[l].push({
                isMember: udMe.id > 0,
                env: udConfig.env,
            });
            (async () => {
                w[l].push(await ANALYTICS_PARAMS.user.extract());
            })();
            w[l].push({'gtm.start': Date.now(), event: 'gtm.js'});
            const f = d.getElementsByTagName(s)[0];
            const j = d.createElement(s);
            const dl = l != 'dataLayer' ? `&l=${l}` : '';
            j.async = true;
            j.src = `//www.googletagmanager.com/gtm.js?id=${i}${dl}`;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', udConfig.third_party.google_tag_manager_id);
    }
};

loaders.loadSift = function loadSift(cb) {
    const udConfig = getConfigData();
    if (udConfig.brand.is_external_sources_enabled && udConfig.third_party.sift_account) {
        const _sift = (window._sift = window._sift || []);
        _sift.push(['_setAccount', udConfig.third_party.sift_account]);
        _sift.push(['_setUserId', udMe.id]);
        _sift.push(['_setSessionId', getVisitorUUID()]);
        _sift.push(['_trackPageview']);
        $script('https://cdn.sift.com/s.js', () => {
            if (typeof cb !== 'undefined') {
                cb(window._sift);
            }
        });
    }
};

loaders.loadStripeJSV2 = function loadStripeJSV2(cb) {
    const udConfig = getConfigData();
    if (udConfig.brand.is_external_sources_enabled) {
        $script('https://js.stripe.com/v2/', () => {
            if (typeof cb !== 'undefined' && typeof window.Stripe !== 'undefined') {
                cb(window.Stripe);
            }
        });
    }
};

loaders.loadStripeJSV3 = function loadStripeJSV3(cb) {
    const udConfig = getConfigData();
    if (udConfig.brand.is_external_sources_enabled) {
        $script('https://js.stripe.com/v3/', () => {
            if (typeof cb !== 'undefined' && typeof window.Stripe !== 'undefined') {
                cb(window.Stripe);
            }
        });
    }
};

loaders.loadZendeskChat = function loadZendeskChat(cb) {
    const udConfig = getConfigData();
    if (udConfig.features.zendesk_chat) {
        document.zendeskHost = 'udemysupport.zendesk.com';
        document.zEQueue = [];
        $script('https://assets.zendesk.com/embeddable_framework/main.js', () => {
            if (typeof cb !== 'undefined') {
                cb();
            }
        });
    }
};

loaders.loadZendeskWebWidget = function loadZendeskWebWidget(widgetKey, cb) {
    const udConfig = getConfigData();
    if (udConfig.features.zendesk_chat) {
        document.zendeskHost = 'udemysupport.zendesk.com';
        document.zEQueue = [];
        $script(`https://static.zdassets.com/ekr/snippet.js?key=${widgetKey}`, () => {
            if (typeof cb !== 'undefined') {
                cb();
            }
        });
    }
};

loaders.loadMarketoForms2 = function loadMarketoForms2(cb) {
    $script('https://app-sjqe.marketo.com/js/forms2/js/forms2.min.js', () => {
        cb && cb();
    });
};

loaders.loadMarketoMunchkin = function loadMarketoMunchkin(cb) {
    // https://developers.marketo.com/blog/make-a-marketo-form-submission-in-the-background/
    $script('https://munchkin.marketo.net/munchkin-beta.js', () => {
        cb && cb();
    });
};

/**
 * loadFullStory()
 * Initializes the Fullstory SDK
 * @param sampleRate {number} A value between 0 and 1 that represents a % of traffic to be observed (1 = 100%).
 * Precision unit is 0.001, don't go below that.
 * @returns {Promise<boolean>}
 */
loaders.loadFullStory = async function loadFullStory(sampleRate) {
    const udConfig = getConfigData();
    if (!udConfig.brand.is_external_sources_enabled) {
        return;
    }

    // This function should always be called after resolving the context promise
    // This block serves as a safeguard in case it was not
    if (udMe.isLoading) {
        return;
    }

    const udData = {
        Config: udConfig,
        request: getRequestData(),
        visiting: udVisiting(),
        userAgnosticTrackingParams: udUserAgnosticTrackingParams(),
    };

    const commonAppContext = await loadCommonAppContext();
    const {user} = commonAppContext.data.header;
    const userData = {
        isConsumerSubsSubscriber: user.consumer_subscription_active,
        isUBAdmin: udMe.organization?.isAdmin || udMe.organization?.isOwner,
        isUBGroupAdmin: udMe.organization?.isGroupAdmin,
        isProLicenseHolder: udMe.organization?.is_pro_license_holder,
        ubRole: udMe.organization?.role,
        isInstructorPartner: INSTRUCTOR_PARTNERS.includes(udMe.id),
        isAuthenticated: udMe.is_authenticated,
        signupDate: udMe.created,
        encryptedId: udMe.encrypted_id,
    };

    fullstory.initialize({
        udData,
        userData,
        sampleRate,
        onInitialized: () => {
            Raven.getSentryInstance().setTag('fullstory', 'enabled');
            FullstoryBrowser.setVars('page', {
                experimentVariant_ints: getAllAssignedVariantIds(),
            });
        },
    });

    Raven.initializeSentry(Sentry, {
        integrations: [new SentryFullStory('udemycom')],
    });
};

loaders.loadEmmetScript = function () {
    return new Promise((resolve) => {
        $script(udLink.toStorageStaticAsset('instructor/coding_exercise/emmet.js'), resolve);
    });
};

export default loaders;
