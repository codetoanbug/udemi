import AutosuggestStore from 'base-components/form/autosuggest/autosuggest.mobx-store';
import getConfigData from 'utils/get-config-data';
import udApi from 'utils/ud-api';

import {MAX_NUM_COURSES_DISPLAYED, SHOW_ALL_RESULTS_SUGGESTION} from './constants';

export default class CourseAutosuggestStore extends AutosuggestStore {
    minInputLength = 2;
    maxInputLength = 200;

    async loadSuggestions({q, signal}) {
        const orgId = getConfigData().brand.organization.id;
        const url = `learning-paths/${orgId}/autocomplete-courses/`;
        const response = await udApi.get(url, {signal, params: {q}});

        const suggestions = response.data.results || [];
        if (response.data.count > MAX_NUM_COURSES_DISPLAYED) {
            suggestions.push(SHOW_ALL_RESULTS_SUGGESTION);
        }

        this.setSuggestions(suggestions);
        this.cachedSuggestions[q] = this.suggestions;
    }
}
