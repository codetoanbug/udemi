import {ClientEvent} from '@udemy/event-tracking';

import {PracticeTestCreatedEvent} from 'course-manage-practice-test/events';

const EventTypesEnum = Object.freeze({
    CODING_EXERCISE_CREATE_SUCCESS_EVENT: 'CodingExerciseCreateSuccessEvent',
    CODING_EXERCISE_CREATE_FAIL_EVENT: 'CodingExerciseCreateFailEvent',
    SIMPLE_QUIZ_CREATE_SUCCESS_EVENT: 'SimpleQuizCreateSuccessEvent',
    SIMPLE_QUIZ_CREATE_FAIL_EVENT: 'SimpleQuizCreateFailEvent',
});

const TypesEnum = Object.freeze({
    CODING_EXERCISE: 'coding-exercise',
    SIMPLE_QUIZ: 'simple-quiz',
});

const ErrorReasonEnum = Object.freeze({
    REQUEST_FAILED: 'request_failed',
    TIMEOUT: 'timeout',
});

export const ActionsEnum = Object.freeze({
    SUCCESS: 'success',
    FAIL: 'fail',
});

class CodingExerciseCreateSuccessEvent extends ClientEvent {
    constructor({id, title, courseId}) {
        super(EventTypesEnum.CODING_EXERCISE_CREATE_SUCCESS_EVENT);
        this.id = id;
        this.title = title;
        this.courseId = courseId;
    }
}

class CodingExerciseCreateFailEvent extends ClientEvent {
    constructor({message, courseId}) {
        super(EventTypesEnum.CODING_EXERCISE_CREATE_FAIL_EVENT);
        this.message = message;
        this.courseId = courseId;
    }
}

class CodingExerciseCreateEventFactory {
    static create(action, values) {
        if (action === ActionsEnum.SUCCESS) {
            return new CodingExerciseCreateSuccessEvent({...values});
        } else if (action === ActionsEnum.FAIL) {
            return new CodingExerciseCreateFailEvent({...values});
        }
        return null;
    }
}

class SimpleQuizCreateSuccessEvent extends ClientEvent {
    constructor({id, title, description, courseId}) {
        super(EventTypesEnum.SIMPLE_QUIZ_CREATE_SUCCESS_EVENT);
        this.id = id;
        this.title = title;
        this.description = description;
        this.courseId = courseId;
    }
}

class SimpleQuizCreateFailEvent extends ClientEvent {
    constructor({message, courseId}) {
        super(EventTypesEnum.SIMPLE_QUIZ_CREATE_FAIL_EVENT);
        this.message = message.toLowerCase().includes('request failed')
            ? ErrorReasonEnum.REQUEST_FAILED
            : ErrorReasonEnum.TIMEOUT;
        this.courseId = courseId;
    }
}

class SimpleQuizCreateEventFactory {
    static create(action, values) {
        if (action === ActionsEnum.SUCCESS) {
            return new SimpleQuizCreateSuccessEvent({...values});
        } else if (action === ActionsEnum.FAIL) {
            return new SimpleQuizCreateFailEvent({...values});
        }
        return null;
    }
}

class QuizCreateEventFactory {
    static create(type, action, values) {
        if (type === TypesEnum.CODING_EXERCISE) {
            return CodingExerciseCreateEventFactory.create(action, values);
        } else if (type === TypesEnum.SIMPLE_QUIZ) {
            return SimpleQuizCreateEventFactory.create(action, values);
        } else if (type === TypesEnum.PRACTICE_TEST && action === ActionsEnum.SUCCESS) {
            return new PracticeTestCreatedEvent({
                course: {id: values.courseId},
                practiceTest: {
                    id: values.id,
                    isPublished: values.is_published,
                    numberOfQuestions: 0,
                },
            });
        }
        return null;
    }
}

export default QuizCreateEventFactory;
