import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import {showReloadPageErrorToast} from 'instructor/toasts';
import udApi, {defaultErrorMessage} from 'utils/ud-api';

export default class InvitationRequestStore {
    @observable invitations = [];
    @observable updateInProgress = false;

    constructor(courseId) {
        this.setCourseId(courseId);
    }

    @autobind
    @action
    loadInvitationRequests() {
        return udApi
            .get(`/courses/${this.courseId}/invitation-requests/`)
            .then(this._onLoadInvitationRequestsSuccess)
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }

    @autobind
    @action
    _onLoadInvitationRequestsSuccess(response) {
        this.totalInvitationRequestCount = response.data.count;
        this.invitations = response.data.results || [];
    }

    @autobind
    @action
    _onUpdateInvitationRequestSuccess(invitation) {
        return action(() => {
            this.invitations.remove(invitation);
            this.updateInProgress = false;
        });
    }

    @autobind
    @action
    updateInvitationRequest(invitation, newStatus) {
        this.updateInProgress = invitation;
        const data = {status: newStatus};
        return udApi
            .patch(`/courses/${this.courseId}/invitation-requests/${invitation.id}/`, data)
            .then(this._onUpdateInvitationRequestSuccess(invitation))
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }

    @action
    setCourseId(courseId) {
        this.courseId = courseId;
    }
}
