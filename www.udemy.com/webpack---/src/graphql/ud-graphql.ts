import axios from 'axios';

import {getConfigData} from '@udemy/shared-utils';
import {getHttpCacheHeaders} from '@udemy/ud-api';

/** Creates a globally-unique ID from a given type & ID */
export function toGlobalId(type: string, id: number) {
    return btoa(`${type}:${id}`);
}

/** Converts a global id to readable string */
export function fromGlobalId(globalId: string) {
    return atob(globalId);
}

/** Return the id portion from a global id */
export function idFromGlobalId(globalId: string) {
    return parseInt(fromGlobalId(globalId).split(':')[1], 10);
}

/**
 * Makes a GraphQL query.
 * https://graphql.org/learn/serving-over-http/#post-request
 *
 * udGraphql.query({
 *     query: `
 *         query getFoo {
 *             foo
 *         }
 *     `,
 *     variables: {},
 * })
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function udQuery(params: any, additionalHeaders = {}) {
    const udConfig = getConfigData();

    try {
        const response = await axios.post(udConfig.graphql_federation_endpoint, params, {
            headers: {
                'Content-Type': 'application/json',
                ...getHttpCacheHeaders(),
                ...additionalHeaders,
            },
        });
        const data = response.data || {};
        if (data.errors) {
            return Promise.reject({...data, statusCode: response.status});
        }
        return data;
    } catch (e) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = e as any;
        const errorResponse = err.response || {};
        return Promise.reject({...errorResponse.data, statusCode: errorResponse.status});
    }
}
