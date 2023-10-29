import autobind from 'autobind-decorator';
import axios from 'axios';
import {action, computed, observable} from 'mobx';

import {AUTOSUGGEST_LOADING_STATE} from './constants';

/**
 * ### AutosuggestStore
 *
 * @remarks
 * A MobX Store for data related to an implementation of the {@link Autosuggest} component.
 *
 * @typeParam TSuggestionDataModel - The data model for an individual suggestion.  Autosuggest allows you to use any
 * sort of data you want for a suggestion, thus we are using a generic to let TypeScript know what to look for.
 * The internal `suggestions` ref is an array of these.
 *
 * @example
 * ```ts
 * interface FooSuggestion {
 *   name: string
 * }
 *
 * class FooAutosuggestStore extends AutosuggestStore<FooSuggestion> {}
 * ```
 */
export class AutosuggestStore<TSuggestionDataModel> {
    @observable inputValue = '';
    minInputLength = 1;
    @observable isMenuOpen = false;
    @observable loadingState = AUTOSUGGEST_LOADING_STATE.NOT_LOADED;
    @observable.ref suggestions: TSuggestionDataModel[] = [];
    cachedSuggestions: Record<string, TSuggestionDataModel[]> = {};
    suggestTimeout: number | null = 200;
    @observable selectedSuggestionIndex = -1;
    captureException: (e: DOMException) => void;

    private _cancelSource: AbortController | undefined;
    private _suggestTimeoutId: number | undefined;

    /**
     *
     * @param captureException Should a fetch error occur, this method will capture it for Sentry.
     *
     * @remarks Sentry is not fully independent of the Django monolith, so this is passed in as a
     * part of the constructor.
     *
     * @see {@link Sentry}
     */
    constructor(captureException: (e: DOMException) => void) {
        this.captureException = captureException;
    }

    @computed get selectedSuggestion() {
        return this.suggestions[this.selectedSuggestionIndex] || undefined;
    }

    @computed get query() {
        // Override this to transform the input value to a suggestion query.
        return this.inputValue.trim();
    }

    /**
     * This function is meant to be set in any subclass extending `AutosuggestStore`.
     * Functionality is commented out below as guidelines for implementation.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    /* action async */ loadSuggestions({q, signal}: {q: string; signal: AbortSignal}) {
        // Override this to set suggestions, typically by making an API call.
        this.setSuggestions([]);
        // this.cachedSuggestions[q] = this.suggestions; // If suggestions are cacheable.
    }

    @action setInputValue(value: string) {
        this.inputValue = value;
    }

    @action async suggest(inputValue: string) {
        this.setInputValue(inputValue);
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

    @autobind async _loadSuggestions() {
        this._cancelSource = new AbortController();
        try {
            await this.loadSuggestions({q: this.query, signal: this._cancelSource.signal});
        } catch (e) {
            const isAborted = axios.isCancel(e) || (e as DOMException)?.name === 'AbortError';
            // We do not have to send the AbortError to the sentry
            !isAborted && (e as DOMException)?.message && this.captureException(e as DOMException);
            !isAborted && this.setSuggestions([]);
        }
    }

    @action setSuggestions(suggestions: TSuggestionDataModel[]) {
        this.suggestions = suggestions;
        this.selectedSuggestionIndex = -1;
        this.loadingState = AUTOSUGGEST_LOADING_STATE.LOADED;
    }

    @autobind @action openMenu() {
        this.isMenuOpen = true;
    }

    /** This autobind needs to remain because a sub class is calling super.closeMenu() */
    @autobind @action closeMenu() {
        this.isMenuOpen = false;
        this.selectedSuggestionIndex = -1;
    }

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

    @action selectSuggestion(
        index: number,
        onSelected: (suggestion: TSuggestionDataModel) => void,
    ) {
        this.selectedSuggestionIndex = index;
        onSelected?.(this.selectedSuggestion as TSuggestionDataModel);
        this.selectedSuggestionIndex = -1;
        this.isMenuOpen = false;
    }

    /** This autobind needs to remain because EditPrioritySkillStores spec file calls `EditPrioritySkillStores.prototype` */
    @autobind @action clearInputValue() {
        this.inputValue = '';
        this.setSuggestions([]);
        this.isMenuOpen = false;
    }
}
