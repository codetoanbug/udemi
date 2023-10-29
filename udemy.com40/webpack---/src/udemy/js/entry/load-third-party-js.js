import * as ga from '@udemy/gtag';

import {importBraze} from 'braze/ud-braze';
import {importPendo} from 'pendo/ud-pendo';
import getConfigData from 'utils/get-config-data';
import {getVariantValueFromUdRequest} from 'utils/get-experiment-data';
import getRequestData from 'utils/get-request-data';
import udExternalLoaders from 'utils/ud-external-loaders';
import udMe from 'utils/ud-me';
import udPerf from 'utils/ud-performance';
import udVisiting from 'utils/ud-visiting';

// Third party JS that gets loaded on all pages
export default function loadThirdPartyJS(meContextPromise) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    if (urlSearchParams.has('blockThirdPartyJS')) {
        return;
    }

    // Load Google Analytics without delay, so that bounce rate metrics are more accurate.
    // It does not affect our PageSpeedInsights score.
    udExternalLoaders.loadGoogleAnalytics(undefined, {
        // Set it true if you want to see ga logs in console.
        debug: false,
    });

    ga.assignToGlobalScope();
    ga.trackAllPageview();
    if (UD.GoogleAnalytics.queuedPurchase) {
        ga.trackPurchase(UD.GoogleAnalytics.queuedPurchase);
    }

    // Load new GTM server-side capabilities via GTAG SDK
    // Load Google Tag Manager with delay, so that PageSpeedInsights score is not affected.
    // Loading it without delay makes our score drop by ~20 points.
    const thirdPartyJSDelay = 3000;
    udPerf.start('load-third-party-js');

    function load3rdParty() {
        udPerf.end('load-third-party-js-request-idle-callback');
        meContextPromise.then(() => {
            // Our GTM tags reference the global UD object, including but not limited to
            // UD.GoogleAnalytics, UD.me, UD.visiting. Hence, we need to ensure that
            // meContext has loaded.

            const udRequest = getRequestData();
            const udConfig = getConfigData();

            const loadGTM =
                urlSearchParams.has('debugForceLoadGTM') ||
                (udRequest.is_bot !== true && !udConfig.brand.has_organization);

            if (loadGTM) {
                activateMyQualaroos(udMe.qualaroo_survey_ids);
                udExternalLoaders.loadGoogleTagManager();
                udExternalLoaders.loadGtag();
                udPerf.mark('load-google-tag-manager');
            }

            udExternalLoaders.loadSift();

            importBraze();
            importPendo();

            if (udConfig.features.organization.is_fullstory_enabled) {
                const FSEnabled =
                    getVariantValueFromUdRequest('lab_taking', 'fullstory_enabled', false) ||
                    getVariantValueFromUdRequest(
                        'instructor_insights_ub_only_course_engagement',
                        'fullstory_enabled',
                        false,
                    ) ||
                    getVariantValueFromUdRequest(
                        'is_new_ce_fullstory_enabled',
                        'fullstory_enabled',
                        false,
                    );

                if (FSEnabled) {
                    // If this is enabled by the application, ensure we load Fullstory
                    udExternalLoaders.loadFullStory(1);
                } else if (isInstructorPage()) {
                    // Instructor pages are required to be sampled 30% rate.
                    udExternalLoaders.loadFullStory(0.3);
                } else if (isCourseTakingPage()) {
                    // Course taking page default otherwise at 10% of global learner default due to excess volume.
                    udExternalLoaders.loadFullStory(0.001);
                } else {
                    // Otherwise, allow package to enable at global sample rate
                    // (see https://github.com/udemy/frontends/blob/main/packages/fullstory/src/fullstory.ts#L71)
                    udExternalLoaders.loadFullStory();
                }
            }
            udPerf.end('load-third-party-js');
        });
    }

    setTimeout(() => {
        udPerf.start('load-third-party-js-request-idle-callback');
        window.requestIdleCallback(load3rdParty, {timeout: 2000});
    }, thirdPartyJSDelay);
}

function activateMyQualaroos(surveyIds) {
    window._kiq = window._kiq || [];
    let i, property;
    for (i = 0; i < surveyIds.length; i++) {
        property = {};
        property[surveyIds[i]] = true;
        window._kiq.push(['set', property]);
    }
    window._kiq.push(['identify', udVisiting.visitor_uuid || '']);
}

function isInstructorPage() {
    return getConfigData().app_name === 'instructor';
}

function isCourseTakingPage() {
    return getConfigData().app_name === 'course:course_taking';
}
