import {action, computed, observable} from 'mobx';

import Course from 'course-taking/course.mobx-model';
import Instructor from 'course-taking/instructor.mobx-model';
import {
    API_LAB_ALL_FIELDS,
    API_VISIBLE_INSTRUCTOR_ALL_FIELDS,
    LABS_API_URL,
    LABS_PROMPT_SEARCH_CRITERIA,
} from 'labs-landing/constants';
import Lab from 'labs/lab.mobx-model';
import udApi from 'utils/ud-api';

export class LabsPromptStore {
    @observable labs: Lab[] = [];
    @observable isLoading = true;
    @observable searchCriteria = LABS_PROMPT_SEARCH_CRITERIA.topics;

    @computed
    get labOwnersList() {
        return [
            ...new Set(
                this.labs.map((lab) => {
                    return lab.owner.title;
                }),
            ),
        ];
    }

    @computed
    get foundByTopics() {
        return this.searchCriteria === LABS_PROMPT_SEARCH_CRITERIA.topics;
    }

    @computed
    get randomlySortedLabs() {
        return this.labs.sort(() => 0.5 - Math.random());
    }

    getLabsToDisplay(limit: number, course: Course | null) {
        if (!this.foundByTopics || !course) {
            // return random labs if found by instructors
            return this.randomlySortedLabs.slice(0, limit);
        }
        return (
            this.randomlySortedLabs
                // Prioritize labs that have instructors from the course
                .sort((lab1, lab2) => {
                    const lab1HasCourseInstructors = this.labHasCourseInstructors(lab1, course);
                    const lab2HasCourseInstructors = this.labHasCourseInstructors(lab2, course);
                    if (lab1HasCourseInstructors && !lab2HasCourseInstructors) {
                        return -1;
                    }
                    if (!lab1HasCourseInstructors && lab2HasCourseInstructors) {
                        return 1;
                    }
                    return 0;
                })
                .slice(0, limit)
        );
    }

    private labHasCourseInstructors(lab: Lab, course: Course) {
        return lab.visibleInstructors.some((instructor) => {
            return course.visibleInstructors.some(
                (courseInstructor: Instructor) => courseInstructor.id === instructor.id,
            );
        });
    }

    async loadLabsRelatedToCourse(courseId: number) {
        this.setLoading(true);
        let labs = await this.loadLabsRelatedByTopics(courseId);
        if (labs.length === 0) {
            labs = await this.loadLabsRelatedByInstructors(courseId);
            this.setSearchCriteria(LABS_PROMPT_SEARCH_CRITERIA.instructors);
        }
        this.setLabsFromData(labs);
        this.setLoading(false);
    }

    private async loadLabsRelatedByTopics(courseId: number) {
        const response = await udApi.get(LABS_API_URL.modularListing, {
            params: {
                related_course_id_by_topics: courseId,
                'fields[lab]': API_LAB_ALL_FIELDS,
                'fields[user]': API_VISIBLE_INSTRUCTOR_ALL_FIELDS,
            },
        });
        return response.data?.results || [];
    }

    private async loadLabsRelatedByInstructors(courseId: number) {
        const response = await udApi.get(LABS_API_URL.modularListing, {
            params: {
                related_course_id_by_instructors: courseId,
                'fields[lab]': API_LAB_ALL_FIELDS,
                'fields[user]': API_VISIBLE_INSTRUCTOR_ALL_FIELDS,
            },
        });
        return response.data?.results || [];
    }

    @action
    private setLabsFromData(data: []) {
        this.labs = data.map((labData) => {
            return new Lab(labData);
        });
    }

    @action
    private setLoading(value: boolean) {
        this.isLoading = value;
    }

    @action
    private setSearchCriteria(value: string) {
        this.searchCriteria = value;
    }
}
