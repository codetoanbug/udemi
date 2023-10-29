import {ClientEvent} from '@udemy/event-tracking';

class PerformanceEngagementDateRangeFilterChangedEvent extends ClientEvent {
    constructor(dateType) {
        super('PerformanceEngagementDateRangeFilterChangedEvent');
        this.dateType = dateType;
    }
}

class PerformanceEngagementCourseSelectedEvent extends ClientEvent {
    constructor(selectedCourseDropdownData) {
        super('PerformanceEngagementCourseSelectedEvent');
        this.selectedCourseDropdownData = selectedCourseDropdownData;
    }
}

class InstructorUBOnlyOverviewPageViewEvent extends ClientEvent {
    constructor(dateFilter, courseDropdownSelection) {
        super('InstructorUBOnlyOverviewPageViewEvent');
        this.dateFilter = dateFilter;
        this.courseDropdownSelection = courseDropdownSelection;
    }
}

class InstructorUBOnlyStudentsPageViewEvent extends ClientEvent {
    constructor(courseDropdownSelection) {
        super('InstructorUBOnlyStudentsPageViewEvent');
        this.courseDropdownSelection = courseDropdownSelection;
    }
}

class InstructorUBOnlyReviewsPageViewEvent extends ClientEvent {
    constructor(courseDropdownSelection) {
        super('InstructorUBOnlyReviewsPageViewEvent');
        this.courseDropdownSelection = courseDropdownSelection;
    }
}

class InstructorUBOnlyCourseEngagementPageViewEvent extends ClientEvent {
    constructor(dateFilter, courseDropdownSelection) {
        super('InstructorUBOnlyCourseEngagementPageViewEvent');
        this.dateFilter = dateFilter;
        this.courseDropdownSelection = courseDropdownSelection;
    }
}

class PracticeInsightsFiltered extends ClientEvent {
    constructor(courseId, quizId, dataScope, dateFilter) {
        super('PracticeInsightsFiltered');
        this.courseId = courseId;
        this.quizId = quizId;
        this.dataScope = dataScope;
        this.dateFilter = dateFilter;
    }
}

class PracticeInsightsPresented extends ClientEvent {
    constructor(uiRegion) {
        super('PracticeInsightsPresented');
        this.uiRegion = uiRegion;
    }
}

class EditCodingExerciseSelected extends ClientEvent {
    constructor() {
        super('EditCodingExerciseSelected');
    }
}

export {
    PerformanceEngagementDateRangeFilterChangedEvent,
    PerformanceEngagementCourseSelectedEvent,
    InstructorUBOnlyOverviewPageViewEvent,
    InstructorUBOnlyStudentsPageViewEvent,
    InstructorUBOnlyReviewsPageViewEvent,
    InstructorUBOnlyCourseEngagementPageViewEvent,
    PracticeInsightsFiltered,
    PracticeInsightsPresented,
    EditCodingExerciseSelected,
};
