import autobind from 'autobind-decorator';
import {action, observable, computed} from 'mobx';

import {showErrorToast} from 'organization-common/toasts';
import qs from 'utils/query-params';
import udApi, {defaultErrorMessage} from 'utils/ud-api';

import {COURSES_PER_PAGE} from './constants';

export default class ImportedCoursesStore {
    constructor(organizationId) {
        this.organizationId = organizationId;
    }

    @observable courses = [];
    @observable totalCourses = 0;
    @observable page = 1;
    @observable isLoading = true;
    @observable errorMessage = null;

    @observable.ref buyLicensesCourse;
    @observable isBuyLicensesModalVisible = false;

    @computed
    get numOfPages() {
        return Math.ceil(this.totalCourses / COURSES_PER_PAGE);
    }

    @action
    fetchCourses(page = 1) {
        this.isLoading = true;

        return udApi
            .get(`/organizations/${this.organizationId}/imported-courses/`, {
                params: {page},
            })
            .then(
                action((response) => {
                    const {results, count} = response.data;

                    this.courses = results;
                    this.totalCourses = count;
                    this.page = page;

                    return response;
                }),
            )
            .finally(action(() => (this.isLoading = false)));
    }

    fetchImportedCourse(courseId) {
        return udApi
            .get(`/organizations/${this.organizationId}/imported-courses/${courseId}/`)
            .catch(
                action(() => {
                    showErrorToast(gettext('The course has not been found.'));
                    return Promise.reject();
                }),
            );
    }

    @autobind
    @action
    purchaseLicenses(course, numLicenses) {
        return udApi
            .post('/licenses/', qs.stringify({course_id: course.id, count: numLicenses}), {
                params: {'fields[license}': '@min'},
                headers: {
                    // This API endpoint expects form data...
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            .catch(() => {
                showErrorToast(defaultErrorMessage);
            });
    }

    @action
    openBuyLicensesModal(course) {
        this.buyLicensesCourse = course;
        this.isBuyLicensesModalVisible = true;
    }

    @autobind
    @action
    closeBuyLicensesModal() {
        this.isBuyLicensesModalVisible = false;
    }
}
