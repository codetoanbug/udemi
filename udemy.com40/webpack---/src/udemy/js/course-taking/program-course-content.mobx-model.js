import {APIModel} from 'utils/mobx';

export default class ProgramCourseContent extends APIModel {
    get apiDataMap() {
        return {
            ...super.apiDataMap,
            id: 'id',
            title: 'title',
            url: 'url',
            isPracticeTest: 'is_practice_test_course',
        };
    }
}
