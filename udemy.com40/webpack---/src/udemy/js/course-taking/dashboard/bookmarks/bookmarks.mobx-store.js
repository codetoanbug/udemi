import autobind from 'autobind-decorator';
import {action, computed, observable, reaction} from 'mobx';

import debounce from 'utils/debounce';
import udApi, {fetchAllPages} from 'utils/ud-api';

import {TRACKING_CATEGORIES} from '../../constants';
import {ITEM_TYPES} from '../../curriculum/constants';
import Bookmark from './bookmark.mobx-model';
import {
    API_DEBOUNCE_INTERVAL,
    LECTURE_FILTER,
    PAGE_SIZE_BOOKMARKS,
    SORT_BY,
    TRACKING_ACTIONS,
} from './constants';

export default class BookmarksStore {
    @observable bookmarks = [];
    @observable hasLoaded = false;
    @observable lectureFilter = LECTURE_FILTER.ALL;
    @observable sortBy = SORT_BY.RECENCY;
    @observable isCreateBookmarkButtonActive = false;

    constructor(courseTakingStore) {
        this.courseTakingStore = courseTakingStore;

        reaction(
            () => [this.sortBy, this.lectureFilter],
            debounce(this.reset, API_DEBOUNCE_INTERVAL),
        );
    }

    get courseBookmarksUrl() {
        return `/users/me/subscribed-courses/${this.courseTakingStore.courseId}/notes/`;
    }

    lectureBookmarksUrl(lectureId) {
        return `/users/me/subscribed-courses/${this.courseTakingStore.courseId}/lectures/${lectureId}/notes/`;
    }

    @autobind
    @action
    updateLectureFilter(lectureFilter) {
        if (this.lectureFilter === lectureFilter) {
            return;
        }
        const action =
            lectureFilter === LECTURE_FILTER.ALL
                ? TRACKING_ACTIONS.FILTER_ALL_LECTURES
                : TRACKING_ACTIONS.FILTER_CURRENT_LECTURE;
        this.courseTakingStore.track(TRACKING_CATEGORIES.BOOKMARK_FILTER, action);
        this.lectureFilter = lectureFilter;
    }

    @action
    setIsCreateBookmarkButtonActive(value) {
        this.isCreateBookmarkButtonActive = value;
    }

    @autobind
    @action
    updateSortingKey(sortBy) {
        if (this.sortBy === sortBy) {
            return;
        }
        const action =
            sortBy === SORT_BY.RECENCY
                ? TRACKING_ACTIONS.SORT_BY_RECENCY
                : TRACKING_ACTIONS.SORT_BY_OLDEST;
        this.courseTakingStore.track(TRACKING_CATEGORIES.BOOKMARK_SORT, action);
        this.sortBy = sortBy;
    }

    @autobind
    @action
    reset() {
        this.hasLoaded = false;
        this.bookmarks = [];
        return this.loadBookmarks();
    }

    loadBookmarks() {
        if (this.hasLoaded) {
            if (this.lectureFilter === LECTURE_FILTER.CURRENT) {
                return this.reset();
            }
            return Promise.resolve();
        }
        const params = {
            'fields[lecture]': 'id,title,object_index',
            'fields[note]': '@default,lecture,created',
            page_size: PAGE_SIZE_BOOKMARKS,
        };
        const url =
            this.lectureFilter === LECTURE_FILTER.ALL
                ? this.courseBookmarksUrl
                : this.lectureBookmarksUrl(this.courseTakingStore.currentCurriculumItemId);
        if (this.sortBy === SORT_BY.OLDEST) {
            params.ordering = 'id';
        }
        return fetchAllPages(url, params).then(
            action((results) => {
                results.forEach((bookmark) => {
                    if (
                        (!this.courseTakingStore.coursePortion ||
                            !!this.courseTakingStore.coursePortion.selectedItemsMap[
                                [bookmark.lecture._class, bookmark.lecture.id]
                            ]) &&
                        !this.bookmarks.some((currBookmark) => currBookmark.id === bookmark.id)
                    ) {
                        // If course portion selected - include only bookmarks to portion items
                        this.bookmarks.push(new Bookmark(bookmark));
                    }
                });
                this.hasLoaded = true;
            }),
        );
    }

    // Easiest way to maintain old code with experiment code
    // TODO: refactor when updating/removing old video boomkmark implementation
    @autobind
    @action
    addBookmark(newBookmark) {
        if (!this.bookmarks.some((bookmark) => bookmark.key === newBookmark.key)) {
            if (this.sortBy === SORT_BY.RECENCY) {
                this.bookmarks.unshift(newBookmark);
            } else {
                this.bookmarks.push(newBookmark);
            }
        }
    }

    create(bookmark) {
        const {body, position, lectureId} = bookmark;

        return udApi
            .post(
                `${this.lectureBookmarksUrl(lectureId)}`,
                {body, position},
                {params: {'fields[note]': 'id'}},
            )
            .then(
                action((response) => {
                    bookmark.id = response.data.id;
                    bookmark.originalBody = bookmark.body;
                    this.addBookmark(bookmark);
                }),
            );
    }

    update(bookmark) {
        const {body, id, lectureId} = bookmark;
        return udApi.patch(`${this.lectureBookmarksUrl(lectureId)}${id}/`, {body});
    }

    delete(bookmark) {
        const {id, lectureId} = bookmark;
        const promise =
            id === -1
                ? Promise.resolve()
                : udApi.delete(`${this.lectureBookmarksUrl(lectureId)}${id}/`);
        return promise.then(
            action(() => {
                const bookmarkIndex = this.bookmarks.findIndex((bookmark) => bookmark.id === id);
                this.bookmarks.splice(bookmarkIndex, 1);
            }),
        );
    }

    bookmarksByLecture(includeNew) {
        // Maps lecture database ids to arrays of bookmarks.
        const map = this.bookmarks.reduce((acc, bookmark) => {
            if (!includeNew && bookmark.id === -1) {
                return acc;
            }
            const {lectureId} = bookmark;
            if (!acc[lectureId]) {
                acc[lectureId] = [];
            }
            acc[lectureId].push(bookmark);
            return acc;
        }, {});
        for (const bookmarks of Object.values(map)) {
            bookmarks.sort((a, b) => a.position - b.position);
        }
        return map;
    }

    @computed
    get allBookmarksByLecture() {
        return this.bookmarksByLecture(true);
    }

    @computed
    get savedBookmarksByLecture() {
        return this.bookmarksByLecture(false);
    }

    @computed
    get bookmarksByLectureBySection() {
        // Maps section curriculum ids to lecture curriculum ids, which are mapped to arrays of bookmarks.
        return this.courseTakingStore.curriculumSections.reduce((acc, section, sectionIndex) => {
            section.items.forEach((lecture, lectureIndex) => {
                const bookmarks = this.savedBookmarksByLecture[lecture.id];
                if (bookmarks) {
                    if (!acc[sectionIndex]) {
                        acc[sectionIndex] = {};
                    }
                    acc[sectionIndex][lectureIndex] = bookmarks;
                }
            });
            return acc;
        }, {});
    }

    @computed
    get allBookmarksWithSection() {
        // Return an array of objects with a bookmark and section.
        const bookmarksWithSection = [];
        this.bookmarks.forEach((bookmark) => {
            const context = this.courseTakingStore.getCurriculumItemContextByTypeAndId(
                ITEM_TYPES.LECTURE,
                bookmark.lectureId,
            );
            const lecture = context.curriculumItem;
            if (lecture && lecture.id) {
                bookmarksWithSection.push({section: context.section, bookmark});
            }
        });
        return bookmarksWithSection;
    }

    hasBookmarkAtTime(time) {
        const lectureId = this.courseTakingStore.currentCurriculumItem.id;
        const lectureBookmarks = this.allBookmarksByLecture[lectureId];
        if (!lectureBookmarks) {
            return false;
        }
        return lectureBookmarks.some((bookmark) => bookmark.position === time);
    }

    getBookmarkByTime(time) {
        const lectureId = this.courseTakingStore.currentCurriculumItem?.id;
        const lectureBookmarks = this.allBookmarksByLecture[lectureId];
        if (!lectureBookmarks) {
            return null;
        }
        return lectureBookmarks.find((bookmark) => bookmark.position === time);
    }
}
