import autobind from 'autobind-decorator';
import {action, computed, extendObservable, observable, runInAction} from 'mobx';

import {API_STATE, TAUGHT_COURSES_URL, TAUGHT_COURSES_PARAMS} from 'instructor/constants';
import qs from 'utils/query-params';
import udApi, {TIMEOUT} from 'utils/ud-api';

export const STARS = {
    1: gettext('1 star'),
    2: gettext('2 stars'),
    3: gettext('3 stars'),
    4: gettext('4 stars'),
    5: gettext('5 stars'),
};

const SORT_NEWEST_FIRST_KEY = '-user_modified';
const SORT_OLDEST_FIRST_KEY = 'user_modified';

export const SORTS = {
    [SORT_NEWEST_FIRST_KEY]: gettext('Newest first'),
    [SORT_OLDEST_FIRST_KEY]: gettext('Oldest first'),
};

const DATA_SCOPE_ALL = 'all';
const DATA_SCOPE_UB = 'ub';
const DEFAULT_DATA_SCOPE = DATA_SCOPE_ALL;

export const DATA_SCOPE_LABELS = {
    [DATA_SCOPE_ALL]: gettext('All'),
    [DATA_SCOPE_UB]: gettext('Udemy Business'),
};

const API_URL = '/users/me/taught-courses-reviews/';
const PAGE_SIZE = 15;

export default class ReviewsStore {
    @observable courseId;
    @observable stars = [];
    @observable sort = SORT_NEWEST_FIRST_KEY;
    @observable reviewApiState = API_STATE.SEARCHING;
    @observable taughtCoursesApiState = API_STATE.SEARCHING;
    @observable page = 1;
    @observable reviews = [];
    @observable numOfTotalReviews = 0;
    @observable notAnswered = false;
    @observable hasCommented = 0;
    @observable dataScope = DEFAULT_DATA_SCOPE;
    @observable taughtCourses;
    @observable isReviewsRouteInitialized = false;

    constructor(instructorStore) {
        extendObservable(this, {
            instructorStore,
        });
    }

    @autobind
    @action
    getReviewsWithParams(params, dataScope) {
        const queryParams = qs.parse(params, {ignoreQueryPrefix: true});
        this.courseId = parseInt(queryParams.course_id, 10);
        this.sort = queryParams.sort || SORT_NEWEST_FIRST_KEY;
        this.stars = this._parseStarFiltersParam(queryParams.star);
        this.notAnswered = Boolean(parseInt(queryParams.unresponded, 10)) || false;
        this.hasCommented = Boolean(parseInt(queryParams.commented, 10)) || false;
        this.dataScope = dataScope || DEFAULT_DATA_SCOPE;
        this._getReviews();
    }

    _parseStarFiltersParam(starFilters) {
        if (!starFilters) {
            return [];
        }
        const stars = starFilters.split(',');
        return stars.map((star) => parseInt(star, 10));
    }

    @autobind
    @action
    _getReviews() {
        this.reviewApiState = API_STATE.SEARCHING;
        let params = {
            page: this.page,
            page_size: PAGE_SIZE,
            ordering: this.sort,
            'fields[course_review]': '@default,course,response,survey_answers',
            'fields[user]': 'id,title,display_name,initials,url,image_50x50,is_ub_user',
            'fields[course]':
                'id,image_125_H,image_200_H,avg_rating,rating,url,title,' +
                'num_reviews_recent,features,visible_instructors',
            'fields[course_feature]': 'reviews_responses_create',
            'fields[course_review_response]': 'id,content,user,modified,created',
            update_last_checked_reviews_time: 1,
        };
        if (this.notAnswered) {
            params = {...params, unresponded: 1};
        }
        if (this.hasCommented) {
            params = {...params, commented: 1};
        }
        if (this.stars.length > 0) {
            params = {...params, star: this.stars.join(',')};
        }
        if (this.courseId) {
            params = {...params, course: this.courseId};
        }
        if (this.dataScope) {
            params = {...params, data_scope: this.dataScope};
        }
        return udApi
            .get(API_URL, {params, timeout: TIMEOUT})
            .then(
                action((response) => {
                    this.reviews = response.data ? response.data.results : [];
                    this.numOfTotalReviews = response.data ? response.data.count : 0;
                }),
            )
            .finally(
                action(() => {
                    this.reviewApiState =
                        this.reviewApiState !== API_STATE.ERROR ? API_STATE.DONE : API_STATE.ERROR;
                }),
            );
    }

    @autobind
    onCSVExport() {
        udApi.post('/users/me/taught-courses-reviews/export/');
    }

    @autobind
    @action
    onPageSelect(page) {
        this.page = page;
        this._getReviews();
    }

    @computed
    get pageCount() {
        return Math.ceil(this.numOfTotalReviews / PAGE_SIZE);
    }

    @computed
    get starFilterTitle() {
        if (this.stars.length === 0) {
            return gettext('All');
        }
        return ninterpolate('%(star)s star', '%(star)s stars', this.stars.length, {
            star: this.stars.join(','),
        });
    }

    @computed
    get selectedCourse() {
        const taughtCourses = this.taughtCourses || [];
        return taughtCourses.find((c) => c.id === this.courseId);
    }

    @computed
    get viewableCourses() {
        if (this.taughtCourses) {
            return this.taughtCourses.filter((course) =>
                course.permissions.find(
                    (uhp) => uhp.permission === 'instructor:manage_course_reviews',
                ),
            );
        }
        return [];
    }

    @action
    isCourseInUbEver(courseId) {
        const result = this.taughtCourses.find(
            (course) => course.id === courseId && course.is_course_in_ub_ever === true,
        );
        return result !== undefined;
    }

    @computed
    get apiState() {
        const states = [this.reviewApiState, this.taughtCoursesApiState];
        if (states.some((state) => state === API_STATE.ERROR)) {
            return API_STATE.ERROR;
        }
        if (states.some((state) => state === API_STATE.SEARCHING)) {
            return API_STATE.SEARCHING;
        }
        return API_STATE.DONE;
    }

    @autobind
    @action
    async loadTaughtCourses(dataScope) {
        this.taughtCoursesApiState = API_STATE.SEARCHING;
        dataScope = dataScope || DEFAULT_DATA_SCOPE;
        const courses = await this.loadTaughtCoursesWithParams(dataScope);
        runInAction(() => {
            this.taughtCourses = courses;
            this.taughtCoursesApiState = API_STATE.DONE;
        });
    }

    async loadTaughtCoursesWithParams(dataScope) {
        const params = {...TAUGHT_COURSES_PARAMS, data_scope: dataScope};
        let response;
        try {
            response = await udApi.get(TAUGHT_COURSES_URL, {
                useCache: true,
                params,
                timeout: TIMEOUT,
            });
        } catch (error) {
            runInAction(() => {
                this.taughtCoursesApiState = API_STATE.ERROR;
            });
        }
        return response.data.results;
    }
}
