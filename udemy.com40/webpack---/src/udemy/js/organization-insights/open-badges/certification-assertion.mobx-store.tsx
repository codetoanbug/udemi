import {action, observable} from 'mobx';

import {useBadgeAssertionsByUserQuery} from 'gql-codegen/api-platform-graphql';
import {AssertionModel} from 'open-badges/upload-badge/assertion.mobx-model';
import Raven from 'utils/ud-raven';

export class CertificationAssertionStore {
    @observable assertionList?: AssertionModel[];
    @observable isUserAssertionsLoaded = false;
    @observable userId: number;

    constructor(userId: number) {
        this.userId = userId;
    }

    @action
    setAssertionList(assertionList: any) {
        this.assertionList = assertionList?.map((assertion: any) => {
            return new AssertionModel(assertion);
        });
    }

    @action
    setAssertionsLoaded(isLoaded: boolean) {
        this.isUserAssertionsLoaded = isLoaded;
    }

    @action
    async fetchUserAssertion() {
        try {
            const response = await useBadgeAssertionsByUserQuery.fetcher({
                userId: this.userId.toString(),
                size: 20,
            })();
            this.setAssertionList(response.badgeAssertionsByUser?.items ?? []);
        } catch (error) {
            Raven.captureException(error);
            this.setAssertionList([]);
        }
        this.setAssertionsLoaded(true);
    }
}
