import autobind from 'autobind-decorator';
import {action, extendObservable} from 'mobx';

import {showErrorToast} from 'instructor/toasts';
import udApi from 'utils/ud-api';

const ERROR_MESSAGE = gettext(
    'Error happened while saving your response. Please submit your response again.',
);

export default class Review {
    constructor(review) {
        extendObservable(this, {
            review,
            showResponseForm: false,
            response: null,
        });
        this.setResponseFromReview(review.response);
    }

    get responseApiUrl() {
        const baseUrl = `/courses/${this.review.course.id}/reviews/${this.review.id}/responses/`;
        return this.review.response ? `${baseUrl}${this.review.response.id}/` : baseUrl;
    }

    @autobind
    @action
    onToggleResponseForm() {
        this.showResponseForm = !this.showResponseForm;
    }

    @autobind
    @action
    onResponseSubmit() {
        const action = this.review.response ? udApi.patch : udApi.post;
        return action(this.responseApiUrl, {content: this.response})
            .then((res) => {
                this.setReviewResponse(res.data);
            })
            .catch(() => {
                showErrorToast(ERROR_MESSAGE);
            });
    }

    @autobind
    @action
    onDeleteResponse() {
        return udApi
            .delete(this.responseApiUrl)
            .then(() => {
                this.setReviewResponse(null);
            })
            .catch(() => {
                showErrorToast(ERROR_MESSAGE);
            });
    }

    @autobind
    @action
    setReviewResponse(response) {
        this.review.response = response;
        this.setResponseFromReview(response);
        this.onToggleResponseForm();
    }

    @autobind
    @action
    setResponseFromReview(reviewResponse) {
        this.response = reviewResponse ? reviewResponse.content : '';
    }

    @autobind
    @action
    onResponseChange(event) {
        this.response = event.target.value;
    }
}
