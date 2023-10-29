import {snakeCaseCopy} from '@udemy/shared-utils';
import autobind from 'autobind-decorator';
import {action, computed, extendObservable, observable} from 'mobx';

import {showErrorToast} from 'course-taking/toasts';
import {noop} from 'utils/noop';
import udMe from 'utils/ud-me';

import ReviewEditorStore from '../review-editor/review-editor.mobx-store';
import reviewBackend from './review-backend';

export const REVIEW_MODAL_CONTENT_TYPE = {
    CREATE_OR_EDIT: 'CREATE_OR_EDIT',
    DELETE: 'DELETE',
    EDIT_OR_DELETE: 'EDIT_OR_DELETE',
    SHARE: 'SHARE',
};

export default class LeaveRatingStore {
    @observable isModalOpen = false;
    @observable modalContentType = null;
    @observable isFocused = false;
    @observable.ref reviewEditorStore = null;
    @observable.ref socialShareStore = null;

    constructor(
        course,
        review,
        sourcePage,
        emptyReviewText,
        existingReviewText,
        hoverStateText = null,
        loadReview = false,
        autoOpen = false,
        backend = reviewBackend(),
        onSetReview = noop,
        onStartReviewCallback = noop,
        onFinishReviewCallback = noop,
        showInitiator = () => true,
        completedVideoContentLength = null,
    ) {
        extendObservable(this, {
            course,
            review,
            sourcePage,
            emptyReviewText,
            existingReviewText,
            hoverStateText,
            autoOpen,
            completedVideoContentLength,
        });
        this.backend = backend.forCourse(course.id);
        this.initReviewEditor(review);
        this.onSetReview = onSetReview;
        this.onStartReviewCallback = onStartReviewCallback;
        this.onFinishReviewCallback = onFinishReviewCallback;
        this.showInitiator = showInitiator;

        (loadReview || autoOpen) && this._loadReview();
    }

    _loadReview() {
        return this.backend.get({user: udMe.id}).then((response) => {
            this.setReview(response, true);
            if (this.autoOpen && this.review) {
                this.onStartReview();
            }
            return this.review;
        });
    }

    @autobind
    @action
    onStartReview() {
        if (this.review) {
            this.onShowEditModal();
        } else {
            this.onShowReviewEditor();
        }
        this.onStartReviewCallback(true);
    }

    @autobind
    @action
    initReviewEditor(review) {
        const extraLoggingData = {
            completed_video_length: this.completedVideoContentLength,
        };
        this.reviewEditorStore = new ReviewEditorStore(
            review ? review.id : null,
            review ? review.rating : null,
            review ? review.content : null,
            this.sourcePage,
            snakeCaseCopy(this.course),
            this.setReview,
            this.sourcePage,
            extraLoggingData,
        );
    }

    @computed
    get helperText() {
        if (this.review) {
            if (this.isFocused) {
                return this.hoverStateText || this.existingReviewText;
            }
            return this.existingReviewText;
        }
        return this.emptyReviewText;
    }

    @autobind
    @action
    setIsFocused(value) {
        this.isFocused = value;
    }

    @autobind
    @action
    setReview(review, initReviewEditor = false) {
        if (initReviewEditor) {
            this.initReviewEditor(review);
        }

        this.review = review;
        this.onSetReview(review);
    }

    @action
    _openModalWithContentType(contentType) {
        this.isModalOpen = true;
        this.modalContentType = contentType;
    }

    @autobind
    @action
    closeModalAndFinishReview() {
        this.closeModal();
        this.onFinishReviewCallback(this.review);
    }

    @autobind
    @action
    closeModal() {
        this.isModalOpen = false;
    }

    @autobind
    @action
    onShowShareModal(socialShareStore) {
        this.socialShareStore = socialShareStore;
        this.socialShareStore.getOrPopulateUrl();
        this._openModalWithContentType(REVIEW_MODAL_CONTENT_TYPE.SHARE);
    }

    @autobind
    onShowEditModal() {
        this._openModalWithContentType(REVIEW_MODAL_CONTENT_TYPE.EDIT_OR_DELETE);
    }

    @autobind
    onShowDeleteModal() {
        this._openModalWithContentType(REVIEW_MODAL_CONTENT_TYPE.DELETE);
    }

    @autobind
    onShowReviewEditor() {
        this._openModalWithContentType(REVIEW_MODAL_CONTENT_TYPE.CREATE_OR_EDIT);
    }

    @autobind
    @action
    onHideReviewEditor() {
        this.closeModalAndFinishReview();
        this.reviewEditorStore.publishEndEvent(false);
    }

    @autobind
    @action
    onDeleteReview() {
        this.closeModal();
        return this.backend
            .delete(this.review.id)
            .then(() => {
                this.setReview(null, true);
                return this.review;
            })
            .catch(() => {
                showErrorToast(
                    gettext('An error occurred while deleting your review. Please try again.'),
                );
            })
            .finally(this.closeModalAndFinishReview);
    }
}
