import {action, observable} from 'mobx';

import {
    BadgeClassesByLearningProductsQuery,
    LearningProductType,
    Topic,
    useBadgeClassesByLearningProductsQuery,
    useBadgeClassesByTopicQuery,
} from 'gql-codegen/api-platform-graphql';

import {CertificationModel} from '../certification.mobx-model';

export class CertificationUnitStore {
    @observable certificationsList?: CertificationModel[];
    @observable learningProductCertifications?: CertificationModel[];
    @observable certificationTopic?: Topic;

    @action
    async getCertificationsByTopic(topicId: string) {
        const {badgeClassesByTopic} = await useBadgeClassesByTopicQuery.fetcher({topicId})();

        if (badgeClassesByTopic) {
            this.setCertificationsList(badgeClassesByTopic);
        }
    }

    @action
    async getLearningProductCertifications(
        learningProductId: number,
        learningProductType: LearningProductType,
    ) {
        const learningProductInput = {
            id: learningProductId.toString(),
            type: learningProductType,
        };
        const {
            badgeClassesByLearningProducts,
        } = await useBadgeClassesByLearningProductsQuery.fetcher({
            learningProducts: [learningProductInput],
        })();

        this.setLearningProductCertifications(badgeClassesByLearningProducts ?? []);
    }

    @action
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setCertificationsList(badgeClasses: any) {
        // TODO: use the correct type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.certificationsList = badgeClasses.map((badgeClass: any) => {
            return new CertificationModel(badgeClass);
        });
    }

    @action
    setLearningProductCertifications(
        badgeClasses: BadgeClassesByLearningProductsQuery['badgeClassesByLearningProducts'],
    ) {
        this.learningProductCertifications = badgeClasses?.map((badgeClass) => {
            return new CertificationModel(badgeClass);
        });
    }
}
