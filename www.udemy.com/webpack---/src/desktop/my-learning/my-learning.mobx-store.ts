import {action, observable, when} from 'mobx';

import {
    QUERIES_BY_USE_CASE,
    ProgramEnrollmentStore,
    ProgramCardData,
} from '@udemy/subscription-browse';
import {udApi} from '@udemy/ud-api';

import {HeaderStore} from '../../header.mobx-store';
import {COURSE_PAGE_SIZE, PROGRAM_PAGE_SIZE} from './constants';

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

export interface LearningProgram {
    node: {
        completionRatio: number;
        program: {
            duration: number;
            icon: string;
            id: string;
            level: number;
            questionAnswerCount: number;
            title: string;
            url: string;
        };
    };
}

export class MyLearningStore {
    @observable isLoading = true;
    @observable.ref courses = [];
    @observable.ref programs: ProgramCardData[] = [];
    headerStore: HeaderStore;
    programEnrollmentStore: ProgramEnrollmentStore;
    loadPromise?: Promise<unknown>;

    constructor(headerStore: HeaderStore) {
        this.headerStore = headerStore;
        this.programEnrollmentStore = new ProgramEnrollmentStore();
    }

    get user() {
        return this.headerStore.userSpecificContext.user;
    }

    @action loadMyLearningContent = () => {
        if (this.loadPromise) {
            return this.loadPromise;
        }
        this.loadPromise = when(() => !!this.user)
            .then(() => Promise.all([this.loadPrograms(), this.loadCourses()]))
            .then(
                action(([programsResponse, coursesResponse]) => {
                    if (programsResponse) {
                        this.programs = programsResponse;
                    }
                    if (coursesResponse) {
                        this.courses = coursesResponse.data.results || [];
                    }
                    this.isLoading = false;
                }),
            )
            .catch(
                action(() => {
                    this.isLoading = false;
                }),
            );
        return this.loadPromise;
    };

    loadPrograms() {
        if (this.user.sms_subscriptions_active) {
            return (
                this.programEnrollmentStore
                    // Using PROGRAM_ENROLLMENTS because the result is likely cached
                    .queryProgramEnrollments(QUERIES_BY_USE_CASE.PROGRAM_ENROLLMENTS)
                    .then(() =>
                        this.programEnrollmentStore.programCardData.slice(0, PROGRAM_PAGE_SIZE),
                    )
                    .catch(noop)
            );
        }
        return Promise.resolve();
    }

    loadCourses() {
        const myCoursesUrl = this.user.consumer_subscription_active
            ? '/users/me/subscription-course-enrollments/'
            : '/users/me/subscribed-courses/';
        const params: {
            page_size: number;
            ordering: string;
            'fields[course]': string;
            is_archived?: boolean;
        } = {
            page_size: COURSE_PAGE_SIZE,
            ordering: '-last_accessed',
            'fields[course]': 'image_240x135,title,completion_ratio',
        };
        if (!this.user.consumer_subscription_active) {
            params.is_archived = false;
        }
        return udApi
            .get(myCoursesUrl, {
                params,
            })
            .catch(noop);
    }
}
