import {useFeatureVariantAssignmentsQuery} from '@udemy/graphql';
import {captureException} from '@udemy/sentry';
import {
    getConfigData,
    getRequestData,
    serverOrClient,
    udMe,
    udUserAgnosticTrackingParams,
} from '@udemy/shared-utils';
import {udApi, udApiStat} from '@udemy/ud-api';

import {Appboy} from './types';

// Promise that coordinates when braze SDK is ready to use via `whenBrazeReady()`
let brazeInitReadyResolve: (appboy: Appboy) => void;
const brazeInitReady = new Promise<Appboy>((resolve) => {
    brazeInitReadyResolve = resolve;
});

async function importAppBoy(): Promise<Appboy> {
    return new Promise((resolve) => {
        // Braze SDK cant deal with SSR apps
        if (typeof window !== 'undefined') {
            import('@braze/web-sdk').then((appboy) => {
                resolve(appboy as unknown as Appboy);
            });
        }
    });
}

export async function bootstrapBraze(): Promise<false | Appboy> {
    return importAppBoy().then(async (appboy) => {
        window.appboy = appboy;

        const udConfig = getConfigData();
        const udRequest = getRequestData();
        const appKey =
            udConfig.env === 'PROD'
                ? '5cefca91-d218-4b04-8bdd-c8876ec1908d'
                : '4aa844ae-1f20-4f99-aeb9-3307f28c861d';
        const isSdkInitialized = appboy.initialize(appKey, {
            baseUrl: 'sdk.iad-03.braze.com',
            safariWebsitePushId: udConfig.env === 'PROD' ? 'web.com.udemy.prod' : 'web.com.udemy',
            allowUserSuppliedJavascript: true,
            contentSecurityNonce: window.nonceValue,
            enableSdkAuthentication: true,
            devicePropertyAllowlist: [
                'browser',
                'browserVersion',
                'os',
                'resolution',
                'timeZone',
                'userAgent',
            ],
        });

        if (isSdkInitialized === undefined || isSdkInitialized === false) {
            udApiStat.increment('braze.web_sdk.initialized', {outcome: 'fail'});
            captureException(new Error('Braze SDK failed to initialize'));
            return false;
        } else {
            udApiStat.increment('braze.web_sdk.initialized', {outcome: 'success'});
            brazeInitReadyResolve(appboy);
        }

        appboy.openSession();
        const me = udMe();
        if (me?.is_authenticated) {
            const jwt = await generateJwt();
            appboy.changeUser(me.id, jwt);
            appboy.subscribeToSdkAuthenticationFailures(async (error) => {
                //  Authentication errors: https://www.braze.com/docs/developer_guide/platform_wide/sdk_authentication/#error-codes
                udApiStat.increment('braze.web_sdk.authentication_failed', {code: error.errorCode});
                if (error.userId === me.id.toString()) {
                    const updatedJwT = await generateJwt();
                    if (updatedJwT) {
                        appboy.setSdkAuthenticationSignature(updatedJwT);
                    } else {
                        captureException(
                            new Error('Braze authentication error: no token provided'),
                        );
                    }
                }
            });
        } else {
            const currentVisitor = appboy.getUser();
            currentVisitor?.setCountry(udConfig.marketplace_country.id);
            currentVisitor?.setLanguage(udRequest.language);
        }

        if (
            udUserAgnosticTrackingParams().page_key === 'discovery_subcategory' &&
            appboy.isPushSupported() &&
            !appboy.isPushBlocked() &&
            appboy.isPushPermissionGranted()
        ) {
            bootstrapSubcategoryPage(appboy);
        }

        if (serverOrClient.global.location.href.match(/http(s)?:\/\/.*\/course\/.*/gm)) {
            bootstrapCourseLandingPage(appboy);
        }

        return appboy;
    });
}

function bootstrapSubcategoryPage(appboy: Appboy) {
    const appElement = document.querySelector('.ud-component--category--category');
    const appProps = JSON.parse(appElement?.getAttribute('data-component-props') ?? '{}');
    if (appProps.pageObject) {
        const subcategoryId = appProps.pageObject.id;
        appboy.logCustomEvent('Viewed subcategory page', {subcategory_id: subcategoryId});
    }
}

async function bootstrapCourseLandingPage(appboy: Appboy) {
    const courseId = document.body.getAttribute('data-clp-course-id');
    if (courseId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let featureVariant: any = {};
        try {
            const featureVariantAssignmentsQuery = await useFeatureVariantAssignmentsQuery.fetcher({
                featureCodes: ['web_push_optin_display'],
            })();

            const featureVariants =
                featureVariantAssignmentsQuery.featureVariantAssignmentsByCodeAndAttributes;

            featureVariants.forEach((element) => {
                if (element.featureCode === 'web_push_optin_display') {
                    featureVariant = element.configuration;
                }
            });
        } catch (e) {
            // Just skip experiment, but surface error for debugging
            // TODO: Set default display variant
        }

        appboy.logCustomEvent('Viewed CLP', {
            course_id: courseId,
            experiment: featureVariant.showModal,
        });

        // Subscribe to In App Messages.
        appboy.subscribeToInAppMessage((inAppMessage) => {
            let shouldDisplay = true;
            if (inAppMessage instanceof appboy.InAppMessage) {
                // Read the key-value pair for msg-id
                const msgId = inAppMessage.extras['msg-id'];

                // If this is our push primer message.
                if (msgId === 'push-primer') {
                    // We don't want to display the soft push prompt to users on browsers that don't
                    // support push, or if the user has already granted/blocked permission.
                    if (!appboy.isPushSupported() || appboy.isPushBlocked()) {
                        shouldDisplay = false;
                    }
                }
            }

            // Display the message.
            if (shouldDisplay) {
                appboy.display.showInAppMessage(inAppMessage);
            }
        });
    }
}

async function generateJwt() {
    try {
        const response = await udApi.get('/braze/auth/');
        return response.data.jwt;
    } catch (e) {
        captureException(e);
    }
}

export async function whenBrazeReady(cb: (appboy: Appboy) => void) {
    return new Promise((resolve) => {
        brazeInitReady.then((appboy) => {
            cb(appboy);
            resolve(appboy);
        });
    });
}
