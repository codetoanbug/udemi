import autobind from 'autobind-decorator';
import {action} from 'mobx';

import reviewBackend from 'course-reviews/common/review-backend';
import ReviewEditorStore from 'course-reviews/review-editor/review-editor.mobx-store';
import {PAGES} from 'utils/ud-api-stat';
import userSettings, {SETTINGS} from 'utils/user-settings';

export default class ReviewPromptStore {
    constructor(courseTakingStore) {
        this.courseTakingStore = courseTakingStore;

        const course = {
            ...this.courseTakingStore.course,
            is_private: this.courseTakingStore.course.isPrivate,
            is_paid: this.courseTakingStore.course.isPaid,
        };
        const review = this.courseTakingStore.courseReview || {};
        const extraLoggingData = {
            completed_video_length: this.courseTakingStore.completedVideoContentLength,
        };
        this.reviewEditorStore = new ReviewEditorStore(
            review.id,
            review.rating,
            review.content,
            this.courseTakingStore.activeReviewPromptStage.key,
            course,
            this.courseTakingStore.setCourseReview,
            PAGES.COURSE_TAKING,
            extraLoggingData,
            reviewBackend,
            this.courseTakingStore.completionRatio,
        );
    }

    trackReviewPromptSeen() {
        this.reviewEditorStore.publishViewEvent();
    }

    trackReviewPromptExited(dismissUntilEndOfCourse) {
        this.reviewEditorStore.publishEndEvent(dismissUntilEndOfCourse);
    }

    @autobind
    @action
    cancelReview(dismissUntilEndOfCourse) {
        this.trackReviewPromptExited(dismissUntilEndOfCourse);
        if (dismissUntilEndOfCourse) {
            userSettings.set(SETTINGS.reviewPromptDisabled, true, this.courseTakingStore.course.id);
        }
        return this.courseTakingStore.hideReviewPrompt(dismissUntilEndOfCourse);
    }
}
