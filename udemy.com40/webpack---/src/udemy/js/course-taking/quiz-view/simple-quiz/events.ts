import {ClientEvent} from '@udemy/event-tracking';

import {CourseAnalyticsEntity} from '../../events-v2';

/**
 * Please note: "Quiz" in analytics parlance refers to what is called Simple Quiz
 * in terms of the monolith data model. For analytics purposes, we want to align our
 * terminology with what our customers experience.
 */
interface QuizAnalyticsEntity {
    id: number;
    numberOfQuestions: number;
}

export class QuizStarted extends ClientEvent {
    constructor(
        public quiz: QuizAnalyticsEntity,
        public course: CourseAnalyticsEntity | null,
        public attemptId: number,
    ) {
        super('QuizStarted');
    }
}

export class QuizCompleted extends ClientEvent {
    constructor(
        public quiz: QuizAnalyticsEntity,
        public course: CourseAnalyticsEntity | null,
        public attemptId: number,
        public percentCorrect: number,
    ) {
        super('QuizCompleted');
    }
}
