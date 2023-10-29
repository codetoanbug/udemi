import {action, observable} from 'mobx';

import {showReloadPageErrorToast, showSuccessToast} from 'instructor/toasts';
import udApi, {defaultErrorMessage} from 'utils/ud-api';

export default class CertificateStore {
    @observable isSaving = false;
    @observable isDirty = false;

    course = null;

    constructor(course) {
        this.course = course;
    }

    @action
    updateCertificateEnabled(value) {
        this.course.certificateEnabled = value;
        this.isDirty = true;
    }

    @action
    saveCertificateEnabledStatus() {
        this.isSaving = true;
        return udApi
            .patch(`courses/${this.course.id}/`, {has_certificate: this.course.certificateEnabled})
            .then(
                action(() => {
                    this.isSaving = false;
                    this.isDirty = false;
                    showSuccessToast(gettext('Your changes have been successfully saved.'));
                }),
            )
            .catch(
                action(() => {
                    this.isSaving = false;
                    showReloadPageErrorToast(defaultErrorMessage);
                }),
            );
    }
}
