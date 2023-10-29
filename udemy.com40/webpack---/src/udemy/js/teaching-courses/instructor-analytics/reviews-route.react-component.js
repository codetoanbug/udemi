import {Tracker} from '@udemy/event-tracking';
import NextIcon from '@udemy/icons/dist/next.ud-icon';
import {Button, Image, Link} from '@udemy/react-core-components';
import {Checkbox} from '@udemy/react-form-components';
import {Dropdown} from '@udemy/react-menu-components';
import {AlertBanner, Badge} from '@udemy/react-messaging-components';
import {Pagination} from '@udemy/react-navigation-components';
import autobind from 'autobind-decorator';
import {runInAction} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {API_STATE} from 'instructor/constants';
import DescriptionDropdown from 'instructor/layout/description-dropdown.react-component';
import IAResponsiveHeader from 'instructor/layout/ia-responsive-header.react-component';
import {noop} from 'utils/noop';
import qs from 'utils/query-params';

import BrowseImage from '../../instructor/assets/images/browse.png';
import {PopoverTour} from '../../instructor/popover-tour/popover-tour.react-component';
import {WelcomeModal} from '../../instructor/welcome-modal/welcome-modal.react-component';
import InstructorAlerts from '../instructor-dashboard/instructor-alerts.react-component';
import CourseReviewExportCSV from '../reviews/course-review-export-csv.react-component';
import ReviewSummaryStore from '../reviews/review-summary.mobx-store';
import ReviewSummary from '../reviews/review-summary.react-component';
import ReviewStore from '../reviews/review.mobx-store';
import Review from '../reviews/review.react-component';
import {
    ALL_COURSE_OPTION,
    DATA_SCOPE_FILTERS,
    DATA_SCOPE_FILTERS as DATA_SCOPE_FILTER,
    DEFAULT_DATA_SCOPE_FILTER,
    missingPermissionMessageReviews,
} from './constants';
import {InstructorUBOnlyReviewsPageViewEvent} from './events';
import {ubOnlyInsightsPopoverTourSteps} from './popover-tour-steps';
import {DATA_SCOPE_LABELS, SORTS, STARS} from './reviews.mobx-store';
import {
    SearchState,
    ErrorState,
    NoPermissionInstructor,
    NoPermissionCourse,
} from './search-and-error-states.react-component';
import {ubOnlyInsightsWelcomeModalSteps} from './welcome-modal-data';
import './reviews-route.less';

export const CourseHeader = ({course, onUpdateCourseFilter, showViewSummary}) => {
    const onViewSummary = () => {
        onUpdateCourseFilter(course.id);
    };

    return (
        <div styleName="course-header-container">
            <Image
                src={course.image_125_H}
                alt=""
                srcSet={`${course.image_125_H} 1x, ${course.image_200_H} 2x`}
                width={125}
                height={70}
                data-purpose="course-image"
            />
            <div styleName="course-header-details">
                <Link to={course.url} disableRouter={true} data-purpose="course-title">
                    {course.title}
                </Link>
                <div data-purpose="course-rating">
                    {interpolate(
                        gettext('%(rating)s Course Rating'),
                        {rating: course.rating.toFixed(2)},
                        true,
                    )}
                </div>
                {showViewSummary && (
                    <Button
                        udStyle="link"
                        onClick={onViewSummary}
                        size="small"
                        data-purpose="view-summary"
                    >
                        {gettext('View Course Summary')} <NextIcon />
                    </Button>
                )}
            </div>
        </div>
    );
};

CourseHeader.propTypes = {
    course: PropTypes.object.isRequired,
    onUpdateCourseFilter: PropTypes.func,
    showViewSummary: PropTypes.bool,
};

CourseHeader.defaultProps = {
    onUpdateCourseFilter: noop,
    showViewSummary: true,
};

export const StarFiltersDropdown = observer(({reviewsStore, onStarSelect}) => (
    <Dropdown
        data-purpose="star-filter-dropdown"
        placement="bottom-start"
        menuWidth="large"
        trigger={
            <Dropdown.Button
                className="ud-link-neutral"
                size="medium"
                typography="ud-text-sm"
                udStyle="ghost"
            >
                <span>{`${gettext('Rating')}:`}</span>
                <span className="ud-text-bold">{reviewsStore.starFilterTitle}</span>
            </Dropdown.Button>
        }
    >
        <Dropdown.Menu>
            {Object.keys(STARS).map((star) => (
                <Dropdown.MenuItem
                    key={star}
                    componentClass={Checkbox}
                    onClick={() => false}
                    onChange={onStarSelect}
                    name={star}
                    checked={reviewsStore.stars.indexOf(parseInt(star, 10)) !== -1}
                    data-purpose={`star-menu-item-${star}`}
                >
                    {STARS[star]}
                </Dropdown.MenuItem>
            ))}
        </Dropdown.Menu>
    </Dropdown>
));

StarFiltersDropdown.propTypes = {
    reviewsStore: PropTypes.object.isRequired,
    onStarSelect: PropTypes.func.isRequired,
};

export const AllCoursesReviews = observer(
    ({reviewsStore, onCourseSelect, isUBOnlyDataPreviewEnabled}) => {
        return (
            <div>
                {reviewsStore.reviews.map((review) => (
                    <div styleName="review" key={review.id}>
                        <CourseHeader
                            course={review.course}
                            onUpdateCourseFilter={onCourseSelect}
                        />
                        <Review
                            store={new ReviewStore(review)}
                            isUBOnlyDataPreviewEnabled={isUBOnlyDataPreviewEnabled}
                        />
                    </div>
                ))}
            </div>
        );
    },
);

AllCoursesReviews.propTypes = {
    reviewsStore: PropTypes.object.isRequired,
    onCourseSelect: PropTypes.func.isRequired,
    isUBOnlyDataPreviewEnabled: PropTypes.bool,
};

export const SingleCourseReviews = observer(
    ({reviewsStore, isRatingEnabled, isUBOnlyDataPreviewEnabled}) => {
        const reviewSummaryStore = new ReviewSummaryStore(
            reviewsStore.selectedCourse,
            reviewsStore.dataScope,
        );
        return (
            <div>
                <CourseHeader course={reviewsStore.selectedCourse} showViewSummary={false} />
                <div styleName="review-summary">
                    <ReviewSummary store={reviewSummaryStore} isRatingEnabled={isRatingEnabled} />
                </div>
                {reviewsStore.reviews.map((review) => (
                    <div styleName="review" key={review.id}>
                        <Review
                            store={new ReviewStore(review)}
                            isUBOnlyDataPreviewEnabled={isUBOnlyDataPreviewEnabled}
                        />
                    </div>
                ))}
            </div>
        );
    },
);

SingleCourseReviews.propTypes = {
    reviewsStore: PropTypes.object.isRequired,
    isUBOnlyDataPreviewEnabled: PropTypes.bool,
};

@inject('store')
@observer
export default class ReviewsRoute extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        isUBOnlyDataPreviewEnabled: PropTypes.bool,
    };

    static defaultProps = {
        isUBOnlyDataPreviewEnabled: false,
    };

    constructor(props) {
        super(props);
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        if (!queryParams.data_scope) {
            queryParams.data_scope = DEFAULT_DATA_SCOPE_FILTER;
            this.props.history.replace({
                pathname: this.props.location.pathname,
                search: qs.stringify(queryParams),
            });
        }

        const dataScope = this.getDataScopeFilter(queryParams);
        this.props.store.reviewsStore.getReviewsWithParams(this.props.location.search, dataScope);
        this.loadTaughtCoursesWithDataScope();
        // this.updateWelcomeModalState(this.isUBEnabled());
    }

    componentDidUpdate(prevProps) {
        if (!this.props.store.reviewsStore.isReviewsRouteInitialized) {
            runInAction(() => {
                this.updateWelcomeModalState(this.isUBEnabled());
                this.props.store.reviewsStore.isReviewsRouteInitialized = true;
            });
        }
        if (prevProps.location.search !== this.props.location.search) {
            this.props.store.reviewsStore.getReviewsWithParams(this.props.location.search);
            this.loadTaughtCoursesWithDataScope();
            const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
            if (queryParams.course_id && queryParams.data_scope === DATA_SCOPE_FILTER.UB) {
                this.props.store.reviewsStore.isCourseInUbEver(queryParams.course_id);
            }
        }
    }

    @autobind
    isUBEnabled() {
        const {reviewsStore} = this.props.store;
        const courseId = parseInt(reviewsStore.courseId, 10);
        const isUbCourseSelected = this.hasCourseId()
            ? reviewsStore.isCourseInUbEver(courseId)
            : true;
        return isUbCourseSelected && this.props.isUBOnlyDataPreviewEnabled;
    }

    @autobind
    loadTaughtCoursesWithDataScope(dataScope) {
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        if (!dataScope) {
            dataScope = queryParams.data_scope || DEFAULT_DATA_SCOPE_FILTER;
        }
        dataScope = this.getDataScopeFilter(queryParams);
        this.props.store.reviewsStore.loadTaughtCourses(dataScope);
    }

    @autobind
    _updateQuery(key, value) {
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        queryParams[key] = value;
        if (value === null || value === undefined || value === '') {
            runInAction(() => {
                this.props.store.reviewsStore.courseId = null;
            });
            delete queryParams[key];
        }
        this.props.history.push({
            pathname: this.props.location.pathname,
            search: qs.stringify(queryParams),
        });
    }

    @autobind
    onCourseSelect(courseId) {
        const {reviewsStore} = this.props.store;
        if (reviewsStore.dataScope && reviewsStore.dataScope === DATA_SCOPE_FILTERS.UB) {
            const courseDropdownSelection = courseId || ALL_COURSE_OPTION;
            Tracker.publishEvent(
                new InstructorUBOnlyReviewsPageViewEvent(courseDropdownSelection.toString()),
            );
        }

        this._updateQuery('course_id', courseId);
    }

    @autobind
    onStarSelect(event) {
        const {reviewsStore} = this.props.store;
        const star = parseInt(event.target.name, 10);
        const isChecked = event.target.checked;
        let selectedStars = reviewsStore.stars;
        if (isChecked) {
            selectedStars = reviewsStore.stars.concat(star);
        } else {
            selectedStars = reviewsStore.stars.filter((s) => s !== star);
        }
        this._updateQuery('star', selectedStars.sort().join(','));
    }

    @autobind
    onSortSelect(value) {
        this._updateQuery('sort', value);
    }

    @autobind
    onNotAnsweredChange(event) {
        const checked = event.target.checked;
        this._updateQuery('unresponded', checked ? 1 : 0);
    }

    @autobind
    onHasCommentChange(event) {
        const checked = event.target.checked;
        this._updateQuery('commented', checked ? 1 : 0);
    }

    @autobind
    onPageChange(page) {
        this.props.store.reviewsStore.onPageSelect(page);
        window.scrollTo(0, 0);
    }

    @autobind
    getDataScopeFilter(queryParams) {
        return this.props.isUBOnlyDataPreviewEnabled
            ? queryParams.data_scope
            : DEFAULT_DATA_SCOPE_FILTER;
    }

    isRatingEnabled() {
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        return !(
            this.props.isUBOnlyDataPreviewEnabled && queryParams.data_scope === DATA_SCOPE_FILTER.UB
        );
    }

    @autobind
    onDataScopeSelect(value) {
        if (value && value === DATA_SCOPE_FILTERS.UB) {
            const {reviewsStore} = this.props.store;
            const courseDropdownSelection = reviewsStore.courseId || ALL_COURSE_OPTION;
            Tracker.publishEvent(
                new InstructorUBOnlyReviewsPageViewEvent(courseDropdownSelection.toString()),
            );
        }

        this._updateQuery('data_scope', value);
        this.loadTaughtCoursesWithDataScope(value);
    }

    renderMetricsHeader() {
        const {reviewsStore} = this.props.store;
        const courseId = parseInt(reviewsStore.courseId, 10);
        const allCourseDropdownData = {
            data: reviewsStore.viewableCourses,
            selectedId: courseId,
            onCourseSelect: this.onCourseSelect,
            disabled: reviewsStore.apiState === API_STATE.SEARCHING,
        };

        const newTag = (
            <Badge styleName="ub-badge" data-tour-step={'3'}>
                {gettext('New')}
            </Badge>
        );

        const isEnabled = this.isUBEnabled();

        const dataScopeFilter = this.getDescriptionDropdown(
            reviewsStore.dataScope,
            newTag,
            isEnabled,
        );

        return (
            <IAResponsiveHeader
                title={gettext('Reviews')}
                allCourseDropdownData={allCourseDropdownData}
                leftItems={[
                    <Checkbox
                        checked={reviewsStore.notAnswered}
                        onChange={this.onNotAnsweredChange}
                        data-purpose="not-answered-checkbox"
                    >
                        {gettext('Not answered')}
                    </Checkbox>,
                    <Checkbox
                        checked={reviewsStore.hasCommented}
                        onChange={this.onHasCommentChange}
                        data-purpose="has-commented-checkbox"
                    >
                        {gettext('Has a comment')}
                    </Checkbox>,
                    <StarFiltersDropdown
                        reviewsStore={reviewsStore}
                        onStarSelect={this.onStarSelect}
                    />,
                    <DescriptionDropdown
                        description={gettext('Sort by')}
                        labels={SORTS}
                        value={reviewsStore.sort}
                        setValue={this.onSortSelect}
                        data-purpose="sort-dropdown"
                    />,
                    ...dataScopeFilter,
                ]}
                rightCTA={
                    <CourseReviewExportCSV
                        disabled={reviewsStore.apiState === API_STATE.SEARCHING}
                        onExport={reviewsStore.onCSVExport}
                    />
                }
                isUBOnlyDataPreviewEnabled={this.props.isUBOnlyDataPreviewEnabled}
            />
        );
    }

    getDescriptionDropdown(dataScope, ubBetaTag, isEnabled) {
        return isEnabled
            ? [
                  <DescriptionDropdown
                      description={gettext('Student Type')}
                      labels={DATA_SCOPE_LABELS}
                      value={dataScope}
                      setValue={this.onDataScopeSelect}
                      data-purpose="data-scope-dropdown"
                      styleName="scope-filter"
                  />,
                  ubBetaTag,
              ]
            : [];
    }

    @autobind
    goBack() {
        this.props.history.goBack();
    }

    renderNotInUBMessage() {
        return (
            <div styleName={'dismissible'} data-purpose="non-ub-collection-banner">
                <Image
                    id={'dismissible-icon'}
                    src={BrowseImage}
                    data-purpose="dismissible-image"
                    styleName={'non-ub-message-icon'}
                />
                <AlertBanner
                    data-purpose="dismissible-message"
                    styleName="alert-banner-with-icon"
                    showIcon={false}
                    ctaText={gettext('Go back')}
                    dismissButtonProps={false}
                    onAction={this.goBack}
                    title={gettext(
                        "The course you've selected is not in the Udemy Business course collection.",
                    )}
                    body=""
                />
            </div>
        );
    }

    @autobind
    isCourseInUBCollectionNow() {
        const hasSelectedCourse =
            this.props.store.reviewsStore.taughtCoursesApiState === API_STATE.DONE &&
            this.props.store.reviewsStore.selectedCourse;
        return hasSelectedCourse
            ? !!this.props.store.reviewsStore.selectedCourse.is_in_any_ufb_content_collection
            : false;
    }

    @autobind
    hasCourseId() {
        const hasSelectedCourse =
            this.props.store.reviewsStore.taughtCoursesApiState === API_STATE.DONE &&
            this.props.store.reviewsStore.selectedCourse;
        return hasSelectedCourse ? !!this.props.store.reviewsStore.selectedCourse.id : false;
    }

    @autobind
    ubInsightsBannersToBeDisplayed() {
        const {reviewsStore} = this.props.store;
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        const dataScope = this.getDataScopeFilter(queryParams);

        let renderNonUbBanner = false;
        let renderFormerlyInUbCollectionBanner = false;
        let isCourseInUBNowAndFeatureEnabled = false;

        if (queryParams.course_id) {
            const courseId = parseInt(queryParams.course_id, 10);
            isCourseInUBNowAndFeatureEnabled =
                this.props.isUBOnlyDataPreviewEnabled &&
                this.hasCourseId() &&
                dataScope === DATA_SCOPE_FILTER.UB &&
                !this.isCourseInUBCollectionNow();

            renderNonUbBanner =
                isCourseInUBNowAndFeatureEnabled && !reviewsStore.isCourseInUbEver(courseId);

            renderFormerlyInUbCollectionBanner =
                isCourseInUBNowAndFeatureEnabled && reviewsStore.isCourseInUbEver(courseId);
        }
        return {renderNonUbBanner, renderFormerlyInUbCollectionBanner};
    }

    renderNoReviewsPermissionInstructor() {
        const noReviewsPermissionCourses = this.props.store.coursesWithoutReviewsPermission;
        if (noReviewsPermissionCourses && noReviewsPermissionCourses.length > 0) {
            const title = ninterpolate(
                'You do not have access to "Reviews" data for the following course:',
                'You do not have access to "Reviews" data for the following courses:',
                noReviewsPermissionCourses.length,
            );
            return (
                <NoPermissionInstructor
                    title={title}
                    noPermissionCourses={noReviewsPermissionCourses}
                    missingPermissionMessage={missingPermissionMessageReviews}
                />
            );
        }
        return null;
    }

    doesNotHaveReviewsPermissionForCourse(courseId) {
        const noReviewsPermissionCourses = this.props.store.coursesWithoutReviewsPermission;
        if (noReviewsPermissionCourses && noReviewsPermissionCourses.length > 0) {
            return noReviewsPermissionCourses.find((course) => course.id === courseId);
        }
        return false;
    }

    renderNoReviewsPermissionCourse() {
        const title = gettext('You do not have access to "Reviews" data for this course.');
        return (
            <NoPermissionCourse
                title={title}
                missingPermissionMessage={missingPermissionMessageReviews}
            />
        );
    }

    @autobind
    updateWelcomeModalState(isEnabled) {
        isEnabled
            ? this.props.store.instructorStore.setIsWelcomeModalOpen(true)
            : this.props.store.instructorStore.setIsWelcomeModalOpen(false);
    }

    @autobind
    startPopoverTourWithRedirect(redirectLocation) {
        const {instructorStore} = this.props.store;
        instructorStore.startPopoverTour();
        if (redirectLocation) {
            this.props.history.replace(redirectLocation);
        }
    }

    render() {
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        const courseId = parseInt(queryParams.course_id, 10);
        const {reviewsStore} = this.props.store;
        const {isUBOnlyDataPreviewEnabled} = this.props;
        const {
            renderNonUbBanner,
            renderFormerlyInUbCollectionBanner,
        } = this.ubInsightsBannersToBeDisplayed();

        return (
            <div>
                {this.renderMetricsHeader()}
                {reviewsStore.apiState === API_STATE.SEARCHING && <SearchState />}
                {reviewsStore.apiState === API_STATE.ERROR && <ErrorState />}
                {reviewsStore.apiState === API_STATE.DONE && (
                    <>
                        {renderNonUbBanner === true && this.renderNotInUBMessage()}
                        {renderNonUbBanner === false && (
                            <div>
                                <InstructorAlerts appLinkPage="reviews" />
                                {renderFormerlyInUbCollectionBanner && (
                                    <AlertBanner
                                        data-purpose="formerly-in-ub-collection-message"
                                        styleName="alert-banner-behavior-hint"
                                        ctaText={gettext('Dismiss')}
                                        dismissButtonProps={false}
                                        title={gettext(
                                            'This course is not currently in the Udemy Business Collection.',
                                        )}
                                    />
                                )}
                                {!courseId && this.renderNoReviewsPermissionInstructor()}
                                {!isNaN(courseId) &&
                                this.doesNotHaveReviewsPermissionForCourse(courseId) ? (
                                    this.renderNoReviewsPermissionCourse()
                                ) : reviewsStore.reviews.length === 0 &&
                                  reviewsStore.apiState !== API_STATE.ERROR ? (
                                    <div styleName="no-reviews" data-purpose="no-reviews-found">
                                        {gettext('No reviews found')}
                                    </div>
                                ) : (
                                    <>
                                        {reviewsStore.selectedCourse ? (
                                            <SingleCourseReviews
                                                reviewsStore={reviewsStore}
                                                isRatingEnabled={this.isRatingEnabled()}
                                                isUBOnlyDataPreviewEnabled={
                                                    isUBOnlyDataPreviewEnabled
                                                }
                                            />
                                        ) : (
                                            <AllCoursesReviews
                                                reviewsStore={reviewsStore}
                                                onCourseSelect={this.onCourseSelect}
                                                isUBOnlyDataPreviewEnabled={
                                                    isUBOnlyDataPreviewEnabled
                                                }
                                            />
                                        )}
                                        <Pagination
                                            pageCount={reviewsStore.pageCount}
                                            activePage={reviewsStore.page}
                                            onPageChange={this.onPageChange}
                                            styleName="pagination"
                                        />
                                    </>
                                )}
                            </div>
                        )}
                        <WelcomeModal
                            isOpen={this.props.store.instructorStore.isWelcomeModalOpen}
                            onClose={() =>
                                this.props.store.instructorStore.setIsWelcomeModalOpen(false)
                            }
                            onFinish={() =>
                                this.startPopoverTourWithRedirect(
                                    this.props.store.instructorStore.popoverTourStartingPoint,
                                )
                            }
                            finishButtonText={gettext('See the new experience')}
                            steps={ubOnlyInsightsWelcomeModalSteps}
                        />
                    </>
                )}
                <PopoverTour
                    open={this.props.store.instructorStore.isPopoverTourOpen}
                    onClose={() => this.props.store.instructorStore.setIsPopoverTourOpen(false)}
                    onRedirect={(redirectUrl) => this.props.history.replace(redirectUrl)}
                    steps={ubOnlyInsightsPopoverTourSteps}
                    maxInterval={this.props.store.instructorStore.popoverTourMaxInterval}
                    startingStep={2}
                />
            </div>
        );
    }
}
