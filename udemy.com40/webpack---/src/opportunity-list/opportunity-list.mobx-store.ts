import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {API_STATE} from '../constants';
import {getEmbeddedOpportunities} from '../data/embedded';
import {
    NON_LOCALIZED_DOMAIN_FILTER_DATA,
    NON_LOCALIZED_LANGUAGE_FILTER_DATA,
} from '../filter/constants';
import {OpportunityRootStore} from '../opportunity-store/store.mobx-store';
import {EmbeddedSupplyGapOpportunity} from '../types';

export class OpportunityListStore {
    @observable opportunities: EmbeddedSupplyGapOpportunity[] = [];
    @observable activePage = 1;
    @observable selectedOpportunityUuid: string | null = null;
    @observable fetchOpportunitiesApiState: (typeof API_STATE)[keyof typeof API_STATE] =
        API_STATE.SEARCHING;
    itemCountPerPage = 8;
    _isIP = false;

    constructor(itemCountPerPage: number, isIP: boolean) {
        this.itemCountPerPage = itemCountPerPage;
        this._isIP = isIP;
    }

    @computed get hasOpportunity() {
        return this.opportunities.length > 0;
    }

    @computed get pageCount() {
        return Math.ceil(this.opportunities.length / this.itemCountPerPage);
    }

    @autobind @action setActivePage(pageNumber: number) {
        this.activePage = pageNumber;
    }

    @computed get maxPageCount() {
        return Math.ceil(this.opportunities.length / this.itemCountPerPage);
    }

    @computed get visibleOpportunities() {
        const startIndex = (this.activePage - 1) * this.itemCountPerPage;
        const endIndex = this.activePage * this.itemCountPerPage;
        return this.opportunities.slice(startIndex, endIndex);
    }

    @autobind
    @action
    setSelectedOpportunityUuid(uuid: string) {
        this.selectedOpportunityUuid = uuid;
    }

    @autobind getPageParams() {
        return `p=${this.activePage}&size=${this.itemCountPerPage}`;
    }

    @autobind isIP() {
        return this._isIP;
    }

    /*    getQueryFilters = (queryParams: string, filterMenuStore: FilterMenuStore) => {
        const languageFilterValues = filterMenuStore.languageFilterStore.checkedOptions.map(
            (option) => option.value,
        );
        const domainFilterValues = filterMenuStore.domainFilterStore.checkedOptions.map(
            (option) => option.value,
        );
        const filters = {
            courseLanguages: languageFilterValues,
            domains: domainFilterValues.length === 0 ? null : domainFilterValues,
        };
        const mxCategoryReference = getQueryParamValueWithParamName(queryParams, 'c');
        if (mxCategoryReference) {
            return {
                ...filters,
                mxCategoryReference: mxCategoryReference,
            };
        }
        return filters;
    };

    getFetchOpportunitiesQueryVariables = (
        queryParams: string,
        filterMenuStore: FilterMenuStore,
    ) => {
        const filters = this.getQueryFilters(queryParams, filterMenuStore);
        return {
            page: this.activePage,
            size: this.itemCountPerPage,
            filters: filters,
        };
    };

    enhanceResponseWithEmbeddedOpportunityInfo = (response: GetSupplyGapOpportunitiesQuery) => {
        const opportunityItems = response.deprecatedSupplyGapOpportunities?.items;
        if (!opportunityItems) {
            return [];
        }
        const opportunityIds: string[] = opportunityItems.map((opportunity) => opportunity.id);
        return embeddedOpportunities.filter((opportunity) =>
            opportunityIds.includes(opportunity.id),
        );
    };

    @action
    async fetchOpportunities(queryParams: string, filterMenuStore: FilterMenuStore) {
        // TODO: change activePage after data is fetched to 1
        try {
            this.fetchOpportunitiesApiState = API_STATE.SEARCHING;
            const queryVariables = this.getFetchOpportunitiesQueryVariables(
                queryParams,
                filterMenuStore,
            );
            const response = await useGetSupplyGapOpportunitiesQuery.fetcher()();
            this.opportunities = this.enhanceResponseWithEmbeddedOpportunityInfo(response);
            this.fetchOpportunitiesApiState = API_STATE.DONE;
        } catch (error) {
            this.opportunities = [];
            this.fetchOpportunitiesApiState = API_STATE.ERROR;
        }
    }*/

    getNonLocalizedValue = (key: string, optionArray: {key: string; value: string}[]): string => {
        const nonLocalizedValue = optionArray.find((option) => option.key === key);
        return nonLocalizedValue?.value || '';
    };

    @action
    async fetchOpportunitiesFromStaticList(
        store: OpportunityRootStore,
        gettext: (text: string) => string,
    ) {
        try {
            const filterMenuStore = store.filterMenuStore;
            const embeddedOpportunities = getEmbeddedOpportunities(gettext);
            this.opportunities = [];
            this.fetchOpportunitiesApiState = API_STATE.SEARCHING;
            let filteredOpportunities: EmbeddedSupplyGapOpportunity[];
            if (filterMenuStore.domainFilterStore.checkedOptions.length > 0) {
                filteredOpportunities = embeddedOpportunities.filter((opportunity) => {
                    const domainFilterValues = filterMenuStore.domainFilterStore.checkedOptions.map(
                        (option) =>
                            this.getNonLocalizedValue(option.key, NON_LOCALIZED_DOMAIN_FILTER_DATA),
                    );
                    if (domainFilterValues.includes(opportunity.domain)) {
                        return opportunity;
                    }
                });
            } else {
                filteredOpportunities = embeddedOpportunities;
            }
            if (filterMenuStore.languageFilterStore.checkedOptions.length > 0) {
                filteredOpportunities = filteredOpportunities.filter((opportunity) => {
                    const languageFilterValues =
                        filterMenuStore.languageFilterStore.checkedOptions.map((option) =>
                            this.getNonLocalizedValue(
                                option.key,
                                NON_LOCALIZED_LANGUAGE_FILTER_DATA,
                            ),
                        );
                    if (languageFilterValues.includes(opportunity.courseLanguage)) {
                        return opportunity;
                    }
                });
            }
            if (store.categoryId) {
                filteredOpportunities = filteredOpportunities.filter((opportunity) => {
                    if (opportunity.mxCategories && opportunity.mxCategories.length > 0) {
                        for (const category of opportunity.mxCategories) {
                            if (category.reference === store.categoryId) {
                                return opportunity;
                            }
                        }
                    }
                });
            }
            if (!this.isIP()) {
                filteredOpportunities = filteredOpportunities.filter((opportunity) => {
                    if (opportunity.displayRule === 'All instructors') {
                        return opportunity;
                    }
                });
            }

            this.opportunities = filteredOpportunities;
            if (this.maxPageCount < this.activePage) {
                this.setActivePage(1);
            }
            this.fetchOpportunitiesApiState = API_STATE.DONE;
        } catch (error) {
            this.opportunities = [];
            this.fetchOpportunitiesApiState = API_STATE.ERROR;
        }
    }
}
