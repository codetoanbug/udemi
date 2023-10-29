import {action, observable, computed, runInAction} from 'mobx';

import AutosuggestStore from 'base-components/form/autosuggest/autosuggest.mobx-store';
import {ALL_USERS_LABEL, ORGANIZATION_GROUP_CLASS} from 'organization-common/constants';
import {DEFAULT_SHARE_MESSAGE} from 'organization-common/resource-preview/constants';
import udApi from 'utils/ud-api';
import udMe from 'utils/ud-me';

import {filterOutSelectedUsersAndGroups, isPotentialAllUsersQuery} from '../helpers';
import {getGeneralErrorText} from './constants';
import * as constants from './constants';

export default class RecommendResourceModalStore extends AutosuggestStore {
    constructor(organizationId, resourceType, resourceId, context, globalOverrides = {gettext}) {
        super();
        this.organizationId = organizationId;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.context = context;

        this.usersAndGroupsApiUrl = `/organizations/${this.organizationId}/users-groups-suggestions/`;

        this.recommendUrl = `/share/${resourceType}/${this.resourceId}/recommend/`;
        this.globalOverrides = globalOverrides;
        this.setSenderMessage(this.defaultRecommendMessage);
        this.setSuggestions([]);
    }

    @observable senderMessage = '';
    @observable isWaitingForResponse = false;
    @observable selectedUsersAndGroups = [];
    @observable errorMessage;
    @observable totalNumberOfLicensedUsers = 0;
    @observable isAllUsersSelected = false;

    // Hide user emails in the Recommend modal suggestions
    displayEmails = false;

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

    get defaultRecommendMessage() {
        return DEFAULT_SHARE_MESSAGE[this.resourceType];
    }

    @computed
    get selectedGroups() {
        return this.selectedUsersAndGroups.filter((obj) => obj._class === ORGANIZATION_GROUP_CLASS);
    }

    @computed
    get selectedUsers() {
        return this.selectedUsersAndGroups.filter((obj) => obj._class !== ORGANIZATION_GROUP_CLASS);
    }

    // Resets the search state of the store.
    @action
    clearSearch = () => {
        this.clearInputValue();
        this.errorMessage = null;
    };

    // Resets the search and the selected users/group/all users.
    @action
    resetModalValues = () => {
        this.setIsAllUsersSelected(false);
        this.clearSearch();
        this.selectedUsersAndGroups = [];
    };

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
            this.setError(constants.getNumberOfUsersErrorMessage(gettext));
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
                'fields[user]': 'display_name,image_75x75,initials',
            },
        });
        const suggestions = response.data.results || [];
        this.setSuggestions(suggestions);
        this.cachedSuggestions[q] = suggestions;
    }

    @action
    setSuggestions(suggestions) {
        suggestions = filterOutSelectedUsersAndGroups(suggestions, this.selectedUsersAndGroups);
        const me = this.globalOverrides.me ?? udMe;
        if (
            !this.isAllUsersSelected &&
            this.selectedUsersAndGroups.length === 0 &&
            (me.organization.isAdmin || me.organization.isOwner) &&
            isPotentialAllUsersQuery(this.query, {gettext: this.globalOverrides.gettext})
        ) {
            super.setSuggestions([{isAllUsersSuggestion: true}, ...suggestions]);
        } else {
            super.setSuggestions(suggestions);
        }
    }

    // Selects the given user or group to recommend the resource to
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

    // Removes the given user or group from the list
    @action
    removeObj = (obj) => {
        this.selectedUsersAndGroups = this.selectedUsersAndGroups.filter((u) => u.id !== obj.id);
    };

    @computed
    get hasSelectedAnyValue() {
        return (
            this.isAllUsersSelected ||
            (this.selectedUsersAndGroups.length !== 0 && !!this.senderMessage)
        );
    }

    @action
    recommendResource = async () => {
        const {gettext} = this.globalOverrides;
        this.isWaitingForResponse = true;

        try {
            await this.recommendUsersAndGroupsToResource();
            return 'success';
        } catch (error) {
            if (typeof error === 'string') {
                this.setError(error);
                return [];
            }

            if (error.response.status === 404) {
                this.setError(gettext('This resource is not available'));
                return [];
            }

            this.setError(getGeneralErrorText(gettext));
            return [];
        } finally {
            runInAction(() => {
                this.isWaitingForResponse = false;
            });
        }
    };

    // It handles three types of objects to recommend the resource: 'All users', 'group', 'user'
    recommendUsersAndGroupsToResource = () => {
        const data = new FormData();

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
        data.append('context', this.context);

        return udApi.post(this.recommendUrl, data);
    };

    // This computed method indicates whether we're recommending the resource to the
    // users/groups or not (are we in the middle of processing req/res or not?).
    @computed
    get isRecommending() {
        return this.isWaitingForResponse;
    }

    setError = (error) => {
        this.clearSearch();
        if (Array.isArray(error)) {
            this.setErrorMessage(error[0]);
        } else {
            this.setErrorMessage(error);
        }
    };

    @action
    clearOnAllUsersRemoved() {
        this.setIsAllUsersSelected(false);
    }
}
