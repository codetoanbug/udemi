import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import AutosuggestStore from 'base-components/form/autosuggest/autosuggest.mobx-store';
import udApi from 'utils/ud-api';

const COURSE_LABELS_PARAMS = {
    'fields[course_label]': '@default,versions',
};

const PROPOSED_LABELS_FIELD_PARAMS = {
    'fields[proposed_course_label]': '@default',
};

const AUTOCOMPLETE_NUM_SUGGESTIONS = 6;

export const PROPOSE_LABEL = {id: -1};

export default class CourseLabelsStore extends AutosuggestStore {
    @observable addNewLabel = false;

    constructor(canPropose) {
        super();
        this.canPropose = canPropose;
    }

    create(displayName) {
        return udApi.post(
            'course-labels/propose/',
            {
                title: displayName,
            },
            {
                params: PROPOSED_LABELS_FIELD_PARAMS,
            },
        );
    }

    @action
    async loadSuggestions({q, signal}) {
        const params = {...COURSE_LABELS_PARAMS, search: q};
        const response = await udApi.get('course-labels/', {params, signal});
        const suggestions = (response.data.results || []).slice(0, AUTOCOMPLETE_NUM_SUGGESTIONS);
        if (this.canPropose) {
            suggestions.push(PROPOSE_LABEL);
        }
        this.setSuggestions(suggestions);
    }

    @autobind
    @action
    handleNewLabelClick() {
        this.addNewLabel = true;
    }

    @autobind
    @action
    reset() {
        this.clearInputValue();
        this.addNewLabel = false;
    }
}

CourseLabelsStore.LABEL_STATUS = {
    deleted: -1,
    pending: 0,
    approved: 1,
};
