import {action, computed, observable} from 'mobx';

import {
    Topic,
    useTopicInterestAssignMutation,
    useTopicInterestUnassignMutation,
    useTopicInterestsQuery,
} from 'gql-codegen/api-platform-graphql';
import Raven from 'utils/ud-raven';

export class CertInterestButtonStore {
    @observable userCertificationInterests?: Topic[];

    // Loading states
    @observable private _userCertificationInterestsIsFetching = true;
    @observable private _userCertificationInterestsIsMutating = false;

    // Error states
    @observable private _userCertificationInterestsFetchHasErrored = false;
    @observable private _userCertificationInterestsMutationHasErrored = false;

    @computed
    get userCertificationInterestsIsFetching() {
        return this._userCertificationInterestsIsFetching;
    }

    set userCertificationInterestsIsFetching(loading) {
        this._userCertificationInterestsIsFetching = loading;
    }

    @computed
    get userCertificationInterestsIsMutating() {
        return this._userCertificationInterestsIsMutating;
    }

    set userCertificationInterestsIsMutating(loading) {
        this._userCertificationInterestsIsMutating = loading;
    }

    @computed
    get userCertificationInterestsFetchHasErrored() {
        return this._userCertificationInterestsFetchHasErrored;
    }

    set userCertificationInterestsFetchHasErrored(errorState) {
        this._userCertificationInterestsFetchHasErrored = errorState;
    }

    @computed
    get userCertificationInterestsMutationHasErrored() {
        return this._userCertificationInterestsMutationHasErrored;
    }

    set userCertificationInterestsMutationHasErrored(errorState) {
        this._userCertificationInterestsMutationHasErrored = errorState;
    }

    async getUserCertificationInterests() {
        this.userCertificationInterestsIsFetching = true;
        this.userCertificationInterestsFetchHasErrored = false;

        try {
            const {topicInterests} = await useTopicInterestsQuery.fetcher()();

            if (topicInterests) {
                this.setUserCertificationInterests(topicInterests as Topic[]);
            }
        } catch (e) {
            Raven.captureException(e);

            this.userCertificationInterestsFetchHasErrored = true;
        } finally {
            this.userCertificationInterestsIsFetching = false;
        }
    }

    @action
    setUserCertificationInterests(certificationInterests: Topic[]) {
        this.userCertificationInterests = certificationInterests;
    }

    async updateUserCertificationInterest(shouldAssign: boolean, topicIds: string[]) {
        this.userCertificationInterestsIsMutating = true;
        this.userCertificationInterestsMutationHasErrored = false;

        try {
            if (shouldAssign) {
                await useTopicInterestAssignMutation.fetcher({topicIds})();
            } else {
                await useTopicInterestUnassignMutation.fetcher({topicIds})();
            }
        } catch (e) {
            Raven.captureException(e);

            this.userCertificationInterestsMutationHasErrored = true;
        } finally {
            this.userCertificationInterestsIsMutating = false;
        }
    }
}
