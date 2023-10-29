import autobind from 'autobind-decorator';
import {action, computed, observable, runInAction} from 'mobx';

import {showReloadPageErrorToast} from 'instructor/toasts';
import udApi, {defaultErrorMessage, TIMEOUT, MAX_TIMEOUT} from 'utils/ud-api';

import FeaturedQuestionsListStore from '../featured-questions/components/featured-questions-list.mobx-store';
import {API_SETTINGS} from '../question-answer/constants';
import QAStore from '../question-answer/qa.mobx-store';
import SystemMessage from '../utils/ud-system-message';
import {
    TAUGHT_COURSES_URL,
    API_STATE,
    TAUGHT_COURSES_PARAMS,
    TAUGHT_COURSES_PARAMS_SLIM,
} from './constants';
import TwoPaneStore from './layout/two-pane.mobx-store';

export default class InstructorStore {
    @observable action;
    @observable subaction;

    @observable unreadMessages = 0;
    @observable unreadQA = 0;
    @observable unreadFeaturedQuestions = 0;
    @observable unreadAssignments = 0;

    @observable _taughtCourses;
    @observable taughtCoursesError;
    @observable isPublishedInstructor;

    @observable isWelcomeModalOpen = false;
    @observable isReadyToOpenWelcomeModal = false;
    // this interval value is discussed with i3-eng team members due to average production load time
    @observable popoverTourMaxInterval = 250;
    @observable isPopoverTourOpen = false;
    @observable popoverTourStartingPoint = {
        pathname: '/performance/overview/revenue/',
        search: '?date_filter=year&course_id=&data_scope=ub',
    };

    constructor(action, subaction) {
        runInAction(() => {
            this.action = action;
            this.subaction = subaction;
        });

        const insStore = this;
        this.QAStore = new QAStore(API_SETTINGS, {
            baseUrl: '',
            instructorStore: insStore,
            twoPaneStore: new TwoPaneStore(),
        });

        this.FQLStore = new FeaturedQuestionsListStore({
            baseUrl: '',
            instructorStore: insStore,
            twoPaneStore: new TwoPaneStore(),
        });
    }

    @computed
    get hasUnreadCommunications() {
        return this.unreadMessages > 0 || this.unreadQA > 0 || this.unreadAssignments > 0;
    }

    @computed
    get taughtCoursesState() {
        if (this.taughtCoursesError) {
            return API_STATE.ERROR;
        }
        if (this._taughtCourses) {
            return API_STATE.DONE;
        }
        return API_STATE.SEARCHING;
    }

    @computed
    get publishedCourses() {
        if (!this._taughtCourses) {
            return [];
        }
        return this._taughtCourses.filter((course) => course.is_published);
    }

    @computed
    get unpublishedCourses() {
        if (!this._taughtCourses) {
            return [];
        }
        return this._taughtCourses.filter(
            (course) => course.was_ever_published && !course.is_published,
        );
    }

    @action
    setUnreadMessages(count) {
        this.unreadMessages = count;
    }

    @action
    setUnreadQA(count) {
        this.unreadQA = count;
    }

    @action
    loadInitialWelcomeModalStatus() {
        SystemMessage.hasSeen(SystemMessage.ids.ubInsightsInstructorWelcomeModal).then(
            (response) => {
                runInAction(() => {
                    this.isWelcomeModalOpen = !response.data;
                });
            },
        );
    }

    @action
    setIsWelcomeModalOpen(isWelcomeModalOpen) {
        if (isWelcomeModalOpen) {
            SystemMessage.hasSeen(SystemMessage.ids.ubInsightsInstructorWelcomeModal).then(
                (response) => {
                    runInAction(() => {
                        this.isWelcomeModalOpen = !response.data;
                    });
                },
            );
        } else {
            SystemMessage.seen(SystemMessage.ids.ubInsightsInstructorWelcomeModal);
            runInAction(() => {
                this.isWelcomeModalOpen = false;
            });
        }
    }

    @action
    setIsPopoverTourOpen(isPopoverTourOpen) {
        if (isPopoverTourOpen) {
            this.isPopoverTourOpen = true;
        } else {
            SystemMessage.seen(SystemMessage.ids.ubInsightsInstructorWelcomeModal);
            this.isPopoverTourOpen = false;
        }
    }

    @action
    startPopoverTour() {
        this.setIsWelcomeModalOpen(false);
        this.setIsPopoverTourOpen(true);
    }

    @action
    isCourseInUbEver(courseId) {
        const result = this._taughtCourses.find(
            (course) => course.id === courseId && course.is_course_in_ub_ever === true,
        );
        return result !== undefined;
    }

    @action
    hasCourseAPublishedCodingExercise(courseId) {
        const result = this._taughtCourses.find(
            (course) =>
                course.id === courseId && course.has_course_a_published_coding_exercise === true,
        );
        return result !== undefined;
    }

    @action
    setUnreadAssignments(count) {
        this.unreadAssignments = count;
    }

    @autobind
    @action
    async getUnread() {
        const params = {
            'fields[instructor_instructorcommsunion]': '@min',
        };
        try {
            const response = await udApi.get(
                '/users/me/taught-courses-comms/?unread_counts=1&only_counts=1',
                {
                    params,
                    timeout: TIMEOUT,
                },
            );
            runInAction(() => {
                this.unreadMessages = response.data.filtered_unread_counts.messages;
                this.unreadQA = response.data.filtered_unread_counts.questions;
                this.unreadFeaturedQuestions =
                    response.data.filtered_unread_counts.featured_questions;
                this.unreadAssignments = response.data.filtered_unread_counts.assignments;
            });
        } catch (error) {
            showReloadPageErrorToast(defaultErrorMessage);
        }
    }

    @action
    decreaseUnreadQACount() {
        this.unreadQA = Math.max(this.unreadQA - 1, 0);
    }

    @action
    decreaseUnreadFeaturedQuestionsCount() {
        this.unreadFeaturedQuestions = Math.max(this.unreadFeaturedQuestions - 1, 0);
    }

    @action
    increaseUnreadQACount() {
        this.unreadQA = this.unreadQA + 1;
    }

    @action
    increaseUnreadFeaturedQuestionsCount() {
        this.unreadFeaturedQuestions = this.unreadFeaturedQuestions + 1;
    }

    @computed
    get hasPublishedCourse() {
        return this._taughtCourses.filter((course) => course.is_published).length > 0;
    }

    async loadTaughtCoursesWithParams(params) {
        try {
            const response = await udApi.get(TAUGHT_COURSES_URL, {
                useCache: true,
                params,
                timeout: MAX_TIMEOUT,
            });
            runInAction(() => {
                this._taughtCourses = response.data.results;
                this.isPublishedInstructor = this.hasPublishedCourse;
            });
            return this._taughtCourses;
        } catch (error) {
            runInAction(() => {
                this.taughtCoursesError = error;
            });
        }
    }

    async loadTaughtCoursesSlim() {
        try {
            const response = await udApi.get(TAUGHT_COURSES_URL, {
                useCache: true,
                params: TAUGHT_COURSES_PARAMS_SLIM,
                timeout: TIMEOUT,
            });
            runInAction(() => {
                this._taughtCourses = response.data.results;
                this.isPublishedInstructor = this.hasPublishedCourse;
            });
            return this._taughtCourses;
        } catch (error) {
            runInAction(() => {
                this.taughtCoursesError = error;
            });
        }
    }

    async loadTaughtCourses(isTaughtCoursesApiSlimVersionEnabled) {
        if (isTaughtCoursesApiSlimVersionEnabled) {
            return this.loadTaughtCoursesSlim();
        }
        return this.loadTaughtCoursesWithParams(TAUGHT_COURSES_PARAMS);
    }
}
