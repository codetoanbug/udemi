import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import {TAUGHT_COURSES_URL} from 'instructor/constants';
import {LAB_EDIT_INSTRUCTOR_API_PARAMS, labBaseApiUrl, LABS_BASE_API_URL} from 'labs/apis';
import {LAB_TYPE} from 'labs/constants';
import Lab from 'labs/lab.mobx-model';
import udApi, {TIMEOUT} from 'utils/ud-api';

export default class LabWorkspaceEditorStore {
    @observable form = {};
    @observable isModalOpen = false;
    @observable lab = null;
    @observable courses = [];

    constructor() {
        this.clearForm();
    }

    @action setIsModalOpen(isOpen) {
        this.isModalOpen = isOpen;
    }

    @action setLab(lab) {
        this.lab = lab;
    }

    @autobind
    async loadLabTemplates(vertical) {
        const response = await udApi.get(LABS_BASE_API_URL, {
            params: {vertical, lab_type: LAB_TYPE.workspace.key, is_template: 1},
        });

        if (response.data.results?.length) {
            this._setTemplates(response.data.results);
        }
    }

    @autobind
    async loadInstructorCourses() {
        const params = {
            'fields[course]': 'id,title',
            ordering: '-published_time',
        };

        const response = await udApi.get(TAUGHT_COURSES_URL, {
            useCache: true,
            params,
            timeout: TIMEOUT,
        });
        if (response.data?.results?.length > 0) {
            this._setCourses(response.data.results);
        }
    }

    async openModalForLab(labId) {
        await this.loadLab(labId);

        await this.loadLabTemplates(this.lab.vertical);

        this.setIsModalOpen(true);
    }

    @autobind
    async loadLab(labId) {
        const response = await udApi.get(labBaseApiUrl(labId), {
            params: {
                'fields[lab]': LAB_EDIT_INSTRUCTOR_API_PARAMS,
                version: 'head',
            },
        });
        return this.setLab(new Lab(response.data));
    }

    @action clearForm() {
        this.templates = [];
        this.lab = null;
    }

    @action _setTemplates(templates) {
        this.templates = templates;
    }

    @action _setCourses(courses) {
        this.courses = courses;
    }
}
