import {observable, get, action} from 'mobx';

import {DOMAIN_FILTER_DATA, LANGUAGE_FILTER_DATA} from '../filter/constants';
import {DomainFilterStore, LanguageFilterStore} from '../filter/filter.mobx-store';
import {QueryParams} from './filter-menu.react-component';

export class FilterMenuStore {
    @observable languageFilterStore = new LanguageFilterStore(
        LANGUAGE_FILTER_DATA((text: string) => text),
        'l',
        [],
    );
    @observable domainFilterStore = new DomainFilterStore(
        DOMAIN_FILTER_DATA((text: string) => text),
        'd',
        [],
    );

    constructor(params: QueryParams, gettext: (text: string) => string) {
        this.createInitialStoresWithParams(params, gettext);
    }

    @action
    createInitialStoresWithParams({l, d}: QueryParams, gettext: (text: string) => string) {
        const languageParamValues = this.parseQueryString(l);
        this.languageFilterStore = new LanguageFilterStore(
            LANGUAGE_FILTER_DATA(gettext),
            'l',
            languageParamValues,
        );

        const domainParamValues = this.parseQueryString(d);
        this.domainFilterStore = new DomainFilterStore(
            DOMAIN_FILTER_DATA(gettext),
            'd',
            domainParamValues,
        );
    }

    @get getParams() {
        const queryParams: string[] = [];
        const languageParams = this.languageFilterStore.getParams();
        const domainParams = this.domainFilterStore.getParams();

        if (languageParams) {
            queryParams.push(languageParams);
        }
        if (domainParams) {
            queryParams.push(domainParams);
        }
        return queryParams.join('&');
    }

    parseQueryString(paramValue?: string) {
        if (!paramValue) {
            return [];
        }
        return paramValue.split(',');
    }
}
