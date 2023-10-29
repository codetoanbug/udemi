import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

export default class PaginatedSurveyStore {
    constructor(surveyStore, onSubmit) {
        this.surveyStore = surveyStore;
        this.onSubmit = onSubmit;
    }

    @observable questionSetNumber = 0;

    @observable surveyComplete = false;

    @computed
    get pageNumber() {
        return this.questionSetNumber + 1;
    }

    get pageCount() {
        return this.surveyStore.questionSets.length;
    }

    @computed
    get canGoToNextPage() {
        return this.pageNumber < this.pageCount;
    }

    @computed
    get isCurrentPageAnswered() {
        if (!this.surveyStore.questionSets.length) {
            return false;
        }
        return this.surveyStore.questionSets[this.questionSetNumber].questions.reduce(
            (accumulator, question) => {
                if (!question.is_required) {
                    return accumulator;
                }
                return accumulator && this.surveyStore.userAnswers[question.id] !== null;
            },
            true,
        );
    }

    @action
    setQuestionSetNumber(pageNumber) {
        this.questionSetNumber = pageNumber - 1;
    }

    @autobind
    @action
    reset() {
        this.surveyStore.setUserAnswers({});
        this.setQuestionSetNumber(1);
        this.surveyComplete = false;
    }

    @autobind
    @action
    submit() {
        const savePromise = this.surveyStore.saveUserAnswers();
        this.surveyComplete = true;
        this.onSubmit(savePromise);
    }

    @autobind
    @action
    onPageChange(newPageNum) {
        if (newPageNum > this.pageNumber) {
            if (this.canGoToNextPage) {
                this.setQuestionSetNumber(newPageNum);
            } else {
                this.submit();
            }
        } else {
            this.setQuestionSetNumber(newPageNum);
        }
    }
}
