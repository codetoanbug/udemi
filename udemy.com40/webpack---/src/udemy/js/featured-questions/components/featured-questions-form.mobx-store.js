import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import {
    QUESTION_API_PARAMS,
    REPLY_API_PARAMS,
} from 'course-taking/dashboard/questions/question-answer/constants';
import udApi from 'utils/ud-api';

import {sanitizeUserGeneratedContent} from '../../course-taking/dashboard/questions/question-answer/helpers';

export default class FeaturedQuestionFormStore {
    @observable formData = {
        curriculumItemId: null,
        curriculumItemType: null,
        title: '',
        details: '',
        answer: '',
    };

    @observable formValidationState = {
        curriculumItemId: null,
        curriculumItemType: null,
        title: null,
        details: null,
        answer: null,
    };

    @observable courseId = null;
    @observable lectures = [];
    @observable showModal = false;

    constructor(courseId, featuredQuestionStore) {
        this.courseId = courseId;
        this.featuredQuestionStore = featuredQuestionStore;
    }

    @action
    toggleShowConfirmationModal() {
        this.showModal = !this.showModal;
    }

    @action
    toggleShowCreateFeaturedQuestion() {
        this.featuredQuestionStore.toggleShowCreateFeaturedQuestion();
    }

    @action
    setTitle(title) {
        this.formData.title = title;
    }

    @action
    setDetails(details) {
        this.formData.details = details;
    }

    @action
    setAnswer(answer) {
        this.formData.answer = answer;
    }

    @action
    setCourseId(courseId) {
        this.courseId = courseId;
    }

    @action
    setCurriculumItemId(curriculumItemId) {
        this.formData.curriculumItemId = curriculumItemId;
    }

    @action
    setCurriculumItemType(curriculumItemType) {
        this.formData.curriculumItemType = curriculumItemType;
    }

    @autobind
    async createFeaturedQuestion() {
        const requestBody = {
            title: this.formData.title,
            body: this.formData.details,
            related_object_type: this.formData.curriculumItemType,
            related_object_id: this.formData.curriculumItemId,
            is_featured: true,
        };

        const response = await udApi.post(`courses/${this.courseId}/discussions/`, requestBody, {
            params: QUESTION_API_PARAMS,
        });
        const courseDiscussionId = response.data.id;
        await udApi.post(
            `courses/${this.courseId}/discussions/${courseDiscussionId}/replies/`,
            {body: sanitizeUserGeneratedContent(this.formData.answer)},
            {
                params: REPLY_API_PARAMS,
            },
        );
    }

    async openLectureInNewTab() {
        const response = await udApi.get(`courses/${this.courseId}/`, {
            params: {'fields[course]': 'published_title'},
        });

        const title = response.data.published_title;
        const url = `/course/${title}/learn/${this.formData.curriculumItemType}/${this.formData.curriculumItemId}#questions`;
        window.open(url, '_blank');
    }

    @action
    validateForm() {
        this.formValidationState.curriculumItemId =
            this.formData.curriculumItemId === null ? 'error' : null;
        this.formValidationState.curriculumItemType =
            this.formData.curriculumItemType === null ? 'error' : null;
        this.formValidationState.title = this.formData.title === '' ? 'error' : null;
        this.formValidationState.details = this.formData.details === '' ? 'error' : null;
        this.formValidationState.answer = this.formData.answer === '' ? 'error' : null;
        return Object.values(this.formValidationState).every((result) => result === null);
    }
}
