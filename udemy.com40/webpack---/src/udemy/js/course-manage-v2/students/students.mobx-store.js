import {action, extendObservable, observable} from 'mobx';

import {showReloadPageErrorToast} from 'instructor/toasts';
import udApi, {defaultErrorMessage} from 'utils/ud-api';

export default class StudentsStore {
    @observable course = {};
    @observable studentsCourseInfoLoaded = false;

    @action
    getStudentsCourseInfo(courseId) {
        return udApi
            .get(`/courses/${courseId}/`, {
                params: {
                    'fields[course]': 'has_students,can_invite',
                },
            })
            .then(
                action((response) => {
                    extendObservable(this.course, {
                        id: response.data.id,
                        hasStudents: response.data.has_students,
                        canInvite: response.data.can_invite,
                    });
                    this.studentsCourseInfoLoaded = true;
                }),
            )
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }
}
