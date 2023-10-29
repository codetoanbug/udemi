import {action, observable} from 'mobx';

import AutosuggestStore from 'base-components/form/autosuggest/autosuggest.mobx-store';
import udApi, {MAX_TIMEOUT} from 'utils/ud-api';

export default class UserAutosuggestStore extends AutosuggestStore {
    @observable selectedUser;
    @action async loadSuggestions({q}) {
        try {
            const response = await udApi.get('/messageable-users/', {
                params: {q},
                timeout: MAX_TIMEOUT,
            });
            this.setSuggestions(response.data.results || []);
            // cache only if suggestions found
            if (this.suggestions.length > 0) {
                this.cachedSuggestions[q] = this.suggestions;
            }
        } catch (e) {
            this.setSuggestions([]);
        }
    }
}
