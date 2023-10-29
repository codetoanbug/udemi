import autobind from 'autobind-decorator';
import {action, extendObservable, computed, runInAction} from 'mobx';

import {ListEvents} from 'browse/components/save-to-list/constants';
import {attachFrontendTrackingIds} from 'browse/tracking';
import {showReloadPageErrorToast} from 'course-taking/toasts';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

import {getEnrolledCourseFields, getReviewsForCourses} from './my-courses.mobx-store';
import {updateSearchParams} from './search-params';

export default class CollectionsStore {
    pageSize = 6;
    courseLimit = 8;
    activeTab = 'collection_tab';

    constructor(location, history) {
        extendObservable(this, {
            isLoading: true,
            collections: [],
            currentPage: 1,
            count: 0,
        });
        this.location = location;
        this.history = history;
        document.addEventListener(ListEvents.ADD, this.handleAddToListEvent);
        document.addEventListener(ListEvents.REMOVE, this.handleRemoveFromListEvent);
        document.addEventListener(ListEvents.CREATE, this.handleCreateNewListEvent);
    }

    @computed
    get pageCount() {
        return this.count ? Math.ceil(this.count / this.pageSize) : 0;
    }

    @computed
    get showZeroState() {
        return this.collections.length === 0;
    }

    @autobind
    handleAddToListEvent(event) {
        this.addCourseToCollection(event.detail.course, event.detail.listId);
    }

    @autobind
    @action
    addCourseToCollection(course, collectionId) {
        const collection = this.collections.find((collection) => collection.id === collectionId);
        if (collection) {
            collection.courses.unshift(course);
        }
    }

    @autobind
    handleRemoveFromListEvent(event) {
        this.removeCourseFromCollection(event.detail.course, event.detail.listId);
    }

    @autobind
    @action
    removeCourseFromCollection(course, collectionId) {
        const collection = this.collections.find((collection) => collection.id === collectionId);
        if (collection) {
            collection.courses = collection.courses.filter((c) => c.id !== course.id);
        }
    }

    @action
    removeCollection(id) {
        if (this.collections.find((collection) => collection.id === id)) {
            this.collections = this.collections.filter((collection) => collection.id !== id);

            this.count--;

            if (this.collections.length === 0 && this.pageCount > 0) {
                let page = this.currentPage;
                if (this.currentPage > this.pageCount && this.currentPage > 1) {
                    page--;
                }
                updateSearchParams({p: `${page}`}, this.history);
            }
        }
    }

    @autobind
    handleCreateNewListEvent() {
        this.loadCollectionsWithCourses();
    }

    @action
    async loadCollectionsWithCourses() {
        this.isLoading = true;
        const defaultParams = {
            ordering: this.ordering,
            'fields[course]': getCollectionCourseFields().join(','),
            'fields[user_has_subscribed_courses_collection]': '@all',
            page: this.currentPage,
            page_size: this.pageSize,
            course_limit: this.courseLimit + 1,
        };
        try {
            const response = await udApi.get('/users/me/subscribed-courses-collections/', {
                params: defaultParams,
            });
            const results = response.data.results || [];
            this.collections = results.map((collection) => {
                collection.hasMoreCourses = collection.courses.length > this.courseLimit;
                collection.courses = collection.courses.slice(0, this.courseLimit);
                return collection;
            });

            const coursesById = {};
            this.collections.forEach((collection) => {
                collection.courses.forEach((course) => {
                    if (!coursesById[course.id]) {
                        coursesById[course.id] = course;
                    }
                });
                attachFrontendTrackingIds(collection.courses);
            });

            await getReviewsForCourses(Object.values(coursesById));
            runInAction(() => {
                this.collections.forEach((collection) => {
                    collection.courses.forEach((course, idx) => {
                        collection.courses[idx] = coursesById[course.id];
                    });
                });
                this.count = response.data.count;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.isLoading = false;
                showReloadPageErrorToast(gettext('Error loading collections'));
                Raven.captureException(error);
            });
        }
    }
}

export function getCollectionCourseFields() {
    const courseFields = new Set(getEnrolledCourseFields());
    courseFields.delete('num_collections');
    return [...courseFields];
}
