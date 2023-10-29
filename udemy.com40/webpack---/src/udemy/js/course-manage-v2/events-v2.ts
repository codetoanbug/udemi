import {Tracker, ClientEvent} from '@udemy/event-tracking';

class Assignment {
    id: number;
    title: string;

    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
    }
}
class Course {
    id: number;

    constructor(id: number) {
        this.id = id;
    }
}

interface AssignmentProps {
    assignment: Assignment;
    course: Course | null;
}

/**
 * https://github.com/udemy/schema-store/blob/master/events/v2/AssignmentCreated.avdl
 */
class AssignmentCreated extends ClientEvent {
    assignment: Assignment;
    course: Course | null;

    constructor({assignment, course}: AssignmentProps) {
        super('AssignmentCreated');
        this.assignment = assignment;
        this.course = course;
    }
}

/**
 * https://github.com/udemy/schema-store/blob/master/events/v2/AssignmentEdited.avdl
 */
class AssignmentEdited extends ClientEvent {
    assignment: Assignment;
    course: Course | null;

    constructor({assignment, course}: AssignmentProps) {
        super('AssignmentEdited');
        this.assignment = assignment;
        this.course = course;
    }
}

/**
 * https://github.com/udemy/schema-store/blob/master/events/v2/AssignmentPublished.avdl
 */
class AssignmentPublished extends ClientEvent {
    assignment: Assignment;
    course: Course | null;

    constructor({assignment, course}: AssignmentProps) {
        super('AssignmentPublished');
        this.assignment = assignment;
        this.course = course;
    }
}

function sendAssignmentEdited(practiceId: number, practiceTitle: string, courseId: number) {
    const assignment = new Assignment(practiceId, practiceTitle);
    const course = new Course(courseId);
    Tracker.publishEvent(new AssignmentEdited({assignment, course}));
}

export {
    Assignment,
    AssignmentEdited,
    AssignmentCreated,
    AssignmentPublished,
    Course,
    sendAssignmentEdited,
};
