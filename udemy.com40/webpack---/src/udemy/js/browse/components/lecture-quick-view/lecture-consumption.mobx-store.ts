import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import {LectureCompleted, LectureType} from 'course-taking/lecture-view/events';
import {VIDEO_COMPLETION_OFFSET} from 'course-taking/lecture-view/video-viewer/constants';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

import {Lecture, ProgressData} from './types';

export class LectureConsumptionStore {
    @observable lecture?: Lecture;
    @observable isCompleted = false;
    courseId?: number;
    // Making the assumption that all lectures displayed via this component are video lectures;
    // if in the future that becomes a bad assumption, we'll need to ensure the Lecture (asset)
    // type is passed in from the backend.
    analyticsLectureType = LectureType.VIDEO;

    @action
    setLecture(lecture: Lecture, courseId: number) {
        this.courseId = courseId;
        this.lecture = lecture;
        this.isCompleted = false;
        this.markAsViewed();
    }

    @autobind
    onVideoProgress(event: any, progressData: ProgressData) {
        /* Progress data is sent from the video player every 15 seconds defined by VIDEO_PROGRESS_INTERVAL.
         * progressData.position : is the current seconds that the user is at the moment.
         * progressData.total: is the total seconds of video content of the current lecture.
         *
         * If the number of seconds consumed is within 15 seconds (VIDEO_COMPLETION_OFFSET) of the total video content,
         * mark the lecture as completed.  */
        if (
            progressData.position > 0 &&
            progressData.position > progressData.total - VIDEO_COMPLETION_OFFSET &&
            !this.isCompleted
        ) {
            this.markAsComplete();
        }
        // Update lecture progress
        progressData.time = new Date().toISOString();
        progressData.context = {type: 'Lecture'};
        this.updateProgress(progressData);
    }

    logException() {
        const missingObj = this.lecture ? 'course' : 'course and lecture';
        Raven.captureException(`Lecture consumption store not initialized with ${missingObj}.`);
    }

    updateProgress(progressData: ProgressData) {
        if (!this.lecture || !this.courseId) {
            this.logException();
            return;
        }

        try {
            udApi.post(
                `/users/me/subscribed-courses/${this.courseId}/lectures/${this.lecture.id}/progress-logs/`,
                progressData,
            );
        } catch (e) {
            Raven.captureException(`Lecture ${this.lecture.id} progress update failed: ${e}`);
        }
    }

    @autobind
    @action
    markAsComplete() {
        if (!this.lecture || !this.courseId) {
            this.logException();
            return;
        }
        const url = `/users/me/subscribed-courses/${this.courseId}/completed-lectures/`;
        const data = {lecture_id: this.lecture.id, downloaded: false};
        try {
            udApi.post(url, data);
            this.isCompleted = true;
            // Important analytics event!
            // Note that in the Course Taking Experience, it's possible to manually mark a Lecture as
            // complete via a checkbox in the UI, which, as of this writing, calls a markAsComplete
            // method on the curriculum item. We *don't* want to send LectureCompleted for manual
            // completions, so in Course Taking, we don't fire the event from markAsComplete.
            // It's ok to do so here, so long as we aren't giving users a way to manually mark
            // lectures as completed in this component.
            Tracker.publishEvent(
                new LectureCompleted(
                    {
                        id: this.lecture.id,
                        type: this.analyticsLectureType,
                    },
                    // note: leaving course empty as the lecture is not being viewed in the context
                    // of a course
                    null,
                ),
            );
        } catch (e) {
            Raven.captureException(
                `Lecture ${this.lecture.id} failed to be marked as complete: ${e}`,
            );
        }
    }

    markAsViewed() {
        if (!this.lecture || !this.courseId) {
            this.logException();
            return;
        }

        try {
            udApi.post(
                `/users/me/subscribed-courses/${this.courseId}/lectures/${this.lecture.id}/view-logs/`,
            );
        } catch (e) {
            Raven.captureException(
                `Lecture ${this.lecture.id} failed to be marked as viewed: ${e}`,
            );
        }
    }
}
