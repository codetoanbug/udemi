import autobind from 'autobind-decorator';
import {action, computed, decorate, observable, runInAction} from 'mobx';

import {showReloadPageErrorToast} from 'instructor/toasts';
import serverOrClient from 'utils/server-or-client';
import udApi, {defaultErrorMessage, TIMEOUT} from 'utils/ud-api';
import udMe from 'utils/ud-me';

export default class QualityFeedbackStore {
    @observable.ref review = {};
    @observable isReviewLoaded = false;
    @observable.ref feedbacks = [];
    @observable areFeedbacksLoaded = false;
    @observable isResubmittingForReview = false;

    constructor(courseId) {
        this.courseId = courseId;
    }

    @computed get needsFixFeedbacks() {
        return this.feedbacks.filter((feedback) => feedback.rating === 'needs_fix');
    }

    @computed get acceptableFeedbacks() {
        return this.feedbacks.filter((feedback) => feedback.rating === 'acceptable');
    }

    @computed get exceptionalFeedbacks() {
        return this.feedbacks.filter((feedback) => {
            const comments = feedback.comment_thread.comments;
            return feedback.rating === 'exceptional' && !!(comments && comments.length);
        });
    }

    @computed get unresolvedNeedsFixFeedbacksCount() {
        return this.needsFixFeedbacks.filter((feedback) => !feedback.is_marked_as_fixed).length;
    }

    @computed get unresolvedAcceptableFeedbacksCount() {
        return this.acceptableFeedbacks.filter((feedback) => !feedback.is_marked_as_fixed).length;
    }

    async loadQRPFeedbacks() {
        try {
            const courseResponse = await udApi.get(`/courses/${this.courseId}/`, {
                params: {
                    'fields[course]': 'quality_status,quality_review_process',
                    'fields[quality_review_process]': 'last_submitted_date',
                },
                timeout: TIMEOUT,
            });
            this._setQRPApiData(courseResponse.data);

            if (this.review.id) {
                const feedbacksResponse = await udApi.get(
                    `/quality-review-processes/${this.review.id}/quality-criteria-feedbacks/`,
                    {
                        params: {
                            'fields[quality_criteria_feedback]':
                                'comment_thread,is_marked_as_fixed,quality_criteria,rating',
                            'fields[quality_criteria]': 'solution_url,solution_text,title',
                        },
                    },
                );
                this._setFeedbacksApiData(feedbacksResponse.data.results || []);
            } else {
                this._setFeedbacksApiData([]);
            }
        } catch (e) {
            showReloadPageErrorToast(defaultErrorMessage);
        }
    }

    @action _setQRPApiData(course) {
        const qrp = course.quality_review_process;
        this.review = {
            id: qrp && qrp.id,
            lastSubmittedDate: qrp && qrp.last_submitted_date,
            status: course.quality_status,
        };
        this.isReviewLoaded = true;
    }

    @action _setFeedbacksApiData(feedbacks) {
        this.feedbacks = feedbacks.map((feedback) => {
            const result = {
                ...feedback,
                isMarkingAsFixed: false,
                isOpen: this._isFeedbackDefaultOpen(feedback),
            };
            decorate(result, {
                is_marked_as_fixed: observable,
                isMarkingAsFixed: observable,
                isOpen: observable,
            });
            return result;
        });
        this.areFeedbacksLoaded = true;
    }

    _isFeedbackDefaultOpen(feedback) {
        if (feedback.rating === 'needs_fix' && !feedback.is_marked_as_fixed) {
            return true;
        }

        // Open the feedback panel if the QRP reviewer replied to the instructor.
        const comments = feedback.comment_thread.comments || [];
        return (
            comments.length > 0 &&
            comments[0].user.id !== udMe.id &&
            comments.some((comment) => comment.user.id === udMe.id)
        );
    }

    @action setIsFeedbackOpen(feedback, isOpen) {
        feedback.isOpen = isOpen;
    }

    @action async toggleIsFeedbackMarkedAsFixed(feedback) {
        feedback.isMarkingAsFixed = true;
        try {
            await udApi.patch(
                `/quality-review-processes/${this.review.id}/quality-criteria-feedbacks/${feedback.id}/`,
                {is_marked_as_fixed: !feedback.is_marked_as_fixed},
            );
            runInAction(() => {
                feedback.is_marked_as_fixed = !feedback.is_marked_as_fixed;
                feedback.isOpen = !feedback.is_marked_as_fixed;
                feedback.isMarkingAsFixed = false;
            });
        } catch (e) {
            runInAction(() => {
                feedback.isMarkingAsFixed = false;
            });
        }
    }

    @computed get canResubmitForReview() {
        return this.unresolvedNeedsFixFeedbacksCount === 0 && !this.isResubmittingForReview;
    }

    @autobind @action async resubmitForReview() {
        if (this.canResubmitForReview) {
            this.isResubmittingForReview = true;
            try {
                if (this.review.id) {
                    await udApi.patch(`/quality-review-processes/${this.review.id}/`, {
                        status: 'resubmitted',
                    });
                } else {
                    // This shouldn't happen normally, but somehow we have many records of courses
                    // that do not have a quality review process, yet have a non-null admin rating
                    // below 7. Such courses have quality_status = 'needs_fixes', so they can be submitted.
                    await udApi.post('/quality-review-processes/', {course: this.courseId});
                }
                serverOrClient.global.location.reload();
            } catch (e) {
                runInAction(() => {
                    this.isResubmittingForReview = false;
                });
            }
        }
    }
}
