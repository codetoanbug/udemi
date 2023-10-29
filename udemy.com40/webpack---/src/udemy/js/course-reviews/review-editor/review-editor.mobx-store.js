import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import StateMachine from 'javascript-state-machine';
import {action, extendObservable, observable} from 'mobx';

import {
    CourseReviewCreateEvent,
    CourseReviewEndEvent,
    CourseReviewUpdateEvent,
    CourseReviewViewEvent,
} from 'course-reviews/common/events';

import reviewBackend from '../common/review-backend';

export const REVIEW_STATES = {
    init: 'init',
    starRating: 'starRating',
    comment: 'comment',
    survey: 'survey',
    confirmation: 'confirmation',
};

export default class ReviewEditorStore {
    @observable review = null;
    @observable currentState = null;
    @observable previousState = null;

    constructor(
        reviewId,
        rating,
        reviewContent,
        location,
        course,
        onSaveReview,
        sourcePage,
        extraLoggingData,
        backend = reviewBackend,
        completionRatio = undefined,
    ) {
        reviewContent = reviewContent || '';
        extendObservable(this, {
            reviewId,
            rating,
            reviewContent,
            location,
            course,
            completionRatio,
        });
        this.onSaveReview = onSaveReview;
        this.sourcePage = sourcePage;
        this.extraLoggingData = extraLoggingData;
        const events = [
            {name: 'forward', from: REVIEW_STATES.starRating, to: REVIEW_STATES.comment},
            {name: 'save', from: REVIEW_STATES.starRating, to: REVIEW_STATES.starRating},
            {name: 'save', from: REVIEW_STATES.comment, to: REVIEW_STATES.comment},
            {
                name: 'forward',
                from: REVIEW_STATES.comment,
                to: course.is_practice_test_course
                    ? REVIEW_STATES.confirmation
                    : REVIEW_STATES.survey,
            },
            {name: 'back', from: REVIEW_STATES.survey, to: REVIEW_STATES.comment},
            {name: 'forward', from: REVIEW_STATES.survey, to: REVIEW_STATES.confirmation},
            {
                name: 'back',
                from: REVIEW_STATES.confirmation,
                to: course.is_practice_test_course ? REVIEW_STATES.comment : REVIEW_STATES.survey,
            },
        ];
        // we shouldn't have back event from comment page to star rating if review exists
        if (!this.rating) {
            events.push({name: 'back', from: REVIEW_STATES.comment, to: REVIEW_STATES.starRating});
        }
        const config = {
            initial: this.rating ? REVIEW_STATES.comment : REVIEW_STATES.starRating,
            events,
            callbacks: {
                onenterstate: action((event, from, to) => {
                    this.currentState = to;
                    this.previousState = from;
                }),
                onsave: action(() => {
                    const data = {
                        rating: this.rating,
                        content: this.reviewContent,
                        location: this.location,
                    };
                    const promise = this.reviewId
                        ? this.reviewBackend.update(this.reviewId, data)
                        : this.reviewBackend.create(data);
                    return promise.then(
                        action((response) => {
                            this.publishCreateOrUpdateEvent();
                            this.reviewId = response.data.id;
                            this.onSaveReview(response.data);
                        }),
                    );
                }),
            },
        };
        this.reviewLeavingStateMachine = StateMachine.create(config);
        this.reviewBackend = backend().forCourse(course.id);
    }

    get commonEventingFields() {
        const courseType = this.course.is_paid ? 'paid' : 'free';
        return {
            courseId: this.course.id,
            context: this.location,
            courseType,
            completedVideoLength: this.extraLoggingData.completed_video_length,
        };
    }

    publishCreateOrUpdateEvent() {
        if (this.reviewId) {
            Tracker.publishEvent(
                new CourseReviewUpdateEvent({
                    ...this.commonEventingFields,
                    reviewId: this.reviewId,
                }),
            );
        } else {
            Tracker.publishEvent(
                new CourseReviewCreateEvent({
                    ...this.commonEventingFields,
                }),
            );
        }
    }

    publishViewEvent() {
        Tracker.publishEvent(
            new CourseReviewViewEvent({
                ...this.commonEventingFields,
                oldPage: this.previousState,
                newPage: this.currentState,
                reviewId: this.reviewId,
            }),
        );
    }

    publishEndEvent(dismissUntilEndOfCourse) {
        Tracker.publishEvent(
            new CourseReviewEndEvent({
                courseId: this.commonEventingFields.courseId,
                context: this.commonEventingFields.context,
                reviewId: this.reviewId,
                doNotAsk: Boolean(dismissUntilEndOfCourse),
            }),
        );
    }

    @autobind
    gotoPreviousState() {
        this.reviewLeavingStateMachine.back();
    }

    @autobind
    goForward() {
        return this.reviewLeavingStateMachine.forward();
    }

    @autobind
    canGoBack() {
        return this.reviewLeavingStateMachine.can('back');
    }

    @autobind
    @action
    rate(newRating) {
        this.rating = newRating;
        this.reviewLeavingStateMachine.save();
    }

    @autobind
    @action
    saveAndForward() {
        this.reviewLeavingStateMachine.save();
        this.reviewLeavingStateMachine.forward();
    }

    @autobind
    @action
    updateComment(e) {
        this.reviewContent = e.target.value;
    }

    @autobind
    @action
    deleteReview() {
        return this.reviewId ? this.reviewBackend.delete(this.reviewId) : Promise.resolve();
    }
}
