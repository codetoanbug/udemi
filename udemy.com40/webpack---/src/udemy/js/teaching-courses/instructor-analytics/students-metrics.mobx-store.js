import {generateTrackingId} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {API_STATE} from 'instructor/constants';
import udApi, {TIMEOUT} from 'utils/ud-api';
import udMe from 'utils/ud-me';

import {
    COURSE_CARD_FIELDS,
    STUDENT_CARD_FIELDS,
    DEFAULT_NUM_METRICS_PER_PAGE,
    DEFAULT_DATA_SCOPE_FILTER,
    DATA_SCOPE_FILTERS,
} from './constants';
import {SUPPORTED_COUNTRIES} from './datamaps.react-component';

export function radius(surface) {
    return Math.sqrt(surface / Math.PI);
}

function getApiState(error) {
    if (error) {
        const {response} = error;
        if (response) {
            const {status} = response;
            if (status === 403) {
                return API_STATE.NO_PERMISSION;
            }
            if (status === 404) {
                return API_STATE.NOT_FOUND;
            }
        }
        return API_STATE.ERROR;
    }
}

export default class StudentsMetricsStore {
    @observable totalStudents = null;
    @observable newStudents = null;
    @observable totalStudentsSearchState = API_STATE.SEARCHING;

    countries = null;
    enrollments = null;
    languages = null;
    interests = null;
    students = null;

    constructor(breakpoints) {
        this.breakpoints = breakpoints;
        this.countries = new CountriesMetrics(this);
        this.languages = new LanguagesMetrics(this);
        this.interests = new InterestsMetrics();
        this.enrollments = new EnrollmentMetrics();
        this.students = new StudentList();
    }

    @computed
    get studentMetricSearchState() {
        const states = [
            this.totalStudentsSearchState,
            this.interests.searchState,
            this.countries.searchState,
            this.enrollments.searchState,
            this.languages.searchState,
            this.students.searchState,
        ];
        if (states.some((state) => state === API_STATE.NO_PERMISSION)) {
            return API_STATE.NO_PERMISSION;
        }
        if (states.some((state) => state === API_STATE.ERROR)) {
            return API_STATE.ERROR;
        }
        if (states.some((state) => state === API_STATE.SEARCHING)) {
            return API_STATE.SEARCHING;
        }
        return API_STATE.DONE;
    }

    @action
    getTotalStudents(courseId, dataScope) {
        this.totalStudentsSearchState = API_STATE.SEARCHING;
        if (!dataScope) {
            dataScope = DEFAULT_DATA_SCOPE_FILTER;
        }
        const dataScopeParam = {data_scope: dataScope};
        if (!courseId && dataScope === DATA_SCOPE_FILTERS.ALL) {
            return udApi
                .get(`/users/${udMe.id}/`, {
                    useCache: true,
                    timeout: TIMEOUT,
                    params: {
                        ...dataScopeParam,
                        'fields[user]': 'total_num_students_performance_permission',
                    },
                })
                .then(
                    action((response) => {
                        this.totalStudents =
                            response.data.total_num_students_performance_permission;
                        this.totalStudentsSearchState = API_STATE.DONE;
                    }),
                )
                .catch(
                    action(() => {
                        this.totalStudentsSearchState = API_STATE.ERROR;
                    }),
                );
        } else if (!courseId && dataScope === DATA_SCOPE_FILTERS.UB) {
            return udApi
                .get('/instructor-performance/enrollment-metrics/', {
                    useCache: true,
                    timeout: TIMEOUT,
                    params: dataScopeParam,
                })
                .then(
                    action((response) => {
                        this.totalStudents =
                            response.data.results[0].total_num_students_performance_permission;
                        this.totalStudentsSearchState = API_STATE.DONE;
                    }),
                )
                .catch(
                    action(() => {
                        this.totalStudentsSearchState = API_STATE.ERROR;
                    }),
                );
        }
        const params = {...dataScopeParam, course_id: courseId, 'fields[course]': 'total'};
        return udApi
            .get('/instructor-performance/enrollment-metrics/', {
                useCache: true,
                params,
                timeout: TIMEOUT,
            })
            .then(
                action((response) => {
                    this.totalStudents = response.data.results[0].total;
                    this.totalStudentsSearchState = API_STATE.DONE;
                }),
            )
            .catch(
                action(() => {
                    this.totalStudentsSearchState = API_STATE.ERROR;
                }),
            );
    }
}

class StudentList {
    @observable mostRecentStudents = [];
    @observable searchState = API_STATE.SEARCHING;

    @action
    getMostRecentStudents(courseId, dataScope) {
        this.searchState = API_STATE.SEARCHING;

        // Make no actual call when dataScope is UB since most recent students view is excluded from UB
        // Added this logic here to keep searchState cycle intact
        if (dataScope && dataScope === DATA_SCOPE_FILTERS.UB) {
            this.searchState = API_STATE.DONE;
            return Promise.resolve();
        }

        const params = {
            'fields[user]': STUDENT_CARD_FIELDS.join(','),
            page_size: 12,
            ordering: '-enrollment_date',
            data_scope: dataScope,
        };
        let promise;
        if (courseId) {
            promise = udApi.get(`/courses/${courseId}/students/`, {
                useCache: true,
                timeout: TIMEOUT,
                params,
            });
        } else {
            promise = udApi.get('/users/me/recent-enrollment/', {
                useCache: true,
                timeout: TIMEOUT,
                params,
            });
        }

        return promise
            .then(
                action((response) => {
                    this.mostRecentStudents = response.data.results.map((student) => {
                        let enrollmentDate = student.enrollment_date;
                        if (enrollmentDate) {
                            const [year, month, day] = student.enrollment_date.split('-');
                            enrollmentDate = new Date(year, month - 1, day);
                        }
                        return {
                            ...student,
                            enrollment_date: enrollmentDate,
                        };
                    });
                    this.searchState = API_STATE.DONE;
                }),
            )
            .catch(
                action((error) => {
                    this.searchState = getApiState(error);
                }),
            );
    }
}

class EnrollmentMetrics {
    @observable searchState = API_STATE.SEARCHING;
    @observable courses = [];

    @action
    getEnrolledCourses(courseId, dataScope) {
        const params = {'fields[course]': COURSE_CARD_FIELDS.join(',')};
        if (courseId) {
            params.course_id = courseId;
        }

        this.searchState = API_STATE.SEARCHING;
        return udApi
            .get('/instructor-performance/student-enrollments/', {
                useCache: true,
                timeout: TIMEOUT,
                params: {...params, data_scope: dataScope},
            })
            .then(
                action((response) => {
                    this.courses = response.data.results.reduce((filtered, option) => {
                        if (option.enrolled_course) {
                            filtered.push({
                                ...option.enrolled_course,
                                frontendTrackingId: generateTrackingId(),
                            });
                        }
                        return filtered;
                    }, []);
                    this.searchState = API_STATE.DONE;
                }),
            )
            .catch(
                action((error) => {
                    this.searchState = getApiState(error);
                }),
            );
    }
}

export class PaginatedMetrics {
    @observable searchState = API_STATE.SEARCHING;
    @observable activePage = 1;
    @observable metrics = [];
    pageSize = DEFAULT_NUM_METRICS_PER_PAGE;

    @computed
    get startIndex() {
        return (this.activePage - 1) * this.pageSize;
    }

    @computed
    get activePageData() {
        return this.metrics.slice(this.startIndex, this.startIndex + this.pageSize);
    }

    @computed
    get numPages() {
        return Math.ceil(this.metrics.length / this.pageSize);
    }

    @autobind
    @action
    goToPage(page) {
        this.activePage = page;
    }

    @action
    getMetrics() {
        throw new Error('Not implemented');
    }

    @action
    resetPagination() {
        this.activePage = 1;
    }
}

class InterestsMetrics extends PaginatedMetrics {
    @action
    getMetrics(courseId, dataScope) {
        this.resetPagination();
        this.searchState = API_STATE.SEARCHING;
        this.activePage = 1;
        const params = !courseId ? {page_size: 40} : {course_id: courseId, page_size: 40};
        return udApi
            .get('/instructor-performance/student-interests/', {
                useCache: true,
                params: {...params, data_scope: dataScope},
                timeout: TIMEOUT,
            })
            .then(
                action((response) => {
                    this.metrics = response.data.results;
                    this.searchState = API_STATE.DONE;
                }),
            )
            .catch(
                action((error) => {
                    this.metrics = [];
                    this.searchState = getApiState(error);
                }),
            );
    }
}

class CountriesMetrics extends PaginatedMetrics {
    @observable maxNumStudentsForACountry = null;
    @observable _rawMetrics = [];
    _studentStore = null;

    constructor(studentStore) {
        super();
        this._studentStore = studentStore;
    }

    @computed
    get _noCountryData() {
        if (!this._studentStore.totalStudents) {
            return [];
        }

        return [
            {
                country: {
                    title: gettext('Unknown'),
                },
                num_students: this._studentStore.totalStudents,
                percentage: 1,
            },
        ];
    }

    @computed
    get metrics() {
        if (this._rawMetrics.length === 0) {
            return this._noCountryData;
        }

        // Translate country titles.
        const countries = this._rawMetrics.map((country) => ({
            country: {
                title: country.country.title,
                iso_code: country.country.iso_code,
            },
            num_students: country.num_students,
            percentage: 1,
        }));

        // If country data is less than total students, add Unknown.
        let totalStudents = countries.reduce((prev, country) => prev + country.num_students, 0);
        if (totalStudents === 0) {
            return this._noCountryData;
        }
        if (totalStudents < this._studentStore.totalStudents) {
            countries.push({
                country: {
                    title: gettext('Unknown'),
                },
                num_students: this._studentStore.totalStudents - totalStudents,
            });
            totalStudents = this._studentStore.totalStudents;
        }

        // Compute percentages based on totalStudents, which is sum of all country students data. Round to 1 decimal.
        countries.forEach((country) => {
            country.percentage = parseFloat((country.num_students / totalStudents).toFixed(3));
        });

        return countries.sort((a, b) => b.num_students - a.num_students);
    }

    @computed
    get numCountries() {
        return this.metrics.filter((obj) => obj.country.title !== gettext('Unknown')).length;
    }

    @computed
    get studentCountriesChartData() {
        const MIN_RADIUS = 3;
        const MAX_RADIUS = this._studentStore.breakpoints.isMobileMax ? 14 : 28;
        const maxRadius = radius(this.maxNumStudentsForACountry);
        return this.metrics
            .filter((obj) =>
                SUPPORTED_COUNTRIES.find(
                    (supportedCountry) => supportedCountry === obj.country.iso_code,
                ),
            )
            .map((sc) => ({
                centered: sc.country.iso_code,
                name: sc.country.title,
                fillKey: 'bubbleFill',
                num_students: sc.num_students,
                radius:
                    MIN_RADIUS + ((MAX_RADIUS - MIN_RADIUS) * radius(sc.num_students)) / maxRadius,
            }));
    }

    @action
    getMetrics(courseId, dataScope) {
        this.resetPagination();
        this.searchState = API_STATE.SEARCHING;
        const apiUrl = '/instructor-performance/student-countries/';
        const params = {page_size: 999, data_scope: dataScope};

        if (courseId) {
            const instructorPromise = udApi.get(apiUrl, {
                useCache: true,
                params,
                timeout: TIMEOUT,
            });

            const coursePromise = udApi.get(apiUrl, {
                useCache: true,
                params: {course_id: courseId, ...params},
                timeout: TIMEOUT,
            });

            return Promise.all([coursePromise, instructorPromise])
                .then(
                    action(([courseResponse, instructorResponse]) => {
                        this._rawMetrics = courseResponse.data.results;
                        this.searchState = API_STATE.DONE;
                        this.maxNumStudentsForACountry = Math.max(
                            ...instructorResponse.data.results.map((result) => result.num_students),
                        );
                    }),
                )
                .catch(
                    action((error) => {
                        this.searchState = getApiState(error);
                    }),
                );
        }

        return udApi
            .get(apiUrl, {
                useCache: true,
                params,
                timeout: TIMEOUT,
            })
            .then(
                action((response) => {
                    this._rawMetrics = response.data.results;
                    this.searchState = API_STATE.DONE;
                    this.maxNumStudentsForACountry = Math.max(
                        ...response.data.results.map((result) => result.num_students),
                    );
                }),
            )
            .catch(
                action((error) => {
                    this.searchState = getApiState(error);
                }),
            );
    }
}

class LanguagesMetrics extends PaginatedMetrics {
    _studentStore = null;
    constructor(studentStore) {
        super();
        this._studentStore = studentStore;
    }

    @computed
    get _noLanguageData() {
        if (!this._studentStore.totalStudents) {
            return [];
        }

        return [
            {
                language: gettext('Unknown'),
                num_students: this._studentStore.totalStudents,
                percentage: 1,
            },
        ];
    }

    @computed
    get metrics() {
        if (this._rawMetrics.length === 0) {
            return this._noLanguageData;
        }

        const languages = this._rawMetrics.map((language) => ({
            // See Language.title in LOCALIZED_MODELS.
            // eslint-disable-next-line gettext/no-variable-string
            language: gettext(language.language),
            num_students: language.num_students,
        }));

        // If language data is less than total students, add Unknown.
        let totalStudents = languages.reduce((prev, language) => prev + language.num_students, 0);
        if (totalStudents === 0) {
            return this._noLanguageData;
        }
        if (totalStudents < this._studentStore.totalStudents) {
            languages.push({
                language: gettext('Unknown'),
                num_students: this._studentStore.totalStudents - totalStudents,
            });
            totalStudents = this._studentStore.totalStudents;
        }

        // Compute percentages based on totalStudents, which is sum of all country students data. Round to 1 decimal.
        languages.forEach((language) => {
            language.percentage = parseFloat((language.num_students / totalStudents).toFixed(3));
        });

        return languages.sort((a, b) => b.num_students - a.num_students);
    }

    @computed
    get numLanguages() {
        return this._rawMetrics.length;
    }

    @action
    getMetrics(courseId, dataScope) {
        this.resetPagination();
        this.searchState = API_STATE.SEARCHING;
        const apiUrl = '/instructor-performance/student-languages/';
        let params = {page_size: 999, data_scope: dataScope};

        if (courseId) {
            params = {course_id: courseId, ...params};
        }

        return udApi
            .get(apiUrl, {
                useCache: true,
                params,
                timeout: TIMEOUT,
            })
            .then(
                action((response) => {
                    this._rawMetrics = response.data.results;
                    this.searchState = API_STATE.DONE;
                }),
            )
            .catch(
                action((error) => {
                    this.searchState = getApiState(error);
                }),
            );
    }
}
