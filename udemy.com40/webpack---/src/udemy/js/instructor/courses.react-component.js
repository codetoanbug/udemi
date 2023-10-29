import {Tracker} from '@udemy/event-tracking';
import {LocalizedHtml} from '@udemy/i18n';
import AccessTimeIcon from '@udemy/icons/dist/access-time.ud-icon';
import SearchIcon from '@udemy/icons/dist/search.ud-icon';
import WarningIcon from '@udemy/icons/dist/warning.ud-icon';
import {Button, Image} from '@udemy/react-core-components';
import {ConfirmModal, Modal, ModalTrigger} from '@udemy/react-dialog-components';
import {FormGroup, TextInputForm} from '@udemy/react-form-components';
import {Dropdown} from '@udemy/react-menu-components';
import {StarRating} from '@udemy/react-merchandising-components';
import {Badge, Meter} from '@udemy/react-messaging-components';
import {Pagination} from '@udemy/react-navigation-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import ViewModeButtonGroup from 'instructor/common/view-mode-button-group.react-component';
import {InstructorCourseListActionEvent} from 'instructor/events';
import {SimpleIAResponsiveHeader} from 'instructor/layout/ia-responsive-header.react-component';
import {showSuccessToast, showReloadPageErrorToast} from 'instructor/toasts';
import {CreateCourseCTA} from 'teaching-courses/instructor-dashboard/create-course-cta.react-component';
import InstructorAlerts from 'teaching-courses/instructor-dashboard/instructor-alerts.react-component';
import {InstructorDashboard} from 'teaching-courses/instructor-dashboard/instructor-dashboard.react-component';
import getConfigData from 'utils/get-config-data';
import getRequestData from 'utils/get-request-data';
import {formatNumber} from 'utils/numeral';
import {getQueryParams} from 'utils/query-params';
import {defaultErrorMessage} from 'utils/ud-api';
import udLink from 'utils/ud-link';
import {isMobileBrowser} from 'utils/user-agent/get-is-mobile-browser';

import CoInstructorInvitationStore from './co-instructor-invitation.mobx-store';
import CoInstructorInvitation from './co-instructor-invitation.react-component';
import {COURSE_VIEW_TYPES} from './constants';
import CoursesStore from './courses.mobx-store';
import './courses.less';

const udConfig = getConfigData();

const trackClick = (resource, input = '', action = 'click') => {
    Tracker.publishEvent(
        new InstructorCourseListActionEvent({
            category: resource,
            input,
            action,
        }),
    );
};

const createTrackClickHandler = (resource) => {
    return () => {
        trackClick(resource);
    };
};

export const PrivacyBlock = () => {
    return (
        <div>
            <div styleName="privacy-bar" />
            <div styleName="privacy-bar" />
        </div>
    );
};

export const RevenueBlock = ({course, hasInstructorRevenueReportPerm, viewType}) => {
    return (
        <div styleName="card-col card-col-thirds">
            {viewType === COURSE_VIEW_TYPES.PRIVACY ? (
                <PrivacyBlock />
            ) : (
                course.earnings && (
                    <div>
                        <div className="ud-text-xl" styleName="card-metric">
                            {course.earnings.monthly}
                        </div>
                        <div className="ud-text-sm" styleName="ellipsis-2-lines">
                            {gettext('Earned this month')}
                        </div>
                        {viewType === COURSE_VIEW_TYPES.DETAIL && (
                            <>
                                <div className="ud-text-xl" styleName="card-metric">
                                    {course.earnings.lifetime}
                                </div>
                                <div className="ud-text-sm" styleName="ellipsis-2-lines">
                                    {gettext('Total earned')}
                                </div>
                            </>
                        )}
                        {hasInstructorRevenueReportPerm && (
                            <a
                                className="ud-heading-lg"
                                styleName="card-link"
                                href={`/instructor/performance/overview/revenue/?course_id=${course.id}&date_filter=month`}
                                onClick={RevenueBlock.trackRevenueClick}
                            >
                                {gettext('See performance')}
                            </a>
                        )}
                    </div>
                )
            )}
        </div>
    );
};

RevenueBlock.propTypes = {
    course: PropTypes.object.isRequired,
    hasInstructorRevenueReportPerm: PropTypes.bool.isRequired,
    viewType: PropTypes.string.isRequired,
};
RevenueBlock.trackRevenueClick = createTrackClickHandler('revenue');

export const StudentsBlock = ({course, hasInstructorQAPerm, viewType}) => {
    return (
        <div styleName="card-col card-col-thirds">
            {viewType === COURSE_VIEW_TYPES.PRIVACY ? (
                <PrivacyBlock />
            ) : (
                <div>
                    <div className="ud-text-xl" styleName="card-metric">
                        {formatNumber(course.num_subscribers_recent)}
                    </div>
                    <div className="ud-text-sm" styleName="ellipsis-2-lines">
                        {gettext('Enrollments this month')}
                    </div>
                    {viewType === COURSE_VIEW_TYPES.DETAIL && (
                        <>
                            <div className="ud-text-xl" styleName="card-metric">
                                {formatNumber(course.num_subscribers)}
                            </div>
                            <div className="ud-text-sm" styleName="ellipsis-2-lines">
                                {gettext('Total students')}
                            </div>
                        </>
                    )}
                    {hasInstructorQAPerm && (
                        <a
                            className="ud-heading-lg"
                            styleName="card-link"
                            href={`/instructor/course/${course.id}/manage/students`}
                            onClick={StudentsBlock.trackStudentsClick}
                        >
                            {gettext('See students')}
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

StudentsBlock.propTypes = {
    course: PropTypes.object.isRequired,
    hasInstructorQAPerm: PropTypes.bool.isRequired,
    viewType: PropTypes.string.isRequired,
};
StudentsBlock.trackStudentsClick = createTrackClickHandler('students');

export const ReviewBlock = ({course, hasInstructorReviewPerm, viewType}) => {
    return (
        <div styleName="card-col card-col-thirds">
            {viewType === COURSE_VIEW_TYPES.PRIVACY ? (
                <PrivacyBlock />
            ) : (
                <div>
                    <div className="ud-text-xl" styleName="card-metric">
                        <span styleName="course-rating-wrapper">
                            {formatNumber(course.rating.toFixed(2))}
                            <span styleName="course-rating">
                                <StarRating rating={course.rating} />
                            </span>
                        </span>
                    </div>
                    <div className="ud-text-sm" styleName="ellipsis-2-lines">
                        {gettext('Course rating')}
                    </div>
                    {hasInstructorReviewPerm && (
                        <a
                            className="ud-heading-lg"
                            styleName="card-link"
                            href={`/instructor/reviews/?course=${course.id}`}
                            onClick={ReviewBlock.trackSatisfactionClick}
                        >
                            {gettext('See reviews')}
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

ReviewBlock.propTypes = {
    course: PropTypes.object.isRequired,
    hasInstructorReviewPerm: PropTypes.bool.isRequired,
    viewType: PropTypes.string.isRequired,
};
ReviewBlock.trackSatisfactionClick = createTrackClickHandler('satisfaction');

export const ApprovedTile = ({course, showRevenue, showReviews, viewType}) => {
    const showRatings = showReviews && course.features.reviews_view;
    return (
        <div styleName="card-tile">
            {showRevenue && (
                <RevenueBlock
                    course={course}
                    hasInstructorRevenueReportPerm={course.can_use_revenue_report}
                    viewType={viewType}
                />
            )}
            <StudentsBlock
                course={course}
                hasInstructorQAPerm={course.can_use_qa}
                viewType={viewType}
            />
            {showRatings && (
                <ReviewBlock
                    course={course}
                    hasInstructorReviewPerm={course.can_use_reviews}
                    viewType={viewType}
                />
            )}
        </div>
    );
};

ApprovedTile.propTypes = {
    course: PropTypes.object.isRequired,
    showRevenue: PropTypes.bool.isRequired,
    showReviews: PropTypes.bool.isRequired,
    viewType: PropTypes.string.isRequired,
};

export const NeedsFixesTile = ({course}) => {
    return (
        <div styleName="card-tile card-col">
            {course.is_cleaned_course ? (
                <LocalizedHtml
                    className="ud-text-sm"
                    html={gettext(
                        'This course has been unpublished as part of the Marketplace Maintenance ' +
                            "program. If you'd like to republish your course to the Udemy marketplace, " +
                            'please refer to <a class="link">this article</a> to get ' +
                            'more details and make the required changes.',
                    )}
                    interpolate={{
                        link: (
                            <a
                                className="ud-link-underline"
                                href={udLink.toSupportLink('marketplace_maintenance_program')}
                                target="_blank"
                                rel="noopener noreferrer"
                            />
                        ),
                    }}
                />
            ) : course.has_no_feedback ? (
                <div className="ud-text-sm">
                    {gettext(
                        'Our course quality review process has been updated since ' +
                            'you last submitted your course.\n' +
                            'Please unpublish and resubmit your course to send it for review.',
                    )}
                </div>
            ) : (
                <div>
                    <div className="ud-heading-md" styleName="qrp-status">
                        <WarningIcon label={false} color="warning" />
                        {gettext('Needs fixes')}
                    </div>
                    <div className="ud-text-sm">
                        {ninterpolate(
                            '%(count)s required fix',
                            '%(count)s required fixes',
                            course.quality_feedback_counts.needs_fix || 0,
                            {count: course.quality_feedback_counts.needs_fix || 0},
                        )}
                    </div>
                    {course.can_edit && (
                        <a
                            className="ud-heading-lg"
                            styleName="card-link"
                            href={`/instructor/course/${course.id}/manage/feedback`}
                            onClick={NeedsFixesTile.trackFeedbackClick}
                        >
                            {gettext('See feedback')}
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

NeedsFixesTile.propTypes = {
    course: PropTypes.object.isRequired,
};
NeedsFixesTile.trackFeedbackClick = createTrackClickHandler('feedback');

export const InReviewTile = ({course}) => {
    const submittedDate = new Date(
        course.quality_review_process.last_submitted_date,
    ).toLocaleDateString(getRequestData().locale.replace('_', '-') || 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
    return (
        <div styleName="card-tile card-col">
            <div>
                <div className="ud-heading-md" styleName="qrp-status">
                    <AccessTimeIcon label={false} color="warning" />
                    {gettext('In review')}
                </div>
                <div className="ud-text-sm">
                    {interpolate(gettext('Submitted on %(date)s'), {date: submittedDate}, true)}
                </div>
            </div>
        </div>
    );
};

InReviewTile.propTypes = {
    course: PropTypes.object.isRequired,
};
InReviewTile.trackFeedbackClick = createTrackClickHandler('feedback');

export const DraftTile = ({course}) => {
    return (
        <div styleName="card-tile card-col">
            <div styleName="course-progress-wrapper">
                <div className="ud-heading-md">{gettext('Finish your course')}</div>
                <Meter
                    styleName="course-progress"
                    value={course.creation_progress_ratio}
                    min={0}
                    max={100}
                    label={gettext('%(percent)s% complete')}
                />
            </div>
        </div>
    );
};

DraftTile.propTypes = {
    course: PropTypes.object.isRequired,
};

export const Course = ({
    course,
    showFreeLabel,
    showRevenue,
    showReviews,
    viewType,
    leaveCourse,
    refresh,
}) => {
    let useFullLengthOverlay = false;
    let tile;
    if (course.is_cleaned_course || course.quality_status === 'needs_fixes') {
        tile = <NeedsFixesTile course={course} />;
    } else if (course.quality_status === 'approved') {
        tile = (
            <ApprovedTile
                course={course}
                showRevenue={showRevenue}
                showReviews={showReviews}
                viewType={viewType}
            />
        );
    } else if (
        course.quality_status === 'submitted_for_review' ||
        course.quality_status === 'in_review'
    ) {
        useFullLengthOverlay = true;
        tile = <InReviewTile course={course} />;
    } else {
        useFullLengthOverlay = true;
        tile = <DraftTile course={course} />;
    }

    let price = '';
    let status = course.status_label;
    if (course.quality_status === 'approved' && course.is_published) {
        status = status && <Badge styleName="course-status course-status-badge">{status}</Badge>;
        if (showFreeLabel || course.is_paid) {
            price = course.original_price_text;
        }
    } else {
        status = status && (
            <div className="ud-text-bold" styleName="course-status">
                {status}
            </div>
        );
    }

    function getCourseLinks(course, leaveCourse, refresh) {
        const courseManageLinkUrl = course.can_edit
            ? `/instructor/course/${course.id}/manage/goals`
            : course.can_use_course_manage
            ? `/instructor/course/${course.id}/manage/captions`
            : course.url;
        const courseManageLinkText = course.can_edit
            ? gettext('Edit / manage course')
            : course.can_use_course_manage
            ? gettext('Edit captions')
            : gettext('View course');

        const showLeaveCourse = !course.can_edit && !course.is_owner;

        return (
            <div styleName="two-card-link-container">
                {course.quality_status !== 'banned' && (
                    <div styleName="two-card-link-wrapper">
                        <a
                            href={courseManageLinkUrl}
                            className="ud-heading-lg"
                            styleName="two-card-link"
                            data-purpose="course-manage-link-text"
                            onClick={
                                course.can_use_course_manage
                                    ? Course.trackRoadmapVisit
                                    : Course.trackDashboardVisit
                            }
                        >
                            {courseManageLinkText}
                        </a>
                    </div>
                )}
                {showLeaveCourse ? (
                    <div styleName="two-card-link-wrapper">
                        <ModalTrigger
                            trigger={
                                <Button
                                    className="ud-heading-lg"
                                    udStyle="link"
                                    size="large"
                                    styleName="two-card-link"
                                >
                                    {gettext('Leave course')}
                                </Button>
                            }
                            renderModal={({isOpen, onClose}) => (
                                <ConfirmModal
                                    confirmText={gettext('Leave course')}
                                    isOpen={isOpen}
                                    onCancel={onClose}
                                    onConfirm={() => {
                                        onClose();
                                        leaveCourse(course.id)
                                            .then(() => {
                                                showSuccessToast(
                                                    gettext(
                                                        'You left the course as a co-instructor',
                                                    ),
                                                );
                                                refresh();
                                            })
                                            .catch(() =>
                                                showReloadPageErrorToast(defaultErrorMessage),
                                            );
                                    }}
                                >
                                    {interpolate(
                                        gettext(
                                            'Do you want to leave the course "%(course_title)s" as a co-instructor?',
                                        ),
                                        {course_title: course.title},
                                        true,
                                    )}
                                </ConfirmModal>
                            )}
                        />
                    </div>
                ) : null}
            </div>
        );
    }

    return (
        <div styleName="card" data-purpose="course-row">
            <div styleName="card-image-wrapper">
                <Image
                    styleName="card-image"
                    src={course.image_200_H}
                    alt=""
                    width={118}
                    height={118}
                />
            </div>
            <div styleName="card-body">
                <div styleName="card-details">
                    <div className="ud-heading-md" styleName="ellipsis-2-lines">
                        {course.title}
                    </div>
                    <div className="ud-text-xs" styleName="card-details-bottom">
                        {status}
                        <div styleName="card-price-privacy-label">
                            {[price, course.privacy_label]
                                .filter(Boolean)
                                .join(` ${gettext('-')} `)}
                        </div>
                    </div>
                    {useFullLengthOverlay ? null : getCourseLinks(course, leaveCourse, refresh)}
                </div>
                {course.quality_status !== 'banned' && tile}
                {useFullLengthOverlay ? getCourseLinks(course, leaveCourse, refresh) : null}
            </div>
        </div>
    );
};

Course.propTypes = {
    course: PropTypes.object.isRequired,
    showFreeLabel: PropTypes.bool.isRequired,
    showRevenue: PropTypes.bool.isRequired,
    showReviews: PropTypes.bool.isRequired,
    viewType: PropTypes.string.isRequired,
    leaveCourse: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
};
Course.trackRoadmapVisit = createTrackClickHandler('roadmap_visit');
Course.trackDashboardVisit = createTrackClickHandler('dashboard_visit');

export const Search = observer(
    ({
        store,
        handleSearchSubmit,
        handleOrderingFieldEvent,
        handleCourseViewTypeEvent,
        isPublishedInstructor,
    }) => {
        return (
            <div styleName="search-wrapper">
                <FormGroup
                    label={gettext('Search your courses')}
                    labelProps={{className: 'ud-sr-only'}}
                >
                    <TextInputForm
                        onSubmit={handleSearchSubmit}
                        data-purpose="search-my-courses"
                        placeholder={gettext('Search your courses')}
                        value={store.query}
                        onChange={store.setQueryChangeEvent}
                        submitButtonContent={<SearchIcon label={gettext('Search')} />}
                    />
                </FormGroup>
                <Dropdown
                    placement="bottom-start"
                    trigger={
                        <Dropdown.Button aria-label={gettext('Change the ordering of the courses')}>
                            {store.orderingFields[store.orderingField] || 'unknown'}
                        </Dropdown.Button>
                    }
                >
                    <Dropdown.Menu>
                        {Object.keys(store.orderingFields).map((key) => (
                            <Dropdown.MenuItem
                                key={key}
                                onClick={() => handleOrderingFieldEvent(key)}
                            >
                                {store.orderingFields[key]}
                            </Dropdown.MenuItem>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                {!isMobileBrowser && isPublishedInstructor && (
                    <ViewModeButtonGroup
                        styleName="view-mode-button-group"
                        label={gettext('Change course information displayed')}
                    >
                        {Object.keys(store.courseViewTypes).map((key) => {
                            const {Icon, label, tooltipText} = store.courseViewTypes[key];
                            return (
                                <ViewModeButtonGroup.Button
                                    key={key}
                                    name="courseViewType"
                                    onChange={handleCourseViewTypeEvent}
                                    value={key}
                                    checked={key === store.courseViewType}
                                    icon={<Icon label={label} />}
                                    tooltipText={tooltipText}
                                />
                            );
                        })}
                    </ViewModeButtonGroup>
                )}
            </div>
        );
    },
);

Search.propTypes = {
    store: PropTypes.object.isRequired,
};

@observer
export default class Courses extends Component {
    static propTypes = {
        hasPublishedCourse: PropTypes.bool.isRequired,
        store: PropTypes.object, // Mainly for tests.
        coInstructorInvitationStore: PropTypes.object, // For tests
        labsStore: PropTypes.object,
        isNewcomerChallengeEnabled: PropTypes.bool,
        isNewlyNewcomerChallengePageEnabled: PropTypes.bool,
        isInstructorPartner: PropTypes.bool,
        isInSupplyGapsTargetGroup: PropTypes.bool,
    };

    static defaultProps = {
        store: null,
        labsStore: null,
        coInstructorInvitationStore: null,
        isNewcomerChallengeEnabled: false,
        isNewlyNewcomerChallengePageEnabled: false,
        isInstructorPartner: false,
        isInSupplyGapsTargetGroup: false,
    };

    constructor(props) {
        super(props);
        this.store = this.props.store || new CoursesStore();
        this.coInstructorInvitationStore =
            this.props.coInstructorInvitationStore || new CoInstructorInvitationStore();
    }

    componentDidMount() {
        this.parseQueryParametersAndUpdateCourses();

        // Flow: creates the listener for browser buttons.
        window.addEventListener('popstate', this.parseQueryParametersAndUpdateCourses);

        const flash = getQueryParams(window.location).flash;
        if (flash === 'delete') {
            showSuccessToast(gettext('Your course has been deleted.'));
        } else if (flash === 'left-course') {
            showSuccessToast(gettext('You left the course as a co-instructor'));
        }
    }

    // Flow: removes the browser button listener.
    componentWillUnmount() {
        window.removeEventListener('popstate', this.parseQueryParametersAndUpdateCourses);
    }

    trackNewCourse = createTrackClickHandler('create_course');

    @autobind
    parseQueryParametersAndUpdateCourses() {
        this.store.parseQueryParametersFromLocation(window.location);
        this.store.resetPaginationAndGetCourseList();
        this.coInstructorInvitationStore.getCoInstructorCourseInvitations();
    }

    @autobind
    updateQueryParametersAndCourses() {
        window.history.pushState({}, '', window.location.pathname + this.store.queryString);
        this.store.resetPaginationAndGetCourseList();
    }

    @autobind
    clickNewCourse() {
        this.trackNewCourse();
        window.location.href = udLink.to('course', 'create', {
            ref: 'instructor_dashboard',
            isInSupplyGapsTargetGroup: this.props.isInSupplyGapsTargetGroup,
            isIP: this.props.isInstructorPartner,
        });
    }

    @autobind
    goToPage(page) {
        if (this.store.activePage !== page) {
            this.store.setActivePage(page);
            window.scrollTo(0, 0);
        }
    }

    @autobind
    handleOrderingFieldEvent(orderingField) {
        this.store.setOrderingField(orderingField);
        this.updateQueryParametersAndCourses();
        trackClick('sort', orderingField, 'sort');
    }

    @autobind
    handleSearchSubmit() {
        this.store.updateLastQueryWithQuery();
        this.updateQueryParametersAndCourses();
        trackClick('search', this.store.query, 'search');
    }

    @autobind
    handleCourseViewTypeEvent(event) {
        this.store.setCourseViewType(event.target.value);
        this.store.updateRevenue();
        trackClick('view_type', event.target.value, 'click');
    }

    @autobind
    handleCloseModal() {
        this.coInstructorInvitationStore.setShowInvitationNoLongerAvailableModal(false);
    }

    render() {
        return (
            <>
                {this.store.coursesLoaded &&
                !this.store.numCourses &&
                !this.store.lastQuery.length ? (
                    <div>
                        {this.coInstructorInvitationStore.invitationsLoaded ? (
                            <div
                                styleName="courses-list"
                                className={`view-type-${this.store.courseViewType}`}
                            >
                                {this.coInstructorInvitationStore.invitations.map((invitation) => (
                                    <div
                                        styleName="co-instructor-invitation-card"
                                        key={invitation.id}
                                    >
                                        <CoInstructorInvitation
                                            invitation={invitation}
                                            coInstructorInvitationStore={
                                                this.coInstructorInvitationStore
                                            }
                                            coursesStore={this.store}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <MainContentLoader styleName="loader" />
                        )}
                        <InstructorAlerts key="alerts" courseStore={this.store} />
                        <CreateCourseCTA />
                        <InstructorDashboard
                            hasCourse={!!this.store.numCourses}
                            isPublishedInstructor={this.props.hasPublishedCourse}
                            primaryResource="teachingResource"
                            isNewcomerChallengeEnabled={this.props.isNewcomerChallengeEnabled}
                            isNewlyNewcomerChallengePageEnabled={
                                this.props.isNewlyNewcomerChallengePageEnabled
                            }
                        />
                    </div>
                ) : (
                    <div>
                        <SimpleIAResponsiveHeader
                            title={gettext('Courses')}
                            rightCTA={
                                udConfig.brand.is_teaching_enabled && (
                                    <Button
                                        udStyle="brand"
                                        onClick={this.clickNewCourse}
                                        styleName="mobile-new-course-button"
                                        data-purpose="header-new-course"
                                    >
                                        {gettext('New course')}
                                    </Button>
                                )
                            }
                        />
                        <InstructorAlerts key="alerts" courseStore={this.store} />
                        <div styleName="search-row">
                            <Search
                                store={this.store}
                                handleSearchSubmit={this.handleSearchSubmit}
                                handleOrderingFieldEvent={this.handleOrderingFieldEvent}
                                handleCourseViewTypeEvent={this.handleCourseViewTypeEvent}
                                isPublishedInstructor={this.props.hasPublishedCourse}
                            />
                            {udConfig.brand.is_teaching_enabled && (
                                <Button
                                    udStyle="brand"
                                    onClick={this.clickNewCourse}
                                    styleName="desktop-new-course-button"
                                    data-purpose="new-course-button"
                                >
                                    {gettext('New course')}
                                </Button>
                            )}
                        </div>
                        {this.store.coursesLoaded &&
                        this.coInstructorInvitationStore.invitationsLoaded ? (
                            <div>
                                <div
                                    styleName="courses-list"
                                    className={`view-type-${this.store.courseViewType}`}
                                >
                                    {this.store.activePage === 1 &&
                                        this.coInstructorInvitationStore.invitations.map(
                                            (invitation) => (
                                                <div
                                                    styleName="co-instructor-invitation-card"
                                                    key={invitation.id}
                                                >
                                                    <CoInstructorInvitation
                                                        invitation={invitation}
                                                        coInstructorInvitationStore={
                                                            this.coInstructorInvitationStore
                                                        }
                                                        coursesStore={this.store}
                                                    />
                                                </div>
                                            ),
                                        )}
                                    {this.store.courses.map((course) => (
                                        <Course
                                            key={course.id}
                                            course={course}
                                            showFreeLabel={this.store.showFreeLabel}
                                            showRevenue={this.store.showRevenue}
                                            showReviews={this.store.showReviews}
                                            viewType={this.store.courseViewType}
                                            leaveCourse={this.store.leaveCourse}
                                            refresh={this.parseQueryParametersAndUpdateCourses}
                                        />
                                    ))}
                                </div>
                                {this.store.numPages > 1 && (
                                    <Pagination
                                        pageCount={this.store.numPages}
                                        activePage={this.store.activePage}
                                        onPageChange={this.goToPage}
                                    />
                                )}
                                {!this.store.numCourses && this.store.lastQuery !== '' && (
                                    <div className="ud-heading-lg" styleName="no-records">
                                        {interpolate(
                                            gettext('No results found for "%(query)s".'),
                                            {query: this.store.lastQuery},
                                            true,
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <MainContentLoader styleName="loader" />
                        )}
                        <InstructorDashboard
                            hasCourse={!!this.store.numCourses}
                            isPublishedInstructor={this.props.hasPublishedCourse}
                            primaryResource="teachingResource"
                            isNewcomerChallengeEnabled={this.props.isNewcomerChallengeEnabled}
                        />
                    </div>
                )}
                <Modal
                    title={gettext('Co-instructor invitation')}
                    onClose={this.handleCloseModal}
                    isOpen={this.coInstructorInvitationStore.showInvitationNoLongerAvailableModal}
                >
                    <p>{gettext('Co-instructor invitation is no longer available')}</p>
                    <FooterButtons>
                        <Button data-purpose="submit-close-modal" onClick={this.handleCloseModal}>
                            {gettext('Close')}
                        </Button>
                    </FooterButtons>
                </Modal>
            </>
        );
    }
}
