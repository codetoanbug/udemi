import {loadGtag, PageConfig} from '@udemy/gtag';
import {getConfigData} from '@udemy/shared-utils';

export function loadTag(pageConfig: PageConfig, cb?: () => void) {
    // Load new GTM server-side capabilities via GTAG SDK
    const thirdPartyJSDelay = 3000;
    setTimeout(() => {
        window.requestIdleCallback(
            () => {
                const udConfig = getConfigData();
                const forceLoadGtag = new URLSearchParams(window.location.search).has(
                    'forceLoadGtag',
                );
                if (
                    forceLoadGtag ||
                    (udConfig.brand.is_external_sources_enabled &&
                        udConfig.brand.is_third_party_marketing_enabled)
                ) {
                    loadGtag(pageConfig, cb);
                }
            },
            {timeout: 2000},
        );
    }, thirdPartyJSDelay);
}
