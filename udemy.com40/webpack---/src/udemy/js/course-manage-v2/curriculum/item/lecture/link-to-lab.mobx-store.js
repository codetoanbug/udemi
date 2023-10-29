import {action, observable, computed} from 'mobx';

import udApi from 'utils/ud-api';

import {LINK_TO_LAB_DEFAULT_ERROR, LINKABLE_LABS_URL} from './constants';

export default class LinkToLabStore {
    @observable activeLab;
    @observable labLink;
    @observable isLoading = false;
    @observable error = null;

    constructor(curriculumItemType, curriculumItemId, courseId) {
        this.curriculumItemType = curriculumItemType;
        this.curriculumItemId = curriculumItemId;
        this.courseId = courseId;
    }

    async loadActiveLab() {
        this._clearError();
        this._setIsLoading(true);
        try {
            const response = await udApi.get(LINKABLE_LABS_URL, {
                params: {
                    curriculum_item_type: this.curriculumItemType,
                    curriculum_item_id: this.curriculumItemId,
                    'fields[lab]': 'id,title',
                    active: true,
                    course_id: this.courseId,
                },
            });
            // Although it's possible that we could have multiple linkable labs returned, we just
            // grab the first one in here and use it as if it's not. In the future we will allow
            // the instructor to grab one of multiple, though, and this will have to change
            // accordingly.
            // Right now, we should only be returning a Lab that we manually associated with the
            // Instructor's Course.
            this._setActiveLab(response.data?.results?.[0]);
        } catch (error) {
            this._setError(error);
        } finally {
            this._setIsLoading(false);
        }
    }

    async loadLabLink() {
        // TODO: introduce lab parameter to remove temporal coupling with loadActiveLab method
        this._clearError();
        this._setIsLoading(true);
        try {
            const params = {
                curriculum_item_type: this.curriculumItemType,
                curriculum_item_id: this.curriculumItemId,
            };
            const response = await udApi.get(`labs/${this.activeLab.id}/links/`, {params});
            this._setLabLink(response.data.results[0]);
        } catch (error) {
            this._setError(error);
        } finally {
            this._setIsLoading(false);
        }
    }

    async loadLabInfo() {
        await this.loadActiveLab();
        await this.loadLabLink();
    }

    @computed
    get isLinked() {
        return !!this.labLink;
    }

    async linkToLab(objectTitle) {
        this._clearError();
        this._setIsLoading(true);
        try {
            const response = await udApi.post(`labs/${this.activeLab.id}/links/`, {
                title: objectTitle,
                curriculum_item_type: this.curriculumItemType,
                curriculum_item_id: this.curriculumItemId,
                course_id: this.courseId,
            });
            this._setLabLink(response.data);
        } catch (error) {
            this._setError(error);
        } finally {
            this._setIsLoading(false);
        }
    }

    async unlinkLab() {
        this._clearError();
        this._setIsLoading(true);
        try {
            await udApi.delete(`labs/${this.activeLab.id}/links/${this.labLink.id}`);
            this._setLabLink(null);
        } catch (error) {
            this._setError(error);
        } finally {
            this._setIsLoading(false);
        }
    }

    @computed
    get errorMsg() {
        return this.error?.detail || this.error?.response?.data || LINK_TO_LAB_DEFAULT_ERROR;
    }

    @action
    _setIsLoading(isLoading) {
        this.isLoading = isLoading;
    }

    @action
    _setActiveLab(lab) {
        this.activeLab = lab;
    }

    @action
    _setLabLink(labLink) {
        this.labLink = labLink;
    }

    @action
    _setError(error) {
        this.error = error;
    }

    @action
    _clearError() {
        this.error = null;
    }
}
