import {Tracker} from '@udemy/event-tracking';
import {computed, observable} from 'mobx';

import {CourseManageActionEvent} from 'course-manage-v2/events';
import {Assignment, AssignmentCreated, Course} from 'course-manage-v2/events-v2';
import udApi, {parseError} from 'utils/ud-api';

import CurriculumItemModel from '../curriculum-item.mobx-model';

export default class CurriculumAssignmentModel extends CurriculumItemModel {
    @observable canOpenEditFormSection = false;

    @computed
    get editUrl() {
        return `/course/${this.course.id}/manage/practice/basic-info/?practice_id=${this.id}`;
    }

    delete() {
        return this._delete(`/practices/${this.id}/`);
    }

    static create(course, data) {
        const postData = {course: course.id, ...data};
        return udApi
            .post('/practices/', postData)
            .then((response) => {
                Tracker.publishEvent(
                    new CourseManageActionEvent({
                        courseId: course.id,
                        category: 'create_assignment',
                        action: 'create',
                        objectType: 'assignment',
                        objectId: response.data.id,
                    }),
                );
                // V2 Event
                const assignment = new Assignment(response.data.id, response.data.title);
                const courseEntity = new Course(course.id);
                Tracker.publishEvent(new AssignmentCreated({assignment, course: courseEntity}));
                return new CurriculumAssignmentModel({...response.data, course});
            })
            .catch((error) => {
                throw parseError(error);
            });
    }
}
