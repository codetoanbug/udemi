import {PAGE_TYPE_COURSE_RETIREMENT} from '@udemy/discovery-api';
import {observable, action, runInAction} from 'mobx';

import BrowseService from 'browse/lib/browse-service';

import CourseRetirementStore from './course-retirement.mobx-store';

export default class CourseRetirementAlternativesStore extends CourseRetirementStore {
    /**
     * Use this store if you need alternatives to a retired course, if you only need to know the
     * date of retirement see CourseRetirementStore
     */
    constructor(courseId, courseLabelId, courseLocale) {
        super(courseId);
        this.courseLabelId = courseLabelId;
        this.courseLocale = courseLocale;
        this.browseService = new BrowseService();
    }

    @observable courseAlternatives = [];
    maxNumberOfAlternatives = 3;

    @action
    getCourseAlternatives = async () => {
        await this.fetchCourseRetirement();
        if (this.courseRetirement && this.courseRetirement.alternatives) {
            this.setCourseAlternativesList(this.courseRetirement.alternatives);
        } else if (this.courseLabelId) {
            await this.fetchAlternativesCoursesFromCategory();
        }
    };

    async fetchAlternativesCoursesFromCategory() {
        this.setIsLoading(true);

        try {
            const data = await this.browseService.loadUnits(PAGE_TYPE_COURSE_RETIREMENT, {
                label_id: this.courseLabelId,
                course_id: this.courseId,
                locale: this.courseLocale,
                page_size: 4, // fetching extra course in case we need to remove the course to-be-retired from the list
                item_count: 4,
                skip_price: true,
            });
            if (data.results?.length > 0) this.setCourseAlternativesList(data.results[0].items);
        } catch (e) {
            runInAction(() => {
                this.courseAlternatives = [];
            });
        } finally {
            this.setIsLoading(false);
        }
    }

    @action
    setCourseAlternativesList(courses) {
        courses.forEach((course) => {
            if (
                this.courseAlternatives.length < this.maxNumberOfAlternatives &&
                course.id !== this.courseId &&
                course.free_course_subscribe_url // only add to the list if the course is in the content collection
            ) {
                this.courseAlternatives.push(course);
            }
        });
    }
}
