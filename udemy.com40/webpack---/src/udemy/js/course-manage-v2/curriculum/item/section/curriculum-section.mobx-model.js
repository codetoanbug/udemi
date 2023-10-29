import {action, computed, observable} from 'mobx';

import udApi, {parseError} from 'utils/ud-api';

import {
    chapterFilterParams,
    chapterFilterParamsWithGTAssignments,
    curriculumItemTypes,
} from '../constants';
import CurriculumItemModel from '../curriculum-item.mobx-model';

export default class CurriculumSectionModel extends CurriculumItemModel {
    /**
     * These are the curriculum items in this section. A section cannot contain another section.
     * The items are manipulated by actions in CurriculumEditorStore.
     */
    @observable items = [];
    @observable gtAssignmentsV2 = [];

    static create(course, data, isCurriculumEditorSectionTopicsEnabled = false) {
        const chapterParams = isCurriculumEditorSectionTopicsEnabled
            ? chapterFilterParamsWithGTAssignments
            : chapterFilterParams;

        return udApi
            .post(`/users/me/taught-courses/${course.id}/chapters/`, data, {
                params: {'fields[chapter]': chapterParams.join(',')},
            })
            .then((response) => {
                return new CurriculumSectionModel({...response.data, course});
            })
            .catch((error) => {
                throw parseError(error);
            });
    }

    static createFake() {
        return new CurriculumSectionModel({
            _class: curriculumItemTypes.section,
            id: 0,
            title: '',
        });
    }

    get isFake() {
        return this.id === 0;
    }

    /**
     * Unlike other curriculum items, sections do not have an is_published field in the database.
     * Instead, a section is published iff at least one of its items is published.
     * The Django Chapter model does have an is_published property which returns
     * bool(self.object_index), but that exists so that other places on the site
     * (e.g. course taking) can derive the is_published value set by the curriculum editor.
     * In other words, the curriculum editor makes sure the object_index of a section
     * is always zero iff it is unpublished, and therefore course taking can
     * rely on Chapter.is_published without repeating the
     * "is published iff at least one of its items is published" computation.
     */
    @computed
    // eslint-disable-next-line camelcase
    get is_published() {
        return this.items.some((item) => item.is_published);
    }

    partialUpdate(data) {
        return this._partialUpdate(
            `/users/me/taught-courses/${this.course.id}/chapters/${this.id}/`,
            data,
            Object.keys(data),
        );
    }

    @action
    async fetchTopicAssignments() {
        return udApi.get(`/users/me/taught-courses/${this.course.id}/chapters/${this.id}/`, {
            params: {'fields[chapter]': 'gt_assignments_v2'},
        });
    }

    @action
    removeGtAssignmentsV2(id) {
        this.gtAssignmentsV2 = this.gtAssignmentsV2.filter(
            (assignment) => assignment.gt_instance.id !== id,
        );
    }

    @action
    addGtAssignmentsV2(id, defaultName) {
        this.gtAssignmentsV2.push({gt_instance: {id, default_name: defaultName}});
    }

    delete() {
        return this._delete(`/users/me/taught-courses/${this.course.id}/chapters/${this.id}/`);
    }
}
