import {udApi, udParamsSerializer} from './ud-api';

export interface CommonAppDataResponse<TData> {
    data: TData;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let inFlightRequests: Record<string, Promise<CommonAppDataResponse<any>>> = {};

/**
 * Fetches data from the `/api-2.0/contexts/me` endpoint and dedupes requests with the
 * same query params
 * @param params an object containing the query params specifying which data to fetch
 */
export async function fetchCommonAppData<TData>(
    params: Record<string, string | number | boolean>,
): Promise<CommonAppDataResponse<TData>> {
    const serializedParams = udParamsSerializer(params, {});
    let requestPromise = inFlightRequests[serializedParams];
    if (!requestPromise) {
        requestPromise = udApi.get('/contexts/me/', {params}).then((response) => {
            delete inFlightRequests[serializedParams];
            return response.data ? response : new Promise(() => null);
        });
        inFlightRequests[serializedParams] = requestPromise;
    }

    return requestPromise;
}

fetchCommonAppData.reset = () => {
    inFlightRequests = {};
};
