import {action, computed, observable} from 'mobx';

import {showErrorToast, showSuccessToast} from 'instructor/toasts';
import udApi from 'utils/ud-api';

export const OPTION_PUBLIC = 'OPTION_PUBLIC';
export const OPTION_PRIVATE_INVITE = 'OPTION_PRIVATE_INVITE';
export const OPTION_PRIVATE_PASSWORD = 'OPTION_PRIVATE_PASSWORD';

export default class CoursePrivacyStore {
    @observable isDirty = false;
    @observable optionState = OPTION_PUBLIC;
    @observable org = '';
    @observable saveInProgress = false;

    course = null;

    constructor(course) {
        this.course = course;
        this.updateOptionState();
    }

    // Called when user changes selection on dropdown
    @action
    updatePrivacySetting(privacySetting) {
        this.isDirty = true;
        this.optionState = privacySetting;
        if (privacySetting !== OPTION_PRIVATE_PASSWORD) {
            this.course.coursePassword = '';
        }
    }

    @action
    updatePassword(password) {
        this.isDirty = true;
        this.course.coursePassword = password;
    }

    @action
    updateOptionState() {
        if (!this.course.isPrivate) {
            this.optionState = OPTION_PUBLIC;
        } else if (this.course.coursePassword) {
            this.optionState = OPTION_PRIVATE_PASSWORD;
        } else {
            this.optionState = OPTION_PRIVATE_INVITE;
        }
    }

    @computed
    get private() {
        return this.optionState !== OPTION_PUBLIC;
    }

    @computed
    get dropDownHelpText() {
        if (this.optionState === OPTION_PRIVATE_PASSWORD) {
            return interpolate(
                gettext(
                    "If a course's enrollment page is password protected, the course " +
                        "won't show up in search results on %(orgTitle)s. Instead, share " +
                        'the course URL and password directly with students you want to ' +
                        'enroll. Keep in mind this provides only a low level of security. ' +
                        'Students could share your course URL with an embedded password.',
                ),
                {orgTitle: this.orgTitle},
                true,
            );
        }
        if (this.optionState === OPTION_PRIVATE_INVITE) {
            return interpolate(
                gettext(
                    "If a course's enrollment page is invitation only, the course won't " +
                        'show up in search results on %(orgTitle)s. Accept new student ' +
                        'requests and send invitations from the "Students" page found ' +
                        'under "Course Management" in the left navigation.',
                ),
                {orgTitle: this.orgTitle},
                true,
            );
        }
        if (this.hasOrg) {
            return interpolate(
                gettext(
                    'Public courses are public to all users within %(orgTitle)s. ' +
                        'They show up in search results and are available for ' +
                        'anyone to take inside %(orgTitle)s.',
                ),
                {orgTitle: this.orgTitle},
                true,
            );
        }
        return gettext(
            'Public courses show up in search results and are ' +
                'available for anyone to take on Udemy.',
        );
    }

    @computed
    get showPassword() {
        return this.optionState === OPTION_PRIVATE_PASSWORD;
    }

    @computed
    get validationState() {
        if (this.course.coursePassword) {
            return 'neutral';
        }
        return 'error';
    }

    @computed
    get orgTitle() {
        if (this.course.organizationTitle) {
            return `${this.course.organizationTitle} Portal`;
        }
        return 'Udemy';
    }

    @computed
    get hasOrg() {
        return !!this.course.organizationTitle;
    }

    @computed
    get saveDisabled() {
        return (
            (this.optionState === OPTION_PRIVATE_PASSWORD && !this.course.coursePassword) ||
            this.saveInProgress
        );
    }

    @action
    savePrivacySettings() {
        if (this.isDirty) {
            this.saveInProgress = true;
            const data = {
                is_private: this.private,
            };
            if (this.course.coursePassword) {
                data.password = this.course.coursePassword;
            }
            return udApi
                .patch(`/courses/${this.course.id}/`, data)
                .then(
                    action(() => {
                        showSuccessToast(gettext('Your changes have been successfully saved.'));
                        this.isDirty = false;
                        this.saveInProgress = false;
                    }),
                )
                .catch(
                    action((error) => {
                        let errorMessage;
                        if (error.response) {
                            errorMessage = error.response.data.is_private;
                        } else {
                            errorMessage = error.message;
                        }
                        errorMessage && showErrorToast(errorMessage);
                        this.saveInProgress = false;
                    }),
                );
        }
        showSuccessToast(gettext('There are no changes to save.'));
    }
}
