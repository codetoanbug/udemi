import {ClientEvent} from '@udemy/event-tracking';

export const ActionTypesEnum = Object.freeze({
    GIVEUPVOTE: 'giveupvote',
    REMOVEUPVOTE: 'removeupvote',
});

export const ItemTypesEnum = Object.freeze({
    QUESTION: 'question',
    ANSWER: 'answer',
});

class UpvoteGivenToQuestionByLearnerOnCourseTakingEvent extends ClientEvent {
    constructor(courseId, questionId) {
        super('UpvoteGivenToQuestionByLearnerOnCourseTakingEvent');
        this.courseId = courseId;
        this.questionId = questionId;
    }
}

class UpvoteRemovedFromQuestionByLearnerOnCourseTakingEvent extends ClientEvent {
    constructor(courseId, questionId) {
        super('UpvoteRemovedFromQuestionByLearnerOnCourseTakingEvent');
        this.courseId = courseId;
        this.questionId = questionId;
    }
}

class UpvoteCTAnswerEventFactory {
    static create(actionType, courseId, questionId, answerId) {
        if (actionType === ActionTypesEnum.GIVEUPVOTE) {
            return new UpvoteGivenToAnswerByLearnerOnCourseTakingEvent(
                courseId,
                questionId,
                answerId,
            );
        } else if (actionType === ActionTypesEnum.REMOVEUPVOTE) {
            return new UpvoteRemovedFromAnswerByLearnerOnCourseTakingEvent(
                courseId,
                questionId,
                answerId,
            );
        }
        return null;
    }
}

class UpvoteGivenToAnswerByLearnerOnCourseTakingEvent extends ClientEvent {
    constructor(courseId, questionId, answerId) {
        super('UpvoteGivenToAnswerByLearnerOnCourseTakingEvent');
        this.courseId = courseId;
        this.questionId = questionId;
        this.answerId = answerId;
    }
}

class UpvoteRemovedFromAnswerByLearnerOnCourseTakingEvent extends ClientEvent {
    constructor(courseId, questionId, answerId) {
        super('UpvoteRemovedFromAnswerByLearnerOnCourseTakingEvent');
        this.courseId = courseId;
        this.questionId = questionId;
        this.answerId = answerId;
    }
}

class UpvoteCTQuestionEventFactory {
    static create(actionType, courseId, questionId) {
        if (actionType === ActionTypesEnum.GIVEUPVOTE) {
            return new UpvoteGivenToQuestionByLearnerOnCourseTakingEvent(courseId, questionId);
        } else if (actionType === ActionTypesEnum.REMOVEUPVOTE) {
            return new UpvoteRemovedFromQuestionByLearnerOnCourseTakingEvent(courseId, questionId);
        }
        return null;
    }
}

class UpvoteCTEventFactory {
    static create(itemType, actionType, courseId, questionId, answerId) {
        if (itemType === ItemTypesEnum.QUESTION) {
            return UpvoteCTQuestionEventFactory.create(actionType, courseId, questionId);
        } else if (itemType === ItemTypesEnum.ANSWER) {
            return UpvoteCTAnswerEventFactory.create(actionType, courseId, questionId, answerId);
        }
        return null;
    }
}

export default UpvoteCTEventFactory;
