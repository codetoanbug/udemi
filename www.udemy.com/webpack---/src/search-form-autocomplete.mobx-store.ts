import axios from 'axios';
import {action, computed, observable} from 'mobx';

import {I18nApi} from '@udemy/i18n';
import {udApi} from '@udemy/ud-api';

import {
    AutocompleteSuggestionsQuery,
    useAutocompleteSuggestionsQuery,
} from './graphql/api-platform-graphql';
import {mapGraphqlResultsToAutocompleteResults} from './graphql/graphql-results-util';

/**
 * Represents load state of store
 */
export const AUTOSUGGEST_LOADING_STATE = {
    NOT_LOADED: 'NOT_LOADED',
    LOADING: 'LOADING',
    LOADED: 'LOADED',
};

/**
 * Represents params for SearchFormAutoCompleteStore
 */
export interface SearchFormAutoCompleteStoreParams {
    captureException?: (e: DOMException) => void;
    getAPIParams?: () => Record<string, string>;
    getFormParams?: () => Record<string, string>;
    gettext: I18nApi['gettext'];
    isPopularQueriesExperimentEnabled?: boolean;
    searchFormExperimentFeatures?: SearchFormExperimentFeatures;
    url: string;
    inputValue?: string;
}

/**
 * Represents AutoCompleteResult produced by SearchFormAutoCompleteStore
 */
export type AutoCompleteResultType = 'course' | 'user' | 'search_log' | 'rvc';
export interface AutoCompleteResult {
    id: number;
    tracking_id?: string;
    result_tracking_id?: string;
    url: string;
    // These are remapping
    label?: string;
    type?: AutoCompleteResultType | null;
    link?: string;
    ariaLabel?: string;
    // Until here
    _class: AutoCompleteResultType;
    /**
     *  From here to above, all the things are common in the suggested item, below fields are differentiate
     */
    display_name?: string; // For User, instructor's name
    title: string; // For Course and Instructor
    phrase?: string; // For Search Log
    img_link?: string; // For Course and Instructor
    instructor_name?: Array<string>; // Course : Name of the instructors of the course
}

export interface SearchFormExperimentFeatures {
    getAutocompleteSuggestionsWithGQL?: boolean;
}

/**
 * Returns localized label for given result type
 */
const getLocalizedResultLabel = (type: AutoCompleteResultType, gettext: I18nApi['gettext']) => {
    if (type === 'course') {
        return gettext('Course');
    } else if (type === 'user') {
        return gettext('Instructor');
    }

    return null;
};

/**
 * Determines aria label for given auto complete result
 */
const getAriaLabelForResult = (result: AutoCompleteResult, gettext: I18nApi['gettext']) => {
    const labelArray = [];
    if (result.type === 'search_log') {
        labelArray.push(gettext('Search'), ': ', result.label);
    } else if (result.type === 'course') {
        labelArray.push(getLocalizedResultLabel(result.type, gettext), ': ', result.label);
        if (result.instructor_name && result.instructor_name.length > 0) {
            labelArray.push(
                ' - ',
                getLocalizedResultLabel('user', gettext),
                ': ',
                result.instructor_name,
            );
        }
    } else {
        labelArray.push(getLocalizedResultLabel('user', gettext), ': ', result.display_name);
    }
    return labelArray.join('');
};

// Default exception handler
const defaultHandleException = (e: unknown) => {
    // eslint-disable-next-line no-console
    console.error(e);
};

export class SearchFormAutocompleteStore {
    private _cancelSource: AbortController | undefined;
    private _getAPIParams;
    private _getFormParams: SearchFormAutoCompleteStoreParams['getFormParams'];
    private _suggestTimeoutId: number | undefined;
    private _url;
    private gettext: I18nApi['gettext'];

    @observable inputValue = '';
    @observable isMenuOpen = false;
    @observable isPopularQueriesExperimentEnabled;
    @observable loadingState = AUTOSUGGEST_LOADING_STATE.NOT_LOADED;
    @observable searchFormExperimentFeatures: SearchFormExperimentFeatures;
    @observable selectedSuggestionIndex = -1;
    @observable suggestionsCount = 0;
    @observable.ref suggestions: AutoCompleteResult[] = [];

    cachedSuggestions: Record<string, AutoCompleteResult[]> = {};
    captureException: (e: DOMException) => void;
    maxInputLength = 200;
    minInputLength = 2;
    suggestTimeout: number | null = 200;

    constructor(params: SearchFormAutoCompleteStoreParams) {
        // Required: url of the Elasticsearch API.
        this._url = params.url;
        this.captureException = params.captureException || defaultHandleException;

        // Optional: a function that returns params to query the Elasticsearch API with.
        // The search phrase is already included.
        this._getAPIParams = params.getAPIParams ?? null;
        this._getFormParams = params.getFormParams ?? (() => ({}));
        this.gettext = params.gettext;
        this.searchFormExperimentFeatures = params.searchFormExperimentFeatures ?? {};
        this.isPopularQueriesExperimentEnabled = params.isPopularQueriesExperimentEnabled ?? false;
        this.suggestions = [];
        if (params.inputValue) {
            this.inputValue = params.inputValue;
        }
    }
    @computed get selectedSuggestion() {
        return this.suggestions[this.selectedSuggestionIndex] || undefined;
    }

    @computed get query() {
        if (this.searchPhrase) {
            return this.searchPhrase.trim().substring(0, this.maxInputLength).trim();
        }
        return '';
    }

    /**
     * getter to determine if popular queries should be retrieved
     */
    @computed get shouldLoadPopularQueries() {
        return this.isPopularQueriesExperimentEnabled && (this.inputValue ?? '').length === 0;
    }

    @computed get searchPhrase() {
        return this.selectedSuggestion ? this.selectedSuggestion.label : this.inputValue;
    }

    /**
     * Get tracking id for current set of suggestions
     */
    get trackingId() {
        return this.suggestions.length > 0 ? this.suggestions[0].result_tracking_id : null;
    }

    async loadSuggestions(params: {q: string; signal: AbortSignal}) {
        const results = this.searchFormExperimentFeatures.getAutocompleteSuggestionsWithGQL
            ? await this.loadSuggestionsWithGQL(params)
            : await this.loadSuggestionsWithRest(params);

        this._processResults(params.q, results);
    }

    async loadSuggestionsWithRest({q, signal}: {q: string; signal: AbortSignal}) {
        const params = this._getAPIParams ? this._getAPIParams() : {};
        const response = await udApi.get(this._url, {signal, params: {q, ...params}});
        const results = response?.data?.results ?? [];
        (results ?? []).forEach((result: AutoCompleteResult) => {
            result.type = result.type ?? result._class ?? null;
            result.label = result.label ?? result.phrase ?? result.title;
            result.link = result.link ?? result.url;
        });
        return results;
    }

    async loadSuggestionsWithGQL(param: {q: string; signal: AbortSignal}) {
        const params = {searchedPhrase: param.q};

        let results: AutocompleteSuggestionsQuery['searchAutocomplete'] = [];
        try {
            const response = await useAutocompleteSuggestionsQuery.fetcher(params, {
                _signal: param.signal,
            } as unknown as HeadersInit)();
            results = response.searchAutocomplete ?? [];
        } catch (e) {
            // fetch library throwing AbortError when we call the abort(). We need to manually handle this
            if ((e as Error).name !== 'AbortError') {
                throw e;
            }
        }

        return mapGraphqlResultsToAutocompleteResults(results);
    }

    @action _processResults(q: string, response?: AutoCompleteResult[]) {
        this.suggestionsCount = response?.length ?? 0;
        const suggestions = new Array<AutoCompleteResult>();
        (response ?? []).forEach((result: AutoCompleteResult) => {
            result.ariaLabel = getAriaLabelForResult(result, this.gettext);
            if (!result.label || !result.link) {
                return;
            }
            const [path, queryString] = result.link.split('?');
            const searchParams = new URLSearchParams(queryString);
            const formParams = this._getFormParams?.();
            for (const param in formParams) {
                searchParams.set(param, formParams[param]);
            }
            searchParams.set('src', 'sac');
            q && searchParams.set('kw', q);
            result.link = `${path}?${searchParams.toString()}`;
            suggestions.push(result);
        });
        this.setSuggestions(suggestions);

        if (q.length !== 0) {
            Object.assign(this.cachedSuggestions, {[q]: suggestions});
        }
    }

    @action setSearchFormExperimentFeatures(features: SearchFormExperimentFeatures) {
        this.searchFormExperimentFeatures = features;
    }

    @action setInputValue(value: string) {
        this.inputValue = value;
    }

    /**
     * Checks for desired min input length before calling for popular queries
     * @param inputValue input value for popular queries
     */
    @action async suggest(inputValue: string) {
        this.setInputValue(inputValue);
        this.minInputLength = this.shouldLoadPopularQueries ? -1 : 2;
        this.query.length >= this.minInputLength && this.openMenu();
        this.selectedSuggestionIndex = -1;
        this.loadingState = AUTOSUGGEST_LOADING_STATE.LOADING;
        this._suggestTimeoutId !== undefined && clearTimeout(this._suggestTimeoutId);
        this._cancelSource?.abort();
        this._suggestTimeoutId = this._cancelSource = undefined;
        if (this.query.length < this.minInputLength) {
            this.setSuggestions([]);
        } else if (this.query in this.cachedSuggestions) {
            this.setSuggestions(this.cachedSuggestions[this.query]);
        } else if (this.suggestTimeout !== null) {
            this._suggestTimeoutId = setTimeout(
                this._loadSuggestions,
                this.suggestTimeout,
            ) as unknown as number;
        } else {
            this._loadSuggestions();
        }
    }

    _loadSuggestions = async () => {
        this._cancelSource = new AbortController();
        try {
            await this.loadSuggestions({q: this.query, signal: this._cancelSource.signal});
        } catch (e) {
            const isAborted = axios.isCancel(e) || (e as DOMException)?.name === 'AbortError';
            // We do not have to send the AbortError to the sentry
            !isAborted && (e as DOMException)?.message && this.captureException(e as DOMException);
            !isAborted && this.setSuggestions([]);
        }
    };

    @action setSuggestions(suggestions: AutoCompleteResult[]) {
        this.suggestions = suggestions;
        this.selectedSuggestionIndex = -1;
        this.loadingState = AUTOSUGGEST_LOADING_STATE.LOADED;
    }

    @action openMenu = () => {
        this.isMenuOpen = true;
    };

    @action closeMenu = () => {
        this.isMenuOpen = false;
        this.selectedSuggestionIndex = -1;
    };

    @action selectPreviousSuggestion() {
        if (this.suggestions.length > 0) {
            this.openMenu();
            if (this.selectedSuggestionIndex < 0) {
                this.selectedSuggestionIndex = this.suggestions.length - 1;
            } else {
                this.selectedSuggestionIndex -= 1;
            }
        }
    }

    @action selectNextSuggestion() {
        if (this.suggestions.length > 0) {
            this.openMenu();
            if (this.selectedSuggestionIndex >= this.suggestions.length - 1) {
                this.selectedSuggestionIndex = -1;
            } else {
                this.selectedSuggestionIndex += 1;
            }
        }
    }

    @action selectSuggestion(index: number, onSelected: (suggestion: AutoCompleteResult) => void) {
        this.selectedSuggestionIndex = index;
        onSelected?.(this.selectedSuggestion as AutoCompleteResult);
        this.selectedSuggestionIndex = -1;
        this.isMenuOpen = false;
    }

    @action clearInputValue = () => {
        this.inputValue = '';
        this.setSuggestions([]);
        this.isMenuOpen = false;
    };
}
