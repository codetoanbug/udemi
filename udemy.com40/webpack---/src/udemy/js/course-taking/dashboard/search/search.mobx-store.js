import autobind from 'autobind-decorator';
import {action, computed, observable, reaction} from 'mobx';

import debounce from 'utils/debounce';
import udApi from 'utils/ud-api';

import {TRACKING_CATEGORIES} from '../../constants';
import SearchResultItem from './search-result-item.mobx-model';
import SearchResultSection from './search-result-section.mobx-model';

export default class SearchStore {
    @observable searchQuery = ''; // search term as per live input
    @observable searchedTerm = ''; // search term to which the current search results belong to
    @observable numResults = 0;
    @observable matchingSections = [];

    @observable isSearching = false;
    @observable showSearchResultPanel = false;

    constructor(courseTakingStore) {
        this.courseTakingStore = courseTakingStore;
        reaction(() => this.searchQuery, debounce(this.search, 300));
    }

    @computed
    get canSearchOnline() {
        const {course} = this.courseTakingStore;
        // same as `should_have_in_course_index` on the Course model
        const courseLanguage = course.locale.locale.split('_')[0]; // same as backend serializer logic
        const hasOnlineIndex = courseLanguage === 'en' && course.isPublished;
        return hasOnlineIndex;
    }

    @autobind
    @action
    onSearchQueryChanged(ev) {
        this.searchQuery = ev.target.value;
        if (this.searchQuery === '') {
            this.clearSearchResults();
            this.finalizeSearch();
        }
    }

    trackVisit(action, extraData = {}) {
        this.courseTakingStore.track(TRACKING_CATEGORIES.SEARCH_VISIT, action, extraData);
    }

    @autobind
    search() {
        if (this.searchQuery === '') {
            return; // this case is handled early in onSearchQueryChanged which sets an empty result
        }

        const searchQuery = this.searchQuery; // snapshot of query at the time a search is initiated
        this.courseTakingStore.track(TRACKING_CATEGORIES.SEARCH, undefined, {
            searchQuery,
            mode: this.canSearchOnline ? 'API' : 'offline',
        });

        if (this.canSearchOnline) {
            return this.searchIndexes(searchQuery);
        }

        return this.searchOffline(searchQuery);
    }

    @autobind
    searchOffline(searchQuery) {
        return new Promise((resolve) => resolve(this._filterMatchingCurriculumItems(searchQuery)))
            .then(this.updateSearchResults)
            .finally(() => this.finalizeSearch(searchQuery));
    }

    searchIndexes(searchQuery) {
        this.showLoaderTimeoutId = setTimeout(
            action(() => {
                this.isSearching = true;
            }),
            800, // to delay showing a loader if the results are going to return fast enough
        );
        return this._processSearchRequest(searchQuery)
            .then(this.updateSearchResults)
            .catch(() => this.searchOffline(searchQuery))
            .finally(() => this.finalizeSearch(searchQuery));
    }

    _filterMatchingCurriculumItems(searchQuery) {
        const isMatching = (targetProperty) => targetProperty.match(new RegExp(searchQuery, 'i'));

        const sectionsWithMatchingItems = [];
        let numMatchedLectures = 0;

        this.showLoaderTimeoutId && clearTimeout(this.showLoaderTimeoutId);
        this.courseTakingStore.curriculumSections.forEach((section) => {
            const lecturesWithMatches = [];
            section.items.forEach((curriculumItem) => {
                const matchesTitle = isMatching(curriculumItem.title);
                const matchingResources = curriculumItem.resources.filter((resource) =>
                    isMatching(resource.title),
                );
                const result = new SearchResultItem(curriculumItem, matchingResources);
                if (matchesTitle || matchingResources.length) {
                    lecturesWithMatches.push(result);
                    numMatchedLectures += 1;
                }
            });
            if (lecturesWithMatches.length > 0) {
                sectionsWithMatchingItems.push(
                    new SearchResultSection(section, lecturesWithMatches),
                );
            }
        });
        return {sectionsWithMatchingItems, numMatchedLectures};
    }

    _processSearchRequest(searchQuery) {
        const {courseId} = this.courseTakingStore;
        return udApi
            .get(`/courses/${courseId}/subscriber-curriculum-items/search/`, {
                params: {q: searchQuery},
            })
            .then(({data}) => {
                clearTimeout(this.showLoaderTimeoutId);
                let numMatchedLectures = 0;
                const matchingSections = {};
                data.data.forEach(({type, id, resources, cues}) => {
                    const {
                        curriculumItem,
                        section,
                    } = this.courseTakingStore.getCurriculumItemContextByTypeAndId(type, id);
                    let matchingResources = [];
                    if (!curriculumItem) {
                        return;
                    }
                    let searchResultSection = matchingSections[section.id];
                    if (!searchResultSection) {
                        searchResultSection = new SearchResultSection(section);
                        matchingSections[section.id] = searchResultSection;
                    }
                    const matchingResourceIds = resources.map((resource) => resource.id_i);
                    if (matchingResourceIds.length) {
                        matchingResources = curriculumItem.resources.filter(
                            (resource) => resource.id in matchingResourceIds,
                        );
                    }
                    searchResultSection.addSearchResultItem(
                        new SearchResultItem(curriculumItem, matchingResources, cues),
                    );
                    numMatchedLectures += 1;
                });
                return {
                    sectionsWithMatchingItems: Object.values(matchingSections),
                    numMatchedLectures,
                };
            });
    }

    @autobind
    @action
    updateSearchResults({sectionsWithMatchingItems, numMatchedLectures}) {
        this.matchingSections = sectionsWithMatchingItems;
        this.numResults = numMatchedLectures;
    }

    clearSearchResults() {
        this.updateSearchResults({
            sectionsWithMatchingItems: [],
            numMatchedLectures: 0,
        });
    }

    @action
    finalizeSearch(searchedTerm = '') {
        this.isSearching = false;
        this.searchedTerm = searchedTerm;
        this.showSearchResultPanel = true;
    }

    @autobind
    @action
    resetSearchContext() {
        this.searchQuery = '';
        this.searchedTerm = '';
        this.isSearching = false;
        this.clearSearchResults();
    }
}
