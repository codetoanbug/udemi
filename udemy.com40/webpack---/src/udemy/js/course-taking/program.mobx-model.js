import {APIModel} from 'utils/mobx';

import ProgramCourseContent from './program-course-content.mobx-model';

export default class Program extends APIModel {
    get apiDataMap() {
        return {
            ...super.apiDataMap,
            id: 'id',
            title: 'title',
            courses: {
                source: 'content_courses',
                map: (contentCourses) =>
                    contentCourses.map((course) => new ProgramCourseContent(course)),
                defaultValue: [],
            },
        };
    }
}
