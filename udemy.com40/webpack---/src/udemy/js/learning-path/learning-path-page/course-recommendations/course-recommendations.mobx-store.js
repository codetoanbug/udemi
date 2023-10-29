import autobind from 'autobind-decorator';
import {action, computed, observable, runInAction} from 'mobx';

import {showErrorToast} from 'organization-common/toasts';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

import {NUMBER_THEMES_TO_SHOW} from '../constants';
import {BASE_SKILLS_NAV, ERROR_MESSAGE} from './constants';
import ThemeListPage from './theme-page/theme-list-page.react-component';
import Theme from './theme-page/theme.mobx-model';
import Topic from './topic-page/topic.mobx-model';
import TopicsPage from './topic-page/topics-page.react-component';

export default class CourseRecommendationsStore {
    @observable currentPageNum = 0;
    @observable themes = [];
    @observable topics = [];
    @observable isAddSectionHeadingsChecked = false;
    @observable isSaving = false;
    @observable isLoading = false;
    MIN_SELECTED_THEMES = 1;
    PAGES = [ThemeListPage, TopicsPage];
    totalPages = this.PAGES.length;

    async fetchThemes() {
        this.setIsLoading(true);

        try {
            const response = await udApi.get(`${BASE_SKILLS_NAV}themes/`);
            runInAction(() => {
                this.themes = response.data.results.map((theme) => new Theme(theme, false));
            });
        } catch (e) {
            Raven.captureException(e);
            showErrorToast(ERROR_MESSAGE);
        } finally {
            this.setIsLoading(false);
        }
    }

    @action clearSelection() {
        this.themes = [];
        this.topics = [];
    }

    // not the best way, because we clear the selection
    @action clearTopicsList(unselectedThemeTitle) {
        return this.topics.filter((topic) => topic.themeTitle !== unselectedThemeTitle);
    }

    async fetchTopics() {
        try {
            const response = await udApi.get(`${BASE_SKILLS_NAV}topics/`, {
                params: {themes: [...this.checkedThemesTitle]},
            });
            runInAction(() => {
                this.topics = response.data.results.map((topic, index) => new Topic(topic, index));
            });
        } catch (e) {
            Raven.captureException(e);
            showErrorToast(ERROR_MESSAGE);
        }
    }

    @computed
    get topicsByTheme() {
        return this.topics.reduce((acc, topic) => {
            (acc[topic.themeTitle] = acc[topic.themeTitle] || []).push(topic);
            return acc;
        }, {});
    }

    @computed
    get themesByType() {
        // First we group the themes by business and technology
        const groupedThemes = this.themes.reduce(
            (acc, theme) => {
                acc[theme.type].themes.push(theme);
                return acc;
            },
            {
                business: {
                    title: gettext('Business'),
                    containerProps: {},
                    themes: [],
                },
                tech: {
                    title: gettext('Technology'),
                    containerProps: {},
                    themes: [],
                },
            },
        );

        groupedThemes.tech.containerProps.showCount = NUMBER_THEMES_TO_SHOW;
        groupedThemes.business.containerProps.showCount = NUMBER_THEMES_TO_SHOW;

        // Expand by default if any of the themes are checked
        ['business', 'tech'].forEach((category) => {
            const hasCheckedTheme = groupedThemes[category].themes.some((theme) => {
                return theme.checked || false;
            });
            if (hasCheckedTheme) {
                groupedThemes[category].containerProps.showAll = true;
            }
        });

        // Then we return 2 objects in the right order
        return [groupedThemes.tech, groupedThemes.business];
    }

    @autobind
    @action
    updateTheme(title, isChecked) {
        const selectedTheme = this.themes.filter((theme) => theme.titleEnglish === title);
        selectedTheme[0].check(isChecked);

        if (!isChecked) {
            return this.clearTopicsList(title);
        }
        return selectedTheme;
    }

    @computed
    get checkedThemesTitle() {
        const data = [];
        this.checkedThemes.forEach((theme) => {
            data.push(theme.titleEnglish);
        });
        return data;
    }

    @computed
    get checkedThemes() {
        return this.themes.filter((theme) => theme.checked);
    }

    @computed
    get checkedCourseIds() {
        const data = [];

        this.topics.forEach((topic) => {
            if (topic.isChecked) {
                data.push(...topic.checkedCourseIds);
            }
        });
        return data;
    }

    @computed
    get checkedCoursesForTopic() {
        const data = [];

        this.topics.forEach((topic) => {
            if (topic.isChecked) {
                data.push({title: topic.title, course_ids: topic.checkedCourseIds});
            }
        });
        return data;
    }

    @computed
    get checkedThemeCount() {
        return this.themes.reduce((accumulator, theme) => accumulator + (theme.checked ? 1 : 0), 0);
    }

    @computed
    get hasMinCheckedThemes() {
        return this.checkedThemeCount >= this.MIN_SELECTED_THEMES;
    }

    @autobind
    @action
    onPrevClick() {
        this.currentPageNum = Math.max(0, this.currentPageNum - 1);
    }

    @autobind
    @action
    onNextClick() {
        this.currentPageNum = Math.max(0, this.currentPageNum + 1);
    }

    @action
    setIsAddSectionHeadingsChecked(value) {
        this.isAddSectionHeadingsChecked = value;
    }

    @action
    setIsSaving(value) {
        this.isSaving = value;
    }

    @action
    setIsLoading(value) {
        this.isLoading = value;
    }
}
