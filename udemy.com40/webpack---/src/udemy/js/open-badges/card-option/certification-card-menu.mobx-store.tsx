import {AlertBannerProps, ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import {action, observable} from 'mobx';

import {useBadgeClassEnrollmentsByBadgeClassIdQuery} from 'gql-codegen/api-platform-graphql';
import udApi from 'utils/ud-api';

import {CertificationModel} from '../certification.mobx-model';
import {sendCertificationUnenrolledEvent} from '../common/utils/event-helpers';
import {CourseModel} from '../course.mobx-model';
import {ProLearningPathModel} from '../pro-learning-path.mobx-model';

export class CertificationCardMenuMobxStore {
    @observable certification!: CertificationModel;
    @observable enrollmentModalStatus = false;
    @observable enrolledCourseList: CourseModel[] = [];
    @observable enrolledLearningPaths: ProLearningPathModel[] = [];
    @observable isLoading = false;

    constructor(certification: CertificationModel) {
        this.setCertification(certification);
    }

    @action
    setIsLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }

    @action
    setCertification(certification: CertificationModel) {
        this.certification = certification;
    }

    @action
    openUnEnrollmentModal() {
        this.enrollmentModalStatus = true;
    }

    @action
    closeUnEnrollmentModal() {
        this.isLoading = false;
        this.enrollmentModalStatus = false;
    }

    @action
    async unEnrollFromLearningProducts() {
        await this.unEnrollFromCourses();
        await this.unEnrollFromLearningPaths();
        if (this.certification) {
            sendCertificationUnenrolledEvent(this.certification.name);
        }
    }

    async unEnrollFromCourses() {
        await Promise.all(
            this.enrolledCourseList.map((course) =>
                udApi.delete(`users/me/subscribed-courses/${course.id}/`).catch(() => {
                    const bannerProps: AlertBannerProps = {
                        udStyle: 'error',
                        title: interpolate(
                            gettext('Failed to unenroll from %(courseTitle)s'),
                            {courseTitle: course.title},
                            true,
                        ),
                        showCta: false,
                    };
                    toasterStore.addAlertBannerToast(bannerProps, {
                        autoDismiss: true,
                    });
                }),
            ),
        );
    }

    async unEnrollFromLearningPaths() {
        await Promise.all(
            this.enrolledLearningPaths.map((learningPath) =>
                learningPath.removeEnrollmentFromPath(),
            ),
        );
    }

    @action
    async fetchEnrolledLearningProductList() {
        this.setIsLoading(true);
        const response = await useBadgeClassEnrollmentsByBadgeClassIdQuery.fetcher({
            badgeClassId: this.certification.id,
        })();
        const enrollments = response?.badgeClassEnrollmentsByBadgeClassId;
        const courses = enrollments
            ?.filter((enrollment) => enrollment.learningProduct.__typename === 'Course')
            .map((enrollment) => {
                return new CourseModel(enrollment.learningProduct);
            });
        this.setEnrolledCourseList(courses);

        const paths = enrollments
            ?.filter((enrollment) => {
                return enrollment.learningProduct.__typename === 'ProLearningPath';
            })
            .map((enrollment) => {
                return new ProLearningPathModel({
                    is_pro_path: true,
                    owner: {id: ''},
                    show_only_item_count: true,
                    ...enrollment.learningProduct,
                });
            });
        this.setEnrolledLearningPaths(paths);

        this.setIsLoading(false);
    }

    @action
    setEnrolledCourseList(enrolledCourseList: CourseModel[]) {
        this.enrolledCourseList = enrolledCourseList;
    }

    @action
    setEnrolledLearningPaths(enrolledLearningPaths: ProLearningPathModel[]) {
        this.enrolledLearningPaths = enrolledLearningPaths;
    }
}
