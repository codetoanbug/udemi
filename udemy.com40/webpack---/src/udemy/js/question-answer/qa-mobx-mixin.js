import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, observable, computed, reaction} from 'mobx';

import {ONE_PANE_MODE} from 'instructor/common/constants';
import ThreadedMobxMixin from 'instructor/common/thread-mobx-mixin';
import udApi from 'utils/ud-api';
import udMe from 'utils/ud-me';

import {sanitizeUserGeneratedContent} from '../course-taking/dashboard/questions/question-answer/helpers';
import UpvoteEventFactory, {TypesEnum, ItemTypesEnum, ActionTypesEnum} from './tracking-events';

export default class QaMobxMixin extends ThreadedMobxMixin {
    @observable.ref editingReply = null;
    @observable loadedInitialThreads = false;
    @observable noThreads = false;
    @observable totalThreadCount;

    constructor(API_SETTINGS, {baseUrl, instructorStore = null, twoPaneStore}) {
        super(API_SETTINGS, {baseUrl, twoPaneStore});
        this.instructorStore = instructorStore;
        reaction(
            () => this._selectedThreadId,
            action(() => {
                // Clear error message when changing threads.
                this.errorMessage = null;
                this.editingReply = null;
            }),
        );
    }

    @action
    init() {
        super.init();
        this.ordering = '-last_activity';
    }

    @action
    loadInitialThreads(onSuccess = null) {
        if (this.ready && !this.loadingNextPage) {
            return new Promise((resolve) => resolve(this._threads));
        }
        const qaApiUrl = this._searchQuery
            ? this.API_SETTINGS.searchableApiUrl
            : this.API_SETTINGS.apiUrl;
        return this._loadThreads(qaApiUrl, {
            total_count: 1,
            unread_count: 1,
            page: this.page,
            update_last_instructor_viewed_time: this.viewModeType === ONE_PANE_MODE,
        })
            .then(
                action((response) => {
                    if (response) {
                        this.noThreads = response.data.total_count === 0;
                    }
                    this.loadingNextPage = false;
                    onSuccess && onSuccess(response);

                    return response;
                }),
            )
            .finally(
                action(() => {
                    this.loadedInitialThreads = true;
                }),
            );
    }

    @action
    setThreadDetails(requestedThread, threadData, detailData) {
        requestedThread.responses = observable(detailData.results.map(this.makeObservableResponse));
        if (this.loadedInitialThreadDetails) {
            this.markAsRead(requestedThread);
        } else {
            this.loadedInitialThreadDetails = true;
        }
    }

    @action
    setThreadResponses(thread, responses) {
        thread.responses = responses.map(this.makeObservableResponse);
    }

    @action
    markAsRead(thread) {
        if (this.instructorStore && !thread.is_read) {
            this.instructorStore.decreaseUnreadQACount();
            if (thread.is_featured) {
                this.instructorStore.decreaseUnreadFeaturedQuestionsCount();
            }
        }
        return this._updateAttr(thread, 'is_read', true);
    }

    @action
    populateThreads(threads) {
        this._threads = this._threads.concat(
            threads
                .filter((thread) => !this._findThreadById(thread.id))
                .map((thread) => {
                    this._makeObservableThread(thread);
                    if (this.viewModeType === ONE_PANE_MODE) {
                        this.setThreadResponses(thread, thread.replies);
                    }
                    return thread;
                }),
        );
    }

    @autobind
    @action
    replyToThread(thread, body, onSuccess = null) {
        const lastMessage = thread.last_reply,
            now = new Date().toISOString(),
            newMessage = {
                class: '_course_discussion_reply',
                id: lastMessage ? lastMessage.id + 1 : 1,
                body,
                created: now,
                last_activity: now,
                user: udMe,
            };

        thread.responses.push(newMessage);
        thread.last_reply = newMessage;
        const lastMessageIndex = thread.responses.length - 1;
        // Warnings are generated from errors that can be overrided.  IgnoreWarnings means that
        // the backend should go ahead and post the message regardless.  We allow this if
        // either the user has dismissed the warning message in the past or the warning message
        // is shown currently. This does not affect non-dismissable errors such as linking to
        // affiliates like linksynergy.com.
        const ignoreWarnings = this.dismissedLinkMessage || !!this.errorMessage;
        this.errorMessage = null;

        return udApi
            .post(
                this.API_SETTINGS.apiDetailUrl(thread),
                {body: sanitizeUserGeneratedContent(body), ignore_warnings: ignoreWarnings},
                {params: this.API_SETTINGS.detailParams},
            )
            .then(
                action((response) => {
                    thread.last_reply = response.data;
                    thread.responses[lastMessageIndex] = thread.last_reply;
                    thread.num_replies++;
                    onSuccess && onSuccess(thread);
                    return thread.last_reply;
                }),
            )
            .catch(
                action((error) => {
                    thread.last_reply = lastMessage;
                    thread.responses.splice(lastMessageIndex, 1);
                    this._setErrorMessage(error.response);
                    throw error;
                }),
            );
    }

    @autobind
    @action
    updateReply(update) {
        const oldEditingReply = Object.assign({}, this.editingReply);
        const oldEditingReplyShallow = this.editingReply;
        const selectedThread = this.selectedThread;
        const ignoreWarnings = this.dismissedLinkMessage || !!this.errorMessage;
        Object.assign(this.editingReply, update);
        this.editingReply.last_activity = new Date().toISOString();
        Object.assign(update, {ignore_warnings: ignoreWarnings});
        this.errorMessage = null;
        this.editingReply = null;
        return udApi
            .patch(
                `${this.API_SETTINGS.apiDetailUrl(this.editingThread)}${oldEditingReply.id}/`,
                update,
            )
            .catch(
                action((error) => {
                    if (selectedThread === this.selectedThread) {
                        this.editingReply = oldEditingReplyShallow;
                    }
                    this._setErrorMessage(error.response);
                    Object.assign(oldEditingReplyShallow, oldEditingReply);
                }),
            );
    }

    @action
    clearErrorMessage() {
        this.errorMessage = null;
    }

    _setErrorMessage(apiResponse) {
        const body = apiResponse && apiResponse.data.body;
        if (body && body.length && body[0].messages && body[0].messages.length) {
            this.errorMessage = body[0];
        }
    }

    @action
    async toggleRead(thread) {
        const {QAStore, FQLStore} = this.instructorStore;
        const newValue = !thread.is_read;
        if (newValue) {
            this.instructorStore.decreaseUnreadQACount();
            if (thread.is_featured) {
                this.instructorStore.decreaseUnreadFeaturedQuestionsCount();
            }
        } else {
            this.instructorStore.increaseUnreadQACount();
            if (thread.is_featured) {
                this.instructorStore.increaseUnreadFeaturedQuestionsCount();
            }
        }
        QAStore._toggleRead(thread.id);
        FQLStore._toggleRead(thread.id);
        try {
            await this.updateThreadOnApi(thread, 'is_read', newValue);
        } catch {
            QAStore._toggleRead(thread.id);
            FQLStore._toggleRead(thread.id);
            if (newValue) {
                this.instructorStore.increaseUnreadQACount();
                if (thread.is_featured) {
                    this.instructorStore.increaseUnreadQACount();
                }
            } else {
                this.instructorStore.decreaseUnreadFeaturedQuestionsCount();
                if (thread.is_featured) {
                    this.instructorStore.decreaseUnreadFeaturedQuestionsCount();
                }
            }
        }
    }

    @action
    async deleteThread(thread) {
        const {QAStore, FQLStore} = this.instructorStore;
        const [qaThread, qaIndex] = QAStore._deleteThread(thread.id);
        const [featuredThread, featuredIndex] = FQLStore._deleteThread(thread.id);
        try {
            await QAStore.deleteThreadOnAPI(thread);
        } catch {
            QAStore._deleteThread(thread.id, qaThread, qaIndex);
            FQLStore._deleteThread(thread.id, featuredThread, featuredIndex);
        }
    }

    @action
    async toggleFeatured(thread) {
        const {QAStore, FQLStore} = this.instructorStore;
        const newValue = !thread.is_featured;
        if (!thread.is_read) {
            if (newValue) {
                this.instructorStore.increaseUnreadFeaturedQuestionsCount();
            } else {
                this.instructorStore.decreaseUnreadFeaturedQuestionsCount();
            }
        }
        QAStore._toggleFeatured(thread.id);
        const [removedThread, removedIndex] = FQLStore._toggleFeatured(thread.id);
        try {
            await this.updateThreadOnApi(thread, 'is_featured', newValue);
        } catch {
            QAStore._toggleFeatured(thread.id);
            FQLStore._toggleFeatured(thread.id, removedThread, removedIndex);
            if (!thread.is_read) {
                if (newValue) {
                    this.instructorStore.decreaseUnreadFeaturedQuestionsCount();
                } else {
                    this.instructorStore.increaseUnreadFeaturedQuestionsCount();
                }
            }
        }
    }

    @action
    toggleFollowing(thread) {
        if (!thread.is_following) {
            return this.follow(thread);
        }
        return this.unfollow(thread);
    }

    @action
    follow(thread) {
        if (thread.is_following) {
            return Promise.resolve(true);
        }
        thread.is_following = true;
        return udApi
            .post(this.API_SETTINGS.followersUrl(thread))
            .then(
                action(() => {
                    return true;
                }),
            )
            .catch(
                action(() => {
                    thread.is_following = false;
                    return false;
                }),
            );
    }

    @action
    unfollow(thread) {
        if (!thread.is_following) {
            return Promise.resolve(false);
        }
        thread.is_following = false;
        return udApi
            .delete(`${this.API_SETTINGS.followersUrl(thread)}${udMe.id}/`)
            .then(
                action(() => {
                    return false;
                }),
            )
            .catch(
                action(() => {
                    thread.is_following = true;
                    return true;
                }),
            );
    }

    @autobind
    @action
    markAsTopAnswer(thread, response, newValue = true, onSuccess = null) {
        const attrName = 'is_top_answer';
        const oldValue = response[attrName];

        let otherResponse, otherValue;
        thread.responses.forEach((r) => {
            if (r[attrName]) {
                otherResponse = r;
                otherValue = r[attrName];
                r[attrName] = false;
            }
        });

        response[attrName] = newValue;
        const params = {
            [attrName]: newValue,
        };
        return udApi
            .put(`${this.API_SETTINGS.apiDetailUrl(thread)}${response.id}/`, params)
            .then(
                action(() => {
                    onSuccess && onSuccess();
                    response[attrName] = newValue;
                    return newValue;
                }),
            )
            .catch(
                action(() => {
                    if (otherResponse) {
                        otherResponse[attrName] = otherValue;
                    }
                    response[attrName] = oldValue;
                    return oldValue;
                }),
            );
    }

    @autobind
    @action
    unmarkAsTopAnswer(thread, response) {
        this.markAsTopAnswer(thread, response, null);
        /*
        We pass null into markAsTopAnswer instead of false to prevent accidentally setting
        is_top_answer to false.  a duplicate key error happens if we use false since we set is_top_answer
        as a unique key
         */
    }

    @autobind
    @action
    deleteResponse(thread, response, onSuccess = null) {
        const arrIndex = thread.responses.findIndex((r) => r.id === response.id);
        thread.responses.remove(response);

        return udApi
            .delete(`${this.API_SETTINGS.apiDetailUrl(thread)}${response.id}/`)
            .then(
                action(() => {
                    thread.num_replies--;
                    onSuccess && onSuccess();
                    return response;
                }),
            )
            .catch(
                action(() => {
                    thread.responses.splice(arrIndex, 0, response);
                    return response;
                }),
            );
    }

    @action
    _deleteThread(threadId, removedThread = null, removedIndex = null) {
        if (removedThread && removedIndex) {
            this._threads.splice(removedIndex, 0, removedThread);
            return [null, null];
        }

        const arrIndex = this._threads.findIndex((t) => t.id === threadId);
        if (arrIndex !== -1) {
            const thread = this._threads[arrIndex];
            this._threads.splice(arrIndex, 1);
            return [thread, arrIndex];
        }
        return [null, null];
    }

    makeObservableThread(thread) {
        thread.responses = [];
    }

    makeObservableResponse(response) {
        response.is_top_answer = !!response.is_top_answer;
        return response;
    }

    applyFilters() {
        const params = super.applyFilters();
        Object.assign(params, this.filters);
        return params;
    }

    selectThread(thread) {
        if (!thread.course) {
            return udApi
                .get(`courses/discussions/${thread.id}/`, {
                    params: {
                        'fields[course_discussion]': 'course',
                        'fields[course]': 'id',
                    },
                })
                .then((response) => {
                    thread.course = response.data.course;
                    return super.selectThread(thread);
                });
        }
        return super.selectThread(thread);
    }

    @autobind
    @action
    questionUpvote(thread) {
        if (thread.is_upvoted) {
            return this.deleteUpvote(thread);
        }
        return this.createUpvote(thread);
    }

    deleteUpvote(thread) {
        return udApi
            .delete(`/courses/${thread.course.id}/discussions/${thread.id}/upvoters/${udMe.id}/`)
            .then(
                action(() => {
                    this.publishEvent(thread, ActionTypesEnum.REMOVEUPVOTE);
                    thread.is_upvoted = !thread.is_upvoted;
                    thread.num_upvotes--;
                }),
            );
    }

    createUpvote(thread) {
        return udApi.post(`/courses/${thread.course.id}/discussions/${thread.id}/upvoters/`).then(
            action(() => {
                this.publishEvent(thread, ActionTypesEnum.GIVEUPVOTE);
                thread.is_upvoted = !thread.is_upvoted;
                thread.num_upvotes++;
            }),
        );
    }

    _loadThreads(
        apiUrl = this._searchQuery ? this.API_SETTINGS.searchableApiUrl : this.API_SETTINGS.apiUrl,
        extraParams = {
            page: this.page,
            update_last_instructor_viewed_time: this.viewModeType === ONE_PANE_MODE,
        },
    ) {
        return super._loadThreads(apiUrl, extraParams).then(
            action((response) => {
                if (response) {
                    this.totalThreadCount = response.data.total_filtered_count;
                    this.loadingNextPage = false;
                }
                return response;
            }),
        );
    }

    @computed
    get type() {
        let type = null;
        switch (this.baseUrl.toLowerCase()) {
            case '/communication/qa':
                type = TypesEnum.QA;
                break;
            case '/communication/featured_questions':
                type = TypesEnum.FQ;
                break;
            default:
                break;
        }
        return type;
    }

    @autobind
    publishEvent(thread, action) {
        const event = UpvoteEventFactory.create(
            this.type,
            ItemTypesEnum.QUESTION,
            action,
            thread.course.id,
            thread.id,
        );
        event && Tracker.publishEvent(event);
    }
}
