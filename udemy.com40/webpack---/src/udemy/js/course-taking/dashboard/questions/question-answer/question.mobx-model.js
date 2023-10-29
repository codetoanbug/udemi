import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import udApi from 'utils/ud-api';
import udMe from 'utils/ud-me';

import Lecture from '../../../curriculum/lecture.mobx-model';
import Practice from '../../../curriculum/practice.mobx-model';
import Quiz from '../../../curriculum/quiz.mobx-model';
import Answer from './answer.mobx-model';
import {REPLY_API_PARAMS} from './constants';
import {sanitizeUserGeneratedContent} from './helpers';
import UpvoteCTEventFactory, {ActionTypesEnum, ItemTypesEnum} from './tracking-events';
import User from './user.mobx-model';

export default class Question {
    @observable title;
    @observable body;
    @observable numAnswers;
    @observable isFollowing;
    @observable numUpvotes;
    @observable isUpvoted = false;
    @observable isEditing = false;
    @observable errorCode = null;
    @observable answersById = new Map();
    answerPageNum = 1;
    @observable isLoading = true;
    @observable hasFullyLoadedAnswers = false;
    isFeatured = false;

    constructor(apiData, courseId) {
        this.courseId = courseId;
        this.id = apiData.id || -1;
        this.created = apiData.created;
        this.numFollows = apiData.num_follows;
        this.numUpvotes = apiData.num_upvotes;
        this.isUpvoted = apiData.is_upvoted;
        this.isFeatured = apiData.is_featured;
        this.trackingId = apiData.tracking_id;

        const userData = apiData.user || {};
        // This data not available from the user serializer.
        userData.is_banned = apiData.is_banned_user;
        this.user = new User(userData);

        this.curriculumItem = null;
        if (apiData.related_object) {
            switch (apiData.related_object._class) {
                case 'lecture':
                    this.curriculumItem = new Lecture(apiData.related_object);
                    break;
                case 'quiz':
                    this.curriculumItem = new Quiz(apiData.related_object);
                    break;
                case 'practice':
                    this.curriculumItem = new Practice(apiData.related_object);
                    break;
                default:
                    throw new Error(
                        `Unknown curriculum item type '${apiData.related_object._class}'`,
                    );
            }
        }

        this.setObservablesFromAPIData(apiData);
    }

    @action
    setObservablesFromAPIData(apiData) {
        this.title = apiData.title || '';
        this.body = apiData.body || '';
        this.numAnswers = apiData.num_replies;
        this.isFollowing = apiData.is_following;
    }

    @action
    setTitle(value) {
        this.title = value;
    }

    @autobind
    @action
    setBody(value) {
        this.body = value;
    }

    @action
    loadAnswers() {
        if (this.hasFullyLoadedAnswers) {
            return Promise.resolve();
        }
        this.isLoading = true;
        return udApi
            .get(`/courses/${this.courseId}/discussions/${this.id}/replies/`, {
                params: {
                    ...REPLY_API_PARAMS,
                    page: this.answerPageNum,
                },
            })
            .then(
                action((response) => {
                    response.data.results.forEach((answerData) => {
                        if (!this.answersById.has(answerData.id)) {
                            this.answersById.set(answerData.id, new Answer(answerData));
                        }
                    });
                    this.isLoading = false;
                    this.hasFullyLoadedAnswers = !response.data.next;
                }),
            );
    }

    @autobind
    @action
    loadMore() {
        this.answerPageNum++;
        return this.loadAnswers();
    }

    saveAnswer(answer, ignoreWarnings = false) {
        if (answer.isNew) {
            return udApi
                .post(
                    `/courses/${this.courseId}/discussions/${this.id}/replies/`,
                    {
                        body: sanitizeUserGeneratedContent(answer.body),
                        ignore_warnings: ignoreWarnings,
                    },
                    {
                        params: REPLY_API_PARAMS,
                    },
                )
                .then(
                    action((response) => {
                        this.answersById.set(response.data.id, new Answer(response.data));
                        this.numAnswers += 1;
                    }),
                );
        }
        return udApi.patch(
            `/courses/${this.courseId}/discussions/${this.id}/replies/${answer.id}/`,
            {
                body: sanitizeUserGeneratedContent(answer.body),
                ignore_warnings: ignoreWarnings,
            },
        );
    }

    deleteAnswer(answer) {
        return udApi
            .delete(`/courses/${this.courseId}/discussions/${this.id}/replies/${answer.id}/`)
            .then(
                action(() => {
                    this.answersById.delete(answer.id);
                    this.numAnswers -= 1;
                }),
            );
    }

    @autobind
    toggleUpvoted() {
        if (this.isUpvoted) {
            return this.deleteUpvote();
        }
        return this.createUpvote();
    }

    deleteUpvote() {
        return udApi
            .delete(`/courses/${this.courseId}/discussions/${this.id}/upvoters/${udMe.id}/`)
            .then(
                action(() => {
                    this.publishEvent(ActionTypesEnum.REMOVEUPVOTE);
                    this.isUpvoted = !this.isUpvoted;
                    this.numUpvotes--;
                }),
            );
    }

    createUpvote() {
        return udApi.post(`/courses/${this.courseId}/discussions/${this.id}/upvoters/`).then(
            action(() => {
                this.publishEvent(ActionTypesEnum.GIVEUPVOTE);
                this.isUpvoted = !this.isUpvoted;
                this.numUpvotes++;
            }),
        );
    }

    @autobind
    publishEvent(action) {
        const event = UpvoteCTEventFactory.create(
            ItemTypesEnum.QUESTION,
            action,
            this.courseId,
            this.id,
        );
        event && Tracker.publishEvent(event);
    }

    get isNew() {
        return this.id === -1;
    }

    get isMine() {
        return this.user.id === udMe.id;
    }

    @computed
    get answers() {
        return Array.from(this.answersById.values());
    }
}
