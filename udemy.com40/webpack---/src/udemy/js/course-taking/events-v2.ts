import {ClientEvent} from '@udemy/event-tracking';

import {Assignment, Course} from 'course-manage-v2/events-v2';

interface CourseAnalyticsEntity {
    id: number;
}

interface AssignmentProps {
    assignment: Assignment;
    course: Course | null;
    attemptId: number | null;
}

/**
 * From https://github.com/udemy/schema-store/blob/master/events/v2/AssignmentStarted.avdl
 */
class AssignmentStarted extends ClientEvent {
    assignment: Assignment;
    course: Course | null;
    attemptId: number | null;

    constructor({assignment, course, attemptId}: AssignmentProps) {
        super('AssignmentStarted');
        this.assignment = assignment;
        this.course = course;
        this.attemptId = attemptId;
    }
}

/**
 * From https://github.com/udemy/schema-store/blob/master/events/v2/AssignmentCompleted.avdl
 */
class AssignmentCompleted extends ClientEvent {
    assignment: Assignment;
    course: Course | null;
    attemptId: number | null;

    constructor({assignment, course, attemptId}: AssignmentProps) {
        super('AssignmentCompleted');
        this.assignment = assignment;
        this.course = course;
        this.attemptId = attemptId;
    }
}

export {AssignmentStarted, AssignmentCompleted};
export type {CourseAnalyticsEntity};
