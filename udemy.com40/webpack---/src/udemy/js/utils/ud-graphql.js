import axios from 'axios';

import getConfigData from 'utils/get-config-data';
import {getHttpCacheHeaders} from 'utils/ud-api';

/** Creates a globally-unique ID from a given type & ID */
export function toGlobalId(type, id) {
    return btoa(`${type}:${id}`);
}

/** Converts a global id to readable string */
export function fromGlobalId(globalId) {
    return atob(globalId);
}

/** Return the id portion from a global id */
export function idFromGlobalId(globalId) {
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
async function query(params, additionalHeaders = {}) {
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
        const errorResponse = e.response || {};
        return Promise.reject({...errorResponse.data, statusCode: errorResponse.status});
    }
}

export default {query};
