import {action, observable, runInAction} from 'mobx';

import getConfigData from 'utils/get-config-data';
import udMe from 'utils/ud-me';

import {CertificationStore} from '../certification.mobx-store';
import {MAX_CERTIFICATE_COURSE_COUNT} from '../constants';
import {CourseModel} from '../course.mobx-model';
import {ProLearningPathModel} from '../pro-learning-path.mobx-model';

const udConfig = getConfigData();
export class CertificationLearningProductListMobxStore {
    certificationStore: CertificationStore;

    @observable courses: CourseModel[] = [];
    @observable learningPaths: ProLearningPathModel[] = [];

    activeTab = 'learning_tab';
    pageSize = 0;
    pageCount = 0;
    userHasUBProAccess = !!(
        udConfig.brand.has_organization &&
        (udConfig.features.organization.learning_path.pro_path ||
            udMe.organization?.is_pro_license_holder)
    );

    constructor(certificationStore: CertificationStore) {
        this.certificationStore = certificationStore;
    }

    @action
    async fetchEnrolledBadgeLearningProducts(badgeId: string) {
        this.certificationStore.fetchBadgeClassEnrollments(badgeId).then(() => {
            runInAction(() => {
                this.courses = this.certificationStore.enrolledCourses.slice(
                    0,
                    MAX_CERTIFICATE_COURSE_COUNT,
                );
                if (this.userHasUBProAccess) {
                    this.learningPaths = this.certificationStore.enrolledLearningPaths.slice(
                        0,
                        MAX_CERTIFICATE_COURSE_COUNT,
                    );
                }
            });
        });
    }

    get isEnrolledBadgeLearningProductsLoaded() {
        return this.certificationStore.isBadgeClassEnrollmentsLoaded;
    }
}
