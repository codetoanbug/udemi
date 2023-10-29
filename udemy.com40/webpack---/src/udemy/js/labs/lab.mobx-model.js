import {ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {action, computed, observable, reaction} from 'mobx';

import {
    ERROR_NOTIFICATION_PROPS,
    FULL_AND_ADMIN_LAB_ACCESS_LEVELS,
    LAB_INSTANCE_STATUS,
    LAB_MODE,
    LAB_STATUS,
    LAB_VERTICAL,
    LABS_MODULAR_URL_PATTERN,
    NEW_TASK_REVIEW_MESSAGES,
    NOTIFICATION_OPTIONS,
    RESOURCE_TYPE_INITIAL_SOURCE_CODE,
    SUCCESS_NOTIFICATION_PROPS,
    TASK_REVIEW_MESSAGES,
} from 'labs/constants';
import Instructor from 'labs/instructor.mobx-model';
import debounce from 'utils/debounce';
import udApi from 'utils/ud-api';
import udMe from 'utils/ud-me';
import Raven from 'utils/ud-raven';

import {LAB_INSTRUCTOR_PERMISSIONS} from '../lab-manage/constants';
import {
    labBaseApiUrl,
    labTasksApiUrl,
    labSubmitForReviewUrl,
    validateLabDataUrl,
    publishLabApiUrl,
} from './apis';
import Course from './course.mobx-model';
import CurriculumItemLink from './curriculum-item-link.mobx-model';
import EditableApiModel from './editable-api-model.mobx-model';
import {InstructorHasLabModel} from './instructor-has-lab.mobx-model.ts';
import LabGoals from './lab-goals.mobx-model';
import LabHasUser from './lab-has-user.mobx-model';
import LabInstance from './lab-instance.mobx-model';
import LabResource from './lab-resource.mobx-model';
import LabTask from './lab-task.mobx-model';
import {checkLabVersioningLabManageExperimentEnabled, checkUserLabAccessLevel} from './utils';

export const isLabVerticalInBeta = (vertical) => {
    // currently, all GCP and security labs are in a beta - 2023-03-03
    return [LAB_VERTICAL.gcp.key, LAB_VERTICAL.security.key].includes(vertical);
};

export default class Lab extends EditableApiModel {
    @observable id;
    @observable title;
    @observable labId;
    @observable tasks = [];
    /** @type {number|null} activeTaskNumber */
    @observable activeTaskNumber = null;
    @observable isLoading = false;
    @observable labOverview;
    @observable challengeOverview;
    @observable projectOverview;
    @observable minEstimatedTime = 0;
    @observable maxEstimatedTime = 0;
    @observable provider;
    @observable vertical;
    @observable template;
    @observable status;
    @observable initialCode;

    /** @type {string} labType */
    @observable labType;
    // Note: myLatestInstance should be a LabInstance type, but needs proper TS interface
    /** @type {AnyObject|null} myLatestInstance */
    @observable myLatestInstance = null;
    @observable owner;
    // Note: enrollment should be a LabHasUser type, but needs proper TS interface
    /** @type {AnyObject|null} enrollment */
    @observable enrollment = null;
    @observable assignment = null;
    /** @type {LabGoals} labGoals */
    @observable labGoals = null;
    @observable isEditMode = false;
    @observable workspaceEnabledLectures = [];
    /** @type {LabReviewErrorData} reviewError */
    @observable reviewError = null;
    @observable isLaunchDisabled = false;
    @observable labTakingUrl;
    /** @type {InstructorHasLabModel} instructorHasLab */
    @observable instructorHasLab = null;
    /** @type {LabInstructorApiData[]} visibleInstructors */
    @observable visibleInstructors = [];
    @observable topics = [];

    /** @type {String | null} titleAutoslug */
    @observable titleAutoslug = null;
    // @type {services?: {name: string, kind: string}[]}
    @observable spec;
    /** @type {String | null} specName */
    @observable specName = null;
    /** @type {number} numberOfClicksReviewButton */
    @observable numberOfClicksReviewButton = 0;

    /** @type {ItemsFieldApiData | null} what you will do */
    @observable whatYouWillDo = null;

    /** @type {ItemsFieldApiData | null} what you will learn */
    @observable whatYouWillLearn = null;

    /** @type {ItemsFieldApiData | null} requirements */
    @observable requirements = null;

    /** @type {Course | null} course */
    @observable.ref course = null;

    @observable lastReleased;

    @observable contentModified;

    @observable isPublishing = false;

    /** @type {String | null} version */
    @observable version = null;

    @observable forceUnpublishedChanges = false;

    get apiDataMap() {
        return {
            id: 'id',
            title: 'title',
            description: 'description',
            projectOverview: 'project_overview',
            labOverview: 'lab_overview',
            challengeOverview: 'challenge_overview',
            minEstimatedTime: 'min_estimated_time',
            maxEstimatedTime: 'max_estimated_time',
            whatYouWillDo: 'what_you_will_do',
            whatYouWillLearn: 'what_you_will_learn',
            requirements: 'requirements',
            setupStartLectureId: 'setup_start_lecture_id',
            postSetupLectureId: 'post_setup_lecture_id',
            labTakingUrl: 'url',
            vertical: {
                source: 'vertical',
                defaultValue: null,
            },
            provider: 'provider',
            labType: 'lab_type',
            status: 'status',
            template: {
                source: 'template',
                defaultValue: null,
            },
            spec: 'spec',
            specName: 'spec_name',
            hasSso: 'has_sso',
            isLaunchDisabled: 'is_launch_disabled',
            titleAutoslug: 'title_autoslug',
            lastReleased: 'last_released',
            contentModified: 'content_modified',
            course: {
                source: 'course',
                map: (course) => {
                    if (course) {
                        return new Course(course);
                    }
                },
                defaultValue: null,
            },
            myLatestInstance: {
                source: 'my_latest_instance',
                map: (instanceData) => {
                    if (instanceData) {
                        this.setLabInstanceFromData(instanceData);
                    }
                },
                defaultValue: null,
            },
            instructorHasLab: {
                source: 'instructor_has_lab',
                map: (data) => {
                    if (data) {
                        this.setInstructorHasLabFromData(data);
                    }
                },
                defaultValue: null,
            },
            visibleInstructors: {
                source: 'visible_instructors',
                map: (data) => {
                    if (data) {
                        this.setVisibleInstructors(data);
                    }
                },
                defaultValue: [],
            },
            tasks: {
                source: 'tasks',
                map: (tasksData) => {
                    this.addTasksFromData(tasksData);
                },
                defaultValue: [],
            },
            enrollment: {
                source: 'enrollment',
                map: (enrollmentData) => {
                    if (enrollmentData) {
                        return new LabHasUser(enrollmentData, this);
                    }
                },
            },
            assignment: {source: 'assignment', defaultValue: null},
            owner: {
                source: 'owner',
                map: (owner) => {
                    return new Instructor(owner);
                },
                defaultValue: null,
            },
            // lab goals required for editor
            labGoals: {
                source: ['what_you_will_do', 'what_you_will_learn', 'requirements'],
                map: (whatYouWillDo, whatYouWillLearn, requirements) => {
                    if (!this.labGoals) {
                        return new LabGoals({whatYouWillDo, whatYouWillLearn, requirements});
                    }
                },
                defaultValue: null,
            },
            initialCode: {
                source: 'initial_source_code',
                map: (initialCode) => {
                    if (initialCode) {
                        return this._setInitialCodeFromData(initialCode);
                    }
                },
                defaultValue: null,
            },
            topics: {
                source: 'topics',
                defaultValue: [],
            },
        };
    }

    get editableFieldsMap() {
        return new Map([
            ['title', 'title'],
            ['description', 'description'],
            ['projectOverview', 'project_overview'],
            ['challengeOverview', 'challenge_overview'],
            ['labOverview', 'lab_overview'],
            ['minEstimatedTime', 'min_estimated_time'],
            ['maxEstimatedTime', 'max_estimated_time'],
            ['vertical', 'vertical'],
            ['template', 'template'],
            ['course', 'course'],
            ['labType', 'lab_type'],
        ]);
    }

    /**
     * Construtor for lab model
     * @param apiData
     * @param globalOverrides is optional. This was added when refactoring lab-unit to use ud-data-provider package,
     * but is optional and falls back to global udMe to keep the PR to browse components only.
     * This should change to required when we refactor labs to use ud-data-provider package.
     */
    constructor(apiData, globalOverrides = {}) {
        super(apiData);
        reaction(
            () => this.areTasksCompleted,
            () => {
                this.enrollment && this.enrollment?.setIsCompleted(this.areTasksCompleted);
            },
        );
        reaction(
            () => this.labGoals?.isDirty,
            () => {
                this.labGoals?.isDirty && this._onLabGoalsChange();
            },
        );

        this.me = globalOverrides.me ?? udMe;
    }

    get resourceUrl() {
        return labBaseApiUrl(this.id);
    }

    get resourcesUrl() {
        return `${this.resourceUrl}resources/`;
    }

    @computed
    get isInReview() {
        return this.status === LAB_STATUS.in_review;
    }

    @computed
    get isDraft() {
        return this.status === LAB_STATUS.draft;
    }

    @computed
    get isPublished() {
        return this.status === LAB_STATUS.published;
    }

    @computed
    get isBeta() {
        return isLabVerticalInBeta(this.vertical);
    }

    @computed
    get currentMode() {
        return this.enrollment?.lastAttemptedMode || null;
    }

    @computed
    get url() {
        if (this.isEditMode) {
            return `${LABS_MODULAR_URL_PATTERN}${this.id}/manage/`;
        }
        if (this.labTakingUrl) {
            return this.labTakingUrl;
        }
        return `${LABS_MODULAR_URL_PATTERN}${this.id}/`;
    }

    @computed
    get assetsUrl() {
        return `${this.resourceUrl}assets/`;
    }

    @computed
    get firstTaskUrl() {
        return `${this.url}tasks/1/`;
    }

    @computed
    get overviewUrl() {
        return `${this.url}overview/`;
    }

    @computed
    get projectOverviewUrl() {
        return `${this.url}project-overview/`;
    }

    @computed
    get tasksCompletionUrl() {
        return `${labBaseApiUrl(this.id)}completed-tasks/`;
    }

    @computed
    get publishUrl() {
        return `${this.url}publish/`;
    }

    @computed
    get labCompletionUrl() {
        return `${this.enrollPageUrl}${this.enrollment.id}/`;
    }

    @computed
    get instructorSettingsUrl() {
        return `${this.url}settings/`;
    }

    @computed
    get verticalLabel() {
        if (
            (this.vertical === LAB_VERTICAL.web.key || this.vertical === LAB_VERTICAL.devops.key) &&
            this.specName
        ) {
            return this.specName;
        }
        return LAB_VERTICAL[this.vertical]?.label;
    }

    @computed
    get activeTask() {
        if (this.activeTaskNumber) {
            return this.tasks[this.activeTaskNumber - 1];
        }
        return null;
    }

    @computed
    get firstIncompleteTaskNumber() {
        const index = this.tasks.map((task) => task.isCompleted).indexOf(false);
        return index + 1;
    }

    @computed
    get previousTasks() {
        // Tasks prior to the active one in reversed order
        if (this.activeTaskNumber && this.activeTaskNumber > 1) {
            return this.tasks.slice(0, this.activeTaskNumber - 1).reverse();
        }
        return [];
    }

    @computed
    get isPreviousResourcesPanelVisible() {
        return this.prevTaskPageUrl && this.previousTasks.some((task) => task.hasResources);
    }

    @computed
    get tasksPageUrl() {
        return `${this.url}tasks/`;
    }

    @computed
    get resourcesPageUrl() {
        return `${this.url}resources/`;
    }

    @computed
    get nextTaskPageUrl() {
        if (this.activeTaskNumber && this.activeTaskNumber < this.tasks.length) {
            return `${this.tasksPageUrl}${this.activeTaskNumber + 1}/`;
        }
        return null;
    }

    @computed
    get prevTaskPageUrl() {
        if (this.activeTaskNumber && this.activeTaskNumber > 1) {
            return `${this.tasksPageUrl}${this.activeTaskNumber - 1}/`;
        }
        return null;
    }

    @computed
    get lastActiveTaskPageUrl() {
        if (this.activeTaskNumber) {
            return `${this.tasksPageUrl}${this.activeTaskNumber}/`;
        }
        if (this.firstIncompleteTaskNumber) {
            return `${this.tasksPageUrl}${this.firstIncompleteTaskNumber}/`;
        }
        return this.firstTaskUrl;
    }

    @computed
    get enrollPageUrl() {
        return `${labBaseApiUrl(this.id)}enroll/`;
    }

    @computed
    get continueLabPageUrl() {
        if (this.currentMode === LAB_MODE.STRUCTURED) {
            // Student has started structured mode
            return this.lastActiveTaskPageUrl;
        }
        if (this.currentMode === LAB_MODE.FOLLOW_ALONG) {
            // Student has started follow along mode
            return this.tasksPageUrl;
        }
        return this.projectOverviewUrl;
    }

    @computed
    get completedTasksNumber() {
        return this.tasks.filter((task) => task.isCompleted).length;
    }

    @computed
    get shouldRedirectFromTasks() {
        return this.activeTaskNumber !== null && !this.activeTask;
    }

    @computed
    get activeTaskReviewMessage() {
        if (!this.activeTaskNumber) {
            return null;
        }
        if (this.activeTaskNumber === 1) {
            return TASK_REVIEW_MESSAGES.first;
        }
        if (this.activeTaskNumber === 2) {
            return TASK_REVIEW_MESSAGES.second;
        }
        if (this.activeTaskNumber === this.tasks.length) {
            return TASK_REVIEW_MESSAGES.last;
        }
        // Message pool loop:
        // Task#3 should have first message from the pool, task#13 also gets the first one
        const indexInPool = (this.activeTaskNumber - 1 - 2) % TASK_REVIEW_MESSAGES.pool.length;
        return TASK_REVIEW_MESSAGES.pool[indexInPool];
    }

    @computed
    get newActiveTaskReviewMessage() {
        if (!this.activeTaskNumber) {
            return null;
        }
        if (this.activeTaskNumber === 1) {
            return NEW_TASK_REVIEW_MESSAGES.first;
        }
        if (this.activeTaskNumber === 2) {
            return NEW_TASK_REVIEW_MESSAGES.second;
        }
        if (this.activeTaskNumber === this.tasks.length - 1) {
            return NEW_TASK_REVIEW_MESSAGES.penultimate;
        }
        if (this.activeTaskNumber === this.tasks.length) {
            return NEW_TASK_REVIEW_MESSAGES.last;
        }
        // Message pool loop:
        // From Task #3 to before the penultimate, we display random messages from the pool
        return NEW_TASK_REVIEW_MESSAGES.pool[
            Math.floor(Math.random() * NEW_TASK_REVIEW_MESSAGES.pool.length)
        ];
    }

    @computed
    get isCompleted() {
        return !!this.enrollment?.isCompleted;
    }

    @computed
    get areTasksCompleted() {
        return this.tasks.length === this.completedTasksNumber;
    }

    @computed
    get hasRunningInstance() {
        return this.myLatestInstance?.status === LAB_INSTANCE_STATUS.running;
    }

    @computed
    get hasPausedInstance() {
        return [LAB_INSTANCE_STATUS.stopped, LAB_INSTANCE_STATUS.stopping].includes(
            this.myLatestInstance?.status,
        );
    }

    @computed
    get hasRunningOrPausedInstance() {
        return this.hasRunningInstance || this.hasPausedInstance;
    }

    @computed
    get isSavingInProgress() {
        return this.isSaving || this.tasks.some((task) => task.isSavingInProgress);
    }

    @computed
    get isPublishingInProgress() {
        return this.isPublishing;
    }

    @computed
    get isOperationInProgress() {
        return this.isSavingInProgress || this.isPublishingInProgress;
    }

    @computed
    get isSavingError() {
        return this.apiError || this.tasks.some((task) => task.isSavingError);
    }

    @computed
    get hasUnsavedChanges() {
        return Object.keys(this.changedData).length > 0 || this.labGoals?.isDirty;
    }

    @computed
    get canPublish() {
        const userHasSpecialAccess = checkUserLabAccessLevel(FULL_AND_ADMIN_LAB_ACCESS_LEVELS);
        const userHasPermissions =
            this.instructorHasLab &&
            this.instructorHasLab.isOwner &&
            this.instructorHasLab.hasPermission(LAB_INSTRUCTOR_PERMISSIONS.EDIT_PUBLISHED);
        return (
            checkLabVersioningLabManageExperimentEnabled() &&
            this.status === LAB_STATUS.published && // publish UI is only enabled when publishing edits to an already published lab
            (userHasSpecialAccess || userHasPermissions)
        );
    }

    @computed
    get formErrors() {
        // form errors may happen for either draft or published lab edit
        const errors = {};
        if (this.validationErrors?.min_estimated_time || this.reviewError?.min_estimated_time) {
            errors.min_estimated_time = gettext('Please enter a number between 45 and 180');
        }
        if (this.validationErrors?.max_estimated_time || this.reviewError?.max_estimated_time) {
            errors.max_estimated_time = gettext('Please enter a number between 45 and 180');
        }
        if (
            this.validationErrors?.min_max_estimated_time ||
            this.reviewError?.min_max_estimated_time
        ) {
            errors.max_estimated_time = gettext(
                'Max estimated time should be greater than min estimated time',
            );
        }
        return errors;
    }

    @computed
    get hasAutomatedReviewTests() {
        return this.tasks?.length > 0 && this.tasks.some((task) => task.hasAutomatedReviewTests);
    }

    @action addTasksFromData(data) {
        const tasks = data.map((item) => new LabTask(item, this));
        this.tasks.push(...tasks);
    }

    @action
    setActiveTaskNumber(index) {
        this.activeTaskNumber = index;
    }

    @action
    setIsLoading(value) {
        this.isLoading = value;
    }

    @action
    setStatus(value) {
        this.status = value;
    }

    @action
    setEnrollmentFromData(data) {
        if (!this.enrollment) {
            this.enrollment = new LabHasUser(data, this);
        } else {
            this.enrollment.setDataFromAPI(data);
        }
    }

    @action
    setLabInstanceFromData(data) {
        if (!this.myLatestInstance) {
            this.myLatestInstance = new LabInstance(data, this);
        } else {
            this.myLatestInstance.setDataFromAPI(data);
        }
    }

    @action
    setInstructorHasLabFromData(data) {
        if (!this.instructorHasLab) {
            this.instructorHasLab = new InstructorHasLabModel(data);
        } else {
            this.instructorHasLab.setDataFromAPI(data);
        }
    }

    @action
    setVisibleInstructors(data) {
        const instructors = data.map((dataItem) => new Instructor(dataItem));
        this.visibleInstructors.push(...instructors);
    }

    get isStudent() {
        return this.me.organization.isStudent;
    }

    @computed
    get isAssigned() {
        return this.assignment !== null;
    }

    @computed
    get assignmentDueDate() {
        return this.assignment?.due_date;
    }

    @action
    setVerticalAndTemplateFields(vertical, template) {
        this.formData.vertical = vertical;
        this.formData.template = template;
    }

    setEditMode() {
        this.isEditMode = true;
    }

    setWorkspaceEnabledLectures(links) {
        const labLectures = links
            .map((link) => new CurriculumItemLink(link, this))
            .map((link) => link.curriculumItemId);
        this.workspaceEnabledLectures.push(...labLectures);
    }

    @action
    setVersion(version) {
        this.version = version;
    }

    @action
    setLastReleased(value) {
        this.lastReleased = value;
    }

    @action
    setContentModified(value) {
        this.contentModified = value;
    }

    @action
    setIsPublishing(value) {
        this.isPublishing = value;
    }

    _onLabGoalsChange() {
        if (this.reviewError) {
            delete this.reviewError.what_you_will_learn;
            delete this.reviewError.what_you_will_do;
            delete this.validationErrors.what_you_will_learn;
            delete this.validationErrors.what_you_will_do;
        }
        this._autoSave();
    }

    // Overwrite autoSave logic to count labGoals fields in

    @autobind
    _autoSave() {
        if (this.hasUnsavedChanges) {
            this._setSaving(true);
            if (this.debouncedAutoSave) {
                this.debouncedAutoSave.cancel();
            }
            this.debouncedAutoSave = debounce(this._partialUpdate, this.autoSaveInterval);
            this.debouncedAutoSave();
        }
    }

    async _executeUpdate() {
        let data = this.changedData;
        if (this.labGoals?.isDirty) {
            data = {...this.changedData, ...this.labGoals.prepareFormData()};
        }
        const {version} = this;
        if (version !== null) {
            data = {...data, version};
        }
        const response = await udApi.patch(this.resourceUrl, data);
        this.setDataFromAPI(response.data);
        this.labGoals?.setDirty(false);
    }

    async createTask() {
        this._setSaving(true);
        try {
            const response = await udApi.post(labTasksApiUrl(this.id), {});
            this.insertTaskFromData(response.data);
            this.setForceUnpublishedChanges(true);
        } catch (e) {
            Raven.captureException(e);
            throw e;
        } finally {
            this._setSaving(false);
        }
    }

    @autobind
    async validateLabData() {
        this._setReviewError(null);

        try {
            await udApi.post(validateLabDataUrl(this.id), {});
        } catch (e) {
            const errorData = e?.response?.data;
            if (errorData) {
                this._setReviewError(errorData);
            }
            throw new Error('Validation failed');
        }
    }

    @autobind
    async submitForReview() {
        this._setSaving(true);

        try {
            await udApi.post(labSubmitForReviewUrl(this.id), {});
            this.setStatus(LAB_STATUS.in_review);
        } catch (e) {
            const errorData = e?.response?.data;
            if (errorData) {
                toasterStore.addAlertBannerToast(
                    {
                        ...ERROR_NOTIFICATION_PROPS,
                        title: gettext('Validation failed'),
                    },
                    NOTIFICATION_OPTIONS,
                );
            }
            throw new Error('Validation failed');
        } finally {
            this._setSaving(false);
        }
    }

    @autobind
    @action
    async publish() {
        if (!this.canPublish) {
            this._onPublishFailed(gettext('Cannot publish this lab.'));
            return;
        }
        if (this.isSavingInProgress) {
            this._onPublishFailed(gettext('Cannot publish while saving.'));
            return;
        }
        if (this.isPublishingInProgress) {
            this._onPublishFailed(gettext('Cannot publish while publishing.'));
            return;
        }
        if (this.isOperationInProgress) {
            this._onPublishFailed(
                gettext('Cannot publish while another operation is in progress.'),
            );
            return;
        }
        this.setIsPublishing(true);
        try {
            const response = await udApi.post(publishLabApiUrl(this.id));
            this.setLastReleased(response.data.last_released);
            this.setContentModified(response.data.content_modified);
            this.setForceUnpublishedChanges(false);
        } catch (e) {
            this._onPublishFailed(e.message);
            throw e;
        } finally {
            this.setIsPublishing(false);
        }
        toasterStore.addAlertBannerToast(
            {
                ...SUCCESS_NOTIFICATION_PROPS,
                title: gettext('Lab successfully published.'),
            },
            NOTIFICATION_OPTIONS,
        );
    }

    _onPublishFailed(message) {
        const title = interpolate(gettext('Publish failed: %(message)s'), {message}, true);
        toasterStore.addAlertBannerToast(
            {
                ...ERROR_NOTIFICATION_PROPS,
                title,
            },
            NOTIFICATION_OPTIONS,
        );
    }

    @action
    insertTaskFromData(data) {
        this.tasks.push(new LabTask(data, this));
    }

    @autobind
    @action
    deleteTaskAt(index) {
        this.tasks.splice(index, 1);
    }

    @action
    _setReviewError(error) {
        this.reviewError = error;
    }

    @autobind
    @action
    setFormField(name, value) {
        if (this.reviewError && this.editableFieldsMap.has(name)) {
            delete this.reviewError[this.editableFieldsMap.get(name)];
        }
        return super.setFormField(name, value);
    }

    @action
    _setInitialCodeFromData(data) {
        this.initialCode = data ? new LabResource(data, this) : null;
    }

    @autobind
    async deleteInitialSourceCode() {
        await this.initialCode?.delete();
        this._setInitialCodeFromData(null);
    }

    async createInitialCodeResource(assetId) {
        this._setSaving(true);
        try {
            const response = await udApi.post(this.resourcesUrl, {
                type: RESOURCE_TYPE_INITIAL_SOURCE_CODE,
                asset: assetId,
            });
            this._setInitialCodeFromData(response.data);
        } catch (e) {
            Raven.captureException(e);
            throw e;
        } finally {
            this._setSaving(false);
        }
    }

    async reorderTask(oldPosition, newPosition) {
        this._setSaving(true);
        try {
            await udApi.post(`${labTasksApiUrl(this.id)}${this.tasks[oldPosition].id}/reorder/`, {
                position: newPosition,
            });
            this._reorderTasks(oldPosition, newPosition);
        } catch (e) {
            Raven.captureException(e);
        } finally {
            this._setSaving(false);
        }
    }

    @action
    _reorderTasks(oldPosition, newPosition) {
        this.tasks.splice(newPosition, 0, this.tasks.splice(oldPosition, 1)[0]);
    }

    @action
    setNumberOfClicksReviewButton() {
        this.numberOfClicksReviewButton += 1;
    }

    @action
    resetLabResults() {
        this.tasks?.forEach((task) => {
            if (task.automatedReviewTestRun) {
                task.automatedReviewTestRun.setResults([]);
                task.automatedReviewTestRun.numberOfAttempts = 0;
            }
            task.setShouldShowTaskReviewMessage(false);
            this.numberOfClicksReviewButton = 0;
            task.setPanelExpanded(false);
            task.removeCompletionData();
            this.setActiveTaskNumber(1);
        });
    }

    @computed
    get hasUnpublishedChanges() {
        if (!this.isPublished) {
            return false;
        }
        if (this.forceUnpublishedChanges) {
            return true;
        }
        const theLastReleasedDate = this.lastReleasedDate;
        if (!theLastReleasedDate) {
            return false;
        }
        const theContentModifiedDate = this.contentModifiedDate;
        if (!theContentModifiedDate) {
            return false;
        }

        return theLastReleasedDate.valueOf() !== theContentModifiedDate.valueOf();
    }

    @computed
    get lastReleasedDate() {
        if (!this.isPublished) {
            return null;
        }
        if (!this.lastReleased) {
            return null;
        }
        return new Date(this.lastReleased);
    }

    @computed
    get contentModifiedDate() {
        if (!this.isPublished) {
            return null;
        }
        if (!this.contentModified) {
            return null;
        }
        return new Date(this.contentModified);
    }

    @action
    setForceUnpublishedChanges(value) {
        this.forceUnpublishedChanges = value;
    }
}
