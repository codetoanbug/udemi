import autobind from 'autobind-decorator';
import {action, computed, observable, runInAction} from 'mobx';

import Raven from 'utils/ud-raven';

export default class FeaturedQuestionFormModalStore {
    @observable modalStatus = 'confirmation';
    @observable isSubmitting = false;

    constructor(featuredQuestionFormStore = null) {
        this.featuredQuestionFormStore = featuredQuestionFormStore;
    }

    @computed
    get showModal() {
        return this.featuredQuestionFormStore.showModal;
    }

    @autobind
    @action
    cancelModal() {
        if (this.modalStatus === 'confirmation') {
            this.featuredQuestionFormStore.toggleShowConfirmationModal();
        } else if (this.modalStatus === 'success') {
            this.featuredQuestionFormStore.openLectureInNewTab();
            this.featuredQuestionFormStore.toggleShowConfirmationModal();
            this.featuredQuestionFormStore.toggleShowCreateFeaturedQuestion();
        }
    }

    @autobind
    @action
    async confirmModal() {
        if (this.modalStatus === 'confirmation') {
            this.isSubmitting = true;
            try {
                await this.featuredQuestionFormStore.createFeaturedQuestion();
                runInAction(() => {
                    this.modalStatus = 'success';
                    this.isSubmitting = false;
                });
            } catch (error) {
                runInAction(() => {
                    this.modalStatus = 'failure';
                    this.isSubmitting = false;
                });
                Raven.captureException(error);
            }
        } else {
            this.featuredQuestionFormStore.toggleShowConfirmationModal();
            this.featuredQuestionFormStore.toggleShowCreateFeaturedQuestion();
        }
    }
}
