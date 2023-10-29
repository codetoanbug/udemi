import {action, computed, observable, runInAction} from 'mobx';

import AutosuggestStore from 'base-components/form/autosuggest/autosuggest.mobx-store';
import udApi from 'utils/ud-api';

import {
    CURRICULUM_ITEM_PARAMS,
    LECTURE_TITLE_MAP,
    QUIZ_CONTENT_TYPE,
    QUIZ_TITLE_MAP,
    SEARCH_CURRICULUM_ITEM_MAX_SUGGESTIONS_COUNT,
    SEARCH_CURRICULUM_ITEM_MIN_SEARCH_INPUT_LENGTH,
} from '../constants';

export default class FeaturedQuestionsCurriculumItemsStore extends AutosuggestStore {
    minInputLength = SEARCH_CURRICULUM_ITEM_MIN_SEARCH_INPUT_LENGTH;
    suggestTimeout = null;
    @observable.ref curriculumItems = [];
    @observable currentCurriculumItemsLoaded = false;
    _curriculumItemsPromise = Promise.resolve();

    @computed get query() {
        return this.inputValue.trim().toLowerCase();
    }

    @action async loadSuggestions({q}) {
        if (!this.currentCurriculumItemsLoaded) {
            await this._curriculumItemsPromise;
        }
        this.setSuggestions(this.filterCurriculumItems(q));
    }

    filterCurriculumItems(query) {
        let count = 0;
        return this.curriculumItems.filter((curriculumItem) => {
            if (
                count < SEARCH_CURRICULUM_ITEM_MAX_SUGGESTIONS_COUNT &&
                query.length > 0 &&
                curriculumItem.title.toLowerCase().includes(query)
            ) {
                count++;
                return true;
            }
            return false;
        });
    }

    @action
    selectCurriculumItem(itemType, itemId) {
        const item = this.curriculumItems.find(
            (item) => item._class === itemType && item.id === itemId,
        );
        if (item) {
            this.setInputValue(item.title);
        }
    }

    loadInitialCourseCurriculumItems(courseId) {
        this._curriculumItemsPromise = this._loadInitialCourseCurriculumItems(courseId);
        return this._curriculumItemsPromise;
    }

    @action
    async _loadInitialCourseCurriculumItems(courseId) {
        this.currentCurriculumItemsLoaded = false;

        const response = await udApi.get(
            `/courses/${courseId}/instructor-curriculum-items/`,
            CURRICULUM_ITEM_PARAMS,
        );
        runInAction(() => {
            this.curriculumItems = [];
            response.data.results.forEach((result) => {
                const titlePrefix =
                    result._class === QUIZ_CONTENT_TYPE
                        ? // eslint-disable-next-line gettext/no-variable-string
                          gettext(QUIZ_TITLE_MAP[result.type])
                        : // eslint-disable-next-line gettext/no-variable-string
                          gettext(LECTURE_TITLE_MAP[result._class]);
                if (titlePrefix) {
                    // e.g. Lecture 1, Lecture 2
                    const objectIndexTitle = [titlePrefix, result.object_index].join(' ');
                    // e.g. Lecture 1 - Introduction
                    const title = [objectIndexTitle, result.title].join(' - ');
                    const curriculumItem = {
                        title,
                        id: result.id,
                        _class: result._class,
                    };
                    this.curriculumItems.push(curriculumItem);
                }
            });
            this.currentCurriculumItemsLoaded = true;
        });
    }
}
