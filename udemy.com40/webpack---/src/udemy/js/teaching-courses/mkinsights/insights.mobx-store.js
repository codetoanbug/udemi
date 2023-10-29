import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';
import qs from 'qs';

import AutosuggestStore from 'base-components/form/autosuggest/autosuggest.mobx-store';
import udApi, {TIMEOUT} from 'utils/ud-api';
import udApiStat from 'utils/ud-api-stat';
import udMe from 'utils/ud-me';

import CourseLabelMetrics from './course-label-metrics.mobx-model';
import * as tracking from './tracking';

export const STATE = {
    INITIAL: 'INITIAL',
    SEARCHING: 'SEARCHING',
    ERROR: 'ERROR',
    DONE: 'DONE',
    NO_RESULTS: 'NO_RESULTS',
};

export const RESPONSE_TYPE = {
    COURSE_LABEL: 'COURSE_LABEL',
    SUGGESTIONS: 'SUGGESTIONS',
    QUERY: 'QUERY',
};

class InsightsAutosuggestStore extends AutosuggestStore {
    @action
    async loadSuggestions({q, signal}) {
        const response = await udApi.get('/marketplace/current/suggestions/', {
            useCache: true,
            params: {search: q},
            timeout: TIMEOUT,
            signal,
        });
        this.setSuggestions(response.data.results || []);
    }
}

export default class InsightsStore {
    @observable searchState = STATE.INITIAL;
    @observable showSearchedQueryAsLabel = false;
    @observable insights = null;
    @observable error = '';
    searchPromise = Promise.resolve();

    @observable trendingCourseLabelMetricsState = STATE.INITIAL;
    @observable trendingCourseLabelMetricsList = [];
    @observable urlQuery = {
        q: '',
        lang: '',
        ref: '',
    };

    @observable showOnboardingModal = false;
    @observable showOnboardingTooltip = false;
    @observable showMkInsightsDataChangeAlert = false;

    constructor(history) {
        this.autosuggestStore = new InsightsAutosuggestStore();
        this._history = history;
        this._setStateFromLocation(history.location);
    }

    @action
    _setStateFromLocation(location) {
        const fullUrlQuery = qs.parse(location.search, {ignoreQueryPrefix: true});
        const urlQuery = {
            q: fullUrlQuery.q || '',
            lang: fullUrlQuery.lang || 'en',
            ref: fullUrlQuery.ref || '',
        };
        this.autosuggestStore.clearInputValue();
        this.searchState = STATE.INITIAL;
        this.showSearchedQueryAsLabel = false;
        this.error = '';
        // Insights object should only persist in case where search query remains the same, but
        // language selection changes, so available languages can be displayed.
        if (!urlQuery.q || this.urlQuery.q !== urlQuery.q) {
            this.insights = null;
        }
        this.urlQuery = urlQuery;
        if (this.trendingCourseLabelMetricsList.length === 0) {
            this.getTrendingCourseLabelMetricsList();
        }
    }

    setUpRouteListener() {
        this._unlisten = this._history.listen((location) => {
            this._setStateFromLocation(location);
            this.search();
        });
    }

    disposeRouteListener() {
        this._unlisten && this._unlisten();
    }

    @action
    setUrlQuery(params, options = {replace: false}) {
        const location = {
            pathname: this._history.location.pathname,
            search: qs.stringify({
                q: params.q,
                lang: params.lang,
                // Don't show `ref=` in the URL.
                ref: params.ref || undefined,
            }),
        };
        if (options.replace) {
            this._history.replace(location);
        } else {
            this._history.push(location);
        }
    }

    @action
    getTrendingCourseLabelMetricsList() {
        this.trendingCourseLabelMetricsState = STATE.SEARCHING;
        return udApi
            .get('/marketplace/current/trending/', {
                useCache: true,
                params: {
                    'fields[ds_mkins_course_label_metrics]':
                        '@min,monthly_search_volume,course_lang',
                },
                timeout: TIMEOUT,
            })
            .then(
                action((response) => {
                    this.trendingCourseLabelMetricsList = response.data.results.map(
                        (courseLabelMetrics) => new CourseLabelMetrics(courseLabelMetrics),
                    );
                    this.trendingCourseLabelMetricsState =
                        this.trendingCourseLabelMetricsList.length > 0
                            ? STATE.DONE
                            : STATE.NO_RESULTS;
                }),
            )
            .catch(
                action(() => {
                    this.trendingCourseLabelMetricsState = STATE.ERROR;
                    this.trendingCourseLabelMetricsList = [];
                }),
            );
    }

    @computed
    get isAutocorrect() {
        if (
            !this.insights ||
            (!this.insights.course_label_metrics && !this.insights.query_metrics)
        ) {
            return false;
        }

        const displayName = this.insights.course_label_metrics
            ? this.insights.course_label_metrics.course_label.display_name
            : this.insights.query_metrics.query;

        return displayName.toLowerCase().trim() !== this.urlQuery.q.toLowerCase().trim();
    }

    @computed
    get responseType() {
        if (!this.insights) {
            return null;
        }

        return (
            (this.insights.course_label_metrics && RESPONSE_TYPE.COURSE_LABEL) ||
            (this.insights.course_label_suggestions &&
                this.insights.course_label_suggestions.length > 0 &&
                RESPONSE_TYPE.SUGGESTIONS) ||
            (this.insights.query_metrics && RESPONSE_TYPE.QUERY) ||
            null
        );
    }

    @action
    search() {
        this.hideSearchedQueryLabel();

        if (this.searchState === STATE.SEARCHING) {
            return this.searchPromise;
        }

        this.error = '';

        if (!this.urlQuery.q) {
            this.searchState = STATE.INITIAL;
            return;
        }

        this.showSearchedQueryAsLabel = true;

        this.searchState = STATE.SEARCHING;
        udApiStat.increment('mkinsights.search');
        tracking.trackSearchEvent({
            query: this.urlQuery.q,
            language: this.urlQuery.lang,
        });
        this.searchPromise = udApi
            .get('/marketplace/current/insights/', {
                useCache: true,
                params: {
                    search: this.urlQuery.q,
                    language: this.urlQuery.lang,
                    'fields[course]':
                        '@default,headline,image_304x171,instructor_name,content_info,num_published_lectures,' +
                        'content_length_practice_test_questions,num_published_practice_tests,instructional_level,' +
                        'discount,num_reviews,rating,badges,caption_languages',
                },
                timeout: TIMEOUT,
            })
            .then(
                action((response) => {
                    const insights =
                        (response.data.results || []).length > 0 ? response.data.results[0] : null;
                    if (
                        !insights ||
                        (insights.query_metrics && !insights.query_metrics.has_unmet_demand) ||
                        (!insights.course_label_metrics &&
                            !insights.query_metrics &&
                            (insights.course_label_suggestions || []).length === 0)
                    ) {
                        this.insights = null;
                        this.searchState = STATE.NO_RESULTS;
                        udApiStat.increment('mkinsights.search.no_results');
                        tracking.trackSearchResponseLoad({
                            searchState: this.searchState,
                            sourcePage: this.urlQuery.ref,
                        });
                        return;
                    }
                    this.insights = insights;
                    this.searchState = STATE.DONE;
                    udApiStat.increment('mkinsights.search.success');
                    if (this.responseType === RESPONSE_TYPE.COURSE_LABEL) {
                        this.insights.course_label_metrics = new CourseLabelMetrics(
                            this.insights.course_label_metrics,
                        );
                    }
                    if (
                        this.insights.course_label_metrics &&
                        this.insights.course_label_metrics.course_lang !== this.urlQuery.lang
                    ) {
                        this.setUrlQuery(
                            {
                                q: this.urlQuery.q,
                                lang: this.insights.course_label_metrics.course_lang,
                                ref: this.urlQuery.ref,
                            },
                            {replace: true},
                        );
                        return;
                    }
                    tracking.trackSearchResponseLoad({
                        searchState: this.searchState,
                        responseType: this.responseType,
                        insights: this.insights,
                        isAutocorrect: this.isAutocorrect,
                        sourcePage: this.urlQuery.ref,
                    });
                }),
            )
            .catch(
                action((error) => {
                    this.hideSearchedQueryLabel();
                    this.autosuggestStore.setInputValue(this.urlQuery.q);
                    this.insights = null;
                    this.searchState = STATE.ERROR;
                    udApiStat.increment('mkinsights.search.error');
                    this.error = error.response ? error.response.data.detail : error.message;
                    tracking.trackSearchResponseLoad({
                        searchState: this.searchState,
                        errorMessage: this.error,
                        sourcePage: this.urlQuery.ref,
                    });
                }),
            );
        return this.searchPromise;
    }

    @autobind
    @action
    hideSearchedQueryLabel() {
        this.showSearchedQueryAsLabel = false;
        this.autosuggestStore.clearInputValue();
    }

    @action
    initializeOnboardingModal() {
        this.showOnboardingModal = (udMe.settings || {}).mkinsights_hint !== 'off';
    }

    @autobind
    @action
    hideOnboardingModal() {
        this.showOnboardingModal = false;
        (udMe.settings || {}).mkinsights_hint = 'off';
        udApi.post('/users/me/settings/', {setting: 'mkinsights_hint', value: 'off'});

        // Wait for the autoFocus on the Autosuggest.
        // Otherwise the tooltip doesn't show, as it's blurred (hidden) right after it's shown.
        setTimeout(() => this.toggleOnboardingTooltip(true), 0);
    }

    @autobind
    @action
    toggleOnboardingTooltip(isOpen) {
        this.showOnboardingTooltip = isOpen;
    }

    @autobind
    @action
    getSystemMessagesVisibility() {
        udApi
            .get('users/me/instructor-alerts/current/', {
                useCache: true,
                timeout: TIMEOUT,
            })
            .then(
                action((response) => {
                    this.showMkInsightsDataChangeAlert = response.data.mkinsights_data_change_alert;
                }),
            );
    }
}
