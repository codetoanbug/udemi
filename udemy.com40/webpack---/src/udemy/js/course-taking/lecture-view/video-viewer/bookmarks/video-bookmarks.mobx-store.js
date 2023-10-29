import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {fetchAllPages} from 'utils/ud-api';

import Bookmark from '../../../dashboard/bookmarks/bookmark.mobx-model';
import {TABS} from '../../../dashboard/constants';

export default class VideoBookmarksStore {
    @observable.ref player;
    @observable videoDuration = 0;
    @observable activeBookmarkId = null;
    @observable socialBookmarks = [];
    @observable isLoading = true;
    @observable isSaving = false;

    constructor(lectureId, courseTakingStore, courseBookmarksStore) {
        this.lectureId = lectureId;
        this.courseTakingStore = courseTakingStore;
        this.courseBookmarksStore = courseBookmarksStore;
    }

    @action
    onPlayerReady(player) {
        this.player = player;
        this.setVideoDuration();
        this.player.on && this.player.on('durationchange', this.setVideoDuration);
    }

    @autobind
    @action
    setVideoDuration() {
        // From Video.js player.duration() doc:
        // The video must have started loading before the duration can be known.
        this.videoDuration =
            this.player.duration && this.player.duration() ? this.player.duration() : 0;
    }

    @computed
    get bookmarks() {
        const bookmarks = this.courseBookmarksStore.allBookmarksByLecture[this.lectureId] || [];
        return [...bookmarks, ...this.socialBookmarks];
    }

    @autobind
    loadBookmarks() {
        const bookmarksPromise = this.courseBookmarksStore.loadBookmarks();
        const socialBookmarksPromise = fetchAllPages(
            `/users/me/subscribed-courses/${this.courseTakingStore.courseId}/lectures/${this.lectureId}/social-bookmarks/`,
            {
                page_size: 100,
                'fields[social_bookmark]': 'position,num_notes,type,lecture',
            },
        ).then(
            action((socialBookmarks) => {
                this.socialBookmarks = socialBookmarks.map((bookmark) => new Bookmark(bookmark));
            }),
        );
        return Promise.all([bookmarksPromise, socialBookmarksPromise]).then(
            action(() => {
                this.isLoading = false;
            }),
        );
    }

    @action
    setActive(id, withPlayerControl = true) {
        this.activeBookmarkId = id;
        if (!withPlayerControl || !this.player || !this.player.el_) {
            return;
        }
        if (id) {
            if (this._playerWasPaused === undefined) {
                this._playerWasPaused = this.player.paused();
            }
            this.player.pause();
        } else {
            if (this._playerWasPaused === false) {
                this.player.play();
            }
            delete this._playerWasPaused;
        }
    }

    @autobind
    @action
    newBookmark(event) {
        if (this.isLoading || !this.player) {
            return;
        }
        event && event.preventDefault();
        const time = Math.floor(this.player.currentTime());
        if (this.bookmarksByTime[time] && !this.bookmarksByTime[time].isSocialBookmark) {
            return;
        }
        if (!this.player.isFullscreen_) {
            window.location.hash = `#${TABS.NOTES}`;
            this.courseBookmarksStore.setIsCreateBookmarkButtonActive(true);
            return;
        }
        const currentCurriculumItem = this.courseTakingStore.currentCurriculumItem;
        const bookmark = new Bookmark({
            id: -1,
            position: time,
            lecture: {
                id: currentCurriculumItem.id,
                object_index: currentCurriculumItem.objectIndex,
                title: currentCurriculumItem.title,
            },
        });
        this.courseBookmarksStore.addBookmark(bookmark);
        this.setActive(-1);
        return bookmark;
    }

    save(bookmark) {
        let promise;
        if (bookmark.id === -1) {
            promise = this.courseBookmarksStore.create(bookmark);
        } else {
            promise = this.courseBookmarksStore.update(bookmark);
        }
        return promise.then(() => {
            bookmark.originalBody = bookmark.body;
        });
    }

    delete(bookmark) {
        this.setActive(null);
        return this.courseBookmarksStore.delete(bookmark);
    }

    @computed
    get bookmarksByTime() {
        return this.bookmarks.reduce((acc, bookmark) => {
            // Allow only one bookmark per time position, with personal bookmarks trumping social bookmarks.
            if (!acc[bookmark.position] || acc[bookmark.position].isSocialBookmark) {
                acc[bookmark.position] = bookmark;
            }
            return acc;
        }, {});
    }

    @computed
    get normalisedBookmarks() {
        return Object.values(this.bookmarksByTime);
    }
}
