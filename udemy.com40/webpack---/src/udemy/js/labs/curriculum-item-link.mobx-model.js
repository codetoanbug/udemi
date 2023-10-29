import {observable} from 'mobx';

import {APIModel} from 'utils/mobx';

export default class CurriculumItemLink extends APIModel {
    @observable.ref lab = null;
    @observable courseHasLabId;
    @observable curriculumItemId;
    @observable curriculumItemType;
    @observable linkType = [];

    constructor(data, lab) {
        super(data);
        this.lab = lab;
    }

    get apiDataMap() {
        return {
            id: 'id',
            courseHasLabId: 'course_has_lab_id',
            curriculumItemId: 'curriculum_item_id',
            curriculumItemType: 'curriculum_item_type',
            linkType: 'link_type',
        };
    }
}
