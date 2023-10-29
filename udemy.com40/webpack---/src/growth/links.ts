import {getConfigData, getRequestData, getVariantValue, serverOrClient} from '@udemy/shared-utils';
import {UDData, udLink} from '@udemy/ud-data';

import {
    UDEMY_BUSINESS_PATH,
    BENESSE_BASE_URL,
    UDEMYKOREA_BUSINESS_DEMO_PATH,
    UDEMYKOREA_BUSINESS_PATH,
    UTM_QUERY_PARAM_MKTO_FIELDS,
} from '../constants';

function getMarketoUTMParameters() {
    // Extracts Marketo's UTM parameters and forwards them as query parameters
    const keys = Object.keys(UTM_QUERY_PARAM_MKTO_FIELDS);
    const query = new URLSearchParams(serverOrClient.global.location?.search || '');
    const forward: Record<string, string> = {};
    for (const utm of keys) {
        if (query.has(utm)) {
            forward[utm] = query.get(utm) as string;
        }
    }
    return forward;
}

export function toBusinessUdemy(
    path?: string,
    params: Record<string, string> = {},
    isOnsiteRequestDemo = false,
    globalOverrides?: Pick<UDData, 'request' | 'Config'>,
) {
    const udRequest = globalOverrides?.request ?? getRequestData();
    const udConfig = globalOverrides?.Config ?? getConfigData();

    let baseUrl = UDEMY_BUSINESS_PATH;
    if (path) {
        baseUrl += `${path}/`;
    }
    if (udRequest.locale === 'ja_JP') {
        baseUrl = BENESSE_BASE_URL;
    }
    if (udRequest.locale === 'ko_KR') {
        if (path === 'request-demo-mx') {
            baseUrl = UDEMYKOREA_BUSINESS_DEMO_PATH;
        } else {
            baseUrl = UDEMYKOREA_BUSINESS_PATH;
        }
    }

    // Onsite demo request experiment
    if (
        path === 'request-demo' &&
        udRequest.locale !== 'ja_JP' &&
        udRequest.locale !== 'ko_KR' &&
        udRequest.locale !== 'de_DE'
    ) {
        if (getVariantValue('sw', 'onsite_demo_form', false) || isOnsiteRequestDemo) {
            return udLink.to('organization-growth/request-demo', null, {
                ...params,
                locale: udRequest.locale,
                next: encodeURIComponent(serverOrClient.global.location?.href) || '',
                ...getMarketoUTMParameters(),
            });
        }

        if (udConfig.price_country.id === 'IN') {
            baseUrl = `${UDEMY_BUSINESS_PATH}request-demo-in-mx/`;
        } else {
            baseUrl = `${UDEMY_BUSINESS_PATH}request-demo-mx/`;
        }
    }

    const urlSearchParams = new URLSearchParams({...params, locale: udRequest.locale});
    return `${baseUrl}?${urlSearchParams.toString()}`;
}
