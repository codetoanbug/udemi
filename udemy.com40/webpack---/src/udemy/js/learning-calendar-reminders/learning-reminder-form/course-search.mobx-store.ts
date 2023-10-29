import {action, computed, observable, runInAction} from 'mobx';

import AutosuggestStore from 'base-components/form/autosuggest/autosuggest.mobx-store';
import loadCommonAppContext from 'common/load-common-app-context';
import udApi from 'utils/ud-api';

import {SEARCH_COURSE_MAX_SUGGESTIONS_COUNT} from '../constants';
import {CourseType} from '../types';

export class CourseSearchStore extends AutosuggestStore<CourseType> {
    @observable coursesLoaded = false;
    @observable.ref courses: CourseType[] = [];
    _coursesPromise = Promise.resolve();
    @observable isConsumerSubsSubscriber = false;

    @computed get query() {
        return this.inputValue.trim().toLowerCase();
    }

    loadInitialCourses() {
        this._coursesPromise = this._loadInitialCourses();
        return this._coursesPromise;
    }

    @action
    async _loadInitialCourses() {
        this.coursesLoaded = false;
        this.courses = [];

        const commonAppContext = await loadCommonAppContext();
        runInAction(() => {
            const {user} = commonAppContext.data.header;
            if ('id' in user) {
                this.isConsumerSubsSubscriber = user.consumer_subscription_active;
            } else {
                this.isConsumerSubsSubscriber = false;
            }
        });

        if (this.isConsumerSubsSubscriber) {
            const subsCoursesUrl = '/users/me/subscription-course-enrollments/';
            const params = {
                page_size: 1000,
                ordering: '-last_accessed',
                'fields[course]': 'title',
            };
            const response = await udApi.get(subsCoursesUrl, {
                params,
            });
            runInAction(() => {
                this.courses = response.data.results as CourseType[];
                this.coursesLoaded = true;
            });
        }

        const coursesUrl = '/users/me/subscribed-courses/';

        const params = {
            page_size: 1000,
            ordering: '-last_accessed',
            'fields[course]': 'title',
            is_archived: false,
        };

        const response = await udApi.get(coursesUrl, {
            params,
        });

        runInAction(() => {
            this.courses = this.courses.concat(response.data.results);
            this.coursesLoaded = true;
        });
    }

    @action async loadSuggestions() {
        if (!this.coursesLoaded) {
            await this._coursesPromise;
        }
        this.setSuggestions(this.filteredCourses);
    }

    @computed
    get filteredCourses() {
        let count = 0;
        return this.courses.filter((course) => {
            if (
                count < SEARCH_COURSE_MAX_SUGGESTIONS_COUNT &&
                course.title.toLowerCase().includes(this.query)
            ) {
                count++;
                return true;
            }
            return false;
        });
    }
}
