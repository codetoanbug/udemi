import {toBusinessUdemy} from '@udemy/organization';

import {toLocaleDateString} from 'utils/date';
import getConfigData from 'utils/get-config-data';
import udMe from 'utils/ud-me';

const udConfig = getConfigData();

function withUserDetails(params = {}) {
    return {
        first_name: udMe.name || '',
        last_name: udMe.surname || '',
        company_name: udConfig.brand.title,
        email: udMe.email,
        ...params,
    };
}

// Generates a URL based on organization payment status
export function generateUpsellFormURL(extraParams = {}) {
    const params = withUserDetails(extraParams);

    const isTrial = !udConfig.brand.organization || udConfig.brand.organization.is_test;
    return toBusinessUdemy(isTrial ? 'request-demo' : 'upgrade', params);
}

export function generateDemoURL(extraParams = {}) {
    const params = withUserDetails(extraParams);
    return toBusinessUdemy('request-demo', params);
}

export function formatDate(date) {
    return toLocaleDateString(date instanceof Date ? date : new Date(date), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
