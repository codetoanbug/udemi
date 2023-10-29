import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {AutomatedReviewTest} from 'lab-manage/tasks/automated-review-tests/automated-review-test.mobx-model';
import {AutomatedReviewTestRun} from 'lab-taking/tasks/structured/automated-lab-review/automated-review-test-run.mobx-model';
import {
    RESOURCE_TYPE_ASSET,
    RESOURCE_TYPE_AZURE_RESOURCE,
    RESOURCE_TYPE_DOCUMENT,
    RESOURCE_TYPE_HOW_TO,
    RESOURCE_TYPE_SOLUTION_SOURCE_CODE,
} from 'labs/constants';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

import {labTasksApiUrl} from './apis';
import EditableApiModel from './editable-api-model.mobx-model';
import LabTaskResource from './lab-task-resource.mobx-model';

export default class LabTask extends EditableApiModel {
    @observable id;
    /** @type {Lab} lab */
    @observable.ref lab = null;
    @observable title;
    @observable challenge = '';
    @observable status;
    @observable resources = [];
    @observable hasAutomatedReviewTests = false;
    @observable automatedReviewTests = [];
    @observable automatedReviewTestRun;
    @observable viewMode = null;
    @observable isLoading = false;
    @observable isPanelExpanded = false;
    @observable shouldShowTaskReviewMessage = false;
    completionData = observable.map();

    constructor(data, lab) {
        super(data);
        this.lab = lab;
    }

    get apiDataMap() {
        return {
            id: 'id',
            title: 'title',
            challenge: 'challenge',
            status: 'status',
            resources: {
                source: 'resources',
                map: (resources) => {
                    return resources.map((resource) => new LabTaskResource(resource, this));
                },
            },
            hasAutomatedReviewTests: 'has_automated_review_tests',
            automatedReviewTests: {
                source: 'automated_review_tests',
                map: (automatedReviewTests) => {
                    return automatedReviewTests.map((test) => new AutomatedReviewTest(test, this));
                },
            },
            automatedReviewTestRun: {
                source: 'automated_review_test_run',
                map: (automatedReviewTestRun) => {
                    return new AutomatedReviewTestRun(automatedReviewTestRun);
                },
                defaultValue: new AutomatedReviewTestRun({}),
            },
        };
    }

    get editableFieldsMap() {
        return new Map([
            ['title', 'title'],
            ['challenge', 'challenge'],
        ]);
    }

    get resourceUrl() {
        return `${labTasksApiUrl(this.lab.id)}${this.id}/`;
    }

    get taskResourcesUrl() {
        return `${this.resourceUrl}resources/`;
    }

    get taskAutomatedReviewTestUrl() {
        return `${this.resourceUrl}automated-review-test/`;
    }

    @computed
    get isCompleted() {
        return !!this.lab.currentMode && this.completionData.has(this.lab.currentMode);
    }

    /*
        Resources per section
     */

    @computed
    get howTo() {
        return this.resources.filter((resource) => resource.type === RESOURCE_TYPE_HOW_TO);
    }

    @computed
    get howToWithSolutionCode() {
        // Pair how to with solution code for collapsible panels UI
        if (this.howTo.length) {
            return [
                {
                    article: this.howTo[0],
                    solutionCode: this.solutionCode.length ? this.solutionCode[0] : undefined,
                },
            ];
        }
        return [];
    }

    @computed
    get isHowToNotEmpty() {
        return this.howTo.length > 0 && this.howTo[0].asset.body !== '';
    }

    @computed
    get documentation() {
        return this.resources.filter((resource) => resource.type === RESOURCE_TYPE_DOCUMENT);
    }

    @computed
    get assets() {
        return this.resources.filter((resource) => resource.type === RESOURCE_TYPE_ASSET);
    }

    @computed
    get azureResources() {
        return this.resources.filter((resource) => resource.type === RESOURCE_TYPE_AZURE_RESOURCE);
    }

    @computed
    get solutionCode() {
        return this.resources.filter(
            (resource) => resource.type === RESOURCE_TYPE_SOLUTION_SOURCE_CODE,
        );
    }

    @computed
    get hasResources() {
        return this.resources.length > 0;
    }

    @computed
    get hasAssets() {
        return this.assets.length > 0 || this.documentation.length > 0;
    }

    @computed
    get isSavingInProgress() {
        return this.isSaving || this.resources.some((resource) => resource.isSaving);
    }

    @computed
    get isSavingError() {
        return this.apiError || this.resources.some((resource) => resource.apiError);
    }

    @action
    addCompletionData(mode, id) {
        this.completionData.set(mode, id);
    }

    @action
    removeCompletionData() {
        this.completionData.delete(this.lab.currentMode);
    }

    @action
    setIsLoading(value) {
        this.isLoading = value;
    }

    @autobind
    @action
    setPanelExpanded(expanded) {
        this.isPanelExpanded = expanded;
    }

    @action
    addResourceFromData(data) {
        this.resources.push(new LabTaskResource(data, this));
    }

    @autobind
    @action
    deleteResourceById(id) {
        const index = this.resources.findIndex((resource) => resource.id === id);
        index > -1 && this.resources.splice(index, 1);
    }

    @autobind
    @action
    deleteAutomatedReviewTestById(id) {
        const index = this.automatedReviewTests.findIndex((test) => test.id === id);
        index > -1 && this.automatedReviewTests.splice(index, 1);
    }

    async markAsComplete() {
        const {tasksCompletionUrl, currentMode} = this.lab;
        this.setIsLoading(true);
        try {
            const response = await udApi.post(tasksCompletionUrl, {
                lab_task_id: this.id,
                completion_mode: currentMode,
            });
            this.addCompletionData(currentMode, response.data.id);
        } catch (e) {
            Raven.captureException(e);
            throw e;
        } finally {
            this.setIsLoading(false);
        }
    }

    async resetCompletion() {
        const {tasksCompletionUrl, currentMode} = this.lab;
        const completionId = this.completionData.get(currentMode);
        this.setIsLoading(true);
        try {
            await udApi.delete(`${tasksCompletionUrl}${completionId}/`);
            this.removeCompletionData();
        } catch (e) {
            Raven.captureException(e);
            throw e;
        } finally {
            this.setIsLoading(false);
        }
    }

    async createAsset(assetId, type) {
        await this._createResource({
            type,
            asset: assetId,
        });
    }

    async createSolutionCode(assetId) {
        await this._createResource({type: RESOURCE_TYPE_SOLUTION_SOURCE_CODE, asset: assetId});
    }

    async createDocumentationLink() {
        await this._createResource({type: RESOURCE_TYPE_DOCUMENT});
    }

    async _createResource(data) {
        this._setSaving(true);
        try {
            const response = await udApi.post(this.taskResourcesUrl, data);
            this.addResourceFromData(response.data);
            this.lab?.setForceUnpublishedChanges(true);
        } catch (e) {
            Raven.captureException(e);
            throw e;
        } finally {
            this._setSaving(false);
        }
    }

    async createAutomatedReviewTestResource(data, uiMode) {
        this._setSaving(true);
        const numberItems = this.automatedReviewTests.length;

        try {
            data.position = numberItems + 1;
            const response = await udApi.post(this.taskAutomatedReviewTestUrl, data);
            this.addAutomatedReviewTestFromData(response.data, uiMode);
        } catch (e) {
            Raven.captureException(e);
            throw e;
        } finally {
            this._setSaving(false);
        }
    }

    async updateAutomatedReviewTestResource(automatedTestId, assetId, uiMode, testCodeSource) {
        this._setSaving(true);
        const url = `${this.taskAutomatedReviewTestUrl}${automatedTestId}/update-asset/`;
        try {
            const response = await udApi.patch(url, {
                assetId,
                automatedTestId,
                testCodeSource,
            });
            this.updateAutomatedReviewTest(response.data, uiMode);
        } catch (e) {
            Raven.captureException(e);
            throw e;
        } finally {
            this._setSaving(false);
        }
    }

    @action
    updateAutomatedReviewTest(data, uiMode) {
        const model = new AutomatedReviewTest(data, this);
        model.setUIMode(uiMode);
        const itemIndexToBeReplaced = this.automatedReviewTests.findIndex(
            (test) => test.id === model.id,
        );
        this.automatedReviewTests.splice(itemIndexToBeReplaced, 1, model);
    }

    @action
    addAutomatedReviewTestFromData(data, uiMode) {
        this.automatedReviewTests.push(new AutomatedReviewTest(data, this, uiMode));
    }

    @action
    setShouldShowTaskReviewMessage(value) {
        this.shouldShowTaskReviewMessage = value;
    }

    _finishSaving() {
        super._finishSaving();
        this.lab?.setForceUnpublishedChanges(true);
    }
}
