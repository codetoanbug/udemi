import {ClientEvent} from '@udemy/event-tracking';

/**
 * This event is fired when user submits course review
 */
class CourseReviewCreateEvent extends ClientEvent {
    constructor({courseId, context, courseType, completedVideoLength}) {
        super('CourseReviewCreateEvent');
        this.courseId = courseId;
        this.context = context;
        this.courseType = courseType;
        this.completedVideoLength = completedVideoLength;
    }
}

/**
 * This event is fired when user completes the course review either by canceling or completing it
 */
class CourseReviewEndEvent extends ClientEvent {
    constructor({courseId, context, reviewId, doNotAsk}) {
        super('CourseReviewEndEvent');
        this.courseId = courseId;
        this.context = context;
        this.reviewId = reviewId;
        this.doNotAsk = doNotAsk;
    }
}

/**
 * This event is fired when user updates course review
 */
class CourseReviewUpdateEvent extends ClientEvent {
    constructor({courseId, context, courseType, completedVideoLength, reviewId}) {
        super('CourseReviewUpdateEvent');
        this.courseId = courseId;
        this.context = context;
        this.courseType = courseType;
        this.completedVideoLength = completedVideoLength;
        this.reviewId = reviewId;
    }
}

/**
 * This event is fired when user is asked to give course review
 */
class CourseReviewViewEvent extends ClientEvent {
    constructor({courseId, context, oldPage, newPage, courseType, completedVideoLength, reviewId}) {
        super('CourseReviewViewEvent');
        this.courseId = courseId;
        this.context = context;
        this.oldPage = oldPage;
        this.newPage = newPage;
        this.courseType = courseType;
        this.completedVideoLength = completedVideoLength;
        this.reviewId = reviewId;
    }
}

export {
    CourseReviewCreateEvent,
    CourseReviewEndEvent,
    CourseReviewUpdateEvent,
    CourseReviewViewEvent,
};
