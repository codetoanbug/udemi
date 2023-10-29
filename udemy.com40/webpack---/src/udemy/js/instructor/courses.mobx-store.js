import CurrentMonthAndTotalIcon from '@udemy/icons/dist/current-month-and-total.ud-icon';
import CurrentMonthIcon from '@udemy/icons/dist/current-month.ud-icon';
import HiddenIcon from '@udemy/icons/dist/hidden.ud-icon';
import autobind from 'autobind-decorator';
import Cookies from 'js-cookie';
import {action, computed, observable, runInAction} from 'mobx';
import qs from 'qs';

import {showReloadPageErrorToast} from 'instructor/toasts';
import formatCurrency from 'utils/currency-formatter';
import {toLocalDateStamp} from 'utils/date';
import getConfigData from 'utils/get-config-data';
import udApi, {defaultErrorMessage} from 'utils/ud-api';
import udMe from 'utils/ud-me';
import userSettings, {SETTINGS} from 'utils/user-settings';

import {COURSE_VIEW_TYPES} from './constants';

const udConfig = getConfigData();

const COOKIE_NAME = 'InstructorCourseListViewType';
const MONTHLY = 'monthly';
const LIFETIME = 'lifetime';
const REVENUE_URL = '/share-holders/v1.0/';
const ZERO_AMOUNT_FORMATTED = formatCurrency('0.00', udConfig.price_country.usd_currency_formatter);

/**
 * share-holders API returns an array using either course:N/A or course:XXX
 *   as an identifier for the earnings
 */
const SHARE_HOLDERS_IDENTIFIER_LENGTH = 'course:'.length;

export default class CoursesStore {
    @observable courses = [];
    @observable coursesLoaded = false;
    @observable numCourses = 0;
    @observable query = '';
    @observable lastQuery = '';
    @observable activePage = 1;
    @observable orderingField = '-created';
    @observable courseViewType;

    COURSE_LIST_PAGE_SIZE = 32;
    COURSE_LIST_UNRESPONSIVE_PAGE_SIZE = 12;
    DEFAULT_ORDER = SETTINGS.instructorCoursesOrdering.defaultValue;
    DEFAULT_COURSE_VIEW_TYPE = 'light';

    orderingFields = {
        '-created': gettext('Newest'),
        created: gettext('Oldest'),
        title: gettext('A-Z'),
        '-title': gettext('Z-A'),
        'is_published,-admin_rating,-published_time,-created': gettext('Published first'),
        '-is_published,admin_rating,published_time,created': gettext('Unpublished first'),
    };

    revenueUrls = {
        [MONTHLY]:
            `${REVENUE_URL}:shareholder_id/total/` +
            `?aggregate=course&month=${toLocalDateStamp(new Date()).substring(0, 7)}`,
        [LIFETIME]: `${REVENUE_URL}:shareholder_id/total/?aggregate=course`,
    };

    courseViewTypes = {
        [COURSE_VIEW_TYPES.LIGHT]: {
            Icon: CurrentMonthIcon,
            label: gettext('View monthly course statistics.'),
            revenueCalls: [MONTHLY],
            tooltipText: gettext('See current month stats.'),
        },
        [COURSE_VIEW_TYPES.DETAIL]: {
            Icon: CurrentMonthAndTotalIcon,
            label: gettext('View monthly and total course statistics'),
            revenueCalls: [MONTHLY, LIFETIME],
            tooltipText: gettext('See current month and total stats.'),
        },
        [COURSE_VIEW_TYPES.PRIVACY]: {
            Icon: HiddenIcon,
            label: gettext('Hide all course statistics.'),
            revenueCalls: [],
            tooltipText: gettext('Hide all stats from this view.'),
        },
    };

    shareholderId = null;
    showFreeLabel = udConfig.features.home.my_courses.free_label;
    showRevenue = udConfig.features.home.my_courses.revenue;
    showReviews = udConfig.brand.is_add_reviews_enabled;
    coursesRevenues = {
        [MONTHLY]: null,
        [LIFETIME]: null,
    };

    constructor() {
        this.setCourseViewType(Cookies.get(COOKIE_NAME) || this.DEFAULT_COURSE_VIEW_TYPE);
    }

    @action
    parseQueryParametersFromLocation(location) {
        const {q, ordering} = qs.parse(location.search, {ignoreQueryPrefix: true});
        const coursesOrdering = userSettings.get(
            SETTINGS.instructorCoursesOrdering,
            this.DEFAULT_ORDER,
        );

        this.query = q || '';
        this.lastQuery = this.query;
        this.setOrderingField(ordering || coursesOrdering);
    }

    @autobind
    @action
    setQueryChangeEvent(event) {
        this.query = event.target.value;
    }

    @autobind
    @action
    setActivePage(page) {
        this.activePage = page;

        this.getCourseList();
    }

    @autobind
    @action
    setOrderingField(orderingField) {
        this.orderingField =
            orderingField in this.orderingFields ? orderingField : this.DEFAULT_ORDER;

        this.saveOrderingField(this.orderingField);
    }

    @autobind
    async saveOrderingField(orderingField) {
        const currentOrderingField = userSettings.get(SETTINGS.instructorCoursesOrdering);

        if (currentOrderingField !== orderingField) {
            await userSettings.set(SETTINGS.instructorCoursesOrdering, orderingField);
        }
    }

    @autobind
    @action
    setCourseViewType(courseViewType) {
        if (this.courseViewType && this.courseViewType !== courseViewType) {
            Cookies.set(COOKIE_NAME, courseViewType, {
                expires: 30, // days
                path: '/',
            });
        }
        this.courseViewType =
            courseViewType in this.courseViewTypes ? courseViewType : this.DEFAULT_COURSE_VIEW_TYPE;
    }

    @autobind
    @action
    updateLastQueryWithQuery() {
        this.lastQuery = this.query;
    }

    @action
    resetPaginationAndGetCourseList() {
        this.activePage = 1;
        this.numCourses = 0;

        this.getCourseList();
    }

    @computed
    get numPages() {
        return Math.ceil(this.numCourses / this.COURSE_LIST_PAGE_SIZE);
    }

    @computed
    get queryString() {
        const queryParams = {};

        if (this.lastQuery.length) {
            queryParams.q = this.lastQuery;
        }

        if (this.orderingField !== this.DEFAULT_ORDER) {
            queryParams.ordering = this.orderingField;
        }

        return qs.stringify(queryParams, {addQueryPrefix: true, skipNulls: true});
    }

    @computed
    get currentCourseViewTypeRevenueCalls() {
        return this.courseViewTypes[this.courseViewType].revenueCalls;
    }

    @computed
    get newRevenueCalls() {
        return this.currentCourseViewTypeRevenueCalls.filter(
            (revenueCall) => this.coursesRevenues[revenueCall] === null,
        );
    }

    @computed
    get ownedCourses() {
        return this.courses.filter((course) => !!course.is_owner);
    }

    @computed
    get marketplaceOnlyCourses() {
        return this.ownedCourses.filter((course) => !course.is_in_any_ufb_content_collection);
    }

    @action
    async leaveCourse(courseId) {
        return udApi.post(`/users/me/taught-courses/${courseId}/remove-from-instructors/`, {});
    }

    @autobind
    @action
    async getCourseInfo() {
        const params = {
            page: this.activePage,
            page_size: this.COURSE_LIST_PAGE_SIZE,
            ordering: this.orderingField,
            skip_caching: true,
            'fields[course]':
                'title,image_100x100,image_200_H,' +
                'status_label,is_paid,is_private,original_price_text,privacy_label,quality_status,' +
                'can_edit,can_use_course_manage,url,creation_progress_ratio,is_published,' +
                'num_subscribers,num_subscribers_recent,features,rating,quality_feedback_counts,' +
                'quality_review_process,can_use_revenue_report,can_use_qa,can_use_reviews,' +
                'is_owner,is_organization_eligible,show_organization_eligible_reminder,' +
                'is_in_any_ufb_content_collection,content_length_video,is_cleaned_course',
            'fields[feature]': 'reviews_view',
            'fields[quality_review_process]': 'last_submitted_date',
        };

        if (this.lastQuery) {
            params.search = this.lastQuery;
        }

        this.coursesLoaded = false;
        try {
            const response = await udApi.get('/users/me/taught-courses/', {params});
            runInAction(() => {
                this.courses = response.data.results;
                this.numCourses = response.data.count;
                this.courses.forEach((course) => {
                    course.has_no_feedback =
                        typeof course.quality_feedback_counts === 'undefined' ||
                        course.quality_feedback_counts.length === 0;
                    course.isOrganizationEligible = course.is_organization_eligible;
                    const qualityFeedbackCounts = {
                        needs_fix: 0,
                        fixed_needs_fix: 0,
                        acceptable: 0,
                        fixed_acceptable: 0,
                        exceptional: 0,
                    };
                    if (course.quality_feedback_counts.length) {
                        course.quality_feedback_counts.forEach((feedback) => {
                            if (feedback.rating !== 'exceptional' && feedback.is_marked_as_fixed) {
                                qualityFeedbackCounts[`fixed_${feedback.rating}`] += feedback.count;
                            }
                            qualityFeedbackCounts[feedback.rating] += feedback.count;
                        });
                    }
                    course.quality_feedback_counts = qualityFeedbackCounts;
                });
            });
        } catch (error) {
            if (this.COURSE_LIST_PAGE_SIZE === this.COURSE_LIST_UNRESPONSIVE_PAGE_SIZE) {
                showReloadPageErrorToast(defaultErrorMessage);
            } else {
                // The query fails to return in time for some instructors.  Fall back to a smaller page size.
                this.COURSE_LIST_PAGE_SIZE = this.COURSE_LIST_UNRESPONSIVE_PAGE_SIZE;
                return this.getCourseInfo();
            }
        }
    }

    @autobind
    @action
    async getShareholderAndAllRevenue() {
        if (this.shareholderId !== null) {
            return Promise.resolve();
        }

        try {
            const response = await udApi.get(REVENUE_URL, {params: {user_id: udMe.id}});
            if (response.data.results.length === 0) {
                return;
            }

            this.shareholderId = response.data.results[0].id;
            return await this.getAllRevenue();
        } catch (error) {
            // the api is expected to return a 404 when the user has 0 purchases
            if (error.response && error.response.status !== 404) {
                showReloadPageErrorToast(
                    gettext("We're having trouble updating your revenue information."),
                );
            }
        }
    }

    @autobind
    @action
    getAllRevenue() {
        if (this.shareholderId === null) {
            return Promise.resolve();
        }

        const newRevenueCalls = this.newRevenueCalls;
        if (newRevenueCalls.length === 0) {
            return Promise.resolve();
        }

        const getRevenue = async (revenueCall) => {
            const response = await udApi.get(
                this.revenueUrls[revenueCall].replace(':shareholder_id', this.shareholderId),
                {useCache: true},
            );

            this.coursesRevenues[revenueCall] = {};
            if (response.data.items.length === 0) {
                return;
            }

            response.data.items.forEach((item) => {
                const courseId = item.identifier.slice(SHARE_HOLDERS_IDENTIFIER_LENGTH);

                this.coursesRevenues[revenueCall][courseId] = formatCurrency(
                    item.amount.amount,
                    udConfig.price_country.usd_currency_formatter,
                );
            });
        };

        const revenueRequests = [];
        newRevenueCalls.forEach((revenueCall) => {
            revenueRequests.push(getRevenue(revenueCall));
        });

        return Promise.all(revenueRequests);
    }

    @autobind
    attachRevenueToCourses() {
        if (this.currentCourseViewTypeRevenueCalls.length === 0) {
            return;
        }

        this.courses.forEach((course) => {
            course.earnings = {};
            if (course.quality_status === 'approved') {
                this.currentCourseViewTypeRevenueCalls.forEach((revenueCallType) => {
                    course.earnings[revenueCallType] =
                        this.coursesRevenues[revenueCallType] !== null &&
                        course.id in this.coursesRevenues[revenueCallType]
                            ? this.coursesRevenues[revenueCallType][course.id]
                            : ZERO_AMOUNT_FORMATTED;
                });
            }
        });
    }

    @action
    async updateRevenue() {
        const originalState = this.coursesLoaded;
        this.coursesLoaded = false;
        try {
            await this.getAllRevenue();
            runInAction(() => {
                this.attachRevenueToCourses();
                this.coursesLoaded = originalState || (!originalState && this.coursesLoaded);
            });
        } catch (error) {
            // the api is expected to return a 404 when the user has 0 purchases
            if (error.response.status !== 404) {
                showReloadPageErrorToast(
                    gettext("We're having trouble updating your revenue information."),
                );
            }
        }
    }

    @autobind
    @action
    async getCourseList() {
        const courseInfo = this.getCourseInfo();
        const revenueInfo = this.getShareholderAndAllRevenue();

        await Promise.all([courseInfo, revenueInfo]);
        runInAction(() => {
            this.attachRevenueToCourses();
            this.coursesLoaded = true;
        });
    }
}
