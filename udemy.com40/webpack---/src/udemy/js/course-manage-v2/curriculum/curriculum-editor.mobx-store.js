import autobind from 'autobind-decorator';
import {action, computed, extendObservable, observable, reaction, runInAction} from 'mobx';

import {FREE_COURSE_CONTENT_LENGTH_LIMIT} from 'course-manage-v2/constants';
import {showSuccessToast} from 'instructor/toasts';
import {EDIT_FULL_AND_ADMIN_LAB_ACCESS_LEVELS} from 'labs/constants';
import {checkUserLabAccessLevel} from 'labs/utils';
import arrayMove from 'utils/array-move';
import getConfigData from 'utils/get-config-data';
import getRequestData from 'utils/get-request-data';
import udApi, {parseError} from 'utils/ud-api';
import udExpiringLocalStorage from 'utils/ud-expiring-local-storage';
import udLink from 'utils/ud-link';
import udMe from 'utils/ud-me';
import SystemMessage from 'utils/ud-system-message';

import {MAX_NUM_OF_CURRICULUM_OBJECTS} from '../../instructor/common/constants';
import CurriculumCourseModel from './curriculum-course.mobx-model';
import CurriculumAssignmentFormModel from './item/assignment/curriculum-assignment-form.mobx-model';
import CurriculumAssignmentModel from './item/assignment/curriculum-assignment.mobx-model';
import {
    assetFilterParams,
    assignmentFilterParams,
    chapterFilterParams,
    courseFilterParams,
    lectureFilterParams,
    loadingState,
    quizFilterParams,
    curriculumItemTypes,
    curriculumItemKeyClasses,
} from './item/constants';
import CurriculumLectureFormModel from './item/lecture/curriculum-lecture-form.mobx-model';
import CurriculumLectureModel from './item/lecture/curriculum-lecture.mobx-model';
import CurriculumQuizFormModel from './item/quiz/curriculum-quiz-form.mobx-model';
import CurriculumQuizModel from './item/quiz/curriculum-quiz.mobx-model';
import CurriculumSectionFormModel from './item/section/curriculum-section-form.mobx-model';
import CurriculumSectionModel from './item/section/curriculum-section.mobx-model';
import {
    IS_SECTION_TOPICS_ENABLED_COURSE_LIST,
    IS_SECTION_TOPICS_ENABLED_USER_ID_LIST,
} from './item/section/topic/constants';

const udConfig = getConfigData();
const udRequest = getRequestData();

export default class CurriculumEditorStore {
    @observable sections = [];

    @observable loadingState = loadingState.initial;
    @observable reorderingUi = {isDragging: false, isFirstChildClone: false};

    // This improves the initial render time for long curricula.
    // Rendering 550 lectures at once takes ~7s; rendering 50 takes ~2s.
    // Rendering time is estimated as the time between when the curriculum API call returns
    // and when <CurriculumList /> componentDidMount is called.
    @observable renderItemsUpToIndex = 0;
    _renderItemsBatchSize = 50;

    // The error object stores the most recent API error. We want to show update order errors
    // even if they are not the most recent error. Hence, we use a separate observable for them.
    @observable error = {};
    @observable isUpdateOrderErrorShown = false;

    // Add Section form and Add NonSection form are toggled independently.
    // Only one Add NonSection form can be open at a time,
    // e.g. we can have Add Section and Add Lecture open at the same time,
    // but not Add Lecture and Add Quiz.
    @observable
    addItemButtonsUi = {
        isSectionFormOpen: false,
        selectedNonSectionType: null,
    };

    @observable curriculumItemWithInitialFocus = null;
    @observable toBeDeletedCurriculumItem = null;

    @observable inlineItemEditorActiveKey = null;
    @observable isSectionModeInlineItemEditor = false;

    curriculumItems = [];

    constructor(appProps) {
        extendObservable(this, {
            course: new CurriculumCourseModel({id: appProps.courseId}),
        });

        // Add form and Edit form have independent state.
        // Add form is shown/hidden through this.addItemButtonsUi.
        // Edit form is shown/hidden through CurriculumItemModel.isEditFormOpen.
        // Only one Edit form can be open at a time (see this.openEditFormForItem).
        this.addForms = {
            [curriculumItemKeyClasses.lecture]: new CurriculumLectureFormModel(),
            [curriculumItemKeyClasses.simpleQuiz]: new CurriculumQuizFormModel(
                curriculumItemKeyClasses.simpleQuiz,
            ),
            [curriculumItemKeyClasses.practiceTest]: new CurriculumQuizFormModel(
                curriculumItemKeyClasses.practiceTest,
            ),
            [curriculumItemKeyClasses.codingExercise]: new CurriculumQuizFormModel(
                curriculumItemKeyClasses.codingExercise,
            ),
            [curriculumItemKeyClasses.section]: new CurriculumSectionFormModel(),
            [curriculumItemKeyClasses.assignment]: new CurriculumAssignmentFormModel(),
        };
        this.editForms = {
            [curriculumItemKeyClasses.lecture]: new CurriculumLectureFormModel(),
            [curriculumItemKeyClasses.simpleQuiz]: new CurriculumQuizFormModel(
                curriculumItemKeyClasses.simpleQuiz,
            ),
            [curriculumItemKeyClasses.practiceTest]: new CurriculumQuizFormModel(
                curriculumItemKeyClasses.practiceTest,
            ),
            [curriculumItemKeyClasses.section]: new CurriculumSectionFormModel(),
        };

        this.freePreviewInfo = udLink.toSupportLink('free_preview');
        this.pageStore = appProps.pageStore;
        const expirationDate = new Date(Date.now() + 365 * 24 * 3600 * 1000);
        this.freeCourseAlertStorage = udExpiringLocalStorage(
            'freeCourseAlertStorage',
            this.course.id,
            expirationDate,
        );
        this.filePickerParams = {
            policy: appProps.filestackPolicy,
            signature: appProps.filestackSignature,
        };
    }

    @autobind
    isFreeContentExceedTimeLimit() {
        return this.pageStore.course.contentLengthVideo > FREE_COURSE_CONTENT_LENGTH_LIMIT;
    }

    @autobind
    dismissAlertFreeCourseContentLength() {
        this.freeCourseAlertStorage.set('courseId', this.course.id);
    }

    @computed
    get showAlertFreeCourseContentLength() {
        if (this.course.isPaid) {
            return false;
        }
        if (this.freeCourseAlertStorage.get('courseId') === this.course.id) {
            return false;
        }
        return this.isFreeContentExceedTimeLimit();
    }

    @computed
    get canShowCurriculum() {
        if (!this.inlineInsertEnabled) {
            return true;
        }
        if (this.course.isOrganizationOnly) {
            return true;
        }
        if (!this.course.isPracticeTestCourse) {
            return true;
        }
        if (this.course.isPaid) {
            return true;
        }
        return false;
    }

    @computed
    get showAlertPracticeTest() {
        if (!this.inlineInsertEnabled) {
            return false;
        }

        if (!this.course.isPracticeTestCourse) {
            return false;
        }

        if (udConfig.brand.has_organization) {
            return false;
        }

        if (
            this.numOfPracticeTests > 0 &&
            this.numOfPracticeTests < this.course.max_num_of_practice_tests
        ) {
            return false;
        }

        return true;
    }

    @autobind
    createFirstSection() {
        this.setInlineItemEditorActiveKey(this.flatList[0].key, true);
    }

    @computed
    get isFirstElementSection() {
        if (this.loadingState !== loadingState.loaded) {
            return true; // everyone is innocent until proven guilty
        }
        return (
            this.flatListWithoutFakeSection.length > 0 &&
            this.flatListWithoutFakeSection[0].keyClass === curriculumItemKeyClasses.section
        );
    }

    @computed
    get showAlertFirstSectionCreation() {
        if (!this.inlineInsertEnabled) {
            return false;
        }

        if (this.course.isPracticeTestCourse) {
            return false;
        }

        if (this.loadingState !== loadingState.loaded) {
            return false;
        }

        if (this.flatListWithoutFakeSection.length === 0) {
            return false;
        }

        if (this.isFirstElementSection) {
            return false;
        }

        // id the section editor is open for the fake section
        if (
            this.isSectionModeInlineItemEditor &
            (this.inlineItemEditorActiveKey === this.flatList[0].key)
        ) {
            return false;
        }

        return true;
    }

    @computed
    get inlineInsertEnabled() {
        return !udRequest.isMobile;
    }

    @computed
    get flatList() {
        const list = [];
        this.sections.forEach((section) => {
            list.push(section);
            section.items.forEach((item) => {
                list.push(item);
            });
        });
        return list;
    }

    @computed
    get flatListWithoutFakeSection() {
        return this.flatList.slice(1);
    }

    @computed
    get numOfNonSectionItems() {
        return this.flatList.filter((item) => item.keyClass !== curriculumItemKeyClasses.section)
            .length;
    }

    @computed
    get numOfPracticeTests() {
        return this.flatList.filter(
            (item) => item.keyClass === curriculumItemKeyClasses.practiceTest,
        ).length;
    }

    /**
     * Returns the object index of each curriculum item.
     * The logic should be consistent with `update_order` in curriculum/helpers.py.
     */
    @autobind
    _getObjectIndices() {
        const map = {};
        const counter = {
            [curriculumItemKeyClasses.section]: 1,
            [curriculumItemKeyClasses.lecture]: 1,
            [curriculumItemKeyClasses.simpleQuiz]: 1,
            [curriculumItemKeyClasses.codingExercise]: 1,
            [curriculumItemKeyClasses.practiceTest]: 1,
            [curriculumItemKeyClasses.assignment]: 1,
        };
        this.flatListWithoutFakeSection.forEach((item) => {
            if (item.is_published) {
                map[item.key] = counter[item.keyClass]++;
            } else {
                map[item.key] = 0;
            }
        });
        return map;
    }

    @autobind
    @action
    _onOrderingChange(objectIndices) {
        const updateOrderPostBody = [];
        this.flatListWithoutFakeSection.forEach((item) => {
            item.setObjectIndex(objectIndices[item.key]);
            updateOrderPostBody.push({
                id: item.id,
                class: item._class,
                type: item._class === curriculumItemTypes.quiz ? item.type : undefined,
                is_published: item.is_published,
            });
        });

        this.isUpdateOrderErrorShown = false;
        udApi
            .put(`/courses/${this.course.id}/instructor-curriculum-items/`, {
                items: JSON.stringify(updateOrderPostBody),
            })
            .catch(
                action(() => {
                    this.isUpdateOrderErrorShown = true;
                }),
            );
    }

    @computed
    get firstPublishedVideoLecture() {
        return this.flatList.find((item) => {
            return (
                item.keyClass === curriculumItemKeyClasses.lecture &&
                item.is_published &&
                item.hasCompletedAssetContent &&
                item.hasVideoBasedAssetContent
            );
        });
    }

    @computed
    get showLinkToLab() {
        return this.isWorkspacesEnabled && this.course.hasWorkspaceAssociated;
    }

    get isWorkspacesEnabled() {
        return checkUserLabAccessLevel(EDIT_FULL_AND_ADMIN_LAB_ACCESS_LEVELS);
    }

    @action
    isLastItemInSection(curriculumItem) {
        let flag = false;
        const isSection = curriculumItem.keyClass === curriculumItemKeyClasses.section;
        if (isSection && (!curriculumItem.items || curriculumItem.items.length === 0)) return true; // for newly created empty sections
        this.sections.filter(Boolean).forEach((section) => {
            section.items.filter(Boolean).forEach((item, index) => {
                if (
                    item.key === curriculumItem.key &&
                    index === section.items.filter(Boolean).length - 1
                )
                    flag = true;
            });
        });
        return flag;
    }

    get isSectionTaggingEnabled() {
        return (
            IS_SECTION_TOPICS_ENABLED_COURSE_LIST.includes(this.course.id) ||
            IS_SECTION_TOPICS_ENABLED_USER_ID_LIST.includes(udMe.id) ||
            this.pageStore.isCurriculumEditorSectionTopicsEnabled
        );
    }

    @action
    async fetchCurriculum() {
        this.loadingState = loadingState.loading;
        const extraCourseParams = [];
        extraCourseParams.push('primary_category');
        if (this.isWorkspacesEnabled) {
            extraCourseParams.push('available_features');
        }

        const curriculumPromise = udApi.get(
            `/courses/${this.course.id}/instructor-curriculum-items/`,
            {
                params: {
                    page_size: MAX_NUM_OF_CURRICULUM_OBJECTS,
                    // NOTE Update test_num_queries_curriculum_editor if changing fields!
                    'fields[chapter]': chapterFilterParams.join(','),
                    'fields[lecture]': lectureFilterParams.join(','),
                    'fields[quiz]': quizFilterParams.join(','),
                    'fields[practice]': assignmentFilterParams.join(','),
                    'fields[asset]': assetFilterParams.join(','),
                },
            },
        );
        return Promise.all([
            udApi.get(`/courses/${this.course.id}/`, {
                params: {
                    'fields[course]': courseFilterParams.concat(extraCourseParams).join(','),
                    'fields[course_category]': 'id',
                },
            }),
            SystemMessage.hasSeen(SystemMessage.ids.captionManagePage),
            this._fetchCurriculumItems(curriculumPromise),
        ])
            .then(
                action(([courseResponse, seenResponse]) => {
                    this._initialize(courseResponse.data, seenResponse);
                    this.loadingState = loadingState.loaded;
                    this._renderItemsInBatches(this._renderItemsBatchSize);
                }),
            )
            .catch(
                action((error) => {
                    this.error = parseError(error);
                    this.loadingState = loadingState.initial;
                    throw this.error;
                }),
            );
    }

    @action
    async _fetchCurriculumItems(curriculumPromise) {
        const curriculumResponse = await curriculumPromise;
        runInAction(() => {
            this.curriculumItems.push(...curriculumResponse.data.results);
        });

        if ('next' in curriculumResponse.data && curriculumResponse.data.next !== null) {
            await this._fetchCurriculumItems(udApi.get(curriculumResponse.data.next));
        }
    }

    _initialize(course, seen) {
        this.course = new CurriculumCourseModel(course);

        extendObservable(this, {
            seenCaptionManage: seen.data,
        });

        // Always create a fake section to store items that are not in any section.
        // The fake section cannot be moved or deleted. It is always the first section.
        // It helps us handle edge cases such as:
        // - moving an item above the first real section
        // - deleting the first real section
        let currentSection = CurriculumSectionModel.createFake();
        this.sections = [currentSection];

        this.curriculumItems.forEach((curriculumItem) => {
            curriculumItem.course = this.course;
            if (curriculumItem._class === curriculumItemTypes.section) {
                currentSection = new CurriculumSectionModel(curriculumItem);
                this.sections.push(currentSection);
            } else {
                currentSection.items.push(this._createSectionItem(curriculumItem));
            }
        });

        // This magic enables us to update object indices whenever items are created, deleted,
        // reordered, published, or unpublished.
        reaction(this._getObjectIndices, this._onOrderingChange);

        // This happens whenever assignments or coding exercises get published or unpublished
        // because they are edited on a separate page.
        const objectIndices = this._getObjectIndices();
        const areObjectIndicesInitiallyWrong = this.flatListWithoutFakeSection.some(
            (item) => item.object_index !== objectIndices[item.key],
        );
        if (areObjectIndicesInitiallyWrong) {
            this._onOrderingChange(objectIndices);
        }
    }

    _createSectionItem(curriculumItem) {
        switch (curriculumItem._class) {
            case curriculumItemTypes.lecture:
                return new CurriculumLectureModel(curriculumItem);
            case curriculumItemTypes.quiz:
                return new CurriculumQuizModel(curriculumItem);
            case curriculumItemTypes.assignment:
                return new CurriculumAssignmentModel(curriculumItem);
            default:
                throw new Error(`Unknown curriculum item type: ${curriculumItem._class}`);
        }
    }

    _createCurriculumItemFromPostData(itemKeyClass, postData) {
        switch (itemKeyClass) {
            case curriculumItemKeyClasses.assignment:
                return CurriculumAssignmentModel.create(this.course, postData);
            case curriculumItemKeyClasses.lecture:
                return CurriculumLectureModel.create(this.course, postData);
            case curriculumItemKeyClasses.codingExercise:
            case curriculumItemKeyClasses.simpleQuiz:
            case curriculumItemKeyClasses.practiceTest:
                return CurriculumQuizModel.create(this.course, postData);
            case curriculumItemKeyClasses.section:
                return CurriculumSectionModel.create(
                    this.course,
                    postData,
                    this.pageStore.isCurriculumEditorSectionTopicsEnabled,
                );
            default:
                throw new Error(`Curriculum type ${itemKeyClass} cannot be created from post data`);
        }
    }

    @autobind
    @action
    _renderItemsInBatches(cutoffIndex) {
        const numItems = this.flatListWithoutFakeSection.length;
        this.renderItemsUpToIndex = cutoffIndex;
        if (numItems > this.renderItemsUpToIndex) {
            setTimeout(() => {
                this._renderItemsInBatches(cutoffIndex + this._renderItemsBatchSize);
            }, 0);
        } else {
            this.renderItemsUpToIndex = Infinity;
        }
    }

    @action
    openAddFormForItem(itemKeyClass) {
        if (itemKeyClass === curriculumItemKeyClasses.section) {
            this.addItemButtonsUi.isSectionFormOpen = true;
        } else {
            this.addItemButtonsUi.selectedNonSectionType = itemKeyClass;
        }
    }

    @action
    closeAddFormForItem(itemKeyClass = null) {
        if (!itemKeyClass) {
            this.addItemButtonsUi.isSectionFormOpen = false;
            this.addItemButtonsUi.selectedNonSectionType = null;
        } else if (itemKeyClass === curriculumItemKeyClasses.section) {
            this.addItemButtonsUi.isSectionFormOpen = false;
            if (this.inlineInsertEnabled) {
                this.setInlineItemEditorActiveKey(null);
            }
        } else if (itemKeyClass === this.addItemButtonsUi.selectedNonSectionType) {
            this.addItemButtonsUi.selectedNonSectionType = null;
        }
    }

    @action
    openEditFormForItem(curriculumItem) {
        this.flatList.forEach((item) => {
            if (item.key !== curriculumItem.key && item.isEditFormOpen) {
                item.closeEditForm();
            }
        });
        curriculumItem.openEditForm();
        this.closeAddFormForItem(null); // Close all add forms.
    }

    addItem(itemKeyClass, postData) {
        const form = this.addForms[itemKeyClass];
        form.startSaving();
        return this._createCurriculumItemFromPostData(itemKeyClass, postData)
            .then(
                action((curriculumItem) => {
                    if (itemKeyClass === curriculumItemKeyClasses.section) {
                        this.sections.push(curriculumItem);
                    } else {
                        this.sections[this.sections.length - 1].items.push(curriculumItem);
                    }
                    if (
                        this.inlineItemEditorActiveKey !== null &&
                        this.inlineItemEditorActiveKey !== -1
                    ) {
                        const isKeyFromFakeSection =
                            this.inlineItemEditorActiveKey === this.flatList[0].key;
                        const positionDelta =
                            itemKeyClass === curriculumItemKeyClasses.section ? 0 : 1;
                        const newPosition = isKeyFromFakeSection
                            ? 1
                            : this.flatList
                                  .map((el) => el.key)
                                  .indexOf(this.inlineItemEditorActiveKey) + positionDelta;
                        this.moveItem(
                            {item: {id: `${itemKeyClass}${curriculumItem.id}`}},
                            this.flatList.length - 1,
                            newPosition,
                        );
                    }
                    this.inlineItemEditorActiveKey = null;
                    this.closeAddFormForItem(itemKeyClass);
                    form.finishSaving();
                }),
            )
            .then(() => {
                if (itemKeyClass === curriculumItemKeyClasses.lecture) {
                    // Automatically reopen the form for lectures only.
                    this.openAddFormForItem(itemKeyClass);
                }
            })
            .catch(
                action((error) => {
                    form.finishSaving(error);
                    this.error = parseError(error);
                    throw this.error;
                }),
            );
    }

    editItem(curriculumItem, postData) {
        const form = this.editForms[curriculumItem.keyClass];
        form.startSaving();
        return curriculumItem
            .partialUpdate(postData)
            .then(
                action(() => {
                    curriculumItem.closeEditForm();
                    form.finishSaving();
                }),
            )
            .catch(
                action((error) => {
                    form.finishSaving(error);
                    this.error = parseError(error);
                    throw this.error;
                }),
            );
    }

    @action
    setReorderingUi(reorderingUi) {
        Object.assign(this.reorderingUi, reorderingUi);
    }

    /**
     * Moves an item from index oldIndex in this.flatList to index newIndex in this.flatList.
     */
    @action
    moveItem(event, oldIndex, newIndex) {
        if (oldIndex === newIndex) {
            return;
        }

        let loopCount = 1;
        let sectionId, section;
        const eventItem = event.item;
        const isSection = this.isSectionItem(eventItem);

        if (isSection) {
            if (oldIndex > newIndex) {
                if (this.isFlatListItemDifferentFromSection(newIndex)) {
                    newIndex = this.findPreviousSectionFrom(newIndex);
                }
            } else if (this.isNextFlatListItemDifferentFromSection(newIndex)) {
                newIndex = this.findNextSectionFrom(newIndex);
            } else {
                const childNodes = event.from.childNodes;
                event.from.insertBefore(eventItem, childNodes[oldIndex - 1]);
            }
            sectionId = eventItem.id.split(curriculumItemKeyClasses.section)[1];
            section = this.sections.filter((item) => item.id === parseInt(sectionId, 10))[0];
            loopCount = sectionId === 0 ? 1 : section.items.length + 1;
        }
        let reorderedList = arrayMove(this.flatList, oldIndex, newIndex);
        for (let i = 1; i < loopCount; i++) {
            if (oldIndex > newIndex) {
                oldIndex = oldIndex + 1;
                newIndex = newIndex + 1;
            }
            reorderedList = arrayMove(reorderedList, oldIndex, newIndex);
        }

        // Regroup sections.
        this.sections = [];
        let currentSection = null;
        reorderedList.forEach((item) => {
            if (item.keyClass === curriculumItemKeyClasses.section) {
                currentSection = item;
                currentSection.items = [];
                this.sections.push(currentSection);
            } else {
                currentSection.items.push(item);
            }
        });
    }

    @action
    onMove(draggedItem, relatedItem) {
        if (draggedItem.id.includes(curriculumItemKeyClasses.section)) {
            return relatedItem.id.includes(curriculumItemKeyClasses.section);
        }
        return true;
    }

    @autobind
    isFlatListItemDifferentFromSection(index) {
        return this.flatList[index].keyClass !== curriculumItemKeyClasses.section;
    }

    @autobind
    isNextFlatListItemDifferentFromSection(index) {
        return this.flatList[index + 1] && this.isFlatListItemDifferentFromSection(index + 1);
    }

    @autobind
    isNextFlatListItemBelongsToCurrentSection(index, oldIndex) {
        let sectionIndex = null;
        for (let i = index + 1; i > 1; i--) {
            if (this.flatList[i].keyClass === curriculumItemKeyClasses.section) {
                sectionIndex = i;
                break;
            }
        }
        return sectionIndex === oldIndex;
    }

    @autobind
    isSectionItem(eventItem) {
        return eventItem.id.includes(curriculumItemKeyClasses.section);
    }

    @autobind
    findPreviousSectionFrom(index) {
        let previousSectionIndex = null;
        for (let sectionIndex = index - 1; sectionIndex > 1; sectionIndex--) {
            if (this.flatList[sectionIndex].keyClass === curriculumItemKeyClasses.section) {
                previousSectionIndex = sectionIndex;
                break;
            }
        }
        return previousSectionIndex || 1;
    }

    @autobind
    findNextSectionFrom(index) {
        let nextSectionIndex = null;
        for (let sectionIndex = index + 1; sectionIndex < this.flatList.length; sectionIndex++) {
            if (this.flatList[sectionIndex].keyClass === curriculumItemKeyClasses.section) {
                nextSectionIndex = sectionIndex - 1;
                break;
            }
        }
        return nextSectionIndex || this.flatList.length - 1;
    }

    @action
    setInitialFocusOn(curriculumItem) {
        if (curriculumItem) {
            this.curriculumItemWithInitialFocus = this._createSectionItem(curriculumItem);
        } else {
            this.curriculumItemWithInitialFocus = null;
        }
    }

    @autobind
    @action
    openDeleteCurriculumItemConfirmation(curriculumItem) {
        this.toBeDeletedCurriculumItem = curriculumItem;
    }

    @autobind
    @action
    closeDeleteCurriculumItemConfirmation() {
        this.toBeDeletedCurriculumItem = null;
    }

    @autobind
    @action
    deleteCurriculumItem() {
        const curriculumItem = this.toBeDeletedCurriculumItem;
        if (curriculumItem === null) {
            return Promise.resolve();
        }
        this.closeDeleteCurriculumItemConfirmation();
        curriculumItem.closeAddContent();
        curriculumItem.closeEditContent();

        return curriculumItem
            .delete()
            .then(
                action(() => {
                    if (curriculumItem.successDeleteMessage) {
                        showSuccessToast(curriculumItem.successDeleteMessage);
                    }

                    if (curriculumItem.keyClass === curriculumItemKeyClasses.section) {
                        const deletedSectionIndex = this.sections.findIndex(
                            (item) => item.key === curriculumItem.key,
                        );
                        const previousSection = this.sections[deletedSectionIndex - 1];
                        previousSection.items = previousSection.items.concat(curriculumItem.items);
                        this.sections.splice(deletedSectionIndex, 1);
                    } else {
                        this.sections.forEach((section) => {
                            const deletedItemIndex = section.items.findIndex(
                                (item) => item.key === curriculumItem.key,
                            );
                            if (deletedItemIndex >= 0) {
                                section.items.splice(deletedItemIndex, 1);
                            }
                        });
                    }
                    this.pageStore.getContentLengthVideo();
                }),
            )
            .catch(
                action((error) => {
                    this.error = parseError(error);
                    throw this.error;
                }),
            );
    }

    @autobind
    @action
    setInlineItemEditorActiveKey(curriculumItemKey, isSection = false) {
        this.isSectionModeInlineItemEditor = isSection;
        this.inlineItemEditorActiveKey = curriculumItemKey;
        this.closeAddFormForItem();
    }
}
