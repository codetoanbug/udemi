import autobind from 'autobind-decorator';
import {action, computed, set, observable} from 'mobx';

import udApi from 'utils/ud-api';
import udMe from 'utils/ud-me';

import {SELF_QUESTION_TYPE} from './constants';

export default class FeedbackModel {
    @observable answer = {};
    @observable errors;

    constructor(question, answer, data) {
        this.practiceId = data.practiceId;
        this.userAttemptedPracticeId = data.userAttemptedPracticeId;
        this.question = question;
        this.setAnswerData(answer);
    }

    @action
    setAnswerData(answerData) {
        const {id, body, created, comment_thread: commentThread} = answerData;
        const user = answerData.user || udMe;
        set(this.answer, {id, body, created, commentThread, user});
    }

    @computed
    get placeholderText() {
        return this.question.type === SELF_QUESTION_TYPE
            ? gettext('I learned...')
            : gettext('Add feedback...');
    }

    @computed
    get userCanEdit() {
        return this.answer && this.answer.user.id === udMe.id;
    }

    @computed
    get isSubmitted() {
        return this.answer && !!this.answer.id;
    }

    @computed
    get commentUrl() {
        if (!this.answer) {
            return null;
        }
        return `/practices/${this.practiceId}/user-attempted-practices/${this.userAttemptedPracticeId}/feedback-user-answers/${this.answer.id}/comments/`;
    }

    @autobind
    @action
    updateAnswerValue(val) {
        this.errors = undefined;
        this.answer.body = val;
    }

    @autobind
    @action
    saveAnswer(onSaveCallback, onErrorCallback) {
        let savePromise;

        if (this.answer.id) {
            savePromise = udApi.patch(
                `/practices/${this.practiceId}/feedback-user-answers/${this.answer.id}/`,
                {body: this.answer.body},
            );
        } else {
            const data = [
                {
                    body:
                        this.answer.body === '' ||
                        this.answer.body.replace(/(<([^>]+)>)|(&nbsp;)|\s/g, '').length === 0
                            ? null
                            : this.answer.body,
                    feedback_question: this.question.id,
                    user_attempted_practice: this.userAttemptedPracticeId,
                },
            ];
            savePromise = udApi
                .post(`/practices/${this.practiceId}/feedback-user-answers/`, data, {
                    params: {
                        feedback_question: this.question.id,
                        user: udMe.id,
                    },
                })
                .then(
                    action((response) => {
                        this.answer.id = response.data.results[0].id;
                    }),
                );
        }

        return savePromise
            .then(() => {
                onSaveCallback();
            })
            .catch(
                action((errorResponse) => {
                    const errors = errorResponse.response.data.results || [];
                    this.errors = errors.map((error) => error.body || '').join(' ');
                    if (onErrorCallback !== null) {
                        onErrorCallback(this.errors);
                    }
                }),
            );
    }

    @autobind
    @action
    deleteAnswer() {
        return udApi
            .delete(`/practices/${this.practiceId}/feedback-user-answers/${this.answer.id}/`)
            .then(
                action(() => {
                    this.setAnswerData({});
                }),
            );
    }

    @autobind
    @action
    updateCommentThread(commentThread) {
        this.answer.commentThread = commentThread;
    }
}
