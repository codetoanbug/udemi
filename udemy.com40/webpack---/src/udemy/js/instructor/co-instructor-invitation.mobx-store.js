import autobind from 'autobind-decorator';
import {action, observable, runInAction} from 'mobx';

import {showErrorToast, showSuccessToast} from 'instructor/toasts';
import udApi from 'utils/ud-api';

import {CO_INSTRUCTOR_INVITATIONS_URL} from './constants';

export default class CoInstructorInvitationStore {
    @observable invitations = [];
    @observable invitationsLoaded = false;
    @observable hasAcceptedInvitation = false;
    @observable showInvitationNoLongerAvailableModal = false;

    INVITATION_LIST_PAGE_SIZE = 30;

    @action setInvitations(invitations) {
        this.invitations = invitations;
    }

    @action setInvitationsLoaded(invitationsLoaded) {
        this.invitationsLoaded = invitationsLoaded;
    }

    @action setAcceptedInvitation(hasAcceptedInvitation) {
        this.hasAcceptedInvitation = hasAcceptedInvitation;
    }

    @action setShowInvitationNoLongerAvailableModal(showInvitationNoLongerAvailableModal) {
        this.showInvitationNoLongerAvailableModal = showInvitationNoLongerAvailableModal;
    }

    @autobind
    @action
    async getCoInstructorCourseInvitations() {
        const params = {
            page_size: this.INVITATION_LIST_PAGE_SIZE,
            'fields[co_instructor_invitation]': '@all',
        };
        this.invitationsLoaded = false;
        try {
            const response = await udApi.get(CO_INSTRUCTOR_INVITATIONS_URL, {params});
            runInAction(() => {
                this.invitations = response.data.results;
                this.invitations.forEach((invitation) => {
                    if (invitation.visible) {
                        invitation.permissions.unshift('instructor:visible');
                    }
                });
            });
        } catch (error) {
            showErrorToast(gettext('Failed to get co-instructor invitations.'), {
                showCta: false,
            });
            this.setInvitations([]);
        } finally {
            this.setInvitationsLoaded(true);
        }
    }

    @autobind
    @action
    removeInvitationWithId(invitationId) {
        this.invitations = this.invitations.filter((invitation) => {
            return invitation.id !== invitationId;
        });
    }

    @autobind
    @action
    async declineCoInstructorInvitation(invitationId) {
        const invitationsBeforeRemoval = this.invitations;
        this.removeInvitationWithId(invitationId);
        try {
            const response = await udApi.post(
                `${CO_INSTRUCTOR_INVITATIONS_URL + invitationId}/decline/`,
            );
            runInAction(() => {
                if (response.status === 204) {
                    showSuccessToast(gettext('Co-instructor invitation is declined.'), {
                        showCta: false,
                    });
                }
            });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                runInAction(() => {
                    this.showInvitationNoLongerAvailableModal = true;
                });
            } else {
                showErrorToast(gettext('Failed to decline invitation.'), {
                    showCta: false,
                });
                this.setInvitations(invitationsBeforeRemoval);
            }
        }
    }

    @autobind
    @action
    async acceptCoInstructorInvitation(invitationId) {
        const invitationsBeforeAcceptance = this.invitations;
        this.removeInvitationWithId(invitationId);
        try {
            const response = await udApi.post(
                `${CO_INSTRUCTOR_INVITATIONS_URL + invitationId}/accept/`,
            );
            runInAction(() => {
                if (response.status === 204) {
                    showSuccessToast(
                        gettext(
                            "You've been added as a co-instructor. See the new course in your courses.",
                        ),
                        {
                            showCta: false,
                        },
                    );
                    this.hasAcceptedInvitation = true;
                }
            });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                runInAction(() => {
                    this.showInvitationNoLongerAvailableModal = true;
                });
            } else if (
                error.response &&
                error.response.headers &&
                error.response.headers['x-ui-message']
            ) {
                showErrorToast(
                    gettext('Failed to accept invitation.') +
                        error.response.headers['x-ui-message'],
                    {
                        showCta: false,
                    },
                );
                this.setInvitations(invitationsBeforeAcceptance);
            } else {
                showErrorToast(gettext('Failed to accept invitation.'), {
                    showCta: false,
                });
                this.setInvitations(invitationsBeforeAcceptance);
            }
        }
    }
}
