import {action, observable, runInAction} from 'mobx';

import {showReloadPageErrorToast} from 'instructor/toasts';
import udApi, {defaultErrorMessage} from 'utils/ud-api';

export default class CloseAccountInfoStore {
    @observable isLoaded = false;
    @observable numSubscribedCourses = false;
    @observable canBeDeleted = false;
    @observable ownsCourses = false;
    @observable isCoInstructor = false;
    @observable isCoInstructorWithEditPermission = false;
    @observable hasPaymentDependencyForDeletion = false;
    @observable ownsCoursesInUfbContentCollections = false;
    @observable ownsCoursesWithEnrollments = false;
    @observable activeOrganizationMembershipData = [];

    @action
    async fetchUserData() {
        try {
            const response = await udApi.get('/users/me/', {
                params: {
                    'fields[user]':
                        'num_subscribed_courses,can_be_deleted,owns_courses,' +
                        'is_co_instructor,is_co_instructor_with_edit_permission,' +
                        'has_payment_dependency_for_deletion,' +
                        'owns_courses_in_ufb_content_collections,' +
                        'owns_courses_with_enrollments,' +
                        'active_organization_membership_data',
                },
            });
            runInAction(() => {
                ({
                    num_subscribed_courses: this.numSubscribedCourses,
                    can_be_deleted: this.canBeDeleted,
                    owns_courses: this.ownsCourses,
                    is_co_instructor: this.isCoInstructor,
                    is_co_instructor_with_edit_permission: this.isCoInstructorWithEditPermission,
                    has_payment_dependency_for_deletion: this.hasPaymentDependencyForDeletion,
                    owns_courses_in_ufb_content_collections: this
                        .ownsCoursesInUfbContentCollections,
                    owns_courses_with_enrollments: this.ownsCoursesWithEnrollments,
                    active_organization_membership_data: this.activeOrganizationMembershipData,
                } = response.data);

                this.isLoaded = true;
            });
        } catch (error) {
            showReloadPageErrorToast(defaultErrorMessage);
        }
    }
}
