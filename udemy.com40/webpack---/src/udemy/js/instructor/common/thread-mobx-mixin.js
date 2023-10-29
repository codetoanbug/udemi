import autobind from 'autobind-decorator';
import {CancelToken, isCancel} from 'axios/index';
import {action, computed, observable, reaction, toJS, runInAction} from 'mobx';
import qs from 'qs';

import udApi from 'utils/ud-api';

import {ONE_PANE_MODE, THREAD_DETAIL_PATH_REGEX, TWO_PANE_MODE} from './constants';

export default class ThreadedMobxMixin {
    @observable filters = {};
    @observable ordering = '-modified';
    @observable _searchQuery = '';
    @observable _selectedThreadId;
    @observable _threads = [];
    @observable loadedInitialThreadDetails = false;
    @observable isThreadListLoading = false;
    @observable isThreadDetailLoading = false;
    _cancelSource;
    @observable _moreThreadsUrl;
    @observable editingThread = {};

    @observable loadingNextPage = false;
    @observable viewModeType = TWO_PANE_MODE;

    DEFAULT_VIEW_MODE_TYPE = TWO_PANE_MODE;
    THREAD_PAGE_SIZE = 12;

    constructor(API_SETTINGS, {baseUrl, twoPaneStore = null}) {
        this.API_SETTINGS = API_SETTINGS;
        this.baseUrl = baseUrl;
        this.twoPaneStore = twoPaneStore;
        this.init();
        reaction(
            () => [this._searchQuery, this.ordering, toJS(this.filters)],
            () => this._reloadThreads(),
        );
    }

    setTwoPaneStore(twoPaneStore) {
        this.twoPaneStore = twoPaneStore;
    }

    @action
    init() {
        this.filters = this.API_SETTINGS.VALID_FILTERS.reduce((obj, name) => {
            obj[name] = false;
            return obj;
        }, {});
    }

    _findThreadById(threadId) {
        return this._threads.find((thread) => thread.id == threadId);
    }

    _getThreadOrFromId(threadId) {
        const thread = this._threads.find((thread) => thread.id == threadId);
        return thread || threadId;
    }

    get filteredThreads() {
        return this._threads;
    }

    @computed
    get selectedThread() {
        return this._findThreadById(this._selectedThreadId);
    }

    @action
    deselectThread() {
        this._selectedThreadId = null;
    }

    @action
    setOrdering(newOrdering) {
        this.ordering = newOrdering;
    }

    @autobind
    @action
    searchThreads(query) {
        this._searchQuery = query;
    }

    @action
    setFilter(filter, value) {
        if (this.API_SETTINGS.VALID_FILTERS.includes(filter)) {
            this.filters[filter] = value;
        }
    }

    @action
    updatesBeforeReloadThreads() {
        this.loadedInitialThreadDetails = false;
    }

    _reloadThreads(keepSelected = false) {
        if (this.viewModeType === ONE_PANE_MODE) {
            this.page = 1;
            this.updatesBeforeOnePaneReloadThreads();
            return this._loadThreads();
        }
        this.updatesBeforeReloadThreads();
        if (this.twoPaneStore) {
            this.twoPaneStore.setShowLeftPane(true);
        }
        if (!keepSelected) {
            this.deselectThread();
        }
        this._clearThreadsButKeepSelected();
        return this._loadThreads();
    }

    _clearThreadsButKeepSelected() {
        this._moreThreadsUrl = null;
        this._threads = this._threads.filter(
            (thread) => this.selectedThread && thread.id == this.selectedThread.id,
        );
    }

    _fetchThread(thread) {
        return udApi.get(this.API_SETTINGS.fetchUrl(thread), {
            params: this.fetchThreadParams(),
        });
    }

    _fetchThreadDetails(thread) {
        return udApi.get(this.API_SETTINGS.apiDetailUrl(thread), {
            params: this.API_SETTINGS.detailParams,
        });
    }

    _makeObservableThread(thread) {
        this.makeObservableThread && this.makeObservableThread(thread);
    }

    @computed get hasMoreThreads() {
        return !!this._moreThreadsUrl && this.filteredThreads.length > 0;
    }

    @action
    populateThreads(threads) {
        this._threads = this._threads.concat(
            threads
                .filter((thread) => !this._findThreadById(thread.id))
                .map((thread) => {
                    this._makeObservableThread(thread);
                    return thread;
                }),
        );
    }

    @action
    async _loadThreads(apiUrl = this.API_SETTINGS.apiUrl, extraParams = {}) {
        const params = this.applyFilters();
        Object.assign(params, extraParams);

        this.isThreadListLoading = true;
        // Only allow the latest request in flight.
        this._cancelSource && this._cancelSource.cancel('Operation canceled due to new request.');
        this._cancelSource = CancelToken.source();

        try {
            let response;
            if (this._moreThreadsUrl !== apiUrl) {
                response = await udApi.get(apiUrl, {
                    params,
                    cancelToken: this._cancelSource.token,
                });
            } else {
                const [baseUrl, queryString] = apiUrl.split('?');
                const queryParams = qs.parse(queryString, {ignoreQueryPrefix: true});
                ['page', 'offset'].forEach((param) => {
                    if (param in params) {
                        queryParams[param] = params[param];
                    }
                });
                response = await udApi.get(`${baseUrl}?${qs.stringify(queryParams)}`, {
                    cancelToken: this._cancelSource.token,
                });
            }

            runInAction(() => {
                this.populateThreads(response.data.results);
                this._moreThreadsUrl =
                    response.data.next && response.data.next.split('/api-2.0/')[1];
                this.isThreadListLoading = false;
                if (!this._selectedThreadId && this._threads.length > 0) {
                    this.selectThread(this._threads[0]);
                }
            });
            return response;
        } catch (error) {
            if (!isCancel(error)) {
                runInAction(() => {
                    this.isThreadListLoading = false;
                });
                throw error;
            }
        }
    }

    @action
    updatesBeforeOnePaneReloadThreads() {
        this._threads = [];
        this.loadingNextPage = true;
    }

    @action
    setThreads(threads) {
        this._threads = threads;
    }

    @autobind
    @action
    startEditingReply(thread, response) {
        this.editingReply = response;
        this.editingThread = thread;
    }

    @autobind
    @action
    cancelEditingReply() {
        this.editingReply = null;
    }

    loadMoreThreads(page = null) {
        if (this.viewModeType === ONE_PANE_MODE && page) {
            this.page = page;
            this.updatesBeforeOnePaneReloadThreads();
            this._loadThreads();
            return;
        }

        if (this._moreThreadsUrl) {
            return this._loadThreads(this._moreThreadsUrl, {
                offset: this.filteredThreads.length,
            });
        }
    }

    isMessageDetailPath(pathname) {
        const localPath = pathname.slice(this.baseUrl.length + 1);
        return localPath.match(THREAD_DETAIL_PATH_REGEX);
    }

    setThreadFromPathname(pathname) {
        if (!this.baseUrl) {
            return;
        }
        const localPath = pathname.slice(this.baseUrl.length + 1);
        const threadId = Number.parseInt(localPath, 10);
        if (threadId > 0) {
            this.selectThreadbyId(threadId);
        }
        if (this.twoPaneStore) {
            this.twoPaneStore.setShowLeftPane(!localPath.match(THREAD_DETAIL_PATH_REGEX));
        }
    }

    selectThreadbyId(threadId) {
        const requestedThread = this._findThreadById(threadId);
        if (!requestedThread) {
            return this.selectThread({id: threadId});
        }
        return this.selectThread(requestedThread);
    }

    @action
    async selectThread(thread) {
        this._selectedThreadId = thread.id;
        this.isThreadDetailLoading = true;

        try {
            const [threadResponse, messagesResponse] = await Promise.all([
                this._fetchThread(thread),
                this._fetchThreadDetails(thread),
            ]);
            let requestedThread = this._findThreadById(threadResponse.data.id);
            runInAction(() => {
                if (!requestedThread) {
                    this._makeObservableThread(threadResponse.data);
                    this._threads.unshift(threadResponse.data);
                    requestedThread = this._threads[0];
                }

                this.setThreadDetails &&
                    this.setThreadDetails(
                        requestedThread,
                        threadResponse.data,
                        messagesResponse.data,
                    );
            });
            return requestedThread;
        } finally {
            runInAction(() => {
                this.isThreadDetailLoading = false;
            });
        }
    }

    // Helper functions to set thread attributes.
    _toggleBoolAttr(thread, attrName) {
        return this._updateAttr(thread, attrName, !thread[attrName]);
    }

    async _updateAttr(thread, attrName, newValue, optimisticUpdate = true) {
        if (thread[attrName] === newValue) {
            return Promise.resolve(newValue);
        }

        const oldValue = thread[attrName],
            params = {};

        if (optimisticUpdate) {
            thread[attrName] = newValue;
        }

        params[attrName] = newValue;
        try {
            await udApi.put(this.API_SETTINGS.fetchUrl(thread), params);
            runInAction(() => {
                if (!optimisticUpdate) {
                    thread[attrName] = newValue;
                }
            });
            return newValue;
        } catch (error) {
            runInAction(() => {
                thread[attrName] = oldValue;
            });
            return oldValue;
        }
    }

    async updateThreadOnApi(thread, attrName, newValue) {
        const params = {};
        params[attrName] = newValue;
        return udApi.put(this.API_SETTINGS.fetchUrl(thread), params);
    }

    async deleteThreadOnAPI(thread) {
        return udApi.delete(this.API_SETTINGS.fetchUrl(thread));
    }

    // Methods to customize params passed to APIs
    fetchThreadParams() {
        return this.API_SETTINGS.fetchParams;
    }

    applyFilters() {
        const params = Object.assign(
            {},
            {
                ...this.API_SETTINGS.listParams,
                ordering: this.ordering,
            },
        );
        if (this._searchQuery) {
            params.search = this._searchQuery;
        }
        return params;
    }
}
