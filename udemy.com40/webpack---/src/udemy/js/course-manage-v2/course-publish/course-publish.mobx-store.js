import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {CourseManageActionEvent} from 'course-manage-v2/events';
import {showErrorToast, showReloadPageErrorToast, showSuccessToast} from 'instructor/toasts';
import udApi, {defaultErrorMessage, parseError} from 'utils/ud-api';
import udLink from 'utils/ud-link';

import * as constants from './constants';

export default class CoursePublishModalStore {
    constructor(props) {
        this.pageStore = props.pageStore;
    }

    @observable isModalOpen = false;
    @observable errors = {};
    @observable price;
    @observable domainURL;
    @observable isPracticeTestCourse;
    @observable organizationId;
    @observable publishRequirementsComplete = false;
    @observable initialized = false;
    @observable orgCategories;
    @observable URIValue = '';
    @observable URIPlaceholder = '';
    @observable missingPublishRequirements;
    @observable selectedOrgCategory;
    @observable isOrgAdmin = false;
    @observable isSubmitting = false;
    @observable wasPublished = false;

    @autobind
    @action
    getCourse() {
        return udApi
            .get(`/courses/${this.pageStore.course.id}/`, {
                params: {
                    'fields[course]':
                        'organization_id,is_practice_test_course,organization_domain,' +
                        'are_publish_requirements_completed,default_publish_title,published_time,' +
                        'missing_publish_requirements,base_price_detail,published_title,is_organization_admin',
                },
            })
            .then(
                action((response) => {
                    this.initializeValues(response.data);
                }),
            )
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }

    @autobind
    @action
    initializeValues(values) {
        this.isPracticeTestCourse = values.is_practice_test_course;
        this.organizationId = values.organization_id;
        // it is possible for missingPublishRequirements to have empty items
        // so it is necessary to use publishRequirementsComplete
        this.missingPublishRequirements = values.missing_publish_requirements;
        this.publishRequirementsComplete = values.are_publish_requirements_completed;
        this.publishedTitle = values.published_title;
        this.wasPublished = Boolean(values.published_time);
        if (values.base_price_detail) {
            this.price = values.base_price_detail.price_string;
        } else {
            this.price = gettext('Free');
        }
        if (this.organizationId) {
            this.getUFBCategories();
            this.domainURL = `${constants.HTTP_HEADER}${values.organization_domain}`;
            this.URIValue = '';
            this.URIPlaceholder = constants.UFB_DEFAULT_URI;
            this.isOrgAdmin = values.is_organization_admin;
        } else {
            this.domainURL = constants.UDEMY_URL;
            this.URIValue = values.default_publish_title;
            this.URIPlaceholder = '';
            this.initialized = true;
        }
    }

    @autobind
    @action
    getUFBCategories() {
        return udApi
            .get(`/organizations/${this.organizationId}/categories/`, {
                params: {},
            })
            .then(
                action((response) => {
                    this.orgCategories = response.data.results.filter(
                        (category) => category.is_in_content_subscription === false,
                    );

                    this.orgCategories = [
                        {id: 0, title: constants.UFB_CATEGORY_DEFAULT_VALUE},
                        {title: constants.SEPARATOR},
                        ...this.orgCategories,
                    ];
                    this.selectedOrgCategory = 0;

                    this.initialized = true;
                }),
            )
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }

    getUrlAfterPublishUFB() {
        if (!this.isOrgAdmin) {
            return null;
        }
        const location = this.publishedTitle || this.URIValue;
        return {
            url: udLink.toCourseTaking(location),
            isInCourseManageApp: false,
        };
    }

    getUrlAfterPublishNotUFB() {
        if (this.isPracticeTestCourse || this.wasPublished) {
            return null;
        }
        return {
            url: '/feedback/',
            isInCourseManageApp: true,
        };
    }

    @computed
    get urlAfterPublish() {
        return this.organizationId ? this.getUrlAfterPublishUFB() : this.getUrlAfterPublishNotUFB();
    }

    @autobind
    @action
    publishOrSubmitCourse() {
        this.isSubmitting = true;
        const courseParams = {};
        if (this.URIValue) {
            courseParams.published_title = this.URIValue;
        }
        if (this.orgCategories && this.selectedOrgCategory) {
            courseParams.org_custom_category_id = this.selectedOrgCategory;
        }
        return udApi
            .patch(`/courses/${this.pageStore.course.id}/publish/`, courseParams)
            .then(
                action(() => {
                    showSuccessToast(gettext('Your changes have been successfully saved.'));
                    Tracker.publishEvent(
                        new CourseManageActionEvent({
                            courseId: this.pageStore.course.id,
                            category: 'publish',
                            action: 'click',
                            objectType: null,
                            objectId: null,
                        }),
                    );
                    this.closeModal();
                    this.pageStore.refreshPublishCourseStatus();
                    return this.urlAfterPublish;
                }),
            )
            .catch(
                action((error) => {
                    this.isSubmitting = false;
                    this.errors = parseError(error);
                    if (
                        error.response &&
                        error.response.data &&
                        Object.keys(error.response.data).length > 0
                    ) {
                        showErrorToast(
                            gettext('Your changes have not been saved. Please address the issues.'),
                        );
                    } else {
                        showReloadPageErrorToast(defaultErrorMessage);
                    }
                }),
            );
    }

    @autobind
    @action
    setURIValue(value) {
        if (this.errors) {
            this.errors = {};
        }
        this.URIValue = value;
    }

    @autobind
    @action
    openModal() {
        // Since the course could have changed, force reinitialization.
        this.initialized = false;
        this.errors = {};
        this.isSubmitting = false;
        this.isModalOpen = true;
    }

    @autobind
    @action
    closeModal() {
        this.isModalOpen = false;
    }

    @autobind
    @action
    setSelectedOrganizationCategory(value) {
        this.selectedOrgCategory = value && parseInt(value, 10);
    }

    @computed
    get modalTitle() {
        if (this.publishRequirementsComplete) {
            if (this.isPracticeTestCourse || this.organizationId) {
                return constants.PUBLISH_COURSE;
            }
            return constants.SUBMIT_FOR_REVIEW;
        }
        return constants.WHY_CANT_I_SUMBIT;
    }

    @computed
    get modalButtonText() {
        if (this.isPracticeTestCourse || (this.organizationId && this.isOrgAdmin)) {
            return constants.PUBLISH_COURSE;
        } else if (this.organizationId) {
            return constants.REQUEST_PUBLISH;
        }
        return constants.SUBMIT_FOR_REVIEW;
    }

    @computed
    get noteText() {
        let note = constants.NOTE_TEXT;
        if (this.isPracticeTestCourse) {
            note = constants.PRACTICE_TEST_NOTE_TEXT;
        }
        return interpolate(note, {price: this.price}, true);
    }

    @action
    validate() {
        const errors = {};
        if (!this.publishedTitle) {
            if (!isNaN(this.URIValue) || this.URIValue.length < 8 || this.URIValue.length > 70) {
                errors.published_title = [constants.COURSE_URI_HELP_TEXT];
            }
        }
        this.errors = errors;
        return Object.keys(errors).length === 0;
    }
}
