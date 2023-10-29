import autobind from 'autobind-decorator';
import {action, runInAction, extendObservable, computed, observable} from 'mobx';

import {attachFrontendTrackingIds} from 'browse/tracking';
import {showErrorToast} from 'course-taking/toasts';
import ShoppingClientStore from 'shopping-client/shopping-client.mobx-store';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

export class WishlistedCourseModel {
    @observable isWishlisted = true;
    @observable isWishlisting = false;

    constructor(course) {
        Object.assign(this, course);
    }

    @autobind
    @action
    async toggleIsWishlisted() {
        if (this.isWishlisting) {
            return;
        }

        this.isWishlisting = true;
        let isWishlisted = this.isWishlisted;
        try {
            const buyable = {buyable_object_type: 'course', id: this.id};
            if (isWishlisted) {
                await ShoppingClientStore.removeFromList('wishlist', {buyable});
            } else {
                await ShoppingClientStore.addToList('wishlist', {buyable});
            }
            isWishlisted = !isWishlisted;
        } catch (error) {
            if (error.response && error.response.data.detail) {
                showErrorToast(error.response.data.detail);
            }
        }

        runInAction(() => {
            this.isWishlisted = isWishlisted;
            this.isWishlisting = false;
        });
    }
}

export default class WishlistedCoursesStore {
    pageSize = 12;
    searchQuery = '';
    @observable currentPage = 1;

    constructor(appendCourses = false) {
        this.appendCourses = appendCourses;
        extendObservable(this, {
            isLoading: true,
            courses: [],
            count: 0,
        });
    }

    @computed
    get pageCount() {
        return this.count ? Math.ceil(this.count / this.pageSize) : 0;
    }

    @computed
    get showZeroState() {
        return !this.searchQuery && this.courses.length === 0;
    }

    @action
    loadCourses() {
        this.isLoading = true;
        const courseFields = [
            'buyable_object_type',
            'content_info',
            'discount',
            'image_240x135',
            'image_480x270',
            'num_published_lectures',
            'num_reviews',
            'price',
            'price_detail',
            'price_serve_tracking_id',
            'rating',
            'title',
            'tracking_id',
            'url',
            'visible_instructors',
            'objectives_summary',
            'last_update_date',
            'published_time',
            'badges',
            'is_user_subscribed',
            'is_in_user_subscription',
            'has_closed_caption',
            'has_508_closed_captions',
            'instructional_level',
            'learn_url',
            'free_course_subscribe_url',
            'headline',
            'is_paid',
        ];
        const params = {
            ordering: this.ordering,
            'fields[course]': courseFields.join(','),
            'fields[user]': '@default',
            page: this.currentPage,
            page_size: this.pageSize,
            ...(this.searchQuery && {search: this.searchQuery}),
        };

        udApi
            .get('/users/me/wishlisted-courses/', {
                params,
            })
            .then(
                action((response) => {
                    const courses = (response.data.results || []).map((course) => {
                        return new WishlistedCourseModel(course);
                    });
                    attachFrontendTrackingIds(courses);
                    if (this.appendCourses) {
                        this.courses.push(...courses);
                    } else {
                        this.courses = courses;
                    }
                    this.count = response.data.count;
                    this.isLoading = false;
                }),
            )
            .catch(
                action((error) => {
                    this.isLoading = false;
                    Raven.captureException(error);
                }),
            );
    }
}
