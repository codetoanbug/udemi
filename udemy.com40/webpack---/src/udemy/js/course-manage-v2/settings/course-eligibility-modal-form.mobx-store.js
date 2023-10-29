import {action, observable} from 'mobx';

import {showReloadPageErrorToast, showSuccessToast} from 'instructor/toasts';
import {noop} from 'utils/noop';
import udApi, {defaultErrorMessage} from 'utils/ud-api';

export default class CourseEligibilityModalFormStore {
    @observable detail = '';
    @observable selectedCourseId;
    @observable newIsOrganizationEligible = true;
    @observable disableSubmitButton = false;

    constructor(defaultCourse) {
        this.init(defaultCourse);
    }

    @action
    init(course) {
        if (course) {
            this.selectedCourseId = course.id;
            this.newIsOrganizationEligible = !course.isOrganizationEligible;
        } else {
            this.disableSubmitButton = true;
        }
    }

    @action
    updateDetail(value) {
        this.detail = value;
    }

    @action
    updateSelectedCourseId(courseId, isOrganizationEligible) {
        this.selectedCourseId = courseId;
        this.newIsOrganizationEligible = !isOrganizationEligible;
    }

    @action
    updateOrganizationEligible(value) {
        this.newIsOrganizationEligible = value;
    }

    @action
    postOrganizationCourseEligible(onCloseModalCallback = noop) {
        this.disableSubmitButton = true;
        const data = {
            course_id: this.selectedCourseId,
            reason: this.detail,
            is_eligible: this.newIsOrganizationEligible,
        };
        return udApi
            .post('users/me/organization-course-eligibility/', data)
            .then(
                action(() => {
                    this.disableSubmitButton = false;
                    onCloseModalCallback();
                    showSuccessToast(gettext('Course program eligibility updated'));
                }),
            )
            .catch(
                action(() => {
                    this.disableSubmitButton = false;
                    showReloadPageErrorToast(defaultErrorMessage);
                }),
            );
    }
}
