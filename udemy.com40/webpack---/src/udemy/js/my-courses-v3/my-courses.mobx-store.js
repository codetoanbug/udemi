import {action, extendObservable, computed, runInAction, observable} from 'mobx';

import {attachFrontendTrackingIds} from 'browse/tracking';
import LeaveRatingStore from 'course-reviews/common/alt-leave-rating.mobx-store';
import {LEAVE_A_RATING_MY_COURSES_LOCATION} from 'course-reviews/common/locations';
import Enrollment from 'course-taking/enrollment.mobx-model';
import getConfigData from 'utils/get-config-data';
import udApi from 'utils/ud-api';
import udPerf from 'utils/ud-performance';
import Raven from 'utils/ud-raven';

import {updateSearchParams} from './search-params';

const udConfig = getConfigData();

export default class MyCoursesStore {
    pageSize = 12;
    searchQuery = '';

    isOrganization = udConfig.brand.has_organization;
    collectionsEnabled = !udConfig.brand.has_organization;

    sortOptions = [
        {value: '-last_accessed', title: gettext('Recently Accessed')},
        {value: '-enroll_time', title: gettext('Recently Enrolled')},
        {value: 'title', title: gettext('Title: A-to-Z')},
        {value: '-title', title: gettext('Title: Z-to-A')},
    ];

    progressOptions = {
        'in-progress': {
            title: gettext('In Progress'),
            params: {max_progress: 99.9, min_progress: 0.1},
        },
        completed: {title: gettext('Completed'), params: {max_progress: 100, min_progress: 100}},
        'not-started': {title: gettext('Not Started'), params: {max_progress: 0, min_progress: 0}},
    };

    searchParams = {};

    defaultFilterTitles = {
        category: gettext('Categories'),
        instructor: gettext('Instructor'),
        progress: gettext('Progress'),
    };

    constructor(activeTab, location, history) {
        this.activeTab = activeTab; // 'learning_tab', 'collection_tab', 'archive_tab'
        extendObservable(this, {
            categories: [],
            categoryTitle: this.defaultFilterTitles.category,
            isCategorySelected: false,
            category_id: null,
            collections: [],
            courses: [],
            currentPage: 1,
            instructorTitle: this.defaultFilterTitles.instructor,
            isInstructorSelected: false,
            instructors: [],
            isClean: true,
            isLoading: true,
            ordering: '-last_accessed',
            progressFilters: [],
            progressTitle: this.defaultFilterTitles.progress,
            isProgressSelected: false,
            count: 0,
        });
        this.location = location;
        this.history = history;
    }

    filterParams = {};

    @action
    removeCourse(id) {
        if (this.courses.find((course) => course.id === id)) {
            this.courses = this.courses.filter((course) => course.id !== id);

            this.count--;

            if (this.courses.length === 0 && this.pageCount > 0) {
                let page = this.currentPage;
                if (this.currentPage > this.pageCount && this.currentPage > 1) {
                    page--;
                }
                updateSearchParams({p: `${page}`}, this.history);
            }
        }
    }

    @action
    setState(searchParams) {
        this.searchParams = searchParams;
        this.filterParams = {};

        this.searchQuery = searchParams.get('q') || '';

        if (searchParams.has('p')) {
            this.isClean = Array.from(searchParams).length < 2;
            this.currentPage = parseInt(searchParams.get('p'), 10) || 1;
        } else {
            this.isClean = Array.from(searchParams).length < 1;
            this.currentPage = 1;
        }

        switch (this.activeTab) {
            case 'archive_tab':
                this.filterParams.is_archived = true;
                break;
            case 'learning_tab':
                this.filterParams.is_archived = false;

                if (searchParams.has('sort')) {
                    this.ordering = searchParams.get('sort');
                } else {
                    this.ordering = '-last_accessed';
                }
                this.setProgress(searchParams);
                this.setCategory(searchParams);
                this.setInstructor(searchParams);
                break;
            default:
                break;
        }
    }

    setProgress(searchParams) {
        if (searchParams.has('progress_filter')) {
            this.isProgressSelected = true;
            const progressFilter = this.progressOptions[searchParams.get('progress_filter')];
            this.progressTitle = progressFilter.title;
            this.filterParams = {...this.filterParams, ...progressFilter.params};
        } else {
            this.isProgressSelected = false;
            this.progressTitle = this.defaultFilterTitles.progress;
        }
    }

    setCategory(searchParams) {
        if (searchParams.has('category_filter')) {
            this.isCategorySelected = true;
            const cateogryFilter = searchParams.get('category_filter');
            switch (cateogryFilter) {
                case 'favorited':
                    this.categoryTitle = gettext('Favorites');
                    this.filterParams.is_favorited = true;
                    break;
                case 'all':
                    this.categoryTitle = gettext('All Categories');
                    break;
                case 'archived':
                    this.categoryTitle = gettext('Archived');
                    this.filterParams.is_archived = true;
                    break;
                default: {
                    const categoryId = parseInt(cateogryFilter, 10);
                    if (categoryId) {
                        if (this.categories.length > 0) {
                            const category = this.categories.find(
                                (category) => category.id === categoryId,
                            );
                            this.categoryTitle = category.title;
                        }
                        this.filterParams.category_id = categoryId;
                    }
                }
            }
        } else {
            this.isCategorySelected = false;
            this.categoryTitle = this.defaultFilterTitles.category;
        }
    }

    @action
    setInstructor(searchParams) {
        const instructorFilter = searchParams.get('instructor_filter');
        const instructorId = parseInt(instructorFilter, 10);
        if (instructorId) {
            if (this.instructors.length > 0) {
                const instructor = this.instructors.find(
                    (instructor) => instructor.id === instructorId,
                );
                this.instructorTitle = instructor ? instructor.title : this.instructorTitle;
            }
            this.filterParams.instructor_id = instructorId;
            this.isInstructorSelected = true;
        } else {
            this.instructorTitle = this.defaultFilterTitles.instructor;
            this.isInstructorSelected = false;
        }
    }

    updateMyCourses(searchParams) {
        this.setState(searchParams);
        this.loadFilters();
        this.loadCourses();
        this.loadCollections();
    }

    @computed
    get pageCount() {
        return this.count ? Math.ceil(this.count / this.pageSize) : 0;
    }

    @computed
    get sortTitle() {
        const selected = this.sortOptions.find((option) => option.value === this.ordering);
        return (selected && selected.title) || gettext('Sort by');
    }

    @computed
    get showZeroState() {
        return !this.searchQuery && this.courses.length === 0;
    }

    @action
    async loadCourses() {
        this.isLoading = true;

        const apiParams = {
            ordering: this.ordering,
            'fields[course]': getEnrolledCourseFields().join(','),
            'fields[user]': '@min,job_title',
            page: this.currentPage,
            page_size: this.pageSize,
            ...(this.searchQuery && {search: this.searchQuery}),
        };
        try {
            udPerf.start('_learningApi');

            const myCoursesUrl = '/users/me/subscribed-courses/';

            const response = await udApi.get(myCoursesUrl, {
                params: {...apiParams, ...this.filterParams},
            });
            udPerf.end('_learningApi');

            const results = response.data.results || [];
            attachFrontendTrackingIds(results);
            const courses = results.map((course) => {
                const enrollmentData = {
                    courseId: course.id,
                    favorite_time: course.favorite_time,
                    archive_time: course.archive_time,
                };
                return {...course, enrollment: new Enrollment(enrollmentData)};
            });

            await getReviewsForCourses(courses);

            runInAction(() => {
                this.courses = courses;
                this.count = response.data.count;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                Raven.captureException(error);
            });
        }
    }

    async loadFilters() {
        // eslint-disable-next-line camelcase
        const {category_id, ...cagegoryParams} = this.filterParams;
        const categoriesUrl = '/users/me/subscribed-courses-categories/';
        const categriesPromise = udApi
            .get(categoriesUrl, {
                params: {
                    'fields[course_category]': 'id,title',
                    previewing: false,
                    page_size: 15,
                    ...cagegoryParams,
                },
            })
            .then(
                action((response) => {
                    this.categories = response.data.results || [];
                    this.setCategory(this.searchParams);
                }),
            )
            .catch((error) => {
                Raven.captureException(error);
            });

        // eslint-disable-next-line camelcase
        const {max_progress, min_progress, ...progressParams} = this.filterParams;
        const progressUrl = '/users/me/subscribed-courses-progress-filters/';
        const progressPromise = udApi
            .get(progressUrl, {
                params: {
                    ordering: '-access_time,-enrolled',
                    ...progressParams,
                },
            })
            .then(
                action((response) => {
                    this.progressFilters = response.data.results || [];
                }),
            )
            .catch((error) => {
                Raven.captureException(error);
            });
        this.resetInstructors();
        return Promise.all([categriesPromise, progressPromise, this.loadInstructors()]);
    }

    instructorsPage = 1;
    instructorsPageSize = 20;
    instructorsNextPage = null;
    @observable instructorsLoading = false;

    @action
    resetInstructors() {
        this.instructorsPage = 1;
        this.instructorsNextPage = null;
        this.instructors = [];
    }

    @action
    async loadInstructors() {
        if ((!this.instructorsNextPage && this.instructorsPage !== 1) || this.instructorsLoading) {
            return;
        }
        this.instructorsLoading = true;
        try {
            // eslint-disable-next-line camelcase
            const {instructor_id, ...instructorParams} = this.filterParams;
            const instructorsUrl = '/users/me/subscribed-courses-instructors/';
            const response = await udApi.get(instructorsUrl, {
                params: {
                    page: this.instructorsPage++,
                    page_size: this.instructorsPageSize,
                    ...instructorParams,
                },
            });
            runInAction(() => {
                const results = response.data.results || [];
                this.instructors.push(...results);
                this.instructorsNextPage = response.data.next;
                this.setInstructor(this.searchParams);
                this.instructorsLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.instructorsLoading = false;
                Raven.captureException(error);
            });
        }
    }

    collectionsPage = 1;
    collectionsPageSize = 8;
    collectionsNextPage = null;
    @observable collectionsLoading = false;

    @action
    async loadCollections() {
        if ((!this.collectionsNextPage && this.collectionsPage !== 1) || this.collectionsLoading) {
            return;
        }

        this.collectionsLoading = true;

        try {
            const response = await udApi.get('/users/me/subscribed-courses-collections/', {
                params: {
                    page: this.collectionsPage++,
                    page_size: this.collectionsPageSize,
                    'fields[course]': 'id',
                    'fields[user_has_subscribed_courses_collection]': '@all',
                },
            });
            runInAction(() => {
                const results = response.data.results || [];
                this.collections.push(...results);
                this.collectionsNextPage = response.data.next;
                this.collectionsLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.collectionsLoading = false;
                Raven.captureException(error);
            });
        }
    }
}

export function getEnrolledCourseFields() {
    const fields = [
        'archive_time',
        'buyable_object_type',
        'completion_ratio',
        'enrollment_time',
        'favorite_time',
        'features',
        'image_240x135',
        'image_480x270',
        'is_practice_test_course',
        'is_private',
        'is_published',
        'last_accessed_time',
        'num_collections',
        'published_title',
        'title',
        'tracking_id',
        'url',
        'visible_instructors',
    ];
    if (udConfig.brand.has_organization) {
        fields.push('is_course_available_in_org');
    }
    return fields;
}

export async function getReviewsForCourses(courses) {
    try {
        const response = await udApi.get('/users/me/course-reviews/', {
            params: {
                courses: courses.map((a) => a.id).join(','),
                'fields[course_review]': '@min,course,response',
                'fields[course]': 'id',
                page_size: courses.length,
                page: 1,
            },
        });
        const results = response.data.results || [];
        const reviews = results.reduce((reviews, obj) => {
            reviews[obj.course.id] = obj;
            return reviews;
        }, {});
        courses.forEach((course) => {
            course.leaveRatingStore = new LeaveRatingStore(
                course,
                reviews[course.id],
                LEAVE_A_RATING_MY_COURSES_LOCATION,
                gettext('Leave a rating'),
                gettext('Your rating'),
                gettext('Edit rating'),
            );
        });
    } catch (error) {
        Raven.captureException(error);
    }
}
