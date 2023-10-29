import {observable, action, computed} from 'mobx';

import udApi from 'utils/ud-api';

export default class AddCourseToCustomCategoryStore {
    constructor(organizationId, courseId, courseCustomCategories) {
        this.organizationId = organizationId;
        this.courseId = courseId;
        // An array of categories which the course with the given course id
        // is part of.
        this.courseCustomCategories = courseCustomCategories;
        this.customCategoriesUrl = `/organizations/${this.organizationId}/categories/`;
        this.courseCustomCategoriesUrl = `courses/${this.courseId}/?fields[course]=custom_category_ids`;
        this.updateCustomCategoriesUrl = `/organizations/${this.organizationId}/courses/${this.courseId}/categories/`;
    }

    @observable categories = [];
    @observable isLoading = false;
    @observable errorMessage = null;
    @observable isSubmitting = false;

    @action
    fetchCustomCategories = () => {
        this.isLoading = true;

        return udApi
            .get(this.customCategoriesUrl, {useCache: true})
            .then(
                action((response) => {
                    this.errorMessage = null;
                    this.categories = this.filterCategories(response.data.results);
                    return response.data.results;
                }),
            )
            .catch(
                action((error) => {
                    this.errorMessage = error.response ? error.response.data.detail : error.message;
                }),
            )
            .finally(
                action(() => {
                    this.isLoading = false;
                }),
            );
    };

    @action
    resetModal = () => {
        this.courseCustomCategories = [];
        this.errorMessage = null;
    };

    @action
    addCourse = () => {
        const reducer = (formData, category) => {
            formData.append('categoryIds[]', category.id);
            return formData;
        };

        const data = this.selectedCategories.reduce(reducer, new FormData());

        this.isSubmitting = true;

        return udApi
            .put(this.updateCustomCategoriesUrl, data)
            .then(
                action((response) => {
                    this.errorMessage = null;
                    return response.headers['x-ui-message'];
                }),
            )
            .catch(
                action((error) => {
                    this.errorMessage = error.response ? error.response.data.detail : error.message;
                }),
            )
            .finally(
                action(() => {
                    this.isSubmitting = false;
                }),
            );
    };

    @action
    fetchCourseCustomCategories = () => {
        this.isLoading = true;

        return udApi
            .get(this.courseCustomCategoriesUrl)
            .then(
                action((response) => {
                    this.courseCustomCategories = response.data.custom_category_ids;
                    return response.data.custom_category_ids;
                }),
            )
            .catch(
                action((error) => {
                    this.errorMessage = error.response ? error.response.data.detail : error.message;
                }),
            )
            .finally(
                action(() => {
                    this.isLoading = false;
                }),
            );
    };

    @action
    fetchCategoryData = () => {
        const promise =
            this.courseCustomCategories.length === 0
                ? this.fetchCourseCustomCategories()
                : Promise.resolve();
        return promise.then(this.fetchCustomCategories);
    };

    @action
    toggleCategory = (event) => {
        this.categories = this.categories.map((category) => {
            if (category.id === parseInt(event.target.name, 10)) {
                category.isSelected = !category.isSelected;
            }

            return category;
        });
    };

    @computed
    get selectedCategories() {
        return this.categories.filter((category) => category.isSelected);
    }

    filterCategories = (categories) => {
        return categories.reduce((filteredCategories, category) => {
            category.isSelected = this.courseCustomCategories.includes(category.id);

            // A custom category is a CategoryNode which is not part of
            // content subscription.
            if (!category.is_in_content_subscription && !category.is_uncategorized) {
                filteredCategories.push(category);
            }

            return filteredCategories;
        }, []);
    };
}
