import {ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import {defaultErrorMessage} from 'utils/ud-api';

export default class CommentModel {
    @observable content;
    @observable isSubmitting = false;
    @observable isDeleting = false;

    constructor(commentsStore, apiData, {gettext}) {
        this.commentsStore = commentsStore;

        this.id = apiData.id;
        this.created = apiData.created;
        this.user = apiData.user;
        this.gettext = gettext;
        this.setObservablesFromAPIData(apiData);
    }

    @action
    setObservablesFromAPIData(apiData) {
        this.content = apiData.content;
    }

    @action
    setContent(content) {
        this.content = content;
    }

    @action
    save() {
        if (this.isSubmitting) {
            return Promise.reject('Cannot save right now.');
        }

        if (
            !this.content ||
            !this.content.trim() ||
            this.content.replace(/(<([^>]+)>)|(&nbsp;)|\s/g, '').length === 0
        ) {
            this._showCommentErrorToast();
            return Promise.reject('Cannot save an empty comment.');
        }

        this.isSubmitting = true;
        this.content = this.content.trim();

        const data = {content: this.content};
        if (this.cannedCommentId) {
            data.canned_comments = [this.cannedCommentId];
        }

        let savePromise;
        if (this.id) {
            savePromise = this.commentsStore.updateComment(this.id, data);
        } else {
            savePromise = this.commentsStore.createComment(data);
        }

        return savePromise.catch(this._showReloadPageErrorToast).finally(
            action(() => {
                this.isSubmitting = false;
            }),
        );
    }

    @autobind
    @action
    delete() {
        if (this.isDeleting) {
            return Promise.reject('Cannot delete right now.');
        }

        this.isDeleting = true;
        return this.commentsStore
            .deleteComment(this.id)
            .catch(this._showReloadPageErrorToast)
            .finally(
                action(() => {
                    this.isDeleting = false;
                }),
            );
    }

    @autobind
    _showReloadPageErrorToast() {
        const bannerProps = {
            udStyle: 'error',
            title: defaultErrorMessage,
            ctaText: this.gettext('Reload page'),
            onAction: () => window.location.reload(),
        };
        toasterStore.addAlertBannerToast(bannerProps, {autoDismiss: true});
    }

    @autobind
    _showCommentErrorToast() {
        const bannerProps = {
            udStyle: 'error',
            title: this.gettext('Cannot save empty comment'),
            ctaText: this.gettext('Dismiss'),
            dismissButtonProps: false,
        };
        toasterStore.addAlertBannerToast(bannerProps, {autoDismiss: true});
    }
}
