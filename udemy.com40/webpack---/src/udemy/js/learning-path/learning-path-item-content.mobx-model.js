import {action, computed, observable, runInAction} from 'mobx';

import {ENROLLMENTS_URL} from 'course-auto-enroll/constants';
import {MAX_NUM_OF_CURRICULUM_OBJECTS, API_CURRICULUM_FIELDS} from 'course-taking/constants';
import {ITEM_TYPES} from 'course-taking/curriculum/constants';
import CurriculumSection from 'course-taking/curriculum/curriculum-section.mobx-model';
import Lecture from 'course-taking/curriculum/lecture.mobx-model';
import Practice from 'course-taking/curriculum/practice.mobx-model';
import Quiz from 'course-taking/curriculum/quiz.mobx-model';
import {APIModel} from 'utils/mobx';
import udApi from 'utils/ud-api';

export default class LearningPathItemContent extends APIModel {
    @observable curriculumSections = [];
    @observable isCurriculumLoading = false;

    @computed get userSelectedItems() {
        const userSelectedItems = [];
        this.curriculumSections.forEach((section) => {
            section.items.forEach((item) => {
                if (item.isSelected) {
                    userSelectedItems.push([item.type, item.id]);
                }
            });
        });
        return userSelectedItems;
    }

    @computed get numUserSelectedItems() {
        return this.userSelectedItems.length;
    }

    @computed get isSelectAllChecked() {
        return this.curriculumSections.every((section) => section.isSelected);
    }

    get apiDataMap() {
        return {
            id: 'id',
            url: 'url',
            enrollUrl: 'enroll_url',
        };
    }

    get courseId() {
        return this.id;
    }

    get curriculumUrl() {
        return `/courses/${this.courseId}/public-curriculum-items/`;
    }

    get enrollmentUrl() {
        return ENROLLMENTS_URL;
    }

    async enroll(data = {}) {
        const params = {course_id: this.courseId, ...data};
        const response = await udApi.post(this.enrollmentUrl, params);
        return response;
    }

    @action
    async loadCurriculumItemsPage(curriculumPromise, currentSection) {
        const response = await curriculumPromise;

        runInAction(() => {
            currentSection = this._parseCurriculum(response.data.results, currentSection);

            if ('next' in response.data && response.data.next !== null) {
                this.loadCurriculumItemsPage(udApi.get(response.data.next), currentSection);
            }
        });
    }

    async loadCurriculum() {
        this._setCurriculumLoading(true);
        this.clearCurriculum();

        const curriculumPromise = udApi.get(this.curriculumUrl, {
            params: {
                page_size: MAX_NUM_OF_CURRICULUM_OBJECTS,
                ...API_CURRICULUM_FIELDS,
            },
        });

        await this.loadCurriculumItemsPage(curriculumPromise, null);
        this._setCurriculumLoading(false);
    }

    @action
    _parseCurriculum(items, currentSection) {
        items.forEach((curriculumItemData) => {
            // Copied from course taking
            if (curriculumItemData._class === ITEM_TYPES.CHAPTER) {
                currentSection = new CurriculumSection(curriculumItemData);
                this.curriculumSections.push(currentSection);
            } else {
                if (!currentSection) {
                    currentSection = new CurriculumSection({});
                    this.curriculumSections.push(currentSection);
                }
                let curriculumItem;
                switch (curriculumItemData._class) {
                    case ITEM_TYPES.LECTURE:
                        curriculumItem = new Lecture(curriculumItemData, this.courseId);
                        break;
                    case ITEM_TYPES.QUIZ:
                        curriculumItem = new Quiz(curriculumItemData, this.courseId);
                        break;
                    case ITEM_TYPES.PRACTICE:
                        curriculumItem = new Practice(curriculumItemData, this.courseId);
                        break;
                    default:
                        throw new Error(
                            `Unknown curriculum item type, ${curriculumItemData._class}.`,
                        );
                }
                this._checkItemSelection(curriculumItem);
                currentSection.addItem(curriculumItem);
            }
        });
        return currentSection;
    }

    _checkItemSelection(item) {
        item.setIsSelected(true);
    }

    @action clearCurriculum() {
        this.curriculumSections = [];
    }

    @action
    _setCurriculumLoading(value) {
        this.isCurriculumLoading = value;
    }

    setIsSelectAllChecked(value) {
        this.curriculumSections.forEach((section) => {
            section.setIsSelected(value);
        });
    }
}
