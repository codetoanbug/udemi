import {action, computed, observable, reaction, runInAction} from 'mobx';

import AnnouncementAnalyticsStore from './tabs/announcements.mobx-store';
import PromotionsAnalyticsStore from './tabs/promotions.mobx-store';

export default class AnnouncementsStore {
    @observable courseIdFilter = null;
    @observable taughtCourses = null;
    @observable.ref announcementStore;
    @observable.ref promotionsStore;

    constructor(instructorStore) {
        this.instructorStore = instructorStore;
        reaction(
            () => this.courseIdFilter,
            () => this._reloadAnnouncementStore(),
        );
    }

    @action
    _reloadAnnouncementStore() {
        this.announcementStore = new AnnouncementAnalyticsStore(this.courseIdFilter);
        this.promotionsStore = new PromotionsAnalyticsStore(this.courseIdFilter);
    }

    @computed
    get ready() {
        return this.taughtCourses !== null;
    }

    @computed
    get course() {
        if (!this.taughtCourses || !this.courseIdFilter) {
            return null;
        }

        return this.taughtCourses.find((course) => course.id === this.courseIdFilter);
    }

    get isPublishedInstructor() {
        return this.instructorStore.isPublishedInstructor;
    }

    async loadInitialTaughtCourses(isTaughtCoursesApiSlimVersionEnabled) {
        const courses = await this.instructorStore.loadTaughtCourses(
            isTaughtCoursesApiSlimVersionEnabled,
        );

        runInAction(() => {
            this.taughtCourses = courses.filter((course) => {
                return course.organization_id || course.is_published;
            });
            if (this.taughtCourses.length > 0 && !this.courseIdFilter) {
                this.courseIdFilter = this.taughtCourses[0].id;
            }
        });
    }

    @action
    setCourseFilter(courseId) {
        this.courseIdFilter = courseId;
    }
}
