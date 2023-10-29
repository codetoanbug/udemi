import {AutosuggestStore} from '@udemy/react-autosuggest-components';
import {getConfigData, toLocalDateStamp} from '@udemy/shared-utils';
import {action, computed, observable, runInAction} from 'mobx';

import {
    ALL_USERS_LABEL,
    ORGANIZATION_GROUP_CLASS,
    USER_CLASS,
    RESOURCE_TYPES,
} from 'organization-common/constants';
import {getNumberOfUsersErrorMessage} from 'organization-common/recommend-resource/constants';
import {DEFAULT_ASSIGN_MESSAGE} from 'organization-common/resource-preview/constants';
import udApi from 'utils/ud-api';
import udMe from 'utils/ud-me';

import {filterOutSelectedUsersAndGroups, isPotentialAllUsersQuery} from '../helpers';
import * as constants from './constants';

/**
 * Main store for AssignResourceModal and its children. UserAndGroupAutocomplete component use this store as well.
 */
export default class AssignResourceStore extends AutosuggestStore {
    constructor(organizationId, resourceId, resourceType, context, globalOverrides = {gettext}) {
        super();
        this.organizationId = organizationId;
        this.context = context;
        this.resourceId = resourceId;
        this.resourceType = resourceType;
        this.usersAndGroupsApiUrl = `/organizations/${this.organizationId}/users-groups-suggestions/`;
        this.globalOverrides = globalOverrides;
        this.setSenderMessage(this.defaultAssignMessage);
        this.setSuggestions([]);
    }

    @observable errorMessage;
    @observable isWaitingForResponse = false;
    @observable senderMessage = '';
    @observable dueDate;
    @observable dueDays;
    @observable isCourseImported = true;
    @observable isAutoAssignEnabled = false;
    @observable selectedUsersAndGroups = [];
    @observable totalNumberOfLicensedUsers = 0;
    @observable isAllUsersSelected = false;
    @observable isAllUsersAutoAssignRuleActive = false;
    @observable isGroupAutoAssignRuleActive = false;
    @observable disableSubmitButton = false;

    @action
    resetModalValues = () => {
        this.clearSearch();
        this.selectedUsersAndGroups = [];
        this.resetDueInputs();
        this.isAutoAssignEnabled = false;
        this.setIsCourseImported(true);
        this.setIsAllUsersSelected(false);
        this.clearInputValue();
    };

    @action
    updateDueDate = (date) => {
        this.dueDate = date ? toLocalDateStamp(date) : undefined;
    };

    @action
    updateDueDays = (numberDays) => {
        this.dueDays = numberDays;
    };

    @action
    resetDueInputs = () => {
        this.dueDate = undefined;
        this.dueDays = undefined;
    };

    getDueDateFromDueDays = (days) => {
        const today = new Date();
        const dueDate = new Date();
        dueDate.setDate(today.getDate() + days);
        return toLocalDateStamp(dueDate);
    };

    @action
    setIsCourseImported = (result) => {
        this.isCourseImported = result;
    };

    checkCanAutoAssignCourse = () => {
        if ([RESOURCE_TYPES.LEARNING_PATH, RESOURCE_TYPES.LAB].includes(this.resourceType)) {
            return;
        }

        return udApi
            .get(`/organizations/${this.organizationId}/imported-courses/${this.resourceId}/`)
            .catch((error) => {
                // HTTP 404: Course is not an imported courses.
                // HTTP 403: Imported courses feature is disabled for the organization (see is_imported_courses_enabled feature flag)
                if ([404, 403].includes(error.response.status)) {
                    this.setIsCourseImported(false);
                }
            });
    };

    @action
    setErrorMessage = (msg) => {
        this.errorMessage = msg;
    };

    @action
    setIsAllUsersSelected = (isAllUsersSelected) => {
        this.isAllUsersSelected = isAllUsersSelected;

        // Add "All users" back into the suggestions list.
        !isAllUsersSelected && this.setSuggestions(this.suggestions);
    };

    get apiUrl() {
        return `/organizations/${this.organizationId}/assignments/`;
    }

    get defaultAssignMessage() {
        return DEFAULT_ASSIGN_MESSAGE[this.resourceType];
    }

    @computed
    get hasDefaultAssignMessageChanged() {
        return this.senderMessage !== this.defaultAssignMessage;
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
    @action
    clearSearch = () => {
        this.clearInputValue();
        this.errorMessage = null;
    };

    @computed
    get shouldDisableAutoAssignToggle() {
        return (
            (this.isCourseImported && this.resourceType === RESOURCE_TYPES.COURSE) ||
            (this.isAllUsersSelected && this.isGroupAutoAssignRuleActive)
        );
    }

    @action
    setSenderMessage = (message) => {
        this.senderMessage = message;
    };

    @action
    getTotalNumberOfLicensedUsers = async () => {
        const {gettext} = this.globalOverrides;
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
            this.setError(getNumberOfUsersErrorMessage(gettext));
        }
    };

    // check if there is an active auto-assign rule for All users or group
    @action
    getHasActiveAutoAssignRule = async () => {
        const {gettext} = this.globalOverrides;
        this.disableSubmitButton = false;

        try {
            const response = await udApi.get(
                `/organizations/${this.organizationId}/auto-assign-rules/`,
                {
                    params: {
                        resource_type: this.resourceType,
                        resource_id: this.resourceId,
                        has_active_rule: true,
                    },
                },
            );
            runInAction(() => {
                // we only return active rule. If is_all_users is true, there is an active rule for All users.
                // Otherwise, there is an active rule for a group.
                response?.data?.results.forEach((result) => {
                    if (result.is_all_users) {
                        this.isAllUsersAutoAssignRuleActive = true;
                    }
                    this.isGroupAutoAssignRuleActive = true;
                });
            });
        } catch (e) {
            runInAction(() => {
                this.disableSubmitButton = true;
            });
            this.setError(
                gettext(
                    'Something went wrong when getting the active auto-assign rules. Try again in a little while.',
                ),
            );
        }
    };

    // get users and groups of the current organization
    @action
    async loadSuggestions({q, signal}) {
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
                'fields[user]': 'display_name,image_75x75,email,is_assigned_to_resource,initials',
                'fields[organization_group]': 'title,num_users,is_assigned_to_resource',
            },
        });
        const suggestions = response.data.results || [];
        this.setSuggestions(suggestions);
        this.cachedSuggestions[q] = suggestions;
    }

    @action
    async setSuggestions(suggestions) {
        suggestions = filterOutSelectedUsersAndGroups(suggestions, this.selectedUsersAndGroups);
        const configData = this.globalOverrides.Config ?? getConfigData();
        const me = this.globalOverrides.me ?? udMe;
        if (
            !this.isAllUsersSelected &&
            this.selectedUsersAndGroups.length === 0 &&
            (me.organization.isAdmin || me.organization.isOwner) &&
            configData.features.organization.assignment_improvement_all_users &&
            isPotentialAllUsersQuery(this.query, {gettext: this.globalOverrides.gettext})
        ) {
            super.setSuggestions([{isAllUsersSuggestion: true}, ...suggestions]);
        } else {
            super.setSuggestions(suggestions);
        }
    }

    commonDataToAppend(data) {
        data.append('message', this.senderMessage);
        data.append('resource_id', this.resourceId);
        data.append('context', this.context);
        data.append('has_default_message_changed', this.hasDefaultAssignMessageChanged);

        if (this.dueDate) {
            data.append('due_date', this.dueDate);
        }

        return data;
    }

    appendDueDaysOrDate(data) {
        if (this.dueDays >= 0) {
            if (this.isAutoAssignEnabled) {
                data.append('due_days', this.dueDays);
            } else {
                data.append('due_date', this.getDueDateFromDueDays(this.dueDays));
            }
        }
        return data;
    }

    async assignUsersAndGroupsToResource() {
        const data = new FormData();

        if (this.isAllUsersSelected) {
            data.append(ALL_USERS_LABEL, true);
            data.append(constants.IS_AUTOASSIGN_ENABLED, this.isAutoAssignEnabled);
            this.appendDueDaysOrDate(data);
        }

        for (const selected of this.selectedUsersAndGroups) {
            if (selected._class === ORGANIZATION_GROUP_CLASS) {
                data.append('groupIds[]', selected.id);
                data.append(constants.IS_AUTOASSIGN_ENABLED, this.isAutoAssignEnabled);
                this.appendDueDaysOrDate(data);
            } else {
                data.append('userIds[]', selected.id);

                if (this.dueDays >= 0) {
                    data.append('due_date', this.getDueDateFromDueDays(this.dueDays));
                }
            }
        }

        this.commonDataToAppend(data);
        return udApi.post(this.apiUrl, data, {params: {resource_type: this.resourceType}});
    }

    // Assigns the current resource to the selected users or groups.
    // returns a promise which resolves to the success message sent by the remote.
    @action
    assignResource = async () => {
        const {gettext} = this.globalOverrides;

        this.isWaitingForResponse = true;
        try {
            const result = await this.assignUsersAndGroupsToResource();
            return [result.headers['x-ui-message'], 'success'];
        } catch (error) {
            if (typeof error === 'string') {
                this.setError(error);
                return [];
            }

            if (error.response.status === 404) {
                this.setError(gettext('This resource is not available'));
                return [];
            }

            if (error.response.data.code === constants.VALIDATION_ERROR_CODE) {
                this.setError(error.response.data.detail);
            } else {
                this.setError(constants.GENERAL_ERROR_TEXT);
            }
            return [];
        } finally {
            runInAction(() => {
                this.isWaitingForResponse = false;
            });
        }
    };

    // Selects the given user or group to assign the resource to/
    @action
    selectObj = (obj) => {
        this.setIsAllUsersSelected(!!obj.isAllUsersSuggestion);
        if (
            !obj.isAllUsersSuggestion &&
            !this.selectedUsersAndGroups.some((o) => o.id === obj.id)
        ) {
            this.selectedUsersAndGroups.push(obj);
        }
    };

    // Removes the given user or group from the selected list.
    @action
    removeObj = (obj) => {
        this.selectedUsersAndGroups = this.selectedUsersAndGroups.filter((u) => u.id !== obj.id);
        this.isAutoAssignEnabled = false;
    };

    // get the status of the submit button
    @computed
    get hasSelectedAnyValue() {
        return (
            this.isAllUsersSelected ||
            (this.selectedUsersAndGroups.length !== 0 && !!this.senderMessage)
        );
    }

    // This computed method indicates whether we're assigning the resource to the
    // users/groups or not (Are we in the middle of processing req/res or not).
    @computed
    get isAssigning() {
        return this.isWaitingForResponse;
    }

    @action
    setError = (error) => {
        if (Array.isArray(error)) {
            this.setErrorMessage(error[0]);
        } else {
            this.setErrorMessage(error);
        }
    };

    @action
    clearOnAllUsersRemoved = () => {
        this.setIsAllUsersSelected(false);
        this.isAutoAssignEnabled = false;
    };

    @action
    toggleAutoAssign = () => {
        this.isAutoAssignEnabled = !this.isAutoAssignEnabled;
    };
}
