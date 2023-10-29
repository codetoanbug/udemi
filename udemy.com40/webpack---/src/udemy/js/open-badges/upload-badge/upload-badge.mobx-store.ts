import {action, observable} from 'mobx';

import {useStoreAssertionByUrlMutation} from 'gql-codegen/api-platform-graphql';

import {AssertionModel} from './assertion.mobx-model';

export class UploadBadgeStore {
    @observable isUploadBadgeModalOpen = false;
    @observable isUploadedBadgeSuccessModalOpen = false;
    @observable isUploadedBadgeNoMatchModalOpen = false;
    @observable badgeUploadSuccess = false;
    @observable assertion?: AssertionModel;
    @observable errorMessage?: string;
    @observable expectedBadgeClassId?: string;

    constructor(expectedBadgeClassId?: string) {
        this.expectedBadgeClassId = expectedBadgeClassId;
    }

    @action
    setUploadBadgeModalOpen = (isOpen: boolean) => {
        this.isUploadBadgeModalOpen = isOpen;
    };

    @action
    setUploadedBadgeSuccessModalOpen = (isOpen: boolean) => {
        this.isUploadedBadgeSuccessModalOpen = isOpen;
    };

    @action
    setUploadedBadgeNoMatchModalOpen = (isOpen: boolean) => {
        this.isUploadedBadgeNoMatchModalOpen = isOpen;
    };

    @action
    setBadgeUploadSuccess = (isSuccess: boolean) => {
        this.badgeUploadSuccess = isSuccess;
    };

    validateBadgeAssertion = async (verificationUrl: string) => {
        try {
            const response = await useStoreAssertionByUrlMutation.fetcher({
                externalUrl: verificationUrl,
            })();
            const userAssertion = new AssertionModel(response.badgeAssertionStoreByUrl);
            this.setAssertion(userAssertion);
        } catch (e) {
            throw e;
        }
    };

    @action
    setAssertion = (assertion: AssertionModel) => {
        this.assertion = assertion;
    };

    @action
    setErrorMessage = (errorMessage?: string) => {
        this.errorMessage = errorMessage;
    };
}
