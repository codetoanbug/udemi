import {Tracker} from '@udemy/event-tracking';

import {
    LearningPathRecommendedCoursesSkillsetsViewEvent,
    LearningPathRecommendedCoursesCoursesViewEvent,
    LearningPathRecommendedCoursesCourseActionEvent,
    LearningPathRecommendedCoursesAddEvent,
} from '../../tracking-events';

class CourseRecommendationsEventTracker {
    setPathId(id) {
        this.pathId = id;
    }

    themesPageViewed() {
        Tracker.publishEvent(
            new LearningPathRecommendedCoursesSkillsetsViewEvent({
                pathId: this.pathId,
            }),
        );
    }

    coursesPageViewed() {
        Tracker.publishEvent(
            new LearningPathRecommendedCoursesCoursesViewEvent({
                pathId: this.pathId,
            }),
        );
    }

    courseClicked(courseId) {
        Tracker.publishEvent(
            new LearningPathRecommendedCoursesCourseActionEvent({
                pathId: this.pathId,
                courseId,
                uiAction: 'click',
            }),
        );
    }

    courseSelected(courseId) {
        Tracker.publishEvent(
            new LearningPathRecommendedCoursesCourseActionEvent({
                pathId: this.pathId,
                courseId,
                uiAction: 'select',
            }),
        );
    }

    addedCoursesToPath(courseIds, addSectionHeadings) {
        Tracker.publishEvent(
            new LearningPathRecommendedCoursesAddEvent({
                pathId: this.pathId,
                courseIds,
                isAddSectionHeadingsChecked: addSectionHeadings,
            }),
        );
    }
}

export default new CourseRecommendationsEventTracker();
