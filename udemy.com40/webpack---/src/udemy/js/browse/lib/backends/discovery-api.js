import {
    PAGE_TYPE_CATEGORY,
    PAGE_TYPE_CART,
    PAGE_TYPE_CART_PURCHASE,
    PAGE_TYPE_CART_MULTIPLE_PURCHASE,
    PAGE_TYPE_CART_PURCHASE_CONFIRMATION,
    PAGE_TYPE_CART_SUBSCRIBE,
    PAGE_TYPE_CART_SUCCESS,
    PAGE_TYPE_CART_SUCCESS_MODAL,
    PAGE_TYPE_CART_SUCCESS_MODAL_MOBILE,
    PAGE_TYPE_COLLECTION,
    PAGE_TYPE_COURSE_LANDING_PAGE_BUNDLE,
    PAGE_TYPE_COURSE_LANDING_PAGE_COURSE,
    PAGE_TYPE_ORG_COURSE_LANDING_PAGE,
    PAGE_TYPE_COURSE_LANDING_PAGE_DISABLED_COURSE_LABEL,
    PAGE_TYPE_COURSE_LANDING_PAGE_DISABLED_COURSE_CATEGORY,
    PAGE_TYPE_COURSE_LANDING_PAGE_FREE_COURSE,
    PAGE_TYPE_FREE_TOPIC,
    PAGE_TYPE_LOGOUT_PAGE,
    PAGE_TYPE_LOGGED_IN_HOMEPAGE,
    PAGE_TYPE_LOGGED_OUT_HOMEPAGE,
    PAGE_TYPE_OCCUPATION_LANDING_PAGE,
    PAGE_TYPE_OCCUPATION_RESULT_PAGE,
    PAGE_TYPE_ORG_CATEGORY,
    PAGE_TYPE_ORG_LOGGED_IN_HOMEPAGE,
    PAGE_TYPE_ORG_SUBCATEGORY,
    PAGE_TYPE_SUBS_TOPIC,
    PAGE_TYPE_SUBCATEGORY,
    PAGE_TYPE_TOPIC,
    PAGE_TYPE_TOPIC_BUNDLE,
    PAGE_TYPE_TOPIC_CLP,
    PAGE_TYPE_ORG_TOPIC,
    PAGE_TYPE_FEATURED_TOPICS,
    PAGE_TYPE_GOV_LOGGED_IN_HOMEPAGE,
    PAGE_TYPE_PERSONALIZED_LOGGED_OUT_HOMEPAGE,
    PAGE_TYPE_LLP,
    PAGE_TYPE_LEARNING_PATH,
    PAGE_TYPE_SEQUENCE_LANDING_PAGE,
    PAGE_TYPE_SUBS_LOGGED_IN_HOMEPAGE,
    PAGE_TYPE_SUBS_LANDING_PAGE,
    PAGE_TYPE_SUBS_CATEGORY,
    PAGE_TYPE_SUBS_SUBCATEGORY,
    PAGE_TYPE_COURSE_RETIREMENT,
    PAGE_TYPE_LECTURE_QUICK_VIEW,
} from '@udemy/discovery-api';
import {snakeCaseCopy} from '@udemy/shared-utils';

import getConfigData from 'utils/get-config-data';
import getRequestData from 'utils/get-request-data';
import udApi from 'utils/ud-api';
import udBrowse from 'utils/ud-browse';

/**
 * WARNING: This implementation of the DiscoveryAPI is DEPRECATED, and has been replaced by a TS verison
 * in the @udemy/discovery-api package:
 * https://github.com/udemy/frontends-components/blob/main/packages/discovery-api/src/discovery-api/discovery-api.ts
 *
 * This file is being kept around while we migrate existing usages of this API and the associated constants in the
 * monolith as part of this
 */
export default class DiscoveryAPI {
    PAGE_TYPE_TO_PARAMS = {
        [PAGE_TYPE_LLP]: {
            context: 'landing-page',
            source_page: 'lecture_landing_page',
        },
        [PAGE_TYPE_COURSE_LANDING_PAGE_BUNDLE]: {
            context: 'clp-bundle',
            source_page: 'course_landing_page',
            funnel_context: 'landing-page',
        },
        [PAGE_TYPE_CART]: {
            context: 'cart',
            source_page: 'cart_page',
        },
        [PAGE_TYPE_CART_PURCHASE]: {
            context: 'success',
            source_page: 'success_page',
        },
        [PAGE_TYPE_CART_MULTIPLE_PURCHASE]: {
            context: 'success',
            source_page: 'success_page',
        },
        [PAGE_TYPE_CART_PURCHASE_CONFIRMATION]: {
            context: 'success',
            source_page: 'success_page',
        },
        [PAGE_TYPE_CART_SUBSCRIBE]: {
            context: 'success',
            source_page: 'success_page',
        },
        [PAGE_TYPE_CART_SUCCESS]: {
            context: 'mw_add_to_cart',
            source_page: 'course_landing_page',
        },
        [PAGE_TYPE_CART_SUCCESS_MODAL]: {
            context: 'add_to_cart',
            source_page: 'course_landing_page',
        },
        [PAGE_TYPE_CART_SUCCESS_MODAL_MOBILE]: {
            context: 'mw_add_to_cart',
            source_page: 'course_landing_page',
        },
        [PAGE_TYPE_CATEGORY]: {
            context: 'category',
            source_page: 'category_page',
            fl: 'cat',
            sos: 'pc',
        },
        [PAGE_TYPE_COURSE_LANDING_PAGE_COURSE]: {
            context: 'landing-page',
            source_page: 'course_landing_page',
        },
        [PAGE_TYPE_ORG_COURSE_LANDING_PAGE]: {
            context: 'org-landing-page',
            source_page: 'course_landing_page',
        },
        [PAGE_TYPE_COURSE_LANDING_PAGE_DISABLED_COURSE_LABEL]: {
            context: 'disabled_course_label',
            source_page: 'course_landing_page',
        },
        [PAGE_TYPE_COURSE_LANDING_PAGE_DISABLED_COURSE_CATEGORY]: {
            context: 'disabled_course_cat',
            source_page: 'course_landing_page',
        },
        [PAGE_TYPE_COURSE_LANDING_PAGE_FREE_COURSE]: {
            context: 'clp-free',
            source_page: 'course_landing_page',
        },
        [PAGE_TYPE_ORG_CATEGORY]: {
            context: 'org_category',
            source_page: 'org_category_page',
            fl: 'cat',
            sos: 'pc',
        },
        [PAGE_TYPE_SUBCATEGORY]: {
            context: 'subcategory',
            source_page: 'subcategory_page',
            fl: 'scat',
            sos: 'ps',
        },
        [PAGE_TYPE_ORG_SUBCATEGORY]: {
            context: 'org_subcategory',
            source_page: 'org_subcategory_page',
            fl: 'scat',
            sos: 'ps',
        },
        [PAGE_TYPE_LOGGED_IN_HOMEPAGE]: {context: 'featured', source_page: 'logged_in_homepage'},
        [PAGE_TYPE_SUBS_CATEGORY]: {
            context: 'subs_category',
            source_page: 'category_page',
            fl: 'cat',
            sos: 'pc',
        },
        [PAGE_TYPE_SUBS_LOGGED_IN_HOMEPAGE]: {
            context: 'subs_featured',
            source_page: 'logged_in_homepage',
        },
        [PAGE_TYPE_SUBS_SUBCATEGORY]: {
            context: 'subs_subcategory',
            source_page: 'subcategory_page',
            fl: 'scat',
            sos: 'ps',
        },
        [PAGE_TYPE_LOGGED_OUT_HOMEPAGE]: {context: 'home', source_page: 'logged_out_homepage'},
        [PAGE_TYPE_LOGOUT_PAGE]: {context: 'logout', source_page: 'logout_page'},
        [PAGE_TYPE_ORG_LOGGED_IN_HOMEPAGE]: {
            context: 'org_featured',
            source_page: 'org_logged_in_homepage',
        },
        [PAGE_TYPE_GOV_LOGGED_IN_HOMEPAGE]: {
            context: 'gov_featured',
            source_page: 'org_logged_in_homepage',
        },
        [PAGE_TYPE_TOPIC]: {context: 'topic', source_page: 'topic_page', fl: 'lbl', sos: 'pl'},
        [PAGE_TYPE_TOPIC_CLP]: {
            context: 'landing-page-with-topic',
            source_page: 'course_landing_page',
            fl: 'lbl',
            sos: 'pl',
        },
        [PAGE_TYPE_FREE_TOPIC]: {
            context: 'topic',
            source_page: 'free_topic_page',
            fl: 'lbl',
            sos: 'pl',
        },
        [PAGE_TYPE_ORG_TOPIC]: {
            context: 'org_topic',
            source_page: 'org_topic_page',
            fl: 'lbl',
            sos: 'pl',
        },
        [PAGE_TYPE_SUBS_TOPIC]: {
            context: 'subs_topic',
            source_page: 'topic_page',
            fl: 'lbl',
            sos: 'pl',
        },
        [PAGE_TYPE_FEATURED_TOPICS]: {source_page: 'featured_topics_page'},
        [PAGE_TYPE_TOPIC_BUNDLE]: {
            context: PAGE_TYPE_TOPIC_BUNDLE,
            source_page: 'topic_page',
            funnel_context: 'topic',
        },
        [PAGE_TYPE_PERSONALIZED_LOGGED_OUT_HOMEPAGE]: {
            context: PAGE_TYPE_PERSONALIZED_LOGGED_OUT_HOMEPAGE,
            source_page: PAGE_TYPE_LOGGED_OUT_HOMEPAGE,
        },
        // In the case of collections, context is passed in via options
        [PAGE_TYPE_COLLECTION]: {
            context: '',
            source_page: PAGE_TYPE_COLLECTION,
            sos: 'pcoll',
            fl: 'coll',
        },
        [PAGE_TYPE_LEARNING_PATH]: {
            context: 'learning_path',
            source_page: 'learning_path_page',
            fl: 'lbl',
            sos: 'pl',
        },
        [PAGE_TYPE_SEQUENCE_LANDING_PAGE]: {
            context: 'series-landing-page',
            source_page: 'series_landing_page',
        },
        [PAGE_TYPE_OCCUPATION_LANDING_PAGE]: {
            context: 'occ_landing_page',
            source_page: PAGE_TYPE_OCCUPATION_LANDING_PAGE,
        },
        [PAGE_TYPE_OCCUPATION_RESULT_PAGE]: {
            context: 'occupation_result',
            source_page: 'occupation_result_page',
        },
        [PAGE_TYPE_SUBS_LANDING_PAGE]: {
            context: 'subs_landing_page',
            source_page: 'subs_landing_page',
        },
        [PAGE_TYPE_COURSE_RETIREMENT]: {
            context: 'course_retirement',
            source_page: 'course_retirement_page',
            fl: 'lbl',
            sos: 'pl',
        },
        [PAGE_TYPE_LECTURE_QUICK_VIEW]: {
            context: 'mls_next_lecture_reco',
            source_page: 'search_page',
        },
    };

    OBJECT_ID_PARAMS = {
        [PAGE_TYPE_CATEGORY]: 'category_id',
        [PAGE_TYPE_COLLECTION]: 'collection_id',
        [PAGE_TYPE_CART_SUCCESS_MODAL]: 'course_id',
        [PAGE_TYPE_COURSE_LANDING_PAGE_COURSE]: 'course_id',
        [PAGE_TYPE_ORG_COURSE_LANDING_PAGE]: 'course_id',
        [PAGE_TYPE_COURSE_LANDING_PAGE_BUNDLE]: 'course_id',
        [PAGE_TYPE_COURSE_LANDING_PAGE_DISABLED_COURSE_LABEL]: 'course_id',
        [PAGE_TYPE_COURSE_LANDING_PAGE_DISABLED_COURSE_CATEGORY]: 'course_id',
        [PAGE_TYPE_COURSE_LANDING_PAGE_FREE_COURSE]: 'course_id',
        [PAGE_TYPE_ORG_CATEGORY]: 'category_id',
        [PAGE_TYPE_SUBS_CATEGORY]: 'category_id',
        [PAGE_TYPE_SUBCATEGORY]: 'subcategory_id',
        [PAGE_TYPE_SUBS_SUBCATEGORY]: 'subcategory_id',
        [PAGE_TYPE_ORG_SUBCATEGORY]: 'subcategory_id',
        [PAGE_TYPE_TOPIC]: 'label_id',
        [PAGE_TYPE_SUBS_TOPIC]: 'label_id',
        [PAGE_TYPE_FREE_TOPIC]: 'label_id',
        [PAGE_TYPE_TOPIC_BUNDLE]: 'label_id',
        [PAGE_TYPE_TOPIC_CLP]: 'course_id',
        [PAGE_TYPE_ORG_TOPIC]: 'label_id',
        [PAGE_TYPE_LLP]: 'course_id',
        [PAGE_TYPE_LECTURE_QUICK_VIEW]: 'lecture_id',
    };

    constructor(options, globalOverrides = {}) {
        options = {
            useCache: false,
            ...options,
        };
        this._useCache = options.useCache;
        this.discoveryUnitsApiUrl = '/discovery-units/';
        this.discoveryUnitsAllCoursesApiUrl = '/discovery-units/all_courses/';
        this.globalOverrides = globalOverrides;
    }

    /**
     * Load courses from category ID
     */
    loadCourses(pageType, options = {}) {
        const {params, prefetchKey} = this._buildParamsForDiscoveryUnits(pageType, options);
        this._addAllCoursesParams(params, pageType);

        return this._callDiscoveryUnitsAPI(
            prefetchKey,
            params,
            this.discoveryUnitsAllCoursesApiUrl,
        ).then((response) => {
            return {
                ...response.data.unit,
                pagination: response.data.unit.pagination,
            };
        });
    }

    /**
     * If there is prefetched data available for the given pageType, that data is returned
     * instead of making a normal API call. Note: prefetched data is cleared after the first call,
     * so subsequent calls will always attempt to make a real API request.
     */
    loadUnits(pageType, options) {
        const defaults = {
            from: 0,
            pageSize: 3,
            itemCount: 12,
        };

        const optionsWithDefaults = {
            ...defaults,
            ...options,
        };

        const {params, prefetchKey} = this._buildParamsForDiscoveryUnits(
            pageType,
            optionsWithDefaults,
        );

        return this._callDiscoveryUnitsAPI(prefetchKey, params, this.discoveryUnitsApiUrl).then(
            (response) => {
                const data = response.data;
                const units = data.units || [];
                return {
                    has_more: units.length > 0 && data.more_units_available,
                    last_index: data.last_unit_index,
                    results: units,
                };
            },
        );
    }

    loadItemsForUnit(unit, pageType, options = {}) {
        this._assertValidPageType(pageType);

        const url = unit.url.replace(/^\/api-2\.0/, '');

        const params = snakeCaseCopy(options);

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
            } = response.data.unit;
            return {
                items,
                remaining_item_count: remainingItemCount,
                unit: response.data.unit,
                pagination: data.unit.pagination ? data.unit.pagination : null,
                tracking_id: trackingId,
            };
        });
    }

    _buildParamsForDiscoveryUnits(pageType, options = {}) {
        this._assertValidPageType(pageType);

        const {context} = this.PAGE_TYPE_TO_PARAMS[pageType];
        const {pageObjectId, prefetchKey = null, ...restOfOptions} = options;

        const params = {
            context,
            ...snakeCaseCopy(restOfOptions),
            ...(pageObjectId && {[this.OBJECT_ID_PARAMS[pageType]]: pageObjectId}),
        };

        this._addSourcePageToParams(params, pageType);
        this._addLocaleAndCurrencyToParams(params);
        this._addExcludedCourseIdsToParams(params, options);
        this._addSkipPriceToParams(params);
        this._addFunnelContextToParams(params, pageType);

        return {params, prefetchKey};
    }

    _callDiscoveryUnitsAPI(prefetchKey, params, url) {
        // Check for a single-use promise set by browse/__base.html
        // Note: if that file changes, this method may have to change as well
        if (prefetchKey && udBrowse.prefetchPromises && udBrowse.prefetchPromises[prefetchKey]) {
            return udBrowse.prefetchPromises[prefetchKey].then((response) => {
                udBrowse.prefetchPromises[prefetchKey] = null;
                return {data: JSON.parse(response)};
            });
        }

        return udApi.get(url, this._getApiConfig(params));
    }

    _addExcludedCourseIdsToParams(params, options) {
        if (options.excludedCourseIds) {
            params.excluded_course_ids = options.excludedCourseIds.join(',');
        }
    }

    _addSourcePageToParams(params, pageType) {
        params.source_page = this.PAGE_TYPE_TO_PARAMS[pageType].source_page;
    }

    _addFunnelContextToParams(params, pageType) {
        if (
            Object.prototype.hasOwnProperty.call(
                this.PAGE_TYPE_TO_PARAMS[pageType],
                'funnel_context',
            )
        ) {
            params.funnel_context = this.PAGE_TYPE_TO_PARAMS[pageType].funnel_context;
        }
    }

    _addAllCoursesParams(params, pageType) {
        const translatedParams = this.PAGE_TYPE_TO_PARAMS[pageType];
        params.sos = translatedParams.sos;
        params.fl = translatedParams.fl;
        delete params.context;
    }

    _addLocaleAndCurrencyToParams(params) {
        const udConfig = this.globalOverrides.Config ?? getConfigData();
        const udRequest = this.globalOverrides.request ?? getRequestData();
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

    _getApiConfig(params) {
        return {params, useCache: this._useCache};
    }

    _assertValidPageType(pageType) {
        if (this.PAGE_TYPE_TO_PARAMS[pageType] === undefined) {
            throw new TypeError(`Invalid page type "${pageType}"`);
        }
    }

    _addSkipPriceToParams(params) {
        params.skip_price = true;
    }
}
