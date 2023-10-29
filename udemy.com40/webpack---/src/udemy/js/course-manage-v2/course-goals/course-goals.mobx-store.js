import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import {showErrorToast, showReloadPageErrorToast, showSuccessToast} from 'instructor/toasts';
import udApi, {defaultErrorMessage, parseError, TIMEOUT} from 'utils/ud-api';

import {MIN_WHAT_YOU_WILL_LEARN_COUNT, MAX_WHAT_YOU_WILL_LEARN_CHAR_COUNT} from './constants';
import Question from './question.mobx-model.js';

export default class CourseGoalsStore {
    constructor(courseId) {
        this.courseId = courseId;
    }

    @observable dirty = false;
    @observable requirements = new Question();
    @observable whoShouldAttend = new Question();
    @observable whatYouWillLearn = new Question();
    @observable errors = {};

    @action
    initializeLists() {
        return udApi
            .get(`/courses/${this.courseId}/`, {
                params: {
                    'fields[course]':
                        'requirements_data,what_you_will_learn_data,who_should_attend_data',
                },
                timeout: TIMEOUT,
            })
            .then(
                action((response) => {
                    this.whatYouWillLearn.setMaxCharCount(MAX_WHAT_YOU_WILL_LEARN_CHAR_COUNT);
                    this.requirements.initializeAllAnswers(
                        response.data.requirements_data
                            ? response.data.requirements_data.items
                            : [],
                    );
                    this.whatYouWillLearn.initializeAllAnswers(
                        response.data.what_you_will_learn_data
                            ? response.data.what_you_will_learn_data.items
                            : [],
                    );
                    this.whoShouldAttend.initializeAllAnswers(
                        response.data.who_should_attend_data
                            ? response.data.who_should_attend_data.items
                            : [],
                    );
                    // Initialize this form with an extra empty item to start the user off to add
                    // new items easily to be more consistent with the legacy version of this form
                    this.requirements.pushEmptyAnswer();
                    this.whoShouldAttend.pushEmptyAnswer();
                    this.whatYouWillLearn.pushEmptyAnswer();
                    this.whatYouWillLearn.ensureMinAnswerCount(MIN_WHAT_YOU_WILL_LEARN_COUNT);
                }),
            );
    }

    @autobind
    @action
    saveLists() {
        this.dirty = false;
        if (!this.isValid) {
            showErrorToast(gettext('Your changes have not been saved. Please address the issues.'));
            return;
        }
        const requirements = [];
        this.requirements.answerList.forEach((e) =>
            String(e.value).trim() ? requirements.push(String(e.value).trim()) : null,
        );
        const who = [];
        this.whoShouldAttend.answerList.forEach((e) =>
            String(e.value).trim() ? who.push(String(e.value).trim()) : null,
        );
        const what = [];
        this.whatYouWillLearn.answerList.forEach((e) =>
            String(e.value).trim() ? what.push(String(e.value).trim()) : null,
        );
        const data = {
            requirements_data: {
                items: requirements,
            },
            what_you_will_learn_data: {
                items: what,
            },
            who_should_attend_data: {
                items: who,
            },
        };
        return udApi
            .patch(`/courses/${this.courseId}/?category=course-goals`, data)
            .then(
                action(() => {
                    this.errors = {};
                    showSuccessToast(gettext('Your changes have been successfully saved.'));
                }),
            )
            .catch(
                action((error) => {
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

    @action
    setDirty() {
        this.dirty = true;
    }

    @computed
    get isValid() {
        return (
            !this.requirements.hasValidationErrors &&
            !this.whoShouldAttend.hasValidationErrors &&
            !this.whatYouWillLearn.hasValidationErrors
        );
    }
}
