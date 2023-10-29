import {tokens} from '@udemy/styles';
import {action, computed, observable} from 'mobx';

import instructorTokens from 'instructor/variables';

import ConversionMetricsStore from './conversion-metrics.mobx-store';
import EngagementMetricsStore from './engagement/engagement-metrics.mobx-store';
import InstructorOverviewStore from './instructor-overview.mobx-store';
import ReviewsStore from './reviews.mobx-store';
import StudentsMetricsStore from './students-metrics.mobx-store';

export default class AnalyticsCommonStore {
    overviewStore = null;
    studentStore = null;
    conversionMetricsStore = null;
    engagementMetricsStore = null;
    reviewsStore = null;
    performanceBaseUrl = null;
    courseManageBaseUrl = null;

    @observable breakpoints = {isMdMax: false, isMobileMax: false};
    _mqlDisposers = [];

    constructor(instructorStore, performanceBaseUrl, courseManageBaseUrl) {
        this.instructorStore = instructorStore;
        this.performanceBaseUrl = performanceBaseUrl.endsWith('/')
            ? performanceBaseUrl.slice(0, -1)
            : performanceBaseUrl;
        this.courseManageBaseUrl = courseManageBaseUrl;
        this.overviewStore = new InstructorOverviewStore();
        this.studentStore = new StudentsMetricsStore(this.breakpoints);
        this.conversionMetricsStore = new ConversionMetricsStore();
        this.engagementMetricsStore = new EngagementMetricsStore();
        this.reviewsStore = new ReviewsStore(this.instructorStore);
    }

    @computed
    get coursesWithoutPerformancePermission() {
        if (!this.instructorStore._taughtCourses) {
            return [];
        }
        return this.instructorStore._taughtCourses.filter(
            (course) =>
                (course.is_published || course.was_ever_published) &&
                !(course.permissions || []).some(
                    (userHasPermission) =>
                        userHasPermission.permission === 'instructor:manage_course_performance',
                ),
        );
    }

    @computed
    get coursesWithoutReviewsPermission() {
        if (!this.instructorStore._taughtCourses) {
            return [];
        }
        return this.instructorStore._taughtCourses.filter(
            (course) =>
                (course.is_published || course.was_ever_published) &&
                !(course.permissions || []).some(
                    (userHasPermission) =>
                        userHasPermission.permission === 'instructor:manage_course_reviews',
                ),
        );
    }

    hasPerformancePermission(courseId) {
        if (!this.instructorStore._taughtCourses) {
            return false;
        }
        return !this.coursesWithoutPerformancePermission.some((course) => course.id === courseId);
    }

    @computed
    get numberOfCoursesWithPermission() {
        return (
            this.instructorStore._taughtCourses.length -
            this.coursesWithoutPerformancePermission.length
        );
    }

    _setUpMQL(query, flag) {
        const mql = window.matchMedia(query);
        const setMatches = action(({matches}) => {
            this.breakpoints[flag] = matches;
        });
        setMatches(mql);
        mql.addListener(setMatches);
        this._mqlDisposers.push(() => {
            mql.removeListener(setMatches);
        });
    }

    @action
    setUpMQLs() {
        this._setUpMQL(
            `(max-width: ${instructorTokens['breakpoint-instructor-mobile-max']})`,
            'isMobileMax',
        );
        this._setUpMQL(`(max-width: ${tokens['breakpoint-md-max']})`, 'isMdMax');
    }

    tearDownMQLs() {
        this._mqlDisposers.forEach((disposer) => disposer());
    }
}
