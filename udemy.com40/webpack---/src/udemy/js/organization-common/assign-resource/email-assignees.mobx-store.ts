import autobind from 'autobind-decorator';
import {observable, action, runInAction, computed} from 'mobx';

import AutosuggestStore from 'base-components/form/autosuggest/autosuggest.mobx-store';
import * as constants from 'organization-common/assign-resource/constants';
import {ALL_USERS_LABEL, ORGANIZATION_GROUP_CLASS, USER_CLASS} from 'organization-common/constants';
import {
    filterOutSelectedUsersAndGroups,
    isPotentialAllUsersQuery,
} from 'organization-common/helpers';
import {showErrorToast} from 'organization-common/toasts';
import {Entity} from 'organization-manage-common/user-and-group-pill/user-and-group-pill.react-component';
import getConfigData from 'utils/get-config-data';
import udApi from 'utils/ud-api';
import udMe from 'utils/ud-me';
import Raven from 'utils/ud-raven';

export class EmailAssigneesStore extends AutosuggestStore<Entity> {
    organizationId: number;
    resourceId: number;
    resourceType: string;
    assignees: Entity[];
    usersAndGroupsApiUrl: string;

    @observable selectedUsersAndGroups: Array<Entity> = [];
    @observable isLoadingMessageAndPreview = true;
    @observable shareData: Array<any>;
    @observable errorMessage: string | null;
    @observable senderMessage: string | undefined;
    @observable totalNumberOfLicensedUsers = 0;
    @observable isAllUsersSelected = false;
    @observable disableSubmitButton = false;
    @observable isSendingEmails = false;
    @observable nudgeGroup;

    constructor(
        organizationId: number,
        resourceId: number,
        resourceType: string,
        assignees: Entity[],
        nudgeGroup: string | null,
    ) {
        super();
        this.organizationId = organizationId;
        this.resourceId = resourceId;
        this.resourceType = resourceType;
        this.assignees = assignees;
        this.nudgeGroup = nudgeGroup;
        this.selectedUsersAndGroups = assignees;
        this.errorMessage = null;
        this.shareData = [];
        this.usersAndGroupsApiUrl = `/organizations/${this.organizationId}/users-groups-suggestions/`;
    }

    @autobind
    @action
    resetModalValues() {
        this.clearSearch();
        this.selectedUsersAndGroups = this.assignees;
        this.setIsAllUsersSelected(false);
        this.clearInputValue();
    }

    @autobind
    @action
    setErrorMessage(msg: string | null) {
        this.errorMessage = msg;
    }

    @action
    setIsAllUsersSelected(isAllUsersSelected: boolean) {
        this.isAllUsersSelected = isAllUsersSelected;

        // Add "All users" back into the suggestions list.
        !isAllUsersSelected && this.setSuggestions(this.suggestions);
    }

    @computed
    get selectedGroups() {
        return this.selectedUsersAndGroups.filter((obj) => obj._class === ORGANIZATION_GROUP_CLASS);
    }

    @computed
    get selectedUsers() {
        return this.selectedUsersAndGroups.filter((obj) => obj._class === USER_CLASS);
    }

    // Resets the search state of the store.
    @autobind
    @action
    clearSearch() {
        this.clearInputValue();
        this.errorMessage = null;
    }

    @autobind
    @action
    async getTotalNumberOfLicensedUsers() {
        try {
            const response = await udApi.get(`/organizations/${this.organizationId}/`, {
                params: {
                    'fields[organization]': 'licensed_users_count',
                },
            });
            runInAction(() => {
                this.totalNumberOfLicensedUsers = response.data.licensed_users_count;
            });
        } catch (e) {
            this.setError(
                'An error occurred when getting the number of users for the organization',
            );
        }
    }

    // get users and groups of the current organization
    @action
    async loadSuggestions({q, signal}: {q: string; signal: AbortSignal}) {
        // cleaning the error when using start searching again
        this.errorMessage = null;

        const response = await udApi.get(this.usersAndGroupsApiUrl, {
            signal,
            params: {
                page: constants.PAGE,
                page_size: constants.PAGE_SIZE,
                q,
                resource_type: this.resourceType,
                resource_id: this.resourceId,
                is_resource_assignment: true,
                'fields[user]': 'display_name,image_75x75,email,initials',
                'fields[organization_group]': 'title,num_users',
            },
        });
        const suggestions = response.data.results || [];
        this.setSuggestions(suggestions);
        this.cachedSuggestions[q] = suggestions;
    }

    @action
    setSuggestions(suggestions: Array<Entity>) {
        suggestions = filterOutSelectedUsersAndGroups(suggestions, this.selectedUsersAndGroups);

        if (
            !this.isAllUsersSelected &&
            this.selectedUsersAndGroups.length === 0 &&
            (udMe.organization.isAdmin || udMe.organization.isOwner) &&
            getConfigData().features.organization.assignment_improvement_all_users &&
            isPotentialAllUsersQuery(this.query)
        ) {
            super.setSuggestions([
                ({isAllUsersSuggestion: true} as unknown) as Entity,
                ...suggestions,
            ]);
        } else {
            super.setSuggestions(suggestions);
        }
    }

    // Selects the given user or group to send the nudge email to
    @autobind
    @action
    selectObj(obj: Entity) {
        this.setIsAllUsersSelected(!!obj.isAllUsersSuggestion);
        if (
            !obj.isAllUsersSuggestion &&
            !this.selectedUsersAndGroups.some((o) => o.id === obj.id)
        ) {
            this.selectedUsersAndGroups.push(obj);
        }
    }

    // Removes the given user or group from the selected list.
    @autobind
    @action
    removeObj(obj: Entity) {
        this.selectedUsersAndGroups = this.selectedUsersAndGroups.filter((u) => u.id !== obj.id);
    }

    @computed
    get hasSelectedAnyValue() {
        return (
            this.isAllUsersSelected ||
            (this.selectedUsersAndGroups.length !== 0 && !!this.senderMessage)
        );
    }

    @autobind
    @action
    setError(error: string | null) {
        if (Array.isArray(error)) {
            this.setErrorMessage(error[0]);
        } else {
            this.setErrorMessage(error);
        }
    }

    @action
    clearOnAllUsersRemoved() {
        this.setIsAllUsersSelected(false);
    }

    @autobind
    @action
    setSenderMessage(message: string | undefined) {
        this.senderMessage = message;
    }

    @autobind
    @action
    setShareData(data: Array<any>) {
        this.shareData = data;
        this.isLoadingMessageAndPreview = false;
    }

    async resourcePreview() {
        try {
            const response = await udApi.get(
                `/share/${this.resourceType}/${this.resourceId}/preview/`,
            );
            this.setShareData(response.data.share_data);
        } catch (e) {
            Raven.captureException(e);
            // if there is an error when getting the preview, we still want to show the modal
            runInAction(() => {
                this.isLoadingMessageAndPreview = false;
            });
        }
    }

    @autobind
    @action
    async sendEmails() {
        this.isSendingEmails = true;
        const data: any = new FormData();

        if (this.isAllUsersSelected) {
            data.append(ALL_USERS_LABEL, true);
        }
        this.selectedUsersAndGroups.map((obj) => {
            if (obj._class === ORGANIZATION_GROUP_CLASS) {
                return data.append('groupIds[]', obj.id);
            }
            return data.append('userIds[]', obj.id);
        });

        data.append('message', this.senderMessage);
        data.append('course_id', this.resourceId);
        data.append('nudge_group', this.nudgeGroup);

        try {
            const result = await udApi.post(
                `/organizations/${this.organizationId}/send-assigners-emails/`,
                data,
            );
            return [result.headers['x-ui-message'], 'success'];
        } catch (e) {
            if (this.selectedUsersAndGroups.length > 1) {
                showErrorToast(gettext('Error sending emails. Please try again.'));
                return [];
            }
            showErrorToast(gettext('Error sending email. Please try again.'));
            return [];
        } finally {
            runInAction(() => {
                this.isSendingEmails = false;
            });
        }
    }
}
