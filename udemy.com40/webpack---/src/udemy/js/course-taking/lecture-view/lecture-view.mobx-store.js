import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {ASSET_TYPE} from 'asset/constants';
import {
    LectureCompleted,
    LectureStarted,
    MAP_LECTURE_TYPE_FOR_ANALYTICS_EVENTS,
} from 'course-taking/lecture-view/events';
import {LECTURES_VIEWED_EVENT} from 'organization-trial/constants';
import udPerf from 'utils/ud-performance';

import {TRACKING_CATEGORIES} from '../constants';
import {MAIN_CONTENT} from '../curriculum/constants';

export default class LectureViewStore {
    @observable isLoading = true;
    lectureStartedThisSession = false;
    lectureCompletedThisSession = false;

    constructor(courseTakingStore, fullscreenStore) {
        this.courseTakingStore = courseTakingStore;
        this.fullscreenStore = fullscreenStore;
        this.lecture = this.courseTakingStore.currentCurriculumItem;
    }

    @computed
    get assetType() {
        return this.lecture.asset ? this.lecture.asset.type.toLowerCase() : 'no-asset';
    }

    loadLecture() {
        return this.courseTakingStore.loadItemData(this.lecture).then(
            action(() => {
                // this is important for LectureStarted/Completed event to only fire once per session
                this.lectureStartedThisSession = false;
                this.lectureCompletedThisSession = false;

                if (this.lecture.isUnavailable) {
                    // go to locked screen state if lecture is locked for trial or has locked content type
                    this.courseTakingStore.setMainContentType(MAIN_CONTENT.LOCKED_SCREEN);
                    return;
                }

                this.lecture.markAsViewed();
                if (this.lecture.asset) {
                    const assetType =
                        this.lecture.asset.type === ASSET_TYPE.VIDEO_MASHUP
                            ? 'Mashup'
                            : this.lecture.asset.type;
                    const action = `lecture ${assetType.toLowerCase()}-view`;
                    this.courseTakingStore.track(TRACKING_CATEGORIES.LECTURE, action);
                }
                document.dispatchEvent(
                    new CustomEvent(LECTURES_VIEWED_EVENT, {
                        detail: {isFree: this.lecture.isFree},
                    }),
                );
                this.isLoading = false;
            }),
        );
    }

    onContentReady() {
        if (this.courseTakingStore.isFirstCurriculumItemViewed) {
            udPerf.mark(`CourseTakingV5.lecture-taking-ready-for-${this.assetType}`);
        }

        udPerf.end(`CourseTakingV5.lecture-loading-${this.assetType}`);
    }

    @autobind
    fireLectureStartedEvent() {
        /**
         Note that we intend to fire LectureStarted event each time a Lecture is started
         by a user, even if they re-watch the Lecture multiple times.

         See note below in fireLectureCompletedEvent for more.
         */
        if (!this.lectureStartedThisSession) {
            // Important analytics event!
            Tracker.publishEvent(
                new LectureStarted(
                    {
                        id: this.lecture.id,
                        // note if Asset type is missing, we'll be notified of event rejections.
                        type: MAP_LECTURE_TYPE_FOR_ANALYTICS_EVENTS[this.lecture.asset?.type],
                    },
                    {id: this.courseTakingStore.courseId},
                ),
            );
        }
        this.lectureStartedThisSession = true;
    }

    fireLectureCompletedEvent() {
        /**
         Note that we intend to fire LectureCompleted event each time a Lecture is completed
         by a user, even if they re-watch the Lecture multiple times.

         However, we don't want to fire LectureCompleted multiple times within the same
         viewing "session" (e.g. when we repeatedly fire progress logs every X seconds of video).
         (Note we're using "session" here to mean something smaller in scope than other uses of the
         term "session" at Udemy).

         So `lectureCompletedThisSession` is intended to track only if the Lecture was completed
         in the current viewing session; that session would be reset on page reload or when
         switching to a different Lecture.
         */
        if (!this.lectureCompletedThisSession) {
            // Important analytics event!
            Tracker.publishEvent(
                new LectureCompleted(
                    {
                        id: this.lecture.id,
                        // note if Asset type is missing, we'll be notified of event rejections.
                        type: MAP_LECTURE_TYPE_FOR_ANALYTICS_EVENTS[this.lecture.asset?.type],
                    },
                    {id: this.courseTakingStore.courseId},
                ),
            );
            this.lectureCompletedThisSession = true;
        }
    }
}
