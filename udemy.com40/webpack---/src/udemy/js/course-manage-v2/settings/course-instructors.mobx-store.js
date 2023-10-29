import {ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {action, observable, computed, runInAction} from 'mobx';

import {showSuccessToast} from 'instructor/toasts';
import udApi from 'utils/ud-api';

import udMe from '../../utils/ud-me';

export default class CourseInstructorStore {
    @observable isLoading = false;
    @observable isSaving = false;
    @observable isDirty = false;
    @observable errors = [];
    @observable instructors = [];
    @observable pendingInstructors = [];
    @observable performanceAccessChanged = false;
    @observable instructorRemovedSelfManagePermission = false;
    @observable revokingInvitations = [];

    course = null;

    // Default permission codes should be a part of the app initialisation
    // TODO move it to the component initialising the store and pass it via
    // constructor param.
    defaultPermissionCodes = [
        'instructor:edit_course',
        'instructor:manage_captions',
        'instructor:manage_course_qa',
        'instructor:manage_course_assignments',
        'instructor:view_course_revenue_report',
        'instructor:manage_course_reviews',
        'instructor:manage_course_performance',
    ];

    defaultPermissions = this.defaultPermissionCodes.reduce((obj, code) => {
        obj[code] = false;
        return obj;
    }, {});

    @computed
    get isValidRevenue() {
        const base = 0;
        return (
            !this.course.isPaid ||
            this.instructors.reduce((initial, instructor) => {
                return initial + instructor.revenue_share_percentage;
            }, base) === 100
        );
    }

    constructor(course) {
        this.course = course;
        this.fetchInstructors();
    }

    @action
    fetchInstructors() {
        this.errors.clear();
        this.isLoading = true;
        return udApi
            .get(`/courses/${this.course.id}/course-has-instructors/`, {
                params: {
                    'fields[course_has_instructor]':
                        '@min,visible,is_owner,revenue_share_percentage',
                    'fields[user]': '@min,permissions',
                    page_size: 200,
                },
            })
            .then(
                action(({data}) => {
                    this.instructors = data.results.map((instructor) => {
                        instructor.revenue_share_percentage = Math.round(
                            instructor.revenue_share_percentage * this.course.instructorShareRatio,
                        );
                        // Copy default permissions onto instructor
                        Object.assign(instructor, this.defaultPermissions);
                        // Set permissions from payload as true
                        for (const userHasPermission of instructor.user.permissions) {
                            instructor[userHasPermission.permission] = true;
                        }
                        return instructor;
                    });
                }),
            )
            .then(this.fetchPendingInstructors())
            .finally(
                action(() => {
                    this.isLoading = false;
                }),
            );
    }

    @autobind
    @action
    fetchPendingInstructors() {
        return udApi
            .get(`/users/me/taught-courses/${this.course.id}/co-instructor-invitations/`)
            .then(
                action(({data}) => {
                    this.pendingInstructors = data.results.map((instructor) => {
                        instructor.revenue_share_percentage = 0;
                        // Copy default permissions onto instructor
                        Object.assign(instructor, this.defaultPermissions);

                        // Set permissions from payload as true
                        for (const userHasPermission of instructor.permissions) {
                            instructor[userHasPermission] = true;
                        }
                        return instructor;
                    });
                }),
            );
    }

    @action
    revokeInvitation(invitationId) {
        this.revokingInvitations.push(invitationId);
        this.isDirty = true;
    }

    @action
    addError(message, isHTML = false) {
        this.errors.push({message, isHTML});
    }

    @action
    deleteInstructor(id) {
        this.instructors = this.instructors.filter((instructor) => instructor.user.id !== id);
        this.isDirty = true;
    }

    @autobind
    @action
    save() {
        this.errors.clear();
        this.isSaving = true;

        const allInvisible = this.instructors.every((instructor) => !instructor.visible);
        if (allInvisible) {
            this.isSaving = false;
            return this.addError(gettext('At least one instructor must be visible.'));
        }

        const data = this._normaliseInstructors();

        const didInstructorRemoveTheirOwnManagePermission = this._didInstructorRemoveTheirOwnManagePermission();

        return udApi
            .post(`/courses/${this.course.id}/course-has-instructors/`, {
                course_has_instructors: data,
            })
            .then(() =>
                Promise.all(
                    this.revokingInvitations.map((id) =>
                        udApi.patch(
                            `/users/me/taught-courses/${this.course.id}/co-instructor-invitations/${id}/revoke/`,
                        ),
                    ),
                ),
            )
            .then(
                action(() => {
                    const alertText = this.performanceAccessChanged
                        ? gettext(
                              'Your changes have been successfully saved. It may take up to one day for Performance access to take effect.',
                          )
                        : gettext('Your changes have been successfully saved.');
                    showSuccessToast(alertText);
                    this.setPerformanceAccessChanged(false);
                    if (didInstructorRemoveTheirOwnManagePermission) {
                        this.instructorRemovedSelfManagePermission = true;
                    }
                }),
            )
            .catch(
                action((error) => {
                    const bannerProps = {
                        udStyle: 'error',
                        title: gettext('Error'),
                        body: gettext('An unknown error has occurred.'),
                        showCta: false,
                    };
                    if (error.response?.headers?.['x-ui-message']) {
                        // Message can contain bold, italic or Japanese characters which are HTML
                        // this.addError(error.response.headers['x-ui-message'], true);
                        bannerProps.body = error.response.headers['x-ui-message'];
                    }
                    toasterStore.addAlertBannerToast(bannerProps, {autoDismiss: true});
                }),
            )
            .finally(async () => {
                await this.fetchInstructors();
                runInAction(() => {
                    this.revokingInvitations.clear();
                    this.isDirty = false;
                    this.isSaving = false;
                });
            });
    }

    @action
    _setValue(field, instructorId, value) {
        const target = this.instructors.find((instructor) => instructor.user.id == instructorId);
        target[field] = value;
        this.isDirty = true;
    }

    setVisible(instructorId, value) {
        this._setValue('visible', instructorId, value);
    }

    setPermission(instructorId, permission, value) {
        this._setValue(permission, instructorId, value);
        if (permission === 'instructor:manage_course_performance') {
            this.setPerformanceAccessChanged(true);
        }
    }

    setRevenuePercentage(instructorId, value) {
        this._setValue('revenue_share_percentage', instructorId, value);
    }

    @action
    setPerformanceAccessChanged(value) {
        this.performanceAccessChanged = value;
    }

    _normaliseInstructors() {
        const normalised = this.instructors.map((instructor) => {
            const revenueShare =
                Math.round(
                    (instructor.revenue_share_percentage / this.course.instructorShareRatio) * 100,
                ) / 100;

            const permissions = {};
            for (const permissionCode of this.defaultPermissionCodes) {
                permissions[permissionCode] = instructor[permissionCode];
            }
            return {
                instructor_id: instructor.user.id,
                visible: instructor.visible,
                revenue_share_percentage: revenueShare,
                permissions,
            };
        });
        return JSON.stringify(normalised);
    }

    _didInstructorRemoveTheirOwnManagePermission() {
        const selfPermissions = this.instructors.find((row) => {
            return row.user.id === udMe.id;
        });
        return !selfPermissions['instructor:edit_course'];
    }
}
