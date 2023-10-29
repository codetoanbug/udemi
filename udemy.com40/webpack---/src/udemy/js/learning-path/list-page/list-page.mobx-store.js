import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, computed, observable, runInAction} from 'mobx';

import getConfigData from 'utils/get-config-data';
import udApi from 'utils/ud-api';
import udMe from 'utils/ud-me';

import {BASE_PATH} from '../constants';
import LearningPath from '../learning-path.mobx-model';
import {LearningPathSearchEvent} from '../tracking-events';
import handleError, {isUserOrganizationAdminOrOwner} from '../utils';
import {
    FOLDER_TAG_TYPE,
    LIST_TYPES,
    FOLDER_LIST_TYPE,
    LIST_PAGE_ERROR_MESSAGES,
    FOLDER_ACTIONS,
    FOLDERS_PAGE_SIZE,
    LEARNING_PATH_FIELDS,
    LIST_PAGE_SIZE,
    SORT_OPTIONS,
    LIST_TYPES_WITH_PRO,
    PRO_ENROLLED_FILTERING_OPTIONS,
} from './constants';
import LearningPathFolder from './folders/learning-path-folder.mobx-model';

const udConfig = getConfigData();

export default class ListPageStore {
    @observable isLoadingList = true;
    @observable isLoadingFolders = true;
    @observable isChangingPage = false;
    @observable isFolderEditModeEnabled = false;
    @observable userHasUBProAccess = !!(
        udConfig.brand.has_organization &&
        (udConfig.features.organization.learning_path.pro_path ||
            udMe.organization?.is_pro_license_holder)
    );

    @observable activeListType = Object.entries(LIST_TYPES)[0][0];
    @observable activeFolderId;
    @observable paths = [];
    @observable folders = [];
    @observable currentPage = 1;
    @observable totalCountPaths = 0;
    @observable selectedSort;
    @observable selectedEnrolledFilter;

    /*  The search starts with undefined as value, but when the user cleans up the search field
        we change this field to ``, this indicates that the user remains in the same page and the search is on,
        when the user switch pages the search value is restored to undefined.
    */
    @observable search;

    @autobind
    @action
    setCurrentPage(pageNumber) {
        this.currentPage = pageNumber;
        this._setChangingPage(false);
    }

    @autobind
    @action
    setSearch(value) {
        this.search = value;
        this.setCurrentPage(1);
    }

    removeMultipleSpacesInTheEndOrBeginning(value) {
        const addSpaceInTheEnd = value.lastIndexOf(' ') === value.length - 1 ? ' ' : '';
        return `${value.trim()}${addSpaceInTheEnd}`;
    }

    @computed
    get searchParam() {
        if (this.search && this.search.trim()) {
            return this.removeMultipleSpacesInTheEndOrBeginning(this.search);
        }
    }

    @computed
    get listTypes() {
        return this.userHasUBProAccess &&
            !udConfig.features.organization.learning_path?.pro_path_hidden
            ? LIST_TYPES_WITH_PRO
            : LIST_TYPES;
    }

    @autobind
    @action
    resetPage() {
        this.search = undefined;
        this.currentPage = 1;
        this.selectedSort = null;
        this.selectedEnrolledFilter = null;
        this._setChangingPage(true);
    }

    get numPages() {
        return this.totalCountPaths > 0 ? Math.ceil(this.totalCountPaths / LIST_PAGE_SIZE) : 0;
    }

    @computed
    get sortTitle() {
        return this.selectedSort
            ? SORT_OPTIONS[this.selectedSort].title
            : SORT_OPTIONS.newest.title;
    }

    @computed
    get urlSearchParams() {
        const params = {};
        if (this.selectedSort) {
            params.sort = this.selectedSort;
        }
        if (this.selectedEnrolledFilter) {
            params.enrolled = this.selectedEnrolledFilter;
        }
        if (this.search && this.search.trim()) {
            params.search = this.removeMultipleSpacesInTheEndOrBeginning(this.search);
        }
        if (this.currentPage && this.numPages !== 1) {
            params.p = this.currentPage;
        }
        return params;
    }

    @computed
    get urlSearchString() {
        return new URLSearchParams(this.urlSearchParams).toString();
    }

    @action
    updateSearchQuery(searchQuery) {
        if (searchQuery.sort) {
            this.selectedSort = searchQuery.sort;
        }
        if (searchQuery.enrolled) {
            this.selectedEnrolledFilter = searchQuery.enrolled;
        }
        if (typeof searchQuery.search !== 'undefined') {
            this.setSearch(searchQuery.search);
        }
        this.currentPage = parseInt(searchQuery.page, 10);
    }

    _trackSearch() {
        const {activeListType, search: searchQuery, totalCountPaths} = this;

        if (searchQuery) {
            const searchEvent = new LearningPathSearchEvent({
                context: activeListType,
                search: searchQuery,
                totalResults: totalCountPaths,
                userRole: udMe.organization.role,
            });
            Tracker.publishEvent(searchEvent);
        }
    }

    @autobind
    async loadPaths() {
        this._setLoadingList(true);
        try {
            if (this.activeListType === FOLDER_LIST_TYPE) {
                await this._loadPathsFolder();
            } else {
                await this._loadPathsList();
            }
        } catch (e) {
            handleError(e, LIST_PAGE_ERROR_MESSAGES.UNABLE_TO_LOAD_LIST);
        } finally {
            this._setLoadingList(false);
            this._setChangingPage(false);
            this._trackSearch();
        }
    }

    async _loadPathsFolder() {
        const response = await udApi.get('/structured-data/explore/assignments/', {
            params: {
                page: this.currentPage,
                page_size: LIST_PAGE_SIZE,
                sd_tag_type: FOLDER_TAG_TYPE,
                sd_tag_id: this.activeFolderId,
                'fields[learning_path]': LEARNING_PATH_FIELDS,
                order_by: this.selectedSort
                    ? SORT_OPTIONS[this.selectedSort].value
                    : SORT_OPTIONS.newest.value,
                search: this.searchParam,
            },
        });
        this._setTotalCountPaths(response.data.count);
        this._setLearningPathsFromData(response.data.results);
    }

    async _loadPathsList() {
        const response = await udApi.get(BASE_PATH, {
            params: {
                page: this.currentPage,
                page_size: LIST_PAGE_SIZE,
                'fields[learning_path]': LEARNING_PATH_FIELDS,
                list_type: this.activeListType,
                ordering: this.selectedSort
                    ? SORT_OPTIONS[this.selectedSort].value
                    : SORT_OPTIONS.newest.value,
                search: this.searchParam,
                enrolled: this.selectedEnrolledFilter
                    ? PRO_ENROLLED_FILTERING_OPTIONS[this.selectedEnrolledFilter].value
                    : PRO_ENROLLED_FILTERING_OPTIONS.all.value,
            },
        });
        this._setTotalCountPaths(response.data.count);
        this._setLearningPathsFromData(response.data.results);
    }

    @autobind
    async loadFolders() {
        this._setLoadingFolders(true);
        try {
            const response = await udApi.get('/structured-data/tags/learning_path_folder/', {
                params: {
                    page_size: FOLDERS_PAGE_SIZE,
                    'fields[sd_tag]': '@default,descriptions',
                },
            });
            this._setFoldersFromData(response.data.results);
        } catch (e) {
            handleError(e, LIST_PAGE_ERROR_MESSAGES.UNABLE_TO_LOAD_FOLDERS);
        } finally {
            this._setLoadingFolders(false);
        }
    }

    @action
    _setTotalCountPaths(count) {
        this.totalCountPaths = count;
    }

    @action
    _setLearningPathsFromData(data) {
        this.paths = data.map((itemData) => new LearningPath(itemData));
    }

    @action
    _setFoldersFromData(data) {
        this.folders = data.map((folderData) => new LearningPathFolder(folderData));
    }

    @action
    _setChangingPage(value) {
        this.isChangingPage = value;
    }

    @action
    _setLoadingList(value) {
        this.isLoadingList = value;
    }

    @action
    _setLoadingFolders(value) {
        this.isLoadingFolders = value;
    }

    @action
    setFolderEditMode(isEnabled) {
        this.isFolderEditModeEnabled = isEnabled;
    }

    @action
    _setActiveListType(value) {
        this.activeListType = value;
    }

    @action
    _setActiveFolderId(value) {
        this.activeFolderId = value;
    }

    get isFolderPage() {
        return !!this.activeFolderId;
    }

    @computed
    get isShowingPaths() {
        return this.paths.length !== 0;
    }

    @computed
    get isProTabActive() {
        return this.activeListType === LIST_TYPES_WITH_PRO.pro.path;
    }

    @computed
    get shouldDisplayCreatePathButton() {
        return this.isShowingPaths || this.isFolderPage || this.isSearchMode;
    }

    @computed
    get shouldDisplaySorting() {
        return this.isShowingPaths || this.isSearchMode || this.shouldDisplayProListPageFilterBar;
    }

    @computed
    get shouldDisplayProListPageFilterBar() {
        return (
            this.isProTabActive &&
            (this.isShowingPaths ||
                this.isSearchMode ||
                this.selectedEnrolledFilter !== PRO_ENROLLED_FILTERING_OPTIONS.all.value)
        );
    }

    @computed
    get shouldDisplaySearch() {
        return this.isShowingPaths || this.isSearchMode || this.shouldDisplayProListPageFilterBar;
    }

    @computed
    get shouldDisplayLearningPathBar() {
        if (this.isSearchMode) {
            return true;
        }

        return !this.isChangingPage && this.isShowingPaths;
    }

    @computed
    get isSearchMode() {
        return this.search !== undefined;
    }

    @computed
    get isNoSearchResultMode() {
        return this.isSearchMode && !this.isShowingPaths;
    }

    @computed
    get isSortingDisabled() {
        return this.isNoSearchResultMode || this.paths.length < 2;
    }

    @computed
    get shouldDisplayFolderContextMenu() {
        return this.isFolderPage && this.activeFolder && isUserOrganizationAdminOrOwner();
    }

    @computed get isAddFolderButtonAvailable() {
        // we need to hide New folder button when we reach the limit of 100 SDNavigationList items
        return (
            isUserOrganizationAdminOrOwner() &&
            !this.isLoadingFolders &&
            this.folders &&
            this.folders.length <= 100
        );
    }

    @computed get activeFolder() {
        return this.folders.find((folder) => folder.id === this.activeFolderId);
    }

    @computed get listTitle() {
        if (this.activeListType === FOLDER_LIST_TYPE) {
            return this.activeFolder && this.activeFolder.title;
        }

        return this.listTypes[this.activeListType].title;
    }

    @computed get listDescription() {
        if (this.activeListType === FOLDER_LIST_TYPE) {
            return this.activeFolder && this.activeFolder.description;
        }

        return this.listTypes[this.activeListType].description;
    }

    @autobind
    async createNewFolder() {
        this._setLoadingList(true);
        // we need to se the activeFolderId to null so the EditableText updates correctly.
        this._setActiveFolderId(null);
        try {
            const response = await udApi.post('/structured-data/actions/', {
                actions: [
                    {
                        action: FOLDER_ACTIONS.CREATE,
                        options: {
                            org: {id: udConfig.brand.organization.id},
                        },
                    },
                ],
            });
            runInAction(() => {
                this.folders.push(new LearningPathFolder(response.data.results[0].data));
            });
            return response.data.results[0].data.id;
        } catch (e) {
            handleError(e, LIST_PAGE_ERROR_MESSAGES.UNABLE_TO_CREATE_FOLDER);
        } finally {
            this._setLoadingList(false);
        }
    }

    async deleteFolder(folderId) {
        try {
            await udApi.post('/structured-data/actions/', {
                actions: [
                    {
                        action: FOLDER_ACTIONS.DELETE,
                        options: {
                            learning_path_folder: {id: folderId},
                        },
                    },
                ],
            });
            runInAction(() => {
                this.folders = this.folders.filter((folder) => folder.id !== folderId);
            });
        } catch (e) {
            handleError(e, LIST_PAGE_ERROR_MESSAGES.UNABLE_TO_DELETE_FOLDER);
        }
    }

    // when creating a folder from the Add Learning Path to Folders modal,
    // it is necessary to update the folders list for the navigation
    @action
    updateFoldersList(folder) {
        this.folders.push(folder);
    }
}
