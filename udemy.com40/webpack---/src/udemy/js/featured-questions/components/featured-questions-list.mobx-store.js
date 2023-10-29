import {action, observable, reaction} from 'mobx';

import QaMobxMixin from 'question-answer/qa-mobx-mixin';

import {
    FEATURE_QUESTIONS_LIST_API_SETTINGS,
    FEATURED,
    RELATED_OBJECT_ID,
    RELATED_OBJECT_TYPE,
} from '../constants';

export default class FeaturedQuestionsListStore extends QaMobxMixin {
    @observable currentCurriculumItemId = null;
    @observable currentCurriculumItemType = null;

    constructor({baseUrl, instructorStore = null, twoPaneStore}) {
        super(FEATURE_QUESTIONS_LIST_API_SETTINGS, {baseUrl, instructorStore, twoPaneStore});
        reaction(
            () => this.currentCurriculumItemId && this.currentCurriculumItemType,
            () => this._reloadThreads(),
        );
    }

    @action
    init() {
        super.init();
        super.setFilter(FEATURED, true);
    }

    @action
    setCurrentCurriculumItem(currentCurriculumItemId, currentCurriculumItemType) {
        this.setCurrentCurriculumItemId(currentCurriculumItemId);
        this.setCurrentCurriculumItemType(currentCurriculumItemType);
    }

    @action
    setCurrentCurriculumItemId(currentCurriculumItemId) {
        this.setFilter(RELATED_OBJECT_ID, currentCurriculumItemId);
        this.currentCurriculumItemId = currentCurriculumItemId;
    }

    @action
    setCurrentCurriculumItemType(currentCurriculumItemType) {
        this.setFilter(RELATED_OBJECT_TYPE, currentCurriculumItemType);
        this.currentCurriculumItemType = currentCurriculumItemType;
    }

    @action
    setFilter(filter, value) {
        super.setFilter(filter, value);
        if (filter === RELATED_OBJECT_TYPE || filter === RELATED_OBJECT_ID) {
            this.filters[filter] = value;
        }
    }

    @action
    clearCurriculumItemSelection() {
        this.setCurrentCurriculumItemId(null);
        this.setCurrentCurriculumItemType(null);
    }

    @action
    setLoadedInitialThreads(loadedInitialThreads) {
        this.loadedInitialThreads = loadedInitialThreads;
    }

    @action
    _toggleRead(threadId) {
        const thread = this._findThreadById(threadId);
        if (thread) {
            thread.is_read = !thread.is_read;
        }
    }

    @action
    _toggleFeatured(threadId, removedThread = null, removedIndex = null) {
        if (removedThread && removedIndex) {
            this._threads.splice(removedIndex, 0, removedThread);
            return [null, null];
        }

        const arrIndex = this._threads.findIndex((t) => t.id === threadId);
        if (arrIndex !== -1) {
            const thread = this._threads[arrIndex];
            this._threads.splice(arrIndex, 1);
            return [thread, arrIndex];
        }
        return [null, null];
    }
}
