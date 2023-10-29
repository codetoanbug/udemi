import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, computed, observable, runInAction} from 'mobx';

import {
    LearningPathDeleted,
    LearningPathEdited,
    LearningPathEnrolled,
    LearningPathUnenrolled,
} from 'learning-path/tracking-events-v2';
import getConfigData from 'utils/get-config-data';
import udApi from 'utils/ud-api';
import udMe from 'utils/ud-me';

import {BASE_PATH, LEARNING_PATH_ASSIGNABLE_TYPE} from './constants';
import EditableApiModel from './editable-api-model.mobx-model';
import {
    ASSESSMENT_CONTENT_TYPE,
    CONTENT_TYPE_CONFIG,
    HISTORY_LOG_LAUNCH_DATE,
    INVISIBLE_SECTION_KEY,
    LAB_CONTENT_TYPE,
    LEARNING_PATH_ERROR_MESSAGES,
    LEARNING_PATH_SECTION_API_FIELDS,
    LEARNING_PATH_SECTION_ITEM_API_FIELDS,
    SECTION_CONTENT_TYPE,
} from './learning-path-page/constants';
import LearningPathSection from './learning-path-section.mobx-model';
import handleError, {isUserOrganizationAdminOrOwner} from './utils';

export default class LearningPath extends EditableApiModel {
    @observable id;
    @observable title = '';
    @observable url = '';
    @observable description = '';
    @observable isPublic = false;
    @observable isProPath = false;
    @observable isUserEnrolled = false;
    @observable isUserAutoEnrollDisabled = false;
    @observable numberOfEnrollments;
    @observable sections = [];
    @observable assessmentToHighlight = null;
    @observable folderIds = [];
    @observable duration;
    @observable isCurriculumLoading = true;
    @observable invisibleSection = null;
    @observable owner;
    @observable editors = [];
    @observable historyLogs = [];
    @observable isHistoryLogLoading = false;
    @observable isHistoryLogVisible = false;
    @observable isHistoryLogLoadingError = false;
    @observable localEditTimestamp = null;
    @observable isDuplicateConfirmationModalOpen = false;

    duplicatePathResponseMessage = interpolate(
        gettext(
            'This learning path will take a little longer to duplicate, as it is quite ' +
                'big. We will email you %(email)s when your learning path has been duplicated.',
        ),
        {email: udMe.email},
        true,
    );

    // Assign resource type. We pass this value to assignment backend
    // to identify the resource type.
    type = LEARNING_PATH_ASSIGNABLE_TYPE;

    @computed
    get isSavingModeEnabled() {
        return this.isSaving || this.sections.some((section) => section.isSavingModeEnabled);
    }

    @computed
    get isSavingFailed() {
        return this.apiError || this.sections.some((section) => section.isSavingFailed);
    }

    @computed
    get isEmpty() {
        return this.itemsCount === 0 && this.sections.length === 0;
    }

    @computed
    get hasRemovedCourseInSection() {
        return this.sections.some((section) => section.hasRemovedCourseInSection);
    }

    @computed
    get hasRemovedCourseInInvisibleSection() {
        return this.invisibleSection && this.invisibleSection.hasRemovedCourseInSection;
    }

    @computed
    get isEmptyState() {
        if (
            this.isEmpty &&
            this.canUserEdit &&
            (this.hasRemovedCourseInSection || this.hasRemovedCourseInInvisibleSection)
        ) {
            return false;
        }
        return this.isEmpty;
    }

    @computed
    get isInvisibleSectionShown() {
        return !!(this.invisibleSection && this.invisibleSection.items.length);
    }

    @computed
    get lastSection() {
        if (!this.sections.length) {
            // If no sections - invisible is the last one
            return this.invisibleSection;
        }
        return this.sections[this.sections.length - 1];
    }

    @computed
    get shouldAutoEnroll() {
        return !this.isUserEnrolled && !this.isUserAutoEnrollDisabled;
    }

    @computed
    get isOrgLearningPath() {
        return this.organizationId === getConfigData().brand.organization?.id;
    }

    get editableFieldsMap() {
        return new Map([
            ['title', 'title'],
            ['description', 'description'],
            ['isPublic', 'is_public'],
        ]);
    }

    get apiDataMap() {
        return {
            id: 'id',
            created: 'created',
            title: 'title',
            url: 'url',
            description: 'description',
            isPublic: 'is_public',
            owner: 'owner',
            editors: 'editors',
            isUserEnrolled: 'is_user_enrolled',
            numberOfEnrollments: 'num_enrollments',
            numberOfAssignments: 'num_assignments',
            duration: 'estimated_content_length',
            totalSteps: 'total_steps',
            folderIds: 'folder_ids',
            folderTitles: 'folder_titles',
            isOwnerInGroup: 'is_owner_in_group',
            isUserAutoEnrollDisabled: 'is_user_auto_enroll_disabled',
            isProPath: 'is_pro_path',
            organizationId: 'organization_id',
            completedSteps: 'completed_steps',
            showOnlyItemCount: 'show_only_item_count',
        };
    }

    get resourceUrl() {
        return `${BASE_PATH}${this.id}/`;
    }

    get editUrl() {
        return `${this.resourceUrl}edit/`;
    }

    get sectionsUrl() {
        return `${this.resourceUrl}sections/`;
    }

    get enrollmentsUrl() {
        return `${this.resourceUrl}enrollments/`;
    }

    get pathInsightsUrl() {
        return `/organization-manage/insights/paths/${this.id}/`;
    }

    get duplicateUrl() {
        return `${this.resourceUrl}duplicate/`;
    }

    get requestPermissionsUrl() {
        return `${this.resourceUrl}permissions/`;
    }

    get pathTitle() {
        return this.title;
    }

    get isUserGroupAdmin() {
        return udMe.organization.isGroupAdmin;
    }

    get isStudent() {
        return udMe.organization.isStudent;
    }

    get userHasEditPermissions() {
        return this.editors && this.editors.some((editor) => editor.id === udMe.id);
    }

    get isUserEditor() {
        return this.owner.id === udMe.id || this.userHasEditPermissions;
    }

    get canRequestEditAccess() {
        return !this.isUserEditor && isUserOrganizationAdminOrOwner();
    }

    get canUserEdit() {
        return this.isUserEditor;
    }

    get wasPathCreatedBeforeHistoryLogLaunch() {
        const pathDateCreated = new Date(this.created);

        return pathDateCreated < HISTORY_LOG_LAUNCH_DATE;
    }

    async createSection(position) {
        const response = await udApi.post(this.sectionsUrl, {
            title: CONTENT_TYPE_CONFIG[SECTION_CONTENT_TYPE].untitled,
            position: position + 1,
        });
        this.insertSectionFromData(position, response.data);
        this.resetLocalEditTimestamp();
    }

    async insertSections(position, sections) {
        const response = await udApi.post(`${this.sectionsUrl}insert-sections/`, {
            // The index should start from 1 for API because of the invisible section
            start_position: position + 1,
            sections,
        });
        this.insertSectionsFromData(position, response.data.results);
        this.resetLocalEditTimestamp();
    }

    async deletePath() {
        await udApi.delete(this.resourceUrl);
        this.resetLocalEditTimestamp();
        // Important analytics event!
        Tracker.publishEvent(
            new LearningPathDeleted({
                id: this.id,
                isPublicLearningPath: this.isPublic,
                isUdemyPath: this.isProPath,
            }),
        );
    }

    async fetchCurriculum() {
        runInAction(() => {
            this.assessmentToHighlight = null;
        });
        this._setCurriculumLoading(true);
        try {
            const response = await udApi.get(this.sectionsUrl, {
                params: {
                    /* common solution in our code base to display all results instead of default page size */
                    page_size: 9999,
                    'fields[learning_path_section]': LEARNING_PATH_SECTION_API_FIELDS.join(','),
                    'fields[learning_path_section_has_item]': LEARNING_PATH_SECTION_ITEM_API_FIELDS.join(
                        ',',
                    ),
                    'fields[course_label]': 'id',
                },
            });
            this.setSections(response.data.results);
        } catch (e) {
            handleError(e, LEARNING_PATH_ERROR_MESSAGES.UNABLE_TO_LOAD_CONTENT);
        } finally {
            this._setCurriculumLoading(false);
        }
    }

    @autobind
    @action
    setTitle(title) {
        if (this.id) this._changeEditableField('title', title);
        else this.title = title;
    }

    @autobind
    @action
    setDescription(description) {
        if (this.id) this._changeEditableField('description', description);
        else this.description = description;
    }

    @autobind
    @action
    setIsPublic(isPublic) {
        if (this.id) this._changeEditableField('isPublic', isPublic);
        else this.isPublic = isPublic;
    }

    @action
    setSections(sectionsData) {
        const firstSectionData = sectionsData[0];
        if (firstSectionData) {
            // set first section as invisible one
            const invisibleSection = new LearningPathSection(firstSectionData, this);
            invisibleSection.isVisible = false;
            this.invisibleSection = invisibleSection;
            if (this.isProPath) {
                this.extractAssessmentHighlight(sectionsData);
            }
            // fill visible sections starting from the first index
            this.sections = sectionsData.slice(1).map((sectionData) => {
                return new LearningPathSection(sectionData, this);
            });
        }
    }

    @action
    extractAssessmentHighlight(sectionsData) {
        let assessmentCount = 0;
        sectionsData.forEach((section) => {
            section.items.forEach((item) => {
                if (item.related_object_type === ASSESSMENT_CONTENT_TYPE) {
                    assessmentCount = (assessmentCount || 0) + 1;
                }
            });
        });

        if (assessmentCount !== 1) return;

        sectionsData.forEach((section) => {
            const itemToRemove = section.items.filter(
                (item) => item.related_object_type === ASSESSMENT_CONTENT_TYPE,
            );
            if (itemToRemove.length > 0) {
                this.assessmentToHighlight = itemToRemove[0].content;
            }
        });
    }

    @action
    setCompletedItems(completedItemIds) {
        completedItemIds = new Set(completedItemIds);
        this.sections.forEach((section) => {
            section.items.forEach((item) => {
                if (completedItemIds.has(item.id)) {
                    item.setIsCompleted(true);
                }
            });
        });
        // set completed items for invisible section
        this.invisibleSection.items.forEach((item) => {
            if (completedItemIds.has(item.id)) {
                item.setIsCompleted(true);
            }
        });
    }

    @action
    setNewFolderIdForPath(folderId) {
        return this.folderIds.push(folderId.id);
    }

    @action
    insertSectionFromData(position, sectionData) {
        // insert section in the given position, can be reused for drag&drop
        this.sections.splice(position, 0, new LearningPathSection(sectionData, this));
    }

    @action
    insertSectionsFromData(position, sectionsData) {
        // bulk insert sections
        const sections = sectionsData.map(
            (sectionsData) => new LearningPathSection(sectionsData, this),
        );
        this.sections.splice(position, 0, ...sections);
    }

    @action
    enrollUser() {
        this.isUserEnrolled = true;
        this.numberOfEnrollments += 1;
    }

    @action
    unenrollUser() {
        this.isUserEnrolled = false;
        this.numberOfEnrollments -= 1;
        this.isUserAutoEnrollDisabled = true;
    }

    @autobind
    async addEnrollmentToPath({
        isAutoEnrolled = false,
        pathEnrollmentSource = null,
        uiRegion = null,
    }) {
        try {
            await udApi.post(this.enrollmentsUrl, {is_auto_enroll: isAutoEnrolled});
            this.enrollUser();
            // Important analytics event!
            Tracker.publishEvent(
                new LearningPathEnrolled(
                    {
                        id: this.id,
                        isPublicLearningPath: this.isPublic,
                        isUdemyPath: this.isProPath,
                    },
                    pathEnrollmentSource,
                    isAutoEnrolled,
                    this.isUserEditor,
                    uiRegion,
                ),
            );
        } catch (e) {
            handleError(e, LEARNING_PATH_ERROR_MESSAGES.UNABLE_TO_ENROLL_USER);
        }
    }

    @autobind
    async removeEnrollmentFromPath() {
        try {
            await udApi.delete(this.enrollmentsUrl);
            this.unenrollUser();
            // Important analytics event!
            Tracker.publishEvent(
                new LearningPathUnenrolled(
                    {
                        id: this.id,
                        isPublicLearningPath: this.isPublic,
                        isUdemyPath: this.isProPath,
                    },
                    this.isUserEditor,
                ),
            );
        } catch (e) {
            handleError(e, LEARNING_PATH_ERROR_MESSAGES.UNABLE_TO_UNENROLL_USER);
        }
    }

    @computed
    get itemsCount() {
        let count = this.sections.reduce((acc, section) => {
            acc += section.itemsCount;
            return acc;
        }, 0);
        if (this.invisibleSection) {
            count += this.invisibleSection.itemsCount;
        }
        return count;
    }

    @computed
    get labsCount() {
        return this.sections.reduce((acc, section) => {
            acc += section.items.reduce((labsCount, item) => {
                if (item.type === LAB_CONTENT_TYPE) {
                    labsCount += 1;
                }
                return labsCount;
            }, 0);
            return acc;
        }, 0);
    }

    @computed
    get assessmentsCount() {
        return this.sections.reduce((acc, section) => {
            acc += section.items.reduce((labsCount, item) => {
                if (item.type === ASSESSMENT_CONTENT_TYPE) {
                    labsCount += 1;
                }
                return labsCount;
            }, 0);
            return acc;
        }, 0);
    }

    @computed
    get totalDuration() {
        let duration = this.sections.reduce((acc, section) => {
            if (section.totalDuration) {
                acc += section.totalDuration;
            }
            return acc;
        }, 0);
        if (this.invisibleSection) {
            duration += this.invisibleSection.totalDuration;
        }
        return duration;
    }

    @computed
    get removedItemsCount() {
        let count = this.sections.reduce((acc, section) => {
            acc += section.removedItemsCount;
            return acc;
        }, 0);
        if (this.invisibleSection) {
            count += this.invisibleSection.removedItemsCount;
        }
        return count;
    }

    @autobind
    async reorderSection(oldPosition, newPosition) {
        await udApi.post(`${this.sectionsUrl}${this.sections[oldPosition].id}/reorder/`, {
            // The index should start from 1 for API because of the invisible section
            position: newPosition + 1,
        });

        // MobX @action doesn't apply after await see: https://mobx.js.org/best/actions.html
        this._reorderObservableSections(oldPosition, newPosition);
        this.resetLocalEditTimestamp();
        // Important analytics event!
        Tracker.publishEvent(
            new LearningPathEdited({
                id: this.id,
                isPublicLearningPath: this.isPublic,
                isUdemyPath: this.isProPath,
            }),
        );
    }

    @autobind
    async moveSectionToUnsectionedArea(oldSectionPosition, positionInUnsectioned) {
        const oldSection = this.sections[oldSectionPosition];
        runInAction(() => {
            if (this.invisibleSection.items.length) {
                // Re-attach items if applicable
                this._moveItemsToNewSection(
                    this.invisibleSection,
                    oldSection,
                    positionInUnsectioned,
                );
            }
            // put moved section as the first one
            if (oldSectionPosition > 0) {
                this._reorderObservableSections(oldSectionPosition, 0);
            }
        });
        await udApi.post(`${this.sectionsUrl}${oldSection.id}/merge/`, {
            target_section_id: this.invisibleSection.id,
            position: positionInUnsectioned,
        });
        this.resetLocalEditTimestamp();
    }

    _moveItemsToNewSection(oldSection, newSection, startingIndex) {
        // Moves items starting from specified index from old to new section
        const itemsToMove = oldSection.items.splice(startingIndex);
        itemsToMove.forEach((item) => {
            item.learningPathSection = newSection;
            newSection.items.push(item);
        });
    }

    @action
    _reorderObservableSections(oldPosition, newPosition) {
        this.sections.splice(newPosition, 0, this.sections.splice(oldPosition, 1)[0]);
    }

    _getSectionByOrderIndex(index) {
        // Returns invisible section or section by its order number
        if (index === INVISIBLE_SECTION_KEY) {
            return this.invisibleSection;
        }
        return this.sections[index];
    }

    async reorderItem(oldPosition, newPosition, oldSectionIndex, newSectionIndex) {
        const data = {position: newPosition};
        const oldSection = this._getSectionByOrderIndex(oldSectionIndex);
        const newSection = this._getSectionByOrderIndex(newSectionIndex);
        const itemToMoveId = oldSection.items[oldPosition].id;
        if (oldSection.id !== newSection.id) {
            data.container = newSection.id;
        }

        this._reorderObservableItem(oldPosition, newPosition, oldSection, newSection);

        await udApi.post(
            `${this.sectionsUrl}${oldSection.id}/items/${itemToMoveId}/reorder/`,
            data,
        );
        this.resetLocalEditTimestamp();
        // Important analytics event!
        Tracker.publishEvent(
            new LearningPathEdited({
                id: this.id,
                isPublicLearningPath: this.isPublic,
                isUdemyPath: this.isProPath,
            }),
        );
    }

    async autoEnroll(pathEnrollmentSource = null) {
        if (!this.shouldAutoEnroll) {
            return false;
        }
        try {
            await this.addEnrollmentToPath({
                isAutoEnrolled: true,
                pathEnrollmentSource,
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    @action
    _reorderObservableItem(oldPosition, newPosition, oldSection, newSection) {
        const itemToMove = oldSection.items.splice(oldPosition, 1)[0];
        itemToMove.learningPathSection = newSection;
        newSection.items.splice(newPosition, 0, itemToMove);
    }

    @action
    _setCurriculumLoading(value) {
        this.isCurriculumLoading = value;
    }

    @action
    deleteSectionAt(index) {
        // move items to section above or to invisible section to make them unsectioned
        const previousSection = index > 0 ? this.sections[index - 1] : this.invisibleSection;
        if (previousSection) {
            previousSection.addItems(this.sections[index].items);
            this.sections.splice(index, 1);
        }
    }

    @autobind
    @action
    duplicate() {
        return new Promise((resolve, reject) => {
            udApi
                .post(this.duplicateUrl)
                .then((response) => {
                    this._openDuplicateConfirmationModal();
                    resolve(response);
                    return response;
                })
                .catch((error) => {
                    reject(error);
                    return error;
                });
        });
    }

    @action
    _openDuplicateConfirmationModal() {
        this.isDuplicateConfirmationModalOpen = true;
    }

    @autobind
    @action
    closeDuplicateConfirmationModal() {
        this.isDuplicateConfirmationModalOpen = false;
    }

    get isCopyItemEnabled() {
        // feature flag props use camel case
        // eslint-disable-next-line camelcase
        return getConfigData().features.organization?.learning_path?.copy_learning_path_item;
    }

    get isShareToSlackEnabled() {
        return this.isPublic && getConfigData().brand.is_share_on_slack_enabled;
    }

    get isRecommendEnabled() {
        return this.isPublic && UD.Config.brand.organization.is_recommend_enabled;
    }

    @action
    setNewEditors(editors, owner) {
        this.editors = editors;
        this.owner = owner;
    }

    @autobind
    async setPathEditorPermissions(isAdminJoinAsEditor = false, editorsUpdates = {}) {
        let params = {is_admin_join_as_editor: isAdminJoinAsEditor};
        if (!isAdminJoinAsEditor) {
            params = {
                added_editors_ids: editorsUpdates.added,
                removed_editors_ids: editorsUpdates.removed,
            };
            if (editorsUpdates.featured_editor) {
                params.featured_editor_id = editorsUpdates.featured_editor.id;
            }
        }
        const owner = editorsUpdates.featured_editor ? editorsUpdates.featured_editor : this.owner;
        try {
            const resp = await udApi.put(this.requestPermissionsUrl, params);
            if (resp.data && resp.data.results) {
                return this.setNewEditors(resp.data.results, owner);
            }
        } catch (e) {
            handleError(e, LEARNING_PATH_ERROR_MESSAGES.UNABLE_TO_UPDATE_PERMISSION);
        }
    }

    @autobind
    @action
    setIsHistoryLogLoading(isLoading) {
        this.isHistoryLogLoading = isLoading;
    }

    async fetchHistoryLog() {
        this.setIsHistoryLogLoading(true);
        this.setIsHistoryLogLoadingError(false);
        try {
            const response = await udApi.get(`${BASE_PATH}${this.id}/history-log/`);
            runInAction(() => {
                this.historyLogs = response.data.results;
            });
            this.setIsHistoryLogLoading(false);
        } catch (e) {
            this.setIsHistoryLogLoading(false);
            this.setIsHistoryLogLoadingError(true);
            handleError(e, LEARNING_PATH_ERROR_MESSAGES.UNABLE_TO_EDIT_HISTORY);
        }
    }

    @autobind
    @action
    async showHistoryLog() {
        this.isHistoryLogVisible = true;
        await this.fetchHistoryLog();
    }

    @autobind
    @action
    hideHistoryLog() {
        this.isHistoryLogVisible = false;
    }

    @autobind
    @action
    setIsHistoryLogLoadingError(value) {
        this.isHistoryLogLoadingError = value;
    }

    @autobind
    @action
    setLocalEditTimestamp(value) {
        this.localEditTimestamp = value;
    }

    @autobind
    @action
    resetLocalEditTimestamp() {
        this.localEditTimestamp = null;
    }

    async _executeUpdate() {
        await super._executeUpdate();
        // Important analytics event!
        Tracker.publishEvent(
            new LearningPathEdited({
                id: this.id,
                isPublicLearningPath: this.isPublic,
                isUdemyPath: this.isProPath,
            }),
        );
    }
}
