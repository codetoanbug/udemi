import autobind from 'autobind-decorator';
import {action, extendObservable, observable, computed} from 'mobx';

import {AVAILABLE_FEATURES} from 'course-taking/constants';
import {showReloadPageErrorToast, showSuccessToast} from 'instructor/toasts';
import {notificationPreferences} from 'user-notification-preferences/notification-preferences';
import udApi, {defaultErrorMessage, TIMEOUT} from 'utils/ud-api';

import CertificateStore from './certificate.mobx-store';
import CourseInstructorStore from './course-instructors.mobx-store';
import CoursePrivacyStore from './course-privacy.mobx-store';

export const OPTION_PUBLIC = 'OPTION_PUBLIC';
export const OPTION_PRIVATE_INVITE = 'OPTION_PRIVATE_INVITE';
export const OPTION_PRIVATE_PASSWORD = 'OPTION_PRIVATE_PASSWORD';

export default class SettingsStore {
    @observable course = {};
    @observable courseLoaded = false;

    @observable instructorStore = null;
    @observable integrationStore = null;
    @observable privacyStore = null;
    @observable certificateStore = null;
    @observable showOrganizationEligibleForm = false;

    constructor(pageStore) {
        this.pageStore = pageStore;
    }

    isDirty() {
        return (
            (this.instructorStore !== null && this.instructorStore.isDirty) ||
            (this.integrationStore !== null && this.integrationStore.isDirty) ||
            (this.privacyStore !== null && this.privacyStore.isDirty) ||
            (this.certificateStore !== null && this.certificateStore.isDirty)
        );
    }

    @autobind
    @action
    setUnpublished() {
        this.pageStore.refreshPublishCourseStatus();
    }

    @autobind
    @action
    openShowOrganizationEligibleForm() {
        this.showOrganizationEligibleForm = true;
    }

    @autobind
    @action
    closeShowOrganizationEligibleForm() {
        this.showOrganizationEligibleForm = false;
    }

    @action
    async leaveCourse() {
        return udApi.post(
            `/users/me/taught-courses/${this.course.id}/remove-from-instructors/`,
            {},
        );
    }

    fetchFields() {
        return udApi.get(`/courses/${this.pageStore.course.id}/`, {
            params: {
                'fields[course]':
                    'is_paid,instructor_share_ratio,' +
                    'is_in_any_ufb_content_collection,can_delete,organization_id,' +
                    'organization_title,is_private,available_features,' +
                    'has_org_only_setting,notification_settings,is_owner,' +
                    'is_organization_eligible,title,can_not_delete_reason,course_password',
            },
            timeout: TIMEOUT,
        });
    }

    @action
    getCourseSettings() {
        return Promise.all([this.fetchFields()])
            .then(
                action((responses) => {
                    const response = responses[0];
                    extendObservable(this.course, {
                        id: response.data.id,
                        isPaid: response.data.is_paid,
                        title: response.data.title,
                        isOwner: response.data.is_owner,
                        instructorShareRatio: response.data.instructor_share_ratio,
                        isInContentSubscription: response.data.is_in_any_ufb_content_collection,
                        canDelete: response.data.can_delete,
                        canNotDeleteReason: response.data.can_not_delete_reason,
                        organizationId: response.data.organization_id,
                        organizationTitle: response.data.organization_title,
                        isPrivate: response.data.is_private,
                        coursePassword: response.data.course_password || '',
                        certificateEnabled: response.data.available_features.includes(
                            AVAILABLE_FEATURES.CERTIFICATE,
                        ),
                        hasOrgOnlySetting: response.data.has_org_only_setting,
                        userNotifications: response.data.notification_settings,
                        isOrganizationEligible: Boolean(response.data.is_organization_eligible),
                    });
                    this.courseLoaded = true;
                    this.instructorStore = new CourseInstructorStore(this.course);
                    this.privacyStore = new CoursePrivacyStore(this.course);
                    this.certificateStore = new CertificateStore(this.course);
                }),
            )
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }

    @computed
    get isCoursePublished() {
        return this.pageStore.course.isPublished;
    }

    @computed
    get isUfoContentSubscriptionAgreed() {
        return this.pageStore.isUfoContentSubscriptionAgreed;
    }

    @autobind
    @action
    updateUserNotification(notificationType, value) {
        notificationPreferences
            .set(notificationType, value, this.course.id)
            .then(
                action(() => {
                    this.course.userNotifications[notificationType.typeCode] = value;
                    showSuccessToast(gettext('Your changes have been successfully saved.'));
                }),
            )
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }
}
