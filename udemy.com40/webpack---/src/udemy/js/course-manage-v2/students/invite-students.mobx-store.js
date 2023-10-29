import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import {showSuccessToast} from 'instructor/toasts';
import udApi from 'utils/ud-api';

export default class InviteStudentsStore {
    @observable emails = '';
    @observable isLoading = false;
    @observable error = '';

    constructor(courseId) {
        this.setCourseId(courseId);
    }

    @autobind
    @action
    reset() {
        this.emails = '';
        this.error = '';
    }

    @action
    setCourseId(courseId) {
        this.courseId = courseId;
    }

    @action
    setEmails(inputValue) {
        this.emails = inputValue;
    }

    @action
    sendInvites(onCloseModal) {
        this.isLoading = true;
        this.error = '';
        return udApi
            .post(`/courses/${this.courseId}/invitations/`, {
                emails: this.emails,
            })
            .then(
                action(() => {
                    showSuccessToast(gettext('Invitations were successfully sent.'));
                    this.isLoading = false;
                    onCloseModal();
                }),
            )
            .catch(
                action((error) => {
                    if (error.response) {
                        this.error = error.response.data.detail;
                    } else {
                        this.error = error.message;
                    }
                    this.isLoading = false;
                }),
            );
    }
}
