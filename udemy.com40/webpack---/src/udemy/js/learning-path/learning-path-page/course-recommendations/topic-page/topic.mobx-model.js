import {observable, action, computed, set} from 'mobx';

import {APIModel} from 'utils/mobx';
import udApi from 'utils/ud-api';

import {BASE_SKILLS_NAV} from '../constants';
import RecommendedCourse from './recommended-course.mobx-model';

export default class Topic extends APIModel {
    @observable courses = [];
    @observable isExpanded = false;
    @observable isLoading = false;

    constructor(data, index) {
        super(data);
        this.title = data.title;
        this.titleEnglish = data.title_in_english;
        this.themeDescription = data.theme_description;
        this.themeTitle = data.theme_title;
        this.themeImageUrl = data.image_url;
        index === 0 &&
            set(this, {
                isExpanded: true,
            });
    }

    async fetchCourses() {
        this.setIsLoading(true);

        const response = await udApi.get(`${BASE_SKILLS_NAV}courses/`, {
            params: {
                topics: [this.titleEnglish],
            },
        });
        this.setCourses(response.data.results);
        this.setIsLoading(false);
    }

    @action
    setCourses(coursesData) {
        this.courses = coursesData.map((course) => new RecommendedCourse(course));
    }

    @computed
    get isChecked() {
        return this.courses.length && this.courses.some((course) => course.isChecked);
    }

    @computed
    get checkedCourseIds() {
        return this.courses.filter((course) => course.isChecked).map((course) => course.id);
    }

    @action
    setIsExpanded(value) {
        this.isExpanded = value;
    }

    @action
    setIsLoading(value) {
        this.isLoading = value;
    }
}
