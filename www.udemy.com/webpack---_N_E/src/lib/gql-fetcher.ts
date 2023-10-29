import {createFetcher} from '@udemy/graphql';

import {getRuntimeConfig} from '../pages/api/config.api';
import {createRequestContext, HTTP_REQUEST_CONTEXT_HEADER} from './service-request-context';

export const fetcher = createFetcher({
    getUrl: () => {
        const fullGraphQLUrl = new URL(getRuntimeConfig('GRAPHQL_URL'), 'https://www.udemy.com');
        const isServer = typeof window === 'undefined';
        return isServer
            ? fullGraphQLUrl.toString()
            : `${window.location.origin}${fullGraphQLUrl.pathname}`;
    },
    getHeaders: (options) => {
        const requestContext = createRequestContext({headers: options});
        const requestContextHeader = Buffer.from(requestContext.serializeBinary()).toString(
            'base64',
        );
        return {
            [HTTP_REQUEST_CONTEXT_HEADER]: requestContextHeader,
        };
    },
});
