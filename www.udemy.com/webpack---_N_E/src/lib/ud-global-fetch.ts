import {udApi, version} from '@udemy/ud-api';

import {getRuntimeConfig} from 'src/pages/api/config.api';

export const udemyApi = (() => {
    udApi.configure({
        getBaseUrl: () => {
            // If this is a server-side request, we want to directly call the full
            // monolith URL. Otherwise, we can call the API just using the pathname
            // prefixed with a base path
            // (e.g. /frontends-marketplace-experience/api-2.0/... in dev)
            const isServer = typeof window === 'undefined';
            return isServer
                ? `${getRuntimeConfig('MONOLITH_URL')}/${version}/`
                : `${process.env.APP_BASE_PATH}${version}/`;
        },
    });
    return udApi;
})();
