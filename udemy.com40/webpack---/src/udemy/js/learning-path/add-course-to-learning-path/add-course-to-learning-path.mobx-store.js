import {observable, action, computed, runInAction} from 'mobx';

import {BASE_PATH} from 'learning-path/constants';
import udApi from 'utils/ud-api';

export default class AddCourseToLearningPathStore {
    constructor(organizationId, courseId, globalOverrides = {ninterpolate}) {
        this.organizationId = organizationId;
        this.courseId = courseId;
        this.courseLearningPathUrl = `/courses/${this.courseId}/learning-paths/`;
        this.globalOverrides = globalOverrides;
    }

    @observable learningPaths = [];
    @observable courseLearningPaths = [];
    @observable duplicatedCoursePaths = [];

    @observable isLoading = false;
    @observable errorMessage = null;
    @observable isSubmitting = false;

    @observable newLearningPathTitle;
    @observable isLearningPathFormVisible = false;
    @observable isCreatingLearningPath = false;

    @observable titleTooLong = false;

    @action
    toggleLearningPathForm = () => {
        this.isLearningPathFormVisible = !this.isLearningPathFormVisible;
    };

    @action
    setNewLearningPathTitle = (event) => {
        const title = event.target.value.trim();
        if (title.length > 255) {
            this.titleTooLong = true;
        } else {
            this.newLearningPathTitle = title;
            this.titleTooLong = false;
        }
    };

    @action
    createLearningPath = async () => {
        if (!this.newLearningPathTitle) {
            return Promise.resolve(null);
        }

        this.isCreatingLearningPath = true;
        try {
            const response = await udApi.post(BASE_PATH, {title: this.newLearningPathTitle});
            const lp = response.data;
            lp.isSelected = true;

            runInAction(() => {
                this.learningPaths.push(lp);
                this.newLearningPathTitle = undefined;
            });

            return response.data;
        } catch (err) {
            runInAction(() => {
                this.errorMessage = err.response?.data?.detail || err.message;
            });
        } finally {
            runInAction(() => {
                this.isCreatingLearningPath = false;
                this.isLearningPathFormVisible = false;
            });
        }
    };

    @action
    fetchLearningPaths = async () => {
        const learningPaths = await udApi.get(BASE_PATH, {
            params: {
                list_type: 'my',
                /* common solution in our code base to display all results instead of default page size */
                page_size: 9999,
            },
        });
        runInAction(() => {
            this.learningPaths = learningPaths.data.results;
        });
        return this.learningPaths;
    };

    @action
    fetchCourseLearningPaths = async () => {
        const courseLearningPaths = await udApi.get(this.courseLearningPathUrl, {
            params: {'fields[learning_path]': 'id'},
        });
        runInAction(() => {
            this.courseLearningPaths = courseLearningPaths.data.results.map((path) => path.id);
        });
        return this.courseLearningPaths;
    };

    @action
    resetModal = () => {
        this.errorMessage = null;
        this.duplicatedCoursePaths = [];
    };

    @action
    addCourse = async () => {
        const data = this.selectedPaths.reduce((formData, path) => {
            formData.append('learningPathsIds[]', path.id);
            return formData;
        }, new FormData());

        data.append('course_id', this.courseId);

        this.isSubmitting = true;

        try {
            const {ninterpolate} = this.globalOverrides;
            await udApi.post('/learning-paths/append-course/', data);
            runInAction(() => {
                this.errorMessage = null;
            });
            return ninterpolate(
                'This course has been added to the selected learning path',
                'This course has been added to the selected learning paths',
                this.selectedPaths.length,
            );
        } catch (err) {
            runInAction(() => {
                this.errorMessage = err.response?.data?.detail || err.message;
            });
        } finally {
            runInAction(() => {
                this.isSubmitting = false;
            });
        }
    };

    @action
    fetchLearningPathData = async () => {
        this.isLoading = true;

        try {
            const [learningPaths, courseLearningPaths] = await Promise.all([
                this.fetchLearningPaths(),
                this.fetchCourseLearningPaths(),
            ]);
            runInAction(() => {
                this.errorMessage = null;
            });
            return [learningPaths, courseLearningPaths];
        } catch (err) {
            runInAction(() => {
                this.errorMessage = err.response?.data?.detail || err.message;
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    };

    @action
    toggleLearningPath = (event) => {
        const targetId = parseInt(event.target.name, 10);
        this.learningPaths = this.learningPaths.map((path) => {
            if (path.id === targetId) {
                path.isSelected = !path.isSelected;

                if (path.isSelected && this.courseLearningPaths.includes(path.id)) {
                    this.duplicatedCoursePaths.push(path);
                }

                if (!path.isSelected && this.courseLearningPaths.includes(path.id)) {
                    this.duplicatedCoursePaths = this.duplicatedCoursePaths.filter(
                        (path) => path.id !== targetId,
                    );
                }
            }

            return path;
        });
    };

    @computed
    get selectedPaths() {
        return this.learningPaths.filter((path) => path.isSelected);
    }
}
