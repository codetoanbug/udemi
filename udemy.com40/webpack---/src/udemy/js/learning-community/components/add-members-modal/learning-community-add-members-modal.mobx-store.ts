import {I18nApi} from '@udemy/i18n';
import {AUTOSUGGEST_LOADING_STATE} from '@udemy/react-autosuggest-components';
import {action, computed, observable, runInAction} from 'mobx';

import AutosuggestStore from 'base-components/form/autosuggest/autosuggest.mobx-store';
import {
    LearningCommunityService,
    MonolithService,
    UserOrOrgGroup,
} from 'learning-community/services';
import {
    SupportedLanguage,
    MessageTokens,
    LearningCommunityLocalizedMessage,
} from 'learning-community/types';
import {distinct} from 'learning-community/utils';
import {ORGANIZATION_GROUP_CLASS, USER_CLASS} from 'organization-common/constants';
import {filterOutSelectedUsersAndGroups} from 'organization-common/helpers';
import {OrganizationGroup} from 'organization-common/types';

type I18nApiSubset = Pick<I18nApi, 'interpolate' | 'gettext'>;
export class AddMembersModalStore extends AutosuggestStore<UserOrOrgGroup> {
    private readonly learningCommunityId: string;
    private readonly learningCommunityService: LearningCommunityService;
    private readonly alreadySelectedUserIds: number[];
    private readonly monolithService: MonolithService;
    private readonly translations: LearningCommunityLocalizedMessage;

    private readonly messageTokens: MessageTokens;
    private i18n: I18nApiSubset;

    constructor(
        learningCommunityId: string,
        learningCommunityService: LearningCommunityService,
        monolithService: MonolithService,
        alreadySelectedUserIds: number[] = [],
        i18n: I18nApiSubset,
        messageTokens: MessageTokens,
        translations: LearningCommunityLocalizedMessage,
        languageLocale: SupportedLanguage,
    ) {
        super();
        this.learningCommunityId = learningCommunityId;
        this.learningCommunityService = learningCommunityService;
        this.monolithService = monolithService;
        this.alreadySelectedUserIds = alreadySelectedUserIds;
        this.i18n = i18n;
        this.messageTokens = messageTokens;
        this.translations = translations;
        this.setSenderMessageLanguage(languageLocale);
    }

    @observable senderMessageLanguage?: SupportedLanguage;
    @observable senderMessage?: string;
    @observable selectedUsersAndGroups: UserOrOrgGroup[] = [];
    @observable isAllUsersAutoAssignRuleActive = false;

    @observable errorMessage?: string;
    @observable totalNumberOfLicensedUsers = 0;
    @observable isAddingMembers = false;

    // Hide user emails in the Recommend modal suggestions
    readonly displayEmails = false;

    private async fetchGroupUsers(groupIds: OrganizationGroup['id'][]): Promise<UserOrOrgGroup[]> {
        const result = [];
        for await (const item of this.monolithService.fetchGroupUsers(groupIds)) {
            result.push(item);
        }
        return result;
    }

    @action
    setErrorMessage(msg: string) {
        this.errorMessage = msg;
    }

    @computed
    get selectedGroups() {
        return this.selectedUsersAndGroups.filter((obj) => obj._class === ORGANIZATION_GROUP_CLASS);
    }

    @computed
    get selectedUsers() {
        return this.selectedUsersAndGroups.filter((obj) => obj._class === USER_CLASS);
    }

    // Resets the search and the selected users/group users.
    @action
    resetModalValues() {
        this.clearSearch();
        this.selectedUsersAndGroups = [];
        this.senderMessage = undefined;
        this.senderMessageLanguage = undefined;
    }

    @action
    setSenderMessage(message: string) {
        this.senderMessage = message;
    }

    @action
    setSenderMessageLanguage(language: SupportedLanguage) {
        const hasDefaultChanged = this.hasDefaultMessageChanged();
        this.senderMessageLanguage = language;
        // we want to update invitation message only if user has not changed it
        if (!hasDefaultChanged) {
            this.setSenderMessage(<string>this.defaultInvitationMessage());
        }
    }

    // get users and groups of the current organization
    @action
    async loadSuggestions({q, signal}: {q: string; signal: AbortSignal}) {
        this.errorMessage = undefined;
        const suggestions = await this.monolithService.fetchUserGroupSuggesstions(q, signal);
        this.setSuggestions(suggestions);
        this.cachedSuggestions[q] = suggestions;
    }

    @action
    setSuggestions(suggestions: UserOrOrgGroup[]) {
        super.setSuggestions(
            filterOutSelectedUsersAndGroups(suggestions, [
                ...this.selectedUsersAndGroups,
                ...this.alreadySelectedUserIds.map((id) => ({_class: USER_CLASS, id})),
            ]),
        );
    }

    // Selects the given user or group to recommend the resource to
    @action
    selectObj(obj: UserOrOrgGroup) {
        this.selectedUsersAndGroups.push(obj);
    }

    // Resets the search state of the store.
    @action
    clearSearch() {
        this.clearInputValue();
        this.errorMessage = undefined;
    }

    // Removes the given user or group from the list
    @action
    removeObj(obj: UserOrOrgGroup) {
        this.selectedUsersAndGroups = this.selectedUsersAndGroups.filter(
            (u) => u._class !== obj._class || u.id !== obj.id,
        );
    }

    @computed
    get hasSelectedAnyValue() {
        return this.selectedUsersAndGroups.length !== 0;
    }

    @computed
    get isLoading() {
        return this.loadingState === AUTOSUGGEST_LOADING_STATE.LOADING;
    }

    @computed
    get isValid() {
        return (
            this.selectedUsersAndGroups.length > 0 &&
            !!this.senderMessage &&
            !!this.senderMessageLanguage &&
            !this.isAddingMembers
        );
    }

    async getAllSelectedUserIds() {
        const selectedGroupIds = this.selectedGroups.map((g) => g.id);
        const groupUsers = await this.fetchGroupUsers(selectedGroupIds);
        return groupUsers
            .concat(this.selectedUsers)
            .map((u) => u.id)
            .filter((selectedUserId) => !this.alreadySelectedUserIds.includes(selectedUserId))
            .filter(distinct);
    }

    @action
    addMembers = async () => {
        if (!this.isValid) return;
        this.isAddingMembers = true;
        try {
            const allUserIds = await this.getAllSelectedUserIds();
            await this.learningCommunityService.addMembers(this.learningCommunityId, allUserIds, {
                message: this.senderMessage as string,
                language: this.senderMessageLanguage as SupportedLanguage,
            });
        } catch (e: unknown) {
            this.setError(e as Error);
        } finally {
            runInAction(() => {
                this.isAddingMembers = false;
            });
        }
    };

    private setError(error: Error) {
        this.clearSearch();
        const err = Array.isArray(error) ? error[0] : error;
        if (err instanceof Error) {
            this.setErrorMessage(err.message);
        } else {
            this.setErrorMessage(err.toString());
        }
    }

    private hasDefaultMessageChanged() {
        // check if the value in senderMessage is one of the default messages
        return Boolean(this.defaultInvitationMessage() !== this.senderMessage);
    }

    private defaultInvitationMessage() {
        return this.senderMessageLanguage?.locale
            ? this.i18n.interpolate(
                  this.translations[this.senderMessageLanguage.locale].message,
                  this.messageTokens,
                  true,
              )
            : undefined;
    }
}
