import {ClientEvent} from '@udemy/event-tracking';

import {CourseAnalyticsEntity} from 'course-taking/events-v2';

interface PracticeTestAnalyticsEntity {
    id: number;
    numberOfQuestions: number;
}

export class PracticeTestStarted extends ClientEvent {
    constructor(
        readonly practiceTest: PracticeTestAnalyticsEntity,
        readonly course: CourseAnalyticsEntity | null,
        readonly attemptId: number,
    ) {
        super('PracticeTestStarted');
        this.practiceTest = practiceTest;
        this.course = course;
        this.attemptId = attemptId;
    }
}

export class PracticeTestCompleted extends ClientEvent {
    constructor(
        readonly practiceTest: PracticeTestAnalyticsEntity,
        readonly course: CourseAnalyticsEntity | null,
        readonly attemptId: number,
        readonly percentCorrect: number,
        readonly isPassing: boolean,
    ) {
        super('PracticeTestCompleted');
        this.practiceTest = practiceTest;
        this.course = course;
        this.attemptId = attemptId;
        this.percentCorrect = percentCorrect;
        this.isPassing = isPassing;
    }
}
