import {getConfigData} from '@udemy/shared-utils';
import {action, observable} from 'mobx';

import udApi from 'utils/ud-api';

export default class CourseRetirementStore {
    /**
     * Use this store when you only need to check if a course is retired and find out the
     * retirement date, if you need a list of alternatives for the course,
     * see CourseRetirementAlternativesStore
     */
    constructor(courseId, globalOverrides = {}) {
        this.courseId = courseId;
        this.globalOverrides = globalOverrides;
    }

    @observable isLoading = true;
    @observable isCourseAvailable = true;
    @observable courseRetirement = null;

    @action
    setIsLoading(value) {
        this.isLoading = value;
    }

    @action
    setCourseAvailability(value) {
        this.isCourseAvailable = value;
    }

    @action
    setCourseRetirement(value) {
        this.courseRetirement = value;
    }

    get organizationId() {
        const udConfig = this.globalOverrides.Config ?? getConfigData();
        return udConfig.brand.organization.id;
    }

    @action
    async fetchCourseRetirement(organizationId) {
        this.setIsLoading(true);

        const orgId = organizationId ?? this.organizationId;

        try {
            if (this.courseId) {
                const response = await udApi.get(
                    `/organizations/${orgId}/retired-courses/${this.courseId}/`,
                );
                if (!response.data.is_course_available_in_org) {
                    this.setCourseAvailability(false);
                } else if (response.data.retirement_date) {
                    this.setCourseRetirement(response.data);
                }
            }
        } catch (e) {
            this.setCourseRetirement(null);
        } finally {
            this.setIsLoading(false);
        }
    }
}
