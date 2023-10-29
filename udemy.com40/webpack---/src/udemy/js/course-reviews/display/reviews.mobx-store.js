import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {
    MoreReviewsLoadEvent,
    ReviewsSearchQuerySubmitEvent,
    ReviewsFilterSubmitEvent,
} from 'course-landing-page/events';
import udApi from 'utils/ud-api';
import udMe from 'utils/ud-me';
import Raven from 'utils/ud-raven';

import makeRenderContent from './make-render-content';
import SearchWidgetStore from './search-widget.mobx-store';

/* TODO:
    - Refactor store to be course object agnostic
        - courseId -> reviewableObjectId
        - Add reviewableObjectType
        - courseTrackingId -> frontendTrackingId
        - fetching reviews per object rather than just per course
*/
export default class ReviewsStore {
    @observable reviews = [];
    @observable isLoading = false;
    @observable hideShowMoreButton = false;
    @observable selectedRating = null;
    @observable searchedTerm = null;
    @observable failedResponse = false;
    @observable showMoreBtnIsLoading = false;
    @observable reviewSummarySeen = false;
    @observable.ref courseId;
    @observable.ref courseTrackingId;
    @observable.ref pageSize;
    @observable.ref page;
    @observable.ref averageRating;
    @observable.ref searchWidgetStore;
    @observable.ref ratingDistribution;
    @observable.ref topReviewAttributes;
    @observable.ref totalDistributionCount;
    @observable.ref useCache;

    constructor(
        courseId,
        courseTrackingId,
        ratingDistribution,
        averageRating,
        topReviewAttributes,
        pageSize,
        useCache = true,
    ) {
        const page = 1;
        const searchWidgetStore = new SearchWidgetStore();
        const totalDistributionCount = ratingDistribution.reduce(
            (total, range) => total + range.count,
            0,
        );
        this.courseId = courseId;
        this.courseTrackingId = courseTrackingId;
        this.pageSize = pageSize;
        this.page = page;
        this.averageRating = averageRating;
        this.searchWidgetStore = searchWidgetStore;
        this.ratingDistribution = ratingDistribution;
        this.topReviewAttributes = topReviewAttributes;
        this.totalDistributionCount = totalDistributionCount;
        this.useCache = useCache;
    }

    @autobind
    @action
    fetchReviews({shouldAppend = false, callback = this.onReviewsFetched} = {}) {
        const endpointUrl = `/courses/${this.courseId}/reviews/`;
        this.isLoading = !shouldAppend;
        this.failedResponse = false;
        const params = {
            courseId: this.courseId,
            page: this.page,
            page_size: this.pageSize,
            is_text_review: 1,
            search: this.searchedTerm,
            rating: this.selectedRating,
            ordering: 'course_review_score__rank,-created',
            'fields[course_review]':
                '@default,response,content_html,created_formatted_with_time_since',
            'fields[user]': '@min,image_50x50,initials,public_display_name,tracking_id',
            'fields[course_review_response]':
                '@min,user,content_html,created_formatted_with_time_since',
        };
        return udApi
            .get(endpointUrl, {params, useCache: this.useCache})
            .then(
                action((response) => {
                    const reviewsOnResponse = response.data.results || [];
                    if (this.courseTrackingId && this.page > 1) {
                        Tracker.publishEvent(
                            new MoreReviewsLoadEvent(
                                this.courseTrackingId,
                                reviewsOnResponse.length,
                                this.courseId,
                                'course',
                            ),
                        );
                    }
                    if (shouldAppend) {
                        this.reviews = this.reviews.concat(reviewsOnResponse);
                    } else {
                        this.reviews = reviewsOnResponse;
                    }
                    this.hideShowMoreButton = response.data.next === null;
                    callback();
                }),
            )
            .catch(
                action((e) => {
                    Raven.captureException(e);
                    this.failedResponse = true;
                    this.isLoading = false;
                }),
            );
    }

    @computed
    get isReviewSectionVisible() {
        return this.averageRating !== 0 && this.totalDistributionCount !== 0;
    }

    @autobind
    @action
    onReviewsFetched() {
        this.isLoading = false;
    }

    @autobind
    renderContent(content, shouldUseSeparateParagraphs = true) {
        return makeRenderContent(this.searchedTerm)(content, shouldUseSeparateParagraphs);
    }

    @autobind
    @action
    onSearchSubmitted(query) {
        this.searchedTerm = query;
        this.page = 1;
        if (this.courseTrackingId) {
            Tracker.publishEvent(
                new ReviewsSearchQuerySubmitEvent(
                    this.courseTrackingId,
                    this.searchedTerm,
                    this.courseId,
                    'course',
                ),
            );
        }
        return this.fetchReviews({
            callback: () => {
                this.onReviewsFetched();
                this.searchWidgetStore.showClearButton();
            },
        });
    }

    @autobind
    @action
    onSearchCleared() {
        this.page = 1;
        this.searchedTerm = null;
        return this.fetchReviews();
    }

    @autobind
    @action
    onRatingSelected(rating) {
        this.page = 1;
        this.selectedRating = rating;
        if (this.courseTrackingId) {
            Tracker.publishEvent(
                new ReviewsFilterSubmitEvent(
                    this.courseTrackingId,
                    this.selectedRating || null,
                    this.searchedTerm,
                    this.courseId,
                    'course',
                ),
            );
        }
        return this.fetchReviews();
    }

    @autobind
    @action
    onReviewSummarySeen() {
        if (!this.reviewSummarySeen && !udMe.isLoading) {
            this.reviewSummarySeen = true;
        }
    }

    onResetControls() {
        this.page = 1;
        this.selectedRating = null;
        this.searchedTerm = null;
        this.searchWidgetStore.clearSearchTerm();
    }

    @autobind
    @action
    loadMore() {
        this.showMoreBtnIsLoading = true;
        this.page++;
        return this.fetchReviews({
            shouldAppend: true,
            callback: () => {
                this.onReviewsFetched();
                this.showMoreBtnIsLoading = false;
            },
        });
    }
}
