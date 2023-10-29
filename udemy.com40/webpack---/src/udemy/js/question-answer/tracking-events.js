import {ClientEvent} from '@udemy/event-tracking';

export const TypesEnum = Object.freeze({
    QA: 'QA',
    FQ: 'FQ',
});

export const ItemTypesEnum = Object.freeze({
    QUESTION: 'question',
    ANSWER: 'answer',
});

export const ActionTypesEnum = Object.freeze({
    GIVEUPVOTE: 'giveupvote',
    REMOVEUPVOTE: 'removeupvote',
});

class UpvoteGivenToQuestionByInstructorOnQAEvent extends ClientEvent {
    constructor(courseId, questionId) {
        super('UpvoteGivenToQuestionByInstructorOnQAEvent');
        this.courseId = courseId;
        this.questionId = questionId;
    }
}

class UpvoteRemovedFromQuestionByInstructorOnQAEvent extends ClientEvent {
    constructor(courseId, questionId) {
        super('UpvoteRemovedFromQuestionByInstructorOnQAEvent');
        this.courseId = courseId;
        this.questionId = questionId;
    }
}

class UpvoteQAQuestionEventFactory {
    static create(actionType, courseId, questionId) {
        if (actionType === ActionTypesEnum.GIVEUPVOTE) {
            return new UpvoteGivenToQuestionByInstructorOnQAEvent(courseId, questionId);
        } else if (actionType === ActionTypesEnum.REMOVEUPVOTE) {
            return new UpvoteRemovedFromQuestionByInstructorOnQAEvent(courseId, questionId);
        }
        return null;
    }
}

class UpvoteGivenToAnswerByInstructorOnQAEvent extends ClientEvent {
    constructor(courseId, questionId, answerId) {
        super('UpvoteGivenToAnswerByInstructorOnQAEvent');
        this.courseId = courseId;
        this.questionId = questionId;
        this.answerId = answerId;
    }
}

class UpvoteRemovedFromAnswerByInstructorOnQAEvent extends ClientEvent {
    constructor(courseId, questionId, answerId) {
        super('UpvoteRemovedFromAnswerByInstructorOnQAEvent');
        this.courseId = courseId;
        this.questionId = questionId;
        this.answerId = answerId;
    }
}

class UpvoteQAAnswerEventFactory {
    static create(actionType, courseId, questionId, answerId) {
        if (actionType === ActionTypesEnum.GIVEUPVOTE) {
            return new UpvoteGivenToAnswerByInstructorOnQAEvent(courseId, questionId, answerId);
        } else if (actionType === ActionTypesEnum.REMOVEUPVOTE) {
            return new UpvoteRemovedFromAnswerByInstructorOnQAEvent(courseId, questionId, answerId);
        }
        return null;
    }
}

class UpvoteGivenToQuestionByInstructorOnFeaturedQuestionsEvent extends ClientEvent {
    constructor(courseId, questionId) {
        super('UpvoteGivenToQuestionByInstructorOnFeaturedQuestionsEvent');
        this.courseId = courseId;
        this.questionId = questionId;
    }
}

class UpvoteRemovedFromQuestionByInstructorOnFeaturedQuestionsEvent extends ClientEvent {
    constructor(courseId, questionId) {
        super('UpvoteRemovedFromQuestionByInstructorOnFeaturedQuestionsEvent');
        this.courseId = courseId;
        this.questionId = questionId;
    }
}

class UpvoteFQQuestionEventFactory {
    static create(actionType, courseId, questionId) {
        if (actionType === ActionTypesEnum.GIVEUPVOTE) {
            return new UpvoteGivenToQuestionByInstructorOnFeaturedQuestionsEvent(
                courseId,
                questionId,
            );
        } else if (actionType === ActionTypesEnum.REMOVEUPVOTE) {
            return new UpvoteRemovedFromQuestionByInstructorOnFeaturedQuestionsEvent(
                courseId,
                questionId,
            );
        }
        return null;
    }
}

class UpvoteGivenToAnswerByInstructorOnFeaturedQuestionsEvent extends ClientEvent {
    constructor(courseId, questionId, answerId) {
        super('UpvoteGivenToAnswerByInstructorOnFeaturedQuestionsEvent');
        this.courseId = courseId;
        this.questionId = questionId;
        this.answerId = answerId;
    }
}

class UpvoteRemovedFromAnswerByInstructorOnFeaturedQuestionsEvent extends ClientEvent {
    constructor(courseId, questionId, answerId) {
        super('UpvoteRemovedFromAnswerByInstructorOnFeaturedQuestionsEvent');
        this.courseId = courseId;
        this.questionId = questionId;
        this.answerId = answerId;
    }
}

class UpvoteFQAnswerEventFactory {
    static create(actionType, courseId, questionId, answerId) {
        if (actionType === ActionTypesEnum.GIVEUPVOTE) {
            return new UpvoteGivenToAnswerByInstructorOnFeaturedQuestionsEvent(
                courseId,
                questionId,
                answerId,
            );
        } else if (actionType === ActionTypesEnum.REMOVEUPVOTE) {
            return new UpvoteRemovedFromAnswerByInstructorOnFeaturedQuestionsEvent(
                courseId,
                questionId,
                answerId,
            );
        }
        return null;
    }
}

class UpvoteQAEventFactory {
    static create(itemType, actionType, courseId, questionId, answerId) {
        if (itemType === ItemTypesEnum.QUESTION) {
            return UpvoteQAQuestionEventFactory.create(actionType, courseId, questionId);
        } else if (itemType === ItemTypesEnum.ANSWER) {
            return UpvoteQAAnswerEventFactory.create(actionType, courseId, questionId, answerId);
        }
        return null;
    }
}

class UpvoteFQEventFactory {
    static create(itemType, actionType, courseId, questionId, answerId) {
        if (itemType === ItemTypesEnum.QUESTION) {
            return UpvoteFQQuestionEventFactory.create(actionType, courseId, questionId);
        } else if (itemType === ItemTypesEnum.ANSWER) {
            return UpvoteFQAnswerEventFactory.create(actionType, courseId, questionId, answerId);
        }
        return null;
    }
}

class UpvoteEventFactory {
    static create(type, itemType, actionType, courseId, questionId, answerId) {
        if (type === TypesEnum.QA) {
            return UpvoteQAEventFactory.create(
                itemType,
                actionType,
                courseId,
                questionId,
                answerId,
            );
        } else if (type === TypesEnum.FQ) {
            return UpvoteFQEventFactory.create(
                itemType,
                actionType,
                courseId,
                questionId,
                answerId,
            );
        }
        return null;
    }
}

export default UpvoteEventFactory;
