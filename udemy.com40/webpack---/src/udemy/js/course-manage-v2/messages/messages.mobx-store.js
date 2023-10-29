import {action, computed, observable} from 'mobx';

import {showReloadPageErrorToast, showSuccessToast} from 'instructor/toasts';
import getRequestData from 'utils/get-request-data';
import udApi, {defaultErrorMessage} from 'utils/ud-api';

const MESSAGE_TYPES = ['welcomeMessage', 'completionMessage'];

class Message {
    @observable text = '';
    @observable date = '';
    @observable isDirty = false;
    @observable isWarning = false;
    @observable.ref errors = [];

    constructor(type) {
        this.type = type;
    }
}

export default class MessagesStore {
    welcomeMessage = new Message('welcome');
    completionMessage = new Message('complete');

    constructor(courseId) {
        this.courseId = courseId;
    }

    @computed
    get saveEnabled() {
        return this.welcomeMessage.isDirty || this.completionMessage.isDirty;
    }

    @computed
    get isWarning() {
        return this.welcomeMessage.isWarning || this.completionMessage.isWarning;
    }

    @action
    updateMessageContent(type, content) {
        if (type === this.welcomeMessage.type) {
            this.welcomeMessage.text = content;
            this.welcomeMessage.isDirty = true;
        } else if (type === this.completionMessage.type) {
            this.completionMessage.text = content;
            this.completionMessage.isDirty = true;
        }
    }

    getMessages() {
        return udApi
            .get(`/courses/${this.courseId}/course-messages/`)
            .then(
                action((response) => {
                    MESSAGE_TYPES.forEach((msgType) => {
                        this.updateMessageFromResponse(response.data.results, this[msgType]);
                    });
                }),
            )
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            });
    }

    @action
    updateMessageFromResponse(messageResults, message) {
        const messageData = messageResults.filter((msg) => msg.message_type === message.type);
        if (messageData.length) {
            message.text = messageData[0].content;
            message.date = new Date(messageData[0].modified).toLocaleDateString(
                getRequestData().locale.replace('_', '-') || 'en-US',
                {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                },
            );
        }
    }

    @action
    saveMessages() {
        const data = [];

        MESSAGE_TYPES.forEach((msgType) => {
            if (this[msgType].isDirty) {
                const record = {message_type: this[msgType].type, content: this[msgType].text};
                if (this[msgType].isWarning) {
                    record.errors_only = true;
                }
                this[msgType].errors = [];
                this[msgType].date = '';
                this[msgType].isWarning = false;
                data.push(record);
            }
        });

        return udApi
            .post(`/courses/${this.courseId}/course-messages/`, data)
            .then(
                action(() => {
                    MESSAGE_TYPES.forEach((msgType) => {
                        this[msgType].isDirty = false;
                    });
                    showSuccessToast(gettext('Your changes have been successfully saved.'));
                }),
            )
            .catch((error) => {
                this.handleErrors(error.response);
            });
    }

    @action
    handleErrors(errorResponse) {
        if (errorResponse.status != 400) {
            showReloadPageErrorToast(defaultErrorMessage);
            return;
        }
        MESSAGE_TYPES.forEach((msgType) => {
            const status = errorResponse.data[this[msgType].type];
            this[msgType].isDirty = false;
            if (status && status.errors) {
                this[msgType].errors = status.errors.content;
                this[msgType].isWarning = !!status.isWarning;
                if (status.isWarning) {
                    // Allow the user to save after a warning is displayed.
                    this[msgType].isDirty = true;
                }
            }
        });
    }
}
