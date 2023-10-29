import qs from 'qs';
import {useEffect, useMemo, useReducer} from 'react';

import {AnalyzedQueryData} from 'search/analyzed-query/analyzed-query.react-component';
import {CourseSearchResult} from 'search/types/course-search-result';
import getConfigData from 'utils/get-config-data';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

const udConfig = getConfigData();

interface Aggregation {
    allTitle: string;
    key: string;
    options: {
        count: number;
        key: string;
        title: string;
        value: number;
    }[];
    title: string;
}

interface SortOption {
    key: string;
    label: string;
    url: string;
}

interface SearchResults {
    aggregations?: Aggregation[];
    analyzed_query?: AnalyzedQueryData[];
    backoff_languages?: string[];
    boosted_language?: string;
    count: number;
    courses?: CourseSearchResult[];
    detected_language?: string;
    has_courses_for_org?: boolean;
    inferred_language_key?: string;
    is_inferred_language?: boolean;
    inferred_probability?: number;
    original_phrase?: string;
    pagination: {
        total_page: number;
    };
    paid_alternative?: CourseSearchResult;
    query?: Record<string, string>;
    query_language_inference_tracking_id?: string;
    query_operation: {
        phrase: string;
    };
    search_tracking_id: string;
    sort_options: {
        current_sort_option: SortOption;
        options: SortOption[];
    };
    suggestion: {
        phrase?: string;
    };
    topic: {
        id: number;
        title: string;
    };
}

interface State {
    isLoading: boolean;
    isError: boolean;
    data?: SearchResults;
    error?: string;
}

type Action =
    | {type: 'FETCH_REQUEST'}
    | {type: 'FETCH_SUCCESS'; payload: SearchResults}
    | {type: 'FETCH_FAILURE'; payload: string};

const reducer = (prevState: State, action: Action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...prevState, isLoading: true};
        case 'FETCH_SUCCESS': {
            return {...prevState, isLoading: false, data: action.payload};
        }
        case 'FETCH_FAILURE':
            return {...prevState, isLoading: false, error: action.payload};
        default:
            Raven.captureException('API fetch error');
            return prevState;
    }
};

export const useSearchAPI = (
    search: string,
    subsCollectionIds?: number,
    initialData?: SearchResults,
    searchRef?: string,
) => {
    const searchParams = useMemo(() => new URLSearchParams(search), [search]);
    searchParams.append('skip_price', String(true));
    if (subsCollectionIds) {
        searchParams.append('subs_coll_id', subsCollectionIds.toString());
    }

    const [state, dispatch] = useReducer(reducer, {
        isLoading: false,
        isError: false,
        data: initialData,
    });
    const organizationId = udConfig.brand.organization.id;
    const searchUrl = organizationId
        ? `/organizations/${organizationId}/search-courses/v2/`
        : '/search-courses/';
    useEffect(() => {
        let cancelled = false;

        const fetchSearchResults = async (url = searchUrl) => {
            dispatch({type: 'FETCH_REQUEST'});
            const {data} = await udApi
                .get(url, {
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        ...(Boolean(searchRef) && {'Search-Ref': searchRef}),
                    },
                    params: qs.parse(searchParams.toString()),
                    paramsSerializer: (params) => {
                        return qs.stringify(
                            Object.entries(params).reduce((acc, [key, value]) => {
                                return {
                                    ...acc,
                                    [key]: Array.isArray(value) ? value.join('|') : value, // search API only accepts this format for array values
                                };
                            }, {}),
                        );
                    },
                })
                .catch((err) => {
                    !cancelled && dispatch({type: 'FETCH_FAILURE', payload: err.message});
                    return Promise.reject(err.message);
                });

            const aggregationKeys = ['courseLabel', 'features', 'closed_captions']; // These aggregation objects do not contain the "selected" attribute from the API
            const aggregations = data.aggregations.map((aggregation: Aggregation) => {
                if (aggregationKeys.includes(aggregation.key)) {
                    const selectedValues = searchParams.getAll(aggregation.key);
                    return {
                        ...aggregation,
                        options: aggregation.options.map((option) => ({
                            ...option,
                            ...(selectedValues.includes(String(option.value)) && {
                                selected: true,
                            }),
                        })),
                    };
                }
                return aggregation;
            });

            !cancelled && dispatch({type: 'FETCH_SUCCESS', payload: {...data, aggregations}});
        };

        searchParams !== null && fetchSearchResults();

        return () => {
            cancelled = true;
        };
    }, [searchParams, searchRef, searchUrl]);

    return state;
};
