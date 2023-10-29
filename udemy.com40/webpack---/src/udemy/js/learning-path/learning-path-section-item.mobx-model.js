import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, observable, reaction, when} from 'mobx';

import {LearningPathEdited} from 'learning-path/tracking-events-v2';
import udApi from 'utils/ud-api';

import CourseRetirementAlternativesStore from '../organization-common/course-retirement/course-retirement-alternatives.mobx-store';
import EditableApiModel from './editable-api-model.mobx-model';
import LearningPathAssessment from './learning-path-assessment.mobx-model';
import LearningPathCoursePortion from './learning-path-course-portion.mobx-model';
import LearningPathCourse from './learning-path-course.mobx-model';
import LearningPathLab from './learning-path-lab.mobx-model';
import {
    COURSE_CONTENT_TYPE,
    COURSE_PORTION_CONTENT_TYPE,
    LAB_CONTENT_TYPE,
    RESOURCE_CONTENT_TYPE,
    ASSESSMENT_CONTENT_TYPE,
    COURSE_EDITABLE_CONTENT_TYPES,
    UDEMY_ENROLLABLE_CONTENT_TYPES,
} from './learning-path-page/constants';
import LearningPathResource from './learning-path-resource.mobx-model';

export default class LearningPathSectionItem extends EditableApiModel {
    @observable isCompleted = false;
    @observable.ref learningPathSection = null;
    @observable duration;
    @observable content = null;
    @observable isContentSaving = false;

    static contentTypeMapping = {
        [COURSE_CONTENT_TYPE]: LearningPathCourse,
        [COURSE_PORTION_CONTENT_TYPE]: LearningPathCoursePortion,
        [LAB_CONTENT_TYPE]: LearningPathLab,
        [RESOURCE_CONTENT_TYPE]: LearningPathResource,
        [ASSESSMENT_CONTENT_TYPE]: LearningPathAssessment,
    };

    static contentTypeToAnalyticsEnrollmentSourceMapping = {
        // Used to map to @options for pathEnrollmentSource in events.
        // See https://github.com/udemy/schema-store/blob/bc50e00647e410eaf889a87e3b47c76f8e109a55/fields/PathEnrollmentSource.avdl#L19
        [COURSE_CONTENT_TYPE]: 'course',
        [COURSE_PORTION_CONTENT_TYPE]: 'course_portion',
        [LAB_CONTENT_TYPE]: 'lab',
        [ASSESSMENT_CONTENT_TYPE]: 'assessment',
        [RESOURCE_CONTENT_TYPE]: 'resource',
    };

    get editableFieldsMap() {
        return new Map([
            ['title', 'title'],
            ['description', 'description'],
            ['contentLength', 'content_length'],
        ]);
    }

    get resourceUrl() {
        return `${this.learningPathSection.itemsUrl}${this.id}/`;
    }

    get completeUrl() {
        return `${this.resourceUrl}complete/`;
    }

    get editContentUrl() {
        return `${this.resourceUrl}edit-content/`;
    }

    get isEnrollableUdemyType() {
        return UDEMY_ENROLLABLE_CONTENT_TYPES.includes(this.type);
    }

    constructor(data, learningPathSection) {
        super(data);
        this.learningPathSection = learningPathSection;
        reaction(
            () => this.changedData,
            () => this.learningPathSection.learningPath.resetLocalEditTimestamp(),
        );
        when(
            () => this.content.courseId,
            () => this.initializeCourseRetirementStore(),
        );
    }

    initializeCourseRetirementStore() {
        if ([COURSE_CONTENT_TYPE, COURSE_PORTION_CONTENT_TYPE].includes(this.type)) {
            this.courseAlternativeStore = new CourseRetirementAlternativesStore(
                this.content.courseId,
                this.content?.courseLabel?.id,
            );
        }
    }

    get apiDataMap() {
        return {
            id: 'id',
            title: {
                source: ['title', 'related_object_type', 'content'],
                map: (title, relatedObjectType, content) => {
                    if (relatedObjectType === COURSE_CONTENT_TYPE) {
                        return content.title;
                    }
                    if (relatedObjectType === COURSE_PORTION_CONTENT_TYPE) {
                        return content.course.title;
                    }
                    if (relatedObjectType === ASSESSMENT_CONTENT_TYPE) {
                        return content.title;
                    }
                    return title;
                },
            },
            description: 'description',
            type: 'related_object_type',
            contentLength: 'estimated_content_length',
            duration: 'estimated_content_length',
            content: {
                source: ['related_object_type', 'content'],
                map: (relatedObjectType, content) => {
                    return new LearningPathSectionItem.contentTypeMapping[relatedObjectType](
                        content,
                    );
                },
            },
            isRemoved: 'is_removed',
        };
    }

    @autobind
    async complete() {
        if (!this.isCompleted && this.type === RESOURCE_CONTENT_TYPE) {
            await this._storeCompletion();
            this.setIsCompleted(true);
        }
        return false;
    }

    async _storeCompletion() {
        await udApi.post(this.completeUrl);
    }

    @autobind
    async editContent() {
        if (!COURSE_EDITABLE_CONTENT_TYPES.includes(this.type)) {
            throw new Error('Unable to edit content for this item');
        }
        if (this.isContentSaving) {
            return false;
        }
        const data = {items: [], select_all: false};
        if (this.content.isSelectAllChecked) {
            data.select_all = true;
        } else {
            data.items = this.content.userSelectedItems;
        }
        this._setContentSaving(true);
        const response = await udApi.post(this.editContentUrl, data);
        this.setDataFromAPI(response.data);
        this._setContentSaving(false);
        this.learningPathSection.learningPath.resetLocalEditTimestamp();
        this._fireLearningPathEditedEvent();
    }

    @action
    _setContentSaving(value) {
        this.isContentSaving = value;
    }

    @action
    setIsCompleted(value) {
        this.isCompleted = value;
    }

    @autobind
    setTitle(value) {
        if (this.type !== COURSE_CONTENT_TYPE) {
            this._changeEditableField('title', value);
        }
    }

    @autobind
    setDescription(value) {
        this._changeEditableField('description', value);
    }

    @autobind
    setContentLength(value) {
        if (this.type === RESOURCE_CONTENT_TYPE) {
            this._changeEditableField('contentLength', Number(value));
        }
    }

    @autobind
    @action
    resetImage() {
        this.content.image = '';
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
                id: this.learningPathSection.learningPath.id,
                isPublicLearningPath: this.learningPathSection.learningPath.isPublic,
                isUdemyPath: this.learningPathSection.learningPath.isProPath,
            }),
        );
    }
}
