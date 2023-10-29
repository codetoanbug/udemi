import {ClientSideRender} from '@udemy/design-system-utils';
import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {Button} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CourseLandingComponentsStore from 'course-landing-page/course-landing-components.mobx-store';
import {
    ReviewsImpressionEvent,
    RatingsSummaryImpressionEvent,
    SeeMoreReviewsClickEvent,
} from 'course-landing-page/events';
import ReviewSummaryWidget from 'course-reviews/common/review-summary/review-summary-widget.react-component';
import HelpfulnessStore from 'course-reviews/display/helpfulness.mobx-store';
import ReviewsStore from 'course-reviews/display/reviews.mobx-store';
import escapeHtml from 'utils/escape/escape-html';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import {isomorphic} from 'utils/isomorphic-rendering';

import CourseReviewDisplaySkeleton, {
    ReviewListSkeleton,
} from './course-review-display-skeleton.react-isocomponent';
import IndividualReview from './individual-review.react-component';
import RatingsFilter from './ratings-filter.react-component';
import SearchWidget from './search-widget.react-component';
import TopReviewAttributes from './top-review-attributes.react-component';

import './reviews-section.less';

export function noReviewsMessage(store) {
    if (!store.selectedRating) {
        if (!store.searchedTerm) {
            return {
                purpose: 'no-comments-message',
                message: gettext('There are no written comments for this course yet.'),
            };
        }
        return {
            purpose: 'no-matched-comments-message',
            message: gettext('No reviews matched your search. Try searching with another term.'),
        };
    }
    if (!store.searchedTerm) {
        return {
            purpose: 'no-selected-comments-message',
            message: gettext(
                "There are no written comments for the rating you've selected. " +
                    'Please select another rating or clear your selection to view ' +
                    'all written comments for this course.',
            ),
        };
    }
    return {
        purpose: 'no-selected-matched-comments-message',
        message: gettext(
            'Your search returned no results with the selected rating. ' +
                'Try clearing your selection to see reviews matching your search.',
        ),
    };
}

export function reviewSectionUnavailableMessage(store) {
    if (store.averageRating === 0) {
        return {
            purpose: 'no-reviews-yet',
            message: gettext("This course doesn't have any reviews yet."),
        };
    }
    return {
        purpose: 'review-section-not-ready',
        message: gettext('Reviews are being updated for this course.'),
    };
}

@isomorphic
@observer
export default class CourseReviewDisplay extends Component {
    static propTypes = {
        clcStore: PropTypes.instanceOf(CourseLandingComponentsStore),
        reviewsStore: PropTypes.object,
        courseTrackingId: PropTypes.string,
        reviewableObjectId: PropTypes.number,
        reviewableObjectType: PropTypes.string,
    };

    static defaultProps = {
        clcStore: null,
        reviewsStore: null,
        courseTrackingId: undefined,
        reviewableObjectId: undefined,
        reviewableObjectType: undefined,
    };

    componentDidMount() {
        this.props.clcStore.getOrPopulate(['reviews_context']).then(this.updateReviews);
    }

    @observable.ref reviews;

    get placeholder() {
        return <CourseReviewDisplaySkeleton />;
    }

    get reviewDisplay() {
        if (!this.reviews || !this.store) {
            return this.placeholder;
        }
        return (
            <div data-purpose="course-reviews">
                <h2 styleName="title" className="ud-heading-xl">
                    {gettext('Student feedback')}
                </h2>

                {!this.store.isReviewSectionVisible ? (
                    <NoReviewsMessage message={reviewSectionUnavailableMessage(this.store)} />
                ) : (
                    this.renderRatingsAndReviews()
                )}
            </div>
        );
    }

    @autobind @action updateReviews(componentProps) {
        this.reviews = componentProps?.reviews_context;
        // Allow a reviewsstore to be passed in for testing purposes -- it's not recommended to actually use this,
        // lest you run the risk the context retrieved from the clc store and reviews store have out-of-sync data.
        if (this.props.reviewsStore) {
            this.store = this.props.reviewsStore;
        } else {
            this.store = new ReviewsStore(
                this.reviews.courseId,
                this.props.courseTrackingId,
                this.reviews.ratingDistribution,
                this.reviews.averageRating,
                this.reviews.topReviewAttributes,
            );
        }
        this.store.fetchReviews({callback: this.onReviewsFirstFetched});
    }

    @observable showSkeleton = true;

    @autobind @action onReviewsFirstFetched() {
        this.store.onReviewsFetched();
        this.showSkeleton = false;
    }

    @autobind
    trackRatingsSummaryImpression() {
        const {courseTrackingId, reviewableObjectId, reviewableObjectType} = this.props;
        if (courseTrackingId) {
            Tracker.publishEvent(
                new RatingsSummaryImpressionEvent(
                    courseTrackingId,
                    reviewableObjectId,
                    reviewableObjectType,
                ),
            );
        }
    }

    renderRatingsAndReviews() {
        return (
            <div data-purpose="ratings-and-reviews">
                <TrackImpression trackFunc={this.trackRatingsSummaryImpression}>
                    <div styleName="stats-container">
                        <ReviewSummaryWidget
                            isFreeSEOExp={this.reviews.isFreeSEOExp}
                            averageRating={this.store.averageRating}
                            ratingDistribution={this.store.ratingDistribution}
                            selectedRating={this.store.selectedRating}
                            onRatingSelected={this.store.onRatingSelected}
                            onSeen={this.store.onReviewSummarySeen}
                            totalDistributionCount={this.store.totalDistributionCount}
                        />
                    </div>
                </TrackImpression>

                <TopReviewAttributes topReviewAttributes={this.store.topReviewAttributes} />

                <SubTitle
                    store={this.store}
                    courseTrackingId={this.props.courseTrackingId}
                    reviewableObjectId={this.props.reviewableObjectId}
                    reviewableObjectType={this.props.reviewableObjectType}
                />

                {this.showSkeleton ? (
                    <ReviewListSkeleton
                        totalDistributionCount={this.store.totalDistributionCount}
                    />
                ) : null}

                {!this.showSkeleton && this.store.isLoading ? (
                    <div styleName="reviews-loader">
                        <Loader styleName="reviews-loader" size="medium" />
                    </div>
                ) : null}

                {!this.showSkeleton && !this.store.isLoading && !this.store.failedResponse
                    ? this.renderReviews()
                    : null}
            </div>
        );
    }

    renderReviews() {
        const {page} = this.reviews;
        return (
            <div>
                {!this.store.reviews.length ? (
                    <div>
                        <NoReviewsMessage message={noReviewsMessage(this.store)} />
                    </div>
                ) : (
                    <div>
                        <ReviewsList
                            store={this.store}
                            page={page}
                            courseTrackingId={this.props.courseTrackingId}
                            reviewableObjectId={this.props.reviewableObjectId}
                            reviewableObjectType={this.props.reviewableObjectType}
                        />
                        <ShowMore
                            store={this.store}
                            courseTrackingId={this.props.courseTrackingId}
                            reviewableObjectId={this.props.reviewableObjectId}
                            reviewableObjectType={this.props.reviewableObjectType}
                        />
                    </div>
                )}
            </div>
        );
    }

    render() {
        return (
            <div className="component-margin">
                <span id="reviews" className="in-page-offset-anchor"></span>
                <ClientSideRender placeholder={this.placeholder}>
                    {this.reviewDisplay}
                </ClientSideRender>
            </div>
        );
    }
}

export const SearchedTerm = observer(({store}) => {
    let ratingApplied;
    const isRatingSelected = store.selectedRating;

    if (!store.searchedTerm) {
        return null;
    }

    if (isRatingSelected) {
        ratingApplied = ninterpolate(
            '%(ratingSelected)s star filter applied: ',
            '%(ratingSelected)s stars filter applied: ',
            store.selectedRating,
            {
                ratingSelected: store.selectedRating,
            },
        );
    }

    if (store.reviews.length) {
        const reviewCountAndTerm = ninterpolate(
            "%(reviewsCount)s review mentioning '<b>%(searchTerm)s</b>'",
            "%(reviewsCount)s reviews mentioning '<b>%(searchTerm)s</b>'",
            store.reviews.length,
            {
                reviewsCount: store.reviews.length,
                searchTerm: escapeHtml(store.searchedTerm),
            },
        );

        return (
            <>
                {isRatingSelected && <span className="ud-sr-only">{ratingApplied}</span>}
                <div
                    styleName="searched-term"
                    {...safelySetInnerHTML({
                        descriptionOfCaller:
                            'examples/react-with-axios-and-mobx-with-tests:course-description-on-main-page',
                        html: reviewCountAndTerm,
                        dataPurpose: 'reviews-search-subtitle',
                    })}
                />
            </>
        );
    }

    return (
        <div
            styleName="searched-term"
            {...safelySetInnerHTML({
                descriptionOfCaller:
                    'examples/react-with-axios-and-mobx-with-tests:course-description-on-main-page',
                html: interpolate(
                    gettext("No reviews mentioning '<b>%(searchTerm)s</b>'"),
                    {
                        searchTerm: escapeHtml(store.searchedTerm),
                    },
                    true,
                ),
                dataPurpose: 'reviews-search-subtitle',
            })}
        />
    );
});

export const SubTitle = observer(
    ({store, courseTrackingId, reviewableObjectId, reviewableObjectType}) => {
        function trackReviewsImpression() {
            if (courseTrackingId) {
                Tracker.publishEvent(
                    new ReviewsImpressionEvent(
                        courseTrackingId,
                        reviewableObjectId,
                        reviewableObjectType,
                    ),
                );
            }
        }

        return (
            <TrackImpression trackFunc={trackReviewsImpression}>
                <div styleName="sub-title">
                    <h2 className="ud-heading-xl">{gettext('Reviews')}</h2>
                    <div styleName="controls">
                        <div styleName="search-filter">
                            <SearchWidget
                                onSubmit={store.onSearchSubmitted}
                                onClear={store.onSearchCleared}
                                store={store.searchWidgetStore}
                            />
                        </div>
                        <div styleName="ratings-filter">
                            <RatingsFilter store={store} />
                        </div>
                    </div>
                    {/* div role="status" needs to always be on the page to proper work for SR users */}
                    <div role="status">
                        <SearchedTerm store={store} />
                    </div>
                </div>
            </TrackImpression>
        );
    },
);

export const NoReviewsMessage = observer(({message}) => (
    <span data-purpose={message.purpose}>{message.message}</span>
));

export const ReviewsList = observer(
    ({store, page, courseTrackingId, reviewableObjectId, reviewableObjectType}) => (
        <div data-purpose="landing-page-review-list">
            {store.reviews.map((review, viewPosition) => (
                <div styleName="review-container" key={review.id}>
                    <IndividualReview
                        review={review}
                        helpfulnessStore={
                            new HelpfulnessStore(review.id, viewPosition, store.courseId, page, {})
                        }
                        renderContent={store.renderContent}
                        viewPosition={viewPosition}
                        courseTrackingId={courseTrackingId}
                        reviewableObjectId={reviewableObjectId}
                        reviewableObjectType={reviewableObjectType}
                    />
                </div>
            ))}
        </div>
    ),
);

export const ShowMore = observer(
    ({store, courseTrackingId, reviewableObjectId, reviewableObjectType}) => {
        function trackSeeMoreReviewsClick() {
            if (courseTrackingId) {
                Tracker.publishEvent(
                    new SeeMoreReviewsClickEvent(
                        courseTrackingId,
                        reviewableObjectId,
                        reviewableObjectType,
                    ),
                );
            }
        }

        function onSeeMoreReviewsClicked() {
            trackSeeMoreReviewsClick();
            store.loadMore();
        }

        return (
            <div styleName="reviews-show-more" data-purpose="show-more-review-button-wrapper">
                {store.hideShowMoreButton ? null : (
                    <Button
                        data-purpose="show-more-review-button"
                        disabled={store.showMoreBtnIsLoading}
                        onClick={onSeeMoreReviewsClicked}
                        size="medium"
                        udStyle="secondary"
                    >
                        {store.showMoreBtnIsLoading ? (
                            <Loader color="inherit" size="medium" />
                        ) : null}
                        {gettext('See more reviews')}
                    </Button>
                )}
            </div>
        );
    },
);
