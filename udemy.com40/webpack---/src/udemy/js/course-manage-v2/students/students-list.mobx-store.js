import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {HTTP_429_TOO_MANY_REQUESTS} from 'organization-common/constants';
import udApi, {defaultErrorMessage} from 'utils/ud-api';
import udMe from 'utils/ud-me';

export const SEARCH_QUERY_MIN_LENGTH = 3;

export default class StudentsListStore {
    @observable isLoading = false;
    @observable isFirstLoadingComplete = false;
    @observable studentsList = [];
    @observable studentCount = 0;
    @observable activePage = 1;
    @observable sortBy = {fieldName: 'enrollment_date', ascending: false};

    @observable searchInputValue = '';
    @observable error = null;
    pageSize = 10;
    courseId;

    constructor(courseId) {
        this.setCourseId(courseId);
    }

    @computed
    get searchQuery() {
        return this.searchInputValue.trim();
    }

    @computed
    get pageCount() {
        return Math.ceil(this.studentCount / this.pageSize);
    }

    @computed
    get ordering() {
        const {fieldName, ascending} = this.sortBy;
        return fieldName ? `${ascending ? '' : '-'}${fieldName}` : '';
    }

    @action
    setCourseId(id) {
        this.courseId = id;
    }

    @action
    fetchStudentsList() {
        const q = this.searchQuery && this.isSearchQueryValid ? this.searchQuery : '';
        this.isLoading = true;
        return udApi
            .get(`/courses/${this.courseId}/students/`, {
                params: {
                    ordering: this.ordering,
                    q,
                    page_size: this.pageSize,
                    page: this.activePage,
                    'fields[user]': [
                        '@default',
                        'completion_ratio',
                        'enrollment_date',
                        'is_organization_enrollment',
                        'last_accessed',
                        'question_count',
                        'question_answer_count',
                    ].join(','),
                },
            })
            .then(
                action(({data: response}) => {
                    this.error = null;
                    this.isLoading = false;
                    this.isFirstLoadingComplete = true;
                    this.studentsList = response.results || [];
                    this.studentCount = response.count;
                    return response;
                }),
            )
            .catch(
                action(({response}) => {
                    this.isLoading = false;
                    this.isFirstLoadingComplete = true;
                    if (response.status === HTTP_429_TOO_MANY_REQUESTS) {
                        this.error = {
                            title: gettext('Request limit reached.'),
                            content: gettext(
                                'You have reached the request limit, please try again in an hour.',
                            ),
                        };
                    } else {
                        this.error = {title: defaultErrorMessage, content: ''};
                    }
                }),
            );
    }

    @autobind
    sendCSV(onClose) {
        return udApi.post(`/courses/${this.courseId}/students/export/`).then(() => onClose());
    }

    @autobind
    @action
    setActivePage(pageNumber) {
        this.activePage = pageNumber;
        return this.fetchStudentsList();
    }

    @autobind
    @action
    setSorting(col) {
        const isActive = col.fieldName === this.sortBy.fieldName;
        this.sortBy = {
            fieldName: col.fieldName,
            ascending: isActive ? !this.sortBy.ascending : col.initialSortOrder === 'ascending',
        };
        return this.fetchStudentsList();
    }

    @autobind
    @action
    setSearchInputValue(value) {
        this.searchInputValue = value;
    }

    @autobind
    @action
    clearSearchInputValue() {
        this.sortBy = {fieldName: 'enrollment_date', ascending: false};
        this.searchInputValue = '';
        this.fetchStudentsListBySearch();
    }

    @computed
    get isSearchQueryValid() {
        if (this.isCJKLanguage) return true;
        return this.searchQuery.length >= SEARCH_QUERY_MIN_LENGTH;
    }

    @computed
    get isCJKLanguage() {
        return ['ja', 'ko', 'zh'].includes(udMe.language);
    }

    @autobind
    @action
    fetchStudentsListBySearch() {
        if (!this.searchQuery || this.isSearchQueryValid) {
            this.activePage = 1;
            this.fetchStudentsList();
        }
    }
}
