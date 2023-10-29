import {action, computed, observable} from 'mobx';

import {showReloadPageErrorToast} from 'course-taking/toasts';
import udApi, {defaultErrorMessage} from 'utils/ud-api';
import udMe from 'utils/ud-me';

import {OWNER_ANSWER_FIELD, PEER_QUESTION_TYPE, SELF_QUESTION_TYPE} from './constants';
import FeedbackModel from './feedback.mobx-model';

export default class SubmissionModel {
    @observable submissionTime;
    @observable isPrivate;
    @observable isComplete;
    @observable questions = [];
    @observable feedbacks = [];
    @observable selfFeedbacksAreLoaded = false;
    @observable peerFeedbacksAreLoaded = false;
    @observable questionsAreLoaded = false;
    @observable hasError = false;

    constructor(submissionApiData, practiceData) {
        this.id = submissionApiData.id;
        this.practiceId = practiceData.practiceId;
        this.user = submissionApiData.user;
        this.setQuestions(practiceData.questions, submissionApiData.question_user_answers);
        this.setObservablesFromAPIData(submissionApiData);
    }

    @action
    setObservablesFromAPIData(data) {
        this.submissionTime = data.submission_time;
        this.isPrivate = data.is_private;
        this.isComplete = data.is_complete;
        if (data[OWNER_ANSWER_FIELD]) {
            this.setPeerFeedbacksFromFeedbackQuestionUserAnswers(data[OWNER_ANSWER_FIELD]);
        }
    }

    @action
    setQuestions(questions, apiQuestionUserAnswers) {
        if (!apiQuestionUserAnswers) {
            this.questions = questions.map((question) => {
                if (!question.userAnswer || !question.userAnswer.body) {
                    return Object.assign({}, question, {userAnswer: {body: ''}});
                }
                return question;
            });
        } else {
            // "Save draft" feature lets you have multiple answers for the same question.
            // In this case we keep the most recent answer.
            const seenQuestions = {};
            apiQuestionUserAnswers.forEach((answer) => {
                const {practice_question: practiceQuestion, id, body} = answer;
                let question = {
                    id: practiceQuestion.id,
                    body: practiceQuestion.body,
                    userAnswer: {id, body},
                };
                if (!(question.id in seenQuestions)) {
                    this.questions.push(question);
                    // Get the observable version of the question.
                    question = this.questions[this.questions.length - 1];
                    seenQuestions[question.id] = question;
                }
                if (answer.id > seenQuestions[question.id].userAnswer.id) {
                    seenQuestions[question.id].userAnswer = question.userAnswer;
                }
            });
        }
    }

    @computed
    get peerFeedbacks() {
        if (!this.feedbacks.length) {
            return this.feedbacks;
        }
        return this.feedbacks.filter((feedback) => feedback.question.type === PEER_QUESTION_TYPE);
    }

    @computed
    get selfFeedbacks() {
        if (!this.feedbacks.length) {
            return this.feedbacks;
        }
        return this.feedbacks.filter((feedback) => feedback.question.type === SELF_QUESTION_TYPE);
    }

    @computed
    get hasAnswer() {
        return this.questions.some((question) => {
            return question.userAnswer.body;
        });
    }

    @computed
    get isSubmitted() {
        return !!this.submissionTime;
    }

    @computed
    get isEmpty() {
        if (!this.questions.length) {
            return true;
        }
        return this.questions.every(
            (question) =>
                !question.userAnswer ||
                !question.userAnswer.body ||
                question.userAnswer.body.replace(/(<([^>]+)>)|(&nbsp;)|\s/g, '').length === 0,
        );
    }

    @computed
    get isUserOwner() {
        return this.user.id === udMe.id;
    }

    @action
    getPracticeQuestionUserAnswers() {
        return udApi
            .get(`practices/${this.practiceId}/user-attempted-practices/${this.id}/user-answers/`, {
                params: {
                    'fields[practice_question_user_answer]': 'practice_question,body',
                },
            })
            .then(
                action((response) => {
                    response.data.results.forEach((result) => {
                        const idx = this.questions.findIndex(
                            (q) => q.id === result.practice_question.id,
                        );
                        if (idx !== -1) {
                            this.questions[idx].userAnswer = result;
                        }
                    });
                }),
            )
            .catch(() => {
                showReloadPageErrorToast(defaultErrorMessage);
            })
            .finally(
                action(() => {
                    this.questionsAreLoaded = true;
                }),
            );
    }

    @action
    _getFeedbackQuestionsOfType(type) {
        return udApi.get('practices/feedback-questions/', {params: {type}});
    }

    @action
    _getFeedbackQuestionAnswersOfType(type) {
        let params = {
            attempt_id_in: this.id,
            'fields[practice_feedback_question_user_answer]':
                'user,body,feedback_question,comment_thread,created',
            'fields[comment_thread]': 'latest_comment',
            'fields[user]': 'title,display_name,image_50x50,initials,name',
            'fields[practice_feedback_question]': 'id,type',
        };
        if (type !== SELF_QUESTION_TYPE) {
            params = Object.assign(params, {user_not_in: udMe.id});
        }
        return udApi.get(`/practices/${this.practiceId}/feedback-user-answers/`, {params});
    }

    @action
    setFeedbacks(feedbackQuestions, feedbackAnswers, type) {
        const feedbackQuestion = feedbackQuestions[0];
        if (feedbackAnswers.length === 0) {
            // The empty case is for evaluating other's feedback (.../give-feedback/ page).
            feedbackAnswers = [{feedback_question: feedbackQuestion}];
        }
        feedbackAnswers
            .filter((answer) => answer.feedback_question.id === feedbackQuestion.id)
            .forEach((feedbackAnswer) => {
                const data = {practiceId: this.practiceId, userAttemptedPracticeId: this.id};
                this.feedbacks.push(new FeedbackModel(feedbackQuestion, feedbackAnswer, data));
            });

        if (type === SELF_QUESTION_TYPE) {
            this.selfFeedbacksAreLoaded = true;
        } else {
            this.peerFeedbacksAreLoaded = true;
        }
    }

    @action
    getFeedbackOfType(type) {
        const feedbackQuestionPromise = this._getFeedbackQuestionsOfType(type);
        const feedbackQuestionAnswerPromise = this._getFeedbackQuestionAnswersOfType(type);
        return Promise.all([feedbackQuestionPromise, feedbackQuestionAnswerPromise]).then(
            action(([feedbackQuestionResponse, feedbackQuestionAnswerResponse]) => {
                const feedbackQuestions = feedbackQuestionResponse.data.results;
                const feedbackAnswers = feedbackQuestionAnswerResponse.data.results;
                // don't initialize empty answers for peer feedback on user submission
                if (!(type === PEER_QUESTION_TYPE && this.isUserOwner && !feedbackAnswers.length)) {
                    this.setFeedbacks(feedbackQuestions, feedbackAnswers, type);
                }
            }),
        );
    }

    @action
    setPeerFeedbacksFromFeedbackQuestionUserAnswers(apiData) {
        if (!apiData.length) {
            return this._getFeedbackQuestionsOfType(PEER_QUESTION_TYPE).then(
                action((response) => {
                    this.setFeedbacks(response.data.results, apiData);
                }),
            );
        }
        apiData.forEach((answer) => {
            const practiceData = {
                practiceId: this.practiceId,
                userAttemptedPracticeId: this.id,
            };
            this.feedbacks.push(new FeedbackModel(answer.feedback_question, answer, practiceData));
            this.peerFeedbacksAreLoaded = true;
        });
    }

    @action
    updateFeedbackCommentThread(apiData) {
        const relatedFeedbacks = this.feedbacks.filter(
            (feedback) => feedback.answer.id === apiData.id,
        );
        if (relatedFeedbacks.length) {
            return relatedFeedbacks[0].updateCommentThread(apiData.comment_thread);
        }
    }

    @action
    setAsComplete() {
        this.isComplete = true;
    }
}
