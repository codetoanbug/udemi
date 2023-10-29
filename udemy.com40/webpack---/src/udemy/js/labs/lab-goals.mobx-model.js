import {action, computed, observable} from 'mobx';

import Question from 'course-manage-v2/course-goals/question.mobx-model';

export default class LabGoals {
    @observable.ref lab = null;
    @observable whatYouWillDo = new Question();
    @observable whatYouWillLearn = new Question();
    @observable requirements = new Question();
    @observable isDirty = false;
    /** @type {LabReviewErrorData} errors */
    @observable errors = {};

    constructor(goals) {
        for (const key in goals) {
            this._setGoals(key, goals[key]);
        }
    }

    @computed
    get isValid() {
        return (
            !this.requirements.hasValidationErrors &&
            !this.whatYouWillDo.hasValidationErrors &&
            !this.whatYouWillLearn.hasValidationErrors
        );
    }

    _setGoals(key, data) {
        const items = data?.items || [];

        this[key].initializeAllAnswers(items);
        this._initializeEmptyAnswers(key, items);
    }

    @action
    setDirty(value = true) {
        this.isDirty = value;
    }

    prepareFormData() {
        return {
            requirements: this._generateGoalJson(this.requirements),
            what_you_will_learn: this._generateGoalJson(this.whatYouWillLearn),
            what_you_will_do: this._generateGoalJson(this.whatYouWillDo),
        };
    }

    _generateGoalJson(goalList) {
        const items = [];
        goalList.answerList.forEach((goal) =>
            String(goal.value).trim() ? items.push(String(goal.value).trim()) : null,
        );
        return {items};
    }

    _initializeEmptyAnswers(key, items) {
        if (items.length < 2) {
            this[key].pushEmptyAnswer();
        }
    }
}
