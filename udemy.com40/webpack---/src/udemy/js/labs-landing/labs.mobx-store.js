import {ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import loadInProgressLabsUnit from 'browse/lib/load-in-progress-labs-unit';
import {
    API_LAB_ALL_FIELDS,
    FETCH_LABS_FEEDBACK,
    SORT_OPTIONS,
    LABS_API_URL,
    SEARCH_PARAMS,
    MAX_LAB_ESTIMATED_TIME_MINUTES,
    ACTIVE_LAB_STATUS,
} from 'labs-landing/constants';
import {
    ERROR_NOTIFICATION_PROPS,
    NOTIFICATION_OPTIONS,
    LAB_VERTICAL,
    SEARCH_CATEGORIES_FILTER,
} from 'labs/constants';
import Lab from 'labs/lab.mobx-model';
import udApi from 'utils/ud-api';

export default class LabsStore {
    @observable labs = [];
    @observable inProgressLabs = [];
    @observable labsLoading = true;
    @observable searchTerm = '';

    @observable pillSelected = false;
    @observable term = '';
    @observable searchVertical = SEARCH_CATEGORIES_FILTER.all.key;
    @observable selectedOrdering;

    @observable page = 0;
    @observable alrFilter = false;
    @observable extendedWorkspaceFilter = false;
    @observable shortTimeWorkspaceFilter = false;
    @observable maxEstimatedTimeLte = MAX_LAB_ESTIMATED_TIME_MINUTES;
    @observable showGCPBetaListing = false;

    @observable showSecurityBetaListing = false;
    resultsLength = 0;

    paginationEnabled = false;

    constructor(gcpBetaListing, securityBetaListing, paginationEnabled) {
        this.showGCPBetaListing = gcpBetaListing;
        this.showSecurityBetaListing = securityBetaListing;
        this.paginationEnabled = paginationEnabled;
    }

    @action
    setPage(page) {
        if (page !== this.page) {
            this.page = page;
        }
    }

    @computed
    get urlSearchParamsV2() {
        const params = {};
        if (this.page > 1) {
            params.p = this.page;
        }
        if (this.selectedOrdering) {
            params.sort = this.selectedOrdering;
        }
        if (this.alrFilter) {
            params[SEARCH_PARAMS.ALR_FILTER] = this.alrFilter;
        }
        if (this.shortTimeWorkspaceFilter) {
            params[SEARCH_PARAMS.SHORT_TIME_WORKSPACE_FILTER] = this.shortTimeWorkspaceFilter;
        }
        if (this.extendedWorkspaceFilter) {
            params[SEARCH_PARAMS.EXTENDED_WORKSPACE_FILTER] = this.extendedWorkspaceFilter;
        }
        if (this.searchTerm) {
            params.query = this.searchTerm;
        }
        if (this.searchVertical !== SEARCH_CATEGORIES_FILTER.all.key) {
            params.vertical = this.searchVertical;
        }
        if (this.maxEstimatedTimeLte) {
            params[SEARCH_PARAMS.MAX_ESTIMATED_TIME_LTE] = this.maxEstimatedTimeLte;
        }
        return params;
    }

    @action
    async setOrdering(ordering) {
        if (ordering !== this.selectedOrdering) {
            this.selectedOrdering = ordering;
            if (this.paginationEnabled) {
                this.page = 1;
            } else {
                await this.loadLabs();
            }
        }
    }

    @computed
    get isSortingDisabled() {
        return this.filteredLabs.length < 2;
    }

    @action
    async setAlrFilter(alrFilter) {
        if (alrFilter !== this.alrFilter) {
            this.alrFilter = alrFilter;
            if (this.paginationEnabled) {
                this.page = 1;
            } else {
                this._setLabs([]);
                await this.loadLabs();
            }
        }
    }

    @action
    setExtendedWorkspaceFilter(extendedWorkspaceFilter) {
        if (extendedWorkspaceFilter !== this.extendedWorkspaceFilter) {
            this.extendedWorkspaceFilter = extendedWorkspaceFilter;
            this.page = 1;
        }
    }

    @action
    setShortTimeWorkspaceFilter(shortTimeWorkspaceFilter) {
        if (shortTimeWorkspaceFilter !== this.shortTimeWorkspaceFilter) {
            this.shortTimeWorkspaceFilter = shortTimeWorkspaceFilter;
            this.page = 1;
        }
    }

    @action
    setMaxEstimatedTimeLte(value) {
        if (value !== this.maxEstimatedTimeLte) {
            this.maxEstimatedTimeLte = value;
            this.page = 1;
        }
    }

    @autobind
    async loadLabs(labFields = API_LAB_ALL_FIELDS) {
        this._setLabs([], 0);
        this._setLoading(true);
        let labParams = {
            'fields[lab]': labFields,
            ordering: this.selectedOrdering
                ? SORT_OPTIONS[this.selectedOrdering].value
                : SORT_OPTIONS.newest.value,
            ...(this.alrFilter && {[SEARCH_PARAMS.ALR_FILTER]: true}),
            ...(this.shortTimeWorkspaceFilter && {
                [SEARCH_PARAMS.SHORT_TIME_WORKSPACE_FILTER]: true,
            }),
            ...(this.extendedWorkspaceFilter && {[SEARCH_PARAMS.EXTENDED_WORKSPACE_FILTER]: true}),
            ...(this.maxEstimatedTimeLte &&
                this.maxEstimatedTimeLte < MAX_LAB_ESTIMATED_TIME_MINUTES && {
                    [SEARCH_PARAMS.MAX_ESTIMATED_TIME_LTE]: this.maxEstimatedTimeLte,
                }),
        };
        if (this.paginationEnabled) {
            const searchFor = this.searchTerm.toLowerCase().trim().replace(/ /g, '_');
            const vertical = LAB_VERTICAL[searchFor]?.key;

            labParams = {
                ...labParams,
                page: this.page,
                // if a vertical is found in the search term, do not further filter the labs on the basis of the search term
                query: vertical ? '' : this.searchTerm?.trim(),
                vertical:
                    vertical || SEARCH_CATEGORIES_FILTER[this.searchVertical].verticals.join(','),
            };
        }

        try {
            const response = await udApi.get(LABS_API_URL.modularListing, {
                params: labParams,
            });
            if (response.status === 200 && response?.data) {
                this._setLabs(
                    response.data.results,
                    response?.data?.count === undefined ? 0 : response?.data?.count,
                );
            } else {
                this.handleError(FETCH_LABS_FEEDBACK.text);
            }
        } catch (e) {
            this.handleError(FETCH_LABS_FEEDBACK.text);
        } finally {
            this._setLoading(false);
        }
    }

    async loadInProgressLabs() {
        const results = await loadInProgressLabsUnit();
        this._setInProgressLabs(results);
    }

    /** @param {string} [term=undefined]
     * @param {boolean} [pillSelected=false] This is used in survey tracking data
     */
    @action
    setSearchTerm(term = undefined, pillSelected = false) {
        // The `searchTerm` is set when the user clicks on the search btn or when they click on the topic pills and the search action happens.
        // Meanwhile, `term` is used when the user types in the search bar but we don't do the search until the user clicks on the search btn.
        this.searchTerm = term === undefined ? this.term.toLowerCase() : term.toLowerCase();
        this.term = this.searchTerm;
        this.pillSelected = pillSelected;
        if (this.paginationEnabled) {
            this.page = 1;
        }
    }

    @autobind
    @action
    setSearchInputValue(value) {
        this.term = value;
    }

    @action
    setSearchVertical(vertical) {
        this.searchVertical = vertical;
        if (this.paginationEnabled) {
            this.page = 1;
        }
    }

    handleError(error) {
        toasterStore.addAlertBannerToast(
            {
                ...ERROR_NOTIFICATION_PROPS,
                title: error,
            },
            NOTIFICATION_OPTIONS,
        );
    }

    @action
    _setLabs(labs, count) {
        this.labs = labs.map((lab) => {
            return new Lab(lab);
        });
        this.resultsLength = count;
    }

    @action
    _setInProgressLabs(labs) {
        this.inProgressLabs = labs.reduce((acc, lab) => {
            if (ACTIVE_LAB_STATUS.includes(lab.my_latest_instance?.status)) {
                acc.push(new Lab(lab));
            }
            return acc;
        }, []);
    }

    @action
    _setLoading(isLoading) {
        this.labsLoading = isLoading;
    }

    @action
    _setShowGCPBetaListing(showGCPBetaListing) {
        this.showGCPBetaListing = showGCPBetaListing;
    }

    @action
    _setShowSecurityBetaListing(showSecurityBetaListing) {
        this.showSecurityBetaListing = showSecurityBetaListing;
    }

    get filteredLabs() {
        if (this.paginationEnabled) {
            return this.labs;
        }
        const filteredLabs = this.labs.filter(
            (lab) =>
                lab.title.toLowerCase().includes(this.searchTerm) ||
                LAB_VERTICAL[lab.vertical].label.toLowerCase().includes(this.searchTerm) ||
                lab.verticalLabel.toLowerCase().includes(this.searchTerm) ||
                ('javascript' === this.searchTerm.toLowerCase() &&
                    (lab.verticalLabel.toLowerCase().includes('react') ||
                        lab.verticalLabel.toLowerCase().includes('typescript'))),
        );

        return filteredLabs.filter(
            (lab) =>
                SEARCH_CATEGORIES_FILTER[this.searchVertical]?.verticals?.includes(lab.vertical) &&
                (lab.vertical !== LAB_VERTICAL.gcp.key ||
                    (lab.vertical === LAB_VERTICAL.gcp.key && this.showGCPBetaListing)) &&
                (lab.vertical !== LAB_VERTICAL.security.key ||
                    (lab.vertical === LAB_VERTICAL.security.key && this.showSecurityBetaListing)),
        );
    }

    @action
    updateSearchQuery(searchQuery) {
        if (searchQuery.vertical) {
            this.searchVertical = searchQuery.vertical;
        }
        if (searchQuery.sort) {
            this.selectedOrdering = searchQuery.sort;
        }
        if (searchQuery.alrFilter) {
            this.alrFilter = searchQuery.alrFilter;
        }
        if (searchQuery.page) {
            this.page = searchQuery.page;
        }
        if (searchQuery.maxEstimatedTimeLte) {
            this.maxEstimatedTimeLte = searchQuery.maxEstimatedTimeLte;
        }
        if (searchQuery.shortTimeWorkspaceFilter) {
            this.shortTimeWorkspaceFilter = searchQuery.shortTimeWorkspaceFilter;
        }
        if (searchQuery.extendedWorkspaceFilter) {
            this.extendedWorkspaceFilter = searchQuery.extendedWorkspaceFilter;
        }
        if (typeof searchQuery.search !== 'undefined') {
            this.setSearchTerm(searchQuery.search);
        }
    }

    @computed
    get urlSearchParams() {
        const params = {};

        if (this.searchVertical) {
            params.vertical = this.searchVertical;
        }
        if (this.selectedOrdering) {
            params.sort = this.selectedOrdering;
        }
        if (this.searchTerm && this.searchTerm.trim()) {
            params.search = this.searchTerm;
        }
        if (this.alrFilter) {
            params[SEARCH_PARAMS.ALR_FILTER] = this.alrFilter;
        }
        if (this.maxEstimatedTimeLte && this.maxEstimatedTimeLte < MAX_LAB_ESTIMATED_TIME_MINUTES) {
            params[SEARCH_PARAMS.MAX_ESTIMATED_TIME_LTE] = this.maxEstimatedTimeLte;
        }
        if (this.shortTimeWorkspaceFilter) {
            params[SEARCH_PARAMS.SHORT_TIME_WORKSPACE_FILTER] = this.shortTimeWorkspaceFilter;
        }
        if (this.extendedWorkspaceFilter) {
            params[SEARCH_PARAMS.EXTENDED_WORKSPACE_FILTER] = this.extendedWorkspaceFilter;
        }
        if (this.page > 1) {
            params.p = this.page;
        }
        return params;
    }

    @computed
    get urlSearchString() {
        return new URLSearchParams(this.urlSearchParams).toString();
    }
}
