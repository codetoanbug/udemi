import {computed, extendObservable} from 'mobx';

import {AVAILABLE_FEATURES} from 'course-taking/constants';

export default class CurriculumCourseModel {
    constructor(data) {
        extendObservable(this, data);
    }

    @computed
    get hasSufficientPreviewLength() {
        return !!this.has_sufficient_preview_length;
    }

    @computed
    get isOrganizationOnly() {
        return !!this.organization_id;
    }

    @computed
    get isPaid() {
        return !!this.is_paid;
    }

    @computed
    get wasPublished() {
        return !!this.published_time;
    }

    @computed
    get isPracticeTestCourse() {
        return !!this.is_practice_test_course;
    }

    @computed
    get isDevelopmentCourse() {
        // Picked these ids from course_category table:
        // id: 288 Title: Development, TitleCleaned: development, TitleTag: Online Web Development & Programming Courses
        // id: 306 Title: Development, TitleCleaned: ufb-development
        // id: 326 Title: Data Science, TitleCleaned: ufb-data-science

        return this.primary_category && [288, 306, 326].includes(this.primary_category.id);
    }

    @computed
    get hasWorkspaceAssociated() {
        return !!(
            this.available_features &&
            this.available_features.includes(AVAILABLE_FEATURES.HAS_WORKSPACE_ASSOCIATED)
        );
    }
}
