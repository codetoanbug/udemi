import {action, observable} from 'mobx';

import {useBadgeAssertionsImportedQuery} from 'gql-codegen/api-platform-graphql';

import {AssertionModel} from './upload-badge/assertion.mobx-model';

export class CertificationAssertionStore {
    @observable assertionList?: AssertionModel[];
    @observable isUserAssertionsLoaded = false;

    @action
    setAssertionList(assertionList: any) {
        this.assertionList = assertionList.map((assertion: any) => {
            return new AssertionModel(assertion);
        });
    }

    @action
    setAssertionsLoaded(isLoaded: boolean) {
        this.isUserAssertionsLoaded = isLoaded;
    }

    @action
    async fetchUserAssertion() {
        const response = await useBadgeAssertionsImportedQuery.fetcher({})();
        this.setAssertionList(response.badgeAssertionsImported?.items ?? []);
        this.setAssertionsLoaded(true);
    }
}
