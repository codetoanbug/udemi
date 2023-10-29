import {LocalizedHtml} from '@udemy/i18n';
import DataInsightIcon from '@udemy/icons/dist/data-insight.ud-icon';
import {Button, Image} from '@udemy/react-core-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {API_STATE} from 'instructor/constants';
import IAResponsiveHeader from 'instructor/layout/ia-responsive-header.react-component';
import {formatNumber} from 'utils/numeral';
import qs from 'utils/query-params';

import BrowseImage from '../../instructor/assets/images/browse.png';
import {updateCourseFilter} from './helpers';
import MostRecentEnrollments from './most-recent-enrollments.react-component';
import {
    ErrorState,
    NoPermissionCourse,
    NoPermissionInstructor,
    SearchState,
} from './search-and-error-states.react-component';
import StudentCountries from './student-countries.react-component';
import StudentInterestsEnrollments from './student-interests-enrollments.react-component';
import StudentLocations from './student-locations.react-component';
/* eslint-disable no-unused-vars,import/order */
import baseStyles from './instructor-analytics.less';
import styles from './students-route.less';
import DataScopeFilter from './data-scope-filter.react-component';
import {
    ALL_COURSE_OPTION,
    DATA_SCOPE_FILTERS,
    DATA_SCOPE_FILTERS as DATA_SCOPE_FILTER,
    DEFAULT_DATA_SCOPE_FILTER,
    missingPermissionMessagePerformance,
} from './constants';
import InstructorAlerts from '../instructor-dashboard/instructor-alerts.react-component';

import {computed} from 'mobx';
import {Tracker} from '@udemy/event-tracking';
import {InstructorUBOnlyStudentsPageViewEvent} from './events';
import {WelcomeModal} from '../../instructor/welcome-modal/welcome-modal.react-component';
import {ubOnlyInsightsWelcomeModalSteps} from './welcome-modal-data';
import {PopoverTour} from '../../instructor/popover-tour/popover-tour.react-component';
import {ubOnlyInsightsPopoverTourSteps} from './popover-tour-steps';
/* eslint-enable no-unused-vars,import/order */

@inject('store')
@observer
export default class StudentsRoute extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        isUBOnlyDataPreviewEnabled: PropTypes.bool,
    };

    static defaultProps = {
        isUBOnlyDataPreviewEnabled: false,
    };

    constructor(props) {
        super(props);
        this.updateRoute(props.location);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.location.search !== this.props.location.search) {
            this.updateRoute(nextProps.location);
        }
    }

    updateRoute(location) {
        const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
        const courseId = queryParams.course_id;

        const willHistoryBeReplaced = !queryParams.data_scope;
        if (willHistoryBeReplaced) {
            queryParams.data_scope = DEFAULT_DATA_SCOPE_FILTER;
            this.props.history.replace({
                pathname: location.pathname,
                search: qs.stringify(queryParams),
            });
        }
        const dataScope = this.getDataScopeFilter(queryParams);
        this.getStudentMetrics(courseId, dataScope);
    }

    @autobind
    getStudentMetrics(courseId, dataScope) {
        if (dataScope && dataScope === DATA_SCOPE_FILTERS.UB) {
            const courseDropdownSelection = courseId || ALL_COURSE_OPTION;
            Tracker.publishEvent(
                new InstructorUBOnlyStudentsPageViewEvent(courseDropdownSelection.toString()),
            );
        }
        this.props.store.studentStore.getTotalStudents(courseId, dataScope);
        this.props.store.studentStore.interests.getMetrics(courseId, dataScope);
        this.props.store.studentStore.countries.getMetrics(courseId, dataScope);
        this.props.store.studentStore.languages.getMetrics(courseId, dataScope);
        this.props.store.studentStore.enrollments.getEnrolledCourses(courseId, dataScope);
        this.props.store.studentStore.students.getMostRecentStudents(courseId, dataScope);
    }

    renderNoStudents() {
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        const courseId = queryParams.course_id;
        const {instructorStore} = this.props.store;
        if (
            !courseId &&
            instructorStore._taughtCourses.length > 0 &&
            instructorStore._taughtCourses.length ===
                this.props.store.coursesWithoutPerformancePermission.length
        ) {
            return null;
        }
        return (
            <div styleName="baseStyles.no-data" data-purpose="no-student-metrics">
                <h2>{gettext('No students yet...')}</h2>
                {instructorStore.publishedCourses.length === 0 &&
                    instructorStore.unpublishedCourses.length === 0 && (
                        <>
                            <p styleName="baseStyles.no-data-subtitle">
                                {gettext(
                                    'Once you publish your course, come here to learn about your students.',
                                )}
                            </p>
                            <Button
                                componentClass="a"
                                href="/instructor/courses/"
                                udStyle="secondary"
                                styleName="baseStyles.no-data-cta"
                            >
                                {gettext('Go to Instructor Dashboard')}
                            </Button>
                        </>
                    )}
            </div>
        );
    }

    renderNoPermissionCourse() {
        const title = gettext('You do not have access to Student data for this course.');
        return (
            <NoPermissionCourse
                title={title}
                missingPermissionMessage={missingPermissionMessagePerformance}
            />
        );
    }

    renderNoPermissionInstructor() {
        const noPermissionCourses = this.props.store.coursesWithoutPerformancePermission;
        if (noPermissionCourses.length > 0) {
            const title = ninterpolate(
                'You do not have access to Student data for the following course:',
                'You do not have access to Student data for the following courses:',
                noPermissionCourses.length,
            );
            return (
                <NoPermissionInstructor
                    title={title}
                    noPermissionCourses={noPermissionCourses}
                    missingPermissionMessage={missingPermissionMessagePerformance}
                />
            );
        }
        return null;
    }

    renderStudentMetrics() {
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        const {studentStore} = this.props.store;
        const newStudents = studentStore.newStudents; // TODO: will always be null
        const dataScope = this.getDataScopeFilter(queryParams);
        return (
            <div data-purpose="student-metrics">
                <div styleName="styles.student-counts">
                    <LocalizedHtml
                        html={ninterpolate(
                            '<span class="bold">%(count)s</span> student',
                            '<span class="bold">%(count)s</span> students',
                            studentStore.totalStudents,
                            {count: formatNumber(studentStore.totalStudents)},
                        )}
                        interpolate={{bold: <span className="ud-text-xl" />}}
                    />
                    {newStudents && (
                        <span styleName="styles.students-this-month">
                            <DataInsightIcon label={false} color="inherit" />
                            <LocalizedHtml
                                html={ninterpolate(
                                    '<span class="bold">%(count)s</span> new this month',
                                    '<span class="bold">%(count)s</span> new this month',
                                    newStudents,
                                    {count: formatNumber(newStudents)},
                                )}
                                interpolate={{bold: <span className="ud-text-xl" />}}
                            />
                        </span>
                    )}
                </div>
                {dataScope !== DATA_SCOPE_FILTER.UB && (
                    <MostRecentEnrollments students={studentStore.students.mostRecentStudents} />
                )}
                <StudentCountries />
                <StudentLocations
                    countries={studentStore.countries}
                    languages={studentStore.languages}
                />
                <StudentInterestsEnrollments dataScope={dataScope} />
            </div>
        );
    }

    @autobind
    updateFilter(courseId) {
        updateCourseFilter(this.props.location, this.props.history, courseId);
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        if (queryParams.course_id && queryParams.data_scope === DATA_SCOPE_FILTER.UB) {
            this.props.store.instructorStore.isCourseInUbEver(queryParams.course_id);
        }
    }

    @autobind
    goBack() {
        this.props.history.goBack();
    }

    renderNotInUBMessage() {
        return (
            <div styleName={'styles.dismissible'} data-purpose="non-ub-collection-banner">
                <Image
                    id={'dismissible-icon'}
                    src={BrowseImage}
                    data-purpose="dismissible-image"
                    styleName={'styles.non-ub-message-icon'}
                />
                <AlertBanner
                    data-purpose="dismissible-message"
                    styleName="styles.alert-banner-with-icon"
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
    isCourseInUBCollectionNow(courseId) {
        const {instructorStore} = this.props.store;
        const taughtCourses = instructorStore._taughtCourses || [];
        const selectedCourse = taughtCourses.find((c) => c.id === parseInt(courseId, 10));
        return selectedCourse ? !!selectedCourse.is_in_any_ufb_content_collection : false;
    }

    @autobind
    hasCourseId(courseId) {
        const {instructorStore} = this.props.store;
        const taughtCourses = instructorStore._taughtCourses || [];
        const selectedCourse = taughtCourses.find((c) => c.id === parseInt(courseId, 10));
        return selectedCourse ? !!selectedCourse.id : false;
    }

    @autobind
    ubInsightsBannersToBeDisplayed() {
        const {instructorStore} = this.props.store;
        const queryParams = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
        const dataScope = this.getDataScopeFilter(queryParams);
        const courseId = parseInt(queryParams.course_id, 10);

        let renderNonUbBanner = false;
        let renderFormerlyInUbCollectionBanner = false;
        let isCourseInUBNowAndFeatureEnabled = false;

        if (queryParams.course_id) {
            isCourseInUBNowAndFeatureEnabled =
                this.props.isUBOnlyDataPreviewEnabled &&
                this.hasCourseId(courseId) &&
                dataScope === DATA_SCOPE_FILTER.UB &&
                !this.isCourseInUBCollectionNow(courseId);

            renderNonUbBanner =
                isCourseInUBNowAndFeatureEnabled && !instructorStore.isCourseInUbEver(courseId);

            renderFormerlyInUbCollectionBanner =
                isCourseInUBNowAndFeatureEnabled && instructorStore.isCourseInUbEver(courseId);
        }
        return {renderNonUbBanner, renderFormerlyInUbCollectionBanner};
    }

    @autobind
    getDataScopeFilter(queryParams) {
        return this.props.isUBOnlyDataPreviewEnabled
            ? queryParams.data_scope
            : DEFAULT_DATA_SCOPE_FILTER;
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
        const courseId = queryParams.course_id;
        const {instructorStore} = this.props.store;
        const {
            renderNonUbBanner,
            renderFormerlyInUbCollectionBanner,
        } = this.ubInsightsBannersToBeDisplayed();

        return (
            <div data-purpose="students-route">
                {instructorStore.taughtCoursesState === API_STATE.SEARCHING && <SearchState />}
                {instructorStore.taughtCoursesState === API_STATE.ERROR && <ErrorState />}
                {instructorStore.taughtCoursesState === API_STATE.DONE && (
                    <div>
                        <IAResponsiveHeader
                            title={gettext('Students')}
                            allCourseDropdownData={{
                                data: instructorStore._taughtCourses,
                                selectedId: parseInt(courseId, 10),
                                onCourseSelect: this.updateFilter,
                                disabled:
                                    this.props.store.studentStore.studentMetricSearchState ===
                                    API_STATE.SEARCHING,
                            }}
                            isUBOnlyDataPreviewEnabled={this.props.isUBOnlyDataPreviewEnabled}
                        />
                        <DataScopeFilter
                            data-purpose="data-scope-filter"
                            isEnabled={this.props.isUBOnlyDataPreviewEnabled}
                            courseId={parseInt(courseId, 10)}
                            dataTourStep={'2'}
                        />
                        {this.props.store.studentStore.studentMetricSearchState ===
                            API_STATE.SEARCHING && <SearchState />}
                        {this.props.store.studentStore.studentMetricSearchState ===
                            API_STATE.NO_PERMISSION && this.renderNoPermissionCourse()}
                        {this.props.store.studentStore.studentMetricSearchState ===
                            API_STATE.ERROR && <ErrorState />}
                        {this.props.store.studentStore.studentMetricSearchState ===
                            API_STATE.DONE && (
                            <div>
                                {renderNonUbBanner === true && this.renderNotInUBMessage()}
                                {renderNonUbBanner === false && (
                                    <div>
                                        {renderFormerlyInUbCollectionBanner && (
                                            <AlertBanner
                                                data-purpose="formerly-in-ub-collection-message"
                                                styleName="styles.alert-banner-behavior-hint"
                                                ctaText={gettext('Dismiss')}
                                                dismissButtonProps={false}
                                                title={gettext(
                                                    'This course is not currently in the Udemy Business Collection.',
                                                )}
                                            />
                                        )}
                                    </div>
                                )}
                                {!courseId && this.renderNoPermissionInstructor()}
                                {this.props.store.studentStore.totalStudents
                                    ? this.renderStudentMetrics()
                                    : this.renderNoStudents()}
                                <WelcomeModal
                                    isOpen={instructorStore.isWelcomeModalOpen}
                                    onClose={() => instructorStore.setIsWelcomeModalOpen(false)}
                                    onFinish={() =>
                                        this.startPopoverTourWithRedirect(
                                            instructorStore.popoverTourStartingPoint,
                                        )
                                    }
                                    finishButtonText={gettext('See the new experience')}
                                    steps={ubOnlyInsightsWelcomeModalSteps}
                                />
                            </div>
                        )}
                    </div>
                )}
                <PopoverTour
                    open={instructorStore.isPopoverTourOpen}
                    onClose={() => instructorStore.setIsPopoverTourOpen(false)}
                    onRedirect={(redirectUrl) => this.props.history.replace(redirectUrl)}
                    steps={ubOnlyInsightsPopoverTourSteps}
                    maxInterval={instructorStore.popoverTourMaxInterval}
                    startingStep={1}
                />
            </div>
        );
    }
}
