import {action, computed, observable} from 'mobx';

import udApi from 'utils/ud-api';
import {generateUpow} from 'utils/upow';

export default class ShareEmailStore {
    constructor(shareableObject, shareUrl, sourcePage) {
        this.shareableObject = shareableObject;
        this.shareUrl = shareUrl;
        this.sourcePage = sourcePage;
    }

    @observable recipientEmails = [];
    @observable message = '';
    @observable error = '';
    @observable loading = false;
    @observable sent = false;

    @action
    clean() {
        this.error = '';
        this.loading = false;
        this.message = '';
        this.recipientEmails = [];
    }

    @computed
    get formData() {
        return {
            shareable_object_id: this.shareableObject.id,
            message: this.message,
            recipient_emails: this.recipientEmails,
            share_url: this.shareUrl,
            source: this.sourcePage,
            type: this.shareableObject.type,
        };
    }

    updateEmailsInput(target) {
        this.recipientEmails = target.value.split(',').map((value) => value.trim());
    }

    updateMessageInput(target) {
        this.message = target.value.trim();
    }

    getEmailValidationState() {
        if (
            0 <= this.recipientEmails.length &&
            this.recipientEmails.length < 6 &&
            this.recipientEmails.every((e) =>
                e.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
            )
        ) {
            return null;
        }

        return 'error';
    }

    @computed
    get isFormValid() {
        return this.recipientEmails.length && this.getEmailValidationState() === null;
    }

    @computed
    get emailApiUrl() {
        return `share/email/${this.shareableObject.type}/`;
    }

    @action
    onSubmit(onSuccess) {
        if (!this.isFormValid) {
            return;
        }

        this.loading = true;

        return generateUpow('share-email', this.recipientEmails.join(','), '').then((upow) => {
            return udApi
                .post(this.emailApiUrl, Object.assign({}, this.formData, {upow}))
                .then(
                    action(() => {
                        this.sent = true;
                        this.clean();
                        onSuccess && onSuccess();
                    }),
                )
                .catch(
                    action((error) => {
                        this.clean();
                        this.error =
                            error.response.data.error.recipient_emails ||
                            gettext('This message was not sent due to a server error');
                    }),
                );
        });
    }
}
