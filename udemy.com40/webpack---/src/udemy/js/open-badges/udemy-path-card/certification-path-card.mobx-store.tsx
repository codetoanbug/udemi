import {action, computed, observable, runInAction} from 'mobx';

import {useProLearningPathsByTopicQuery} from 'gql-codegen/api-platform-graphql';
import LearningPath from 'learning-path/learning-path.mobx-model';
import getConfigData from 'utils/get-config-data';
import udMe from 'utils/ud-me';

import {CertificationModel} from '../certification.mobx-model';

const udConfig = getConfigData();

export class CertificationPathCardStore {
    @observable learningPath: LearningPath;
    @observable.ref certification: CertificationModel;
    private userHasUBProAccess = !!(
        udConfig.brand.has_organization &&
        (udConfig.features.organization.learning_path.pro_path ||
            udMe.organization?.is_pro_license_holder)
    );

    constructor(certification: CertificationModel) {
        this.certification = certification;
        this.learningPath = new LearningPath({});
    }

    @computed
    get shouldRenderCertificationPathCard() {
        return !this.learningPath.isCurriculumLoading && this.userHasUBProAccess;
    }

    @action
    async fetchLearningPath() {
        if (!this.userHasUBProAccess) {
            return;
        }
        const response = await useProLearningPathsByTopicQuery.fetcher({
            topicId: this.certification.topic.id,
        })();
        const isAnyPathObtained = response?.proLearningPathsByTopic?.length > 0;
        if (!isAnyPathObtained) {
            return;
        }
        const learningPathDetails = response?.proLearningPathsByTopic?.[0];
        runInAction(() => {
            this.learningPath.setDataFromAPI({
                id: learningPathDetails.id,
                title: learningPathDetails.title,
                description: learningPathDetails.description,
                total_steps: learningPathDetails.itemCount,
                owner: {
                    id: '',
                },
                is_user_enrolled: false,
                num_enrollments: learningPathDetails.numberOfEnrollments,
                organization_id: '',
            });
            // TODO: get that data from graphql instead of monolith
            this.learningPath.fetchCurriculum();
            this.learningPath._setCurriculumLoading(false);
        });
    }
}
