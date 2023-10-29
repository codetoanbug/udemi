import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import AutosuggestStore from 'base-components/form/autosuggest/autosuggest.mobx-store';
import udApi from 'utils/ud-api';

import {
    SectionHasTopicsActions,
    SD_GENERIC_TAG_ACTION_URL,
    PROPOSE_TOPIC_NAME_LOCATION,
} from './constants';
import {TopicModel} from './topic.mobx-model';

const SECTION_TOPICS_PARAMS = {
    include_usage: 'section',
};

const AUTOCOMPLETE_NUM_SUGGESTIONS = 6;

export const PROPOSE_TOPIC = {id: -1};

export class SectionTopicsStore extends AutosuggestStore<TopicModel> {
    @observable addNewTopic = false;
    canPropose = false;

    constructor(canPropose: boolean) {
        super();
        this.canPropose = canPropose;
    }

    create(topicName: string) {
        const actions = [
            {
                action: SectionHasTopicsActions.PROPOSE_TOPIC,
                options: {
                    topic_name: topicName,
                    location: PROPOSE_TOPIC_NAME_LOCATION,
                },
            },
        ];

        return udApi.post(SD_GENERIC_TAG_ACTION_URL, {actions});
    }

    @action
    async loadSuggestions(data: {q: string}) {
        const params = {...SECTION_TOPICS_PARAMS, search: data.q};
        const response = await udApi.get('structured-data/generic-tag/topic/', {
            params,
        });
        const suggestions = (response.data.results || [])
            .slice(0, AUTOCOMPLETE_NUM_SUGGESTIONS)
            .map((suggestion: any) => new TopicModel(suggestion));
        if (this.canPropose) {
            suggestions.push(PROPOSE_TOPIC);
        }
        this.setSuggestions(suggestions);
    }

    @autobind
    @action
    handleNewTopicClick() {
        this.addNewTopic = true;
    }

    @autobind
    @action
    reset() {
        this.clearInputValue();
        this.addNewTopic = false;
    }
}
