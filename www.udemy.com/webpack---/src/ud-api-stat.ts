import {AxiosError, AxiosResponse} from 'axios';

import {udApi} from './ud-api';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export const udApiStat = {
    // Don't forget to add the namespace of the metric
    increment(
        key: string,
        tags: unknown,
        callback: (response: AxiosResponse) => void = noop,
        errorCallback: (error: AxiosError) => void = noop,
    ) {
        // to "udemy.visit.api.v2.constants.ALLOWED_DATADOG_KEY_NAMESPACES"
        udApi
            .post('/visits/me/datadog-increment-logs/', {
                key,
                tags: JSON.stringify(tags),
            })
            .then(callback)
            .catch(errorCallback);
    },
};
