import {serverOrClient, snakeCaseCopy} from '@udemy/shared-utils';
import {getConfigData, getRequestData} from '@udemy/shared-utils';
import {udApi} from '@udemy/ud-api';
import {UDData} from '@udemy/ud-data';

import {OBJECT_ID_PARAMS, PAGE_TYPE_TO_PARAMS} from '../constants';
import {
    DiscoveryAPIConfig,
    DiscoveryAPIContextResponse,
    DiscoveryAPIContextResponseInternal,
    DiscoveryAPICourseLoadingParams,
    DiscoveryAPIDirectResponse,
    DiscoveryAPIOptions,
    DiscoveryAPIParams,
    DiscoveryAPIUnitItemsResponse,
} from '../types/discovery-api';
import {DiscoveryUnit} from '../types/discovery-unit';

type DiscoveryAPIContextAPIResponse = {
    data: DiscoveryAPIContextResponseInternal;
};

/**
 * This supports legacy pre-fetching of units in the monolith via Django tempaltes.
 * It should not be relied on or used in a frontends application.
 */
export const udBrowse = serverOrClient.global.UD.browse || {};

export class DiscoveryAPI {
    _useCache;
    discoveryUnitsApiUrl = '/discovery-units/';
    discoveryUnitsAllCoursesApiUrl = '/discovery-units/all_courses/';
    globalOverrides?: UDData;

    constructor(options?: DiscoveryAPIConfig, globalOverrides?: UDData) {
        this._useCache = options?.useCache ?? false;
        this.globalOverrides = globalOverrides;
    }

    /**
     * Load courses from /discovery-units/all_courses/ API endpoint
     */
    async loadCourses<TItem>(
        pageType: string,
        options: DiscoveryAPIOptions = {},
    ): Promise<DiscoveryUnit<TItem> | undefined> {
        const {params} = this._buildConfigForDiscoveryUnitsRequest(pageType, options);
        // _buildConfigForDiscoveryUnitsRequest ensure that params are not undefined in this context
        const paramsUnwrapped = params as DiscoveryAPICourseLoadingParams;
        this._addAllCoursesParams(paramsUnwrapped, pageType);

        return this._callDiscoveryUnitsAPI<DiscoveryAPIDirectResponse<TItem>>(
            this.discoveryUnitsAllCoursesApiUrl,
            paramsUnwrapped,
        ).then((response) => {
            if ('unit' in response) {
                return response.unit;
            }
        });
    }

    async loadUnits(
        pageType: string,
        options: DiscoveryAPIOptions = {},
    ): Promise<DiscoveryAPIContextResponse> {
        const defaults = {
            from: 0,
            pageSize: 3,
            itemCount: 12,
        };

        const optionsWithDefaults = {
            ...defaults,
            ...options,
        };

        const {params, prefetchKey} = this._buildConfigForDiscoveryUnitsRequest(
            pageType,
            optionsWithDefaults,
        );
        // _buildConfigForDiscoveryUnitsRequest ensure that params are not undefined in this context
        const paramsUnwrapped = params as DiscoveryAPIParams;

        return this._callDiscoveryUnitsAPI<DiscoveryAPIContextAPIResponse>(
            this.discoveryUnitsApiUrl,
            paramsUnwrapped,
            prefetchKey,
        ).then((response) => {
            const data = response.data as DiscoveryAPIContextResponseInternal;
            const units = data.units || [];
            return {
                has_more: units.length > 0 && !!data.more_units_available,
                last_index: data.last_unit_index,
                results: units,
            };
        });
    }

    async loadItemsForUnit<TItem>(
        unit: Pick<DiscoveryUnit, 'url'>,
        pageType: string,
        options: DiscoveryAPIOptions = {},
    ): Promise<DiscoveryAPIUnitItemsResponse<TItem>> {
        this._assertValidPageType(pageType);

        // Units passed into this method should always have a URL, but AFAIK not all units are
        // necessarily returned with a URL so I left it as optional on the DiscoveryUnit type.
        const url = unit.url?.replace(/^\/api-2\.0/, '') ?? '';

        const params = snakeCaseCopy(options as Record<string, unknown>);

        this._addSourcePageToParams(params, pageType);
        this._addLocaleAndCurrencyToParams(params);
        this._addExcludedCourseIdsToParams(params, options);
        this._addSkipPriceToParams(params);

        return udApi.get(url, this._getApiConfig(params)).then((response) => {
            const data = response.data;
            const {
                items,
                remaining_item_count: remainingItemCount,
                tracking_id: trackingId,
            } = data.unit;
            return {
                items,
                remaining_item_count: remainingItemCount,
                unit: response.data.unit,
                pagination: data.unit.pagination,
                tracking_id: trackingId,
                type: data.unit.type,
            };
        });
    }

    private _buildConfigForDiscoveryUnitsRequest(
        pageType: string,
        options?: DiscoveryAPIOptions,
    ): DiscoveryAPIConfig {
        this._assertValidPageType(pageType);

        let context;
        if ('context' in PAGE_TYPE_TO_PARAMS[pageType]) {
            context = (PAGE_TYPE_TO_PARAMS[pageType] as {context: string})?.context;
        }
        const {pageObjectId, prefetchKey, ...restOfOptions} = options as DiscoveryAPIOptions;

        const params: DiscoveryAPIParams = {
            context,
            ...snakeCaseCopy(restOfOptions as Record<string, unknown>),
            ...(pageObjectId && {[OBJECT_ID_PARAMS[pageType]]: pageObjectId}),
        };

        this._addSourcePageToParams(params, pageType);
        this._addLocaleAndCurrencyToParams(params);
        this._addExcludedCourseIdsToParams(params, options);
        this._addSkipPriceToParams(params);
        this._addFunnelContextToParams(params, pageType);

        return {params, prefetchKey};
    }

    private _callDiscoveryUnitsAPI<TResponseType>(
        url: string,
        params: DiscoveryAPIParams,
        prefetchKey?: string,
    ): Promise<TResponseType> {
        // Check for a single-use promise set by browse/__base.html
        // Note: if that file changes, this method may have to change as well
        if (prefetchKey && udBrowse.prefetchPromises && udBrowse.prefetchPromises[prefetchKey]) {
            return udBrowse.prefetchPromises[prefetchKey].then((response: string) => {
                udBrowse.prefetchPromises[prefetchKey] = null;
                return {data: JSON.parse(response)};
            });
        }

        return udApi.get(url, this._getApiConfig(params));
    }

    private _addExcludedCourseIdsToParams(
        params: DiscoveryAPIParams,
        options?: DiscoveryAPIOptions,
    ) {
        if (options && options.excludedCourseIds) {
            params.excluded_course_ids = options.excludedCourseIds.join(',');
        }
    }

    private _addSourcePageToParams(params: DiscoveryAPIParams, pageType: string) {
        params.source_page = PAGE_TYPE_TO_PARAMS[pageType].source_page;
    }

    private _addFunnelContextToParams(params: DiscoveryAPIParams, pageType: string) {
        if (Object.prototype.hasOwnProperty.call(PAGE_TYPE_TO_PARAMS[pageType], 'funnel_context')) {
            params.funnel_context = PAGE_TYPE_TO_PARAMS[pageType].funnel_context;
        }
    }

    private _addAllCoursesParams(params: DiscoveryAPICourseLoadingParams, pageType: string) {
        const translatedParams = PAGE_TYPE_TO_PARAMS[pageType];
        if ('sos' in translatedParams && translatedParams.sos) {
            params.sos = translatedParams.sos;
        }
        if ('fl' in translatedParams && translatedParams.fl) {
            params.fl = translatedParams.fl;
        }
        if ('context' in params) {
            delete params.context;
        }
    }

    private _addLocaleAndCurrencyToParams(params: DiscoveryAPIParams) {
        const udConfig = this.globalOverrides?.Config ?? getConfigData();
        const udRequest = this.globalOverrides?.request ?? getRequestData();
        if (udRequest.locale) {
            params.locale = udRequest.locale;
        }

        if (udConfig.price_country && udConfig.price_country.currency) {
            params.currency = udConfig.price_country.currency;
        }

        if (udRequest.navigation_locale) {
            params.navigation_locale = udRequest.navigation_locale;
        }
    }

    private _getApiConfig(params: DiscoveryAPIParams): DiscoveryAPIConfig {
        return {params, useCache: this._useCache};
    }

    private _assertValidPageType(pageType: string) {
        if (PAGE_TYPE_TO_PARAMS[pageType] === undefined) {
            throw new TypeError(`Invalid page type "${pageType}"`);
        }
    }

    private _addSkipPriceToParams(params: DiscoveryAPIParams) {
        params.skip_price = true;
    }
}
