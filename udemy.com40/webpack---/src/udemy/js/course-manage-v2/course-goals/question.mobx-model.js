import {getUniqueId} from '@udemy/design-system-utils';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import applyValidators, {validateExcludeExternalURL} from 'utils/form-validators';

export default class Question {
    @observable answerList = [];
    @observable maxCharCount = 0;

    @autobind
    @action
    pushEmptyAnswer() {
        const lastElement = this.answerList[this.answerList.length - 1];
        if (lastElement && lastElement.value.trim() === '') {
            return false;
        }
        const key = getUniqueId('answer-list');
        this.answerList.push({key, value: '', validationState: null, validationError: null});
        return key;
    }

    @autobind
    @action
    ensureMinAnswerCount(count) {
        while (this.answerList.length < count) {
            const key = getUniqueId('answer-list');
            this.answerList.push({key, value: '', validationState: null, validationError: null});
        }
    }

    @autobind
    @action
    setMaxCharCount(count) {
        this.maxCharCount = count;
    }

    @autobind
    @action
    getNextAnswerOrCreate(key) {
        const indexCurrent = this.answerList.findIndex((answer) => answer.key === key);
        if (indexCurrent < this.answerList.length - 1) {
            return this.answerList[indexCurrent + 1].key;
        }
        return this.pushEmptyAnswer();
    }

    @action
    deleteAnswer(key) {
        this.answerList = this.answerList.filter((answer) => answer.key !== key);
    }

    @action
    updateAnswer(key, value) {
        const answer = this.answerList.find((answer) => answer.key === key);
        answer.value = value;
        this.validateAnswer(answer);
    }

    validateAnswer(answer) {
        const item = {text: answer.value};
        const validationOutcome = applyValidators([validateExcludeExternalURL], item);
        if (validationOutcome === 'error') {
            answer.validationState = validationOutcome;
            answer.validationError = gettext('External links are not allowed here.');
        } else if (this.maxCharCount > 0 && answer.value.length > this.maxCharCount) {
            answer.validationState = 'error';
            answer.validationError = interpolate(
                gettext("Learning objectives can't be longer than %s characters"),
                [this.maxCharCount],
            );
        } else {
            answer.validationState = null;
            answer.validationError = null;
        }
    }

    @action
    initializeAllAnswers(newList) {
        const newAnswerList = [];
        newList.forEach((x) => {
            const answer = {key: getUniqueId('answer-list'), value: x, validationState: null};
            this.validateAnswer(answer);
            newAnswerList.push(answer);
        });
        this.answerList = newAnswerList;
    }

    @action
    updateAllAnswers(newList) {
        newList.forEach((x) => {
            this.validateAnswer(x);
        });
        this.answerList = newList;
    }

    @computed
    get hasValidationErrors() {
        return (
            !!this.answerList &&
            this.answerList.filter((x) => x.validationState === 'error').length > 0
        );
    }

    @computed
    get nonEmptyAnswerCount() {
        return this.answerList.filter((x) => x.validationState !== 'error' && x.value !== '')
            .length;
    }

    @computed
    get answerCount() {
        return this.answerList.filter((x) => x.validationState !== 'error').length;
    }
}
