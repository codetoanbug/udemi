import {action, computed, observable, runInAction} from 'mobx';

import {PERMISSION_CODES} from 'instructor/common/constants';

export default class FeaturedQuestionsStore {
    @observable selectedCourseId = null;
    @observable taughtCourses;
    @observable showCreateFeatureQuestion = true;

    constructor({instructorStore = null}) {
        this.instructorStore = instructorStore;
    }

    @action
    toggleShowCreateFeaturedQuestion() {
        this.showCreateFeatureQuestion = !this.showCreateFeatureQuestion;
    }

    @computed
    get ready() {
        return this.taughtCourses && this.taughtCourses.length > 0;
    }

    @action
    selectCourse(courseId) {
        this.selectedCourseId = courseId;
    }

    @action
    async loadInitialTaughtCourses(selectedCourseId, taughtCoursesParams) {
        if (this.taughtCourses) {
            return new Promise((resolve) => resolve(this.taughtCourses));
        }
        const courses = await this.instructorStore.loadTaughtCoursesWithParams(taughtCoursesParams);
        runInAction(() => {
            this.taughtCourses = courses.filter((course) =>
                course.permissions.find(
                    (permission) => permission.permission === PERMISSION_CODES.MANAGE_COURSE_QA,
                ),
            );

            if (this.taughtCourses.length > 0) {
                this.selectCourse(this.taughtCourses[0].id);
            }
            if (selectedCourseId) {
                const courseIds = this.taughtCourses.map((course) => {
                    return course.id;
                });
                if (courseIds.includes(selectedCourseId)) {
                    this.selectCourse(selectedCourseId);
                }
            }
        });
    }
}
