import {action, observable, computed, runInAction} from 'mobx';

import AutosuggestStore from 'base-components/form/autosuggest/autosuggest.mobx-store';
import udApi from 'utils/ud-api';

export default class SlackAutoCompleteStore extends AutosuggestStore {
    @observable autoCompleteErrorMessage = '';
    isFetchUsersError = false;
    isFetchChannelsError = false;

    // This is intentionally separate from `cachedSuggestions` on the base AutosuggestStore.
    // `cachedSuggestions` caches `this.suggestions`, whereas `cachedAPISuggestions` caches
    // the suggestions that we get from the API. These are not the same. The API returns all
    // suggestions that match the first character of the input value. `this.suggestions` filters
    // the API suggestions for the ones that match the entire input value.
    cachedAPISuggestions = {};

    searchInProgress = new Set();
    suggestTimeout = null;

    constructor(globalOverrides = {gettext}) {
        super();
        this.globalOverrides = globalOverrides;
    }

    @computed
    get cleanInputValue() {
        return this.inputValue.replace('#', '').replace('@', '').toLowerCase();
    }

    @computed
    get query() {
        return this.cleanInputValue.substring(0, 1);
    }

    @action
    reset() {
        this.clearInputValue();
        this._resetErrors();
    }

    _resetErrors() {
        if (!this.inputValue) {
            this.isFetchChannelsError = false;
            this.isFetchUsersError = false;
            this.autoCompleteErrorMessage = '';
        }
    }

    _filterMatchingSuggestions(suggestions) {
        return suggestions.filter((v) => {
            const suggestionItem = v.value.toLowerCase();
            if (this.inputValue.startsWith('#')) {
                return suggestionItem.includes(this.cleanInputValue) && v.is_channel;
            } else if (this.inputValue.startsWith('@')) {
                return suggestionItem.includes(this.cleanInputValue) && v.is_user;
            }
            return suggestionItem.includes(this.cleanInputValue);
        });
    }

    async _fetchChannels(q) {
        const params = {query: q};
        try {
            return await udApi.get('/share/slack/channels/', {params});
        } catch (error) {
            this.isFetchChannelsError = true;
            return error;
        }
    }

    async _fetchUsers(q) {
        const params = {query: q};
        try {
            return await udApi.get('/share/slack/users/', {params});
        } catch (error) {
            this.isFetchUsersError = true;
            return error;
        }
    }

    async deleteUserIntegrationToken() {
        try {
            return await udApi.delete('/share/slack/user-integration/');
        } catch (error) {
            return error;
        }
    }

    @action
    async loadSuggestions({q}) {
        this._resetErrors();
        if (this.searchInProgress.has(q)) {
            return;
        }
        if (q in this.cachedAPISuggestions) {
            this.setSuggestions(this._filterMatchingSuggestions(this.cachedAPISuggestions[q]));
            return;
        }
        if (this.isFetchUsersError || this.isFetchChannelsError) {
            this.setSuggestions(this.suggestions);
            return;
        }

        this.searchInProgress.add(q);
        const responses = await Promise.all([this._fetchUsers(q), this._fetchChannels(q)]);
        runInAction(() => {
            const {gettext} = this.globalOverrides;
            if (this.isFetchUsersError && this.isFetchChannelsError) {
                this.autoCompleteErrorMessage = gettext(
                    "We couldn't retrieve the users or channel list from Slack." +
                        ' Try re-typing your search',
                );
            } else if (this.isFetchUsersError) {
                this.autoCompleteErrorMessage = gettext(
                    "We couldn't retrieve the user list from Slack." +
                        ' Try re-typing your search if you want to share directly to a user',
                );
            } else if (this.isFetchChannelsError) {
                this.autoCompleteErrorMessage = gettext(
                    "We couldn't retrieve the channel list from Slack." +
                        ' Try re-typing your search if you want to share to a channel',
                );
            }

            let suggestions = [];
            responses.forEach((resp) => {
                if (resp.data) {
                    suggestions = suggestions.concat(resp.data.conversations || resp.data.users);
                }
            });
            suggestions.sort((_) => _.value);
            this.setSuggestions(this._filterMatchingSuggestions(suggestions));
            if (!this.isFetchUsersError && !this.isFetchChannelsError) {
                this.cachedAPISuggestions[q] = suggestions;
            }
            this.searchInProgress.delete(q);
        });
    }
}
