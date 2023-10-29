import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, observable, computed} from 'mobx';

import {CourseManageActionEvent} from 'course-manage-v2/events';
import {showErrorToast, showReloadPageErrorToast} from 'instructor/toasts';
import SurveyStore from 'survey/survey.mobx-store';
import getConfigData from 'utils/get-config-data';
import udApi, {defaultErrorMessage} from 'utils/ud-api';

const udConfig = getConfigData();

export default class CreateCourseFlowStore {
    PAGES = ['type', 'title', 'category', 'time'];
    UFB_PAGES = ['title'];
    SURVEY_CODE = 'instructor-time-commitment';
    UNDECIDED_CATEGORY_ID = '-1';

    isUfb = udConfig.brand.organization;

    @observable pages = [];
    @observable categoryList = [];
    @observable currentPage = '';
    @observable
    pageData = {
        type: null,
        category: null,
        title: null,
        anyAvailableOpportunity: false,
        uniqueOpportunityId: null,
    };

    @observable courseId = null;
    @observable surveyStore = {};
    @observable surveyLoaded = false;
    @observable isCreatingCourse = false;
    @observable isIP = false;
    @observable isInSupplyGapsTargetGroup = false;

    constructor() {
        this.initializePages();
    }

    setPageData(data) {
        this.pageData = Object.assign({}, this.pageData, data);
    }

    setIsIP(value) {
        this.isIP = value;
    }

    setIsInSupplyGapsTargetGroup(value) {
        this.isInSupplyGapsTargetGroup = value;
    }

    @computed
    get currentPageNum() {
        return this.pages.indexOf(this.currentPage) + 1;
    }

    @computed
    get totalNumPages() {
        return this.pages.length;
    }

    @computed
    get nextDisabled() {
        if (this.isCreatingCourse) {
            return true;
        }
        if (this.currentPage === 'time') {
            return !this.time;
        }
        if (this.currentPage === 'category') {
            return this.pageData[this.currentPage] === 'default';
        }
        return !this.pageData[this.currentPage]?.trim();
    }

    // We are only using the survey framework for one question, so we isolate it here
    @computed
    get relatedSurveyQuestion() {
        if (!this.surveyLoaded) {
            return null;
        }
        return this.surveyStore.questionSets[0].questions[0];
    }

    @computed
    get time() {
        if (!this.surveyLoaded) {
            return null;
        }
        return this.surveyStore.userAnswers[this.relatedSurveyQuestion.id];
    }

    @action
    initializePages() {
        if (!udConfig.brand.organization) {
            this.getCourseCategories();
        }
        this.pages = this.isUfb ? this.UFB_PAGES : this.PAGES;
        this.currentPage = this.pages[0];
    }

    @action
    setPage(pageNum) {
        this.currentPage = this.pages[pageNum - 1];
    }

    priorPagesCompleted(pageNum) {
        this.pages.slice(0, pageNum - 1).every((page) => {
            return this.pageData[page];
        });
    }

    @action
    updateData(key, value) {
        this.pageData[key] = value;
    }

    @action
    getCourseCategories() {
        return udApi.get('/course-categories/').then(
            action((response) => {
                this.categoryList = response.data.results;
            }),
        );
    }

    @action
    loadSurvey() {
        this.surveyStore = new SurveyStore(this.SURVEY_CODE);
        return this.surveyStore.getSurvey().then(
            action(() => {
                this.surveyStore.setUserAnswers({});
                this.surveyLoaded = true;
            }),
        );
    }

    @autobind
    @action
    createCourse() {
        this.isCreatingCourse = true;
        const courseData = {
            is_practice_test_course: this.pageData.type === 'practice',
            title: this.pageData.title,
            intended_category_id:
                this.pageData.category === this.UNDECIDED_CATEGORY_ID
                    ? null
                    : this.pageData.category,
        };
        if (this.pageData.uniqueOpportunityId) {
            courseData.unique_opportunity_id = this.pageData.uniqueOpportunityId;
        }
        return udApi
            .post('/courses/', courseData)
            .then(
                action((response) => {
                    this.courseId = response.data.id;
                    Tracker.publishEvent(
                        new CourseManageActionEvent({
                            courseId: this.courseId,
                            category: 'create_course',
                            action: 'click',
                            objectType: 'course',
                            objectId: this.courseId,
                        }),
                    );
                }),
            )
            .catch(
                action((error) => {
                    this.isCreatingCourse = false;
                    if (error.response.data.title) {
                        showErrorToast(
                            interpolate(gettext('Please update your title. %s'), [
                                error.response.data.title,
                            ]),
                        );
                    } else {
                        showReloadPageErrorToast(defaultErrorMessage);
                    }
                }),
            );
    }

    @autobind
    @action
    finishFlow() {
        return this.createCourse().then(() => {
            if (!this.isUfb) {
                this.surveyStore.updateCourseId(this.courseId);
                this.surveyStore.saveUserAnswers();
            }
        });
    }
}
