import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {LearningPathEdited} from 'learning-path/tracking-events-v2';
import udApi from 'utils/ud-api';

import EditableApiModel from './editable-api-model.mobx-model';
import {
    ASSESSMENT_CONTENT_TYPE,
    CONTENT_TYPE_CONFIG,
    RESOURCE_CONTENT_TYPE,
} from './learning-path-page/constants';
import LearningPathSectionItem from './learning-path-section-item.mobx-model';

export default class LearningPathSection extends EditableApiModel {
    // Reference to learning path model
    @observable.ref learningPath = null;
    @observable title = '';
    @observable description = '';
    @observable items = [];
    @observable isExpanded = true;
    @observable isVisible = true;

    get apiDataMap() {
        return {
            id: 'id',
            title: 'title',
            description: 'description',
            order: 'order',
            items: {
                source: 'items',
                map: (items) => {
                    return items.map((item) => {
                        return new LearningPathSectionItem(item, this);
                    });
                },
            },
        };
    }

    get editableFieldsMap() {
        return new Map([
            ['title', 'title'],
            ['description', 'description'],
        ]);
    }

    get isAssessmentSection() {
        return this.items.some((item) => item.type === ASSESSMENT_CONTENT_TYPE);
    }

    get resourceUrl() {
        return `${this.learningPath.sectionsUrl}${this.id}/`;
    }

    get itemsUrl() {
        return `${this.resourceUrl}items/`;
    }

    constructor(data, learningPath) {
        super(data);
        this.learningPath = learningPath;
    }

    async createItem(url, type, itemIndex = null, extraParameters = {}) {
        if (this.isCreatingItem) {
            return;
        }
        const data = {url, type, ...extraParameters};

        if (type === RESOURCE_CONTENT_TYPE) {
            data.title = CONTENT_TYPE_CONFIG[RESOURCE_CONTENT_TYPE].untitled;
        }

        /*
        when a course has been removed from the collection, an user can add content via the button in the alert.
        We display the new item under the alert, so we need to know the itemIndex and insert it in the correct position.
        It is only passed from the RemovedCourseAlert otherwise, itemIndex is null
        */
        if (itemIndex !== null) {
            data.position = itemIndex + 1;
        }

        const response = await udApi.post(this.itemsUrl, data, {
            params: {'fields[learning_path_section_has_item]': '@default,is_removed'},
        });
        this.addItemFromData(response.data, itemIndex);
        this._fireLearningPathEditedEvent();
        this.learningPath.resetLocalEditTimestamp();
    }

    async insertCourses(courseIds) {
        const response = await udApi.post(`${this.itemsUrl}insert-courses/`, {
            course_ids: courseIds,
        });
        this.addItemsFromData(response.data.results);
        this._fireLearningPathEditedEvent();
        this.learningPath.resetLocalEditTimestamp();
    }

    @autobind
    @action
    deleteItemAt(index) {
        this.items.splice(index, 1);
    }

    @autobind
    setTitle(title) {
        this._changeEditableField('title', title);
    }

    @autobind
    setDescription(description) {
        this._changeEditableField('description', description);
    }

    @action
    addItemFromData(data, itemIndex) {
        const item = new LearningPathSectionItem(data, this);

        if (itemIndex === null) {
            this.items.push(item);
        } else {
            this.items.splice(itemIndex + 1, 0, item);
        }
    }

    @action
    addItemsFromData(data) {
        // Bulk insert items
        const items = data.map((itemData) => new LearningPathSectionItem(itemData, this));
        this.items.push(...items);
    }

    @action
    addItems(newItems = []) {
        newItems.forEach((newItem) => {
            newItem.learningPathSection = this;
            this.items.push(newItem);
        });
    }

    @autobind
    @action
    toggleExpanded() {
        this.isExpanded = !this.isExpanded;
    }

    @action
    collapse() {
        this.isExpanded = false;
    }

    @computed
    get itemsCount() {
        return this.items.reduce((acc, item) => {
            if (!item.isRemoved) {
                acc += 1;
            }
            return acc;
        }, 0);
    }

    @computed
    get totalDuration() {
        return this.items.reduce((acc, item) => {
            const {duration} = item;
            if (duration && !item.isRemoved) {
                acc += duration;
            }
            return acc;
        }, 0);
    }

    @computed
    get removedItemsCount() {
        return this.items.filter((item) => item.isRemoved).length;
    }

    @computed
    get isSavingModeEnabled() {
        return this.isSaving || this.items.some((item) => item.isSaving);
    }

    @computed
    get isSavingFailed() {
        return this.apiError || this.items.some((item) => item.apiError);
    }

    @computed
    get hasRemovedCourseInSection() {
        return this.items.some((item) => item.isRemoved);
    }

    async _executeUpdate() {
        await super._executeUpdate();
        // Important analytics event!
        this._fireLearningPathEditedEvent();
    }

    async delete() {
        await super.delete();
        // Important analytics event!
        this._fireLearningPathEditedEvent();
    }

    _fireLearningPathEditedEvent() {
        Tracker.publishEvent(
            new LearningPathEdited({
                id: this.learningPath.id,
                isPublicLearningPath: this.learningPath.isPublic,
                isUdemyPath: this.learningPath.isProPath,
            }),
        );
    }
}
