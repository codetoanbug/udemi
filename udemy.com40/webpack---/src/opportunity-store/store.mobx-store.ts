import {action, observable} from 'mobx';

import {FilterMenuStore} from '../filter-menu/filter-menu.mobx-store';
import {QueryParams} from '../filter-menu/filter-menu.react-component';
import {OpportunityListStore} from '../opportunity-list/opportunity-list.mobx-store';

export interface OpportunityRootStoreParams {
    queryParams: QueryParams;
    itemCountPerPage: number;
    isIP: boolean;
    gettext: (text: string) => string;
}
export class OpportunityRootStore {
    @observable filterMenuStore: FilterMenuStore;
    @observable opportunityListStore: OpportunityListStore;
    @observable categoryId: string | null = null;

    constructor({queryParams, itemCountPerPage, isIP, gettext}: OpportunityRootStoreParams) {
        this.filterMenuStore = new FilterMenuStore(queryParams, gettext);
        this.opportunityListStore = new OpportunityListStore(itemCountPerPage, isIP);
        if (queryParams.c) {
            this.setCategoryId(queryParams.c);
        }
    }

    @action
    setCategoryId(categoryId: string) {
        this.categoryId = categoryId;
    }

    getParams() {
        const filterParams = this.filterMenuStore.getParams();
        const pageParams = this.opportunityListStore.getPageParams();
        const queryParams: string[] = [];

        if (filterParams) {
            queryParams.push(filterParams);
        }
        if (this.categoryId) {
            const categoryParams = `c=${this.categoryId}`;
            queryParams.push(categoryParams);
        }
        if (pageParams) {
            queryParams.push(pageParams);
        }
        return queryParams.join('&');
    }
}
