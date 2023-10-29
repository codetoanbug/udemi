import {ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import udApi from 'utils/ud-api';

export default class AddCoInstructorStore {
    @observable newInstructorEmail = '';
    @observable newInstructorEmailError = '';
    @observable newInstructorPermissions = null;
    @observable newInstructorVisible = false;
    @observable isSaving = false;

    courseId = null;

    permissions = {
        2: {
            code: 'instructor:edit_course',
            order: 1,
            text: gettext('Manage course'),
        },
        4: {
            code: 'instructor:manage_course_reviews',
            order: 6,
            text: gettext('Reviews'),
        },
        6: {
            code: 'instructor:view_course_revenue_report',
            order: 7,
            text: gettext('Revenue report'),
        },
        8: {code: 'instructor:manage_course_qa', order: 4, text: gettext('Q&A'), MXOnly: true},
        10: {
            code: 'instructor:manage_course_assignments',
            order: 5,
            text: gettext('Assignments'),
        },
        14: {
            code: 'instructor:manage_captions',
            order: 2,
            text: gettext('Captions'),
        },
        18: {
            code: 'instructor:manage_course_performance',
            order: 3,
            text: gettext('Performance'),
        },
    };

    constructor(courseId, hiddenPermissions) {
        this.courseId = courseId;
        this.newInstructorPermissions = Object.entries(this.permissions)
            .filter((p) => !hiddenPermissions || !hiddenPermissions.includes(p[1].code))
            .map(([id, permission]) => ({
                id,
                text: permission.text,
                checked: false,
                disabled: false,
                order: permission.order,
            }))
            .sort((a, b) => {
                return a.order - b.order;
            });
    }

    @autobind
    @action
    setNewInstructorEmail(value) {
        this.newInstructorEmailError = '';
        this.newInstructorEmail = value;
    }

    @autobind
    @action
    setNewInstructorVisible(value) {
        this.newInstructorVisible = value;
    }

    @autobind
    @action
    setNewInstructorPermission(id, value) {
        const manageCoursePermissionId = 2;
        const editCaptionPermissionId = 14;
        this.newInstructorPermissions.find((p) => p.id == id).checked = value;
        if (id == manageCoursePermissionId) {
            const editCaptionPermission = this.newInstructorPermissions.find(
                (p) => p.id == editCaptionPermissionId,
            );
            editCaptionPermission.checked = value;
            editCaptionPermission.disabled = value;
        }
    }

    @computed
    get isEmailValid() {
        return this.newInstructorEmail.match(/.+@.+\...+/);
    }

    @autobind
    @action
    save(onSuccess, onError) {
        this.isSaving = true;

        const data = this._getNewInstructorData();

        return udApi
            .post(`/users/me/taught-courses/${this.courseId}/co-instructor-invitations/`, data)
            .then(
                action(() => {
                    const bannerProps = {
                        udStyle: 'success',
                        title: gettext('Invitation sent'),
                        body: gettext("You'll be notified if they accept."),
                        showCta: false,
                    };
                    toasterStore.addAlertBannerToast(bannerProps, {autoDismiss: true});
                    this.isSaving = false;
                    if (onSuccess) {
                        onSuccess();
                    }
                }),
            )
            .catch(
                action((error) => {
                    if (
                        error.response &&
                        error.response.data &&
                        error.response.data.recipient_email
                    ) {
                        this.newInstructorEmailError = error.response.data.recipient_email;
                    } else {
                        let errorMessage =
                            error.message || gettext('An unknown error has occurred.');
                        if (
                            error.response &&
                            error.response.headers &&
                            error.response.headers['x-ui-message']
                        ) {
                            errorMessage = error.response.headers['x-ui-message'];
                        }
                        const bannerProps = {
                            udStyle: 'error',
                            title: gettext('Error'),
                            body: errorMessage,
                            showCta: false,
                        };
                        toasterStore.addAlertBannerToast(bannerProps, {autoDismiss: true});
                    }
                    this.isSaving = false;
                    if (onError) {
                        onError();
                    }
                }),
            );
    }

    _getNewInstructorData() {
        return {
            recipient_email: this.newInstructorEmail,
            permissions: this.newInstructorPermissions
                .filter((p) => p.checked)
                .map((p) => this.permissions[p.id].code),
            visible: this.newInstructorVisible,
        };
    }
}
